import type { SoundModeId } from "./sound-modes";

export const COUNTDOWN_MINUTES = [15, 30, 50, 60, 90] as const;
export const SESSION_PROGRESS_TICK_INTERVAL_MS = 500;
export type CountdownMinutes = (typeof COUNTDOWN_MINUTES)[number];

export const INTERVAL_PLANS = [
  {
    breakMinutes: 5,
    kind: "intervals",
    workBlocks: 4,
    workMinutes: 25,
  },
  {
    breakMinutes: 10,
    kind: "intervals",
    workBlocks: 2,
    workMinutes: 50,
  },
] as const;

export type IntervalPlan = (typeof INTERVAL_PLANS)[number];
export type SessionPlan =
  | Readonly<{ kind: "endless" }>
  | Readonly<{ kind: "countdown"; minutes: CountdownMinutes }>
  | IntervalPlan;

export type SessionPhase = "break" | "work";

export type SessionProgress =
  | Readonly<{ kind: "endless" }>
  | Readonly<{
      kind: "countdown";
      remainingMilliseconds: number;
    }>
  | Readonly<{
      completedWorkBlocks: number;
      kind: "intervals";
      phase: SessionPhase;
      remainingMilliseconds: number;
    }>;

export type SessionAdvance =
  | Readonly<{
      completed: false;
      phaseChanged: boolean;
      progress: SessionProgress;
      workBlocksCompleted: number;
    }>
  | Readonly<{
      completed: true;
      phaseChanged: boolean;
      progress: null;
      workBlocksCompleted: number;
    }>;

export type SessionPlanOption = Readonly<{
  detail: string;
  id: string;
  label: string;
  plan: SessionPlan;
}>;

const MINUTE_MILLISECONDS = 60_000;

export const DEFAULT_SESSION_PLAN: SessionPlan = { kind: "endless" };

export const SESSION_PLAN_OPTIONS = [
  {
    detail: "Play until you stop",
    id: "endless",
    label: "Endless",
    plan: DEFAULT_SESSION_PLAN,
  },
  ...COUNTDOWN_MINUTES.map((minutes) => ({
    detail: "Smooth finish",
    id: `countdown-${minutes}`,
    label: `${minutes} min`,
    plan: { kind: "countdown", minutes } as const,
  })),
  {
    detail: "Four work blocks",
    id: "intervals-25-5",
    label: "25 / 5",
    plan: INTERVAL_PLANS[0],
  },
  {
    detail: "Two longer blocks",
    id: "intervals-50-10",
    label: "50 / 10",
    plan: INTERVAL_PLANS[1],
  },
] as const satisfies readonly SessionPlanOption[];

function countdown(minutes: CountdownMinutes): SessionPlan {
  return { kind: "countdown", minutes };
}

export function defaultSessionPlanFor(
  soundMode: SoundModeId,
): SessionPlan {
  return soundMode === "focus" ? countdown(50) : DEFAULT_SESSION_PLAN;
}

export function availableSessionPlanOptions(
  soundMode: SoundModeId,
): readonly SessionPlanOption[] {
  return soundMode === "focus"
    ? SESSION_PLAN_OPTIONS
    : SESSION_PLAN_OPTIONS.filter((option) => option.plan.kind !== "intervals");
}

export function sessionPlanKey(plan: SessionPlan): string {
  switch (plan.kind) {
    case "endless":
      return "endless";
    case "countdown":
      return `countdown-${plan.minutes}`;
    case "intervals":
      return `intervals-${plan.workMinutes}-${plan.breakMinutes}`;
  }
}

export function sessionPlanEquals(
  left: SessionPlan,
  right: SessionPlan,
): boolean {
  return sessionPlanKey(left) === sessionPlanKey(right);
}

export function createSessionProgress(plan: SessionPlan): SessionProgress {
  switch (plan.kind) {
    case "endless":
      return { kind: "endless" };
    case "countdown":
      return {
        kind: "countdown",
        remainingMilliseconds: plan.minutes * MINUTE_MILLISECONDS,
      };
    case "intervals":
      return {
        completedWorkBlocks: 0,
        kind: "intervals",
        phase: "work",
        remainingMilliseconds: plan.workMinutes * MINUTE_MILLISECONDS,
      };
  }
}

export function advanceSessionProgress(
  plan: SessionPlan,
  progress: SessionProgress,
  elapsedMilliseconds: number,
): SessionAdvance {
  if (
    !Number.isFinite(elapsedMilliseconds)
    || elapsedMilliseconds <= 0
    || plan.kind !== progress.kind
  ) {
    return {
      completed: false,
      phaseChanged: false,
      progress,
      workBlocksCompleted: 0,
    };
  }

  if (progress.kind === "endless" || plan.kind === "endless") {
    return {
      completed: false,
      phaseChanged: false,
      progress,
      workBlocksCompleted: 0,
    };
  }

  if (progress.kind === "countdown" && plan.kind === "countdown") {
    if (elapsedMilliseconds >= progress.remainingMilliseconds) {
      return {
        completed: true,
        phaseChanged: false,
        progress: null,
        workBlocksCompleted: 0,
      };
    }
    return {
      completed: false,
      phaseChanged: false,
      progress: {
        ...progress,
        remainingMilliseconds:
          progress.remainingMilliseconds - elapsedMilliseconds,
      },
      workBlocksCompleted: 0,
    };
  }

  if (progress.kind !== "intervals" || plan.kind !== "intervals") {
    return {
      completed: false,
      phaseChanged: false,
      progress,
      workBlocksCompleted: 0,
    };
  }

  let remainingElapsed = elapsedMilliseconds;
  let remainingInPhase = progress.remainingMilliseconds;
  let phase = progress.phase;
  let completedWorkBlocks = progress.completedWorkBlocks;
  let workBlocksCompleted = 0;
  let phaseChanged = false;

  while (remainingElapsed >= remainingInPhase) {
    remainingElapsed -= remainingInPhase;
    phaseChanged = true;
    if (phase === "work") {
      completedWorkBlocks += 1;
      workBlocksCompleted += 1;
      if (completedWorkBlocks >= plan.workBlocks) {
        return {
          completed: true,
          phaseChanged,
          progress: null,
          workBlocksCompleted,
        };
      }
      phase = "break";
      remainingInPhase = plan.breakMinutes * MINUTE_MILLISECONDS;
    } else {
      phase = "work";
      remainingInPhase = plan.workMinutes * MINUTE_MILLISECONDS;
    }
  }

  return {
    completed: false,
    phaseChanged,
    progress: {
      completedWorkBlocks,
      kind: "intervals",
      phase,
      remainingMilliseconds: remainingInPhase - remainingElapsed,
    },
    workBlocksCompleted,
  };
}

function remainingMinuteLabel(remainingMilliseconds: number): string {
  return `${Math.max(1, Math.ceil(remainingMilliseconds / MINUTE_MILLISECONDS))} min`;
}

export function sessionProgressLabel(progress: SessionProgress): string {
  switch (progress.kind) {
    case "endless":
      return "Endless";
    case "countdown":
      return remainingMinuteLabel(progress.remainingMilliseconds);
    case "intervals":
      return `${remainingMinuteLabel(progress.remainingMilliseconds)} · ${
        progress.phase === "work" ? "Work" : "Break"
      }`;
  }
}
