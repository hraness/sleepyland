import type { HranessMailingListConfig } from "@hraness/site-footer";

const SLEEPYLAND_MAILING_AUDIENCE = "sleepyland";

export function sleepylandMailingListConfig(): HranessMailingListConfig {
  return {
    audience: SLEEPYLAND_MAILING_AUDIENCE,
    kind: "signup",
    name: "Sleepyland",
  };
}
