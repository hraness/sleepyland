import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import GlobalError from "./global-error";

const canonicalFoundationDeclaration = /--(?:accent|background|card|control-border|elevation-low|elevation-overlay|elevation-raised|focus|font-mono|font-text|foreground|grid|line|motion-duration-fast|motion-duration-slow|motion-duration-standard|popover|primary|secondary|surface|surface-hover|surface-raised)\s*:/u;

type Rgb = readonly [number, number, number];

function linearizeSrgb(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([red, green, blue]: Rgb): number {
  return (
    linearizeSrgb(red) * 0.2126
    + linearizeSrgb(green) * 0.7152
    + linearizeSrgb(blue) * 0.0722
  );
}

function contrastRatio(foreground: Rgb, background: Rgb): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (foregroundLuminance + 0.05) / (backgroundLuminance + 0.05);
}

function compositeColor(foreground: Rgb, background: Rgb, alpha: number): Rgb {
  return [
    Math.round(foreground[0] * alpha + background[0] * (1 - alpha)),
    Math.round(foreground[1] * alpha + background[1] * (1 - alpha)),
    Math.round(foreground[2] * alpha + background[2] * (1 - alpha)),
  ];
}

async function source(name: string): Promise<string> {
  return Bun.file(new URL(name, import.meta.url)).text();
}

function metaTags(html: string, name: string): readonly string[] {
  return html.match(new RegExp(`<meta[^>]*name="${name}"[^>]*>`, "gu")) ?? [];
}

describe("Sleepyland shared appearance contract", () => {
  test("keeps a fixed warm-night studio inside the shared appearance runtime", async () => {
    const [layout, noisePage, providers, studio, stylesheet] = await Promise.all([
      source("./layout.tsx"),
      source("./noise/page.tsx"),
      source("./providers.tsx"),
      source("./noise-studio.tsx"),
      source("./globals.css"),
    ]);

    expect(layout).toContain('<html data-theme="light" lang="en" suppressHydrationWarning>');
    expect(layout).toContain("<SleepylandThemeProvider>");
    expect(layout).toContain('{ color: "#151515", media: "(prefers-color-scheme: dark)" }');
    expect(providers).toContain('const isStudio = pathname === "/noise"');
    expect(providers).toContain('forcedTheme={isStudio ? "dark" : undefined}');
    expect(providers).toContain("<ThemeColorSync");
    expect(noisePage).toContain('colorScheme: "dark"');
    expect(noisePage).toContain('themeColor: "#080604"');
    expect(noisePage).toContain("<h1>{NOISE_HEADING}</h1>");
    expect(noisePage).toContain('className="sleepyland-visually-hidden"');
    expect(studio).not.toContain("ThemeMenuButton");
    expect(studio).not.toContain("ThemeToggle");
    expect(studio).not.toContain("ThemedSurface");
    expect(studio).toContain('<ViewportFrame as="main" className="noise-app">');
    expect(studio.match(/<WrappingRow as="span" className="range-control__header">/gu)).toHaveLength(4);
    expect(stylesheet).toContain("--noise-background: #080604");
    expect(stylesheet).toContain("--noise-text: #e6aa65");
    expect(stylesheet).toContain("--noise-action: #9f4f0c");
    expect(stylesheet).not.toMatch(/(?:linear|radial|conic)-gradient/u);
    expect(stylesheet).not.toContain("--noise-accent");
  });

  test("uses shared route states and keeps its fixed visualization palette off the root", async () => {
    const [error, foundation, globalError, localUi, loading, notFound, publication, researchShell, stylesheet] = await Promise.all([
      source("./error.tsx"),
      source("../styles/foundation.css"),
      source("./global-error.tsx"),
      source("../lib/ui.tsx"),
      source("./research/loading.tsx"),
      source("./not-found.tsx"),
      source("../styles/plain-publication.css"),
      source("./research/research-shell.tsx"),
      source("./globals.css"),
    ]);

    expect(error).toContain("RouteErrorPage");
    expect(error).toContain("showThemeToggle={false}");
    expect(globalError).toContain("GlobalErrorDocument");
    expect(globalError).toContain('darkColor="#080604"');
    expect(globalError).toContain('theme="dark"');
    expect(localUi).toContain("SharedGlobalErrorDocument");
    expect(localUi).toContain('darkColor = "#151515"');
    expect(localUi).toContain('lightColor = "#ffffff"');
    expect(localUi).not.toContain('theme === "system" ? undefined : theme');
    expect(loading).toContain("RouteLoadingPage");
    expect(notFound).toContain("RouteNotFoundPage");
    expect(notFound).toContain("showThemeToggle={false}");
    expect(researchShell).toContain('colorScheme: "light dark"');
    expect(researchShell).toContain(
      '{ color: "#ffffff", media: "(prefers-color-scheme: light)" }',
    );
    expect(researchShell).toContain(
      '{ color: "#151515", media: "(prefers-color-scheme: dark)" }',
    );
    expect(researchShell).toContain('className="plain-header__actions"');
    expect(researchShell).toContain("<ThemeMenuButton");
    expect(researchShell).not.toContain("<ThemeToggle");
    expect(researchShell.indexOf("<ThemeMenuButton")).toBeGreaterThan(
      researchShell.indexOf("</nav>"),
    );
    expect(localUi).toContain('className="sleepyland-design__header"');
    expect(localUi).toContain('className="sleepyland-design__appearance"');
    expect(localUi).toContain("<ThemeMenuButton");
    expect(localUi).not.toContain("<ThemeToggle");
    expect(stylesheet).toContain('@import "../styles/foundation.css"');
    expect(stylesheet).not.toMatch(canonicalFoundationDeclaration);
    expect(stylesheet).toMatch(/\.noise-app\s*\{[^}]*--noise-background:\s*#080604;/su);
    expect(foundation).toContain(':root[data-theme="dark"] body');
    expect(foundation).toContain(':root:not([data-theme]) body');
    expect(foundation).toContain(".sleepyland-route-state button {");
    expect(foundation).toContain("color: inherit");
    expect(publication).not.toContain("--plain-background: #141412");
    expect(publication).not.toContain("color-mix(in srgb, var(--plain-link) 78%, white)");
    expect(publication).toMatch(/a:not\(\.sleepyland-skip-link\):hover\)[^{]*\{[^}]*color:\s*var\(--plain-link\);[^}]*text-decoration:\s*underline;/su);
    expect(stylesheet).toStartWith('@import "@hraness/design-kit/styles.css";');
  });

  test("keeps the root-replacing error document fixed to the studio dark palette", () => {
    const html = renderToStaticMarkup(createElement(GlobalError, {
      error: new Error("render failed"),
      reset: () => undefined,
    }));
    const colorScheme = metaTags(html, "color-scheme");
    const themeColors = metaTags(html, "theme-color");

    expect(html).toContain('<html data-theme="dark" lang="en">');
    expect(colorScheme).toHaveLength(1);
    expect(colorScheme[0]).toContain('content="dark"');
    expect(themeColors).toHaveLength(1);
    expect(themeColors[0]).toContain('content="#080604"');
    expect(themeColors[0]).not.toContain("media=");
    expect(html).not.toContain('data-hraness-design-theme-guard=""');
    expect(html).not.toContain("hraness-design-theme-v1");
    expect(html).not.toContain("#ffffff");
    expect(html).not.toContain("#151515");
    expect(html).not.toContain("data-hraness-appearance-menu");
    expect(html).not.toContain("hraness-design-theme-toggle");
  });

  test("keeps small canvas labels at accessible contrast against the studio background", async () => {
    const studio = await source("./noise-studio.tsx");
    const labelAlpha = studio.match(
      /overlayContext\.fillStyle = "rgba\(230, 170, 101, (?<alpha>[\d.]+)\)";\s*overlayContext\.font = `\$\{10 \* pixelRatio\}px/u,
    )?.groups?.alpha;

    expect(labelAlpha).toBeDefined();
    const alpha = Number(labelAlpha);
    const background = [8, 6, 4] as const;
    const label = [230, 170, 101] as const;
    const compositedLabel = compositeColor(label, background, alpha);
    expect(contrastRatio(compositedLabel, background)).toBeGreaterThanOrEqual(4.5);
  });

  test("keeps small research metadata readable in both plain-site themes", () => {
    const lightBackground = [255, 255, 255] as const;
    const lightMuted = [102, 102, 102] as const;
    const darkBackground = [21, 21, 21] as const;
    const darkMuted = [182, 182, 182] as const;

    expect(contrastRatio(lightBackground, lightMuted)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(darkMuted, darkBackground)).toBeGreaterThanOrEqual(4.5);
  });

});
