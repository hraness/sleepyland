import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Home, { metadata } from "./page";
import { getResearchArticle } from "./research/articles";
import { noiseDescription, noiseTitle } from "./site";

describe("Sleepyland product homepage", () => {
  test("owns the root canonical and sound-machine metadata", () => {
    expect(metadata).toMatchObject({
      title: noiseTitle,
      description: noiseDescription,
      alternates: {
        canonical: "/",
        types: {
          "text/markdown": "/index.md",
        },
      },
      robots: INDEXABLE_ROBOTS,
      openGraph: {
        type: "website",
        url: "/",
        title: noiseTitle,
        description: noiseDescription,
      },
    });
  });

  test("puts the sound controls before a compact research module", () => {
    const markup = renderToStaticMarkup(createElement(Home));
    const featured = getResearchArticle("best-sleep-sounds");

    if (featured === undefined) {
      throw new Error("Expected one featured research guide.");
    }

    expect(markup).toContain('aria-label="Sound controls"');
    expect(markup).toContain('aria-label="Play sound"');
    expect(markup).toContain(featured.title);
    expect(markup).toContain('href="/research"');
    const orderedMarkers = ['aria-label="Sound controls"', featured.title];
    const positions = orderedMarkers.map((marker) => markup.indexOf(marker));
    expect(positions.every((position) => position >= 0)).toBeTrue();
    expect(positions).toEqual([...positions].toSorted((left, right) => left - right));
  });
});
