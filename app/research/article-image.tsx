import {
  createSocialImageResponse,
  socialImageSize,
} from "@hraness/web-discovery/social-image";
import type { ImageResponse } from "next/og";

import { SleepylandMark } from "../social-mark";
import type { ResearchArticle } from "./articles";
import { researchArchiveDescription, researchArchiveTitle } from "./seo";

export const RESEARCH_IMAGE_SIZE = socialImageSize;
export const RESEARCH_IMAGE_WORDMARK = "Sleepyland";

function renderResearchImage({
  description,
  title,
}: Readonly<{
  description: string;
  title: string;
}>): ImageResponse {
  return createSocialImageResponse({
    description,
    domain: "sleepy.land/research",
    eyebrow: `${RESEARCH_IMAGE_WORDMARK} Research`,
    mark: <SleepylandMark />,
    title,
  });
}

export function renderResearchArticleImage(
  article: ResearchArticle,
): ImageResponse {
  return renderResearchImage({
    description: article.evidenceLabel,
    title: article.title,
  });
}

export function renderResearchCollectionImage(): ImageResponse {
  return renderResearchImage({
    description: researchArchiveDescription,
    title: researchArchiveTitle,
  });
}
