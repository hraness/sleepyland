import { describe, expect, test } from "bun:test";

import {
  ENERGY_LEVELS,
  DEFAULT_SOUND_MODE,
  SOUND_MODES,
  recipeMatchesSoundProfile,
  recipeMatchesSoundMode,
  resolveSoundProfile,
  soundModeDefinition,
} from "./sound-modes";

describe("sound wellness modes", () => {
  test("keeps the existing sleep mix as the default", () => {
    expect(DEFAULT_SOUND_MODE).toBe("sleep");
    expect(soundModeDefinition("sleep").recipe).toEqual({
      noiseType: "brown",
      noiseVolume: 38,
      tone: 25,
      wavePace: 39,
      waveVolume: 88,
    });
  });

  test("offers exactly three state-first soundscapes", () => {
    expect(SOUND_MODES.map((mode) => mode.label)).toEqual([
      "Sleep",
      "Relax",
      "Focus",
    ]);
  });

  test("gives every state a distinct recipe and rhythm", () => {
    const recipes = SOUND_MODES.map((mode) => JSON.stringify(mode.recipe));
    const motions = SOUND_MODES.map((mode) => JSON.stringify(mode.motion));

    expect(new Set(recipes).size).toBe(SOUND_MODES.length);
    expect(new Set(motions).size).toBe(SOUND_MODES.length);
    expect(soundModeDefinition("focus").recipe.waveVolume).toBe(0);
    expect(soundModeDefinition("focus").motion.periodSeconds).toBeLessThan(2);
    expect(soundModeDefinition("calm").motion.periodSeconds).toBeGreaterThan(10);
    expect(soundModeDefinition("sleep").motion.periodSeconds).toBeGreaterThan(40);
  });

  test("recognizes exact presets without hiding later tuning", () => {
    const calm = soundModeDefinition("calm").recipe;

    expect(recipeMatchesSoundMode("calm", calm)).toBeTrue();
    expect(recipeMatchesSoundMode("calm", {
      ...calm,
      tone: calm.tone + 1,
    })).toBeFalse();
  });

  test("changes movement depth and pace with Energy, never source volume", () => {
    const profiles = ENERGY_LEVELS.map((energy) => resolveSoundProfile({
      energy: energy.id,
      soundMode: "focus",
    }));

    expect(profiles.map((profile) => profile.recipe)).toEqual([
      profiles[0]!.recipe,
      profiles[0]!.recipe,
      profiles[0]!.recipe,
    ]);
    expect(profiles[0]!.motion.depth).toBeLessThan(profiles[1]!.motion.depth);
    expect(profiles[2]!.motion.depth).toBeGreaterThan(profiles[1]!.motion.depth);
    expect(profiles[0]!.motion.periodSeconds).toBeGreaterThan(
      profiles[2]!.motion.periodSeconds,
    );
  });

  test("matches the selected state recipe independently of Energy", () => {
    const selection = {
      energy: "strong",
      soundMode: "focus",
    } as const;
    const recipe = resolveSoundProfile(selection).recipe;

    expect(recipeMatchesSoundProfile(selection, recipe)).toBeTrue();
    expect(recipeMatchesSoundProfile(selection, {
      ...recipe,
      wavePace: recipe.wavePace + 1,
    })).toBeFalse();
  });
});
