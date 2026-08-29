import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { markdownAlternatePath } from "./agent-access";
import { readingEditorialImage } from "./editorial-images";
import {
  READING_DESCRIPTION,
  READING_NOTES,
  type ReadingNoteDefinition,
} from "./reading-notes";
import { absoluteUrl, isoDateTime } from "./seo";
import { site } from "./site";

export const readingDescription = READING_DESCRIPTION;

export function readingNoteMetadata(note: ReadingNoteDefinition): Metadata {
  const editorialImage = readingEditorialImage(note.slug);
  const image = {
    alt: editorialImage.alt,
    height: editorialImage.height,
    url: editorialImage.src,
    width: editorialImage.width,
  } as const;

  return {
    title: note.title,
    description: note.description,
    robots: INDEXABLE_ROBOTS,
    alternates: {
      canonical: note.path,
      types: {
        "text/markdown": markdownAlternatePath(note.path),
      },
    },
    authors: [{ name: site.shortName, url: "/about" }],
    creator: site.shortName,
    publisher: site.shortName,
    openGraph: {
      type: "article",
      locale: "en_US",
      url: note.path,
      siteName: site.shortName,
      title: note.title,
      description: note.description,
      publishedTime: isoDateTime(note.publishedAt),
      modifiedTime: isoDateTime(note.updatedAt),
      authors: [absoluteUrl("/about")],
      section: "Reading notes",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.description,
      images: [{ alt: image.alt, url: image.url }],
    },
  };
}

export function readingNoteJsonLd(note: ReadingNoteDefinition) {
  const url = absoluteUrl(note.path);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: note.heading,
    description: note.description,
    image: absoluteUrl(readingEditorialImage(note.slug).src),
    datePublished: isoDateTime(note.publishedAt),
    dateModified: isoDateTime(note.updatedAt),
    author: {
      "@type": "Organization",
      "@id": `${site.canonicalUrl}/#organization`,
      name: site.shortName,
      url: absoluteUrl("/about"),
    },
    publisher: { "@id": `${site.canonicalUrl}/#organization` },
    isPartOf: { "@id": `${site.canonicalUrl}/#website` },
    isAccessibleForFree: true,
    inLanguage: "en-US",
    articleSection: "Reading notes",
  } as const;
}

export function readingCollectionJsonLd() {
  const url = absoluteUrl("/reading");

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "Sleepyland Reading",
    description: readingDescription,
    inLanguage: "en-US",
    isPartOf: { "@id": `${site.canonicalUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: READING_NOTES.length,
      itemListElement: READING_NOTES.map((note, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: note.heading,
        image: absoluteUrl(readingEditorialImage(note.slug).src),
        url: absoluteUrl(note.path),
      })),
    },
  } as const;
}
