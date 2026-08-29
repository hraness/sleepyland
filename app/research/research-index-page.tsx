import Link from "next/link";

import { SleepylandAskAiAboutThis } from "../ask-ai-about-this";
import { researchEditorialImage } from "../editorial-images";
import { serializeJsonLd } from "../seo";
import { repositoryUrl, researchContributionUrl } from "../site";
import {
  RESEARCH_TAGS,
  articleReadingMinutes,
  researchArticlesNewestFirst,
  researchTagLabel,
} from "./articles";
import { ResearchIndexList } from "./research-index-list";
import { breadcrumbJsonLd, researchCollectionJsonLd } from "./seo";

const researchIndexArticles = researchArticlesNewestFirst.map((article) => ({
  dek: article.dek,
  image: researchEditorialImage(article.slug),
  publishedAt: article.publishedAt,
  readingMinutes: articleReadingMinutes(article),
  slug: article.slug,
  tags: article.tags.map((id) => ({ id, label: researchTagLabel(id) })),
  title: article.title,
}));

export function ResearchIndexPage() {
  return (
    <main className="plain-publication__index" id="research-content">
      <script
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            researchCollectionJsonLd(),
            breadcrumbJsonLd([{ name: "Sleepyland Research", path: "/" }]),
          ]),
        }}
        id="research-collection-structured-data"
        type="application/ld+json"
      />

      <div className="plain-publication__shell plain-publication__index-content">
        <header className="plain-publication__hero">
          <p className="plain-publication__eyebrow">Reviewed August 2026</p>
          <h1>Sleep research, without the wellness myths.</h1>
          <p>
            Practical, evidence-led guides for people trying to sleep better.
            We examine sound, light, supplements, medications, routines, and
            persistent sleep claims with primary research, direct answers, and
            explicit limits.
          </p>
          <Link className="plain-publication__primary-link" href="/noise">
            Open the calming sound machine <span aria-hidden="true">→</span>
          </Link>
        </header>

        <ResearchIndexList
          articles={researchIndexArticles}
          tagOptions={RESEARCH_TAGS}
        />

        <section
          aria-labelledby="editorial-method-title"
          className="plain-publication__method"
          id="editorial-method"
        >
          <h2 id="editorial-method-title">Editorial method</h2>
          <div className="plain-publication__method-copy">
            <p>
              Sleepyland Research is the editorial desk behind the Sleepyland
              sound generator. It does not impersonate a clinician or claim
              medical review that did not happen.
            </p>
            <p>
              We prioritize systematic reviews, controlled human studies,
              public-health guidance, and primary sources. Crowdsourced reports
              can reveal questions and lived patterns, but they remain anecdotes.
              Every material claim links to its source, inference is labeled as
              inference, and software-assisted synthesis is checked against the
              linked source before publication.
            </p>
            <p>
              Sleepyland is <a href={repositoryUrl}>open source on GitHub</a>
              {" "}under the MIT License. Research corrections, stronger sources,
              reproducible analyses, and carefully scoped article proposals are
              <a href={researchContributionUrl}> welcome</a>.
            </p>
          </div>
          <p className="plain-publication__disclosure">
            This publication is educational, not medical advice. Persistent
            insomnia, loud snoring, gasping, hearing changes, or disabling
            daytime sleepiness deserves qualified care.
          </p>
          <SleepylandAskAiAboutThis path="/" />
        </section>
      </div>
    </main>
  );
}
