import { describe, expect, test } from "bun:test";

import { researchEditorialImage } from "./editorial-images";
import { GET as getResearchFeed } from "./feed.xml/route";
import {
  INDEX_NOW_KEY,
  INDEX_NOW_KEY_PATH,
  RESEARCH_FEED_PATH,
  indexNowPayload,
  researchDiscoveryPaths,
} from "./search-discovery";
import {
  isIndexableResearchArticle,
  researchArticlePath,
  researchArticles,
} from "./research/articles";
import { PRODUCT_PAGES } from "./product-pages";

describe("Sleepyland search discovery", () => {
  test("publishes every indexable article with optional image parity", async () => {
    const response = getResearchFeed();
    const xml = await response.text();

    expect(response.headers.get("content-type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
    expect(xml).toContain(
      `<atom:link href="https://sleepy.land${RESEARCH_FEED_PATH}" rel="self" type="application/rss+xml" />`,
    );
    const indexableArticles = researchArticles.filter(isIndexableResearchArticle);
    expect(xml.match(/<item>/g)?.length).toBe(indexableArticles.length);
    expect(xml).toContain('xmlns:media="http://search.yahoo.com/mrss/"');
    expect(xml).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');

    for (const article of indexableArticles) {
      const editorialImage = researchEditorialImage(article.slug);
      const articleUrl = `https://sleepy.land${researchArticlePath(article.slug)}`;
      expect(xml).toContain(
        articleUrl,
      );
      const itemStart = xml.indexOf(`<link>${articleUrl}</link>`);
      const itemEnd = xml.indexOf("</item>", itemStart);
      const item = xml.slice(itemStart, itemEnd);
      expect(item).toContain(
        "Drafted by an AI agent and checked against the linked sources by a separate Codex AI reviewer; no human clinical review is claimed.",
      );
      expect(item).toContain("<dc:creator>Sleepyland Research</dc:creator>");
      if (editorialImage === undefined) {
        expect(item).not.toContain("<media:content");
      } else {
        expect(item).toContain(
          `url="https://sleepy.land${editorialImage.src}"`,
        );
        expect(item).toContain(editorialImage.alt);
      }
    }
    for (const article of researchArticles.filter(
      (candidate) => !isIndexableResearchArticle(candidate),
    )) {
      expect(xml).not.toContain(article.slug);
    }
  });

  test("builds an authenticated same-origin IndexNow payload", async () => {
    const payload = indexNowPayload();

    expect(payload).toEqual({
      host: "sleepy.land",
      key: INDEX_NOW_KEY,
      keyLocation: `https://sleepy.land${INDEX_NOW_KEY_PATH}`,
      urlList: researchDiscoveryPaths().map((path) =>
        new URL(path, "https://sleepy.land/").toString()),
    });
    expect(
      await Bun.file(
        new URL(`../public/${INDEX_NOW_KEY}.txt`, import.meta.url),
      ).text(),
    ).toBe(`${INDEX_NOW_KEY}\n`);
    expect(() => indexNowPayload([
      "https://example.com/" as `/${string}`,
    ])).toThrow(
      "root-relative",
    );
    for (const page of PRODUCT_PAGES) {
      expect(researchDiscoveryPaths()).toContain(page.path);
    }
    expect(researchDiscoveryPaths()).toContain("/research");
  });
});
