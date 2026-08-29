import { describe, expect, test } from "bun:test";
import { NOINDEX_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { RouteNotFoundPage } from "@/lib/ui";

import { metadata } from "./not-found";
import { site } from "./site";

describe("Sleepyland not-found metadata", () => {
  test("uses a distinct noindex page instead of the homepage identity", () => {
    expect(metadata).toEqual({
      title: `not found · ${site.shortName}`,
      description: "this page does not exist.",
      robots: NOINDEX_ROBOTS,
    });
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).toBeUndefined();
  });

  test("points agents at the sound machine, research, llms.txt, and sitemap", () => {
    const markup = renderToStaticMarkup(createElement(RouteNotFoundPage));

    expect(markup).toContain("Page not found");
    expect(markup).toContain('aria-label="Where to look next"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/noise"');
    expect(markup).toContain('href="/llms.txt"');
    expect(markup).toContain('href="/sitemap.md"');
  });
});
