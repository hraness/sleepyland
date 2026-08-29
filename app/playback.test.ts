import { describe, expect, test } from "bun:test";

import { canStopPlayback, PlaybackStartFence } from "./playback";

function deferred(): Readonly<{
  promise: Promise<void>;
  resolve: () => void;
}> {
  let resolvePromise: (() => void) | undefined;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });
  return {
    promise,
    resolve: () => resolvePromise?.(),
  };
}

describe("playback startup ownership", () => {
  test("only exposes Stop while playback is starting or active", () => {
    expect(canStopPlayback("idle")).toBeFalse();
    expect(canStopPlayback("paused")).toBeFalse();
    expect(canStopPlayback("error")).toBeFalse();
    expect(canStopPlayback("starting")).toBeTrue();
    expect(canStopPlayback("playing")).toBeTrue();
  });

  test("aborts and invalidates the previous startup when a newer one begins", () => {
    const fence = new PlaybackStartFence();
    const first = fence.begin();
    const second = fence.begin();

    expect(first.signal.aborted).toBeTrue();
    expect(fence.isCurrent(first.token)).toBeFalse();
    expect(second.signal.aborted).toBeFalse();
    expect(fence.isCurrent(second.token)).toBeTrue();
  });

  test("keeps a cancelled late startup from returning the state to playing", async () => {
    const fence = new PlaybackStartFence();
    const startup = fence.begin();
    const audioResume = deferred();
    let status = "starting";

    const lateCompletion = audioResume.promise.then(() => {
      if (fence.isCurrent(startup.token)) status = "playing";
    });

    fence.cancel();
    status = "paused";
    audioResume.resolve();
    await lateCompletion;

    expect(startup.signal.aborted).toBeTrue();
    expect(fence.isCurrent(startup.token)).toBeFalse();
    expect(status).toBe("paused");
  });
});
