import { createLocalStorageRecord } from "@/lib/browser-storage";
import { z } from "zod";

import { NOISE_TYPES } from "./noise";
import {
  COUNTDOWN_MINUTES,
  DEFAULT_SESSION_PLAN,
  INTERVAL_PLANS,
  type SessionPlan,
} from "./session-plans";
import {
  DEFAULT_ENERGY_LEVEL,
  DEFAULT_SOUND_MODE,
  ENERGY_LEVEL_IDS,
  SOUND_MODE_IDS,
  soundModeDefinition,
} from "./sound-modes";

export const SETTINGS_STORAGE_KEY = "sleepyland.settings.v7";
export const PREVIOUS_SETTINGS_STORAGE_KEY = "sleepyland.settings.v6";
export const V5_SETTINGS_STORAGE_KEY = "sleepyland.settings.v5";
export const V4_SETTINGS_STORAGE_KEY = "sleepyland.settings.v4";
export const V3_SETTINGS_STORAGE_KEY = "sleepyland.settings.v3";
export const LEGACY_SETTINGS_STORAGE_KEY = "sleepyland.settings.v2";
export const OLDEST_SETTINGS_STORAGE_KEY = "sleepyland.settings.v1";

const LEGACY_FOCUS_ACTIVITY_IDS = [
  "deep-work",
  "learn",
  "create",
  "quick-task",
] as const;

const percentageSchema = z.number().int().min(0).max(100);

const sleepTimerSchema = z.union([
  z.literal(0),
  z.literal(30),
  z.literal(60),
  z.literal(90),
]);

const countdownMinutesSchema = z.union([
  z.literal(COUNTDOWN_MINUTES[0]),
  z.literal(COUNTDOWN_MINUTES[1]),
  z.literal(COUNTDOWN_MINUTES[2]),
  z.literal(COUNTDOWN_MINUTES[3]),
  z.literal(COUNTDOWN_MINUTES[4]),
]);

const endlessSessionPlanSchema = z.object({
  kind: z.literal("endless"),
}).strict();
const countdownSessionPlanSchema = z.object({
  kind: z.literal("countdown"),
  minutes: countdownMinutesSchema,
}).strict();
const intervalSessionPlanSchema = z.union([
  z.object({
    kind: z.literal("intervals"),
    workMinutes: z.literal(INTERVAL_PLANS[0].workMinutes),
    breakMinutes: z.literal(INTERVAL_PLANS[0].breakMinutes),
    workBlocks: z.literal(INTERVAL_PLANS[0].workBlocks),
  }).strict(),
  z.object({
    kind: z.literal("intervals"),
    workMinutes: z.literal(INTERVAL_PLANS[1].workMinutes),
    breakMinutes: z.literal(INTERVAL_PLANS[1].breakMinutes),
    workBlocks: z.literal(INTERVAL_PLANS[1].workBlocks),
  }).strict(),
]);
const nonFocusSessionPlanSchema = z.union([
  endlessSessionPlanSchema,
  countdownSessionPlanSchema,
]);
export const sessionPlanSchema = z.union([
  endlessSessionPlanSchema,
  countdownSessionPlanSchema,
  intervalSessionPlanSchema,
]);

const soundSettingsSchema = z.object({
  noiseType: z.enum(NOISE_TYPES),
  tone: percentageSchema,
  noiseVolume: percentageSchema,
  waveVolume: percentageSchema,
  wavePace: percentageSchema,
}).strict();

export const oldestSettingsSchema = z.object({
  version: z.literal(1),
  noiseType: z.enum(NOISE_TYPES),
  tone: percentageSchema,
  volume: percentageSchema,
  sleepTimer: sleepTimerSchema,
}).strict();

export const legacySettingsSchema = soundSettingsSchema.extend({
  version: z.literal(2),
  sleepTimer: sleepTimerSchema,
}).strict();

export const v3SettingsSchema = soundSettingsSchema.extend({
  version: z.literal(3),
  soundMode: z.enum(SOUND_MODE_IDS),
  sleepTimer: sleepTimerSchema,
}).strict();

export const v4SettingsSchema = soundSettingsSchema.extend({
  version: z.literal(4),
  soundMode: z.enum(SOUND_MODE_IDS),
  sleepTimer: sleepTimerSchema,
  toneVolume: percentageSchema,
}).strict();

const toneSourceSessionSettingsSchema = soundSettingsSchema.extend({
  energy: z.enum(ENERGY_LEVEL_IDS),
  toneVolume: percentageSchema,
});

export const v5SettingsSchema = z.union([
  toneSourceSessionSettingsSchema.extend({
    version: z.literal(5),
    soundMode: z.enum(["sleep", "calm"]),
    focusActivity: z.enum(LEGACY_FOCUS_ACTIVITY_IDS),
    sessionPlan: nonFocusSessionPlanSchema,
  }).strict(),
  toneSourceSessionSettingsSchema.extend({
    version: z.literal(5),
    soundMode: z.literal("focus"),
    focusActivity: z.enum(LEGACY_FOCUS_ACTIVITY_IDS),
    sessionPlan: sessionPlanSchema,
  }).strict(),
]);

export const v6SettingsSchema = z.union([
  toneSourceSessionSettingsSchema.extend({
    version: z.literal(6),
    soundMode: z.enum(["sleep", "calm"]),
    sessionPlan: nonFocusSessionPlanSchema,
  }).strict(),
  toneSourceSessionSettingsSchema.extend({
    version: z.literal(6),
    soundMode: z.literal("focus"),
    sessionPlan: sessionPlanSchema,
  }).strict(),
]);

export const settingsSchema = z.union([
  soundSettingsSchema.extend({
    version: z.literal(7),
    soundMode: z.enum(["sleep", "calm"]),
    energy: z.enum(ENERGY_LEVEL_IDS),
    sessionPlan: nonFocusSessionPlanSchema,
  }).strict(),
  soundSettingsSchema.extend({
    version: z.literal(7),
    soundMode: z.literal("focus"),
    energy: z.enum(ENERGY_LEVEL_IDS),
    sessionPlan: sessionPlanSchema,
  }).strict(),
]);

export type GeneratorSettings = z.output<typeof settingsSchema>;

const defaultRecipe = soundModeDefinition(DEFAULT_SOUND_MODE).recipe;

export const DEFAULT_SETTINGS = settingsSchema.parse({
  version: 7,
  soundMode: DEFAULT_SOUND_MODE,
  energy: DEFAULT_ENERGY_LEVEL,
  noiseType: defaultRecipe.noiseType,
  tone: defaultRecipe.tone,
  noiseVolume: defaultRecipe.noiseVolume,
  waveVolume: defaultRecipe.waveVolume,
  wavePace: defaultRecipe.wavePace,
  sessionPlan: DEFAULT_SESSION_PLAN,
});

export const settingsRecord = createLocalStorageRecord({
  key: SETTINGS_STORAGE_KEY,
  schema: settingsSchema,
});

export const previousSettingsRecord = createLocalStorageRecord({
  key: PREVIOUS_SETTINGS_STORAGE_KEY,
  schema: v6SettingsSchema,
});

export const v5SettingsRecord = createLocalStorageRecord({
  key: V5_SETTINGS_STORAGE_KEY,
  schema: v5SettingsSchema,
});

export const v4SettingsRecord = createLocalStorageRecord({
  key: V4_SETTINGS_STORAGE_KEY,
  schema: v4SettingsSchema,
});

export const v3SettingsRecord = createLocalStorageRecord({
  key: V3_SETTINGS_STORAGE_KEY,
  schema: v3SettingsSchema,
});

export const legacySettingsRecord = createLocalStorageRecord({
  key: LEGACY_SETTINGS_STORAGE_KEY,
  schema: legacySettingsSchema,
});

export const oldestSettingsRecord = createLocalStorageRecord({
  key: OLDEST_SETTINGS_STORAGE_KEY,
  schema: oldestSettingsSchema,
});

function sessionPlanFromSleepTimer(
  sleepTimer: z.output<typeof sleepTimerSchema>,
): SessionPlan {
  return sleepTimer === 0
    ? DEFAULT_SESSION_PLAN
    : { kind: "countdown", minutes: sleepTimer };
}

function migrateV6Settings(
  value: z.output<typeof v6SettingsSchema>,
): GeneratorSettings {
  return settingsSchema.parse({
    version: 7,
    soundMode: value.soundMode,
    energy: value.energy,
    noiseType: value.noiseType,
    tone: value.tone,
    noiseVolume: value.noiseVolume,
    waveVolume: value.waveVolume,
    wavePace: value.wavePace,
    sessionPlan: value.sessionPlan,
  });
}

function migrateV5Settings(
  value: z.output<typeof v5SettingsSchema>,
): GeneratorSettings {
  return settingsSchema.parse({
    version: 7,
    soundMode: value.soundMode,
    energy: value.energy,
    noiseType: value.noiseType,
    tone: value.tone,
    noiseVolume: value.noiseVolume,
    waveVolume: value.waveVolume,
    wavePace: value.wavePace,
    sessionPlan: value.sessionPlan,
  });
}

function migrateV4Settings(
  value: z.output<typeof v4SettingsSchema>,
): GeneratorSettings {
  return settingsSchema.parse({
    version: 7,
    soundMode: value.soundMode,
    energy: DEFAULT_ENERGY_LEVEL,
    noiseType: value.noiseType,
    tone: value.tone,
    noiseVolume: value.noiseVolume,
    waveVolume: value.waveVolume,
    wavePace: value.wavePace,
    sessionPlan: sessionPlanFromSleepTimer(value.sleepTimer),
  });
}

function migrateV3Settings(
  value: z.output<typeof v3SettingsSchema>,
): GeneratorSettings {
  return settingsSchema.parse({
    version: 7,
    soundMode: value.soundMode,
    energy: DEFAULT_ENERGY_LEVEL,
    noiseType: value.noiseType,
    tone: value.tone,
    noiseVolume: value.noiseVolume,
    waveVolume: value.waveVolume,
    wavePace: value.wavePace,
    sessionPlan: sessionPlanFromSleepTimer(value.sleepTimer),
  });
}

export function migrateLegacySettings(value: unknown): GeneratorSettings | null {
  const versionSix = v6SettingsSchema.safeParse(value);
  if (versionSix.success) return migrateV6Settings(versionSix.data);

  const versionFive = v5SettingsSchema.safeParse(value);
  if (versionFive.success) return migrateV5Settings(versionFive.data);

  const versionFour = v4SettingsSchema.safeParse(value);
  if (versionFour.success) return migrateV4Settings(versionFour.data);

  const versionThree = v3SettingsSchema.safeParse(value);
  if (versionThree.success) return migrateV3Settings(versionThree.data);

  const legacy = legacySettingsSchema.safeParse(value);
  if (legacy.success) {
    return settingsSchema.parse({
      version: 7,
      soundMode: DEFAULT_SOUND_MODE,
      energy: DEFAULT_ENERGY_LEVEL,
      noiseType: legacy.data.noiseType,
      tone: legacy.data.tone,
      noiseVolume: legacy.data.noiseVolume,
      waveVolume: legacy.data.waveVolume,
      wavePace: legacy.data.wavePace,
      sessionPlan: sessionPlanFromSleepTimer(legacy.data.sleepTimer),
    });
  }

  const oldest = oldestSettingsSchema.safeParse(value);
  if (!oldest.success) return null;
  return settingsSchema.parse({
    version: 7,
    soundMode: DEFAULT_SOUND_MODE,
    energy: DEFAULT_ENERGY_LEVEL,
    noiseType: oldest.data.noiseType,
    tone: oldest.data.tone,
    noiseVolume: oldest.data.volume,
    waveVolume: defaultRecipe.waveVolume,
    wavePace: defaultRecipe.wavePace,
    sessionPlan: sessionPlanFromSleepTimer(oldest.data.sleepTimer),
  });
}

export function loadSettings(): GeneratorSettings | null {
  const current = settingsRecord.load();
  if (current.ok && current.value !== null) return current.value;

  for (const record of [
    previousSettingsRecord,
    v5SettingsRecord,
    v4SettingsRecord,
    v3SettingsRecord,
    legacySettingsRecord,
    oldestSettingsRecord,
  ]) {
    const stored = record.load();
    if (!stored.ok || stored.value === null) continue;
    const migrated = migrateLegacySettings(stored.value);
    if (migrated !== null) settingsRecord.save(migrated);
    return migrated;
  }

  return null;
}
