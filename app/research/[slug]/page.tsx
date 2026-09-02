import { Breadcrumbs } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { serializeJsonLd } from "../../seo";
import { EditorialImageFigure } from "../../editorial-image";
import { researchEditorialImage } from "../../editorial-images";
import { ArticleBody } from "../article-body";
import {
  RESEARCH_SOURCES,
  articleReadingMinutes,
  getResearchArticle,
  headingId,
  researchArticlePath,
  researchArticles,
  relatedResearchArticles,
  researchTagLabel,
} from "../articles";
import {
  breadcrumbJsonLd,
  researchArticleJsonLd,
  researchArticleMetadata,
} from "../seo";
import { researchContributionUrl } from "../../site";

interface ResearchArticlePageProps {
  readonly params: Promise<{ slug: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00.000Z`));
}

export const dynamicParams = false;

export function generateStaticParams() {
  return researchArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ResearchArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResearchArticle(slug);
  return article === undefined ? {} : researchArticleMetadata(article);
}

export default async function ResearchArticlePage({
  params,
}: ResearchArticlePageProps) {
  const { slug } = await params;
  const article = getResearchArticle(slug);

  if (article === undefined) {
    notFound();
  }

  const relatedArticles = relatedResearchArticles(article);
  const headings = article.body.flatMap((block) =>
    block.type === "heading" && block.level === 2
      ? [{ text: block.text }]
      : []);
  const path = researchArticlePath(article.slug);
  const editorialImage = researchEditorialImage(article.slug);
  return (
    <main className="plain-publication__article" id="research-content">
      <script
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            researchArticleJsonLd(article),
            breadcrumbJsonLd([
              { name: "Research", path: "/research" },
              { name: article.title, path },
            ]),
          ]),
        }}
        id="research-article-structured-data"
        type="application/ld+json"
      />

      <header className="plain-publication__article-header plain-publication__shell">
        <Breadcrumbs
          aria-label="Breadcrumb"
          className="plain-publication__breadcrumbs"
          items={[
            { href: "/research", id: "research", label: "Research" },
            { id: article.slug, label: article.title },
          ]}
        />
        <p className="plain-publication__eyebrow">{article.evidenceLabel}</p>
        <h1>{article.title}</h1>
        <p className="plain-publication__article-dek">{article.dek}</p>
        <p className="plain-publication__article-meta">
          <span>By </span>
          <Link href="/#editorial-method">Sleepyland Research</Link>
          <span aria-hidden="true"> · </span>
          <span>Published </span>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          {article.updatedAt === article.publishedAt ? null : (
            <>
              <span aria-hidden="true"> · </span>
              <span>Updated </span>
              <time dateTime={article.updatedAt}>
                {formatDate(article.updatedAt)}
              </time>
            </>
          )}
          <span aria-hidden="true"> · </span>
          <span>{articleReadingMinutes(article)} min read</span>
          <span aria-hidden="true"> · </span>
          <span>{article.tags.map(researchTagLabel).join(", ")}</span>
        </p>
      </header>

      {editorialImage === undefined ? null : (
        <div className="plain-publication__article-banner plain-publication__shell">
          <EditorialImageFigure image={editorialImage} preload />
        </div>
      )}

      <div className="plain-publication__article-layout plain-publication__shell">
        <nav aria-label="In this article" className="plain-publication__toc">
          <p>In this article</p>
          <ol>
            {headings.map((block) => (
              <li key={block.text}>
                <a href={`#${headingId(block.text)}`}>{block.text}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="plain-publication__article-main">
          <ArticleBody blocks={article.body} />

          <aside className="plain-publication__cta">
            <h2>Build a quieter mix in Sleepyland.</h2>
            <p>
              Compare brown, pink, and white noise, shape the tone, add slow
              procedural waves, choose Sleep, Relax, or Focus, adjust Energy,
              and run an endless, countdown, or interval session. Everything
              is generated locally in your browser.
            </p>
            <Link className="plain-publication__primary-link" href="/noise">
              Open the calming sound machine <span aria-hidden="true">→</span>
            </Link>
          </aside>

          <section aria-labelledby="sources-title" className="plain-publication__sources">
            <h2 id="sources-title">Sources</h2>
            <ol>
              {article.sourceIds.map((sourceId) => {
                const source = RESEARCH_SOURCES[sourceId];
                return (
                  <li key={sourceId}>
                    <a href={source.url}>{source.title}</a>
                    <span>
                      {source.publication}, {source.year}. {source.note}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <p className="plain-publication__disclosure">
            Educational evidence synthesis, not medical advice. We distinguish
            direct findings from mechanism and inference and revise material
            claims when stronger evidence appears.
          </p>
          <p className="plain-publication__disclosure">
            This guide was prepared with software-assisted synthesis and checked
            against the linked sources. No human clinical review is claimed.
          </p>
          <p className="plain-publication__disclosure">
            Found a stronger source or a claim that needs review? Research
            contributions are <a href={researchContributionUrl}>welcome on GitHub</a>.
          </p>
        </div>
      </div>

      <footer className="plain-publication__related plain-publication__shell">
        <div className="plain-publication__section-heading">
          <h2>Continue researching</h2>
          <Link href="/research">All research</Link>
        </div>
        <div className="plain-publication__related-grid">
          {relatedArticles.map((relatedArticle) => (
            <Link
              href={researchArticlePath(relatedArticle.slug)}
              key={relatedArticle.slug}
            >
              <strong>{relatedArticle.title}</strong>
            </Link>
          ))}
        </div>
      </footer>
    </main>
  );
}
