import { afterEach, describe, expect, test } from "bun:test";

import { SoundEngine } from "./audio-engine";
import { spectrumGestureAtPosition, toneProfile } from "./noise";
import { soundModeDefinition } from "./sound-modes";

class VerificationAudioParam {
  value = 0;

  cancelAndHoldAtTime(): void {}

  cancelScheduledValues(): void {}

  exponentialRampToValueAtTime(value: number): void {
    this.value = value;
  }

  linearRampToValueAtTime(value: number): void {
    this.value = value;
  }

  setTargetAtTime(value: number): void {
    this.value = value;
  }

  setValueAtTime(value: number): void {
    this.value = value;
  }
}

class VerificationAudioNode {
  connect<T>(node: T): T {
    return node;
  }

  disconnect(): void {}
}

class VerificationBuffer {
  readonly channels: Float32Array[];
  readonly length: number;
  readonly numberOfChannels: number;
  readonly sampleRate: number;

  constructor(
    numberOfChannels: number,
    length: number,
    sampleRate: number,
  ) {
    this.length = length;
    this.numberOfChannels = numberOfChannels;
    this.sampleRate = sampleRate;
    this.channels = Array.from(
      { length: numberOfChannels },
      () => new Float32Array(length),
    );
  }

  getChannelData(channel: number): Float32Array {
    return this.channels[channel]!;
  }
}

class VerificationBufferSource extends VerificationAudioNode {
  buffer: VerificationBuffer | null = null;
  loop = false;
  stopCount = 0;

  addEventListener(): void {}

  start(): void {}

  stop(): void {
    this.stopCount += 1;
  }
}

class VerificationGain extends VerificationAudioNode {
  readonly gain = new VerificationAudioParam();
}

class VerificationOscillator extends VerificationAudioNode {
  readonly frequency = new VerificationAudioParam();
  startCount = 0;
  stopCount = 0;
  type = "sine";

  addEventListener(): void {}

  start(): void {
    this.startCount += 1;
  }

  stop(): void {
    this.stopCount += 1;
  }
}

class VerificationBiquad extends VerificationAudioNode {
  readonly frequency = new VerificationAudioParam();
  readonly gain = new VerificationAudioParam();
  readonly Q = new VerificationAudioParam();
  type = "lowpass";
}

class VerificationAnalyser extends VerificationAudioNode {
  fftSize = 2_048;
  maxDecibels = -18;
  minDecibels = -96;
  smoothingTimeConstant = 0.78;
}

class VerificationCompressor extends VerificationAudioNode {
  readonly attack = new VerificationAudioParam();
  readonly knee = new VerificationAudioParam();
  readonly ratio = new VerificationAudioParam();
  readonly release = new VerificationAudioParam();
  readonly threshold = new VerificationAudioParam();
}

class VerificationPanner extends VerificationAudioNode {
  readonly pan = new VerificationAudioParam();
}

class VerificationAudioContext {
  static latest: VerificationAudioContext | null = null;

  readonly buffers: VerificationBuffer[] = [];
  readonly bufferSources: VerificationBufferSource[] = [];
  readonly destination = new VerificationAudioNode();
  readonly filters: VerificationBiquad[] = [];
  readonly gains: VerificationGain[] = [];
  readonly oscillators: VerificationOscillator[] = [];
  currentTime = 0;
  sampleRate = 1_000;
  state = "suspended";

  constructor() {
    VerificationAudioContext.latest = this;
  }

  close(): Promise<void> {
    this.state = "closed";
    return Promise.resolve();
  }

  createAnalyser(): VerificationAnalyser {
    return new VerificationAnalyser();
  }

  createBiquadFilter(): VerificationBiquad {
    const filter = new VerificationBiquad();
    this.filters.push(filter);
    return filter;
  }

  createBuffer(
    numberOfChannels: number,
    length: number,
    sampleRate: number,
  ): VerificationBuffer {
    const buffer = new VerificationBuffer(
      numberOfChannels,
      length,
      sampleRate,
    );
    this.buffers.push(buffer);
    return buffer;
  }

  createBufferSource(): VerificationBufferSource {
    const source = new VerificationBufferSource();
    this.bufferSources.push(source);
    return source;
  }

  createDynamicsCompressor(): VerificationCompressor {
    return new VerificationCompressor();
  }

  createGain(): VerificationGain {
    const gain = new VerificationGain();
    this.gains.push(gain);
    return gain;
  }

  createOscillator(): VerificationOscillator {
    const oscillator = new VerificationOscillator();
    this.oscillators.push(oscillator);
    return oscillator;
  }

  createStereoPanner(): VerificationPanner {
    return new VerificationPanner();
  }

  resume(): Promise<void> {
    this.state = "running";
    return Promise.resolve();
  }

  suspend(): Promise<void> {
    this.state = "suspended";
    return Promise.resolve();
  }
}

const audioContextDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "AudioContext",
);
const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

afterEach(() => {
  VerificationAudioContext.latest = null;
  if (audioContextDescriptor === undefined) {
    Reflect.deleteProperty(globalThis, "AudioContext");
  } else {
    Object.defineProperty(globalThis, "AudioContext", audioContextDescriptor);
  }
  if (windowDescriptor === undefined) {
    Reflect.deleteProperty(globalThis, "window");
  } else {
    Object.defineProperty(globalThis, "window", windowDescriptor);
  }
});

describe("generated sound audio graph", () => {
  test("shares warmth filters across noise, surf, and gestures", async () => {
    Reflect.set(globalThis, "window", globalThis);
    Reflect.set(globalThis, "AudioContext", VerificationAudioContext);
    const engine = new SoundEngine({
      energy: "balanced",
      noiseType: "brown",
      noiseVolume: 34,
      soundMode: "sleep",
      tone: 58,
      wavePace: 32,
      waveVolume: 36,
    }, () => 0.25);
    const context = VerificationAudioContext.latest;

    expect(context).not.toBeNull();
    expect(context!.filters).toHaveLength(9);
    expect(context!.oscillators).toHaveLength(1);
    expect(context!.oscillators[0]!.startCount).toBe(1);

    await engine.play();
    expect(context!.gains[3]!.gain.value).toBe(1);
    expect(context!.oscillators).toHaveLength(1);

    const coloredBuffers = context!.buffers.filter((buffer) => buffer.length > 1);
    const renderedBuffers = new Set(
      context!.bufferSources
        .map((source) => source.buffer)
        .filter((buffer) => buffer !== null && buffer.length > 1),
    );

    expect(coloredBuffers).toHaveLength(1);
    expect(renderedBuffers).toEqual(new Set(coloredBuffers));
    expect(context!.bufferSources.length).toBeGreaterThanOrEqual(9);

    engine.setTone(83);
    const expected = toneProfile(83);
    const [noiseLowShelf, noiseHighShelf, noiseLowPass] = context!.filters;
    const [waveLowShelf, waveHighShelf, waveLowPass] = context!.filters.slice(3);
    const [spectrumLowShelf, spectrumHighShelf, spectrumLowPass] = (
      context!.filters.slice(6)
    );

    expect(noiseLowShelf!.gain.value).toBe(expected.lowShelfGainDb);
    expect(waveLowShelf!.gain.value).toBe(noiseLowShelf!.gain.value);
    expect(spectrumLowShelf!.gain.value).toBe(noiseLowShelf!.gain.value);
    expect(noiseHighShelf!.gain.value).toBe(expected.highShelfGainDb);
    expect(waveHighShelf!.gain.value).toBe(noiseHighShelf!.gain.value);
    expect(spectrumHighShelf!.gain.value).toBe(noiseHighShelf!.gain.value);
    expect(noiseLowPass!.frequency.value).toBe(expected.lowPassFrequencyHz);
    expect(waveLowPass!.frequency.value).toBe(noiseLowPass!.frequency.value);
    expect(spectrumLowPass!.frequency.value).toBe(noiseLowPass!.frequency.value);

    engine.setSessionPhase("break");
    expect(context!.gains[3]!.gain.value).toBeCloseTo(0.58);
    engine.setSessionPhase("work");
    expect(context!.gains[3]!.gain.value).toBe(1);

    engine.pause();
    expect(context!.gains[3]!.gain.value).toBe(0);
    engine.dispose();
    expect(context!.oscillators[0]!.stopCount).toBe(1);
  });

  test("gives each wellness mode a distinct movement envelope", () => {
    Reflect.set(globalThis, "window", globalThis);
    Reflect.set(globalThis, "AudioContext", VerificationAudioContext);
    const engine = new SoundEngine({
      energy: "balanced",
      noiseType: "brown",
      noiseVolume: 38,
      soundMode: "sleep",
      tone: 25,
      wavePace: 39,
      waveVolume: 88,
    });
    const context = VerificationAudioContext.latest!;
    const oscillator = context.oscillators[0]!;
    const movementGain = context.gains[5]!;
    const sleep = soundModeDefinition("sleep").motion;

    expect(oscillator.frequency.value).toBeCloseTo(1 / sleep.periodSeconds);
    expect(movementGain.gain.value).toBeCloseTo(
      0.42 * 0.38 * 0.38 * sleep.depth,
    );

    engine.setSoundProfile({
      energy: "balanced",
      soundMode: "calm",
    });
    const calm = soundModeDefinition("calm").motion;
    expect(oscillator.frequency.value).toBeCloseTo(1 / calm.periodSeconds);
    expect(movementGain.gain.value).toBeCloseTo(
      0.42 * 0.38 * 0.38 * calm.depth,
    );

    engine.setNoiseVolume(50);
    expect(movementGain.gain.value).toBeCloseTo(0.42 * 0.5 * 0.5 * calm.depth);

    const masterGain = context.gains[4]!.gain.value;
    engine.setSoundProfile({
      energy: "strong",
      soundMode: "focus",
    });
    expect(oscillator.frequency.value).toBeGreaterThan(0.5);
    expect(context.gains[4]!.gain.value).toBe(masterGain);
    engine.dispose();
  });

  test("turns taps and holds into movable band-pass noise voices", async () => {
    Reflect.set(globalThis, "window", globalThis);
    Reflect.set(globalThis, "AudioContext", VerificationAudioContext);
    const engine = new SoundEngine({
      energy: "balanced",
      noiseType: "pink",
      noiseVolume: 38,
      soundMode: "sleep",
      tone: 25,
      wavePace: 39,
      waveVolume: 88,
    });
    const context = VerificationAudioContext.latest!;
    const tap = spectrumGestureAtPosition(0.25, 0.75, 40, 20_000);
    const tapStart = engine.beginSpectrumGesture(1, tap);
    engine.endSpectrumGesture(1);
    await tapStart;
    expect(context.gains[3]!.gain.value).toBe(0);

    const tapFilter = context.filters.at(-1)!;
    const tapSource = context.bufferSources.at(-1)!;
    expect(tapFilter.type).toBe("bandpass");
    expect(tapFilter.Q.value).toBe(tap.qualityFactor);
    expect(tapSource.stopCount).toBe(1);

    const hold = spectrumGestureAtPosition(0.1, 0.2, 40, 20_000);
    await engine.beginSpectrumGesture(2, hold);
    const holdFilter = context.filters.at(-1)!;
    const holdSource = context.bufferSources.at(-1)!;
    expect(holdSource.stopCount).toBe(0);
    expect(holdFilter.frequency.value).toBeCloseTo(hold.frequencyHz);

    const moved = spectrumGestureAtPosition(0.8, 0.4, 40, 20_000);
    engine.updateSpectrumGesture(2, moved);
    expect(holdFilter.frequency.value).toBe(450);
    expect(holdFilter.Q.value).toBe(moved.qualityFactor);
    engine.endSpectrumGesture(2);
    expect(holdSource.stopCount).toBe(1);

    engine.dispose();
  });
});
