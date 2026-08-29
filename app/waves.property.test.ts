import { describe, expect, test } from "bun:test";

import {
  createWaveSceneState,
  nextWaveEvent,
  waveCrashIntensity,
  wavePeriodSeconds,
} from "./waves";

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function correlation(left: readonly number[], right: readonly number[]): number {
  const leftMean = left.reduce((total, value) => total + value, 0) / left.length;
  const rightMean = right.reduce((total, value) => total + value, 0) / right.length;
  let covariance = 0;
  let leftVariance = 0;
  let rightVariance = 0;

  for (let index = 0; index < left.length; index += 1) {
    const leftDelta = left[index]! - leftMean;
    const rightDelta = right[index]! - rightMean;
    covariance += leftDelta * rightDelta;
    leftVariance += leftDelta * leftDelta;
    rightVariance += rightDelta * rightDelta;
  }

  return covariance / Math.sqrt(leftVariance * rightVariance);
}

describe("wave scene properties", () => {
  test("keeps every seeded sea state finite, bounded, and non-repeating", () => {
    const failures: string[] = [];

    for (const pace of [0, 32, 68, 100]) {
      const basePeriod = wavePeriodSeconds(pace);
      for (let seed = 1; seed <= 48; seed += 1) {
        const random = seededRandom(seed * 0x9e37_79b1);
        let state = createWaveSceneState(random);
        let previousPlungeIndex = -3;
        const patterns = new Set<string>();

        for (let waveIndex = 0; waveIndex < 128; waveIndex += 1) {
          const next = nextWaveEvent(state, pace, random);
          const { event } = next;
          state = next.state;
          const values = [
            event.approachSeconds,
            event.breakIntensity,
            event.cavityCenterFrequencyHz,
            event.cavityIntensity,
            event.heightMeters,
            event.intervalSeconds,
            event.pan,
            event.rumbleCutoffFrequencyHz,
            event.undertowIntensity,
            event.washCenterFrequencyHz,
            event.washSeconds,
            ...event.foamBursts.flatMap((burst) => [
              burst.centerFrequencyHz,
              burst.delaySeconds,
              burst.durationSeconds,
              burst.gain,
              burst.pan,
              burst.qualityFactor,
            ]),
          ];

          if (values.some((value) => !Number.isFinite(value))) {
            failures.push(`${pace}:${seed}:${waveIndex}:non-finite`);
          }
          if (
            event.intervalSeconds < basePeriod * 0.74
            || event.intervalSeconds > basePeriod * 1.34
          ) {
            failures.push(`${pace}:${seed}:${waveIndex}:interval`);
          }
          if (event.foamBursts.length < 3 || event.foamBursts.length > 9) {
            failures.push(`${pace}:${seed}:${waveIndex}:burst-count`);
          }
          if (event.breakStyle === "plunge") {
            if (waveIndex - previousPlungeIndex < 3) {
              failures.push(`${pace}:${seed}:${waveIndex}:plunge-repeat`);
            }
            previousPlungeIndex = waveIndex;
          }
          if (state.waveIndex !== waveIndex + 1) {
            failures.push(`${pace}:${seed}:${waveIndex}:state-index`);
          }
          if (state.groupLength < 5 || state.groupLength > 9) {
            failures.push(`${pace}:${seed}:${waveIndex}:group-length`);
          }

          patterns.add(event.foamBursts.map((burst) => (
            `${burst.delaySeconds.toFixed(2)}:${burst.centerFrequencyHz.toFixed(0)}`
          )).join("|"));
        }

        if (patterns.size < 120) {
          failures.push(`${pace}:${seed}:repeated-patterns`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  test("preserves physical energy while scattering perceptual detail", () => {
    const random = seededRandom(0x1234_5678);
    let state = createWaveSceneState(random);
    const physicalEnergy: number[] = [];
    const renderedIntensity: number[] = [];
    const plungeIndices: number[] = [];
    let plungeCavityTotal = 0;
    let plungeCount = 0;
    let spillCavityTotal = 0;
    let spillCount = 0;
    let earlyFoamFrequencyTotal = 0;
    let earlyFoamCount = 0;
    let lateFoamFrequencyTotal = 0;
    let lateFoamCount = 0;

    for (let waveIndex = 0; waveIndex < 5_000; waveIndex += 1) {
      const next = nextWaveEvent(state, 32, random);
      const { event } = next;
      state = next.state;
      physicalEnergy.push(
        waveCrashIntensity(event.heightMeters, event.intervalSeconds),
      );
      renderedIntensity.push(event.breakIntensity);

      if (event.breakStyle === "plunge") {
        plungeCount += 1;
        plungeCavityTotal += event.cavityIntensity;
        plungeIndices.push(waveIndex);
      } else {
        spillCount += 1;
        spillCavityTotal += event.cavityIntensity;
      }

      const splitIndex = Math.ceil(event.foamBursts.length / 2);
      for (const [index, burst] of event.foamBursts.entries()) {
        if (index < splitIndex) {
          earlyFoamFrequencyTotal += burst.centerFrequencyHz;
          earlyFoamCount += 1;
        } else {
          lateFoamFrequencyTotal += burst.centerFrequencyHz;
          lateFoamCount += 1;
        }
      }
    }

    expect(correlation(physicalEnergy, renderedIntensity)).toBeGreaterThan(0.75);
    expect(plungeCount).toBeGreaterThan(150);
    expect(plungeCount).toBeLessThan(500);
    expect(plungeCavityTotal / plungeCount).toBeGreaterThan(
      (spillCavityTotal / spillCount) * 5,
    );
    expect(lateFoamFrequencyTotal / lateFoamCount).toBeGreaterThan(
      (earlyFoamFrequencyTotal / earlyFoamCount) * 1.3,
    );
    for (let index = 1; index < plungeIndices.length; index += 1) {
      expect(plungeIndices[index]! - plungeIndices[index - 1]!).toBeGreaterThan(2);
    }
  });
});
