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

function researchImageUrls(
  articles: ReturnType<typeof homepageResearchArticles>,
): string[] {
  return articles.flatMap((article) => {
    const image = researchEditorialImage(article.slug);
    return image === undefined ? [] : [`${site.canonicalUrl}${image.src}`];
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.canonicalUrl,
      lastModified: new Date(homepageUpdatedAt),
      images: researchImageUrls(
        homepageResearchArticles().filter(isIndexableResearchArticle),
      ),
    },
    {
      url: `${site.canonicalUrl}/noise`,
      lastModified: new Date(site.updatedAt),
    },
    {
      url: `${site.canonicalUrl}/research`,
      lastModified: new Date(homepageUpdatedAt),
      images: researchImageUrls(
        researchArticlesNewestFirst.filter(isIndexableResearchArticle),
      ),
    },
    ...PRODUCT_PAGES.map((page) => ({
      url: `${site.canonicalUrl}${page.path}`,
      lastModified: new Date(`${page.updatedAt}T00:00:00.000Z`),
    })),
    ...researchArticlesNewestFirst.filter(isIndexableResearchArticle).map((article) => {
      const image = researchEditorialImage(article.slug);
      return {
        url: `${site.canonicalUrl}${researchArticlePath(article.slug)}`,
        lastModified: new Date(`${article.updatedAt}T00:00:00.000Z`),
        ...(image === undefined
          ? {}
          : { images: [`${site.canonicalUrl}${image.src}`] }),
      };
    }),
  ];
}
