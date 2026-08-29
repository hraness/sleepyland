import { describe, expect, test } from "bun:test";
import { NOINDEX_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import DesignPage, { metadata } from "./page";
import { site } from "../site";

describe("Sleepyland design metadata", () => {
  test("keeps its own noindex identity instead of the homepage", () => {
    expect(metadata.title).toBe("Design system");
    expect(metadata.description).toBe(
      "Sleepyland's living browser design-system specification and responsive component stress lab.",
    );
    expect(metadata.robots).toEqual(NOINDEX_ROBOTS);
    expect(metadata.alternates).toEqual({
      canonical: "/design",
    });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: "/design",
      siteName: site.shortName,
      title: "Design system",
      description: metadata.description,
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Design system",
      description: metadata.description,
    });
  });

  test("keeps one appearance menu as the final gallery-header action", () => {
    const markup = renderToStaticMarkup(createElement(DesignPage));
    const headerEnd = markup.indexOf("</header>");
    const appearance = markup.indexOf("hraness-design-theme-toggle");

    expect(markup).toContain('class="sleepyland-design__header"');
    expect(markup).toContain('data-presentation="menu"');
    expect(markup).toContain('data-theme-value="system"');
    expect(markup.match(/class="hraness-design-theme-toggle(?: |")/gu)).toHaveLength(1);
    expect(appearance).toBeGreaterThan(markup.indexOf("Sleepyland design"));
    expect(headerEnd).toBeGreaterThan(appearance);
    expect(markup.slice(headerEnd)).not.toContain("hraness-design-theme-toggle");
  });
});
