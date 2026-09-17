import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { site } from "../site";
import { ResearchIndexPage } from "./research-index-page";

const researchArchiveTitle = "All sleep research guides | Sleepyland";
const researchArchiveDescription =
  "Browse Sleepyland's admitted evidence-led guides to sleep, sound, light, routines, and environmental wellness claims.";

export const metadata: Metadata = {
  title: researchArchiveTitle,
  description: researchArchiveDescription,
  robots: INDEXABLE_ROBOTS,
  alternates: { canonical: "/research" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/research",
    siteName: site.shortName,
    title: researchArchiveTitle,
    description: researchArchiveDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: researchArchiveTitle,
    description: researchArchiveDescription,
  },
};

export default function ResearchArchivePage() {
  return <ResearchIndexPage showAll />;
}
