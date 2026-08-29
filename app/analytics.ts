import {
  POSTHOG_SCHEMA_VERSION,
  type PostHogSiteDefinition,
} from "@hraness/posthog";

import { PRODUCT_PAGES } from "./product-pages";
import { READING_NOTES } from "./reading-notes";

export const sleepylandPostHogSite = {
  id: "sleepyland",
  canonicalDomain: "sleepy.land",
  allowedHosts: ["sleepy.land", "www.sleepy.land"],
  schemaVersion: POSTHOG_SCHEMA_VERSION,
  routes: [
    {
      match: "exact",
      path: "/",
      pageKind: "research_index",
      contentGroup: "research",
    },
    { match: "exact", path: "/noise", pageKind: "sound_generator" },
    {
      match: "prefix",
      path: "/research",
      pageKind: "research_article",
      contentGroup: "research",
      captureSlug: true,
    },
    {
      match: "exact",
      path: "/reading",
      pageKind: "reading_index",
      contentGroup: "reading",
    },
    { match: "exact", path: "/design", pageKind: "design_system" },
    ...PRODUCT_PAGES.map((page) => ({
      match: "exact" as const,
      path: page.path,
      pageKind: page.slug === "demo" ? "product_demo" : "product_info",
      contentGroup: "product_info",
    })),
    ...READING_NOTES.map((note) => ({
      match: "exact" as const,
      path: note.path,
      pageKind: "reading_note",
      contentGroup: "reading",
    })),
  ],
  stripQueryAttribution: true,
  customEvents: [
    "page not found",
    "sound playback started",
    "sound playback stopped",
    "sound mode selected",
    "sound session completed",
  ],
} as const satisfies PostHogSiteDefinition;
