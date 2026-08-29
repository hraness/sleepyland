import { createPostHogRequestErrorReporter } from "@hraness/posthog/server";

import { sleepylandPostHogSite } from "./app/analytics";

export const onRequestError = createPostHogRequestErrorReporter({
  apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  site: sleepylandPostHogSite,
});
