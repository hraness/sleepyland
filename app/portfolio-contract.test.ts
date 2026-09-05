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
      "github:hraness/design-kit#v0.4.0",
    );
    expect(lockfile).toContain(
      '"@hraness/design-kit": "github:hraness/design-kit#v0.4.0"',
    );
  });

  test("keeps the README ordered around proof, interfaces, limits, and action", async () => {
    const readme = await Bun.file(new URL("README.md", repositoryRoot)).text();
    const headings = [
      "## First proof",
      "## Working model",
      "## Interfaces",
      "## Evidence and generated surfaces",
      "## Boundaries",
      "## Questions",
      "## Smallest useful action",
    ];
    const positions = headings.map((heading) => readme.indexOf(heading));

    expect(positions.every((position) => position >= 0)).toBeTrue();
    expect(positions).toEqual([...positions].toSorted((left, right) => left - right));
    expect(readme).toContain(
      "curl -H 'Accept: text/markdown'",
    );
    expect(readme).toContain("uses no recorded audio, product account, microphone input");
    expect(readme).toContain("does not diagnose, prescribe, provide individualized dosing");
    expect(readme).toContain("bun install --frozen-lockfile");
    expect(readme).toContain("bun run check");
  });
});
