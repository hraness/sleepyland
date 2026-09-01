"use client";

import Link from "next/link";
import { useState } from "react";

import { EditorialImageThumbnail } from "../editorial-image";
import type { EditorialImage } from "../editorial-images";
import type { ResearchSlug, ResearchTagId } from "./articles";

export interface ResearchIndexTag {
  readonly id: ResearchTagId;
  readonly label: string;
}

export interface ResearchIndexArticle {
  readonly dek: string;
  readonly evidenceLabel: string;
  readonly image: EditorialImage<"research", ResearchSlug>;
  readonly publishedAt: string;
  readonly readingMinutes: number;
  readonly slug: ResearchSlug;
  readonly sourceCount: number;
  readonly tags: readonly ResearchIndexTag[];
  readonly title: string;
}

interface ResearchIndexListProps {
  readonly articles: readonly ResearchIndexArticle[];
  readonly tagOptions: readonly ResearchIndexTag[];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00.000Z`));
}

function ResearchIndexEntry({
  article,
}: Readonly<{ article: ResearchIndexArticle }>) {
  return (
    <article className="plain-publication__entry">
      <Link
        aria-label={`Read ${article.title}`}
        className="plain-publication__entry-image"
        href={`/research/${article.slug}`}
        tabIndex={-1}
      >
        <EditorialImageThumbnail
          image={article.image}
          sizes="(max-width: 42rem) 7rem, 10rem"
        />
      </Link>
      <div className="plain-publication__entry-copy">
        <h3>
          <Link href={`/research/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.dek}</p>
        <p className="plain-publication__entry-evidence">
          <span>{article.evidenceLabel}</span>
          <span aria-hidden="true"> · </span>
          <span>{article.sourceCount} linked sources</span>
        </p>
        <div className="plain-publication__entry-meta">
          <span className="plain-publication__entry-details">
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <span aria-hidden="true"> · </span>
            <span>{article.readingMinutes} min read</span>
          </span>
          <ul aria-label="Topics" className="plain-publication__entry-tags">
            {article.tags.map((tag) => (
              <li key={tag.id}>{tag.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function ResearchIndexList({
  articles,
  tagOptions,
}: ResearchIndexListProps) {
  const [selectedTag, setSelectedTag] = useState<ResearchTagId | "all">("all");
  const visibleArticles = selectedTag === "all"
    ? articles
    : articles.filter((article) =>
        article.tags.some((tag) => tag.id === selectedTag));

  return (
    <section aria-labelledby="research-guides" className="plain-publication__list">
      <div className="plain-publication__section-heading">
        <h2 id="research-guides">Research library</h2>
        <p aria-atomic="true" aria-live="polite">
          {visibleArticles.length} {visibleArticles.length === 1 ? "article" : "articles"}
        </p>
      </div>

      <div
        aria-label="Filter articles by topic"
        className="plain-publication__filters"
        role="group"
      >
        <button
          aria-pressed={selectedTag === "all"}
          onClick={() => setSelectedTag("all")}
          type="button"
        >
          All
        </button>
        {tagOptions.map((tag) => (
          <button
            aria-pressed={selectedTag === tag.id}
            key={tag.id}
            onClick={() => setSelectedTag(tag.id)}
            type="button"
          >
            {tag.label}
          </button>
        ))}
      </div>

      <div className="plain-publication__article-list">
        {visibleArticles.map((article) => (
          <ResearchIndexEntry article={article} key={article.slug} />
        ))}
      </div>
    </section>
  );
}
