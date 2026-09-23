import { describe, expect, test } from "bun:test";

const repositoryRoot = new URL("../", import.meta.url);

describe("Sleepyland portfolio contract", () => {
  test("pins the immutable shared marketing grammar", async () => {
    const packageJson = await Bun.file(
      new URL("package.json", repositoryRoot),
    ).json() as {
      dependencies: Record<string, string>;
    };
    const lockfile = await Bun.file(new URL("bun.lock", repositoryRoot)).text();

    expect(packageJson.dependencies["@hraness/design-kit"]).toBe(
      "github:hraness/design-kit#v0.8.0",
    );
    expect(lockfile).toContain(
      '"@hraness/design-kit": "github:hraness/design-kit#v0.8.0"',
    );
  });

  test("keeps the README's links, commands, and limits current", async () => {
    const readme = await Bun.file(new URL("README.md", repositoryRoot)).text();

    expect(readme).toContain("https://sleepy.land/research");
    expect(readme).not.toMatch(/sleepy\.land\/#/u);
    expect(readme).toContain(
      "curl -H 'Accept: text/markdown'",
    );
    expect(readme).toContain("uses no recorded audio, product account, microphone input");
    expect(readme).toContain("does not diagnose, prescribe, provide individualized dosing");
    expect(readme).toContain("not medical advice");
    expect(readme).toContain("no clinician has reviewed them");
    expect(readme).not.toMatch(/Drafted by an AI agent|Codex AI reviewer/u);
    expect(readme).toContain("bun install --frozen-lockfile");
    expect(readme).toContain("bun run check");
    expect(readme).toContain("bun run check:citations --write");
  });
});
