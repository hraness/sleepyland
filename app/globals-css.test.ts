import { expect, test } from "bun:test";

const stylesheet = await Bun.file(new URL("./globals.css", import.meta.url)).text();
const foundationStylesheet = await Bun.file(
  new URL("../styles/foundation.css", import.meta.url),
).text();
const publicationStylesheet = await Bun.file(
  new URL("../styles/plain-publication.css", import.meta.url),
).text();
const studioSource = await Bun.file(
  new URL("./noise-studio.tsx", import.meta.url),
).text();
const listeningStatsModuleExists = await Bun.file(
  new URL("./listening-stats.ts", import.meta.url),
).exists();

test("the design route receives the complete shared browser stylesheet", () => {
  expect(stylesheet.startsWith('@import "@hraness/design-kit/styles.css";')).toBeTrue();
  expect(stylesheet).toContain('@import "../styles/foundation.css";');
  expect(stylesheet).not.toContain('@jungle/');
});

test("global resets leave shared control paint to the design system", () => {
  expect(stylesheet).not.toMatch(
    /(?:^|\n)button\s*\{[^}]*\b(?:color|font)\s*:/su,
  );
});

test("the product palette cannot override gallery themes at the document root", () => {
  expect(stylesheet).toMatch(/\.noise-app\s*\{[^}]*--noise-background:\s*#080604;/su);
  expect(stylesheet).toMatch(/\.noise-app\s*\{[^}]*--noise-muted:\s*#aa7745;[^}]*--noise-faint:\s*#98663b;/su);
  expect(stylesheet).toMatch(/\.noise-app\s*\{[^}]*--noise-header-inset:\s*env\(safe-area-inset-top\);/su);
  expect(stylesheet).toMatch(/\.noise-app\s*\{[^}]*overflow:\s*clip;/su);
  expect(stylesheet).not.toMatch(/\.noise-app\s*\{[^}]*overflow:\s*hidden;/su);
  expect(stylesheet).not.toMatch(/\.noise-app\s*\{[^}]*min-height:/su);
  expect(stylesheet).not.toContain("min-width: 320px");
  expect(stylesheet).not.toContain("overflow-x: hidden");
  expect(stylesheet).toMatch(/body:has\(> \.noise-app\) > \.hraness-site-footer\s*\{[^}]*display:\s*none;/su);
  expect(stylesheet).toMatch(/\.noise-app\s*\{[^}]*--noise-header-height:\s*calc\(60px \+ var\(--noise-header-inset\)\);/su);
  expect(stylesheet).toMatch(/\.noise-app\s*\{[^}]*grid-template-rows:\s*var\(--noise-header-height\) minmax\(0, 1fr\) auto;/su);
  expect(stylesheet).toMatch(/\.app-header\s*\{[^}]*grid-row:\s*1;/su);
  expect(stylesheet).toMatch(/\.wordmark\s*\{[^}]*flex:\s*1 1 auto;/su);
  expect(stylesheet).toMatch(/\.header-actions\s*\{[^}]*flex:\s*0 0 auto;/su);
  expect(stylesheet).toMatch(/\.visual-panel\s*\{[^}]*grid-row:\s*2;/su);
  expect(stylesheet).toMatch(/\.control-deck\s*\{[^}]*grid-row:\s*3;/su);
  expect(stylesheet).toMatch(/\.app-header\s*\{[^}]*padding:\s*calc\(var\(--noise-header-inset\) \+ var\(--layout-chrome-inset\)\)\s+max\(var\(--layout-chrome-inset\), env\(safe-area-inset-right\)\)\s+var\(--layout-chrome-inset\)\s+max\(var\(--layout-chrome-inset\), env\(safe-area-inset-left\)\);/su);
  expect(stylesheet).not.toMatch(
    /\.noise-app\s*\{[^}]*var\(--layout-edge-inset\)/su,
  );
  expect(stylesheet).not.toMatch(/:root\s*\{[^}]*--background:\s*#080604;/su);
});

test("the research routes use the shared plain-site document grammar", () => {
  expect(stylesheet).toStartWith('@import "@hraness/design-kit/styles.css";');
  expect(stylesheet).toContain('@import "../styles/foundation.css";');
  expect(stylesheet).not.toContain(".plain-site.plain-publication");
  expect(stylesheet).not.toContain(".plain-publication__article-body");
  expect(publicationStylesheet).toMatch(/\.plain-site\.plain-publication\s*\{[^}]*--plain-shell-measure:\s*46rem;[^}]*background:\s*var\(--plain-background\);[^}]*color:\s*var\(--plain-foreground\);/su);
  expect(publicationStylesheet).toMatch(/\.plain-site\.plain-publication \.plain-publication__shell\s*\{[^}]*max-width:\s*var\(--plain-shell-measure\);[^}]*safe-area-inset-right[^}]*safe-area-inset-left/su);
  expect(publicationStylesheet).toMatch(/\.plain-site\.plain-publication \.plain-publication__hero h1,[\s\S]*?font-family:\s*var\(--publication-serif\);[^}]*font-size:\s*clamp\(2\.1rem, 6vw, 3rem\);/u);
  expect(publicationStylesheet).toMatch(/\.plain-site\.plain-publication \.plain-publication__article-body\s*\{[^}]*font-family:\s*var\(--publication-serif\);[^}]*font-size:\s*1\.08rem;[^}]*line-height:\s*1\.72;/su);
  expect(publicationStylesheet).toMatch(/:where\(\.plain-site\.plain-publication a:not\(\.sleepyland-skip-link\)\)\s*\{[^}]*text-decoration:\s*none;/su);
  expect(publicationStylesheet).toMatch(/\.plain-site\.plain-publication \.plain-publication__entry\s*\{[^}]*border-top:\s*0;/su);
  expect(publicationStylesheet).toMatch(/\.plain-site\.plain-publication \.plain-publication__toc\s*\{[^}]*position:\s*static;/su);
  expect(stylesheet).not.toContain("--research-background");
  expect(stylesheet).not.toContain("--research-action");
  expect(stylesheet).not.toContain("research-card-grid");
  expect(stylesheet).not.toMatch(/(?:linear|radial|conic)-gradient/u);
});

test("the foundation centers slider thumbs and keeps breadcrumbs on one line", () => {
  expect(foundationStylesheet).toMatch(/\.sleepyland-fader\[data-orientation="horizontal"\] \.sleepyland-fader__thumb\s*\{[^}]*top:\s*50%;/su);
  expect(foundationStylesheet).toMatch(/\.sleepyland-fader\[data-orientation="vertical"\] \.sleepyland-fader__thumb\s*\{[^}]*left:\s*50%;/su);
  expect(foundationStylesheet).toMatch(/\.sleepyland-breadcrumbs ol\s*\{[^}]*flex-wrap:\s*nowrap;[^}]*overflow:\s*hidden;/su);
  expect(foundationStylesheet).toMatch(/\.sleepyland-breadcrumbs li:last-child\s*\{[^}]*flex:\s*1 1 auto;/su);
  expect(foundationStylesheet).toMatch(/\.sleepyland-breadcrumbs \[aria-current="page"\]\s*\{[^}]*overflow:\s*hidden;[^}]*text-overflow:\s*ellipsis;[^}]*white-space:\s*nowrap;/su);
});

test("the removed listening statistics leave no UI or storage styling", () => {
  expect(stylesheet).not.toContain("listening-stats");
  expect(foundationStylesheet).not.toContain("listening-stats");
  expect(studioSource).not.toMatch(/ListeningStats|listeningStats|listening-stats/u);
  expect(listeningStatsModuleExists).toBeFalse();
});

test("the removed speaker-routing UI leaves no stale product styling", () => {
  expect(stylesheet).not.toContain(".app-header__readout");
  expect(stylesheet).not.toContain(".output-button");
  expect(stylesheet).not.toContain(".output-notice");
});

test("the spectrum instrument supports precise pointer input without instructional chrome", () => {
  expect(stylesheet).toMatch(/\.spectrogram canvas\s*\{[^}]*pointer-events:\s*none;/su);
  expect(stylesheet).toMatch(/\.spectrum-instrument\s*\{[^}]*background:\s*transparent;[^}]*cursor:\s*crosshair;[^}]*touch-action:\s*none;[^}]*user-select:\s*none;/su);
  expect(stylesheet).toMatch(/\.spectrum-instrument:is\(\[data-focus-visible\], :focus-visible\)\s*\{[^}]*outline:\s*2px solid rgba\(255, 220, 176, 0\.9\);/su);
  expect(stylesheet).toMatch(/\.spectrum-instrument\[data-interacting\]\s*\{[^}]*cursor:\s*none;/su);
  expect(stylesheet).not.toContain(".spectrogram-tooltip");
});

test("the outcome-first deck keeps primary actions compact and tuning secondary", () => {
  const pickerRule = stylesheet.match(/\.noise-app \.energy-picker__surface\s*\{(?<body>[^}]*)\}/u)?.groups?.body;
  expect(pickerRule).toBeDefined();
  expect(pickerRule).not.toMatch(/(?:^|;)\s*(?:background|border(?!-radius))\s*:/u);
  expect(stylesheet).not.toContain("--noise-jelly-gutter");
  expect(stylesheet).not.toContain("--noise-jelly-clearance");
  expect(stylesheet).toMatch(/\.control-deck\s*\{[^}]*gap:\s*8px;[^}]*padding:\s*var\(--layout-chrome-inset\)\s+max\(var\(--layout-chrome-inset\), env\(safe-area-inset-right\)\)\s+max\(var\(--layout-chrome-inset\), env\(safe-area-inset-bottom\)\)\s+max\(var\(--layout-chrome-inset\), env\(safe-area-inset-left\)\);/su);
  expect(stylesheet).toMatch(/\.control-deck__primary\s*\{[^}]*grid-template-columns:\s*var\(--control-height-transport\)\s+minmax\(340px, 1fr\)\s+max-content\s+max-content;/su);
  expect(stylesheet).toMatch(/\.sound-mode-picker__surface\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/su);
  expect(stylesheet).toMatch(/\.sound-mode-button\s*\{[^}]*height:\s*50px;[^}]*background:\s*transparent;/su);
  expect(stylesheet).toMatch(/\.sound-mode-button\[data-selected\]\s*\{[^}]*background:\s*var\(--noise-control-hover\);/su);
  expect(stylesheet).toMatch(/\.sound-tuning\s*\{[^}]*grid-template-columns:\s*minmax\(210px, 0\.7fr\)\s*minmax\(240px, 0\.8fr\)\s*minmax\(0, 3fr\);/su);
  expect(stylesheet).toMatch(/\.sound-tuning\[hidden\]\s*\{[^}]*display:\s*none;/su);
  expect(stylesheet).toMatch(/\.mixer-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/su);
  expect(stylesheet).toMatch(/\.energy-picker__options\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/su);
  expect(stylesheet).not.toContain("focus-activity-picker");
  expect(stylesheet).toMatch(/\.range-control__header\s*\{[^}]*--sleepyland-wrapping-row-gap:\s*2px 8px;[^}]*justify-content:\s*space-between;/su);
  expect(stylesheet).toMatch(/\.range-control__header > span\s*\{[^}]*flex:\s*1 1 4\.75rem;[^}]*overflow-wrap:\s*anywhere;/su);
  expect(stylesheet).toMatch(/\.range-control output\s*\{[^}]*max-width:\s*100%;[^}]*flex:\s*0 0 auto;[^}]*white-space:\s*nowrap;/su);
  expect(stylesheet).toMatch(/\.noise-app \.energy-picker__surface\s*\{[^}]*display:\s*block;[^}]*width:\s*100%;[^}]*max-width:\s*none;[^}]*border-radius:\s*var\(--jelly-radius-control\);/su);
  expect(stylesheet).toMatch(/\.control-deck\s*\{[^}]*--control-height-transport:\s*72px;[^}]*--noise-action-height:\s*52px;[^}]*--noise-transport-glyph-size:\s*36px;/su);
  expect(stylesheet).toMatch(/\.transport-controls\s*\{[^}]*display:\s*grid;[^}]*width:\s*var\(--control-height-transport\);[^}]*height:\s*var\(--control-height-transport\);[^}]*place-items:\s*center;/su);
  expect(stylesheet).toMatch(/\.noise-app \.transport-button,[\s\S]*?--jelly-fill:\s*var\(--noise-action\);[\s\S]*?--jelly-label:\s*#fff;[\s\S]*?width:\s*var\(--control-height-transport\);[\s\S]*?height:\s*var\(--control-height-transport\);/u);
  expect(stylesheet).toMatch(/\.transport-button__control\s*\{[^}]*height:\s*var\(--control-height-transport\);[^}]*min-height:\s*var\(--control-height-transport\);/su);
  expect(stylesheet).toMatch(/\.transport-button__control\s*\{[^}]*border-radius:\s*var\(--radius-round\);/su);
  expect(stylesheet).toMatch(/\.transport-button__control\[data-focus-visible\]\s*\{[^}]*outline-color:\s*#fff;/su);
  expect(stylesheet).not.toMatch(
    /\.transport-button:(?:hover|focus)[^{]*\{[^}]*background\s*:/su,
  );
  expect(stylesheet).not.toMatch(
    /\.transport-button\[data-pressed\][^{]*\{[^}]*background\s*:/su,
  );
  expect(stylesheet).toMatch(
    /\.noise-app \.transport-button:is\(:hover, \[data-hovered\]\):not\(\[data-disabled\]\)\s*\{[^}]*--jelly-fill:\s*var\(--noise-action-hover\);/su,
  );
  expect(stylesheet).toMatch(
    /\.noise-app \.transport-button:has\(\.transport-button__control\[data-pressed\]\):not\(\[data-disabled\]\)\s*\{[^}]*--jelly-fill:\s*var\(--noise-action-pressed\);/su,
  );
  expect(stylesheet).not.toContain(".stop-button");
  expect(stylesheet).toMatch(/\.energy-picker__options \.sleepyland-segmented-control__item\s*\{[^}]*height:\s*52px;[^}]*border-radius:\s*var\(--jelly-radius-compact\);/su);
  expect(stylesheet).toMatch(/\.noise-app \.timer-button,\s*\.noise-app \.tune-button\s*\{[^}]*height:\s*var\(--noise-action-height\);[^}]*border-radius:\s*var\(--jelly-radius-compact\);/su);
  expect(stylesheet).toMatch(/\.timer-button,\s*\.tune-button\s*\{[^}]*width:\s*max-content;[^}]*min-width:\s*0;/su);
  expect(stylesheet).toMatch(/\.noise-app \.timer-button__control,\s*\.noise-app \.tune-button__control\s*\{[^}]*min-height:\s*var\(--noise-action-height\);/su);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.control-deck\s*\{[^}]*gap:\s*8px;/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.control-deck__primary\s*\{[^}]*grid-template-areas:\s*"mode mode mode"\s*"play timer tune";/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.sound-tuning\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.mixer-grid\s*\{[^}]*grid-template-areas:\s*"noise waves"\s*"warmth pace";[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.noise-volume-control\s*\{[^}]*grid-area:\s*noise;/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.wave-volume-control\s*\{[^}]*grid-area:\s*waves;/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.warmth-control\s*\{[^}]*grid-area:\s*warmth;/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.wave-pace-control\s*\{[^}]*grid-area:\s*pace;/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.control-deck\s*\{[^}]*--control-height-transport:\s*64px;[^}]*--noise-action-height:\s*50px;/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*650px\)[\s\S]*?\.transport-controls\s*\{[^}]*width:\s*var\(--control-height-transport\);/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*390px\)[\s\S]*?\.timer-button__control > svg,\s*\.tune-button__control > svg\s*\{[^}]*display:\s*none;/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*390px\)[\s\S]*?\.wordmark__tagline\s*\{[^}]*display:\s*none;/u);
  expect(stylesheet).toMatch(/@media \(max-width:\s*340px\)[\s\S]*?\.header-research-link\s*\{[^}]*display:\s*none;/u);
  expect(stylesheet).toMatch(/@media \(orientation:\s*landscape\) and \(max-height:\s*650px\)[\s\S]*?\.control-deck\s*\{[^}]*--control-height-transport:\s*56px;[^}]*--noise-action-height:\s*46px;/u);
  expect(stylesheet).toMatch(/@media \(orientation:\s*landscape\) and \(max-height:\s*650px\)[\s\S]*?\.control-deck__primary\s*\{[^}]*grid-template-areas:\s*"play mode timer tune";/u);
  expect(stylesheet).toMatch(/@media \(orientation:\s*landscape\) and \(max-height:\s*650px\)[\s\S]*?\.sound-tuning\s*\{[^}]*grid-template-areas:\s*"energy noise"\s*"mixer mixer";[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/u);
  expect(stylesheet).toMatch(/@media \(orientation:\s*landscape\) and \(max-height:\s*650px\)[\s\S]*?\.mixer-grid\s*\{[^}]*grid-template-areas:\s*none;[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/u);
  expect(stylesheet).toMatch(/@media \(orientation:\s*landscape\) and \(max-height:\s*300px\)[\s\S]*?\.noise-app\s*\{[^}]*--noise-header-height:\s*0px;[\s\S]*?\.app-header\s*\{[^}]*display:\s*none;/u);
  expect(stylesheet).not.toContain(".noise-theme-toggle");
  expect(stylesheet).not.toContain(".play-button");
  expect(stylesheet).not.toMatch(/::part\(jelly\)\s*\{[^}]*display:\s*none;/su);
});
