import Link from "next/link";

import { EditorialImageFigure } from "../editorial-image";
import { researchEditorialImage } from "../editorial-images";
import {
  homepageMethod,
  homepageResult,
} from "../homepage-content";
import { serializeJsonLd } from "../seo";
import { repositoryUrl, researchContributionUrl } from "../site";
import {
  RESEARCH_TAGS,
  articleReadingMinutes,
  discoverableResearchArticles,
  homepageResearchArticles,
  researchArticlePath,
  researchArticlesNewestFirst,
  researchTagLabel,
} from "./articles";
import { ResearchIndexList } from "./research-index-list";
import { breadcrumbJsonLd, researchCollectionJsonLd } from "./seo";

export const researchIndexArticles = discoverableResearchArticles(
  researchArticlesNewestFirst,
).map((article) => ({
  dek: article.dek,
  evidenceLabel: article.evidenceLabel,
  image: researchEditorialImage(article.slug),
  publishedAt: article.publishedAt,
  readingMinutes: articleReadingMinutes(article),
  slug: article.slug,
  tags: article.tags.map((id) => ({ id, label: researchTagLabel(id) })),
  title: article.title,
}));

export function ResearchIndexPage({
  showAll = false,
}: Readonly<{ showAll?: boolean }>) {
  const homepageArticles = homepageResearchArticles();
  const archiveArticles = discoverableResearchArticles(researchArticlesNewestFirst);
  const visibleArticles = showAll ? archiveArticles : homepageArticles;
  const visibleIndexArticles = researchIndexArticles.filter((entry) =>
    visibleArticles.some((article) => article.slug === entry.slug));

  if (showAll) {
    return (
      <main className="plain-publication__index" id="research-content">
        <script
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd([
              researchCollectionJsonLd(archiveArticles, "/research"),
              breadcrumbJsonLd([{ name: "All research", path: "/research" }]),
            ]),
          }}
          id="research-collection-structured-data"
          type="application/ld+json"
        />
        <div className="plain-publication__shell plain-publication__index-content">
          <header className="plain-publication__hero">
            <p className="plain-publication__eyebrow">Sleepyland Research</p>
            <h1>All research guides</h1>
            <p>Browse accepted, evidence-led guides by topic. Medication guides awaiting clinical review stay out of this archive.</p>
          </header>
          <ResearchIndexList articles={visibleIndexArticles} tagOptions={RESEARCH_TAGS} />
        </div>
      </main>
    );
  }

  const featuredArticle = homepageArticles.find(
    (article) => article.slug === "noise-and-sleep-2026",
  ) ?? homepageArticles[0];

  if (featuredArticle === undefined) {
    throw new Error("Sleepyland Research requires an admitted homepage guide.");
  }

  const featuredPath = researchArticlePath(featuredArticle.slug);
  const featuredImage = researchEditorialImage(featuredArticle.slug);

  return (
    <main className="plain-publication__index" id="research-content">
      <script
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            researchCollectionJsonLd(homepageArticles, "/"),
            breadcrumbJsonLd([{ name: "Sleepyland Research", path: "/" }]),
          ]),
        }}
        id="research-collection-structured-data"
        type="application/ld+json"
      />

      <div className="plain-publication__shell plain-publication__index-content">
        <header className="plain-publication__hero">
          <p className="plain-publication__eyebrow">{homepageResult.eyebrow}</p>
          <h1>{homepageResult.heading}</h1>
          <p>{homepageResult.summary}</p>
          <div className="sleepyland-home__hero-actions">
            <Link className="plain-publication__primary-link" href="#first-proof">
              Inspect the evidence guide <span aria-hidden="true">→</span>
            </Link>
            <Link className="plain-publication__primary-link" href="/noise">
              Open the sound machine
            </Link>
          </div>
          <p className="sleepyland-home__hero-boundary">{homepageResult.boundary}</p>
        </header>

        <section
          aria-labelledby="first-proof-title"
          className={`sleepyland-home__proof${featuredImage === undefined ? " sleepyland-home__proof--without-image" : ""}`}
          id="first-proof"
        >
          <div className="sleepyland-home__proof-copy">
            <p className="plain-publication__eyebrow">First proof</p>
            <h2 id="first-proof-title">{featuredArticle.title}</h2>
            <p>{featuredArticle.dek}</p>
            <dl className="sleepyland-home__proof-facts">
              <div>
                <dt>Evidence</dt>
                <dd>{featuredArticle.evidenceLabel}</dd>
              </div>
              <div>
                <dt>Revised</dt>
                <dd><time dateTime={featuredArticle.updatedAt}>{featuredArticle.updatedAt}</time></dd>
              </div>
            </dl>
            <Link className="plain-publication__primary-link" href={featuredPath}>
              Read the guide and sources <span aria-hidden="true">→</span>
            </Link>
          </div>
          {featuredImage === undefined ? null : (
            <EditorialImageFigure image={featuredImage} variant="interstitial" />
          )}
        </section>

        <ResearchIndexList
          articles={visibleIndexArticles.filter((article) => article.slug !== featuredArticle.slug)}
          tagOptions={RESEARCH_TAGS}
        />
        <p className="plain-publication__browse-all">
          <Link href="/research">Browse every research guide</Link>
        </p>

        <section
          aria-labelledby="editorial-method-title"
          className="sleepyland-home__method"
          id="editorial-method"
        >
          <p className="plain-publication__eyebrow">Editorial boundary</p>
          <h2 id="editorial-method-title">{homepageMethod.heading}</h2>
          <p>{homepageMethod.detail}</p>
          <p>{homepageMethod.boundary}</p>
          <p>
            Sleepyland is <a href={repositoryUrl}>open source on GitHub</a>, and
            {" "}<a href={researchContributionUrl}>research corrections are welcome</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
