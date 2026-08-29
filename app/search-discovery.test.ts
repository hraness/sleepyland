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
  researchArticlePath,
  researchArticles,
} from "./research/articles";
import { PRODUCT_PAGES } from "./product-pages";
import { READING_NOTES } from "./reading-notes";

describe("Sleepyland search discovery", () => {
  test("publishes every research article in a static RSS feed", async () => {
    const response = getResearchFeed();
    const xml = await response.text();

    expect(response.headers.get("content-type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
    expect(xml).toContain(
      `<atom:link href="https://sleepy.land${RESEARCH_FEED_PATH}" rel="self" type="application/rss+xml" />`,
    );
    expect(xml.match(/<item>/g)?.length).toBe(researchArticles.length);
    expect(xml).toContain('xmlns:media="http://search.yahoo.com/mrss/"');

    for (const article of researchArticles) {
      const editorialImage = researchEditorialImage(article.slug);
      expect(xml).toContain(
        `https://sleepy.land${researchArticlePath(article.slug)}`,
      );
      expect(xml).toContain(
        `url="https://sleepy.land${editorialImage.src}"`,
      );
      expect(xml).toContain(editorialImage.alt);
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
    for (const note of READING_NOTES) {
      expect(researchDiscoveryPaths()).toContain(note.path);
    }
  });
});
