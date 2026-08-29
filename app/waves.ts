import { clampControl, type RandomSource } from "./noise";

export const DEFAULT_WAVE_PACE = 39;
export const DEFAULT_WAVE_VOLUME = 88;

const GRAVITY_METERS_PER_SECOND_SQUARED = 9.80665;
const MINIMUM_WAVE_PERIOD_SECONDS = 4.8;
const MAXIMUM_WAVE_PERIOD_SECONDS = 16;
const MINIMUM_GROUP_LENGTH = 5;
const GROUP_LENGTH_VARIANCE = 5;

export type BreakStyle = "plunge" | "spill";

export type FoamBurst = Readonly<{
  centerFrequencyHz: number;
  delaySeconds: number;
  durationSeconds: number;
  gain: number;
  pan: number;
  qualityFactor: number;
}>;

export type WaveEvent = Readonly<{
  approachSeconds: number;
  breakIntensity: number;
  breakStyle: BreakStyle;
  cavityCenterFrequencyHz: number;
  cavityIntensity: number;
  foamBursts: readonly FoamBurst[];
  heightMeters: number;
  intervalSeconds: number;
  pan: number;
  rumbleCutoffFrequencyHz: number;
  undertowIntensity: number;
  washSeconds: number;
  washCenterFrequencyHz: number;
}>;

export type WaveSceneState = Readonly<{
  groupEnergy: number;
  groupLength: number;
  previousBreakIntensity: number;
  previousHeightRatio: number;
  waveInGroup: number;
  waveIndex: number;
  wavesSincePlunge: number;
}>;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function unitRandom(random: RandomSource): number {
  const value = random();
  return Number.isFinite(value) ? clamp(value, 0, 1) : 0.5;
}

function centeredRandom(random: RandomSource): number {
  return (unitRandom(random) + unitRandom(random)) / 2;
}

function sampleGroupLength(random: RandomSource): number {
  return MINIMUM_GROUP_LENGTH
    + Math.floor(unitRandom(random) * GROUP_LENGTH_VARIANCE);
}

function sampleGroupEnergy(random: RandomSource): number {
  return 0.78 + centeredRandom(random) * 0.42;
}

function sampleRayleighHeightRatio(random: RandomSource): number {
  const uniform = clamp(unitRandom(random), Number.EPSILON, 1 - Number.EPSILON);
  const rayleigh = Math.sqrt(-2 * Math.log(1 - uniform));
  return rayleigh / Math.sqrt(Math.PI / 2);
}

function smoothStep(value: number): number {
  const normalized = clamp(value, 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

export function wavePeriodSeconds(pace: number): number {
  const normalized = clampControl(pace) / 100;
  return MAXIMUM_WAVE_PERIOD_SECONDS
    * Math.pow(MINIMUM_WAVE_PERIOD_SECONDS / MAXIMUM_WAVE_PERIOD_SECONDS, normalized);
}

export function waveFrequencyHz(pace: number): number {
  return 1 / wavePeriodSeconds(pace);
}

export function wavePaceAtPeriod(periodSeconds: number): number {
  const safePeriod = clamp(
    periodSeconds,
    MINIMUM_WAVE_PERIOD_SECONDS,
    MAXIMUM_WAVE_PERIOD_SECONDS,
  );
  const normalized = Math.log(safePeriod / MAXIMUM_WAVE_PERIOD_SECONDS)
    / Math.log(MINIMUM_WAVE_PERIOD_SECONDS / MAXIMUM_WAVE_PERIOD_SECONDS);
  return clampControl(normalized * 100);
}

export function waveCrashIntensity(
  heightMeters: number,
  periodSeconds: number,
): number {
  const safeHeight = clamp(heightMeters, 0.1, 2.2);
  const safePeriod = clamp(
    periodSeconds,
    MINIMUM_WAVE_PERIOD_SECONDS * 0.7,
    MAXIMUM_WAVE_PERIOD_SECONDS * 1.4,
  );
  const deepWaterWavelength = (
    GRAVITY_METERS_PER_SECOND_SQUARED
    * safePeriod
    * safePeriod
  ) / (2 * Math.PI);
  const steepness = safeHeight / deepWaterWavelength;
  const heightEnergy = clamp(
    (safeHeight * safeHeight - 0.04) / (1.38 * 1.38 - 0.04),
    0,
    1,
  );
  const steepnessEnergy = smoothStep(steepness / 0.025);
  return clamp(
    0.06 + Math.sqrt(heightEnergy) * 0.5 + steepnessEnergy * 0.44,
    0.06,
    1,
  );
}

function sampleFoamBursts(
  breakIntensity: number,
  breakStyle: BreakStyle,
  pan: number,
  washSeconds: number,
  random: RandomSource,
): readonly FoamBurst[] {
  const burstCount = clamp(
    3
      + Math.floor(breakIntensity * 4)
      + (breakStyle === "plunge" ? 2 : 0),
    3,
    9,
  );
  const spreadSeconds = clamp(
    0.72
      + breakIntensity * 1.35
      + (breakStyle === "spill" ? 0.72 : 0.18),
    0.8,
    2.8,
  );
  const bursts: FoamBurst[] = [];

  for (let index = 0; index < burstCount; index += 1) {
    const progress = burstCount === 1 ? 0 : index / (burstCount - 1);
    const delayJitter = (unitRandom(random) * 2 - 1) * 0.14;
    const delaySeconds = clamp(
      (breakStyle === "plunge" ? 0.02 : 0.1)
        + progress * spreadSeconds
        + delayJitter,
      0,
      washSeconds * 0.55,
    );
    const spectralRise = 0.8 + progress * 0.68;
    const centerFrequencyHz = clamp(
      (820 + breakIntensity * 1_850)
        * spectralRise
        * (0.76 + unitRandom(random) * 0.48),
      480,
      6_400,
    );
    const durationSeconds = clamp(
      (breakStyle === "spill" ? 0.34 : 0.2)
        + unitRandom(random) * 0.34
        + progress * 0.18,
      0.18,
      0.9,
    );
    const gain = clamp(
      (0.07 + breakIntensity * 0.25)
        * (0.68 + unitRandom(random) * 0.5)
        * (1 - progress * 0.38),
      0.045,
      0.42,
    );
    const panSpread = 0.12 + breakIntensity * 0.18;

    bursts.push({
      centerFrequencyHz,
      delaySeconds,
      durationSeconds,
      gain,
      pan: clamp(
        pan + (unitRandom(random) * 2 - 1) * panSpread,
        -0.48,
        0.48,
      ),
      qualityFactor: 0.38 + unitRandom(random) * 0.54,
    });
  }

  return bursts;
}

export function createWaveSceneState(
  random: RandomSource = Math.random,
): WaveSceneState {
  return {
    groupEnergy: sampleGroupEnergy(random),
    groupLength: sampleGroupLength(random),
    previousBreakIntensity: 0.22 + unitRandom(random) * 0.18,
    previousHeightRatio: 0.78 + unitRandom(random) * 0.34,
    waveInGroup: 0,
    waveIndex: 0,
    wavesSincePlunge: 3,
  };
}

export function nextWaveEvent(
  state: WaveSceneState,
  pace: number,
  random: RandomSource = Math.random,
): Readonly<{ event: WaveEvent; state: WaveSceneState }> {
  const basePeriod = wavePeriodSeconds(pace);
  const phase = state.waveInGroup / Math.max(state.groupLength - 1, 1);
  const groupEnvelope = 0.72 + Math.sin(phase * Math.PI) * 0.38;
  const targetHeightRatio = clamp(
    sampleRayleighHeightRatio(random) * groupEnvelope * state.groupEnergy,
    0.34,
    1.9,
  );
  const heightRatio = clamp(
    state.previousHeightRatio * 0.58 + targetHeightRatio * 0.42,
    0.34,
    1.9,
  );
  const heightMeters = clamp(0.72 * heightRatio, 0.24, 1.38);
  const intervalScale = 0.88
    + unitRandom(random) * 0.24
    + clamp((heightRatio - 1) * 0.035, -0.025, 0.04);
  const intervalSeconds = clamp(
    basePeriod * intervalScale,
    basePeriod * 0.74,
    basePeriod * 1.34,
  );
  const physicalBreakEnergy = waveCrashIntensity(heightMeters, intervalSeconds);
  const breakTarget = clamp(
    physicalBreakEnergy * 0.78
      + (centeredRandom(random) - 0.5) * 0.26
      + (groupEnvelope - 0.72) * 0.12,
    0.08,
    0.9,
  );
  const breakIntensity = clamp(
    state.previousBreakIntensity * 0.24 + breakTarget * 0.76,
    0.08,
    0.9,
  );
  const shortPeriodWeight = clamp(
    (10 - intervalSeconds) / 6,
    0,
    1,
  );
  const plungeLikelihood = clamp(
    0.025
      + Math.pow(breakIntensity, 1.6) * 0.3
      + shortPeriodWeight * 0.08,
    0.025,
    0.4,
  );
  const breakStyle: BreakStyle = (
    state.wavesSincePlunge >= 2
    && unitRandom(random) < plungeLikelihood
  )
    ? "plunge"
    : "spill";
  const approachSeconds = clamp(
    intervalSeconds * (0.24 + heightRatio * 0.05),
    1.4,
    4.4,
  );
  const washSeconds = clamp(
    3.8 + heightRatio * 2.35 + (breakStyle === "spill" ? 0.65 : 0),
    4.2,
    8.8,
  );
  const pan = (unitRandom(random) * 2 - 1) * 0.34;
  const cavityIntensity = breakStyle === "plunge"
    ? clamp(
      breakIntensity * (0.22 + unitRandom(random) * 0.28),
      0.06,
      0.42,
    )
    : clamp(
      breakIntensity * (0.025 + unitRandom(random) * 0.05),
      0.008,
      0.055,
    );
  const foamBursts = sampleFoamBursts(
    breakIntensity,
    breakStyle,
    pan,
    washSeconds,
    random,
  );
  const nextWaveInGroup = state.waveInGroup + 1;
  const startsNewGroup = nextWaveInGroup >= state.groupLength;

  return {
    event: {
      approachSeconds,
      breakIntensity,
      breakStyle,
      cavityCenterFrequencyHz: 220
        + unitRandom(random) * 250
        + breakIntensity * 120,
      cavityIntensity,
      foamBursts,
      heightMeters,
      intervalSeconds,
      pan,
      rumbleCutoffFrequencyHz: 380
        + heightRatio * 820
        + unitRandom(random) * 180,
      undertowIntensity: clamp(
        0.1 + heightRatio * 0.085 + unitRandom(random) * 0.055,
        0.12,
        0.32,
      ),
      washSeconds,
      washCenterFrequencyHz: 720
        + breakIntensity * 1_650
        + unitRandom(random) * 620,
    },
    state: {
      groupEnergy: startsNewGroup
        ? sampleGroupEnergy(random)
        : state.groupEnergy,
      groupLength: startsNewGroup ? sampleGroupLength(random) : state.groupLength,
      previousBreakIntensity: breakIntensity,
      previousHeightRatio: heightRatio,
      waveInGroup: startsNewGroup ? 0 : nextWaveInGroup,
      waveIndex: state.waveIndex + 1,
      wavesSincePlunge: breakStyle === "plunge"
        ? 0
        : Math.min(state.wavesSincePlunge + 1, 99),
    },
  };
}
