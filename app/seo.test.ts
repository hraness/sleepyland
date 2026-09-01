import { describe, expect, test } from "bun:test";

import {
  readingEditorialImage,
  researchEditorialImage,
} from "./editorial-images";
import robots from "./robots";
import {
  organizationJsonLd,
  applicationFeatures,
  serializeJsonLd,
  webApplicationJsonLd,
  websiteJsonLd,
} from "./seo";
import {
  researchArticlePath,
  researchArticlesNewestFirst,
} from "./research/articles";
import { PRODUCT_PAGES } from "./product-pages";
import { READING_NOTES } from "./reading-notes";
import {
  noiseDescription,
  noiseTitle,
  publicationDescription,
  publicationTitle,
  homepageUpdatedAt,
  repositoryUrl,
  site,
} from "./site";
import sitemap from "./sitemap";

describe("Sleepyland search surface", () => {
  test("uses the sleep symbol across brand metadata and generated icons", async () => {
    const openGraphImage = await Bun.file(
      new URL("./opengraph-image.tsx", import.meta.url),
    ).text();
    const sha256 = async (name: string) => {
      const hasher = new Bun.CryptoHasher("sha256");
      hasher.update(await Bun.file(new URL(name, import.meta.url)).arrayBuffer());
      return hasher.digest("hex");
    };

    expect(site.emoji).toBe("💤");
    expect(openGraphImage).toContain("mark: site.emoji");
    expect(await sha256("./icon.png")).toBe(
      "397934f6b2338cff6fe70865d60b9414d609bf1a972648092c84692b9a9b2988",
    );
    expect(await sha256("./apple-icon.png")).toBe(
      "bf2881192928c61155d1c3b631225fbd3818419cb7a63249e25b59c37ba149de",
    );
  });

  test("separates the publication identity from the noise-machine identity", () => {
    expect(site.title).toBe(publicationTitle);
    expect(site.description).toBe(publicationDescription);
    expect(site.title.length).toBeLessThanOrEqual(60);
    expect(site.description.length).toBeLessThanOrEqual(160);
    expect(site.description.toLowerCase()).toContain("insomnia");
    expect(site.description.toLowerCase()).toContain("supplements");
    expect(noiseTitle).toContain("White Noise");
    expect(noiseDescription.toLowerCase()).toContain("brown");
    expect(noiseDescription.toLowerCase()).toContain("pink");
    expect(noiseDescription.toLowerCase()).toContain("white noise");
    expect(site.description.toLowerCase()).toContain("sleep");
    expect(noiseDescription.toLowerCase()).toContain("relaxation");
    expect(noiseDescription.toLowerCase()).toContain("focus");
    expect(noiseDescription.toLowerCase()).toContain("ocean waves");
    expect(noiseDescription.toLowerCase()).toContain("airplane-like");
  });

  test("publishes honest WebApplication facts without invented ratings", () => {
    const structuredData = webApplicationJsonLd();

    expect(structuredData).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: noiseTitle,
      url: "https://sleepy.land/noise",
      description: noiseDescription,
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "USD",
      },
    });
    expect(structuredData.featureList).toEqual(applicationFeatures);
    expect(structuredData).not.toHaveProperty("aggregateRating");
    expect(structuredData).not.toHaveProperty("review");
    expect(organizationJsonLd()).toMatchObject({
      "@type": "Organization",
      "@id": "https://sleepy.land/#organization",
      name: "Sleepyland",
      sameAs: [repositoryUrl],
    });
    expect(websiteJsonLd()).toMatchObject({
      "@type": "WebSite",
      "@id": "https://sleepy.land/#website",
      name: "Sleepyland",
    });
    expect(serializeJsonLd({ value: "</script>" })).toBe(
      '{"value":"\\u003c/script\\u003e"}',
    );
  });

  test("advertises the generator and every research route through the sitemap", () => {
    expect(robots()).toEqual({
      rules: [
        {
          userAgent: "*",
          allow: "/",
        },
        {
          userAgent: "GPTBot",
          allow: "/",
        },
        {
          userAgent: "ClaudeBot",
          allow: "/",
        },
        {
          userAgent: "CCBot",
          allow: "/",
        },
        {
          userAgent: "Google-Extended",
          allow: "/",
        },
      ],
      sitemap: "https://sleepy.land/sitemap.xml",
      host: "https://sleepy.land",
    });
    const entries = sitemap();
    expect(entries[0]).toEqual({
      url: "https://sleepy.land",
      lastModified: new Date(homepageUpdatedAt),
      images: researchArticlesNewestFirst.map((article) =>
        `https://sleepy.land${researchEditorialImage(article.slug).src}`),
    });
    expect(entries[1]).toEqual({
      url: "https://sleepy.land/noise",
      lastModified: new Date(site.updatedAt),
    });
    const latestReadingUpdate = READING_NOTES.reduce<string>(
      (latest, note) => note.updatedAt > latest ? note.updatedAt : latest,
      READING_NOTES[0]?.updatedAt ?? "1970-01-01",
    );
    expect(entries[2]).toEqual({
      url: "https://sleepy.land/reading",
      lastModified: new Date(`${latestReadingUpdate}T00:00:00.000Z`),
      images: READING_NOTES.map((note) =>
        `https://sleepy.land${readingEditorialImage(note.slug).src}`),
    });
    expect(entries.slice(3, 3 + PRODUCT_PAGES.length)).toEqual(
      PRODUCT_PAGES.map((page) => ({
        url: `https://sleepy.land${page.path}`,
        lastModified: new Date(`${page.updatedAt}T00:00:00.000Z`),
      })),
    );
    expect(entries.slice(
      3 + PRODUCT_PAGES.length,
      3 + PRODUCT_PAGES.length + READING_NOTES.length,
    )).toEqual(
      READING_NOTES.map((note) => ({
        url: `https://sleepy.land${note.path}`,
        lastModified: new Date(`${note.updatedAt}T00:00:00.000Z`),
        images: [`https://sleepy.land${readingEditorialImage(note.slug).src}`],
      })),
    );
    expect(entries.slice(3 + PRODUCT_PAGES.length + READING_NOTES.length)).toEqual(
      researchArticlesNewestFirst.map((article) =>
        ({
          url: `https://sleepy.land${researchArticlePath(article.slug)}`,
          lastModified: new Date(`${article.updatedAt}T00:00:00.000Z`),
          images: [`https://sleepy.land${researchEditorialImage(article.slug).src}`],
        })),
    );
  });
});
