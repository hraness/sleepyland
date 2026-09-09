import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NoiseInfo } from "./noise-studio";

describe("Sleepyland product explanation", () => {
  test("exposes a familiar named info action", () => {
    const markup = renderToStaticMarkup(createElement(NoiseInfo));

    expect(markup).toContain('aria-label="How Sleepyland works"');
    expect(markup).toContain("<button");
  });

  test("explains the synthesized engine in consumer language", async () => {
    const source = await Bun.file(
      new URL("./noise-studio.tsx", import.meta.url),
    ).text();

    expect(source).toContain("How to use Sleepyland");
    expect(source).toContain("Choose Sleep, Relax, or Focus. Press play");
    expect(source).toContain("Choose a starting sound");
    expect(source).toContain("Sleep pairs deep brown noise with slow waves");
    expect(source).toContain("subtle, steady rhythm");
    expect(source).toContain("Adjust the mix");
    expect(source).toContain("The wave interval controls the time between swells");
    expect(source).toContain("no repeating recording to download");
    expect(source).toContain("Change the energy");
    expect(source).toContain("Energy does not change the master volume");
    expect(source).toContain("Set a session");
    expect(source).toContain("completed sessions finish with a quiet fade");
    expect(source).toContain("Play the visualization");
    expect(source).toContain("hold and move to explore different pitches");
    expect(source).not.toMatch(/low-salience|spectral slopes|cavity impact/u);
    expect(source).toContain("no accounts, ads, session replay, cloud audio");
    expect(source).toContain("anonymous, cookieless events");
    expect(source).toContain("selected state and");
    expect(source).toContain("session kind; they do not include Energy, tuning, exact playback");
    expect(source).toContain("Open source and open to correction");
    expect(source).toContain("public under the MIT License");
    expect(source).toContain("research contributions are welcome on GitHub");
    expect(source).toContain("href={repositoryUrl}");
    expect(source).toContain('aria-label="Product information"');
    for (const path of ["/about", "/research", "/demo", "/privacy", "/support", "/accessibility"]) {
      expect(source).toContain(`href="${path}"`);
    }
    expect(source).not.toContain("Deep work, Learn, Create, and Quick task");
    expect(source).not.toMatch(/guarantee|cure|treat insomnia/iu);
  });
});
