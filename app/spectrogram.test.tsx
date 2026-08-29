import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Spectrogram } from "./noise-studio";

describe("interactive spectrogram", () => {
  test("publishes one keyboard-accessible spatial noise control", () => {
    const markup = renderToStaticMarkup(createElement(Spectrogram, {
      analyser: null,
      noiseType: "brown",
      onGestureEnd: () => undefined,
      onGestureMove: () => undefined,
      onGestureStart: () => undefined,
      tone: 25,
    }));

    expect(markup.match(/<canvas/gu)).toHaveLength(2);
    expect(markup).toContain('<button');
    expect(markup).toContain('class="sleepyland-pressable spectrum-instrument"');
    expect(markup).toContain("sleepyland-visually-hidden");
    expect(markup).not.toContain('role="button"');
    expect(markup).not.toContain("aria-pressed");
    expect(markup).toContain("Tap for a pulse or press and hold");
    expect(markup).not.toContain("title=");
    expect(markup).not.toContain("sleepyland-icon-tooltip");
  });
});
