import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { ResearchIndexPage } from "./research-index-page";

export const metadata: Metadata = {
  title: "All sleep research guides | Sleepyland",
  description:
    "Browse Sleepyland's admitted evidence-led guides to sleep, sound, light, routines, and environmental wellness claims.",
  robots: INDEXABLE_ROBOTS,
  alternates: { canonical: "/research" },
};

export default function ResearchArchivePage() {
  return <ResearchIndexPage showAll />;
}
