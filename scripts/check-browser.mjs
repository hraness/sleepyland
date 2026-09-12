import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const root = fileURLToPath(new URL("../", import.meta.url));
const preferenceKey = "hraness-design-theme-v1";
const requiredLayers = ["components.hraness-ui", "components.hraness-design-kit", "components.hraness-site-footer"];
const fontWeights = ["400", "500", "600", "700"];

export function runtimeEnvironment(source) {
  const keys = ["PATH", "HOME", "TMPDIR", "TMP", "TEMP", "LANG", "LC_ALL", "TZ", "NODE_OPTIONS", "CIRCLE_NODE_TOTAL", "GOMAXPROCS", "RAYON_NUM_THREADS", "UV_THREADPOOL_SIZE", "VIPS_CONCURRENCY"];
  return { ...Object.fromEntries(keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]])), NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" };
}

export function createRequestTracker() {
  const pending = new Map();
  const expectedBlocks = new Set();
  const failures = [];
  let completed = 0;
  let blocked = 0;
  const identity = (request) => {
    const url = new URL(request.url());
    return { method: request.method(), origin: url.origin, path: url.pathname };
  };
  const tracker = {
    start(request) {
      if (pending.has(request)) failures.push({ ...identity(request), reason: "duplicate request start" });
      pending.set(request, identity(request));
    },
    blockChallenge(request) {
      assert.equal(new URL(request.url()).hostname, "challenges.cloudflare.com", "only the intentionally blocked challenge is expected");
      expectedBlocks.add(request);
    },
    finish(request) {
      if (!pending.has(request) || expectedBlocks.has(request)) failures.push({ ...identity(request), reason: "unexpected request completion" });
      pending.delete(request);
      expectedBlocks.delete(request);
      completed += 1;
    },
    fail(request, reason) {
      const owned = pending.has(request);
      pending.delete(request);
      const intercepted = reason === "net::ERR_BLOCKED_BY_CLIENT" || reason === "net::ERR_BLOCKED_BY_CLIENT.Inspector";
      if (owned && expectedBlocks.delete(request) && intercepted) blocked += 1;
      else failures.push({ ...identity(request), reason: /^net::ERR_[A-Z_]+(?:\.Inspector)?$/u.test(reason ?? "") ? reason : "unrecognized request failure" });
    },
    assertHealthy() { assert.deepEqual(failures, [], "no failed or unknown browser requests"); },
    assertSettled() {
      tracker.assertHealthy();
      assert.deepEqual([...pending.values()], [], "all browser requests completed before teardown");
    },
    get pendingCount() { return pending.size; },
    receipt() { return { completed, blockedChallenges: blocked, pending: [...pending.values()], failures: [...failures] }; },
  };
  return tracker;
}

export async function bounded(promise, label, milliseconds = 10_000) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} exceeded ${milliseconds}ms`)), milliseconds); }),
    ]);
  } finally { clearTimeout(timer); }
}

export function createBrowserOwner(stopServer) {
  let browser;
  let acquisition;
  let stopped = false;
  let cleanup;
  const owner = {
    assertRunning() { if (stopped) throw new Error("Browser verification interrupted"); },
    async launch(start) {
      owner.assertRunning();
      assert.equal(acquisition, undefined, "one owned browser launch");
      acquisition = start();
      browser = await acquisition;
      if (stopped) {
        await owner.stop();
        throw new Error("Browser verification interrupted");
      }
      return browser;
    },
    stop() {
      stopped = true;
      return cleanup ??= (async () => {
        try {
          // A launch already in flight must settle before cleanup can be complete.
          if (acquisition) { try { browser = await acquisition; } catch { /* Failed launch owns no browser. */ } }
          if (browser) await bounded(browser.close(), "Browser cleanup");
        } finally { await stopServer(); }
      })();
    },
  };
  return owner;
}

export const scenarios = [
  ...["desktop", "touch-portrait"].flatMap((device) =>
    ["light", "dark"].flatMap((theme) =>
      ["/", "/noise", "/research", "/design"].map((path) => ({ device, path, theme })))),
  ...["light", "dark"].map((theme) => ({ device: "touch-landscape", path: "/noise", theme })),
];

export const forcedThemeScenarios = [320, 1280].flatMap((width) =>
  ["light", "dark"].flatMap((theme) =>
    ["light", "dark", "system"].map((saved) => ({
      device: width === 320 ? "touch-portrait" : "desktop", path: "/noise", theme, saved,
      viewport: { width, height: width === 320 ? 568 : 900 }, transition: true,
    }))));

export function assertForcedThemeState(state, scenario, forced, timeOrigin) {
  assert.ok(["light", "dark", "system"].includes(scenario.saved), "known saved preference");
  assert.ok(["light", "dark"].includes(scenario.theme), "concrete operating-system scheme");
  const theme = forced ? "dark" : scenario.saved === "system" ? scenario.theme : scenario.saved;
  assert.equal(state.theme, theme, "forced or saved concrete root appearance");
  assert.equal(state.jelly, theme, "Jelly follows the concrete appearance");
  assert.equal(state.saved, scenario.saved, "navigation preserves the saved preference");
  assert.equal(state.os, scenario.theme, "isolated operating-system scheme is unchanged");
  assert.equal(state.timeOrigin, timeOrigin, "route transitions retain the document");
  assert.equal(state.systemObserved, false, "no transient data-theme=system");
  assert.equal(state.background, theme === "dark" ? "rgb(18, 16, 15)" : "rgb(248, 247, 244)", "resolved Paper background");
  assert.equal(state.themeColor, theme === "dark" ? "#12100f" : "#f8f7f4", "dynamic Paper browser chrome");
  assert.equal(state.audioContexts, 0, "theme navigation does not start audio");
  assert.ok(state.horizontalOverflow <= 1, "theme navigation preserves document width");
}

// React Aria restores focus on a rendered frame after its overlay unmounts.
// Observe the original connected trigger; never repair focus from this probe.
export function observeRestoredFocus(element) {
  return new Promise((resolve, reject) => {
    const view = element?.ownerDocument.defaultView;
    if (!view || !element.isConnected) { reject(new Error("Original focus trigger is unavailable")); return; }
    let frame;
    let consecutive = 0;
    const timer = view.setTimeout(() => { view.cancelAnimationFrame(frame); reject(new Error("Original trigger focus did not settle")); }, 2_000);
    const observe = () => {
      if (!element.isConnected) { view.clearTimeout(timer); reject(new Error("Original focus trigger disconnected")); return; }
      consecutive = element.ownerDocument.activeElement === element ? consecutive + 1 : 0;
      if (consecutive === 3) { view.clearTimeout(timer); resolve({ consecutiveFrames: consecutive }); }
      else frame = view.requestAnimationFrame(observe);
    };
    frame = view.requestAnimationFrame(observe);
  });
}

export function screenshotPlan(path, name) {
  return [
    ...(path === "/" ? [{ file: `${name}-studio.png`, fullPage: false }] : []),
    { file: `${name}.png`, fullPage: path !== "/noise" },
  ];
}

export function assertSnapshot(snapshot, scenario) {
  const dark = scenario.path === "/noise" || scenario.theme === "dark";
  assert.equal(snapshot.paper, "paper", "Paper opt-in");
  assert.equal(snapshot.theme, dark ? "dark" : "light", "resolved appearance");
  assert.equal(snapshot.background, dark ? "rgb(18, 16, 15)" : "rgb(248, 247, 244)", "Paper background");
  assert.equal(snapshot.foreground, dark ? "rgb(245, 242, 237)" : "rgb(28, 25, 23)", "Paper foreground");
  assert.equal(snapshot.themeColor, dark ? "#12100f" : "#f8f7f4", "hydrated browser chrome");
  assert.equal(snapshot.coarse, scenario.device !== "desktop", "pointer emulation");
  assert.ok(snapshot.horizontalOverflow <= 1, "no horizontal document overflow");
  assert.equal(snapshot.footers, scenario.path === "/noise" ? 0 : 1, "footer route boundary");
  assert.equal(snapshot.appearanceControls, scenario.path === "/noise" ? 0 : 1, "one appearance control outside studio");
  assert.equal(snapshot.audioContexts, 0, "no audio context before an explicit gesture");
  assert.deepEqual(snapshot.layers, requiredLayers, "all compiled package layers are delivered");
  assert.ok(snapshot.sans.includes("Nebula Sans"), "product sans role");
  assert.ok(snapshot.mono.includes("ui-monospace"), "product monospace role");
  for (const weight of fontWeights) assert.ok(snapshot.loadedWeights.includes(weight), `loaded Nebula Sans ${weight}`);
  if (scenario.path !== "/noise") {
    assert.equal(snapshot.footerPosition, "static", "footer remains in document flow");
    assert.equal(snapshot.footerBackground, snapshot.background, "footer inherits Paper surface");
    assert.equal(snapshot.footerColor, snapshot.foreground, "footer inherits Paper ink");
    assert.equal(snapshot.socialTargets.length, 5, "all five footer social links remain visible");
    for (const target of snapshot.socialTargets) {
      const minimum = scenario.device === "desktop" ? 40 : 44;
      assert.ok(target.width >= minimum && target.height >= minimum, "footer pointer target");
    }
  }
  if (scenario.path === "/noise") {
    assert.ok(snapshot.verticalOverflow <= 1, "fullscreen studio has no document overflow");
    assert.equal(snapshot.challengeFrames, 0, "studio excludes the mailing-list challenge");
  }
  if (scenario.path === "/" || scenario.path === "/noise") {
    assert.equal(snapshot.studioBackground, "rgb(18, 16, 15)", "studio remains a dark island");
    assert.ok(snapshot.transportHeight >= 44 && snapshot.transportWidth >= 44, "transport touch target");
  }
  if (scenario.path === "/research") assert.ok(snapshot.serif.includes("Georgia"), "publication serif role");
}

export function assertRenderedFonts(fonts) {
  assert.ok(fonts.some((font) => font.isCustomFont && /^NebulaSans-(Book|Medium|Semibold|Bold)(Italic)?$/u.test(font.postScriptName) && font.glyphCount > 0), `Nebula Sans renders real glyphs: ${JSON.stringify(fonts)}`);
}

export async function loadNebulaFonts({ fontWeights, fontSet, view }) {
  // FontFaceSet.load() may resolve to [] before a stylesheet registers its faces.
  // Load the actual registered normal cuts, then reject replacement or fallback.
  const fonts = fontSet ?? document.fonts;
  const clock = view ?? window;
  let frame;
  let timer;
  const matching = () => [...fonts].filter((face) => face.family.replaceAll('"', "") === "Nebula Sans"
    && face.style === "normal" && fontWeights.includes(face.weight));
  const operation = (async () => {
    const faces = await new Promise((resolve) => {
      const observe = () => {
        const registered = matching();
        if (fontWeights.every((weight) => registered.some((face) => face.weight === weight))) resolve(registered);
        else frame = clock.requestAnimationFrame(observe);
      };
      observe();
    });
    await Promise.all(faces.map((face) => face.load()));
    await fonts.ready;
    const current = matching();
    if (faces.some((face) => !fonts.has(face) || face.status !== "loaded")
      || current.some((face) => !faces.includes(face) || face.status !== "loaded")
      || !fontWeights.every((weight) => current.some((face) => face.weight === weight && face.status === "loaded"))) {
      throw new Error("Registered Nebula Sans cuts changed or failed to load");
    }
    return fontWeights;
  })();
  try {
    return await Promise.race([
      operation,
      new Promise((_, reject) => { timer = clock.setTimeout(() => reject(new Error("Nebula Sans readiness exceeded 15 seconds")), 15_000); }),
    ]);
  } finally {
    clock.clearTimeout(timer);
    if (frame !== undefined) clock.cancelAnimationFrame(frame);
  }
}

async function unusedPort() {
  const reservation = createServer();
  await new Promise((resolve, reject) => {
    reservation.once("error", reject);
    reservation.listen(0, "127.0.0.1", resolve);
  });
  const port = reservation.address().port;
  await new Promise((resolve, reject) => reservation.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitUntil(check, message, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  do {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  } while (Date.now() < deadline);
  throw new Error(message);
}

async function snapshot(page) {
  await page.evaluate(loadNebulaFonts, { fontWeights });
  return page.evaluate(({ requiredLayers }) => {
    const html = document.documentElement;
    const body = getComputedStyle(document.body);
    const css = [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText)).join("\n");
    const studio = document.querySelector(".noise-app");
    const transport = document.querySelector(".transport-button__control")?.getBoundingClientRect();
    return {
      paper: html.dataset.hranessTheme,
      theme: html.dataset.theme,
      background: body.backgroundColor,
      foreground: body.color,
      themeColor: document.querySelector('meta[name="theme-color"]:not([media])')?.content,
      coarse: matchMedia("(pointer: coarse)").matches,
      horizontalOverflow: html.scrollWidth - html.clientWidth,
      verticalOverflow: html.scrollHeight - innerHeight,
      footers: document.querySelectorAll(".hraness-site-footer").length,
      appearanceControls: document.querySelectorAll(".hraness-design-theme-toggle").length,
      challengeFrames: document.querySelectorAll('iframe[src*="challenges.cloudflare.com"]').length,
      audioContexts: window.__sleepylandAudio.length,
      layers: requiredLayers.filter((layer) => css.includes(`@layer ${layer}.priority`)),
      sans: getComputedStyle(html).fontFamily,
      mono: getComputedStyle(html).getPropertyValue("--font-mono"),
      loadedWeights: [...document.fonts].filter((face) => face.family.replaceAll('"', "") === "Nebula Sans" && face.status === "loaded").map((face) => face.weight),
      footerPosition: document.querySelector(".hraness-site-footer") ? getComputedStyle(document.querySelector(".hraness-site-footer")).position : null,
      footerColor: document.querySelector(".hraness-site-footer") ? getComputedStyle(document.querySelector(".hraness-site-footer")).color : null,
      footerBackground: document.querySelector(".hraness-site-footer__inner") ? getComputedStyle(document.querySelector(".hraness-site-footer__inner")).backgroundColor : null,
      socialTargets: [...document.querySelectorAll(".hraness-site-footer__social-link")].map((link) => ({ width: link.getBoundingClientRect().width, height: link.getBoundingClientRect().height })),
      serif: document.querySelector(".plain-publication") ? getComputedStyle(document.querySelector(".plain-publication")).fontFamily : null,
      studioBackground: studio ? getComputedStyle(studio).backgroundColor : null,
      transportHeight: transport?.height,
      transportWidth: transport?.width,
    };
  }, { requiredLayers });
}

async function renderedFonts(context, page, path) {
  const session = await context.newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root: document } = await session.send("DOM.getDocument");
    const selector = path === "/research" ? ".plain-nav a" : path === "/design" ? ".sleepyland-design h1" : ".wordmark";
    const { nodeId } = await session.send("DOM.querySelector", { nodeId: document.nodeId, selector });
    assert.ok(nodeId, "rendered font probe exists");
    const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
    assertRenderedFonts(fonts);
    return fonts;
  } finally { await session.detach(); }
}

async function checkAppearance(page, initial) {
  for (const theme of [initial === "light" ? "dark" : "light", initial]) {
    const trigger = page.getByRole("button", { name: /^Appearance:/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const item = page.locator(`.hraness-design-theme-toggle__item[data-theme-value="${theme}"]`);
    await item.focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(({ theme, key }) => document.documentElement.dataset.theme === theme && localStorage.getItem(key) === theme, { theme, key: preferenceKey });
    await page.locator(".hraness-design-theme-toggle__popover").waitFor({ state: "hidden" });
  }
}

async function checkInteractions(page, scenario) {
  if (scenario.path !== "/noise") await checkAppearance(page, scenario.theme);
  if (scenario.path === "/") {
    const disclosure = page.locator(".hraness-marketing-question summary").first();
    await disclosure.focus();
    await page.keyboard.press("Enter");
    assert.equal(await disclosure.evaluate((element) => element.parentElement.open), true, "question disclosure opens");
    await page.keyboard.press("Enter");
  }
  if (scenario.path === "/research") {
    const filters = page.getByRole("group", { name: "Filter articles by topic" });
    const allCount = await page.locator("#research-articles article").count();
    const topic = filters.getByRole("button").nth(1);
    await topic.click();
    assert.equal(await topic.getAttribute("aria-pressed"), "true");
    const filteredCount = await page.locator("#research-articles article").count();
    assert.ok(filteredCount > 0 && filteredCount < allCount, "topic filters the accepted registry");
    assert.match(await page.locator('.plain-publication__section-heading [aria-live="polite"]').innerText(), new RegExp(`^${filteredCount} articles?`));
    await filters.getByRole("button", { name: "All", exact: true }).click();
    assert.equal(await page.locator("#research-articles article").count(), allCount);
  }
  if (scenario.path === "/" || scenario.path === "/noise") {
    const tune = page.getByRole("button", { name: "Tune", exact: true });
    await tune.click();
    assert.equal(await tune.getAttribute("aria-expanded"), "true");
    const slider = page.getByRole("slider", { name: "Noise volume" });
    const before = await slider.inputValue();
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    assert.notEqual(await slider.inputValue(), before, "keyboard adjusts the mixer");
    await tune.click();
    assert.equal(await tune.getAttribute("aria-expanded"), "false");
    assert.equal(await page.evaluate(() => window.__sleepylandAudio.length), 0, "tuning does not start audio");
  }
}

async function checkAudio(page) {
  const transport = page.locator(".transport-button__control");
  await transport.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.querySelector(".transport-button__control")?.dataset.status === "playing");
  assert.equal(await page.evaluate(() => window.__sleepylandAudio[0]?.state), "running", "native Web Audio starts only on request");
  assert.equal(await transport.evaluate((element) => element === document.activeElement), true, "transport retains focus");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => window.__sleepylandAudio.every((context) => context.state === "suspended"));
  assert.equal(await transport.getAttribute("aria-label"), "Play sound");
  // An image-free destination keeps audio disposal independent of canceled image work.
  await page.getByRole("button", { name: "How Sleepyland works", exact: true }).click();
  await page.getByRole("navigation", { name: "Product information", exact: true }).getByRole("link", { name: "About", exact: true }).click();
  await page.waitForURL("**/about");
  await page.waitForFunction(() => window.__sleepylandAudio.length > 0 && window.__sleepylandAudio.every((context) => context.state === "closed"));
}

async function checkStudioDialog(page, scenario) {
  if (!["/", "/noise"].includes(scenario.path)) return;
  await page.getByRole("button", { name: "How Sleepyland works", exact: true }).click();
  const overlay = page.locator(".sleepyland-modal-overlay");
  await overlay.waitFor({ state: "visible" });
  const dark = scenario.path === "/noise" || scenario.theme === "dark";
  assert.equal(await overlay.getAttribute("data-theme"), dark ? "dark" : "light", "portal follows the route's concrete appearance");
  assert.equal(await page.locator(".noise-info-modal").evaluate((element) => getComputedStyle(element).backgroundColor), dark ? "rgb(29, 26, 24)" : "rgb(255, 254, 250)", "dialog uses the Paper surface");
  await page.keyboard.press("Escape");
  await overlay.waitFor({ state: "hidden" });
}

async function checkForcedThemeNavigation(page, scenario, retain) {
  const timeOrigin = await retain(page.evaluate(() => {
    const html = document.documentElement;
    const state = { systemObserved: html.dataset.theme === "system" };
    state.observer = new MutationObserver((records) => {
      if (html.dataset.theme === "system" || records.some((record) => record.oldValue === "system")) state.systemObserved = true;
    });
    state.observer.observe(html, { attributes: true, attributeFilter: ["data-theme"], attributeOldValue: true });
    window.__sleepylandThemeTransition = state;
    return performance.timeOrigin;
  }), "Theme observer acquisition");
  const phases = [];
  const observe = async (forced, phase) => {
    const expected = forced ? "dark" : scenario.saved === "system" ? scenario.theme : scenario.saved;
    await page.waitForFunction((theme) => document.documentElement.dataset.theme === theme
      && document.documentElement.dataset.jellyMode === theme
      && document.querySelector('meta[name="theme-color"]:not([media])')?.content === (theme === "dark" ? "#12100f" : "#f8f7f4"), expected);
    const state = await retain(page.evaluate((key) => ({
      theme: document.documentElement.dataset.theme,
      jelly: document.documentElement.dataset.jellyMode,
      saved: localStorage.getItem(key),
      os: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      timeOrigin: performance.timeOrigin,
      systemObserved: window.__sleepylandThemeTransition?.systemObserved,
      background: getComputedStyle(document.body).backgroundColor,
      themeColor: document.querySelector('meta[name="theme-color"]:not([media])')?.content,
      audioContexts: window.__sleepylandAudio.length,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }), preferenceKey), "Concrete theme observation");
    assertForcedThemeState(state, scenario, forced, timeOrigin);
    phases.push({ phase, ...state });
  };
  const openInfo = async () => {
    const trigger = page.getByRole("button", { name: "How Sleepyland works", exact: true });
    const original = await trigger.elementHandle();
    assert.ok(original, "real studio information trigger");
    await trigger.focus();
    await page.keyboard.press("Enter");
    const overlay = page.locator(".sleepyland-modal-overlay");
    await overlay.waitFor({ state: "visible" });
    const portal = await retain(overlay.evaluate((element) => ({
      theme: element.dataset.theme, paper: element.dataset.hranessTheme,
      outsideApplication: element.closest("main") === null && document.body.contains(element),
      background: getComputedStyle(element.querySelector(".noise-info-modal")).backgroundColor,
      focusInside: element.contains(document.activeElement),
    })), "Forced studio portal");
    assert.deepEqual(portal, { theme: "dark", paper: "paper", outsideApplication: true, background: "rgb(29, 26, 24)", focusInside: true }, "forced-dark body portal retains Paper and keyboard focus");
    return original;
  };
  await observe(true, "forced");
  const firstTrigger = await openInfo();
  await page.getByRole("navigation", { name: "Product information", exact: true }).getByRole("link", { name: "About", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/about");
  await firstTrigger.dispose();
  await page.locator('.hraness-design-theme-toggle[data-ready="true"]').waitFor();
  await observe(false, "ordinary");
  assert.equal(await page.locator(".hraness-design-theme-toggle").getAttribute("data-theme-value"), scenario.saved, "ordinary appearance control retains the saved choice");
  await page.getByRole("navigation", { name: "Product navigation", exact: true }).getByRole("link", { name: "Sound machine", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/noise");
  await observe(true, "reforced");
  const trigger = await openInfo();
  await page.keyboard.press("Escape");
  await page.locator(".sleepyland-modal-overlay").waitFor({ state: "hidden" });
  const focus = await retain(trigger.evaluate(observeRestoredFocus), "Original trigger focus restoration", 3_000);
  await trigger.dispose();
  await observe(true, "after-dismiss");
  await retain(page.evaluate(() => window.__sleepylandThemeTransition.observer.disconnect()), "Theme observer release");
  return { phases, focus };
}

async function loadScreenshotImages(page) {
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await bounded(image.evaluate((element) => element.decode()), "Screenshot image decode", 10_000);
  }
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas[data-spectrogram-overlay]");
    if (canvas === null) return true;
    if (canvas.width === 0 || canvas.height === 0) return false;
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    for (let index = 3; index < pixels.length; index += 4) if (pixels[index] > 0) return true;
    return false;
  });
}

export async function runBrowserCheck() {
  const executablePath = process.env.SLEEPYLAND_BROWSER_EXECUTABLE;
  assert.ok(executablePath && isAbsolute(executablePath), "Set SLEEPYLAND_BROWSER_EXECUTABLE to an installed Chromium executable; this check never downloads a browser.");
  await access(executablePath);
  await access(join(root, ".next/BUILD_ID"));
  const output = join(root, ".browser-artifacts", new Date().toISOString().replaceAll(":", "-"));
  await mkdir(output, { recursive: true });
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const receipt = {
    head: git("rev-parse", "HEAD"), tree: git("rev-parse", "HEAD^{tree}"),
    dirty: git("status", "--porcelain") !== "",
    browserSha256: createHash("sha256").update(await readFile(executablePath)).digest("hex"),
    lockfileSha256: createHash("sha256").update(await readFile(join(root, "bun.lock"))).digest("hex"),
    buildId: (await readFile(join(root, ".next/BUILD_ID"), "utf8")).trim(),
    bun: Bun.version, node: execFileSync("node", ["--version"], { encoding: "utf8" }).trim(),
    browser: null, scenarios: [], status: "running",
  };
  const port = await unusedPort();
  const origin = `http://127.0.0.1:${port}`;
  let serverLog = "";
  const server = spawn("node", [join(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: root, stdio: ["ignore", "pipe", "pipe"],
    env: runtimeEnvironment(process.env),
  });
  for (const stream of [server.stdout, server.stderr]) stream.on("data", (chunk) => { serverLog = (serverLog + chunk).slice(-8_000); });
  let serverError;
  server.on("error", (error) => { serverError = error; });
  const serverExit = new Promise((resolve) => { server.once("exit", resolve); server.once("error", resolve); });
  receipt.processes = { server: server.pid };
  let browser;
  const owner = createBrowserOwner(async () => {
    if (server.pid && server.exitCode === null) server.kill("SIGTERM");
    await bounded(serverExit, "Production server cleanup", 5_000);
  });
  const stop = async () => {
    await owner.stop();
    receipt.cleanup = "passed";
  };
  const interrupted = () => { void stop().then(() => { process.exitCode = 130; }, (error) => { receipt.cleanupError = error.message; process.exitCode = 1; }); };
  process.once("SIGINT", interrupted);
  process.once("SIGTERM", interrupted);
  try {
    await waitUntil(async () => {
      owner.assertRunning();
      if (serverError) throw serverError;
      if (server.exitCode !== null) throw new Error(`Production server exited: ${serverLog}`);
      try { return (await fetch(origin, { signal: AbortSignal.timeout(1_000) })).ok; } catch { return false; }
    }, "Production server was not ready");
    browser = await owner.launch(() => chromium.launch({ executablePath, headless: true, timeout: 10_000, args: ["--mute-audio"], env: runtimeEnvironment(process.env) }));
    receipt.browser = browser.version();
    const processSession = await browser.newBrowserCDPSession();
    const { processInfo } = await processSession.send("SystemInfo.getProcessInfo");
    receipt.processes.browser = processInfo.find((info) => info.type === "browser")?.id;
    await processSession.detach();
    for (const scenario of [...scenarios, ...forcedThemeScenarios]) {
      owner.assertRunning();
      const viewport = scenario.viewport ?? (scenario.device === "desktop" ? { width: 1280, height: 900 }
        : scenario.device === "touch-portrait" ? { width: 390, height: 844 } : { width: 844, height: 390 });
      const context = await browser.newContext({ viewport, colorScheme: scenario.theme, hasTouch: scenario.device !== "desktop", isMobile: scenario.device !== "desktop", serviceWorkers: "block" });
      const pageErrors = [];
      const forbiddenRequests = [];
      const failedAssets = [];
      const assets = new Set();
      const requests = createRequestTracker();
      const routeTasks = [];
      const page = await context.newPage();
      page.setDefaultTimeout(10_000);
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("request", (request) => requests.start(request));
      page.on("requestfinished", (request) => requests.finish(request));
      page.on("requestfailed", (request) => requests.fail(request, request.failure()?.errorText));
      page.on("response", (response) => {
        const url = new URL(response.url());
        if (url.origin === origin && /\.(?:css|woff2)(?:$|\?)/u.test(url.pathname)) {
          assets.add(url.pathname);
          if (!response.ok()) failedAssets.push(`${response.status()} ${url.pathname}`);
        }
      });
      // No remote reads, writes, account state, challenge execution, or analytics.
      await context.route("**/*", (route) => {
        const request = route.request();
        const url = new URL(request.url());
        let task;
        if (url.origin === origin && ["GET", "HEAD"].includes(request.method())) task = route.continue();
        else {
          if (url.hostname !== "challenges.cloudflare.com") forbiddenRequests.push(`${request.method()} ${url.origin}${url.pathname}`);
          else requests.blockChallenge(request);
          task = route.abort("blockedbyclient");
        }
        routeTasks.push(task);
        void task.catch(() => undefined);
        return task;
      });
      await context.addInitScript(({ theme, key }) => {
        localStorage.setItem(key, theme);
        window.__sleepylandAudio = [];
        const NativeAudioContext = window.AudioContext;
        window.AudioContext = class extends NativeAudioContext {
          constructor(...args) { super(...args); window.__sleepylandAudio.push(this); }
        };
      }, { theme: scenario.saved ?? scenario.theme, key: preferenceKey });
      const name = `${scenario.path === "/" ? "home" : scenario.path.slice(1)}-${scenario.theme}-${scenario.device}${scenario.transition ? `-saved-${scenario.saved}-transition` : ""}`;
      let before;
      let caseError;
      const retained = [];
      const retain = (promise, label, limit = 10_000) => {
        // Keep original observations through context teardown if a host deadline wins.
        retained.push(promise);
        void promise.catch(() => undefined);
        return bounded(promise, label, limit);
      };
      try {
        assert.equal((await page.goto(`${origin}${scenario.path}`, { waitUntil: "domcontentloaded" })).status(), 200);
        const expectedTheme = scenario.path === "/noise" ? "dark" : scenario.theme;
        await page.waitForFunction((theme) => document.documentElement.dataset.theme === theme, expectedTheme);
        if (scenario.path !== "/noise") await page.locator('.hraness-design-theme-toggle[data-ready="true"]').waitFor();
        if (!scenario.transition) await checkStudioDialog(page, scenario);
        before = await snapshot(page);
        assertSnapshot(before, scenario);
        const fonts = await renderedFonts(context, page, scenario.path);
        const transition = scenario.transition
          ? await retain(checkForcedThemeNavigation(page, scenario, retain), "Forced theme route case", 45_000)
          : await checkInteractions(page, scenario);
        assertSnapshot(await snapshot(page), scenario);
        await loadScreenshotImages(page);
        // Full-page viewport overrides clear responsive canvas buffers in Chromium.
        for (const capture of screenshotPlan(scenario.path, name)) {
          if (!capture.fullPage) await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({ path: join(output, capture.file), fullPage: capture.fullPage });
        }
        if (!scenario.transition && scenario.device === "desktop" && scenario.theme === "light" && ["/", "/noise"].includes(scenario.path)) await checkAudio(page);
        await retain(waitUntil(() => { requests.assertHealthy(); return requests.pendingCount === 0; }, "Browser requests did not finish before teardown", 10_000), "Browser request completion", 11_000);
        requests.assertSettled();
        assert.deepEqual(pageErrors, [], "no browser exceptions");
        assert.deepEqual(failedAssets, [], "local CSS and fonts load successfully");
        assert.deepEqual(forbiddenRequests, [], "no remote product or analytics requests");
        receipt.scenarios.push({ ...scenario, viewport, snapshot: before, renderedFonts: fonts, assets: [...assets].sort(), ...(transition ? { transitionEvidence: transition } : {}), requests: requests.receipt(), status: "passed" });
        console.log(`PASS ${name}`);
      } catch (error) {
        caseError = error;
        await page.screenshot({ path: join(output, `${name}-failure.png`), fullPage: true }).catch(() => undefined);
        receipt.scenarios.push({ ...scenario, snapshot: before, status: "failed", error: error.message, requests: requests.receipt() });
        throw error;
      } finally {
        // Close native contexts before closing the isolated browser context, even on failure.
        const cleanupErrors = [];
        try {
          if (!page.isClosed()) await bounded(page.evaluate(() => Promise.all((window.__sleepylandAudio ?? []).map((audio) => audio.state === "closed" ? undefined : audio.close()))), "Web Audio cleanup", 3_000);
        } catch (error) { cleanupErrors.push(error); }
        try { await bounded(context.close(), "Browser context cleanup", 5_000); }
        catch (error) { cleanupErrors.push(error); }
        try {
          const results = await bounded(Promise.allSettled([...retained, ...routeTasks]), "Original browser observations and routes drain", 5_000);
          if (!caseError) for (const result of results) if (result.status === "rejected") cleanupErrors.push(result.reason);
          assert.deepEqual(pageErrors, [], "no late browser exceptions");
          assert.deepEqual(failedAssets, [], "no late local asset failures");
          assert.deepEqual(forbiddenRequests, [], "no late remote requests");
          requests.assertSettled();
        } catch (error) { cleanupErrors.push(error); }
        receipt.scenarios.at(-1).requests = requests.receipt();
        if (cleanupErrors.length > 0) {
          receipt.scenarios.at(-1).status = "failed";
          throw new AggregateError([...(caseError ? [caseError] : []), ...cleanupErrors], "Browser case or cleanup failed");
        }
      }
    }
    receipt.status = "passed";
  } finally {
    try { await stop(); } finally {
      if (receipt.status === "running" || receipt.cleanup !== "passed") receipt.status = "failed";
      await writeFile(join(output, "receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`);
      console.log(`Browser evidence: ${output}`);
      process.removeListener("SIGINT", interrupted);
      process.removeListener("SIGTERM", interrupted);
    }
  }
}

if (import.meta.main) await runBrowserCheck();
