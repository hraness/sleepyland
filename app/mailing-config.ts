import type { HranessMailingListConfig } from "@hraness/site-footer";

export const SLEEPYLAND_MAILING_TURNSTILE_SITEKEY_ENV =
  "NEXT_PUBLIC_HRANESS_MAILING_TURNSTILE_SITEKEY" as const;

const turnstileSitekeyPattern = /^[A-Za-z0-9_-]{20,100}$/u;

export function sleepylandMailingListConfig(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): HranessMailingListConfig {
  const turnstileSitekey =
    environment[SLEEPYLAND_MAILING_TURNSTILE_SITEKEY_ENV];
  if (
    turnstileSitekey === undefined
    || !turnstileSitekeyPattern.test(turnstileSitekey)
  ) {
    throw new Error(
      `${SLEEPYLAND_MAILING_TURNSTILE_SITEKEY_ENV} must be a valid public Turnstile site key.`,
    );
  }

  return {
    audience: "sleepyland",
    kind: "signup",
    turnstileSitekey,
  };
}
