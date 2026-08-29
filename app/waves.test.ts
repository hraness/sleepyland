import { describe, expect, test } from "bun:test";

import {
  createWaveSceneState,
  nextWaveEvent,
  waveCrashIntensity,
  waveFrequencyHz,
  wavePaceAtPeriod,
  wavePeriodSeconds,
} from "./waves";

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function expectWithin(value: number, minimum: number, maximum: number): void {
  expect(value).toBeGreaterThanOrEqual(minimum);
  expect(value).toBeLessThanOrEqual(maximum);
}

describe("wave timing", () => {
  test("maps pace to the calming swell range monotonically", () => {
    expect(wavePeriodSeconds(0)).toBeCloseTo(16);
    expect(wavePeriodSeconds(100)).toBeCloseTo(4.8);
    expect(wavePeriodSeconds(32)).toBeGreaterThan(10);
    expect(waveFrequencyHz(0)).toBeLessThan(waveFrequencyHz(50));
    expect(waveFrequencyHz(50)).toBeLessThan(waveFrequencyHz(100));
    for (const pace of [0, 17, 32, 68, 100]) {
      expect(wavePaceAtPeriod(wavePeriodSeconds(pace))).toBeCloseTo(pace);
    }
  });

  test("produces bounded, non-repeating swell groups and breakers", () => {
    const random = seededRandom(0x0cea_5eed);
    let state = createWaveSceneState(random);
    const intervals: number[] = [];
    const heights: number[] = [];
    const plungeIndices: number[] = [];
    const burstPatterns = new Set<string>();
    const styles = new Set<string>();

    for (let index = 0; index < 2_000; index += 1) {
      const next = nextWaveEvent(state, 32, random);
      state = next.state;
      const { event } = next;
      intervals.push(event.intervalSeconds);
      heights.push(event.heightMeters);
      styles.add(event.breakStyle);

      expect(Number.isFinite(event.intervalSeconds)).toBeTrue();
      expect(event.intervalSeconds).toBeGreaterThanOrEqual(wavePeriodSeconds(32) * 0.74);
      expect(event.intervalSeconds).toBeLessThanOrEqual(wavePeriodSeconds(32) * 1.34);
      expect(event.heightMeters).toBeGreaterThanOrEqual(0.24);
      expect(event.heightMeters).toBeLessThanOrEqual(1.38);
      expect(event.breakIntensity).toBeGreaterThanOrEqual(0.08);
      expect(event.breakIntensity).toBeLessThanOrEqual(0.9);
      expect(event.approachSeconds).toBeGreaterThanOrEqual(1.4);
      expect(event.washSeconds).toBeGreaterThanOrEqual(4.2);
      expect(Math.abs(event.pan)).toBeLessThanOrEqual(0.34);
      expectWithin(event.undertowIntensity, 0.12, 0.32);
      expectWithin(event.cavityCenterFrequencyHz, 220, 578);
      expectWithin(event.foamBursts.length, 3, 9);
      for (const burst of event.foamBursts) {
        expectWithin(burst.centerFrequencyHz, 480, 6_400);
        expectWithin(burst.delaySeconds, 0, event.washSeconds * 0.55);
        expectWithin(burst.durationSeconds, 0.18, 0.9);
        expectWithin(burst.gain, 0.045, 0.42);
        expectWithin(burst.pan, -0.48, 0.48);
        expectWithin(burst.qualityFactor, 0.38, 0.92);
      }
      burstPatterns.add(event.foamBursts.map((burst) => (
        `${burst.delaySeconds.toFixed(2)}:${burst.centerFrequencyHz.toFixed(0)}`
      )).join("|"));
      if (event.breakStyle === "plunge") plungeIndices.push(index);
    }

    expect(Math.max(...intervals) - Math.min(...intervals)).toBeGreaterThan(2);
    expect(Math.max(...heights) - Math.min(...heights)).toBeGreaterThan(0.7);
    expect(styles).toEqual(new Set(["spill", "plunge"]));
    expect(burstPatterns.size).toBeGreaterThan(1_900);
    for (let index = 1; index < plungeIndices.length; index += 1) {
      expect(plungeIndices[index]! - plungeIndices[index - 1]!).toBeGreaterThan(2);
    }
  });
});

describe("breaker mechanics", () => {
  test("makes taller and steeper waves crash with more broadband energy", () => {
    const gentle = waveCrashIntensity(0.4, 13);
    const tall = waveCrashIntensity(1.2, 13);
    const steep = waveCrashIntensity(1.2, 5);

    expect(tall).toBeGreaterThan(gentle);
    expect(steep).toBeGreaterThan(tall);
  });

  test("separates a plunging cavity impact from a spilling foam wash", () => {
    const random = seededRandom(0x5ea5_10de);
    let state = createWaveSceneState(random);
    let plunge = null;
    let spill = null;

    for (let index = 0; index < 400; index += 1) {
      const next = nextWaveEvent(state, 68, random);
      state = next.state;
      if (next.event.breakStyle === "plunge") plunge ??= next.event;
      if (next.event.breakStyle === "spill") spill ??= next.event;
      if (plunge !== null && spill !== null) break;
    }

    expect(plunge).not.toBeNull();
    expect(spill).not.toBeNull();
    expect(plunge!.cavityIntensity).toBeGreaterThan(spill!.cavityIntensity);
    expect(plunge!.foamBursts.length).toBeGreaterThan(spill!.foamBursts.length);
  });
});
