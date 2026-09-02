import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS, NOINDEX_ROBOTS } from "@hraness/web-discovery";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  homepageMarkdown,
  llmsTxt,
  markdownResponse,
  researchArticleMarkdown,
  researchIndexMarkdown,
  sitemapMarkdown,
} from "../agent-access";
import { researchEditorialImage } from "../editorial-images";
import {
  RESEARCH_FEED_PATH,
  indexNowPayload,
  researchDiscoveryPaths,
  researchFeedXml,
} from "../search-discovery";
import { serializeJsonLd } from "../seo";
import { buildSitemap } from "../sitemap";
import { metadata as researchIndexMetadata } from "./page";
import { homepageUpdatedAt, site } from "../site";
import ResearchArticlePage from "./[slug]/page";
import { ArticleBody } from "./article-body";
import { RESEARCH_IMAGE_WORDMARK } from "./article-image";
import ResearchLayout, { viewport } from "./layout";
import {
  RESEARCH_ADMISSIONS,
  getResearchAdmission,
  isResearchAdmissionValid,
  isResearchSlugAdmitted,
  researchAdmissionScore,
} from "./admissions";
import {
  ResearchIndexPage as ResearchIndex,
  researchIndexArticles,
} from "./research-index-page";
import { ResearchIndexList } from "./research-index-list";
import {
  RESEARCH_SLUGS,
  RESEARCH_SOURCES,
  RESEARCH_TAGS,
  CLINICAL_REVIEW_REQUIRED_RESEARCH_SLUGS,
  curateHomepageResearchArticles,
  discoverableResearchArticles,
  getResearchArticle,
  headingId,
  homepageResearchArticles,
  isIndexableResearchArticle,
  researchArticlePath,
  researchArticles,
  researchArticlesNewestFirst,
  relatedResearchArticles,
  type ResearchSlug,
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

    const markup = renderToStaticMarkup(createElement(ResearchIndex, { showAll: true }));
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
    expect(markup).not.toContain("benadryl-diphenhydramine-for-sleep");
    expect(markup).not.toContain("z-drugs-zaleplon-zolpidem-eszopiclone");

    const homepageMarkup = renderToStaticMarkup(createElement(ResearchIndex));
    const homepageEntries = homepageMarkup.match(/class="plain-publication__entry"/gu)?.length ?? 0;
    expect(homepageEntries).toBeGreaterThan(0);
    expect(homepageEntries).toBeLessThanOrEqual(7);
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
      expect(article.seoDescription.length).toBeLessThanOrEqual(160);
      expect(article.body.length).toBeGreaterThan(0);
      expect(new Set(article.sourceIds).size).toBe(article.sourceIds.length);
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

  test("admits every indexable route through an authored evidence and overlap decision", () => {
    const admittedArticles = discoverableResearchArticles(researchArticles);
    const admissionEntries = Object.entries(RESEARCH_ADMISSIONS);

    expect(admissionEntries.map(([slug]) => slug).toSorted()).toEqual(
      admittedArticles.map((article) => article.slug).toSorted(),
    );
    expect(new Set(admissionEntries.map(([, record]) => record.readerJob)).size).toBe(
      admissionEntries.length,
    );
    expect(new Set(admissionEntries.map(([, record]) => record.contribution)).size).toBe(
      admissionEntries.length,
    );
    expect(new Set(admissionEntries.map(([, record]) => record.separation)).size).toBe(
      admissionEntries.length,
    );

    for (const article of researchArticles) {
      const admission = getResearchAdmission(article.slug);
      const requiresClinicalReview = CLINICAL_REVIEW_REQUIRED_RESEARCH_SLUGS.some(
        (slug) => slug === article.slug,
      );

      if (requiresClinicalReview) {
        expect(admission).toBeUndefined();
        expect(isIndexableResearchArticle(article)).toBeFalse();
        continue;
      }

      if (admission === undefined) {
        throw new Error(`Missing authored admission for ${article.slug}`);
      }

      expect(isResearchSlugAdmitted(article.slug)).toBeTrue();
      expect(isIndexableResearchArticle(article)).toBeTrue();
      expect(article.sourceIds).toContain(admission.evidenceAnchor.sourceId);
      expect(admission.evidenceAnchor.fit.trim()).not.toBe("");
      expect(admission.claimRisk.trim()).not.toBe("");
      expect(admission.evidenceType).toBe("evidence synthesis");
      expect(admission.humanReview).toBe("not documented");
      expect(["active", "keep-after-consolidation"]).toContain(admission.lifecycle);
      expect(admission.readerJob.trim()).not.toBe("");
      expect(admission.contribution.trim()).not.toBe("");
      expect(admission.separation.trim()).not.toBe("");
      expect(admission.nearestSlugs).not.toContain(article.slug);
      expect(new Set(admission.nearestSlugs).size).toBe(
        admission.nearestSlugs.length,
      );
      for (const nearestSlug of admission.nearestSlugs) {
        expect(getResearchArticle(nearestSlug)).toBeDefined();
      }
      expect(Object.values(admission.scores).every((score) => score > 0)).toBeTrue();
      expect(researchAdmissionScore(admission)).toBeGreaterThanOrEqual(9);
      expect(admission.reassessOn).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(admission.sourceCheckedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(isResearchAdmissionValid(admission)).toBeTrue();
    }
  });

  test("fails admission closed when review provenance is missing or invalid", () => {
    const admission = getResearchAdmission("best-sleep-sounds");
    if (admission === undefined) throw new Error("Expected admission fixture.");
    expect(isResearchAdmissionValid({
      ...admission,
      sourceCheckedOn: "",
    })).toBeFalse();
    expect(isResearchAdmissionValid({
      ...admission,
      humanReview: "pending" as never,
    })).toBeFalse();
  });

  test("fails closed for a typed article without an authored admission", () => {
    const fixture = {
      ...researchArticles[0],
      slug: "unadmitted-fixture" as ResearchSlug,
    };
    const path = `/research/${fixture.slug}`;

    expect(getResearchAdmission(fixture.slug)).toBeUndefined();
    expect(isResearchSlugAdmitted(fixture.slug)).toBeFalse();
    expect(isIndexableResearchArticle(fixture)).toBeFalse();
    expect(discoverableResearchArticles([fixture])).toEqual([]);
    expect(curateHomepageResearchArticles([fixture], [fixture.slug])).toEqual([]);
    expect(researchArticleMetadata(fixture).robots).toEqual(NOINDEX_ROBOTS);
    expect(researchCollectionJsonLd([fixture], "/research").mainEntity).toMatchObject({
      numberOfItems: 0,
      itemListElement: [],
    });

    const markdown = markdownResponse(
      path,
      researchArticleMarkdown(fixture),
      fixture,
    );
    expect(markdown.headers.get("x-robots-tag")).toBe("noindex");
    expect(homepageMarkdown([fixture])).not.toContain(fixture.slug);
    expect(researchIndexMarkdown([fixture])).not.toContain(fixture.slug);
    expect(llmsTxt([fixture])).not.toContain(fixture.slug);
    expect(sitemapMarkdown([fixture])).not.toContain(fixture.slug);
    expect(researchFeedXml([fixture])).not.toContain(fixture.slug);

    const discoveryPaths = researchDiscoveryPaths([fixture]);
    expect(discoveryPaths).not.toContain(path);
    expect(indexNowPayload(discoveryPaths).urlList).not.toContain(
      `https://sleepy.land${path}`,
    );
    expect(buildSitemap([fixture]).map((entry) => entry.url)).not.toContain(
      `https://sleepy.land${path}`,
    );
  });

  test("keeps sources public, descriptive, and HTTPS-only", () => {
    const urls = Object.values(RESEARCH_SOURCES).map((source) => source.url);
    expect(new Set(urls).size).toBe(urls.length);

    for (const source of Object.values(RESEARCH_SOURCES)) {
      expect(source.title.trim()).not.toBe("");
      expect(source.note.trim()).not.toBe("");
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
    const overview = getResearchArticle("noise-and-sleep-2026");

    expect(selection).toBeDefined();
    expect(frequency).toBeDefined();
    expect(masking).toBeDefined();
    expect(colors).toBeDefined();
    expect(overview).toBeDefined();

    const selectionText = JSON.stringify(selection?.body);
    const frequencyText = JSON.stringify(frequency?.body);
    const maskingText = JSON.stringify(masking?.body);
    const colorsText = JSON.stringify(colors?.body);
    const overviewText = JSON.stringify(overview?.body);

    expect(selectionText).toContain("There is no best sleep sound for everyone");
    expect(selectionText).toContain("Choose a sleep-sound strategy by the actual problem");
    expect(frequencyText).toContain("matching their numbers does not make them biologically equivalent");
    expect(frequencyText).toContain("Delta is a measurement, not an audio prescription");
    expect(frequencyText).toContain("between-group difference was not statistically significant");
    expect(frequencyText).toContain("Judge the morning, not the label");
    expect(frequency?.sourceIds).toContain("binauralTrial2026");
    expect(getResearchArticle("binaural-beats-for-sleep")).toBeUndefined();
    expect(maskingText).toContain("does not absorb, block, or cancel acoustic energy");
    expect(maskingText).toContain("Spectrum-first starting points");
    expect(colorsText).toContain("What about green noise for sleep");
    expect(colorsText).toContain("not have one universally adopted engineering definition");
    expect(colors?.updatedAt).toBe("2026-08-28");
    expect(overview?.title).toBe(
      "Does White Noise Help You Sleep? What Three 2026 Studies Found",
    );
    expect(overview?.updatedAt).toBe("2026-08-31");
    expect(overviewText).toContain(
      "questionnaires and personal logs rather than polysomnography",
    );
    expect(overviewText).toContain(
      "intervention was not one standardized white-noise signal",
    );
    expect(overviewText).toContain(
      "Total nighttime sleep duration did not change significantly",
    );
    expect(frequencyText).not.toMatch(/432 Hz (?:guarantees|induces|causes) sleep/iu);
    expect(maskingText).not.toMatch(/masking (?:blocks|cancels|erases) sound/iu);
  });

  test("records the frequency consolidation and its reassessment contract", async () => {
    const lifecycle = await Bun.file(
      new URL("../../docs/editorial-lifecycle.md", import.meta.url),
    ).text();

    expect(lifecycle).toContain("/research/what-frequency-helps-you-sleep");
    expect(lifecycle).toContain("former `/research/binaural-beats-for-sleep`");
    expect(lifecycle).toContain("Total 9/12, no zero");
    expect(lifecycle).toContain("Reassess on:** 2026-10-13");
  });

  test("keeps the insomnia expansion useful without turning it into medical instructions", () => {
    const magnesium = getResearchArticle("best-magnesium-for-sleep");
    const antihistamine = getResearchArticle("benadryl-diphenhydramine-for-sleep");
    const screens = getResearchArticle("screens-blue-light-glasses-and-sleep");
    const zDrugs = getResearchArticle("z-drugs-zaleplon-zolpidem-eszopiclone");
    const racingMind = getResearchArticle("how-to-quiet-a-racing-mind-at-night");

    const antihistamineText = JSON.stringify(antihistamine?.body);
    const screensText = JSON.stringify(screens?.body);
    const zDrugText = JSON.stringify(zDrugs?.body);
    const racingMindText = JSON.stringify(racingMind?.body);

    expect(antihistamine).toBeDefined();
    expect(zDrugs).toBeDefined();
    if (antihistamine === undefined || zDrugs === undefined) {
      throw new Error("Expected both medication guides to remain available.");
    }
    expect(isIndexableResearchArticle(antihistamine)).toBeFalse();
    expect(isIndexableResearchArticle(zDrugs)).toBeFalse();
    expect(magnesium?.dek).toContain("no head-to-head sleep trial proves one form is best");
    expect(antihistamineText).toContain("associated with increased risk, not proven to cause");
    expect(screensText).toContain("no significant improvement");
    expect(screensText).not.toContain("/research/blue-light-scatter-and-visual-detail");
    expect(screens?.relatedSlugs).not.toContain("blue-light-scatter-and-visual-detail");
    expect(zDrugText).toContain("pharmacokinetic inference, not a demonstrated sleep-quality outcome");
    expect(racingMindText).toContain("capture, clarify, schedule, and release");
    expect(getResearchArticle("ghb-sodium-oxybate-and-sleep")).toBeUndefined();
    expect(getResearchArticle("kratom-after-no-sleep")).toBeUndefined();
    expect(getResearchArticle("blue-light-scatter-and-visual-detail")).toBeUndefined();
  });

  test("keeps quarantined medication guides out of every related discovery block", async () => {
    const quarantined = researchArticles.filter(
      (article) => !isIndexableResearchArticle(article),
    );

    expect(quarantined.map((article) => article.slug)).toEqual([
      "benadryl-diphenhydramine-for-sleep",
      "z-drugs-zaleplon-zolpidem-eszopiclone",
    ]);

    for (const article of researchArticles) {
      const related = relatedResearchArticles(article);
      expect(related.every(isIndexableResearchArticle)).toBeTrue();

      const page = await ResearchArticlePage({
        params: Promise.resolve({ slug: article.slug }),
      });
      const html = renderToStaticMarkup(page);
      const markdown = researchArticleMarkdown(article);

      for (const relatedArticle of related) {
        const path = researchArticlePath(relatedArticle.slug);
        expect(html).toContain(`href="${path}"`);
        expect(markdown).toContain(`${path}.md`);
      }

      for (const quarantinedArticle of quarantined) {
        const path = researchArticlePath(quarantinedArticle.slug);
        expect(html).not.toContain(`href="${path}"`);
        expect(markdown).not.toContain(`${path}.md`);
      }
    }
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

  test("keeps authorship, one compact editorial boundary, and product links visible", async () => {
    const [indexSource, articleSource] = await Promise.all([
      Bun.file(new URL("./research-index-page.tsx", import.meta.url)).text(),
      Bun.file(new URL("./[slug]/page.tsx", import.meta.url)).text(),
    ]);
    const indexMarkup = renderToStaticMarkup(createElement(ResearchIndex));

    expect(indexSource).toContain("Editorial boundary");
    expect(indexMarkup).toContain("Educational evidence synthesis, not medical advice");
    expect(indexMarkup).toContain("open source on GitHub");
    expect(indexMarkup).not.toContain("One publication, two readable surfaces");
    expect(indexMarkup).not.toContain("Accept: text/markdown");
    expect(indexSource).toContain("researchContributionUrl");
    expect(indexSource).toContain('href="/noise"');
    expect(articleSource).toContain("Open the calming sound machine");
    expect(articleSource).toContain("Educational evidence synthesis");
    expect(articleSource).toContain("software-assisted synthesis");
    expect(articleSource).toContain("No human clinical review is claimed");
    expect(articleSource).toContain("contributions are <a");
    expect(articleSource).toContain('href="/#editorial-method"');
    expect(articleSource).toContain("Published ");
    expect(articleSource).toContain("Updated ");
    expect(articleSource).toContain('href="/noise"');
    expect(articleSource).toContain('href="/research"');
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
    if (editorialImage !== undefined) {
      expect(markup).toContain(`alt="${editorialImage.alt}"`);
      expect(markup).toContain(editorialImage.caption);
      expect(markup).toContain(editorialImage.credit);
    }
  });

  test("keeps one real admitted guide image-free across every representation", async () => {
    const imageLessArticle = getResearchArticle("why-car-rides-make-you-sleepy");
    if (imageLessArticle === undefined) throw new Error("Expected image-free guide.");
    expect(isIndexableResearchArticle(imageLessArticle)).toBeTrue();
    expect(researchEditorialImage(imageLessArticle.slug)).toBeUndefined();
    const imageLessEntry = researchIndexArticles.find(
      (entry) => entry.slug === imageLessArticle.slug,
    );
    if (imageLessEntry === undefined) throw new Error("Expected image-free index entry.");
    const indexMarkup = renderToStaticMarkup(
      createElement(ResearchIndexList, {
        articles: [imageLessEntry],
        tagOptions: RESEARCH_TAGS,
      }),
    );

    expect(indexMarkup).toContain("plain-publication__entry--without-image");
    expect(indexMarkup).not.toContain("plain-publication__entry-image");

    const page = await ResearchArticlePage({
      params: Promise.resolve({ slug: imageLessArticle.slug }),
    });
    const pageMarkup = renderToStaticMarkup(page);
    expect(pageMarkup).not.toContain("plain-publication__article-banner");

    const metadata = researchArticleMetadata(imageLessArticle);
    expect(metadata.openGraph).not.toHaveProperty("images");
    expect(metadata.twitter).toMatchObject({ card: "summary" });
    expect(metadata.twitter).not.toHaveProperty("images");

    const structuredData = researchArticleJsonLd(imageLessArticle);
    expect(structuredData).not.toHaveProperty("image");
    const collection = researchCollectionJsonLd([imageLessArticle], "/research");
    expect(collection.mainEntity.itemListElement[0]).not.toHaveProperty("image");
    expect(researchArticleMarkdown(imageLessArticle)).not.toContain("![");
    const feedItem = researchFeedXml([imageLessArticle]);
    expect(feedItem).toContain(imageLessArticle.slug);
    expect(feedItem).not.toContain("<media:content");
    const articleSitemapEntry = buildSitemap([imageLessArticle])
      .find((entry) => entry.url.endsWith(imageLessArticle.slug));
    expect(articleSitemapEntry).toBeDefined();
    expect(articleSitemapEntry).not.toHaveProperty("images");
  });

  test("lets explicit article metadata own optional social images", async () => {
    const fileBasedOverride = Bun.file(
      new URL("./[slug]/opengraph-image.tsx", import.meta.url),
    );

    expect(await fileBasedOverride.exists()).toBeFalse();
  });
});

describe("Sleepyland Research search surface", () => {

  test("gives the research index its own indexable identity", () => {
    expect(researchIndexMetadata.title).toBe("All sleep research guides | Sleepyland");
    expect(researchIndexMetadata.robots).toEqual(INDEXABLE_ROBOTS);
    expect(researchIndexMetadata.alternates).toEqual({ canonical: "/research" });
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
      expect(metadata.robots).toEqual(
        isIndexableResearchArticle(article) ? INDEXABLE_ROBOTS : NOINDEX_ROBOTS,
      );
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
      });
      if (editorialImage === undefined) {
        expect(metadata.openGraph).not.toHaveProperty("images");
        expect(metadata.twitter).toMatchObject({ card: "summary" });
        expect(metadata.twitter).not.toHaveProperty("images");
        expect(researchArticleImagePath(article.slug)).toBeUndefined();
      } else {
        expect(metadata.openGraph).toMatchObject({
          images: [
            {
              url: editorialImage.src,
              width: editorialImage.width,
              height: editorialImage.height,
              alt: editorialImage.alt,
            },
          ],
        });
        expect(metadata.twitter).toMatchObject({
          card: "summary_large_image",
          images: [{ url: editorialImage.src }],
        });
        expect(researchArticleImagePath(article.slug)).toBe(editorialImage.src);
      }
    }
  });

  test("publishes truthful BlogPosting citations and a complete collection", () => {
    const collection = researchCollectionJsonLd(homepageResearchArticles(), "/");
    expect(collection).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      url: "https://sleepy.land/",
      dateModified: `${homepageUpdatedAt}T00:00:00.000Z`,
      primaryImageOfPage:
        "https://sleepy.land/research/opengraph-image",
    });
    expect(collection.mainEntity.numberOfItems).toBe(
      homepageResearchArticles().filter(isIndexableResearchArticle).length,
    );
    for (const [index, article] of homepageResearchArticles()
      .filter(isIndexableResearchArticle).entries()) {
      const image = researchEditorialImage(article.slug);
      const item = collection.mainEntity.itemListElement[index];
      if (image === undefined) {
        expect(item).not.toHaveProperty("image");
      } else {
        expect(item).toHaveProperty("image", `https://sleepy.land${image.src}`);
      }
    }

    for (const article of researchArticles) {
      const structuredData = researchArticleJsonLd(article);
      expect(structuredData).toMatchObject({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.seoDescription,
        datePublished: `${article.publishedAt}T00:00:00.000Z`,
        dateModified: `${article.updatedAt}T00:00:00.000Z`,
        isAccessibleForFree: true,
        creditText:
          "Software-assisted evidence synthesis checked against the linked sources; no human clinical review is claimed.",
      });
      expect(structuredData.citation).toEqual(
        article.sourceIds.map((sourceId) => RESEARCH_SOURCES[sourceId].url),
      );
      expect(structuredData).not.toHaveProperty("review");
      expect(structuredData).not.toHaveProperty("aggregateRating");
      const image = researchEditorialImage(article.slug);
      if (image === undefined) {
        expect(structuredData).not.toHaveProperty("image");
      } else {
        expect(structuredData).toHaveProperty(
          "image",
          `https://sleepy.land${image.src}`,
        );
      }
    }

    expect(serializeJsonLd(collection)).not.toContain("</script>");
  });
});
