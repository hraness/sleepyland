import type { MetadataRoute } from "next";

import {
  readingEditorialImage,
  researchEditorialImage,
} from "./editorial-images";
import {
  researchArticlePath,
  researchArticlesNewestFirst,
} from "./research/articles";
import { PRODUCT_PAGES } from "./product-pages";
import { READING_NOTES } from "./reading-notes";
import { homepageUpdatedAt, site } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestReadingUpdate = READING_NOTES.reduce<string>(
    (latest, note) => note.updatedAt > latest ? note.updatedAt : latest,
    READING_NOTES[0]?.updatedAt ?? "1970-01-01",
  );

  return [
    {
      url: site.canonicalUrl,
      lastModified: new Date(homepageUpdatedAt),
      images: researchArticlesNewestFirst.map((article) =>
        `${site.canonicalUrl}${researchEditorialImage(article.slug).src}`),
    },
    {
      url: `${site.canonicalUrl}/noise`,
      lastModified: new Date(site.updatedAt),
    },
    {
      url: `${site.canonicalUrl}/reading`,
      lastModified: new Date(`${latestReadingUpdate}T00:00:00.000Z`),
      images: READING_NOTES.map((note) =>
        `${site.canonicalUrl}${readingEditorialImage(note.slug).src}`),
    },
    ...PRODUCT_PAGES.map((page) => ({
      url: `${site.canonicalUrl}${page.path}`,
      lastModified: new Date(`${page.updatedAt}T00:00:00.000Z`),
    })),
    ...READING_NOTES.map((note) => ({
      url: `${site.canonicalUrl}${note.path}`,
      lastModified: new Date(`${note.updatedAt}T00:00:00.000Z`),
      images: [`${site.canonicalUrl}${readingEditorialImage(note.slug).src}`],
    })),
    ...researchArticlesNewestFirst.map((article) => ({
      url: `${site.canonicalUrl}${researchArticlePath(article.slug)}`,
      lastModified: new Date(`${article.updatedAt}T00:00:00.000Z`),
      images: [`${site.canonicalUrl}${researchEditorialImage(article.slug).src}`],
    })),
  ];
}
