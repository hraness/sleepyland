import { notFound } from "next/navigation";
import type { ImageResponse } from "next/og";

import {
  RESEARCH_IMAGE_SIZE,
  renderResearchArticleImage,
} from "../article-image";
import { getResearchArticle } from "../articles";

export const size = RESEARCH_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = "Sleepyland Research article cover";

export default async function OpenGraphImage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<ImageResponse> {
  const { slug } = await params;
  const article = getResearchArticle(slug);

  if (article === undefined) {
    notFound();
  }

  return renderResearchArticleImage(article);
}
