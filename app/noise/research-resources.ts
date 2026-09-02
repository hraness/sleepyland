import { researchEditorialImage } from "../editorial-images";
import type { StudioResourceGroup } from "../noise-studio";
import {
  getResearchArticle,
  isIndexableResearchArticle,
  researchArticlePath,
  type ResearchSlug,
} from "../research/articles";

const FEATURED_RESEARCH_SLUGS = [
  "best-sleep-sounds",
  "morning-sunlight-and-sleep",
  "why-you-sleep-badly-in-hotels",
] as const satisfies readonly ResearchSlug[];

export function featuredResearchResources(
  slugs: readonly ResearchSlug[] = FEATURED_RESEARCH_SLUGS,
): StudioResourceGroup["resources"] {
  return slugs.flatMap((slug) => {
    const article = getResearchArticle(slug);
    if (article === undefined || !isIndexableResearchArticle(article)) return [];

    return [{
      description: article.dek,
      image: researchEditorialImage(slug),
      path: researchArticlePath(slug),
      title: article.title,
    }];
  });
}
