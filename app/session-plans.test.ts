import { describe, expect, test } from "bun:test";

import {
  INTERVAL_PLANS,
  SESSION_PROGRESS_TICK_INTERVAL_MS,
  SESSION_PLAN_OPTIONS,
  advanceSessionProgress,
  availableSessionPlanOptions,
  createSessionProgress,
  defaultSessionPlanFor,
  sessionPlanKey,
  sessionProgressLabel,
} from "./session-plans";

const minute = 60_000;

describe("session plans", () => {
  test("keeps progress updates responsive without depending on display precision", () => {
    expect(SESSION_PROGRESS_TICK_INTERVAL_MS).toBe(500);
  });

  test("gives each state one practical session default", () => {
    expect(defaultSessionPlanFor("focus")).toEqual({
      kind: "countdown",
      minutes: 50,
    });
    expect(defaultSessionPlanFor("sleep")).toEqual({ kind: "endless" });
    expect(defaultSessionPlanFor("calm")).toEqual({ kind: "endless" });
  });

  test("keeps interval plans contextual to Focus", () => {
    expect(availableSessionPlanOptions("focus")).toHaveLength(
      SESSION_PLAN_OPTIONS.length,
    );
    expect(
      availableSessionPlanOptions("sleep").some(
        (option) => option.plan.kind === "intervals",
      ),
    ).toBeFalse();
    expect(new Set(SESSION_PLAN_OPTIONS.map((option) => option.id)).size).toBe(
      SESSION_PLAN_OPTIONS.length,
    );
  });

  test("advances countdowns by elapsed wall time", () => {
    const plan = { kind: "countdown", minutes: 15 } as const;
    const initial = createSessionProgress(plan);
    const advanced = advanceSessionProgress(plan, initial, 14 * minute + 1);

    expect(advanced.completed).toBeFalse();
    if (advanced.completed) return;
    expect(sessionProgressLabel(advanced.progress)).toBe("1 min");
    expect(advanceSessionProgress(plan, advanced.progress, minute).completed).toBeTrue();
  });

  test("crosses interval phases and finishes the final work block", () => {
    const plan = INTERVAL_PLANS[0];
    let progress = createSessionProgress(plan);
    const first = advanceSessionProgress(plan, progress, 25 * minute);

    expect(first).toMatchObject({
      completed: false,
      phaseChanged: true,
      workBlocksCompleted: 1,
      progress: {
        completedWorkBlocks: 1,
        kind: "intervals",
        phase: "break",
        remainingMilliseconds: 5 * minute,
      },
    });
    if (first.completed) return;
    progress = first.progress;

    const acrossBreak = advanceSessionProgress(plan, progress, 6 * minute);
    expect(acrossBreak).toMatchObject({
      completed: false,
      phaseChanged: true,
      progress: {
        completedWorkBlocks: 1,
        kind: "intervals",
        phase: "work",
        remainingMilliseconds: 24 * minute,
      },
    });
    if (acrossBreak.completed) return;

    const finish = advanceSessionProgress(
      plan,
      acrossBreak.progress,
      24 * minute + 5 * minute + 25 * minute + 5 * minute + 25 * minute,
    );
    expect(finish).toEqual({
      completed: true,
      phaseChanged: true,
      progress: null,
      workBlocksCompleted: 3,
    });
  });

  test("ignores malformed elapsed time and mismatched progress", () => {
    const countdown = { kind: "countdown", minutes: 30 } as const;
    const progress = createSessionProgress(countdown);
    expect(advanceSessionProgress(countdown, progress, Number.NaN).progress).toBe(
      progress,
    );
    expect(
      advanceSessionProgress({ kind: "endless" }, progress, minute).progress,
    ).toBe(progress);
    expect(sessionPlanKey(INTERVAL_PLANS[1])).toBe("intervals-50-10");
  });
});
