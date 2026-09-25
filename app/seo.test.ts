import { describe, expect, test } from "bun:test";

import { researchEditorialImage } from "./editorial-images";
import robots from "./robots";
import {
  organizationJsonLd,
  applicationFeatures,
  serializeJsonLd,
  webApplicationJsonLd,
  websiteJsonLd,
} from "./seo";
import {
  homepageResearchArticles,
  isIndexableResearchArticle,
  researchArticlePath,
  researchArticlesNewestFirst,
} from "./research/articles";
import { PRODUCT_PAGES } from "./product-pages";
import {
  noiseDescription,
  noiseTitle,
  publicationDescription,
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
    expect(openGraphImage).toContain("mark: <SleepylandMark />");
    expect(await sha256("./icon.png")).toBe(
      "56812e5d5e0f79c226a16323a5def4ecc436a38fecc8bbbb85546a4d9f36b733",
    );
    expect(await sha256("./apple-icon.png")).toBe(
      "5b09755df36c8dc5b3657c9ddd20c80b329bdbe547e1b7be88c68c7387e45295",
    );
  });

  test("publishes the canonical product identity across metadata surfaces", () => {
    expect(site.title).toBe(noiseTitle);
    expect(site.description).toBe(publicationDescription);
    expect(site.title.length).toBeLessThanOrEqual(60);
    expect(site.description.length).toBeLessThanOrEqual(160);
    expect(site.description.toLowerCase()).toContain("sound machine");
    expect(site.description.toLowerCase()).not.toContain("supplements");
    expect(noiseTitle.startsWith(`${site.shortName} | `)).toBeTrue();
    expect(noiseTitle.toLowerCase()).toContain("browser");
    expect(noiseDescription.toLowerCase()).toContain("brown");
    expect(noiseDescription.toLowerCase()).toContain("pink");
    expect(noiseDescription.toLowerCase()).toContain("white noise");
    expect(site.description.toLowerCase()).toContain("sleep");
    expect(noiseDescription.toLowerCase()).toContain("ocean waves");
    expect(noiseDescription.toLowerCase()).toContain("free");
    expect(noiseDescription.toLowerCase()).not.toContain("airplane-like");
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
    const imageUrls = (articles: ReturnType<typeof homepageResearchArticles>) =>
      articles.flatMap((article) => {
        const image = researchEditorialImage(article.slug);
        return image === undefined ? [] : [`https://sleepy.land${image.src}`];
      });
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
    });
    expect(entries[1]).toEqual({
      url: "https://sleepy.land/noise",
      lastModified: new Date(site.updatedAt),
    });
    expect(entries[2]).toEqual({
      url: "https://sleepy.land/research",
      lastModified: new Date(homepageUpdatedAt),
      images: imageUrls(
        researchArticlesNewestFirst.filter(isIndexableResearchArticle),
      ),
    });
    expect(entries.slice(3, 3 + PRODUCT_PAGES.length)).toEqual(
      PRODUCT_PAGES.map((page) => ({
        url: `https://sleepy.land${page.path}`,
        lastModified: new Date(`${page.updatedAt}T00:00:00.000Z`),
      })),
    );
    expect(entries.slice(3 + PRODUCT_PAGES.length)).toEqual(
      researchArticlesNewestFirst.filter(isIndexableResearchArticle).map((article) => {
        const image = researchEditorialImage(article.slug);
        return {
          url: `https://sleepy.land${researchArticlePath(article.slug)}`,
          lastModified: new Date(`${article.updatedAt}T00:00:00.000Z`),
          ...(image === undefined
            ? {}
            : { images: [`https://sleepy.land${image.src}`] }),
        };
      }),
    );
  });
});
