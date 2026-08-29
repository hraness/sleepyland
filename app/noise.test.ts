import { describe, expect, test } from "bun:test";
import {
  fillNoiseChannel,
  frequencyAtPosition,
  noiseShapeDb,
  positionAtFrequency,
  spectrumGestureAtPosition,
  toneProfile,
  volumeToGain,
  type NoiseType,
} from "./noise";

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function roughness(samples: Float32Array): number {
  let total = 0;
  for (let index = 1; index < samples.length; index += 1) {
    total += Math.abs(samples[index]! - samples[index - 1]!);
  }
  return total / Math.max(samples.length - 1, 1);
}

function generated(type: NoiseType): Float32Array {
  const samples = new Float32Array(32_768);
  fillNoiseChannel(type, samples, seededRandom(42));
  return samples;
}

describe("noise generation", () => {
  test("keeps every generated sample finite and bounded", () => {
    for (const type of ["brown", "pink", "white"] as const) {
      for (const sample of generated(type)) {
        expect(Number.isFinite(sample)).toBe(true);
        expect(sample).toBeGreaterThanOrEqual(-1);
        expect(sample).toBeLessThanOrEqual(1);
      }
    }
  });

  test("preserves the expected smoothness ordering", () => {
    const brown = roughness(generated("brown"));
    const pink = roughness(generated("pink"));
    const white = roughness(generated("white"));
    expect(brown).toBeLessThan(pink);
    expect(pink).toBeLessThan(white);
  });
});

describe("controls", () => {
  test("maps tone monotonically from dark to bright", () => {
    const dark = toneProfile(0);
    const neutral = toneProfile(50);
    const bright = toneProfile(100);
    expect(dark.lowPassFrequencyHz).toBeLessThan(neutral.lowPassFrequencyHz);
    expect(neutral.lowPassFrequencyHz).toBeLessThan(bright.lowPassFrequencyHz);
    expect(dark.highShelfGainDb).toBeLessThan(bright.highShelfGainDb);
    expect(dark.lowShelfGainDb).toBeGreaterThan(bright.lowShelfGainDb);
  });

  test("clamps volume and keeps the mapping conservative", () => {
    expect(volumeToGain(-10)).toBe(0);
    expect(volumeToGain(50)).toBeGreaterThan(0);
    expect(volumeToGain(50)).toBeLessThan(volumeToGain(100));
    expect(volumeToGain(200)).toBeCloseTo(0.42);
  });
});

describe("spectrum math", () => {
  test("round trips positions on a logarithmic frequency scale", () => {
    for (const position of [0, 0.1, 0.5, 0.9, 1]) {
      const frequency = frequencyAtPosition(position, 40, 20_000);
      expect(positionAtFrequency(frequency, 40, 20_000)).toBeCloseTo(position, 10);
    }
  });

  test("models progressively stronger low-frequency emphasis", () => {
    const whiteDifference = noiseShapeDb("white", 50, 125) - noiseShapeDb("white", 50, 8_000);
    const pinkDifference = noiseShapeDb("pink", 50, 125) - noiseShapeDb("pink", 50, 8_000);
    const brownDifference = noiseShapeDb("brown", 50, 125) - noiseShapeDb("brown", 50, 8_000);
    expect(whiteDifference).toBeLessThan(pinkDifference);
    expect(pinkDifference).toBeLessThan(brownDifference);
  });

  test("maps graph position to a bounded filtered-noise voice", () => {
    const low = spectrumGestureAtPosition(0, 1, 40, 20_000);
    const middle = spectrumGestureAtPosition(0.5, 0.5, 40, 20_000);
    const high = spectrumGestureAtPosition(1, 0, 40, 20_000);

    expect(low.frequencyHz).toBe(40);
    expect(high.frequencyHz).toBe(20_000);
    expect(middle.frequencyHz).toBeCloseTo(Math.sqrt(40 * 20_000));
    expect(low.intensity).toBeLessThan(middle.intensity);
    expect(middle.intensity).toBeLessThan(high.intensity);
    expect(low.qualityFactor).toBeGreaterThan(high.qualityFactor);
    expect(low.pan).toBeCloseTo(-0.24);
    expect(high.pan).toBeCloseTo(0.24);
  });

  test("clamps graph positions before deriving audio parameters", () => {
    expect(spectrumGestureAtPosition(-4, 3, 40, 20_000))
      .toEqual(spectrumGestureAtPosition(0, 1, 40, 20_000));
    expect(spectrumGestureAtPosition(9, -2, 40, 20_000))
      .toEqual(spectrumGestureAtPosition(1, 0, 40, 20_000));
  });
});
