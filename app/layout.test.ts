import { describe, expect, test } from "bun:test";

import { metadata } from "./layout";
import { site } from "./site";

describe("Sleepyland search metadata", () => {
  test("keeps only site-wide defaults that other routes can inherit", () => {
    expect(metadata).toMatchObject({
      applicationName: site.shortName,
      category: "sleep research",
      openGraph: {
        siteName: site.shortName,
        type: "website",
      },
    });
    expect(metadata).not.toHaveProperty("title");
    expect(metadata).not.toHaveProperty("description");
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.alternates).not.toHaveProperty("canonical");
    expect(metadata.openGraph).not.toHaveProperty("url");
    expect(metadata.openGraph).not.toHaveProperty("title");
    expect(metadata.openGraph).not.toHaveProperty("description");
    expect(metadata.twitter).not.toHaveProperty("title");
    expect(metadata.twitter).not.toHaveProperty("description");
  });

  test("renders the shared Hraness footer after every route", async () => {
    const [layout, styles] = await Promise.all([
      Bun.file(new URL("./layout.tsx", import.meta.url)).text(),
      Bun.file(new URL("./globals.css", import.meta.url)).text(),
    ]);

    expect(layout).toContain('from "@hraness/site-footer/react"');
    expect(layout.indexOf("<HranessSiteFooter />")).toBeGreaterThan(
      layout.indexOf("{children}"),
    );
    expect(styles).toContain('@import "@hraness/site-footer/styles.css"');
  });
});
