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

    expect(source).toContain("Built as a sound instrument");
    expect(source).toContain("Three states, three sound systems");
    expect(source).toContain("Sleep combines a dark brown bed");
    expect(source).toMatch(/steady,\s+low-salience/u);
    expect(source).toContain("Generated, not looped");
    expect(source).toMatch(/surge,\s+cavity\s+impact,\s+foam/u);
    expect(source).toContain("without a repeating recording");
    expect(source).toContain("Movement without a loudness trick");
    expect(source).toContain("Energy never changes the");
    expect(source).toContain("Sessions with an ending");
    expect(source).toContain("completed sessions finish with a quiet fade");
    expect(source).toContain("The output stays visible");
    expect(source).toContain("continuous filtered-noise voice");
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
