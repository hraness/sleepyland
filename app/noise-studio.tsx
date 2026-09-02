"use client";

import {
  Button,
  DialogTrigger,
  Fader,
  IconButton,
  Modal,
  Pressable,
  SegmentedControl,
  type SegmentedItem,
  ViewportFrame,
  WrappingRow,
} from "@/lib/ui";
import {
  capturePostHogEvent,
  capturePostHogException,
} from "@hraness/posthog/client";
import Link from "next/link";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SoundEngine } from "./audio-engine";
import { sleepylandPostHogSite } from "./analytics";
import { EditorialImageThumbnail } from "./editorial-image";
import type { EditorialImage } from "./editorial-images";
import {
  NOISE_OPTIONS,
  clampControl,
  frequencyAtPosition,
  noiseShapeDb,
  positionAtFrequency,
  spectrumGestureAtPosition,
  type NoiseType,
  type SpectrumGesturePoint,
} from "./noise";
import {
  canStopPlayback,
  PlaybackStartFence,
  type PlaybackStatus,
} from "./playback";
import {
  advanceSessionProgress,
  availableSessionPlanOptions,
  createSessionProgress,
  defaultSessionPlanFor,
  SESSION_PROGRESS_TICK_INTERVAL_MS,
  sessionPlanKey,
  sessionProgressLabel,
  type SessionPlan,
  type SessionProgress,
} from "./session-plans";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  settingsRecord,
} from "./settings";
import {
  ENERGY_LEVELS,
  SOUND_MODES,
  recipeMatchesSoundProfile,
  resolveSoundProfile,
  soundModeDefinition,
  type EnergyLevelId,
  type SoundModeId,
} from "./sound-modes";
import {
  wavePaceAtPeriod,
  wavePeriodSeconds,
} from "./waves";
import { repositoryUrl, researchContributionUrl } from "./site";

type Brand = Readonly<{
  domain: string;
  tagline: string;
}>;

export type StudioResource = Readonly<{
  description: string;
  image?: EditorialImage;
  path: string;
  title: string;
}>;

export type StudioResourceGroup = Readonly<{
  allPath: string;
  label: string;
  resources: readonly StudioResource[];
}>;

const MINIMUM_FREQUENCY = 40;
const MAXIMUM_DISPLAY_FREQUENCY = 20_000;
const GRID_FREQUENCIES = [100, 1_000, 10_000] as const;
const GRID_DECIBELS = [-84, -60, -36] as const;
const NOISE_SEGMENTS = NOISE_OPTIONS.map((option) => ({
  id: option.type,
  label: option.label,
})) satisfies readonly SegmentedItem<NoiseType>[];
const ENERGY_SEGMENTS = ENERGY_LEVELS.map((energy) => ({
  id: energy.id,
  label: energy.label,
})) satisfies readonly SegmentedItem<EnergyLevelId>[];
const SPECTROGRAM_COLORS = Array.from({ length: 96 }, (_, index) => {
  const intensity = Math.pow(index / 95, 1.55);
  const red = Math.round(8 + intensity * 222);
  const green = Math.round(6 + intensity * 164);
  const blue = Math.round(4 + intensity * 97);
  return `rgb(${red} ${green} ${blue})`;
});

function decibelsToY(decibels: number, height: number): number {
  const normalized = Math.min(Math.max((decibels + 96) / 78, 0), 1);
  return height - normalized * height;
}

function formatFrequency(frequency: number): string {
  return frequency >= 1_000 ? `${frequency / 1_000}k` : String(frequency);
}

function toneLabel(value: number): string {
  if (value < 34) return "Dark";
  if (value > 67) return "Bright";
  return "Balanced";
}

function completionLabel(
  durationMilliseconds: number,
  soundMode: SoundModeId,
): string {
  const minutes = Math.max(1, Math.round(durationMilliseconds / 60_000));
  const mode = soundModeDefinition(soundMode).label;
  return `${minutes} min · ${mode}`;
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" data-icon="play" viewBox="0 0 20 20">
      <path d="M6.5 4.4v11.2L15.5 10 6.5 4.4Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg aria-hidden="true" data-icon="stop" viewBox="0 0 20 20">
      <rect height="10" rx="1.5" width="10" x="5" y="5" />
    </svg>
  );
}

export function TransportControls({
  onPlay,
  onStop,
  buttonRef = null,
  status,
}: Readonly<{
  onPlay: () => void;
  onStop: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
  status: PlaybackStatus;
}>) {
  const canStop = canStopPlayback(status);
  const label = canStop ? "Stop sound" : "Play sound";

  return (
    <div
      aria-busy={status === "starting" ? "true" : undefined}
      className="transport-controls"
    >
      <IconButton
        aria-busy={status === "starting" ? "true" : undefined}
        aria-label={label}
        buttonRef={buttonRef}
        className="transport-button"
        controlClassName="transport-button__control"
        data-status={status}
        onPress={canStop ? onStop : onPlay}
        size="transport"
        tooltip={label}
        variant="primary"
      >
        {canStop ? <StopIcon /> : <PlayIcon />}
      </IconButton>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 10.5v5M12 7.5h.01" />
    </svg>
  );
}

export function NoiseInfo() {
  return (
    <DialogTrigger>
      <IconButton
        aria-label="How Sleepyland works"
        className="info-button"
        controlClassName="info-button__control"
        size="compact"
        tooltip="How Sleepyland works"
      >
        <InfoIcon />
      </IconButton>
      <Modal
        className="noise-info-modal"
        description="Choose an outcome, then shape the generated sound as much or as little as you want."
        size="medium"
        surfaceClassName="noise-info-modal__surface"
        title="Built as a sound instrument"
      >
        <div className="noise-info">
          <p className="noise-info__lead">
            Sleep, Relax, and Focus are three authored functional soundscapes, not one noise loop under different labels. Each changes spectrum, source balance, rhythm, and movement while every layer is generated locally in your browser.
          </p>
          <div className="noise-info__features">
            <section>
              <h3>
                Three states, three sound systems
              </h3>
              <p>
                Sleep combines a dark brown bed with slow surf. Relax opens into a softer pink field with broad spatial movement. Focus removes surf and uses a clearer pink field with steady, low-salience rhythmic movement.
              </p>
            </section>
            <section>
              <h3>
                Generated, not looped
              </h3>
              <p>
                Brown, pink, and white noise use distinct spectral slopes. Procedural surf combines changing swell groups, surge, cavity impact, foam, wash, and undertow without a repeating recording.
              </p>
            </section>
            <section>
              <h3>
                Movement without a loudness trick
              </h3>
              <p>
                Gentle, Balanced, and Strong adjust rhythmic depth and pace inside the selected soundscape. Energy never changes the master volume, so stronger does not secretly mean louder.
              </p>
            </section>
            <section>
              <h3>
                Sessions with an ending
              </h3>
              <p>
                Choose endless play, a countdown, or Focus intervals. Work and break phases advance from wall time, breaks soften gradually, and completed sessions finish with a quiet fade.
              </p>
            </section>
            <section>
              <h3>
                The output stays visible
              </h3>
              <p>
                The rolling spectrogram reads the final limited mix you hear. Touch it to play a pulse centered on that frequency, or hold and move to shape a continuous filtered-noise voice.
              </p>
            </section>
            <section>
              <h3>Local sound and bounded analytics</h3>
              <p>
                Your state, Energy, session, and tuning are stored in this
                browser. There are no accounts, ads, session replay, cloud audio,
                or microphone permissions. On the canonical production site,
                anonymous, cookieless events can include the selected state and
                session kind; they do not include Energy, tuning, exact playback
                duration, or audio.
              </p>
            </section>
            <section>
              <h3>Open source and open to correction</h3>
              <p>
                The sound engine, interface, tests, and research publication are
                public under the MIT License. Code improvements, stronger sources,
                and carefully scoped research contributions are welcome on GitHub.
              </p>
            </section>
          </div>
          <p className="noise-info__note">
            Start quietly, especially with headphones, and set the mix that
            feels most comfortable to you.
          </p>
          <nav aria-label="Product information" className="noise-info__links">
            <Link href="/about">About</Link>
            <Link href="/">Research</Link>
            <Link href="/demo">Demo</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/support">Support</Link>
            <Link href="/accessibility">Accessibility</Link>
            <a href={researchContributionUrl}>Contribute</a>
            <a href={repositoryUrl}>GitHub</a>
          </nav>
        </div>
      </Modal>
    </DialogTrigger>
  );
}

export function StudioResources({
  groups,
}: Readonly<{ groups: readonly StudioResourceGroup[] }>) {
  return (
    <DialogTrigger>
      <Button
        aria-label="Explore Sleepyland resources"
        className="header-resources-button"
        controlClassName="header-resources-button__control"
        size="compact"
        variant="quiet"
      >
        Library
      </Button>
      <Modal
        className="studio-resources-modal"
        description="Evidence-led guides to sleep, sound, light, and routines."
        size="large"
        surfaceClassName="studio-resources-modal__surface"
        title="Sleepyland library"
      >
        <div className="studio-resources">
          {groups.map((group) => (
            <section className="studio-resources__group" key={group.label}>
              <header>
                <h3>{group.label}</h3>
                <Link href={group.allPath}>View all</Link>
              </header>
              <div className="studio-resources__grid">
                {group.resources.map((resource) => (
                  <article
                    className={`studio-resource${resource.image === undefined ? " studio-resource--without-image" : ""}`}
                    key={resource.path}
                  >
                    {resource.image === undefined ? null : (
                      <Link className="studio-resource__image" href={resource.path}>
                        <EditorialImageThumbnail
                          image={resource.image}
                          sizes="(max-width: 46rem) calc(100vw - 3rem), 14rem"
                        />
                      </Link>
                    )}
                    <div>
                      <h4><Link href={resource.path}>{resource.title}</Link></h4>
                      <p>{resource.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Modal>
    </DialogTrigger>
  );
}

function WarmthIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="8" cy="16" r="2" />
    </svg>
  );
}

function VolumeIcon({ muted }: Readonly<{ muted: boolean }>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 10v4h3l4 3V7l-4 3H5Z" />
      {muted ? <path d="m16 10 4 4M20 10l-4 4" /> : <path d="M16 9c1.5 1.5 1.5 4.5 0 6M19 6c3.2 3.2 3.2 8.8 0 12" />}
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3 10c2.2 0 2.2-2 4.5-2s2.2 2 4.5 2 2.2-2 4.5-2 2.2 2 4.5 2M3 16c2.2 0 2.2-2 4.5-2s2.2 2 4.5 2 2.2-2 4.5-2 2.2 2 4.5 2" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="13" r="7" />
      <path d="M12 10v4l2.5 1.5M9 3h6" />
    </svg>
  );
}

function TuneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </svg>
  );
}

function SoundModeIcon({ id }: Readonly<{ id: SoundModeId }>) {
  if (id === "sleep") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M19 15.5A7.5 7.5 0 0 1 8.5 5 7.5 7.5 0 1 0 19 15.5Z" />
      </svg>
    );
  }
  if (id === "calm") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 9c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2M4 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function SoundModePicker({
  customized,
  onSelect,
  value,
}: Readonly<{
  customized: boolean;
  onSelect: (id: SoundModeId) => void;
  value: SoundModeId;
}>) {
  return (
    <fieldset className="sound-mode-picker">
      <legend>Sound mode</legend>
      <div className="sound-mode-picker__surface">
        {SOUND_MODES.map((mode) => {
          const selected = mode.id === value;
          return (
            <Pressable
              aria-label={
                `${mode.label}, ${
                  selected && customized
                    ? "custom"
                    : mode.detail.toLowerCase()
                }`
              }
              aria-pressed={selected}
              className="sound-mode-button"
              data-customized={selected && customized ? true : undefined}
              data-selected={selected || undefined}
              key={mode.id}
              onPress={() => onSelect(mode.id)}
            >
              <span className="sound-mode-button__icon">
                <SoundModeIcon id={mode.id} />
              </span>
              <span className="sound-mode-button__copy">
                <strong>{mode.label}</strong>
                <small>{selected && customized ? "Custom" : mode.detail}</small>
              </span>
            </Pressable>
          );
        })}
      </div>
    </fieldset>
  );
}

export function EnergyPicker({
  onSelect,
  value,
}: Readonly<{
  onSelect: (id: EnergyLevelId) => void;
  value: EnergyLevelId;
}>) {
  return (
    <fieldset className="energy-picker">
      <legend>Energy</legend>
      <SegmentedControl
        aria-label="Sound energy"
        className="energy-picker__options"
        items={ENERGY_SEGMENTS}
        onChange={onSelect}
        surfaceClassName="energy-picker__surface"
        value={value}
      />
    </fieldset>
  );
}

export function SessionPlanControl({
  onSelect,
  plan,
  progress,
  soundMode,
}: Readonly<{
  onSelect: (plan: SessionPlan) => void;
  plan: SessionPlan;
  progress: SessionProgress;
  soundMode: SoundModeId;
}>) {
  const value = sessionProgressLabel(progress);
  const selectedKey = sessionPlanKey(plan);
  const options = availableSessionPlanOptions(soundMode);

  return (
    <DialogTrigger>
      <Button
        aria-label={`Session: ${value}. Choose a session plan.`}
        className="timer-button"
        controlClassName="timer-button__control"
        data-active={plan.kind !== "endless"}
        size="large"
        variant="quiet"
      >
        <TimerIcon />
        <span>{value}</span>
      </Button>
      <Modal
        className="session-plan-modal"
        description={
          soundMode === "focus"
            ? "Choose continuous sound, a countdown, or structured work and break blocks."
            : "Choose continuous sound or a countdown with a gradual finish."
        }
        size="small"
        surfaceClassName="session-plan-modal__surface"
        title="Session"
      >
        {({ close }) => (
          <div className="session-plan-options">
            {options.map((option) => {
              const selected = option.id === selectedKey;
              return (
                <Pressable
                  aria-pressed={selected}
                  className="session-plan-option"
                  data-selected={selected || undefined}
                  key={option.id}
                  onPress={() => {
                    onSelect(option.plan);
                    close();
                  }}
                >
                  <strong>{option.label}</strong>
                  <span>{option.detail}</span>
                </Pressable>
              );
            })}
          </div>
        )}
      </Modal>
    </DialogTrigger>
  );
}

export function Spectrogram({
  analyser,
  noiseType,
  onGestureEnd,
  onGestureMove,
  onGestureStart,
  tone,
}: Readonly<{
  analyser: AnalyserNode | null;
  noiseType: NoiseType;
  onGestureEnd: (pointerId: number) => void;
  onGestureMove: (pointerId: number, point: SpectrumGesturePoint) => void;
  onGestureStart: (pointerId: number, point: SpectrumGesturePoint) => void;
  tone: number;
}>) {
  const historyRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const pointerVisualRef = useRef({
    active: false,
    normalizedX: 0.5,
    normalizedY: 0.5,
    visible: false,
  });
  const [interactionActive, setInteractionActive] = useState(false);

  const gesturePoint = (
    clientX: number,
    clientY: number,
  ): SpectrumGesturePoint | null => {
    const canvas = overlayRef.current;
    if (canvas === null) return null;
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return null;
    const maximumFrequency = Math.min(
      MAXIMUM_DISPLAY_FREQUENCY,
      (analyser?.context.sampleRate ?? 48_000) / 2,
    );
    return spectrumGestureAtPosition(
      (clientX - bounds.left) / bounds.width,
      (clientY - bounds.top) / bounds.height,
      MINIMUM_FREQUENCY,
      maximumFrequency,
    );
  };

  const updatePointerVisual = (
    point: SpectrumGesturePoint,
    active: boolean,
    visible: boolean,
  ) => {
    pointerVisualRef.current = {
      active,
      normalizedX: point.normalizedX,
      normalizedY: point.normalizedY,
      visible,
    };
  };

  const finishGesture = (pointerId: number, keepHover: boolean) => {
    if (activePointerIdRef.current !== pointerId) return;
    activePointerIdRef.current = null;
    pointerVisualRef.current = {
      ...pointerVisualRef.current,
      active: false,
      visible: keepHover,
    };
    setInteractionActive(false);
    onGestureEnd(pointerId);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (
      activePointerIdRef.current !== null
      || (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }
    const point = gesturePoint(event.clientX, event.clientY);
    if (point === null) return;
    event.preventDefault();
    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePointerVisual(point, true, true);
    setInteractionActive(true);
    onGestureStart(event.pointerId, point);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const point = gesturePoint(event.clientX, event.clientY);
    if (point === null) return;
    const active = activePointerIdRef.current === event.pointerId;
    updatePointerVisual(
      point,
      active,
      active || event.pointerType === "mouse",
    );
    if (active) onGestureMove(event.pointerId, point);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    finishGesture(event.pointerId, event.pointerType === "mouse");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const keyboardPoint = () => spectrumGestureAtPosition(
    0.5,
    0.42,
    MINIMUM_FREQUENCY,
    Math.min(
      MAXIMUM_DISPLAY_FREQUENCY,
      (analyser?.context.sampleRate ?? 48_000) / 2,
    ),
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (
      (event.key !== "Enter" && event.key !== " ")
      || event.repeat
      || activePointerIdRef.current !== null
    ) {
      return;
    }
    event.preventDefault();
    const point = keyboardPoint();
    activePointerIdRef.current = -1;
    updatePointerVisual(point, true, true);
    setInteractionActive(true);
    onGestureStart(-1, point);
  };

  const handleKeyUp = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (
      (event.key !== "Enter" && event.key !== " ")
      || activePointerIdRef.current !== -1
    ) {
      return;
    }
    event.preventDefault();
    finishGesture(-1, false);
  };

  useEffect(() => {
    const historyCanvas = historyRef.current;
    const overlayCanvas = overlayRef.current;
    if (historyCanvas === null || overlayCanvas === null) return;
    const historyContext = historyCanvas.getContext("2d", { alpha: false });
    const overlayContext = overlayCanvas.getContext("2d");
    if (historyContext === null || overlayContext === null) return;

    let frame = 0;
    let lastHistoryDraw = 0;
    let frequencyData = analyser === null
      ? null
      : new Float32Array(analyser.frequencyBinCount);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const historyInterval = reducedMotion ? 140 : 46;

    const resize = () => {
      const bounds = historyCanvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(Math.round(bounds.width * pixelRatio), 1);
      const height = Math.max(Math.round(bounds.height * pixelRatio), 1);
      if (historyCanvas.width !== width || historyCanvas.height !== height) {
        historyCanvas.width = width;
        historyCanvas.height = height;
        historyContext.fillStyle = "#080604";
        historyContext.fillRect(0, 0, width, height);
      }
      if (overlayCanvas.width !== width || overlayCanvas.height !== height) {
        overlayCanvas.width = width;
        overlayCanvas.height = height;
      }
    };

    const observer = typeof ResizeObserver === "function"
      ? new ResizeObserver(resize)
      : null;
    observer?.observe(historyCanvas);
    window.addEventListener("resize", resize);
    resize();

    const drawHistory = () => {
      if (
        analyser === null
        || analyser.context.state !== "running"
        || frequencyData === null
      ) {
        return;
      }
      analyser.getFloatFrequencyData(frequencyData);
      const { width, height } = historyCanvas;
      if (width <= 0 || height <= 0) return;
      const rowHeight = Math.max(Math.round((window.devicePixelRatio || 1) * 1.5), 1);
      if (height <= rowHeight) return;
      historyContext.drawImage(
        historyCanvas,
        0,
        rowHeight,
        width,
        height - rowHeight,
        0,
        0,
        width,
        height - rowHeight,
      );
      const maximumFrequency = Math.min(
        MAXIMUM_DISPLAY_FREQUENCY,
        analyser.context.sampleRate / 2,
      );
      const nyquist = analyser.context.sampleRate / 2;
      for (let x = 0; x < width; x += 2) {
        const frequency = frequencyAtPosition(
          x / Math.max(width - 1, 1),
          MINIMUM_FREQUENCY,
          maximumFrequency,
        );
        const bin = Math.min(
          Math.round((frequency / nyquist) * frequencyData.length),
          frequencyData.length - 1,
        );
        const decibels = frequencyData[bin] ?? analyser.minDecibels;
        const normalized = Math.pow(
          Math.min(
            Math.max(
              (decibels - analyser.minDecibels)
                / (analyser.maxDecibels - analyser.minDecibels),
              0,
            ),
            1,
          ),
          1.28,
        );
        const colorIndex = Math.min(
          Math.floor(normalized * SPECTROGRAM_COLORS.length),
          SPECTROGRAM_COLORS.length - 1,
        );
        historyContext.fillStyle = SPECTROGRAM_COLORS[colorIndex] ?? "#080604";
        historyContext.fillRect(x, height - rowHeight, 2, rowHeight);
      }
    };

    const drawOverlay = () => {
      const { width, height } = overlayCanvas;
      if (width <= 0 || height <= 0) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const maximumFrequency = Math.min(
        MAXIMUM_DISPLAY_FREQUENCY,
        (analyser?.context.sampleRate ?? 48_000) / 2,
      );
      overlayContext.clearRect(0, 0, width, height);
      overlayContext.lineWidth = pixelRatio;
      overlayContext.strokeStyle = "rgba(230, 170, 101, 0.12)";
      overlayContext.fillStyle = "rgba(230, 170, 101, 0.72)";
      overlayContext.font = `${10 * pixelRatio}px MonoLisaCode, monospace`;
      overlayContext.textBaseline = "top";

      for (const frequency of GRID_FREQUENCIES) {
        if (frequency > maximumFrequency) continue;
        const x = positionAtFrequency(
          frequency,
          MINIMUM_FREQUENCY,
          maximumFrequency,
        ) * width;
        overlayContext.beginPath();
        overlayContext.moveTo(x, 0);
        overlayContext.lineTo(x, height);
        overlayContext.stroke();
        overlayContext.fillText(
          `${formatFrequency(frequency)} Hz`,
          x + 6 * pixelRatio,
          8 * pixelRatio,
        );
      }

      overlayContext.textBaseline = "bottom";
      for (const decibels of GRID_DECIBELS) {
        const y = decibelsToY(decibels, height);
        overlayContext.beginPath();
        overlayContext.moveTo(0, y);
        overlayContext.lineTo(width, y);
        overlayContext.stroke();
        overlayContext.fillText(
          `${decibels} dB`,
          8 * pixelRatio,
          y - 5 * pixelRatio,
        );
      }

      overlayContext.save();
      overlayContext.strokeStyle = "rgba(198, 109, 31, 0.68)";
      overlayContext.lineWidth = 1.5 * pixelRatio;
      overlayContext.setLineDash([5 * pixelRatio, 5 * pixelRatio]);
      overlayContext.beginPath();
      for (let x = 0; x < width; x += 2) {
        const frequency = frequencyAtPosition(
          x / Math.max(width - 1, 1),
          MINIMUM_FREQUENCY,
          maximumFrequency,
        );
        const y = decibelsToY(-48 + noiseShapeDb(noiseType, tone, frequency), height);
        if (x === 0) overlayContext.moveTo(x, y);
        else overlayContext.lineTo(x, y);
      }
      overlayContext.stroke();
      overlayContext.restore();

      if (
        analyser !== null
        && analyser.context.state === "running"
        && frequencyData !== null
      ) {
        analyser.getFloatFrequencyData(frequencyData);
        const nyquist = analyser.context.sampleRate / 2;
        overlayContext.strokeStyle = "rgba(246, 193, 129, 0.92)";
        overlayContext.lineWidth = 1.35 * pixelRatio;
        overlayContext.beginPath();
        for (let x = 0; x < width; x += 2) {
          const frequency = frequencyAtPosition(
            x / Math.max(width - 1, 1),
            MINIMUM_FREQUENCY,
            maximumFrequency,
          );
          const bin = Math.min(
            Math.round((frequency / nyquist) * frequencyData.length),
            frequencyData.length - 1,
          );
          const y = decibelsToY(
            frequencyData[bin] ?? analyser.minDecibels,
            height,
          );
          if (x === 0) overlayContext.moveTo(x, y);
          else overlayContext.lineTo(x, y);
        }
        overlayContext.stroke();
      }

      const pointer = pointerVisualRef.current;
      if (!pointer.visible) return;
      const pointerX = pointer.normalizedX * width;
      const pointerY = pointer.normalizedY * height;
      const radius = (pointer.active ? 18 : 12) * pixelRatio;
      overlayContext.beginPath();
      overlayContext.arc(pointerX, pointerY, radius, 0, Math.PI * 2);
      overlayContext.fillStyle = pointer.active
        ? "rgba(230, 170, 101, 0.16)"
        : "rgba(230, 170, 101, 0.07)";
      overlayContext.fill();
      overlayContext.strokeStyle = pointer.active
        ? "rgba(255, 220, 176, 0.92)"
        : "rgba(230, 170, 101, 0.68)";
      overlayContext.lineWidth = (pointer.active ? 1.8 : 1.25) * pixelRatio;
      overlayContext.stroke();
      overlayContext.beginPath();
      overlayContext.arc(
        pointerX,
        pointerY,
        Math.max(radius * 0.22, 2 * pixelRatio),
        0,
        Math.PI * 2,
      );
      overlayContext.fillStyle = pointer.active
        ? "rgba(255, 242, 225, 0.96)"
        : "rgba(230, 170, 101, 0.78)";
      overlayContext.fill();
    };

    const animate = (timestamp: number) => {
      if (timestamp - lastHistoryDraw >= historyInterval) {
        drawHistory();
        lastHistoryDraw = timestamp;
      }
      drawOverlay();
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      frequencyData = null;
    };
  }, [analyser, noiseType, tone]);

  return (
    <div className="spectrogram">
      <canvas ref={historyRef} aria-hidden="true" />
      <canvas
        ref={overlayRef}
        aria-hidden="true"
        data-spectrogram-overlay
      />
      <Pressable
        className="spectrum-instrument"
        data-interacting={interactionActive || undefined}
        onBlur={() => {
          if (activePointerIdRef.current !== null) {
            finishGesture(activePointerIdRef.current, false);
          }
          pointerVisualRef.current = {
            ...pointerVisualRef.current,
            visible: false,
          };
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onLostPointerCapture={(event) => {
          finishGesture(event.pointerId, event.pointerType === "mouse");
        }}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          const point = gesturePoint(event.clientX, event.clientY);
          if (point !== null) updatePointerVisual(point, false, true);
        }}
        onPointerLeave={() => {
          if (activePointerIdRef.current === null) {
            pointerVisualRef.current = {
              ...pointerVisualRef.current,
              visible: false,
            };
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
      >
        <span className="sleepyland-visually-hidden">
          Live rolling spectrogram with an interactive filtered-noise instrument.
          Tap for a pulse or press and hold for continuous sound.
        </span>
      </Pressable>
    </div>
  );
}

export function NoiseStudio({
  brand,
  resourceGroups = [],
}: Readonly<{
  brand: Brand;
  resourceGroups?: readonly StudioResourceGroup[];
}>) {
  const [soundMode, setSoundMode] = useState<SoundModeId>(
    DEFAULT_SETTINGS.soundMode,
  );
  const [energy, setEnergy] = useState<EnergyLevelId>(DEFAULT_SETTINGS.energy);
  const [noiseType, setNoiseType] = useState<NoiseType>(DEFAULT_SETTINGS.noiseType);
  const [tone, setTone] = useState(DEFAULT_SETTINGS.tone);
  const [noiseVolume, setNoiseVolume] = useState(DEFAULT_SETTINGS.noiseVolume);
  const [waveVolume, setWaveVolume] = useState(DEFAULT_SETTINGS.waveVolume);
  const [wavePace, setWavePace] = useState(DEFAULT_SETTINGS.wavePace);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [sessionPlan, setSessionPlan] = useState<SessionPlan>(
    DEFAULT_SETTINGS.sessionPlan,
  );
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>(
    createSessionProgress(DEFAULT_SETTINGS.sessionPlan),
  );
  const [completionSummary, setCompletionSummary] = useState<string | null>(null);
  const [settingsReady, setSettingsReady] = useState(false);
  const [tuningOpen, setTuningOpen] = useState(false);
  const engineRef = useRef<SoundEngine | null>(null);
  const playbackStartFenceRef = useRef(new PlaybackStartFence());
  const sessionProgressRef = useRef<SessionProgress>(
    createSessionProgress(DEFAULT_SETTINGS.sessionPlan),
  );
  const sessionTickAtRef = useRef<number | null>(null);
  const sessionPlayedMillisecondsRef = useRef(0);
  const activeSoundModeRef = useRef<SoundModeId>(DEFAULT_SETTINGS.soundMode);
  const transportButtonRef = useRef<HTMLButtonElement>(null);
  const playing = status === "playing";

  const accountSessionTime = useCallback((now: number): number => {
    const startedAt = sessionTickAtRef.current;
    if (startedAt === null) return 0;
    const elapsed = Math.max(0, Math.floor(now - startedAt));
    sessionTickAtRef.current = now;
    sessionPlayedMillisecondsRef.current += elapsed;
    return elapsed;
  }, []);

  useEffect(() => {
    const storedSettings = loadSettings();
    const frame = window.requestAnimationFrame(() => {
      if (storedSettings !== null) {
        setSoundMode(storedSettings.soundMode);
        activeSoundModeRef.current = storedSettings.soundMode;
        setEnergy(storedSettings.energy);
        setNoiseType(storedSettings.noiseType);
        setTone(storedSettings.tone);
        setNoiseVolume(storedSettings.noiseVolume);
        setWaveVolume(storedSettings.waveVolume);
        setWavePace(storedSettings.wavePace);
        setSessionPlan(storedSettings.sessionPlan);
        const storedProgress = createSessionProgress(storedSettings.sessionPlan);
        setSessionProgress(storedProgress);
        sessionProgressRef.current = storedProgress;
        engineRef.current?.setSoundProfile({
          soundMode: storedSettings.soundMode,
          energy: storedSettings.energy,
        });
        engineRef.current?.setType(storedSettings.noiseType);
        engineRef.current?.setTone(storedSettings.tone);
        engineRef.current?.setNoiseVolume(storedSettings.noiseVolume);
        engineRef.current?.setWaveVolume(storedSettings.waveVolume);
        engineRef.current?.setWavePace(storedSettings.wavePace);
      }
      setSettingsReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    settingsRecord.save({
      version: 7,
      soundMode,
      energy,
      noiseType,
      tone,
      noiseVolume,
      waveVolume,
      wavePace,
      sessionPlan,
    });
  }, [
    energy,
    noiseType,
    noiseVolume,
    settingsReady,
    sessionPlan,
    soundMode,
    tone,
    wavePace,
    waveVolume,
  ]);

  useEffect(() => {
    const playbackStartFence = playbackStartFenceRef.current;
    return () => {
      playbackStartFence.cancel();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    sessionTickAtRef.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const elapsed = accountSessionTime(now);
      const advanced = advanceSessionProgress(
        sessionPlan,
        sessionProgressRef.current,
        elapsed,
      );

      if (!advanced.completed) {
        sessionProgressRef.current = advanced.progress;
        setSessionProgress(advanced.progress);
        if (
          advanced.phaseChanged
          && advanced.progress.kind === "intervals"
        ) {
          engineRef.current?.setSessionPhase(advanced.progress.phase);
        }
        return;
      }

      const durationMilliseconds = sessionPlayedMillisecondsRef.current;
      const completedSoundMode = activeSoundModeRef.current;
      capturePostHogEvent(sleepylandPostHogSite, "sound session completed", {
        session_kind: sessionPlan.kind,
        sound_mode: completedSoundMode,
      });
      setCompletionSummary(completionLabel(
        durationMilliseconds,
        completedSoundMode,
      ));
      engineRef.current?.completeSession();
      sessionTickAtRef.current = null;
      sessionPlayedMillisecondsRef.current = 0;
      const resetProgress = createSessionProgress(sessionPlan);
      sessionProgressRef.current = resetProgress;
      setSessionProgress(resetProgress);
      setStatus("paused");
    }, SESSION_PROGRESS_TICK_INTERVAL_MS);
    return () => {
      window.clearInterval(timer);
      accountSessionTime(Date.now());
      sessionTickAtRef.current = null;
    };
  }, [accountSessionTime, playing, sessionPlan]);

  useEffect(() => {
    if (completionSummary === null) return;
    const timer = window.setTimeout(() => setCompletionSummary(null), 8_000);
    return () => window.clearTimeout(timer);
  }, [completionSummary]);

  const ensureEngine = useCallback(() => {
    let engine = engineRef.current;
    if (engine === null) {
      engine = new SoundEngine({
        energy,
        noiseType,
        tone,
        noiseVolume,
        waveVolume,
        wavePace,
        soundMode,
      });
      engineRef.current = engine;
      setAnalyser(engine.analyser);
    }
    engine.setSoundProfile({ soundMode, energy });
    engine.setType(noiseType);
    engine.setTone(tone);
    engine.setNoiseVolume(noiseVolume);
    engine.setWaveVolume(waveVolume);
    engine.setWavePace(wavePace);
    return engine;
  }, [
    energy,
    noiseType,
    noiseVolume,
    soundMode,
    tone,
    wavePace,
    waveVolume,
  ]);

  const stopPlayback = useCallback(() => {
    if (!canStopPlayback(status)) return;
    playbackStartFenceRef.current.cancel();
    const current = engineRef.current;
    if (status === "playing") {
      accountSessionTime(Date.now());
      capturePostHogEvent(sleepylandPostHogSite, "sound playback stopped", {
        sound_mode: activeSoundModeRef.current,
      });
    }
    if (status === "starting") {
      current?.dispose();
      if (engineRef.current === current) engineRef.current = null;
      setAnalyser(null);
    } else {
      current?.pause();
    }
    sessionTickAtRef.current = null;
    setStatus("paused");
  }, [accountSessionTime, status]);

  const startPlayback = useCallback(async () => {
    if (status === "playing" || status === "starting") return;
    const startup = playbackStartFenceRef.current.begin();
    let engine: SoundEngine | null = null;

    setStatus("starting");
    setError(null);
    try {
      engine = ensureEngine();
      engine.setSessionPhase(
        sessionProgressRef.current.kind === "intervals"
          ? sessionProgressRef.current.phase
          : "work",
      );
      await engine.play(startup.signal);
      if (!playbackStartFenceRef.current.isCurrent(startup.token)) {
        engine.pause();
        return;
      }
      setCompletionSummary(null);
      setStatus("playing");
      capturePostHogEvent(sleepylandPostHogSite, "sound playback started", {
        session_kind: sessionPlan.kind,
        sound_mode: activeSoundModeRef.current,
      });
    } catch (cause) {
      if (!playbackStartFenceRef.current.isCurrent(startup.token)) return;
      engine?.dispose();
      if (engineRef.current === engine) engineRef.current = null;
      setAnalyser(null);
      setStatus("error");
      capturePostHogException(sleepylandPostHogSite, cause, {
        error_origin: "audio_playback_start",
      });
      setError(
        cause instanceof Error
          ? cause.message
          : "The browser could not start audio playback.",
      );
    } finally {
      playbackStartFenceRef.current.clear(startup.token);
    }
  }, [
    ensureEngine,
    sessionPlan.kind,
    status,
  ]);

  const startSpectrumGesture = useCallback((
    pointerId: number,
    point: SpectrumGesturePoint,
  ) => {
    let engine: SoundEngine;
    try {
      engine = ensureEngine();
      setError(null);
    } catch (cause) {
      capturePostHogException(sleepylandPostHogSite, cause, {
        error_origin: "spectrum_instrument_start",
      });
      setError(
        cause instanceof Error
          ? cause.message
          : "The browser could not start the spectrum instrument.",
      );
      return;
    }
    void engine.beginSpectrumGesture(pointerId, point).catch((cause: unknown) => {
      if (engineRef.current !== engine) return;
      capturePostHogException(sleepylandPostHogSite, cause, {
        error_origin: "spectrum_instrument_resume",
      });
      setError(
        cause instanceof Error
          ? cause.message
          : "The browser could not start the spectrum instrument.",
      );
    });
  }, [ensureEngine]);

  const moveSpectrumGesture = useCallback((
    pointerId: number,
    point: SpectrumGesturePoint,
  ) => {
    engineRef.current?.updateSpectrumGesture(pointerId, point);
  }, []);

  const endSpectrumGesture = useCallback((pointerId: number) => {
    engineRef.current?.endSpectrumGesture(pointerId);
  }, []);

  const chooseNoise = (type: NoiseType) => {
    setNoiseType(type);
    engineRef.current?.setType(type);
  };

  const chooseSoundMode = (nextSoundMode: SoundModeId) => {
    capturePostHogEvent(sleepylandPostHogSite, "sound mode selected", {
      sound_mode: nextSoundMode,
    });
    activeSoundModeRef.current = nextSoundMode;
    setSoundMode(nextSoundMode);

    const profileSelection = {
      soundMode: nextSoundMode,
      energy,
    } as const;
    const recipe = resolveSoundProfile(profileSelection).recipe;
    setNoiseType(recipe.noiseType);
    setTone(recipe.tone);
    setNoiseVolume(recipe.noiseVolume);
    setWaveVolume(recipe.waveVolume);
    setWavePace(recipe.wavePace);

    const engine = engineRef.current;
    engine?.setSoundProfile(profileSelection);
    engine?.setType(recipe.noiseType);
    engine?.setTone(recipe.tone);
    engine?.setNoiseVolume(recipe.noiseVolume);
    engine?.setWaveVolume(recipe.waveVolume);
    engine?.setWavePace(recipe.wavePace);
    engine?.setSessionPhase("work");

    const nextPlan = nextSoundMode === "focus"
      ? defaultSessionPlanFor(nextSoundMode)
      : sessionPlan.kind === "intervals"
        ? defaultSessionPlanFor(nextSoundMode)
        : sessionPlan;
    const nextProgress = createSessionProgress(nextPlan);
    setSessionPlan(nextPlan);
    setSessionProgress(nextProgress);
    sessionProgressRef.current = nextProgress;
    sessionTickAtRef.current = playing ? Date.now() : null;
    sessionPlayedMillisecondsRef.current = 0;
    setCompletionSummary(null);
  };

  const chooseEnergy = (nextEnergy: EnergyLevelId) => {
    setEnergy(nextEnergy);
    engineRef.current?.setSoundProfile({
      soundMode,
      energy: nextEnergy,
    });
  };

  const chooseSessionPlan = (nextPlan: SessionPlan) => {
    const nextProgress = createSessionProgress(nextPlan);
    setSessionPlan(nextPlan);
    setSessionProgress(nextProgress);
    sessionProgressRef.current = nextProgress;
    sessionTickAtRef.current = playing ? Date.now() : null;
    sessionPlayedMillisecondsRef.current = 0;
    engineRef.current?.setSessionPhase("work");
    setCompletionSummary(null);
  };

  const changeTone = (value: number) => {
    const nextTone = clampControl(value);
    setTone(nextTone);
    engineRef.current?.setTone(nextTone);
  };

  const changeNoiseVolume = (value: number) => {
    const nextVolume = clampControl(value);
    setNoiseVolume(nextVolume);
    engineRef.current?.setNoiseVolume(nextVolume);
  };

  const changeWaveVolume = (value: number) => {
    const nextVolume = clampControl(value);
    setWaveVolume(nextVolume);
    engineRef.current?.setWaveVolume(nextVolume);
  };

  const changeWavePeriod = (value: number) => {
    const nextPace = Math.round(wavePaceAtPeriod(value));
    setWavePace(nextPace);
    engineRef.current?.setWavePace(nextPace);
  };

  const soundModeCustomized = !recipeMatchesSoundProfile({
    soundMode,
    energy,
  }, {
    noiseType,
    noiseVolume,
    tone,
    wavePace,
    waveVolume,
  });
  const selectedSoundMode = soundModeDefinition(soundMode);

  return (
    <ViewportFrame as="main" className="noise-app">
      <header className="app-header">
        <h1 className="wordmark">
          {brand.domain}
          <span className="wordmark__tagline"> – {brand.tagline}</span>
        </h1>
        <div className="header-actions">
          <Link className="header-research-link" href="/">Research</Link>
          <StudioResources groups={resourceGroups} />
          <NoiseInfo />
        </div>
      </header>

      <section
        aria-label={`${selectedSoundMode.label} soundscape visualization`}
        className="visual-panel"
      >
        <Spectrogram
          analyser={analyser}
          noiseType={noiseType}
          onGestureEnd={endSpectrumGesture}
          onGestureMove={moveSpectrumGesture}
          onGestureStart={startSpectrumGesture}
          tone={tone}
        />
        <p
          aria-live="polite"
          className="session-completion"
          hidden={completionSummary === null}
          role="status"
        >
          {completionSummary}
        </p>
      </section>

      {error === null ? null : (
        <p className="audio-error" role="alert">{error}</p>
      )}

      <section className="control-deck" aria-label="Sound controls">
        <div className="control-deck__primary">
          <TransportControls
            buttonRef={transportButtonRef}
            onPlay={() => void startPlayback()}
            onStop={stopPlayback}
            status={status}
          />

          <SoundModePicker
            customized={soundModeCustomized}
            onSelect={chooseSoundMode}
            value={soundMode}
          />

          <SessionPlanControl
            onSelect={chooseSessionPlan}
            plan={sessionPlan}
            progress={sessionProgress}
            soundMode={soundMode}
          />

          <Button
            aria-controls="sound-tuning"
            aria-expanded={tuningOpen}
            className="tune-button"
            controlClassName="tune-button__control"
            data-active={tuningOpen || soundModeCustomized}
            onPress={() => setTuningOpen((open) => !open)}
            size="large"
            variant="quiet"
          >
            <TuneIcon />
            <span>Tune</span>
          </Button>
        </div>

        <div className="sound-tuning" hidden={!tuningOpen} id="sound-tuning">
          <EnergyPicker onSelect={chooseEnergy} value={energy} />

          <fieldset className="noise-picker">
            <legend>Noise type</legend>
            <SegmentedControl
              aria-label="Noise type"
              className="noise-picker__options"
              items={NOISE_SEGMENTS}
              onChange={chooseNoise}
              surfaceClassName="noise-picker__surface"
              value={noiseType}
            />
          </fieldset>

          <div className="mixer-grid">
            <div className="range-control noise-volume-control">
              <WrappingRow as="span" className="range-control__header">
                <span><VolumeIcon muted={noiseVolume === 0} />Noise</span>
                <output>{Math.round(noiseVolume)}%</output>
              </WrappingRow>
              <Fader
                className="range-control__fader"
                formatOptions={{ style: "unit", unit: "percent" }}
                label="Noise volume"
                maxValue={100}
                minValue={0}
                onChange={changeNoiseVolume}
                orientation="horizontal"
                step={1}
                value={noiseVolume}
              />
            </div>

            <div className="range-control warmth-control">
              <WrappingRow as="span" className="range-control__header">
                <span><WarmthIcon />Warmth</span>
                <output>{toneLabel(tone)}</output>
              </WrappingRow>
              <Fader
                className="range-control__fader"
                label="Sound warmth from dark to bright"
                maxValue={100}
                minValue={0}
                onChange={changeTone}
                orientation="horizontal"
                step={1}
                value={tone}
              />
            </div>

            <div className="range-control wave-volume-control">
              <WrappingRow as="span" className="range-control__header">
                <span><WaveIcon />Waves</span>
                <output>{Math.round(waveVolume)}%</output>
              </WrappingRow>
              <Fader
                className="range-control__fader"
                formatOptions={{ style: "unit", unit: "percent" }}
                label="Ocean wave volume"
                maxValue={100}
                minValue={0}
                onChange={changeWaveVolume}
                orientation="horizontal"
                step={1}
                value={waveVolume}
              />
            </div>

            <div className="range-control wave-pace-control">
              <WrappingRow as="span" className="range-control__header">
                <span><WaveIcon />Interval</span>
                <output>{Math.round(wavePeriodSeconds(wavePace))}s</output>
              </WrappingRow>
              <Fader
                className="range-control__fader"
                formatOptions={{ style: "unit", unit: "second" }}
                label="Wave interval from frequent surf to slow swell"
                maxValue={16}
                minValue={5}
                onChange={changeWavePeriod}
                orientation="horizontal"
                step={1}
                value={Math.round(wavePeriodSeconds(wavePace))}
              />
            </div>
          </div>
        </div>
      </section>
    </ViewportFrame>
  );
}
