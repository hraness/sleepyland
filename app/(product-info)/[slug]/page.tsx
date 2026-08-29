import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { markdownAlternatePath } from "../../agent-access";
import { SleepylandAskAiAboutThis } from "../../ask-ai-about-this";
import {
  LAUNCH_DEMO_PATH,
  PRODUCT_PAGES,
  getProductPage,
  type ProductPageInline,
} from "../../product-pages";
import { defaultSocialImage } from "../../seo";

type ProductPageParams = Readonly<{
  params: Promise<Readonly<{ slug: string }>>;
}>;

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const page = getProductPage(slug);

  if (page === undefined) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    robots: INDEXABLE_ROBOTS,
    alternates: {
      canonical: page.path,
      types: {
        "text/markdown": markdownAlternatePath(page.path),
      },
    },
    openGraph: {
      type: "website",
      url: page.path,
      title: page.title,
      description: page.description,
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [{
        alt: defaultSocialImage.alt,
        url: defaultSocialImage.url,
      }],
    },
  };
}

function InlineContent({ content }: Readonly<{ content: readonly ProductPageInline[] }>) {
  return content.map((part, index) => (
    <Fragment key={typeof part === "string" ? `${index}:${part}` : `${index}:${part.href}`}>
      {typeof part === "string" ? part : <Link href={part.href}>{part.text}</Link>}
    </Fragment>
  ));
}

export default async function ProductInfoPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const page = getProductPage(slug);

  if (page === undefined) {
    notFound();
  }

  return (
    <main className="plain-page product-info-page" id="product-info-content">
      <header className="product-info-page__header">
        <h1>{page.heading}</h1>
        <p><InlineContent content={page.intro} /></p>
        <p className="product-info-page__updated">
          Updated <time dateTime={page.updatedAt}>{page.updatedAt}</time>
        </p>
      </header>

      {page.slug === "demo" ? (
        <figure className="product-info-demo">
          <video
            aria-describedby="product-demo-description"
            controls
            height={720}
            muted
            playsInline
            preload="metadata"
            src={LAUNCH_DEMO_PATH}
            width={1280}
          >
            Your browser does not support the Sleepyland product-demo video.
          </video>
          <figcaption id="product-demo-description">
            Silent product walkthrough: Sleep, Relax, Tune, then active playback and spectrum.
          </figcaption>
        </figure>
      ) : null}

      {page.sections.map((section) => {
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
      <SleepylandAskAiAboutThis path={page.path} />
    </main>
  );
}
