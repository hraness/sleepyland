import { expect, test } from "bun:test";

import { assertForcedThemeState, assertRenderedFonts, assertSnapshot, bounded, createBrowserOwner, forcedThemeScenarios, observeRestoredFocus, runtimeEnvironment, scenarios, screenshotPlan } from "./check-browser.mjs";

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

test("forced-theme navigation adds both OS schemes and all saved choices at 320px and desktop", () => {
  expect(forcedThemeScenarios).toHaveLength(12);
  expect(new Set(forcedThemeScenarios.map((scenario) => JSON.stringify(scenario))).size).toBe(12);
  for (const width of [320, 1280]) for (const theme of ["light", "dark"]) for (const saved of ["light", "dark", "system"]) {
    expect(forcedThemeScenarios.filter((scenario) => scenario.viewport.width === width && scenario.theme === theme && scenario.saved === saved)).toHaveLength(1);
  }
});

function transitionState(scenario, forced) {
  const theme = forced ? "dark" : scenario.saved === "system" ? scenario.theme : scenario.saved;
  return {
    theme, jelly: theme, saved: scenario.saved, os: scenario.theme, timeOrigin: 123,
    systemObserved: false, horizontalOverflow: 0, audioContexts: 0,
    background: theme === "dark" ? "rgb(18, 16, 15)" : "rgb(248, 247, 244)",
    themeColor: theme === "dark" ? "#12100f" : "#f8f7f4",
  };
}

test("forced, ordinary, and reforced theme evidence rejects fallback, document replacement, storage, and paint regressions", () => {
  for (const scenario of forcedThemeScenarios) for (const forced of [true, false, true]) {
    const state = transitionState(scenario, forced);
    expect(() => assertForcedThemeState(state, scenario, forced, 123)).not.toThrow();
    for (const change of [
      { theme: "system" }, { jelly: "auto" }, { saved: "unexpected" },
      { os: scenario.theme === "light" ? "dark" : "light" }, { timeOrigin: 124 },
      { systemObserved: true }, { systemObserved: undefined },
      { background: "rgb(0, 0, 0)" }, { themeColor: "#080604" },
      { audioContexts: 1 }, { horizontalOverflow: 2 },
    ]) expect(() => assertForcedThemeState({ ...state, ...change }, scenario, forced, 123)).toThrow();
  }
});

function focusFixture() {
  let frame;
  let deadline;
  let cleared = false;
  const view = {
    requestAnimationFrame(callback) { frame = callback; return 1; },
    cancelAnimationFrame() { frame = undefined; },
    setTimeout(callback) { deadline = callback; return 2; },
    clearTimeout() { cleared = true; },
  };
  const element = { isConnected: true, ownerDocument: { defaultView: view, activeElement: null } };
  return {
    element,
    frame(focused) { element.ownerDocument.activeElement = focused ? element : null; const callback = frame; frame = undefined; callback(); },
    timeout() { deadline(); },
    get cleared() { return cleared; },
  };
}

test("focus observation waits for rendered restoration and resets after focus is lost", async () => {
  const fixture = focusFixture();
  const result = observeRestoredFocus(fixture.element);
  for (const focused of [false, true, true, false, true, true]) fixture.frame(focused);
  expect(fixture.cleared).toBe(false);
  fixture.frame(true);
  expect(await result).toEqual({ consecutiveFrames: 3 });
  expect(fixture.cleared).toBe(true);
});

test("focus observation rejects absent, disconnected, and never-restored original triggers", async () => {
  await expect(observeRestoredFocus(null)).rejects.toThrow("unavailable");
  const detached = focusFixture();
  const rejected = observeRestoredFocus(detached.element);
  detached.element.isConnected = false;
  detached.frame(false);
  await expect(rejected).rejects.toThrow("disconnected");
  expect(detached.cleared).toBe(true);
  const timeout = focusFixture();
  const pending = observeRestoredFocus(timeout.element);
  timeout.frame(false);
  timeout.timeout();
  await expect(pending).rejects.toThrow("did not settle");
});

test("fixed-viewport canvases get a viewport capture before full-document screenshots", () => {
  expect(screenshotPlan("/noise", "studio")).toEqual([{ file: "studio.png", fullPage: false }]);
  expect(screenshotPlan("/", "home")).toEqual([{ file: "home-studio.png", fullPage: false }, { file: "home.png", fullPage: true }]);
  expect(screenshotPlan("/research", "research")).toEqual([{ file: "research.png", fullPage: true }]);
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

test("rendered font proof accepts the shipped cuts and rejects fallbacks or unused faces", () => {
  const rendered = { familyName: "Nebula Sans Semibold", postScriptName: "NebulaSans-Semibold", isCustomFont: true, glyphCount: 32 };
  expect(() => assertRenderedFonts([rendered])).not.toThrow();
  for (const change of [{ isCustomFont: false }, { postScriptName: "ArialMT" }, { glyphCount: 0 }]) {
    expect(() => assertRenderedFonts([{ ...rendered, ...change }])).toThrow();
  }
});

test("browser and server children receive runtime settings without provider credentials", () => {
  expect(runtimeEnvironment({ PATH: "runtime", TMPDIR: "temporary", NODE_OPTIONS: "--max-old-space-size=2048", UV_THREADPOOL_SIZE: "4", EXAMPLE_PROVIDER_TOKEN: "test-only", NODE_ENV: "development" })).toEqual({
    PATH: "runtime", TMPDIR: "temporary", NODE_OPTIONS: "--max-old-space-size=2048", UV_THREADPOOL_SIZE: "4", NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1",
  });
});

test("native waits resolve or fail at a finite deadline", async () => {
  expect(await bounded(Promise.resolve("ready"), "Ready", 10)).toBe("ready");
  await expect(bounded(new Promise(() => undefined), "Pending", 10)).rejects.toThrow("Pending exceeded 10ms");
});

test("interruption closes a browser that arrives after the signal before completing cleanup", async () => {
  const events = [];
  let finishLaunch;
  const owner = createBrowserOwner(async () => { events.push("server closed"); });
  const launching = owner.launch(() => new Promise((resolve) => { finishLaunch = resolve; }));
  const result = launching.catch((error) => error.message);
  const stopping = owner.stop();
  expect(events).toEqual([]);
  finishLaunch({ close: async () => { events.push("browser closed"); } });
  await stopping;
  expect(await result).toBe("Browser verification interrupted");
  await owner.stop();
  expect(events).toEqual(["browser closed", "server closed"]);
});

test("cleanup failure still closes the server and propagates to every stop caller", async () => {
  let serverClosed = false;
  const owner = createBrowserOwner(async () => { serverClosed = true; });
  await owner.launch(async () => ({ close: async () => { throw new Error("cleanup failed"); } }));
  await expect(owner.stop()).rejects.toThrow("cleanup failed");
  expect(serverClosed).toBe(true);
  await expect(owner.stop()).rejects.toThrow("cleanup failed");
  await expect(owner.launch(async () => undefined)).rejects.toThrow("interrupted");
});
