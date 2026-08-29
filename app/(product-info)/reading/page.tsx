import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";
import Link from "next/link";

import { markdownAlternatePath } from "../../agent-access";
import { EditorialImageThumbnail } from "../../editorial-image";
import { readingEditorialImage } from "../../editorial-images";
import { readingCollectionJsonLd, readingDescription } from "../../reading-seo";
import { READING_NOTES } from "../../reading-notes";
import { serializeJsonLd } from "../../seo";

const collectionImage = readingEditorialImage("anger-anxiety-agency");

export const metadata: Metadata = {
  title: "Reading Notes on Rest & Attention | Sleepyland",
  description: readingDescription,
  robots: INDEXABLE_ROBOTS,
  alternates: {
    canonical: "/reading",
    types: { "text/markdown": markdownAlternatePath("/reading") },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/reading",
    title: "Sleepyland Reading",
    description: readingDescription,
    images: [{
      alt: collectionImage.alt,
      height: collectionImage.height,
      url: collectionImage.src,
      width: collectionImage.width,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleepyland Reading",
    description: readingDescription,
    images: [{ alt: collectionImage.alt, url: collectionImage.src }],
  },
};

export default function ReadingIndexPage() {
  return (
    <main className="plain-page product-info-page reading-index" id="product-info-content">
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(readingCollectionJsonLd()) }}
        id="reading-collection-structured-data"
        type="application/ld+json"
      />
      <header className="product-info-page__header">
        <p className="reading-index__eyebrow">Sleepyland Reading</p>
        <h1>Rest, attention, and the ideas around them.</h1>
        <p>{readingDescription}</p>
      </header>

      <div className="reading-index__list">
        {READING_NOTES.toReversed().map((note) => {
          const image = readingEditorialImage(note.slug);
          return (
            <article className="reading-index__entry" key={note.slug}>
              <Link className="reading-index__image" href={note.path}>
                <EditorialImageThumbnail
                  image={image}
                  sizes="(max-width: 44rem) calc(100vw - 2rem), 20rem"
                />
              </Link>
              <div>
                <p className="reading-index__date">
                  <time dateTime={note.publishedAt}>{note.publishedAt}</time>
                </p>
                <h2><Link href={note.path}>{note.heading}</Link></h2>
                <p>{note.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
