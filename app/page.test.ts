import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { homepageDocumentText } from "./agent-access";
import { researchEditorialImage } from "./editorial-images";
import { homepageAgentRequest, homepageResult } from "./homepage-content";
import Home, { metadata } from "./page";
import { researchArticlesNewestFirst } from "./research/articles";
import { RESEARCH_FEED_PATH } from "./search-discovery";
import { publicationDescription, publicationTitle } from "./site";

describe("Sleepyland publication homepage", () => {
  test("owns the root canonical, publication metadata, and feed alternate", () => {
    expect(metadata).toMatchObject({
      title: publicationTitle,
      description: publicationDescription,
      alternates: {
        canonical: "/",
        types: {
          "application/rss+xml": RESEARCH_FEED_PATH,
          "text/markdown": "/index.md",
        },
      },
      robots: INDEXABLE_ROBOTS,
      openGraph: {
        type: "website",
        url: "/",
        title: publicationTitle,
        description: publicationDescription,
      },
    });
  });

  test("server-renders the outcome, inspectable proof, and bounded action path", () => {
    const markup = renderToStaticMarkup(createElement(Home));
    const text = homepageDocumentText();
    const featured = researchArticlesNewestFirst[0];

    if (featured === undefined) {
      throw new Error("Expected one featured research guide.");
    }

    const featuredImage = researchEditorialImage(featured.slug);

    expect(text.length).toBeGreaterThan(500);
    expect(markup).toContain(`<h1>${homepageResult.heading}</h1>`);
    expect(markup).toContain(homepageResult.summary);
    expect(markup).toContain(featured.title);
    expect(markup).toContain(featured.evidenceLabel);
    expect(markup).toContain(`${featured.sourceIds.length} linked sources`);
    expect(markup).toContain(`alt="${featuredImage.alt}"`);
    expect(markup).toContain(featuredImage.caption);
    expect(markup).toContain(homepageAgentRequest.replaceAll("'", "&#x27;"));
    expect(markup).toContain('href="/noise"');
    expect(markup).toContain("Editorial method");
    expect(markup).toContain('href="https://github.com/hraness/sleepyland"');
    expect(markup).toContain("open source on GitHub");
    expect(markup).toContain('class="plain-publication__entry"');
    expect(markup).toContain('data-hraness-marketing="flow"');
    expect(markup).toContain('data-hraness-marketing="interfaces"');
    expect(markup).toContain('data-hraness-marketing="trust"');
    expect(markup).toContain('data-hraness-marketing="questions"');
    expect(markup).toContain('data-hraness-marketing="cta"');
    expect(markup).not.toContain("sleepyland-visually-hidden");

    const orderedMarkers = [
      `<h1>${homepageResult.heading}</h1>`,
      'id="first-proof"',
      'id="working-model"',
      'id="interfaces"',
      'id="research-guides"',
      'id="editorial-method"',
      'id="boundaries"',
      'id="questions"',
      'id="start"',
    ];
    const positions = orderedMarkers.map((marker) => markup.indexOf(marker));
    expect(positions.every((position) => position >= 0)).toBeTrue();
    expect(positions).toEqual([...positions].toSorted((left, right) => left - right));
  });
});
