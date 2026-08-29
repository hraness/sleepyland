import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { homepageDocumentText } from "./agent-access";
import Home, { metadata } from "./page";
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

  test("server-renders the research index and prominent sound-machine route", () => {
    const markup = renderToStaticMarkup(createElement(Home));
    const text = homepageDocumentText();

    expect(text.length).toBeGreaterThan(500);
    expect(markup).toContain("<h1>Sleep research, without the wellness myths.</h1>");
    expect(markup).toContain("Practical, evidence-led guides for people trying to sleep better.");
    expect(markup).toContain('href="/noise"');
    expect(markup).toContain("Editorial method");
    expect(markup).toContain('href="https://github.com/hraness/sleepyland"');
    expect(markup).toContain("open source on GitHub");
    expect(markup).toContain('class="plain-publication__entry"');
    expect(markup).not.toContain("sleepyland-visually-hidden");
  });
});
