import { expect, test } from "bun:test";

const packageJson = await Bun.file(new URL("../package.json", import.meta.url)).json();
const globals = await Bun.file(new URL("./globals.css", import.meta.url)).text();
const foundation = await Bun.file(new URL("../styles/foundation.css", import.meta.url)).text();
const plainSite = await Bun.file(new URL("../styles/plain-site.css", import.meta.url)).text();
const publication = await Bun.file(new URL("../styles/plain-publication.css", import.meta.url)).text();

test("uses the released Nebula Sans default without replacing serif or mono roles", () => {
  expect(packageJson.dependencies).toMatchObject({
    "@hraness/design-kit": "github:hraness/design-kit#v0.3.0",
    "@hraness/ui": "github:hraness/ui#v0.4.10",
    "@hraness/web-discovery": "github:hraness/web-discovery#v0.2.0",
  });
  expect(globals).toStartWith('@import "@hraness/design-kit/styles.css";');
  expect(foundation).toContain("--font-heading: var(--font-text)");
  expect(foundation).toContain("--font-mono: ui-monospace");
  expect(plainSite).toContain("font-family: var(--font-text)");
  expect(publication).toContain("--publication-sans: var(--font-text)");
  expect(publication).toContain('Georgia, serif');
});
