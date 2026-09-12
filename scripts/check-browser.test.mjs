import { expect, test } from "bun:test";

import { assertSnapshot, scenarios } from "./check-browser.mjs";

function validSnapshot(scenario) {
  const dark = scenario.path === "/noise" || scenario.theme === "dark";
  return {
    paper: "paper", theme: dark ? "dark" : "light",
    background: dark ? "rgb(18, 16, 15)" : "rgb(248, 247, 244)",
    foreground: dark ? "rgb(245, 242, 237)" : "rgb(28, 25, 23)",
    themeColor: dark ? "#12100f" : "#f8f7f4",
    coarse: scenario.device !== "desktop", horizontalOverflow: 0, verticalOverflow: 0,
    footers: scenario.path === "/noise" ? 0 : 1,
    appearanceControls: scenario.path === "/noise" ? 0 : 1,
    audioContexts: 0, challengeFrames: 0,
    layers: ["components.hraness-ui", "components.hraness-design-kit", "components.hraness-site-footer"],
    sans: '"Nebula Sans", sans-serif', mono: "ui-monospace, monospace",
    loadedWeights: ["400", "500", "600", "700"], serif: "Georgia, serif",
    studioBackground: "rgb(18, 16, 15)", transportHeight: 64, transportWidth: 64,
    footerPosition: "static",
    footerBackground: dark ? "rgb(18, 16, 15)" : "rgb(248, 247, 244)",
    footerColor: dark ? "rgb(245, 242, 237)" : "rgb(28, 25, 23)",
    socialTargets: Array.from({ length: 5 }, () => ({ width: 44, height: 44 })),
  };
}

test("browser matrix covers four routes, both appearances, touch, and short studio landscape", () => {
  expect(scenarios).toHaveLength(18);
  expect(new Set(scenarios.map((scenario) => JSON.stringify(scenario))).size).toBe(18);
  for (const scenario of scenarios) expect(() => assertSnapshot(validSnapshot(scenario), scenario)).not.toThrow();
});

test("browser assertions reject missing compiled CSS, fallback fonts, and changed Paper colors", () => {
  const scenario = scenarios[0];
  for (const change of [
    { layers: [] }, { loadedWeights: [] }, { sans: "sans-serif" },
    { mono: "sans-serif" }, { background: "rgb(0, 0, 0)" },
    { foreground: "rgb(255, 255, 255)" }, { themeColor: "#080604" },
    { horizontalOverflow: 2 }, { audioContexts: 1 }, { footers: 0 },
    { appearanceControls: 2 }, { transportHeight: 20 },
    { footerPosition: "fixed" }, { socialTargets: [] },
  ]) expect(() => assertSnapshot({ ...validSnapshot(scenario), ...change }, scenario)).toThrow();
});

test("studio stays dark and excludes the footer, challenge, and document scrolling", () => {
  const scenario = scenarios.find((candidate) => candidate.path === "/noise" && candidate.theme === "light");
  for (const change of [
    { theme: "light" }, { footers: 1 }, { challengeFrames: 1 },
    { verticalOverflow: 2 }, { appearanceControls: 1 },
    { studioBackground: "rgb(248, 247, 244)" },
  ]) expect(() => assertSnapshot({ ...validSnapshot(scenario), ...change }, scenario)).toThrow();
});

test("research retains its authored serif reading role", () => {
  const scenario = scenarios.find((candidate) => candidate.path === "/research");
  expect(() => assertSnapshot({ ...validSnapshot(scenario), serif: "Nebula Sans" }, scenario)).toThrow();
});
