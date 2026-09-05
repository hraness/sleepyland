import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NOISE_DOCUMENT_PARAGRAPHS } from "./agent-access";
import {
  HOME_INFORMATION_HEADING,
  HOME_INFORMATION_LEAD,
  HOME_MAKER_LINKS,
  HOME_PILLARS,
  HOME_TRUST_ITEMS,
  HomeInformation,
} from "./home-information";
import { featuredResearchResources } from "./noise/research-resources";
import { RESEARCH_AUTHORSHIP_DISCLOSURE } from "./research/editorial-disclosure";
import { applicationFeatures } from "./seo";
import { repositoryUrl } from "./site";
import { SOUND_MODES } from "./sound-modes";

const stylesheet = await Bun.file(new URL("./globals.css", import.meta.url)).text();
const studioSource = await Bun.file(new URL("./noise-studio.tsx", import.meta.url)).text();

type Rgb = readonly [number, number, number];

function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function linearize(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance([red, green, blue]: Rgb): number {
  return linearize(red) * 0.2126 + linearize(green) * 0.7152 + linearize(blue) * 0.0722;
}

function contrast(first: string, second: string): number {
  const [lighter, darker] = [luminance(hexToRgb(first)), luminance(hexToRgb(second))]
    .toSorted((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

function headings(markup: string): readonly string[] {
  return [...markup.matchAll(/<h2[^>]*>(?<text>[^<]+)<\/h2>/gu)]
    .map((match) => match.groups?.text ?? "");
}

const markup = renderToStaticMarkup(createElement(HomeInformation, {
  research: featuredResearchResources(),
}));

describe("Sleepyland homepage information layer", () => {
  test("builds the shared marketing roles in the plan's order", () => {
    const roles = [...markup.matchAll(/data-hraness-marketing="(?<role>[a-z]+)"/gu)]
      .map((match) => match.groups?.role);

    expect(roles).toEqual([
      "page",
      "section",
      "pillars",
      "section",
      "trust",
      "section",
      "questions",
      "maker",
    ]);
  });

  test("leads with the plan's headline and keeps section headings as sentences", () => {
    const [first, ...rest] = headings(markup);

    expect(first).toBe(HOME_INFORMATION_HEADING);
    expect(HOME_INFORMATION_HEADING.split(" ")).toHaveLength(8);
    expect(HOME_INFORMATION_HEADING).not.toEndWith(".");
    expect(rest.length).toBeGreaterThanOrEqual(5);
    for (const heading of rest) {
      expect(heading).toEndWith(".");
      expect(heading).toBe(heading.charAt(0).toUpperCase() + heading.slice(1));
    }
    expect(HOME_INFORMATION_LEAD.split(" ").length).toBeLessThanOrEqual(40);
    expect(`${HOME_INFORMATION_HEADING} ${HOME_INFORMATION_LEAD}`).not.toMatch(
      /bounded|exact|authority|custody|immutable|inspectable|canonical|projection|receipt/iu,
    );
    expect(markup).not.toMatch(/guaranteed to|cure|treat insomnia/iu);
  });

  test("states only what the site already claims", () => {
    expect(markup).toContain(NOISE_DOCUMENT_PARAGRAPHS[2]);
    expect(markup).toContain(RESEARCH_AUTHORSHIP_DISCLOSURE);
    for (const feature of applicationFeatures) {
      expect(markup).toContain(feature);
    }
    for (const mode of SOUND_MODES) {
      const pillar = HOME_PILLARS.find((candidate) => candidate.label === mode.label);
      expect(pillar?.summary.startsWith(`${mode.detail}: `)).toBeTrue();
      expect(markup).toContain(`<dt>${mode.label}</dt>`);
    }
    const analytics = HOME_TRUST_ITEMS.find((item) => item.label === "Analytics");
    expect(analytics).toBeDefined();
    expect(studioSource.replaceAll(/\s+/gu, " ")).toContain(analytics?.detail ?? "");
    expect(markup).toContain("Sleepyland is not a medical device, diagnosis, or treatment.");
    expect(markup).toContain("The hosted product is free to use without an account.");
    expect(markup).not.toContain("offline");
  });

  test("links research, the privacy page, and the maker", () => {
    for (const resource of featuredResearchResources()) {
      expect(markup).toContain(`href="${resource.path}"`);
      expect(markup).toContain(resource.title);
    }
    expect(markup).toContain('data-emphasis="secondary" href="/research"');
    expect(markup).toContain('href="/privacy"');
    expect(markup).toContain('href="/demo"');
    expect(HOME_MAKER_LINKS.map((link) => link.href)).toEqual([
      "https://hraness.com",
      "https://x.com/hraness",
      repositoryUrl,
    ]);
    expect(markup).toContain("Ben Guo");
    expect(markup).toContain("Puerto Rico");
  });

  test("binds the amber accent at accessible contrast in both appearances", () => {
    const light = stylesheet.match(
      /\.sleepyland-home-information\s*\{[^}]*--hraness-site-accent:\s*(?<accent>#[0-9a-f]{6});[^}]*--hraness-site-accent-ink:\s*(?<ink>#[0-9a-f]{6});/su,
    )?.groups;
    const dark = stylesheet.match(
      /:root\[data-theme="dark"\] \.sleepyland-home-information\s*\{[^}]*--hraness-site-accent:\s*(?<accent>#[0-9a-f]{6});[^}]*--hraness-site-accent-ink:\s*(?<ink>#[0-9a-f]{6});/su,
    )?.groups;

    expect(light?.accent).toBeDefined();
    expect(dark?.accent).toBeDefined();
    expect(contrast(light?.accent ?? "", light?.ink ?? "")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light?.accent ?? "", "#fbf6f2")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark?.accent ?? "", dark?.ink ?? "")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark?.accent ?? "", "#000000")).toBeGreaterThanOrEqual(4.5);
    expect(stylesheet).toMatch(
      /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme\]\) \.sleepyland-home-information/u,
    );
  });

  test("keeps the instrument chrome on the shared type and label treatment", () => {
    expect(stylesheet).not.toContain("text-transform: uppercase");
    expect(stylesheet).not.toMatch(/letter-spacing:\s*0\.[0-9]+em/u);
    expect(stylesheet).toMatch(/\.wordmark\s*\{[^}]*font-family:\s*var\(--font-text\);/su);
    expect(stylesheet).toMatch(/\.header-research-link\s*\{[^}]*font-family:\s*var\(--font-text\);/su);
    expect(stylesheet).toMatch(/\.session-completion\s*\{[^}]*border-radius:\s*var\(--jelly-radius-compact\);/su);
    expect(stylesheet).toMatch(/\.noise-app \.header-appearance\s*\{[^}]*--hraness-appearance-control-foreground:\s*var\(--noise-muted\);/su);
    expect(stylesheet).not.toContain(".sleepyland-home-research > header");
    expect(stylesheet).not.toMatch(/(?:linear|radial|conic)-gradient/u);
  });
});
