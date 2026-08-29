export type PlaybackStatus = "error" | "idle" | "paused" | "playing" | "starting";

export type PlaybackStart = Readonly<{
  signal: AbortSignal;
  token: number;
}>;

/**
 * Owns the one in-flight audio startup attempt. Cancelling advances the token
 * as well as aborting the signal, so a browser that settles `AudioContext`
 * startup late cannot commit stale playback UI state.
 */
export class PlaybackStartFence {
  private controller: AbortController | null = null;
  private token = 0;

  begin(): PlaybackStart {
    this.controller?.abort();
    this.token += 1;
    this.controller = new AbortController();
    return { signal: this.controller.signal, token: this.token };
  }

  cancel(): void {
    this.controller?.abort();
    this.controller = null;
    this.token += 1;
  }

  clear(token: number): void {
    if (this.token === token) this.controller = null;
  }

  isCurrent(token: number): boolean {
    return this.token === token;
  }
}

export function canStopPlayback(status: PlaybackStatus): boolean {
  return status === "playing" || status === "starting";
}
