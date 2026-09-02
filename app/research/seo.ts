import { INDEXABLE_ROBOTS, NOINDEX_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { researchEditorialImage } from "../editorial-images";
import {
  RESEARCH_SOURCES,
  researchArticlePath,
  isIndexableResearchArticle,
  researchTagLabel,
  type ResearchArticle,
  type ResearchSlug,
} from "./articles";
import { RESEARCH_FEED_PATH } from "../search-discovery";
import { absoluteUrl, isoDateTime } from "../seo";
import { homepageUpdatedAt, site } from "../site";

export const researchDescription =
  "Evidence-led guides to insomnia, sleep supplements, medications, light, routines, sound, circadian rhythm, and the limits of current research.";
export const RESEARCH_SOCIAL_IMAGE_PATH = "/research/opengraph-image";

export function researchArticleImagePath(slug: ResearchSlug): string | undefined {
  return researchEditorialImage(slug)?.src;
}

export function researchArticleMetadata(
  article: ResearchArticle,
): Metadata {
  const path = researchArticlePath(article.slug);
  const title = article.title;
  const editorialImage = researchEditorialImage(article.slug);

  return {
    title,
    description: article.seoDescription,
    robots: isIndexableResearchArticle(article)
      ? INDEXABLE_ROBOTS
      : NOINDEX_ROBOTS,
    alternates: {
      canonical: path,
      types: {
        "application/rss+xml": RESEARCH_FEED_PATH,
        "text/markdown": `${path}.md`,
      },
    },
    authors: [{ name: "Sleepyland Research", url: "/#editorial-method" }],
    creator: "Sleepyland Research",
    publisher: site.shortName,
    category: "Sleep research",
    openGraph: {
      type: "article",
      locale: "en_US",
      url: path,
      siteName: site.shortName,
      title,
      description: article.seoDescription,
      publishedTime: isoDateTime(article.publishedAt),
      modifiedTime: isoDateTime(article.updatedAt),
      authors: [absoluteUrl("/#editorial-method")],
      section: "Sleep research",
      tags: [
        ...article.tags.map(researchTagLabel),
        ...article.keywords,
      ],
      ...(editorialImage === undefined ? {} : {
        images: [
          {
            url: editorialImage.src,
            width: editorialImage.width,
            height: editorialImage.height,
            alt: editorialImage.alt,
          },
        ],
      }),
    },
    twitter: {
      card: editorialImage === undefined ? "summary" : "summary_large_image",
      title,
      description: article.seoDescription,
      ...(editorialImage === undefined ? {} : {
        images: [{ url: editorialImage.src, alt: editorialImage.alt }],
      }),
    },
  };
}

export function researchCollectionJsonLd(
  visibleArticles: readonly ResearchArticle[],
  path: "/" | "/research",
) {
  const url = absoluteUrl(path);
  const collectionArticles = visibleArticles.filter(isIndexableResearchArticle);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "Sleepyland Research",
    description: researchDescription,
    dateModified: isoDateTime(homepageUpdatedAt),
    inLanguage: "en-US",
    primaryImageOfPage: absoluteUrl(RESEARCH_SOCIAL_IMAGE_PATH),
    isPartOf: { "@id": `${site.canonicalUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collectionArticles.length,
      itemListElement: collectionArticles.map((article, index) => {
        const image = researchEditorialImage(article.slug);
        return {
          "@type": "ListItem",
          position: index + 1,
          name: article.title,
          ...(image === undefined ? {} : { image: absoluteUrl(image.src) }),
          url: absoluteUrl(researchArticlePath(article.slug)),
        };
      }),
    },
  } as const;
}

export function researchArticleJsonLd(article: ResearchArticle) {
  const url = absoluteUrl(researchArticlePath(article.slug));
  const imagePath = researchArticleImagePath(article.slug);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: article.title,
    description: article.seoDescription,
    ...(imagePath === undefined ? {} : { image: absoluteUrl(imagePath) }),
    datePublished: isoDateTime(article.publishedAt),
    dateModified: isoDateTime(article.updatedAt),
    author: {
      "@type": "Organization",
      "@id": `${site.canonicalUrl}/#editorial-method`,
      name: "Sleepyland Research",
      url: absoluteUrl("/#editorial-method"),
    },
    publisher: { "@id": `${site.canonicalUrl}/#organization` },
    isPartOf: { "@id": `${site.canonicalUrl}/#website` },
    isAccessibleForFree: true,
    inLanguage: "en-US",
    articleSection: "Sleep research",
    keywords: [
      ...article.tags.map(researchTagLabel),
      ...article.keywords,
    ],
    citation: article.sourceIds.map((sourceId) =>
      RESEARCH_SOURCES[sourceId].url),
  } as const;
}

export function breadcrumbJsonLd(
  items: readonly Readonly<{ name: string; path: string }>[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  } as const;
}
