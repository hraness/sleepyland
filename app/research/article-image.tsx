import {
  createSocialImageResponse,
  socialImageSize,
} from "@hraness/web-discovery/social-image";
import type { ImageResponse } from "next/og";

import type { ResearchArticle } from "./articles";

export const RESEARCH_IMAGE_SIZE = socialImageSize;
export const RESEARCH_IMAGE_WORDMARK = "Sleepyland";

function renderResearchImage({
  evidenceLabel,
  title,
}: Readonly<{
  evidenceLabel: string;
  title: string;
}>): ImageResponse {
  return createSocialImageResponse({
    description: evidenceLabel,
    domain: "sleepy.land/research",
    eyebrow: `${RESEARCH_IMAGE_WORDMARK} Research`,
    title,
  });
}

export function renderResearchArticleImage(
  article: ResearchArticle,
): ImageResponse {
  return renderResearchImage({
    evidenceLabel: article.evidenceLabel,
    title: article.title,
  });
}

export function renderResearchCollectionImage(): ImageResponse {
  return renderResearchImage({
    evidenceLabel: "Evidence, mechanisms, practical decisions, and limits",
    title: "Sound research, without the wellness myths.",
  });
}
