import { RouteNotFoundPage } from "@/lib/ui";
import { PostHogEventReporter } from "@hraness/posthog/react";
import { NOINDEX_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { sleepylandPostHogSite } from "./analytics";
import { site } from "./site";

export const metadata: Metadata = {
  title: `not found · ${site.shortName}`,
  description: "this page does not exist.",
  robots: NOINDEX_ROBOTS,
};

export default function NotFound() {
  return (
    <>
      <PostHogEventReporter
        apiHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
        apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
        eventName="page not found"
        site={sleepylandPostHogSite}
      />
      <RouteNotFoundPage showThemeToggle={false} />
    </>
  );
}
