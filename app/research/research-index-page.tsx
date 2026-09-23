import { researchEditorialImage } from "../editorial-images";
import { serializeJsonLd } from "../seo";
import {
  RESEARCH_TAGS,
  articleReadingMinutes,
  discoverableResearchArticles,
  researchArticlesNewestFirst,
  researchTagLabel,
} from "./articles";
import { ResearchIndexList } from "./research-index-list";
import { breadcrumbJsonLd, researchCollectionJsonLd } from "./seo";
import { RESEARCH_HEALTH_BOUNDARY } from "./editorial-disclosure";

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

const discoverableTagIds = new Set(
  researchIndexArticles.flatMap((article) => article.tags.map((tag) => tag.id)),
);

export const researchIndexTagOptions = RESEARCH_TAGS.filter((tag) =>
  discoverableTagIds.has(tag.id));

export function ResearchIndexPage() {
  const archiveArticles = discoverableResearchArticles(researchArticlesNewestFirst);

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
          <p>Guides to sleep, sound, and light. Each one starts with a short answer and links its sources. Guides on medications, supplement safety, and other higher-risk topics are not listed here until a clinician or pharmacist reviews them.</p>
          <p>{RESEARCH_HEALTH_BOUNDARY}</p>
        </header>
        <ResearchIndexList
          articles={researchIndexArticles}
          tagOptions={researchIndexTagOptions}
        />
      </div>
    </main>
  );
}
