import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  EnergyPicker,
  NoiseStudio,
  SessionPlanControl,
  SoundModePicker,
} from "./noise-studio";
import { createSessionProgress, INTERVAL_PLANS } from "./session-plans";

test("the outcome-first studio keeps detailed tuning available on demand", () => {
  const markup = renderToStaticMarkup(createElement(NoiseStudio, {
    brand: { name: "Sleepyland", tagline: "noise machine" },
  }));

  expect(markup).toContain('aria-label="Sound controls"');
  expect(markup).toContain(
    '<h1 class="wordmark">Sleepyland<span class="wordmark__tagline"> noise machine</span></h1>',
  );
  expect(markup).not.toContain("listening-stats");
  expect(markup).toContain('<a class="header-research-link" href="/research">Research</a>');
  expect(markup).toContain('aria-label="How Sleepyland works"');
  expect(markup).toContain('class="control-deck__primary"');
  expect(markup).toContain('class="sound-mode-picker"');
  expect(markup).toContain("<strong>Sleep</strong>");
  expect(markup).toContain("<strong>Relax</strong>");
  expect(markup).toContain("<strong>Focus</strong>");
  expect(markup).toContain('aria-label="Session: Endless. Choose a session plan."');
  expect(markup).toContain('aria-controls="sound-tuning"');
  expect(markup).toContain('class="sound-tuning" hidden="" id="sound-tuning"');
  expect(markup).toContain('aria-label="Sound energy"');
  expect(markup).not.toContain("Deep work");
  expect(markup).not.toContain("Quick task");
  expect(markup).toContain('class="mixer-grid"');
  expect(markup.match(/class="range-control /gu)).toHaveLength(4);
  expect(markup).toContain(">Noise volume</label>");
  expect(markup).not.toContain("Calming tones volume");
  expect(markup).not.toContain(">Tones<");
  expect(markup).toContain(">Sound warmth from dark to bright</label>");
  expect(markup).toContain(">Ocean wave volume</label>");
  expect(markup).toContain(">Wave interval from frequent surf to slow swell</label>");
  expect(markup).toContain('aria-valuetext="10 sec"');
  expect(markup).toContain("<output>38%</output>");
  expect(markup).toContain("<output>88%</output>");
  expect(markup).toContain("<output>10s</output>");
});

test("energy and interval progress remain explicit secondary controls", () => {
  const energyMarkup = renderToStaticMarkup(createElement(EnergyPicker, {
    onSelect: () => undefined,
    value: "strong",
  }));
  const plan = INTERVAL_PLANS[0];
  const sessionMarkup = renderToStaticMarkup(createElement(SessionPlanControl, {
    onSelect: () => undefined,
    plan,
    progress: createSessionProgress(plan),
    soundMode: "focus",
  }));

  expect(energyMarkup).toContain('aria-label="Sound energy"');
  expect(energyMarkup).toContain("Gentle");
  expect(energyMarkup).toContain("Balanced");
  expect(energyMarkup).toContain("Strong");
  expect(sessionMarkup).toContain(
    'aria-label="Session: 25 min · Work. Choose a session plan."',
  );
});

test("a tuned mode names its custom state without losing the selected outcome", () => {
  const markup = renderToStaticMarkup(createElement(SoundModePicker, {
    customized: true,
    onSelect: () => undefined,
    value: "calm",
  }));

  expect(markup.match(/aria-pressed="true"/gu)).toHaveLength(1);
  expect(markup).toContain('aria-label="Relax, custom" aria-pressed="true"');
  expect(markup).toContain('data-customized="true" data-selected="true"');
  expect(markup).toContain("<strong>Relax</strong><small>Custom</small>");
});
