import {
  fillNoiseChannel,
  toneProfile,
  volumeToGain,
  type NoiseType,
  type RandomSource,
  type SpectrumGesturePoint,
} from "./noise";
import {
  createWaveSceneState,
  nextWaveEvent,
  wavePeriodSeconds,
  type WaveEvent,
  type WaveSceneState,
} from "./waves";
import {
  DEFAULT_ENERGY_LEVEL,
  DEFAULT_SOUND_MODE,
  resolveSoundProfile,
  type ResolvedSoundProfile,
  type SoundRecipe,
  type SoundModeId,
  type SoundProfileSelection,
} from "./sound-modes";

const BUFFER_SECONDS = 8;
const SOURCE_FADE_SECONDS = 0.22;
const MASTER_FADE_SECONDS = 0.18;
const SESSION_PHASE_FADE_SECONDS = 1.8;
const SESSION_COMPLETE_FADE_SECONDS = 2.4;
const AUDIO_RESUME_TIMEOUT_MS = 3_000;
const WAVE_LOOKAHEAD_SECONDS = 4.5;
const WAVE_SCHEDULER_INTERVAL_MS = 500;
const WAVE_INITIAL_CREST_SECONDS = 1.35;
const MINIMUM_ENVELOPE_GAIN = 0.0001;
const SPECTRUM_ATTACK_SECONDS = 0.025;
const SPECTRUM_RELEASE_SECONDS = 0.24;
const SPECTRUM_PULSE_SECONDS = 0.3;

type Voice = Readonly<{
  gain: GainNode;
  source: AudioBufferSourceNode;
  type: NoiseType;
}>;

type WaveVoice = Readonly<{
  nodes: readonly AudioNode[];
  sources: readonly AudioBufferSourceNode[];
}>;

type SpectrumVoice = {
  filter: BiquadFilterNode;
  gain: GainNode;
  level: number;
  nodes: readonly AudioNode[];
  panner: StereoPannerNode;
  source: AudioBufferSourceNode;
  startedAt: number;
};

type PendingSpectrumGesture = {
  cancelled: boolean;
  point: SpectrumGesturePoint;
  released: boolean;
};

type WarmthFilterChain = Readonly<{
  highShelf: BiquadFilterNode;
  lowPass: BiquadFilterNode;
  lowShelf: BiquadFilterNode;
}>;

function createWarmthFilterChain(context: AudioContext): WarmthFilterChain {
  const lowShelf = context.createBiquadFilter();
  lowShelf.type = "lowshelf";
  lowShelf.frequency.value = 280;

  const highShelf = context.createBiquadFilter();
  highShelf.type = "highshelf";
  highShelf.frequency.value = 2_800;

  const lowPass = context.createBiquadFilter();
  lowPass.type = "lowpass";
  lowPass.Q.value = Math.SQRT1_2;

  return { highShelf, lowPass, lowShelf };
}

function connectWarmthFilterChain(
  filters: WarmthFilterChain,
  destination: AudioNode,
): void {
  filters.lowShelf
    .connect(filters.highShelf)
    .connect(filters.lowPass)
    .connect(destination);
}

function disconnectWarmthFilterChain(filters: WarmthFilterChain): void {
  filters.lowShelf.disconnect();
  filters.highShelf.disconnect();
  filters.lowPass.disconnect();
}

function holdAudioParam(param: AudioParam, at: number): void {
  if (typeof param.cancelAndHoldAtTime === "function") {
    param.cancelAndHoldAtTime(at);
    return;
  }
  const value = param.value;
  param.cancelScheduledValues(at);
  param.setValueAtTime(value, at);
}

function requestPlaybackAudioSession(): void {
  const navigatorValue: unknown = globalThis.navigator;
  if (navigatorValue === null || typeof navigatorValue !== "object") return;
  try {
    const session = Reflect.get(navigatorValue, "audioSession");
    if (session !== null && typeof session === "object") {
      Reflect.set(session, "type", "playback");
    }
  } catch {
    return;
  }
}

function playbackCancelledError(): DOMException {
  return new DOMException("Audio playback start was cancelled.", "AbortError");
}

function throwIfPlaybackCancelled(signal: AbortSignal | undefined): void {
  if (signal?.aborted === true) throw playbackCancelledError();
}

async function resumePrimed(
  context: AudioContext,
  signal: AbortSignal | undefined,
): Promise<void> {
  throwIfPlaybackCancelled(signal);
  const primer = context.createBufferSource();
  primer.buffer = context.createBuffer(1, 1, context.sampleRate);
  primer.connect(context.destination);
  primer.addEventListener("ended", () => primer.disconnect(), { once: true });
  primer.start(0);
  let timer: number | null = null;
  let rejectCancellation: ((reason: DOMException) => void) | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = window.setTimeout(
      () => reject(new Error("The browser did not resume audio.")),
      AUDIO_RESUME_TIMEOUT_MS,
    );
  });
  const cancellation = new Promise<never>((_, reject) => {
    rejectCancellation = reject;
  });
  const cancel = () => rejectCancellation?.(playbackCancelledError());
  signal?.addEventListener("abort", cancel, { once: true });
  await Promise.race([context.resume(), timeout, cancellation]).finally(() => {
    if (timer !== null) window.clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
  });
  throwIfPlaybackCancelled(signal);
  if (context.state !== "running") {
    throw new Error(`Browser audio remained ${context.state}.`);
  }
}

export type SoundEngineSettings = SoundRecipe & SoundProfileSelection;

export class SoundEngine {
  readonly analyser: AnalyserNode;
  readonly sampleRate: number;

  private readonly bedMix: GainNode;
  private readonly context: AudioContext;
  private readonly limiter: DynamicsCompressorNode;
  private readonly master: GainNode;
  private readonly noiseFilters: WarmthFilterChain;
  private readonly noiseMix: GainNode;
  private readonly noiseMotion: GainNode;
  private readonly noiseMotionOscillator: OscillatorNode;
  private readonly spectrumFilters: WarmthFilterChain;
  private readonly spectrumMix: GainNode;
  private readonly waveFilters: WarmthFilterChain;
  private readonly waveMix: GainNode;
  private readonly random: RandomSource;
  private readonly buffers = new Map<NoiseType, AudioBuffer>();
  private readonly pendingSpectrumGestures = new Map<
    number,
    PendingSpectrumGesture
  >();
  private readonly spectrumHolds = new Map<number, SpectrumVoice>();
  private readonly spectrumVoices = new Set<SpectrumVoice>();
  private readonly waveVoices = new Set<WaveVoice>();
  private activeVoice: Voice | null = null;
  private currentNoiseVolume: number;
  private currentSoundProfile: ResolvedSoundProfile;
  private currentSessionPhase: "break" | "work" = "work";
  private currentType: NoiseType;
  private currentWavePace: number;
  private isPlaying = false;
  private nextWaveCrestAt: number | null = null;
  private pauseTimer: number | null = null;
  private waveScene: WaveSceneState;
  private waveSchedulerTimer: number | null = null;

  constructor(
    {
      noiseType,
      noiseVolume,
      energy = DEFAULT_ENERGY_LEVEL,
      soundMode = DEFAULT_SOUND_MODE,
      tone,
      wavePace,
      waveVolume,
    }: SoundEngineSettings,
    random: RandomSource = Math.random,
  ) {
    if (typeof globalThis.AudioContext !== "function") {
      throw new Error("This browser does not support the Web Audio API.");
    }

    requestPlaybackAudioSession();
    this.context = new AudioContext({ latencyHint: "playback" });
    this.sampleRate = this.context.sampleRate;
    this.random = random;
    this.currentNoiseVolume = noiseVolume;
    this.currentSoundProfile = resolveSoundProfile({
      energy,
      soundMode,
    });
    this.currentType = noiseType;
    this.currentWavePace = wavePace;
    this.waveScene = createWaveSceneState(random);

    this.noiseFilters = createWarmthFilterChain(this.context);
    this.noiseMix = this.context.createGain();
    this.noiseMix.gain.value = volumeToGain(noiseVolume);

    this.waveFilters = createWarmthFilterChain(this.context);
    this.waveMix = this.context.createGain();
    this.waveMix.gain.value = volumeToGain(waveVolume);

    this.spectrumFilters = createWarmthFilterChain(this.context);
    this.spectrumMix = this.context.createGain();
    this.spectrumMix.gain.value = 0.28;

    this.bedMix = this.context.createGain();
    this.bedMix.gain.value = 0;

    this.limiter = this.context.createDynamicsCompressor();
    this.limiter.threshold.value = -18;
    this.limiter.knee.value = 12;
    this.limiter.ratio.value = 5;
    this.limiter.attack.value = 0.008;
    this.limiter.release.value = 0.45;

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2_048;
    this.analyser.minDecibels = -96;
    this.analyser.maxDecibels = -18;
    this.analyser.smoothingTimeConstant = 0.78;

    this.master = this.context.createGain();
    this.master.gain.value = 0;

    const motion = this.currentSoundProfile.motion;
    this.noiseMotion = this.context.createGain();
    this.noiseMotion.gain.value = volumeToGain(noiseVolume) * motion.depth;
    this.noiseMotionOscillator = this.context.createOscillator();
    this.noiseMotionOscillator.type = "sine";
    this.noiseMotionOscillator.frequency.value = 1 / motion.periodSeconds;
    this.noiseMotionOscillator.connect(this.noiseMotion);
    this.noiseMotion.connect(this.noiseMix.gain);
    this.noiseMotionOscillator.start();

    connectWarmthFilterChain(this.noiseFilters, this.noiseMix);
    connectWarmthFilterChain(this.waveFilters, this.waveMix);
    connectWarmthFilterChain(this.spectrumFilters, this.spectrumMix);
    this.noiseMix.connect(this.bedMix);
    this.waveMix.connect(this.bedMix);
    this.bedMix.connect(this.limiter);
    this.spectrumMix.connect(this.limiter);
    this.limiter
      .connect(this.master)
      .connect(this.analyser)
      .connect(this.context.destination);

    this.setTone(tone);
  }

  async play(signal?: AbortSignal): Promise<void> {
    throwIfPlaybackCancelled(signal);
    if (this.context.state === "closed") {
      throw new Error("The browser audio context is closed.");
    }
    if (this.pauseTimer !== null) {
      window.clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }
    if (this.activeVoice === null) this.replaceVoice(this.currentType);
    await resumePrimed(this.context, signal);
    throwIfPlaybackCancelled(signal);
    this.isPlaying = true;
    this.startWaveScheduler();
    this.setBedAudible(true);
    this.makeOutputAudible();
  }

  pause(): void {
    this.isPlaying = false;
    this.stopWaveScheduler();
    if (this.context.state === "closed") return;
    this.setBedAudible(false);
    if (this.spectrumVoices.size === 0) this.fadeAndSuspendOutput();
  }

  completeSession(): void {
    this.isPlaying = false;
    this.stopWaveScheduler();
    if (this.context.state === "closed") return;
    this.setBedAudible(false, SESSION_COMPLETE_FADE_SECONDS);
    if (this.spectrumVoices.size === 0) {
      this.fadeAndSuspendOutput(SESSION_COMPLETE_FADE_SECONDS);
    }
  }

  setType(type: NoiseType): void {
    this.currentType = type;
    if (this.activeVoice?.type === type) return;
    if (this.activeVoice !== null || this.isPlaying) this.replaceVoice(type);
  }

  setTone(value: number): void {
    if (this.context.state === "closed") return;
    const profile = toneProfile(value);
    const now = this.context.currentTime;
    for (const filters of [
      this.noiseFilters,
      this.waveFilters,
      this.spectrumFilters,
    ]) {
      filters.lowShelf.gain.setTargetAtTime(
        profile.lowShelfGainDb,
        now,
        0.035,
      );
      filters.highShelf.gain.setTargetAtTime(
        profile.highShelfGainDb,
        now,
        0.035,
      );
      filters.lowPass.frequency.setTargetAtTime(
        profile.lowPassFrequencyHz,
        now,
        0.035,
      );
    }
  }

  setNoiseVolume(value: number): void {
    if (this.context.state === "closed") return;
    this.currentNoiseVolume = value;
    const now = this.context.currentTime;
    const gain = volumeToGain(value);
    const motion = this.currentSoundProfile.motion;
    this.noiseMix.gain.setTargetAtTime(gain, now, 0.025);
    this.noiseMotion.gain.setTargetAtTime(
      gain * motion.depth,
      now,
      0.08,
    );
  }

  setSoundMode(soundMode: SoundModeId): void {
    this.setSoundProfile({
      energy: this.currentSoundProfile.energy,
      soundMode,
    });
  }

  setSoundProfile(selection: SoundProfileSelection): void {
    if (this.context.state === "closed") return;
    this.currentSoundProfile = resolveSoundProfile(selection);
    const motion = this.currentSoundProfile.motion;
    const now = this.context.currentTime;
    this.noiseMotionOscillator.frequency.setTargetAtTime(
      1 / motion.periodSeconds,
      now,
      0.08,
    );
    this.noiseMotion.gain.setTargetAtTime(
      volumeToGain(this.currentNoiseVolume) * motion.depth,
      now,
      0.12,
    );
  }

  setSessionPhase(phase: "break" | "work"): void {
    this.currentSessionPhase = phase;
    if (!this.isPlaying || this.context.state === "closed") return;
    this.setBedAudible(true, SESSION_PHASE_FADE_SECONDS);
  }

  setWavePace(value: number): void {
    this.currentWavePace = value;
    if (!this.isPlaying || this.context.state === "closed") return;
    const now = this.context.currentTime;
    const latestUsefulCrest = now + wavePeriodSeconds(value) * 1.2;
    if (
      this.nextWaveCrestAt !== null
      && this.nextWaveCrestAt > latestUsefulCrest
    ) {
      this.nextWaveCrestAt = latestUsefulCrest;
    }
  }

  setWaveVolume(value: number): void {
    if (this.context.state === "closed") return;
    const now = this.context.currentTime;
    this.waveMix.gain.setTargetAtTime(volumeToGain(value), now, 0.035);
  }

  async beginSpectrumGesture(
    pointerId: number,
    point: SpectrumGesturePoint,
  ): Promise<void> {
    if (this.context.state === "closed") {
      throw new Error("The browser audio context is closed.");
    }
    this.endSpectrumGesture(pointerId);
    const pending = {
      cancelled: false,
      point,
      released: false,
    } satisfies PendingSpectrumGesture;
    this.pendingSpectrumGestures.set(pointerId, pending);
    try {
      await resumePrimed(this.context, undefined);
    } catch (cause) {
      if (this.pendingSpectrumGestures.get(pointerId) === pending) {
        this.pendingSpectrumGestures.delete(pointerId);
      }
      throw cause;
    }
    if (pending.cancelled) return;
    if (this.pendingSpectrumGestures.get(pointerId) === pending) {
      this.pendingSpectrumGestures.delete(pointerId);
    }
    this.makeOutputAudible();
    const voice = this.createSpectrumVoice(pending.point);
    if (pending.released) {
      this.releaseSpectrumVoice(voice, true);
      return;
    }
    this.spectrumHolds.set(pointerId, voice);
  }

  updateSpectrumGesture(
    pointerId: number,
    point: SpectrumGesturePoint,
  ): void {
    const pending = this.pendingSpectrumGestures.get(pointerId);
    if (pending !== undefined) pending.point = point;
    const voice = this.spectrumHolds.get(pointerId);
    if (voice === undefined || this.context.state === "closed") return;
    this.updateSpectrumVoice(voice, point);
  }

  endSpectrumGesture(pointerId: number): void {
    const pending = this.pendingSpectrumGestures.get(pointerId);
    if (pending !== undefined) {
      pending.released = true;
      this.pendingSpectrumGestures.delete(pointerId);
    }
    const voice = this.spectrumHolds.get(pointerId);
    if (voice === undefined) return;
    this.spectrumHolds.delete(pointerId);
    this.releaseSpectrumVoice(voice, false);
  }

  dispose(): void {
    this.isPlaying = false;
    this.stopWaveScheduler();
    if (this.pauseTimer !== null) window.clearTimeout(this.pauseTimer);
    this.pauseTimer = null;
    this.activeVoice?.source.stop();
    this.activeVoice?.source.disconnect();
    this.activeVoice?.gain.disconnect();
    this.activeVoice = null;
    for (const pending of this.pendingSpectrumGestures.values()) {
      pending.cancelled = true;
    }
    this.pendingSpectrumGestures.clear();
    this.spectrumHolds.clear();
    for (const voice of this.spectrumVoices) {
      voice.source.stop();
      for (const node of voice.nodes) node.disconnect();
    }
    this.spectrumVoices.clear();
    disconnectWarmthFilterChain(this.noiseFilters);
    this.noiseMix.disconnect();
    this.noiseMotionOscillator.stop();
    this.noiseMotionOscillator.disconnect();
    this.noiseMotion.disconnect();
    for (const voice of this.waveVoices) {
      for (const source of voice.sources) source.stop();
      for (const node of voice.nodes) node.disconnect();
    }
    this.waveVoices.clear();
    disconnectWarmthFilterChain(this.waveFilters);
    this.waveMix.disconnect();
    disconnectWarmthFilterChain(this.spectrumFilters);
    this.spectrumMix.disconnect();
    this.bedMix.disconnect();
    this.limiter.disconnect();
    this.master.disconnect();
    this.analyser.disconnect();
    if (this.context.state !== "closed") {
      void this.context.close().catch(() => undefined);
    }
  }

  private makeOutputAudible(): void {
    if (this.context.state === "closed") return;
    if (this.pauseTimer !== null) {
      window.clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }
    const now = this.context.currentTime;
    holdAudioParam(this.master.gain, now);
    this.master.gain.linearRampToValueAtTime(1, now + MASTER_FADE_SECONDS);
  }

  private setBedAudible(
    audible: boolean,
    fadeSeconds: number = MASTER_FADE_SECONDS,
  ): void {
    if (this.context.state === "closed") return;
    const now = this.context.currentTime;
    holdAudioParam(this.bedMix.gain, now);
    this.bedMix.gain.linearRampToValueAtTime(
      audible ? (this.currentSessionPhase === "break" ? 0.58 : 1) : 0,
      now + fadeSeconds,
    );
  }

  private fadeAndSuspendOutput(
    fadeSeconds: number = MASTER_FADE_SECONDS,
  ): void {
    if (this.context.state === "closed") return;
    const now = this.context.currentTime;
    holdAudioParam(this.master.gain, now);
    this.master.gain.linearRampToValueAtTime(0, now + fadeSeconds);
    if (this.pauseTimer !== null) window.clearTimeout(this.pauseTimer);
    this.pauseTimer = window.setTimeout(() => {
      this.pauseTimer = null;
      if (
        !this.isPlaying
        && this.spectrumVoices.size === 0
        && this.context.state === "running"
      ) {
        void this.context.suspend().catch(() => undefined);
      }
    }, Math.ceil((fadeSeconds + 0.04) * 1_000));
  }

  private createSpectrumVoice(point: SpectrumGesturePoint): SpectrumVoice {
    const now = this.context.currentTime;
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const panner = this.context.createStereoPanner();
    const voice = {
      filter,
      gain,
      level: point.intensity,
      nodes: [source, filter, gain, panner],
      panner,
      source,
      startedAt: now,
    } satisfies SpectrumVoice;

    source.buffer = this.bufferFor(this.currentType);
    source.loop = true;
    filter.type = "bandpass";
    gain.gain.value = MINIMUM_ENVELOPE_GAIN;
    source
      .connect(filter)
      .connect(gain)
      .connect(panner)
      .connect(this.spectrumFilters.lowShelf);
    this.spectrumVoices.add(voice);
    this.updateSpectrumVoice(voice, point);
    gain.gain.setValueAtTime(MINIMUM_ENVELOPE_GAIN, now);
    gain.gain.exponentialRampToValueAtTime(
      point.intensity,
      now + SPECTRUM_ATTACK_SECONDS,
    );
    source.addEventListener("ended", () => {
      if (!this.spectrumVoices.delete(voice)) return;
      for (const [pointerId, hold] of this.spectrumHolds) {
        if (hold === voice) this.spectrumHolds.delete(pointerId);
      }
      for (const node of voice.nodes) node.disconnect();
      if (!this.isPlaying && this.spectrumVoices.size === 0) {
        this.fadeAndSuspendOutput();
      }
    }, { once: true });
    source.start(now, Math.random() * BUFFER_SECONDS);
    return voice;
  }

  private updateSpectrumVoice(
    voice: SpectrumVoice,
    point: SpectrumGesturePoint,
  ): void {
    if (this.context.state === "closed") return;
    const now = this.context.currentTime;
    const maximumFrequency = Math.max(this.sampleRate * 0.45, 40);
    const frequency = Math.min(
      Math.max(point.frequencyHz, 40),
      maximumFrequency,
    );
    voice.filter.frequency.setTargetAtTime(frequency, now, 0.018);
    voice.filter.Q.setTargetAtTime(
      Math.min(Math.max(point.qualityFactor, 0.5), 8),
      now,
      0.018,
    );
    voice.gain.gain.setTargetAtTime(
      Math.min(Math.max(point.intensity, 0.05), 0.8),
      now,
      0.024,
    );
    voice.level = Math.min(Math.max(point.intensity, 0.05), 0.8);
    voice.panner.pan.setTargetAtTime(
      Math.min(Math.max(point.pan, -0.35), 0.35),
      now,
      0.03,
    );
  }

  private releaseSpectrumVoice(
    voice: SpectrumVoice,
    isPulse: boolean,
  ): void {
    if (!this.spectrumVoices.has(voice) || this.context.state === "closed") {
      return;
    }
    const now = this.context.currentTime;
    const releaseAt = isPulse ? now + SPECTRUM_PULSE_SECONDS : now;
    const releaseEndAt = releaseAt + SPECTRUM_RELEASE_SECONDS;
    holdAudioParam(voice.gain.gain, now);
    if (releaseAt > now) {
      voice.gain.gain.setValueAtTime(voice.level, releaseAt);
    }
    voice.gain.gain.exponentialRampToValueAtTime(
      MINIMUM_ENVELOPE_GAIN,
      releaseEndAt,
    );
    voice.source.stop(releaseEndAt + 0.04);
  }

  private bufferFor(type: NoiseType): AudioBuffer {
    const cached = this.buffers.get(type);
    if (cached !== undefined) return cached;

    const frameCount = Math.ceil(this.sampleRate * BUFFER_SECONDS);
    const buffer = this.context.createBuffer(2, frameCount, this.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      fillNoiseChannel(type, buffer.getChannelData(channel));
    }
    this.buffers.set(type, buffer);
    return buffer;
  }

  private replaceVoice(type: NoiseType): void {
    const now = this.context.currentTime;
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = this.bufferFor(type);
    source.loop = true;
    gain.gain.value = this.activeVoice === null ? 1 : 0;
    source.connect(gain).connect(this.noiseFilters.lowShelf);
    source.addEventListener("ended", () => {
      source.disconnect();
      gain.disconnect();
    }, { once: true });
    source.start(now);

    const previous = this.activeVoice;
    this.activeVoice = { gain, source, type };
    if (previous === null) return;

    holdAudioParam(previous.gain.gain, now);
    holdAudioParam(gain.gain, now);
    previous.gain.gain.linearRampToValueAtTime(0, now + SOURCE_FADE_SECONDS);
    gain.gain.linearRampToValueAtTime(1, now + SOURCE_FADE_SECONDS);
    previous.source.stop(now + SOURCE_FADE_SECONDS + 0.03);
  }

  private scheduleWave(event: WaveEvent, crestAt: number): void {
    const now = this.context.currentTime;
    const startAt = Math.max(crestAt - event.approachSeconds, now + 0.03);
    const endAt = crestAt + event.washSeconds;
    const impactAt = crestAt + (event.breakStyle === "plunge" ? 0.06 : 0.18);
    const preCrashAt = Math.max(startAt + 0.04, crestAt - 0.16);
    const bodyPeakAt = crestAt + 0.12;
    const washStartAt = Math.max(startAt + 0.04, crestAt - 0.28);
    const washPeakAt = impactAt
      + (event.breakStyle === "plunge" ? 0.22 : 0.42);
    const undertowStartAt = crestAt + 0.42;
    const undertowPeakAt = Math.min(
      endAt - 0.7,
      crestAt + Math.min(2.1, event.washSeconds * 0.32),
    );
    const cavityStartAt = Math.max(startAt + 0.04, impactAt - 0.05);
    const cavityEndAt = Math.min(
      endAt - 0.04,
      impactAt + (event.breakStyle === "plunge" ? 1.05 : 0.62),
    );
    const noiseType = this.currentType;
    const bodySource = this.context.createBufferSource();
    const washSource = this.context.createBufferSource();
    const undertowSource = this.context.createBufferSource();
    const cavitySource = this.context.createBufferSource();
    const bodyFilter = this.context.createBiquadFilter();
    const washFilter = this.context.createBiquadFilter();
    const undertowFilter = this.context.createBiquadFilter();
    const cavityFilter = this.context.createBiquadFilter();
    const bodyGain = this.context.createGain();
    const washGain = this.context.createGain();
    const undertowGain = this.context.createGain();
    const cavityGain = this.context.createGain();
    const eventBus = this.context.createGain();
    const eventPanner = this.context.createStereoPanner();
    const bodyPeak = 0.22 + Math.sqrt(event.heightMeters / 1.38) * 0.3;
    const washPeak = 0.07 + event.breakIntensity * 0.18;
    const sourceSchedules: Array<Readonly<{
      source: AudioBufferSourceNode;
      startAt: number;
      stopAt: number;
    }>> = [];
    const sources: AudioBufferSourceNode[] = [
      bodySource,
      washSource,
      undertowSource,
      cavitySource,
    ];
    const nodes: AudioNode[] = [
      bodySource,
      washSource,
      undertowSource,
      cavitySource,
      bodyFilter,
      washFilter,
      undertowFilter,
      cavityFilter,
      bodyGain,
      washGain,
      undertowGain,
      cavityGain,
      eventPanner,
      eventBus,
    ];

    for (const source of sources) {
      source.buffer = this.bufferFor(noiseType);
      source.loop = true;
    }

    bodyFilter.type = "lowpass";
    bodyFilter.Q.value = 0.48;
    bodyFilter.frequency.setValueAtTime(
      Math.max(event.rumbleCutoffFrequencyHz * 0.32, 120),
      startAt,
    );
    bodyFilter.frequency.exponentialRampToValueAtTime(
      event.rumbleCutoffFrequencyHz,
      bodyPeakAt,
    );
    bodyFilter.frequency.exponentialRampToValueAtTime(
      Math.max(event.rumbleCutoffFrequencyHz * 0.34, 260),
      endAt,
    );

    washFilter.type = "bandpass";
    washFilter.Q.value = 0.5;
    washFilter.frequency.setValueAtTime(
      Math.max(event.washCenterFrequencyHz * 0.64, 420),
      washStartAt,
    );
    washFilter.frequency.exponentialRampToValueAtTime(
      event.washCenterFrequencyHz,
      washPeakAt,
    );
    washFilter.frequency.exponentialRampToValueAtTime(
      Math.max(event.washCenterFrequencyHz * 0.58, 460),
      endAt,
    );

    undertowFilter.type = "lowpass";
    undertowFilter.Q.value = 0.4;
    undertowFilter.frequency.setValueAtTime(
      Math.max(event.rumbleCutoffFrequencyHz * 0.38, 170),
      undertowStartAt,
    );
    undertowFilter.frequency.exponentialRampToValueAtTime(
      Math.max(event.rumbleCutoffFrequencyHz * 0.56, 240),
      undertowPeakAt,
    );
    undertowFilter.frequency.exponentialRampToValueAtTime(180, endAt);

    cavityFilter.type = "bandpass";
    cavityFilter.Q.value = event.breakStyle === "plunge" ? 0.72 : 0.48;
    cavityFilter.frequency.setValueAtTime(
      event.cavityCenterFrequencyHz,
      cavityStartAt,
    );
    cavityFilter.frequency.exponentialRampToValueAtTime(
      event.cavityCenterFrequencyHz * 0.72,
      cavityEndAt,
    );

    bodyGain.gain.setValueAtTime(MINIMUM_ENVELOPE_GAIN, startAt);
    bodyGain.gain.exponentialRampToValueAtTime(bodyPeak * 0.64, preCrashAt);
    bodyGain.gain.exponentialRampToValueAtTime(bodyPeak, bodyPeakAt);
    bodyGain.gain.exponentialRampToValueAtTime(bodyPeak * 0.36, washPeakAt);
    bodyGain.gain.exponentialRampToValueAtTime(MINIMUM_ENVELOPE_GAIN, endAt);

    washGain.gain.setValueAtTime(MINIMUM_ENVELOPE_GAIN, washStartAt);
    washGain.gain.exponentialRampToValueAtTime(washPeak * 0.55, impactAt);
    washGain.gain.exponentialRampToValueAtTime(washPeak, washPeakAt);
    washGain.gain.exponentialRampToValueAtTime(
      washPeak * 0.42,
      undertowPeakAt,
    );
    washGain.gain.exponentialRampToValueAtTime(MINIMUM_ENVELOPE_GAIN, endAt);

    undertowGain.gain.setValueAtTime(
      MINIMUM_ENVELOPE_GAIN,
      undertowStartAt,
    );
    undertowGain.gain.exponentialRampToValueAtTime(
      event.undertowIntensity,
      undertowPeakAt,
    );
    undertowGain.gain.exponentialRampToValueAtTime(
      MINIMUM_ENVELOPE_GAIN,
      endAt,
    );

    cavityGain.gain.setValueAtTime(MINIMUM_ENVELOPE_GAIN, cavityStartAt);
    cavityGain.gain.linearRampToValueAtTime(
      event.cavityIntensity,
      impactAt,
    );
    cavityGain.gain.exponentialRampToValueAtTime(
      MINIMUM_ENVELOPE_GAIN,
      cavityEndAt,
    );

    eventBus.gain.value = 0.68;
    eventPanner.pan.setValueAtTime(event.pan, startAt);
    eventPanner.pan.linearRampToValueAtTime(event.pan * -0.35, endAt);

    bodySource.connect(bodyFilter).connect(bodyGain).connect(eventPanner);
    washSource.connect(washFilter).connect(washGain).connect(eventPanner);
    undertowSource
      .connect(undertowFilter)
      .connect(undertowGain)
      .connect(eventPanner);
    cavitySource
      .connect(cavityFilter)
      .connect(cavityGain)
      .connect(eventPanner);
    eventPanner.connect(eventBus);
    eventBus.connect(this.waveFilters.lowShelf);

    sourceSchedules.push(
      { source: bodySource, startAt, stopAt: endAt + 0.08 },
      { source: washSource, startAt: washStartAt, stopAt: endAt + 0.08 },
      {
        source: undertowSource,
        startAt: undertowStartAt,
        stopAt: endAt + 0.08,
      },
      {
        source: cavitySource,
        startAt: cavityStartAt,
        stopAt: cavityEndAt + 0.06,
      },
    );

    for (const burst of event.foamBursts) {
      const burstStartAt = impactAt + burst.delaySeconds;
      const burstPeakAt = burstStartAt
        + (event.breakStyle === "plunge" ? 0.028 : 0.052);
      const burstEndAt = burstStartAt + burst.durationSeconds;
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      const panner = this.context.createStereoPanner();

      source.buffer = this.bufferFor(noiseType);
      source.loop = true;
      filter.type = "bandpass";
      filter.Q.value = burst.qualityFactor;
      filter.frequency.setValueAtTime(
        burst.centerFrequencyHz * 0.72,
        burstStartAt,
      );
      filter.frequency.exponentialRampToValueAtTime(
        burst.centerFrequencyHz,
        burstPeakAt,
      );
      filter.frequency.exponentialRampToValueAtTime(
        burst.centerFrequencyHz * 1.12,
        burstEndAt,
      );
      gain.gain.setValueAtTime(MINIMUM_ENVELOPE_GAIN, burstStartAt);
      gain.gain.linearRampToValueAtTime(burst.gain, burstPeakAt);
      gain.gain.exponentialRampToValueAtTime(
        MINIMUM_ENVELOPE_GAIN,
        burstEndAt,
      );
      panner.pan.setValueAtTime(burst.pan, burstStartAt);
      panner.pan.linearRampToValueAtTime(burst.pan * 0.82, burstEndAt);

      source.connect(filter).connect(gain).connect(panner).connect(eventBus);
      sources.push(source);
      nodes.push(source, filter, gain, panner);
      sourceSchedules.push({
        source,
        startAt: burstStartAt,
        stopAt: burstEndAt + 0.04,
      });
    }

    const voice = { nodes, sources } satisfies WaveVoice;
    this.waveVoices.add(voice);

    let remainingSources = sources.length;
    const release = () => {
      remainingSources -= 1;
      if (remainingSources > 0) return;
      if (!this.waveVoices.delete(voice)) return;
      for (const node of nodes) node.disconnect();
    };
    for (const source of sources) {
      source.addEventListener("ended", release, { once: true });
    }
    for (const schedule of sourceSchedules) {
      schedule.source.start(
        schedule.startAt,
        Math.random() * BUFFER_SECONDS,
      );
      schedule.source.stop(schedule.stopAt);
    }
  }

  private scheduleWaveWindow(): void {
    if (!this.isPlaying || this.context.state === "closed") return;
    const now = this.context.currentTime;
    this.nextWaveCrestAt ??= now + WAVE_INITIAL_CREST_SECONDS;
    const horizon = now + WAVE_LOOKAHEAD_SECONDS;
    let scheduled = 0;

    while (this.nextWaveCrestAt <= horizon && scheduled < 4) {
      const next = nextWaveEvent(
        this.waveScene,
        this.currentWavePace,
        this.random,
      );
      this.waveScene = next.state;
      this.scheduleWave(next.event, this.nextWaveCrestAt);
      this.nextWaveCrestAt += next.event.intervalSeconds;
      scheduled += 1;
    }
  }

  private startWaveScheduler(): void {
    if (this.waveSchedulerTimer !== null) return;
    const now = this.context.currentTime;
    if (
      this.nextWaveCrestAt === null
      || this.nextWaveCrestAt < now + 0.1
    ) {
      this.nextWaveCrestAt = now + WAVE_INITIAL_CREST_SECONDS;
    }
    this.scheduleWaveWindow();
    this.waveSchedulerTimer = window.setInterval(
      () => this.scheduleWaveWindow(),
      WAVE_SCHEDULER_INTERVAL_MS,
    );
  }

  private stopWaveScheduler(): void {
    if (this.waveSchedulerTimer === null) return;
    window.clearInterval(this.waveSchedulerTimer);
    this.waveSchedulerTimer = null;
  }

}
