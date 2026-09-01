import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { researchEditorialImage } from "../editorial-images";
import {
  RESEARCH_SOURCES,
  researchArticlePath,
  researchArticles,
  researchArticlesNewestFirst,
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

export function researchArticleImagePath(slug: ResearchSlug): string {
  return researchEditorialImage(slug).src;
}

export function researchArticleMetadata(
  article: ResearchArticle,
): Metadata {
  const path = researchArticlePath(article.slug);
  const title = article.title;
  const editorialImage = researchEditorialImage(article.slug);
  const imagePath = editorialImage.src;
  const imageAlt = editorialImage.alt;

  return {
    title,
    description: article.seoDescription,
    robots: INDEXABLE_ROBOTS,
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
      images: [
        {
          url: imagePath,
          width: editorialImage.width,
          height: editorialImage.height,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.seoDescription,
      images: [{ url: imagePath, alt: imageAlt }],
    },
  };
}

export function researchCollectionJsonLd() {
  const url = absoluteUrl("/");

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
      numberOfItems: researchArticles.length,
      itemListElement: researchArticlesNewestFirst.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        image: absoluteUrl(researchEditorialImage(article.slug).src),
        url: absoluteUrl(researchArticlePath(article.slug)),
      })),
    },
  } as const;
}

export function researchArticleJsonLd(article: ResearchArticle) {
  const url = absoluteUrl(researchArticlePath(article.slug));

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
    image: absoluteUrl(researchArticleImagePath(article.slug)),
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
