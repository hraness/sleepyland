import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import NoisePage, { metadata } from "./page";
import { defaultSocialImage } from "../seo";
import { noiseDescription, noiseTitle } from "../site";

describe("Sleepyland sound-machine route", () => {
  test("owns the /noise canonical and generator metadata", () => {
    expect(metadata).toMatchObject({
      title: noiseTitle,
      description: noiseDescription,
      alternates: {
        canonical: "/noise",
        types: { "text/markdown": "/noise.md" },
      },
      robots: INDEXABLE_ROBOTS,
      openGraph: {
        url: "/noise",
        title: noiseTitle,
        description: noiseDescription,
        images: [defaultSocialImage],
      },
    });
  });

  test("renders the sound machine with a crawlable research return path", () => {
    const markup = renderToStaticMarkup(createElement(NoisePage));

    expect(markup).toContain(
      'sleepy.land<span class="wordmark__tagline"> – calming sound machine</span>',
    );
    expect(markup).toContain('href="/"');
    expect(markup).toContain("Read Sleepyland Research");
    expect(markup).toContain("sleepyland-visually-hidden");
  });
});
