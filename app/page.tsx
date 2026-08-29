import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { markdownAlternatePath } from "./agent-access";
import { RESEARCH_FEED_PATH } from "./search-discovery";
import { ResearchIndexPage } from "./research/research-index-page";
import { ResearchShell, researchViewport } from "./research/research-shell";
import { RESEARCH_SOCIAL_IMAGE_PATH } from "./research/seo";
import { publicationDescription, publicationTitle } from "./site";

const researchSocialImage = {
  url: RESEARCH_SOCIAL_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: "Sleepyland evidence-led sleep and insomnia research",
} as const;

export const metadata: Metadata = {
  title: publicationTitle,
  description: publicationDescription,
  robots: INDEXABLE_ROBOTS,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": RESEARCH_FEED_PATH,
      "text/markdown": markdownAlternatePath("/"),
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: publicationTitle,
    description: publicationDescription,
    images: [researchSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: publicationTitle,
    description: publicationDescription,
    images: [{ url: researchSocialImage.url, alt: researchSocialImage.alt }],
  },
};

export const viewport = researchViewport;

export default function Home() {
  return (
    <ResearchShell>
      <ResearchIndexPage />
    </ResearchShell>
  );
}
