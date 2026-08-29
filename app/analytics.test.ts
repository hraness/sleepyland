import { expect, test } from "bun:test";
import { classifyAnalyticsRoute } from "@hraness/posthog";

import { sleepylandPostHogSite } from "./analytics";
import { PRODUCT_PAGES } from "./product-pages";
import { READING_NOTES } from "./reading-notes";

test("Sleepyland analytics distinguishes the generator, research index, and articles", () => {
  expect(sleepylandPostHogSite.stripQueryAttribution).toBeTrue();
  expect(classifyAnalyticsRoute(sleepylandPostHogSite, "https://sleepy.land/")?.page_kind)
    .toBe("research_index");
  expect(classifyAnalyticsRoute(sleepylandPostHogSite, "https://sleepy.land/noise")?.page_kind)
    .toBe("sound_generator");
  expect(classifyAnalyticsRoute(
    sleepylandPostHogSite,
    "https://sleepy.land/research/noise-and-sleep-2026?private=value",
  )).toMatchObject({
    canonical_path: "/research/noise-and-sleep-2026",
    content_group: "research",
    content_slug: "noise-and-sleep-2026",
    page_kind: "research_article",
  });
});

test("Sleepyland analytics classifies every public product record without a slug", () => {
  for (const page of PRODUCT_PAGES) {
    expect(classifyAnalyticsRoute(
      sleepylandPostHogSite,
      `https://sleepy.land${page.path}?private=value`,
    )).toMatchObject({
      canonical_path: page.path,
      content_group: "product_info",
      page_kind: page.slug === "demo" ? "product_demo" : "product_info",
    });
  }
});

test("Sleepyland analytics classifies every reading note", () => {
  expect(classifyAnalyticsRoute(
    sleepylandPostHogSite,
    "https://sleepy.land/reading",
  )).toMatchObject({
    canonical_path: "/reading",
    content_group: "reading",
    page_kind: "reading_index",
  });

  for (const note of READING_NOTES) {
    expect(classifyAnalyticsRoute(
      sleepylandPostHogSite,
      `https://sleepy.land${note.path}?private=value`,
    )).toMatchObject({
      canonical_path: note.path,
      content_group: "reading",
      page_kind: "reading_note",
    });
  }
});
