import { describe, expect, test } from "bun:test";

import {
  DEFAULT_SETTINGS,
  LEGACY_SETTINGS_STORAGE_KEY,
  OLDEST_SETTINGS_STORAGE_KEY,
  PREVIOUS_SETTINGS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  V3_SETTINGS_STORAGE_KEY,
  V4_SETTINGS_STORAGE_KEY,
  V5_SETTINGS_STORAGE_KEY,
  migrateLegacySettings,
  settingsSchema,
} from "./settings";

describe("generator settings", () => {
  test("exposes stable local defaults", () => {
    expect(SETTINGS_STORAGE_KEY).toBe("sleepyland.settings.v7");
    expect(PREVIOUS_SETTINGS_STORAGE_KEY).toBe("sleepyland.settings.v6");
    expect(V5_SETTINGS_STORAGE_KEY).toBe("sleepyland.settings.v5");
    expect(V4_SETTINGS_STORAGE_KEY).toBe("sleepyland.settings.v4");
    expect(V3_SETTINGS_STORAGE_KEY).toBe("sleepyland.settings.v3");
    expect(LEGACY_SETTINGS_STORAGE_KEY).toBe("sleepyland.settings.v2");
    expect(OLDEST_SETTINGS_STORAGE_KEY).toBe("sleepyland.settings.v1");
    expect(DEFAULT_SETTINGS).toEqual({
      version: 7,
      soundMode: "sleep",
      energy: "balanced",
      noiseType: "brown",
      tone: 25,
      noiseVolume: 38,
      waveVolume: 88,
      wavePace: 39,
      sessionPlan: { kind: "endless" },
    });
  });

  test("accepts the complete three-state session setup", () => {
    expect(settingsSchema.parse({
      version: 7,
      soundMode: "focus",
      energy: "gentle",
      noiseType: "pink",
      tone: 58,
      noiseVolume: 44,
      waveVolume: 0,
      wavePace: 68,
      sessionPlan: {
        kind: "intervals",
        workMinutes: 25,
        breakMinutes: 5,
        workBlocks: 4,
      },
    })).toMatchObject({
      version: 7,
      soundMode: "focus",
      energy: "gentle",
      sessionPlan: { kind: "intervals" },
    });
  });

  test("retires tones without changing a v6 mix or session plan", () => {
    expect(migrateLegacySettings({
      version: 6,
      soundMode: "focus",
      energy: "strong",
      noiseType: "pink",
      tone: 55,
      toneVolume: 27,
      noiseVolume: 48,
      waveVolume: 0,
      wavePace: 68,
      sessionPlan: {
        kind: "intervals",
        workMinutes: 25,
        breakMinutes: 5,
        workBlocks: 4,
      },
    })).toEqual({
      version: 7,
      soundMode: "focus",
      energy: "strong",
      noiseType: "pink",
      tone: 55,
      noiseVolume: 48,
      waveVolume: 0,
      wavePace: 68,
      sessionPlan: {
        kind: "intervals",
        workMinutes: 25,
        breakMinutes: 5,
        workBlocks: 4,
      },
    });
  });

  test("removes v5 task labels and tones without changing the remaining setup", () => {
    expect(migrateLegacySettings({
      version: 5,
      soundMode: "focus",
      focusActivity: "learn",
      energy: "gentle",
      noiseType: "pink",
      tone: 55,
      toneVolume: 5,
      noiseVolume: 48,
      waveVolume: 0,
      wavePace: 68,
      sessionPlan: {
        kind: "intervals",
        workMinutes: 25,
        breakMinutes: 5,
        workBlocks: 4,
      },
    })).toEqual({
      version: 7,
      soundMode: "focus",
      energy: "gentle",
      noiseType: "pink",
      tone: 55,
      noiseVolume: 48,
      waveVolume: 0,
      wavePace: 68,
      sessionPlan: {
        kind: "intervals",
        workMinutes: 25,
        breakMinutes: 5,
        workBlocks: 4,
      },
    });
  });

  test("migrates every earlier settings version without inventing tones", () => {
    expect(migrateLegacySettings({
      version: 4,
      soundMode: "focus",
      noiseType: "pink",
      tone: 58,
      toneVolume: 14,
      noiseVolume: 58,
      waveVolume: 0,
      wavePace: 68,
      sleepTimer: 60,
    })).toEqual({
      version: 7,
      soundMode: "focus",
      energy: "balanced",
      noiseType: "pink",
      tone: 58,
      noiseVolume: 58,
      waveVolume: 0,
      wavePace: 68,
      sessionPlan: { kind: "countdown", minutes: 60 },
    });

    expect(migrateLegacySettings({
      version: 3,
      soundMode: "calm",
      noiseType: "pink",
      tone: 36,
      noiseVolume: 30,
      waveVolume: 68,
      wavePace: 18,
      sleepTimer: 0,
    })).toEqual({
      version: 7,
      soundMode: "calm",
      energy: "balanced",
      noiseType: "pink",
      tone: 36,
      noiseVolume: 30,
      waveVolume: 68,
      wavePace: 18,
      sessionPlan: { kind: "endless" },
    });

    expect(migrateLegacySettings({
      version: 2,
      noiseType: "white",
      tone: 72,
      noiseVolume: 23,
      waveVolume: 51,
      wavePace: 17,
      sleepTimer: 90,
    })).toEqual({
      version: 7,
      soundMode: "sleep",
      energy: "balanced",
      noiseType: "white",
      tone: 72,
      noiseVolume: 23,
      waveVolume: 51,
      wavePace: 17,
      sessionPlan: { kind: "countdown", minutes: 90 },
    });

    expect(migrateLegacySettings({
      version: 1,
      noiseType: "pink",
      tone: 42,
      volume: 27,
      sleepTimer: 30,
    })).toEqual({
      version: 7,
      soundMode: "sleep",
      energy: "balanced",
      noiseType: "pink",
      tone: 42,
      noiseVolume: 27,
      waveVolume: 88,
      wavePace: 39,
      sessionPlan: { kind: "countdown", minutes: 30 },
    });
  });

  test("rejects unknown, fractional, out-of-range, and impossible settings", () => {
    const invalidSettings = [
      { ...DEFAULT_SETTINGS, noiseType: "blue" },
      { ...DEFAULT_SETTINGS, soundMode: "recover" },
      { ...DEFAULT_SETTINGS, focusActivity: "deep-work" },
      { ...DEFAULT_SETTINGS, energy: "maximum" },
      { ...DEFAULT_SETTINGS, tone: 10.5 },
      { ...DEFAULT_SETTINGS, toneVolume: 1 },
      { ...DEFAULT_SETTINGS, noiseVolume: 101 },
      { ...DEFAULT_SETTINGS, waveVolume: -1 },
      { ...DEFAULT_SETTINGS, wavePace: 100.5 },
      { ...DEFAULT_SETTINGS, sessionPlan: { kind: "countdown", minutes: 20 } },
      {
        ...DEFAULT_SETTINGS,
        sessionPlan: {
          kind: "intervals",
          workMinutes: 25,
          breakMinutes: 10,
          workBlocks: 4,
        },
      },
      {
        ...DEFAULT_SETTINGS,
        sessionPlan: {
          kind: "intervals",
          workMinutes: 25,
          breakMinutes: 5,
          workBlocks: 4,
        },
      },
      { ...DEFAULT_SETTINGS, extra: true },
    ];

    for (const value of invalidSettings) {
      expect(settingsSchema.safeParse(value).success).toBe(false);
    }
    expect(migrateLegacySettings({
      version: 1,
      noiseType: "blue",
      tone: 72,
      volume: 23,
      sleepTimer: 90,
    })).toBeNull();
  });
});
