import type { MetadataRoute } from "next";

import { AI_CRAWLER_USER_AGENTS } from "./agent-access";
import { site } from "./site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: `${site.canonicalUrl}/sitemap.xml`,
    host: site.canonicalUrl,
  };
}
