export const NOISE_TYPES = ["brown", "pink", "white"] as const;
export type NoiseType = (typeof NOISE_TYPES)[number];

export type NoiseOption = Readonly<{
  detail: string;
  label: string;
  slopeDbPerOctave: number;
  type: NoiseType;
}>;

export const NOISE_OPTIONS = [
  { detail: "Deep", label: "Brown", slopeDbPerOctave: -6, type: "brown" },
  { detail: "Soft", label: "Pink", slopeDbPerOctave: -3, type: "pink" },
  { detail: "Clear", label: "White", slopeDbPerOctave: 0, type: "white" },
] as const satisfies readonly NoiseOption[];

export const DEFAULT_NOISE_TYPE: NoiseType = "brown";
export const DEFAULT_NOISE_VOLUME = 38;
export const DEFAULT_TONE = 25;

export type ToneProfile = Readonly<{
  highShelfGainDb: number;
  lowPassFrequencyHz: number;
  lowShelfGainDb: number;
}>;

export type RandomSource = () => number;

export type SpectrumGesturePoint = Readonly<{
  frequencyHz: number;
  intensity: number;
  normalizedX: number;
  normalizedY: number;
  pan: number;
  qualityFactor: number;
}>;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function clampControl(value: number): number {
  return Number.isFinite(value) ? clamp(value, 0, 100) : 0;
}

export function toneProfile(value: number): ToneProfile {
  const normalized = clampControl(value) / 100;
  return {
    highShelfGainDb: -7 + normalized * 12,
    lowPassFrequencyHz: 2_400 * Math.pow(20_000 / 2_400, normalized),
    lowShelfGainDb: 3 - normalized * 5,
  };
}

export function volumeToGain(value: number): number {
  const normalized = clampControl(value) / 100;
  return 0.42 * normalized * normalized;
}

function randomBipolar(random: RandomSource): number {
  const value = random();
  const normalized = Number.isFinite(value) ? clamp(value, 0, 1) : 0.5;
  return normalized * 2 - 1;
}

function boundedSample(value: number): number {
  return clamp(value, -1, 1);
}

export function fillNoiseChannel(
  type: NoiseType,
  target: Float32Array,
  random: RandomSource = Math.random,
): void {
  if (type === "white") {
    for (let index = 0; index < target.length; index += 1) {
      target[index] = randomBipolar(random) * 0.72;
    }
    return;
  }

  if (type === "brown") {
    let previous = 0;
    for (let index = 0; index < target.length; index += 1) {
      previous = (previous + randomBipolar(random) * 0.02) / 1.02;
      target[index] = boundedSample(previous * 3.5);
    }
    return;
  }

  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;

  for (let index = 0; index < target.length; index += 1) {
    const white = randomBipolar(random);
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    target[index] = boundedSample(pink * 0.11);
  }
}

export function frequencyAtPosition(
  position: number,
  minimumFrequency: number,
  maximumFrequency: number,
): number {
  const safeMinimum = Math.max(minimumFrequency, 1);
  const safeMaximum = Math.max(maximumFrequency, safeMinimum);
  return safeMinimum * Math.pow(safeMaximum / safeMinimum, clamp(position, 0, 1));
}

export function positionAtFrequency(
  frequency: number,
  minimumFrequency: number,
  maximumFrequency: number,
): number {
  const safeMinimum = Math.max(minimumFrequency, 1);
  const safeMaximum = Math.max(maximumFrequency, safeMinimum);
  const safeFrequency = clamp(frequency, safeMinimum, safeMaximum);
  if (safeMinimum === safeMaximum) return 0;
  return Math.log(safeFrequency / safeMinimum) / Math.log(safeMaximum / safeMinimum);
}

export function spectrumGestureAtPosition(
  horizontalPosition: number,
  verticalPosition: number,
  minimumFrequency: number,
  maximumFrequency: number,
): SpectrumGesturePoint {
  const normalizedX = clampControl(horizontalPosition * 100) / 100;
  const normalizedY = clampControl(verticalPosition * 100) / 100;
  const intensity = 0.2 + Math.pow(1 - normalizedY, 1.35) * 0.52;
  return {
    frequencyHz: frequencyAtPosition(
      normalizedX,
      minimumFrequency,
      maximumFrequency,
    ),
    intensity,
    normalizedX,
    normalizedY,
    pan: (normalizedX - 0.5) * 0.48,
    qualityFactor: 1.8 + normalizedY * 2.6,
  };
}

export function noiseShapeDb(type: NoiseType, tone: number, frequency: number): number {
  const safeFrequency = clamp(frequency, 20, 24_000);
  const option = NOISE_OPTIONS.find((candidate) => candidate.type === type);
  const slope = option?.slopeDbPerOctave ?? 0;
  const profile = toneProfile(tone);
  const base = slope * Math.log2(safeFrequency / 1_000);
  const lowShelfWeight = 1 / (1 + Math.pow(safeFrequency / 280, 3));
  const highShelfWeight = 1 - 1 / (1 + Math.pow(safeFrequency / 2_800, 3));
  const lowPassRollOff = safeFrequency > profile.lowPassFrequencyHz
    ? -12 * Math.log2(safeFrequency / profile.lowPassFrequencyHz)
    : 0;
  return clamp(
    base
      + profile.lowShelfGainDb * lowShelfWeight
      + profile.highShelfGainDb * highShelfWeight
      + lowPassRollOff,
    -60,
    24,
  );
}
