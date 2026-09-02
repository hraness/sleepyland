import {
  MarketingCallToAction,
  MarketingFlow,
  MarketingInterfaceGrid,
  MarketingQuestionList,
  MarketingSection,
  MarketingTrustBoundary,
} from "@hraness/design-kit/react/server";
import Link from "next/link";

import { EditorialImageFigure } from "../editorial-image";
import { researchEditorialImage } from "../editorial-images";
import {
  homepageAgentRequest,
  homepageBoundaryItems,
  homepageInterfaces,
  homepageQuestions,
  homepageResult,
  homepageWorkingModel,
} from "../homepage-content";
import { RESEARCH_FEED_PATH } from "../search-discovery";
import { serializeJsonLd } from "../seo";
import { repositoryUrl, researchContributionUrl } from "../site";
import {
  RESEARCH_TAGS,
  articleReadingMinutes,
  getResearchArticle,
  homepageResearchArticles,
  isIndexableResearchArticle,
  researchArticlePath,
  researchArticlesNewestFirst,
  researchTagLabel,
} from "./articles";
import { ResearchIndexList } from "./research-index-list";
import { breadcrumbJsonLd, researchCollectionJsonLd } from "./seo";

export const researchIndexArticles = researchArticlesNewestFirst.map((article) => ({
  dek: article.dek,
  evidenceLabel: article.evidenceLabel,
  image: researchEditorialImage(article.slug),
  publishedAt: article.publishedAt,
  readingMinutes: articleReadingMinutes(article),
  slug: article.slug,
  sourceCount: article.sourceIds.length,
  tags: article.tags.map((id) => ({ id, label: researchTagLabel(id) })),
  title: article.title,
}));

export function ResearchIndexPage({
  showAll = false,
}: Readonly<{ showAll?: boolean }>) {
  const featuredArticle = getResearchArticle("noise-and-sleep-2026");

  if (featuredArticle === undefined) {
    throw new Error("Sleepyland Research requires at least one published guide.");
  }

  const featuredPath = researchArticlePath(featuredArticle.slug);
  const featuredImage = researchEditorialImage(featuredArticle.slug);
  const homepageArticles = homepageResearchArticles();
  const archiveArticles = researchArticlesNewestFirst.filter(isIndexableResearchArticle);
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
            <p>Browse accepted, evidence-led guides by topic. Medication comparisons awaiting clinical review stay out of this archive.</p>
          </header>
          <ResearchIndexList articles={visibleIndexArticles} tagOptions={RESEARCH_TAGS} />
        </div>
      </main>
    );
  }

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
                <dt>Receipts</dt>
                <dd>{featuredArticle.sourceIds.length} linked sources</dd>
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

        <MarketingSection
          className="sleepyland-home__model"
          heading="Question, evidence, boundary"
          headingId="working-model-title"
          id="working-model"
          label="Working model"
        >
          <p>
            A useful sleep guide should make the decision easier without making
            the evidence sound more certain than it is.
          </p>
          <MarketingFlow
            ariaLabel="How a Sleepyland guide works"
            steps={homepageWorkingModel}
          />
        </MarketingSection>

        <MarketingInterfaceGrid
          className="sleepyland-home__interfaces"
          heading="One publication, two readable surfaces"
          headingId="interfaces-title"
          id="interfaces"
          interfaces={[
            {
              ...homepageInterfaces[0],
              example: (
                <p className="sleepyland-home__interface-links">
                  <Link href={featuredPath}>Read the featured guide</Link>
                </p>
              ),
            },
            {
              ...homepageInterfaces[1],
              example: (
                <>
                  <pre className="sleepyland-home__agent-request"><code>{homepageAgentRequest}</code></pre>
                  <p className="sleepyland-home__interface-links">
                    <Link href="/sitemap.md">Markdown sitemap</Link>
                    {" · "}<Link href="/llms.txt">llms.txt</Link>
                    {" · "}<Link href={RESEARCH_FEED_PATH}>RSS</Link>
                  </p>
                </>
              ),
            },
          ]}
          label="Interfaces"
          summary="The human page and Markdown representation resolve to the same canonical guide, title, sources, revision date, and limits."
        />

        <ResearchIndexList
          articles={visibleIndexArticles.filter((article) => article.slug !== featuredArticle.slug)}
          tagOptions={RESEARCH_TAGS}
        />
        <p className="plain-publication__browse-all">
          <Link href="/research">Browse every research guide</Link>
        </p>

        <MarketingSection
          className="sleepyland-home__method"
          heading="Claims keep their receipts"
          headingId="editorial-method-title"
          id="editorial-method"
          label="Editorial method"
        >
          <p>
            Sleepyland prioritizes systematic reviews, controlled human studies,
            public-health guidance, official labels, and primary sources. A
            crowdsourced report can reveal a useful question, but it remains an
            anecdote.
          </p>
          <p>
            Every material claim links to its source. Inference stays labeled,
            and software-assisted synthesis is checked against the linked source
            before publication. Sleepyland is <a href={repositoryUrl}>open source
            on GitHub</a> under the MIT License, and <a href={researchContributionUrl}>
            research corrections are welcome</a>.
          </p>
        </MarketingSection>

        <MarketingTrustBoundary
          className="sleepyland-home__boundary"
          heading="Know what the page can and cannot do"
          headingId="boundary-title"
          id="boundaries"
          items={homepageBoundaryItems}
          label="Boundary"
          summary="The limits are part of the answer, not a disclaimer added after it."
        />

        <MarketingQuestionList
          className="sleepyland-home__questions"
          heading="Questions worth answering before you rely on it"
          headingId="questions-title"
          id="questions"
          label="Questions"
          questions={homepageQuestions.map((item) => ({
            answer: <p>{item.answer}</p>,
            question: item.question,
          }))}
        />

        <MarketingCallToAction
          actions={[
            { href: "#research-guides", label: "Choose a guide" },
            { href: "/noise", label: "Open the sound machine" },
          ]}
          className="sleepyland-home__action"
          eyebrow="Smallest useful action"
          heading="Start with the question keeping you awake."
          headingId="action-title"
          id="start"
          summary="Choose one guide for the evidence, or open the private browser sound machine if a steady sound is the immediate job."
        />
      </div>
    </main>
  );
}
