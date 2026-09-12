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
  const keys = ["PATH", "HOME", "TMPDIR", "TMP", "TEMP", "LANG", "LC_ALL", "TZ", "NODE_OPTIONS"];
  return { ...Object.fromEntries(keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]])), NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" };
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

export const scenarios = [
  ...["desktop", "touch-portrait"].flatMap((device) =>
    ["light", "dark"].flatMap((theme) =>
      ["/", "/noise", "/research", "/design"].map((path) => ({ device, path, theme })))),
  ...["light", "dark"].map((theme) => ({ device: "touch-landscape", path: "/noise", theme })),
];

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
  return page.evaluate(async ({ requiredLayers, fontWeights }) => {
    let deadline;
    try {
      await Promise.race([
        Promise.all(fontWeights.map((weight) => document.fonts.load(`${weight} 16px "Nebula Sans"`))).then(() => document.fonts.ready),
        new Promise((_, reject) => { deadline = setTimeout(() => reject(new Error("Nebula Sans readiness exceeded 15 seconds")), 15_000); }),
      ]);
    } finally { clearTimeout(deadline); }
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
  }, { requiredLayers, fontWeights });
}

async function renderedFonts(context, page, path) {
  const session = await context.newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root: document } = await session.send("DOM.getDocument");
    const selector = path === "/research" ? ".plain-nav" : path === "/design" ? ".sleepyland-design h1" : ".wordmark";
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
  // Client navigation exercises the studio's unmount cleanup in the same document.
  await page.locator(".header-research-link").click();
  await page.waitForURL("**/research");
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
  const serverExit = new Promise((resolve) => server.once("exit", resolve));
  receipt.processes = { server: server.pid };
  let browser;
  let stopPromise;
  const stop = () => stopPromise ??= (async () => {
    try { if (browser) await bounded(browser.close(), "Browser cleanup"); } finally {
      if (server.exitCode === null) server.kill("SIGTERM");
      await bounded(serverExit, "Production server cleanup", 5_000);
    }
    receipt.cleanup = "passed";
  })();
  const interrupted = () => { void stop().finally(() => { process.exitCode = 130; }); };
  process.once("SIGINT", interrupted);
  process.once("SIGTERM", interrupted);
  try {
    await waitUntil(async () => {
      if (serverError) throw serverError;
      if (server.exitCode !== null) throw new Error(`Production server exited: ${serverLog}`);
      try { return (await fetch(origin, { signal: AbortSignal.timeout(1_000) })).ok; } catch { return false; }
    }, "Production server was not ready");
    browser = await chromium.launch({ executablePath, headless: true, args: ["--mute-audio"], env: runtimeEnvironment(process.env) });
    receipt.browser = browser.version();
    const processSession = await browser.newBrowserCDPSession();
    const { processInfo } = await processSession.send("SystemInfo.getProcessInfo");
    receipt.processes.browser = processInfo.find((info) => info.type === "browser")?.id;
    await processSession.detach();
    for (const scenario of scenarios) {
      const viewport = scenario.device === "desktop" ? { width: 1280, height: 900 }
        : scenario.device === "touch-portrait" ? { width: 390, height: 844 } : { width: 844, height: 390 };
      const context = await browser.newContext({ viewport, colorScheme: scenario.theme, hasTouch: scenario.device !== "desktop", isMobile: scenario.device !== "desktop", serviceWorkers: "block" });
      const pageErrors = [];
      const forbiddenRequests = [];
      const failedAssets = [];
      const assets = new Set();
      const pendingRequests = new Map();
      const page = await context.newPage();
      page.setDefaultTimeout(10_000);
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("request", (request) => pendingRequests.set(request, new URL(request.url()).pathname));
      page.on("requestfinished", (request) => pendingRequests.delete(request));
      page.on("requestfailed", (request) => pendingRequests.delete(request));
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
        if (url.origin === origin && ["GET", "HEAD"].includes(request.method())) return route.continue();
        if (url.hostname !== "challenges.cloudflare.com") forbiddenRequests.push(`${request.method()} ${url.origin}${url.pathname}`);
        return route.abort("blockedbyclient");
      });
      await context.addInitScript(({ theme, key }) => {
        localStorage.setItem(key, theme);
        window.__sleepylandAudio = [];
        const NativeAudioContext = window.AudioContext;
        window.AudioContext = class extends NativeAudioContext {
          constructor(...args) { super(...args); window.__sleepylandAudio.push(this); }
        };
      }, { theme: scenario.theme, key: preferenceKey });
      const name = `${scenario.path === "/" ? "home" : scenario.path.slice(1)}-${scenario.theme}-${scenario.device}`;
      let before;
      try {
        assert.equal((await page.goto(`${origin}${scenario.path}`, { waitUntil: "domcontentloaded" })).status(), 200);
        const expectedTheme = scenario.path === "/noise" ? "dark" : scenario.theme;
        await page.waitForFunction((theme) => document.documentElement.dataset.theme === theme, expectedTheme);
        if (scenario.path !== "/noise") await page.locator('.hraness-design-theme-toggle[data-ready="true"]').waitFor();
        await checkStudioDialog(page, scenario);
        before = await snapshot(page);
        assertSnapshot(before, scenario);
        const fonts = await renderedFonts(context, page, scenario.path);
        await checkInteractions(page, scenario);
        assertSnapshot(await snapshot(page), scenario);
        await page.screenshot({ path: join(output, `${name}.png`), fullPage: true });
        if (scenario.device === "desktop" && scenario.theme === "light" && ["/", "/noise"].includes(scenario.path)) await checkAudio(page);
        assert.deepEqual(pageErrors, [], "no browser exceptions");
        assert.deepEqual(failedAssets, [], "local CSS and fonts load successfully");
        assert.deepEqual(forbiddenRequests, [], "no remote product or analytics requests");
        receipt.scenarios.push({ ...scenario, viewport, snapshot: before, renderedFonts: fonts, assets: [...assets].sort(), status: "passed" });
        console.log(`PASS ${name}`);
      } catch (error) {
        await page.screenshot({ path: join(output, `${name}-failure.png`), fullPage: true }).catch(() => undefined);
        receipt.scenarios.push({ ...scenario, snapshot: before, status: "failed", error: error.message, pendingRequests: [...pendingRequests.values()] });
        throw error;
      } finally {
        // Close native contexts before closing the isolated browser context, even on failure.
        try {
          if (!page.isClosed()) await bounded(page.evaluate(() => Promise.all((window.__sleepylandAudio ?? []).map((audio) => audio.state === "closed" ? undefined : audio.close()))), "Web Audio cleanup", 3_000);
        } finally { await bounded(context.close(), "Browser context cleanup", 5_000); }
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
