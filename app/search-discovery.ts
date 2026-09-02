import {
  createIndexNowPayload,
  type OwnedPath,
} from "@hraness/web-discovery";

import { researchEditorialImage } from "./editorial-images";
import {
  latestResearchUpdatedAt,
  isIndexableResearchArticle,
  researchArticlePath,
  researchArticlesNewestFirst,
  researchTagLabel,
} from "./research/articles";
import { PRODUCT_PAGES } from "./product-pages";
import { absoluteUrl, isoDateTime } from "./seo";
import { site } from "./site";

export const RESEARCH_FEED_PATH = "/feed.xml";
export const INDEX_NOW_KEY = "f20e59c52650e0532630b90a9827704a";
export const INDEX_NOW_KEY_PATH = `/${INDEX_NOW_KEY}.txt`;

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function researchDiscoveryPaths(): readonly OwnedPath[] {
  return [
    "/",
    "/noise",
    "/research",
    ...PRODUCT_PAGES.map((page) => page.path),
    ...researchArticlesNewestFirst.filter(isIndexableResearchArticle).map((article) =>
      researchArticlePath(article.slug)),
  ];
}

export function indexNowPayload(
  paths: readonly OwnedPath[] = researchDiscoveryPaths(),
) {
  return createIndexNowPayload(
    site.canonicalUrl,
    INDEX_NOW_KEY,
    paths,
  );
}

export function researchFeedXml(): string {
  const latestUpdate = latestResearchUpdatedAt();
  const feedUrl = absoluteUrl(RESEARCH_FEED_PATH);
  const channelUrl = absoluteUrl("/");
  const items = researchArticlesNewestFirst
    .filter(isIndexableResearchArticle)
    .map((article) => {
      const url = absoluteUrl(researchArticlePath(article.slug));
      const editorialImage = researchEditorialImage(article.slug);

      return [
        "    <item>",
        `      <title>${xmlEscape(article.title)}</title>`,
        `      <link>${xmlEscape(url)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(url)}</guid>`,
        `      <pubDate>${new Date(isoDateTime(article.publishedAt)).toUTCString()}</pubDate>`,
        `      <description>${xmlEscape(article.dek)}</description>`,
        `      <media:content height="${editorialImage.height}" medium="image" type="image/webp" url="${xmlEscape(absoluteUrl(editorialImage.src))}" width="${editorialImage.width}">`,
        `        <media:description type="plain">${xmlEscape(editorialImage.alt)}</media:description>`,
        `        <media:credit role="creator">${xmlEscape(editorialImage.credit)}</media:credit>`,
        "      </media:content>",
        ...article.tags.map((tagId) =>
          `      <category>${xmlEscape(researchTagLabel(tagId))}</category>`),
        "    </item>",
      ].join("\n");
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">',
    "  <channel>",
    `    <title>${site.shortName} Research</title>`,
    `    <link>${xmlEscape(channelUrl)}</link>`,
    `    <description>${xmlEscape("Evidence-led sound wellness research from Sleepyland.")}</description>`,
    "    <language>en-US</language>",
    `    <lastBuildDate>${new Date(isoDateTime(latestUpdate)).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
