import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { renderToStaticMarkup } from "react-dom/server";

import { createElement } from "react";

import ProductInfoLayout from "./(product-info)/layout";
import ProductInfoPage, {
  generateMetadata,
  generateStaticParams,
} from "./(product-info)/[slug]/page";
import {
  LAUNCH_DEMO_PATH,
  LAUNCH_DEMO_SHA256,
  PRODUCT_PAGES,
  SUPPORT_EMAIL,
} from "./product-pages";

async function sha256(file: Bun.BunFile): Promise<string> {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(await file.arrayBuffer());
  return hasher.digest("hex");
}

describe("Sleepyland public product records", () => {
  test("exposes the about explainer from product-info navigation", () => {
    const markup = renderToStaticMarkup(
      createElement(ProductInfoLayout, null, createElement("main", null, "Record")),
    );

    expect(markup).toContain('href="/about"');
    expect(markup).toContain(">About<");
  });

  test("statically publishes canonical, indexable routes with markdown alternates", async () => {
    expect(generateStaticParams()).toEqual(
      PRODUCT_PAGES.map((page) => ({ slug: page.slug })),
    );

    for (const page of PRODUCT_PAGES) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: page.slug }),
      });
      const markup = renderToStaticMarkup(await ProductInfoPage({
        params: Promise.resolve({ slug: page.slug }),
      }));

      expect(metadata).toMatchObject({
        title: page.title,
        description: page.description,
        robots: INDEXABLE_ROBOTS,
        alternates: {
          canonical: page.path,
          types: { "text/markdown": `${page.path}.md` },
        },
      });
      expect(markup).toContain(`<h1>${page.heading}</h1>`);
      expect(markup).toContain(`dateTime="${page.updatedAt}"`);
    }
  });

  test("explains what Sleepyland is from live product facts without medical advice", async () => {
    const about = PRODUCT_PAGES.find((page) => page.slug === "about");
    if (about === undefined) throw new Error("Expected about page.");

    const markup = renderToStaticMarkup(await ProductInfoPage({
      params: Promise.resolve({ slug: about.slug }),
    }));

    expect(markup).toContain("<h1>What Sleepyland is</h1>");
    expect(markup).toContain("free browser sound machine");
    expect(markup).toContain("no recorded or hosted audio files");
    expect(markup).toContain("Sleep, Relax, or Focus");
    expect(markup).toContain("Energy scales movement depth and pace without changing volume");
    expect(markup).toContain("not a medical device");
    expect(markup).toContain("not a supplement calculator");
    expect(markup).toContain('href="https://hraness.com"');
    expect(markup).toContain('href="https://hraness.com/reading/does-creatine-make-you-smarter"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/noise"');
    expect(markup).toContain('href="/reading/good-ideas"');
    expect(markup).toContain('href="/reading/habit-and-rest"');
    expect(markup).toContain('href="/reading/anger-anxiety-agency"');
    expect(markup).toContain('href="https://github.com/hraness/sleepyland"');
    expect(markup).toContain("research contributions are welcome");
    expect(markup).not.toMatch(/(?:cure|treat insomnia|clinically proven|guaranteed sleep)/iu);
  });

  test("states the local, anonymous analytics, provider, retention, and deletion boundaries", async () => {
    const privacy = PRODUCT_PAGES.find((page) => page.slug === "privacy");
    if (privacy === undefined) throw new Error("Expected privacy page.");

    const markup = renderToStaticMarkup(await ProductInfoPage({
      params: Promise.resolve({ slug: privacy.slug }),
    }));

    expect(markup).toContain("browser local storage");
    expect(markup).toContain("does not upload audio");
    expect(markup).toContain("selected mode and session kind");
    expect(markup).toContain("categorical fields");
    expect(markup).toContain("Vercel");
    expect(markup).toContain("PostHog");
    expect(markup).toContain("sender address, message, attachments");
    expect(markup).toContain("Support email has a separate retention and deletion boundary");
    expect(markup).toContain("memory-only persistence");
    expect(markup).toContain("does not set a fixed PostHog retention period");
    expect(markup).toContain("may not be safely isolatable");
    expect(markup).toContain('href="/support"');
    expect(markup).not.toMatch(/all (?:data|information) stays/iu);
    expect(markup).not.toContain("sound and session settings stay");
  });

  test("publishes a stable contact without medical or outcome support claims", async () => {
    const support = PRODUCT_PAGES.find((page) => page.slug === "support");
    if (support === undefined) throw new Error("Expected support page.");

    const markup = renderToStaticMarkup(await ProductInfoPage({
      params: Promise.resolve({ slug: support.slug }),
    }));

    expect(markup).toContain(`mailto:${SUPPORT_EMAIL}`);
    expect(markup).toContain("does not provide medical advice");
    expect(markup).toContain("not guaranteed outcomes");
    expect(markup).not.toMatch(/(?:cure|treat insomnia|guarantee sleep)/iu);
  });

  test("records checked accessibility behavior and denies unperformed assessments", async () => {
    const accessibility = PRODUCT_PAGES.find((page) => page.slug === "accessibility");
    if (accessibility === undefined) throw new Error("Expected accessibility page.");

    const markup = renderToStaticMarkup(await ProductInfoPage({
      params: Promise.resolve({ slug: accessibility.slug }),
    }));

    expect(markup).toContain("44-pixel minimum target");
    expect(markup).toContain("Reduced-motion preference");
    expect(markup).toContain("not a third-party audit");
    expect(markup).toContain("not yet contain an independent screen-reader matrix");
    expect(markup).toContain("NYC 988 assessment");
    expect(markup).not.toMatch(/WCAG (?:compliant|certified|conformant)/iu);
  });

  test("publishes the MIT source and contribution posture", async () => {
    const license = PRODUCT_PAGES.find((page) => page.slug === "license");
    if (license === undefined) throw new Error("Expected license page.");

    const markup = renderToStaticMarkup(await ProductInfoPage({
      params: Promise.resolve({ slug: license.slug }),
    }));

    expect(markup).toContain("source repository is public");
    expect(markup).toContain("MIT License");
    expect(markup).toContain('href="https://github.com/hraness/sleepyland"');
    expect(markup).toContain("Contributions accepted into the repository");
    expect(markup).toContain("A citation does not relicense its source");
    expect(markup).not.toContain("source repository is private");
  });

  test("pins the silent source-owned launch demo", async () => {
    const asset = Bun.file(new URL(`../public${LAUNCH_DEMO_PATH}`, import.meta.url));
    const bytes = new Uint8Array(await asset.arrayBuffer());
    const ascii = Buffer.from(bytes).toString("latin1");
    const demo = PRODUCT_PAGES.find((page) => page.slug === "demo");
    if (demo === undefined) throw new Error("Expected demo page.");

    const markup = renderToStaticMarkup(await ProductInfoPage({
      params: Promise.resolve({ slug: demo.slug }),
    }));

    expect(asset.size).toBeGreaterThan(100_000);
    expect(await sha256(asset)).toBe(LAUNCH_DEMO_SHA256);
    expect(ascii.slice(4, 12)).toContain("ftyp");
    expect(ascii).toContain("avc1");
    expect(ascii).not.toContain("mp4a");
    expect(markup).toContain(`src="${LAUNCH_DEMO_PATH}"`);
    expect(markup).toContain("Silent product walkthrough");
    expect(markup).not.toContain("autoplay");
  });
});
