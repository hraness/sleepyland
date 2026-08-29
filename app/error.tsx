"use client";

import { RouteErrorPage, type RouteErrorPageProps } from "@/lib/ui";
import { PostHogExceptionReporter } from "@hraness/posthog/react";

import { sleepylandPostHogSite } from "./analytics";

export default function RouteError(props: RouteErrorPageProps) {
  return (
    <>
      <PostHogExceptionReporter
        apiHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
        apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
        error={props.error}
        site={sleepylandPostHogSite}
      />
      <RouteErrorPage {...props} showThemeToggle={false} />
    </>
  );
}
