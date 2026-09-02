import type { MetadataRoute } from "next";

import { researchEditorialImage } from "./editorial-images";
import {
  homepageResearchArticles,
  isIndexableResearchArticle,
  researchArticlePath,
  researchArticlesNewestFirst,
} from "./research/articles";
import { PRODUCT_PAGES } from "./product-pages";
import { homepageUpdatedAt, site } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.canonicalUrl,
      lastModified: new Date(homepageUpdatedAt),
      images: homepageResearchArticles().filter(isIndexableResearchArticle).map((article) =>
        `${site.canonicalUrl}${researchEditorialImage(article.slug).src}`),
    },
    {
      url: `${site.canonicalUrl}/noise`,
      lastModified: new Date(site.updatedAt),
    },
    {
      url: `${site.canonicalUrl}/research`,
      lastModified: new Date(homepageUpdatedAt),
      images: researchArticlesNewestFirst.filter(isIndexableResearchArticle).map((article) =>
        `${site.canonicalUrl}${researchEditorialImage(article.slug).src}`),
    },
    ...PRODUCT_PAGES.map((page) => ({
      url: `${site.canonicalUrl}${page.path}`,
      lastModified: new Date(`${page.updatedAt}T00:00:00.000Z`),
    })),
    ...researchArticlesNewestFirst.filter(isIndexableResearchArticle).map((article) => ({
      url: `${site.canonicalUrl}${researchArticlePath(article.slug)}`,
      lastModified: new Date(`${article.updatedAt}T00:00:00.000Z`),
      images: [`${site.canonicalUrl}${researchEditorialImage(article.slug).src}`],
    })),
  ];
}
