"use client";

import { GlobalErrorDocument, type RouteErrorPageProps } from "@/lib/ui";
import { PostHogExceptionReporter } from "@hraness/posthog/react";
import { sleepylandPostHogSite } from "./analytics";
import "./globals.css";

export default function GlobalError(props: RouteErrorPageProps) {
  return (
    <GlobalErrorDocument
      {...props}
      darkColor="#080604"
      diagnostics={(
        <PostHogExceptionReporter
          apiHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
          apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
          error={props.error}
          origin="global_error_boundary"
          site={sleepylandPostHogSite}
        />
      )}
      theme="dark"
    />
  );
}
