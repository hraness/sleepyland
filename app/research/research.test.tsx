import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { researchEditorialImage } from "../editorial-images";
import { RESEARCH_FEED_PATH } from "../search-discovery";
import { serializeJsonLd } from "../seo";
import { metadata as researchIndexMetadata } from "../page";
import { publicationTitle, site } from "../site";
import ResearchArticlePage from "./[slug]/page";
import { ArticleBody } from "./article-body";
import { RESEARCH_IMAGE_WORDMARK } from "./article-image";
import ResearchLayout, { viewport } from "./layout";
import { ResearchIndexPage as ResearchIndex } from "./research-index-page";
import {
  RESEARCH_SLUGS,
  RESEARCH_SOURCES,
  RESEARCH_TAGS,
  articleWordCount,
  getResearchArticle,
  headingId,
  researchArticlePath,
  researchArticles,
  researchArticlesNewestFirst,
} from "./articles";
import {
  researchArticleJsonLd,
  researchArticleImagePath,
  researchArticleMetadata,
  researchCollectionJsonLd,
} from "./seo";

describe("Sleepyland Research content", () => {
  test("uses the shared plain-site shell without publication chrome", () => {
    const markup = renderToStaticMarkup(
      createElement(
        ResearchLayout,
        null,
        createElement("main", { id: "research-content" }, "Research"),
      ),
    );

    expect(markup).toContain(
      'class="plain-site plain-publication sleepyland-research"',
    );
    expect(markup).toContain('class="sleepyland-skip-link"');
    expect(markup).toContain('class="plain-header__inner"');
    expect(markup).toContain('class="plain-wordmark"');
    expect(markup).toContain('class="plain-header__actions"');
    expect(markup).toContain('class="plain-nav"');
    expect(markup).toContain('data-presentation="menu"');
    expect(markup).toContain('data-theme-value="system"');
    expect(markup.match(/class="hraness-design-theme-toggle(?: |")/gu)).toHaveLength(1);
    expect(markup).not.toContain('class="plain-footer"');
    expect(markup).not.toContain('class="plain-footer__links"');
    expect(markup).toContain('aria-label="Sleepyland research resources"');
    expect(markup).toContain('href="/privacy"');
    expect(markup).not.toContain('href="/feed.xml"');
    expect(markup).not.toContain("research-nav__generator");
    expect(markup).not.toContain("research-card-grid");

    const headerEnd = markup.indexOf("</header>");
    const navigationEnd = markup.indexOf("</nav>");
    const appearance = markup.indexOf("hraness-design-theme-toggle");
    expect(navigationEnd).toBeGreaterThan(-1);
    expect(appearance).toBeGreaterThan(navigationEnd);
    expect(headerEnd).toBeGreaterThan(appearance);
    expect(markup.slice(headerEnd)).not.toContain("hraness-design-theme-toggle");

    const indexMarkup = renderToStaticMarkup(createElement(ResearchIndex));
    expect(indexMarkup).toContain('class="plain-publication__entry"');
    expect(indexMarkup).not.toContain('class="research-card"');
    expect(viewport).toEqual({
      colorScheme: "light dark",
      themeColor: [
        { color: "#ffffff", media: "(prefers-color-scheme: light)" },
        { color: "#151515", media: "(prefers-color-scheme: dark)" },
      ],
      viewportFit: "cover",
    });
  });

  test("presents the index newest first with a compact filter taxonomy", () => {
    for (let index = 1; index < researchArticlesNewestFirst.length; index += 1) {
      expect(
        researchArticlesNewestFirst[index - 1].publishedAt >=
          researchArticlesNewestFirst[index].publishedAt,
      ).toBeTrue();
    }

    const markup = renderToStaticMarkup(createElement(ResearchIndex));
    const augustArticle = markup.indexOf("Is Eight Hours of Sleep Necessary?");
    const julyArticle = markup.indexOf("Can Sound Help You Focus?");

    expect(augustArticle).toBeGreaterThan(-1);
    expect(julyArticle).toBeGreaterThan(-1);
    expect(augustArticle).toBeLessThan(julyArticle);
    expect(markup).toContain('aria-label="Filter articles by topic"');
    expect(markup).toContain('aria-pressed="true"');
    for (const tag of RESEARCH_TAGS) {
      expect(markup).toContain(`>${tag.label}</button>`);
    }
  });

  test("publishes one substantial evidence cluster without thin query variants", () => {
    expect(researchArticles.map((article) => article.slug)).toEqual(
      [...RESEARCH_SLUGS],
    );
    expect(new Set(RESEARCH_SLUGS).size).toBe(RESEARCH_SLUGS.length);
    expect(new Set(researchArticles.map((article) => article.title)).size).toBe(
      researchArticles.length,
    );
    expect(
      new Set(researchArticles.map((article) => article.seoDescription)).size,
    ).toBe(researchArticles.length);
    expect(
      new Set(researchArticles.map((article) => article.focusPhrase)).size,
    ).toBe(researchArticles.length);
    const tagIds = new Set(RESEARCH_TAGS.map((tag) => tag.id));

    for (const article of researchArticles) {
      expect(article.title.length).toBeLessThanOrEqual(72);
      expect(article.seoDescription.length).toBeGreaterThanOrEqual(120);
      expect(article.seoDescription.length).toBeLessThanOrEqual(160);
      expect(articleWordCount(article)).toBeGreaterThanOrEqual(650);
      expect(article.sourceIds.length).toBeGreaterThanOrEqual(5);
      expect(article.tags.length).toBeGreaterThan(0);
      expect(new Set(article.tags).size).toBe(article.tags.length);
      for (const tag of article.tags) {
        expect(tagIds.has(tag)).toBeTrue();
      }
      expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(article.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(Number.isNaN(Date.parse(`${article.publishedAt}T00:00:00.000Z`))).toBeFalse();
      expect(Number.isNaN(Date.parse(`${article.updatedAt}T00:00:00.000Z`))).toBeFalse();
      expect(article.updatedAt >= article.publishedAt).toBeTrue();

      const articleHeadings = article.body.flatMap((block) =>
        block.type === "heading" ? [headingId(block.text)] : []
      );
      expect(new Set(articleHeadings).size).toBe(articleHeadings.length);

      for (const block of article.body) {
        if (block.type !== "table") continue;
        expect(block.columns.length).toBeGreaterThanOrEqual(2);
        expect(block.rows.length).toBeGreaterThanOrEqual(2);
        for (const row of block.rows) {
          expect(row.length).toBe(block.columns.length);
        }
      }

      for (const sourceId of article.sourceIds) {
        expect(RESEARCH_SOURCES[sourceId]).toBeDefined();
      }

      for (const relatedSlug of article.relatedSlugs) {
        expect(RESEARCH_SLUGS).toContain(relatedSlug);
        expect(relatedSlug).not.toBe(article.slug);
      }
    }
  });

  test("keeps sources public, descriptive, and HTTPS-only", () => {
    const urls = Object.values(RESEARCH_SOURCES).map((source) => source.url);
    expect(new Set(urls).size).toBe(urls.length);

    for (const source of Object.values(RESEARCH_SOURCES)) {
      expect(source.title.length).toBeGreaterThan(12);
      expect(source.note.length).toBeGreaterThan(40);
      expect(new URL(source.url).protocol).toBe("https:");
    }
  });

  test("keeps the evolutionary-sleep expansion evidence boundaries explicit", () => {
    const duration = getResearchArticle("is-eight-hours-of-sleep-necessary");
    const hunterGatherer = getResearchArticle("hunter-gatherer-sleep");
    const hotel = getResearchArticle("why-you-sleep-badly-in-hotels");
    const morningLight = getResearchArticle("morning-sunlight-and-sleep");
    const grounding = getResearchArticle("does-grounding-help-sleep");

    expect(duration).toBeDefined();
    expect(hunterGatherer).toBeDefined();
    expect(hotel).toBeDefined();
    expect(morningLight).toBeDefined();
    expect(grounding).toBeDefined();

    const durationText = JSON.stringify(duration?.body);
    const hunterGathererText = JSON.stringify(hunterGatherer?.body);
    const hotelText = JSON.stringify(hotel?.body);
    const morningLightText = JSON.stringify(morningLight?.body);
    const groundingText = JSON.stringify(grounding?.body);

    expect(durationText).toContain("at least seven hours");
    expect(hunterGathererText).toContain("not replicas of prehistoric humans");
    expect(hotelText).toContain("not literal unihemispheric sleep");
    expect(morningLightText).toContain("No human study establishes one universal rule");
    expect(groundingText).toContain("mat-company funding");
    expect(groundingText).toContain("reliable effect");
    expect(grounding?.evidenceLabel).toBe(
      "Promising pilots; reliable benefit not established",
    );
    expect(groundingText).not.toMatch(/grounding (?:cures|treats) insomnia/iu);
  });

  test("keeps the search-led sound expansion distinct and evidence bounded", () => {
    const selection = getResearchArticle("best-sleep-sounds");
    const frequency = getResearchArticle("what-frequency-helps-you-sleep");
    const masking = getResearchArticle("how-sound-masking-works");
    const colors = getResearchArticle("white-pink-brown-noise-for-sleep");

    expect(selection).toBeDefined();
    expect(frequency).toBeDefined();
    expect(masking).toBeDefined();
    expect(colors).toBeDefined();

    const selectionText = JSON.stringify(selection?.body);
    const frequencyText = JSON.stringify(frequency?.body);
    const maskingText = JSON.stringify(masking?.body);
    const colorsText = JSON.stringify(colors?.body);

    expect(selectionText).toContain("There is no best sleep sound for everyone");
    expect(selectionText).toContain("Choose a sleep-sound strategy by the actual problem");
    expect(frequencyText).toContain("matching their numbers does not make them biologically equivalent");
    expect(frequencyText).toContain("Delta is a measurement, not an audio prescription");
    expect(maskingText).toContain("does not absorb, block, or cancel acoustic energy");
    expect(maskingText).toContain("Spectrum-first starting points");
    expect(colorsText).toContain("What about green noise for sleep");
    expect(colorsText).toContain("not have one universally adopted engineering definition");
    expect(colors?.updatedAt).toBe("2026-08-28");
    expect(frequencyText).not.toMatch(/432 Hz (?:guarantees|induces|causes) sleep/iu);
    expect(maskingText).not.toMatch(/masking (?:blocks|cancels|erases) sound/iu);
  });

  test("keeps the insomnia expansion useful without turning it into medical instructions", () => {
    const magnesium = getResearchArticle("best-magnesium-for-sleep");
    const antihistamine = getResearchArticle("benadryl-diphenhydramine-for-sleep");
    const screens = getResearchArticle("screens-blue-light-glasses-and-sleep");
    const zDrugs = getResearchArticle("z-drugs-zaleplon-zolpidem-eszopiclone");
    const oxybate = getResearchArticle("ghb-sodium-oxybate-and-sleep");
    const kratom = getResearchArticle("kratom-after-no-sleep");
    const racingMind = getResearchArticle("how-to-quiet-a-racing-mind-at-night");

    const antihistamineText = JSON.stringify(antihistamine?.body);
    const screensText = JSON.stringify(screens?.body);
    const zDrugText = JSON.stringify(zDrugs?.body);
    const oxybateText = JSON.stringify(oxybate?.body);
    const kratomText = JSON.stringify(kratom?.body);
    const racingMindText = JSON.stringify(racingMind?.body);

    expect(magnesium?.dek).toContain("no head-to-head sleep trial proves one form is best");
    expect(antihistamineText).toContain("associated with increased risk, not proven to cause");
    expect(screensText).toContain("no significant improvement");
    expect(zDrugText).toContain("pharmacokinetic inference, not a demonstrated sleep-quality outcome");
    expect(oxybateText).toContain("does not reproduce amounts or informal administration techniques");
    expect(kratomText).toContain("not a proven way to restore the brain");
    expect(racingMindText).toContain("capture, clarify, schedule, and release");
    expect(oxybateText).not.toMatch(/(?:grams?|milliliters?|\bmL\b)/u);
    expect(kratomText).not.toMatch(/(?:recommended dose|take \d|use \d)/iu);
  });

  test("renders semantic long-form blocks and crawlable source links", () => {
    const article = getResearchArticle("noise-and-sleep-2026");
    expect(article).toBeDefined();

    if (article === undefined) {
      throw new Error("Expected the renderer fixture article to exist");
    }

    const markup = renderToStaticMarkup(
      createElement(ArticleBody, { blocks: article.body }),
    );

    expect(markup).toContain("<aside");
    expect(markup).toContain("<h2");
    expect(markup).toContain("<ol");
    expect(markup).toContain("<ul");
    expect(markup).toContain("<table");
    expect(markup).toContain('scope="row"');
    expect(markup).toContain(
      `href="${RESEARCH_SOURCES.basner2026.url}"`,
    );
    expect(markup).not.toMatch(/guaranteed sleep|cures insomnia|clinically proven/iu);
  });

  test("keeps authorship, editorial method, and product links visible", async () => {
    const [indexSource, articleSource] = await Promise.all([
      Bun.file(new URL("./research-index-page.tsx", import.meta.url)).text(),
      Bun.file(new URL("./[slug]/page.tsx", import.meta.url)).text(),
    ]);

    expect(indexSource).toContain("Editorial method");
    expect(indexSource).toContain("does not impersonate a clinician");
    expect(indexSource).toContain("open source on GitHub");
    expect(indexSource).toContain("researchContributionUrl");
    expect(indexSource).toContain('href="/noise"');
    expect(articleSource).toContain("Open the calming sound machine");
    expect(articleSource).toContain("Educational evidence synthesis");
    expect(articleSource).toContain("contributions are <a");
    expect(articleSource).toContain('href="/#editorial-method"');
    expect(articleSource).toContain("Published ");
    expect(articleSource).toContain("Updated ");
    expect(articleSource).toContain('href="/noise"');
    expect(articleSource).toContain('href="/"');
  });

  test("renders article trails through the shared breadcrumb primitive", async () => {
    const article = researchArticles[0];
    const page = await ResearchArticlePage({
      params: Promise.resolve({ slug: article.slug }),
    });
    const markup = renderToStaticMarkup(page);
    const editorialImage = researchEditorialImage(article.slug);

    expect(markup).toContain(
        'class="sleepyland-breadcrumbs plain-publication__breadcrumbs"',
    );
    expect(markup).toContain(
      `<span aria-current="page">${article.title}</span>`,
    );
    expect(markup).not.toContain('<span aria-hidden="true">/</span>');
    expect(markup).toContain(`alt="${editorialImage.alt}"`);
    expect(markup).toContain(editorialImage.caption);
    expect(markup).toContain(editorialImage.credit);
  });
});

describe("Sleepyland Research search surface", () => {

  test("gives the research index its own indexable identity", () => {
    expect(researchIndexMetadata.title).toBe(publicationTitle);
    expect(researchIndexMetadata.robots).toEqual(INDEXABLE_ROBOTS);
    expect(researchIndexMetadata.alternates).toMatchObject({
      canonical: "/",
      types: {
        "application/rss+xml": RESEARCH_FEED_PATH,
        "text/markdown": "/index.md",
      },
    });
    expect(researchIndexMetadata.openGraph).toMatchObject({
      url: "/",
      title: publicationTitle,
    });
  });
  test("keeps the filesystem-independent image wordmark aligned", () => {
    expect(RESEARCH_IMAGE_WORDMARK).toBe(site.shortName);
  });

  test("uses the shared neutral social-image renderer", async () => {
    const source = await Bun.file(
      new URL("./article-image.tsx", import.meta.url),
    ).text();

    expect(source).toContain("@hraness/web-discovery/social-image");
    expect(source).toContain('domain: "sleepy.land/research"');
    expect(source).not.toMatch(/#[0-9a-f]{6}/iu);
    expect(source).not.toContain("spectrumBands");
  });

  test("aligns visible article titles, canonicals, and article metadata", () => {
    for (const article of researchArticles) {
      const path = researchArticlePath(article.slug);
      const metadata = researchArticleMetadata(article);
      const editorialImage = researchEditorialImage(article.slug);

      expect(metadata.title).toBe(article.title);
      expect(metadata.description).toBe(article.seoDescription);
      expect(metadata.robots).toEqual(INDEXABLE_ROBOTS);
      expect(metadata.alternates).toEqual({
        canonical: path,
        types: {
          "application/rss+xml": RESEARCH_FEED_PATH,
          "text/markdown": `${path}.md`,
        },
      });
      expect(metadata.openGraph).toMatchObject({
        type: "article",
        url: path,
        title: article.title,
        description: article.seoDescription,
        publishedTime: `${article.publishedAt}T00:00:00.000Z`,
        modifiedTime: `${article.updatedAt}T00:00:00.000Z`,
        images: [
          {
            url: researchArticleImagePath(article.slug),
            width: editorialImage.width,
            height: editorialImage.height,
            alt: editorialImage.alt,
          },
        ],
      });
      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        images: [{ url: researchArticleImagePath(article.slug) }],
      });
    }
  });

  test("publishes truthful BlogPosting citations and a complete collection", () => {
    const collection = researchCollectionJsonLd();
    expect(collection).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      url: "https://sleepy.land/",
      primaryImageOfPage:
        "https://sleepy.land/research/opengraph-image",
    });
    expect(collection.mainEntity.numberOfItems).toBe(researchArticles.length);

    for (const article of researchArticles) {
      const structuredData = researchArticleJsonLd(article);
      expect(structuredData).toMatchObject({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.seoDescription,
        image:
          `https://sleepy.land${researchArticleImagePath(article.slug)}`,
        datePublished: `${article.publishedAt}T00:00:00.000Z`,
        dateModified: `${article.updatedAt}T00:00:00.000Z`,
        isAccessibleForFree: true,
      });
      expect(structuredData.citation).toEqual(
        article.sourceIds.map((sourceId) => RESEARCH_SOURCES[sourceId].url),
      );
      expect(structuredData).not.toHaveProperty("review");
      expect(structuredData).not.toHaveProperty("aggregateRating");
    }

    expect(serializeJsonLd(collection)).not.toContain("</script>");
  });
});
