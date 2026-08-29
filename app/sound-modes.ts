import type { NoiseType } from "./noise";

export const SOUND_MODE_IDS = ["sleep", "calm", "focus"] as const;
export type SoundModeId = (typeof SOUND_MODE_IDS)[number];

export const ENERGY_LEVEL_IDS = ["gentle", "balanced", "strong"] as const;
export type EnergyLevelId = (typeof ENERGY_LEVEL_IDS)[number];

export type SoundRecipe = Readonly<{
  noiseType: NoiseType;
  noiseVolume: number;
  tone: number;
  wavePace: number;
  waveVolume: number;
}>;

export type SoundMotionProfile = Readonly<{
  depth: number;
  periodSeconds: number;
}>;

export type SoundModeDefinition = Readonly<{
  detail: string;
  id: SoundModeId;
  label: string;
  motion: SoundMotionProfile;
  recipe: SoundRecipe;
}>;

export type EnergyLevelDefinition = Readonly<{
  id: EnergyLevelId;
  label: string;
  motionDepthScale: number;
  motionPeriodScale: number;
}>;

export type SoundProfileSelection = Readonly<{
  energy: EnergyLevelId;
  soundMode: SoundModeId;
}>;

export type ResolvedSoundProfile = SoundProfileSelection & Readonly<{
  motion: SoundMotionProfile;
  recipe: SoundRecipe;
}>;

export const SOUND_MODES = [
  {
    detail: "Deep and steady",
    id: "sleep",
    label: "Sleep",
    motion: {
      depth: 0.012,
      periodSeconds: 52,
    },
    recipe: {
      noiseType: "brown",
      noiseVolume: 38,
      tone: 25,
      wavePace: 39,
      waveVolume: 88,
    },
  },
  {
    detail: "Slow and spacious",
    id: "calm",
    label: "Relax",
    motion: {
      depth: 0.055,
      periodSeconds: 18,
    },
    recipe: {
      noiseType: "pink",
      noiseVolume: 30,
      tone: 36,
      wavePace: 18,
      waveVolume: 68,
    },
  },
  {
    detail: "Rhythmic and clear",
    id: "focus",
    label: "Focus",
    motion: {
      depth: 0.045,
      periodSeconds: 1.35,
    },
    recipe: {
      noiseType: "pink",
      noiseVolume: 44,
      tone: 58,
      wavePace: 68,
      waveVolume: 0,
    },
  },
] as const satisfies readonly SoundModeDefinition[];

export const DEFAULT_SOUND_MODE: SoundModeId = "sleep";
export const DEFAULT_ENERGY_LEVEL: EnergyLevelId = "balanced";

export const ENERGY_LEVELS = [
  {
    id: "gentle",
    label: "Gentle",
    motionDepthScale: 0.65,
    motionPeriodScale: 1.25,
  },
  {
    id: "balanced",
    label: "Balanced",
    motionDepthScale: 1,
    motionPeriodScale: 1,
  },
  {
    id: "strong",
    label: "Strong",
    motionDepthScale: 1.4,
    motionPeriodScale: 0.78,
  },
] as const satisfies readonly EnergyLevelDefinition[];

function assertNever(value: never): never {
  throw new Error(`Unhandled sound mode: ${String(value)}`);
}

export function soundModeDefinition(id: SoundModeId): SoundModeDefinition {
  switch (id) {
    case "sleep":
      return SOUND_MODES[0];
    case "calm":
      return SOUND_MODES[1];
    case "focus":
      return SOUND_MODES[2];
    default:
      return assertNever(id);
  }
}

export function energyLevelDefinition(id: EnergyLevelId): EnergyLevelDefinition {
  const definition = ENERGY_LEVELS.find((candidate) => candidate.id === id);
  if (definition === undefined) {
    throw new Error(`Unhandled energy level: ${String(id)}`);
  }
  return definition;
}

export function resolveSoundProfile(
  selection: SoundProfileSelection,
): ResolvedSoundProfile {
  const mode = soundModeDefinition(selection.soundMode);
  const energy = energyLevelDefinition(selection.energy);

  return {
    ...selection,
    motion: {
      depth: mode.motion.depth * energy.motionDepthScale,
      periodSeconds: mode.motion.periodSeconds * energy.motionPeriodScale,
    },
    recipe: mode.recipe,
  };
}

export function recipeMatchesSoundMode(
  id: SoundModeId,
  recipe: SoundRecipe,
): boolean {
  const preset = soundModeDefinition(id).recipe;
  return recipe.noiseType === preset.noiseType
    && recipe.noiseVolume === preset.noiseVolume
    && recipe.tone === preset.tone
    && recipe.wavePace === preset.wavePace
    && recipe.waveVolume === preset.waveVolume;
}

export function recipeMatchesSoundProfile(
  selection: SoundProfileSelection,
  recipe: SoundRecipe,
): boolean {
  const preset = resolveSoundProfile(selection).recipe;
  return recipe.noiseType === preset.noiseType
    && recipe.noiseVolume === preset.noiseVolume
    && recipe.tone === preset.tone
    && recipe.wavePace === preset.wavePace
    && recipe.waveVolume === preset.waveVolume;
}
