import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { SleepylandAskAiAboutThis } from "../../../ask-ai-about-this";
import { EditorialImageFigure } from "../../../editorial-image";
import { readingEditorialImage } from "../../../editorial-images";
import {
  READING_NOTES,
  getReadingNote,
} from "../../../reading-notes";
import type { ProductPageInline } from "../../../product-pages";
import { readingNoteJsonLd, readingNoteMetadata } from "../../../reading-seo";
import { serializeJsonLd } from "../../../seo";

type ReadingNoteParams = Readonly<{
  params: Promise<Readonly<{ slug: string }>>;
}>;

export const dynamicParams = false;

export function generateStaticParams() {
  return READING_NOTES.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: ReadingNoteParams): Promise<Metadata> {
  const { slug } = await params;
  const note = getReadingNote(slug);

  if (note === undefined) {
    return {};
  }

  return readingNoteMetadata(note);
}

function InlineContent({ content }: Readonly<{ content: readonly ProductPageInline[] }>) {
  return content.map((part, index) => (
    <Fragment key={typeof part === "string" ? `${index}:${part}` : `${index}:${part.href}`}>
      {typeof part === "string" ? part : <Link href={part.href}>{part.text}</Link>}
    </Fragment>
  ));
}

export default async function ReadingNotePage({ params }: ReadingNoteParams) {
  const { slug } = await params;
  const note = getReadingNote(slug);

  if (note === undefined) {
    notFound();
  }

  return (
    <main className="plain-page product-info-page" id="product-info-content">
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(readingNoteJsonLd(note)) }}
        id="reading-note-structured-data"
        type="application/ld+json"
      />
      <header className="product-info-page__header">
        <h1>{note.heading}</h1>
        <p><InlineContent content={note.intro} /></p>
        <p className="product-info-page__updated">
          By <Link href="/about">Sleepyland</Link>
          {" · "}
          Published <time dateTime={note.publishedAt}>{note.publishedAt}</time>
          {" · "}
          Updated <time dateTime={note.updatedAt}>{note.updatedAt}</time>
        </p>
      </header>

      <EditorialImageFigure
        image={readingEditorialImage(note.slug)}
        preload
        sizes="(max-width: 44rem) calc(100vw - 2rem), 44rem"
        variant="reading"
      />

      {note.sections.map((section) => {
        const id = section.heading.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");
        return (
          <section aria-labelledby={id} key={section.heading}>
            <h2 id={id}>{section.heading}</h2>
            {section.items === undefined ? null : (
              <ul>
                {section.items.map((item, index) => (
                  <li key={`${section.heading}:${index}`}>
                    <InlineContent content={item} />
                  </li>
                ))}
              </ul>
            )}
            {section.paragraphs?.map((paragraph, index) => (
              <p key={`${section.heading}:paragraph:${index}`}>
                <InlineContent content={paragraph} />
              </p>
            ))}
          </section>
        );
      })}
      <SleepylandAskAiAboutThis path={note.path} />
    </main>
  );
}
