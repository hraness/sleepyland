import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import NoisePage, { metadata } from "./page";
import {
  CLINICAL_REVIEW_REQUIRED_RESEARCH_SLUGS,
  isIndexableResearchArticle,
  getResearchArticle,
} from "../research/articles";
import { defaultSocialImage } from "../seo";
import { noiseDescription, noiseTitle } from "../site";
import { featuredResearchResources } from "./research-resources";

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

  test("fails closed when a quarantined guide is proposed for the product surface", () => {
    const resources = featuredResearchResources([
      "best-sleep-sounds",
      ...CLINICAL_REVIEW_REQUIRED_RESEARCH_SLUGS,
    ]);

    expect(resources.map((resource) => resource.path)).toEqual([
      "/research/best-sleep-sounds",
    ]);
    for (const resource of resources) {
      const article = getResearchArticle(resource.path.slice("/research/".length));
      expect(article).toBeDefined();
      expect(article === undefined ? false : isIndexableResearchArticle(article)).toBeTrue();
    }
  });
});
