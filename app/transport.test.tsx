import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { TransportControls } from "./noise-studio";
import type { PlaybackStatus } from "./playback";

const STATUSES = ["idle", "starting", "playing", "paused", "error"] as const;

function renderTransport(status: PlaybackStatus): string {
  return renderToStaticMarkup(createElement(TransportControls, {
    onPlay: () => undefined,
    onStop: () => undefined,
    status,
  }));
}

describe("Sleepyland transport", () => {
  test("keeps one circular transport action in every state", () => {
    for (const status of STATUSES) {
      const markup = renderTransport(status);
      expect(markup.match(/sleepyland-icon-button transport-button/gu)).toHaveLength(1);
      expect(markup.match(/<button/gu)).toHaveLength(1);
      expect(markup).toContain('class="sleepyland-icon-button__control transport-button__control"');
      expect(markup).not.toContain("sleepyland-button__label");
      expect(markup).toContain('data-size="transport"');
    }
  });

  test("becomes Stop during startup and playback", () => {
    for (const status of ["starting", "playing"] satisfies PlaybackStatus[]) {
      const markup = renderTransport(status);
      expect(markup).toContain('aria-label="Stop sound"');
      expect(markup).toContain('data-icon="stop"');
      expect(markup).not.toContain('data-icon="play"');
    }
    expect(renderTransport("starting")).toContain('aria-busy="true"');
  });

  test("returns to Play whenever sound is inactive", () => {
    for (const status of ["idle", "paused", "error"] satisfies PlaybackStatus[]) {
      const markup = renderTransport(status);
      expect(markup).toContain('aria-label="Play sound"');
      expect(markup).toContain('data-icon="play"');
      expect(markup).not.toContain('data-icon="stop"');
    }
  });
});
