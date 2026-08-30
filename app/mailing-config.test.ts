import { describe, expect, test } from "bun:test";

import {
  SLEEPYLAND_MAILING_TURNSTILE_SITEKEY_ENV,
  sleepylandMailingListConfig,
} from "./mailing-config";

describe("Sleepyland mailing configuration", () => {
  test("binds the public widget key to the Sleepyland audience", () => {
    const turnstileSitekey = "1x00000000000000000000AA";
    expect(sleepylandMailingListConfig({
      [SLEEPYLAND_MAILING_TURNSTILE_SITEKEY_ENV]: turnstileSitekey,
    })).toEqual({
      audience: "sleepyland",
      kind: "signup",
      turnstileSitekey,
    });
  });

  test("fails closed on missing or malformed public widget keys", () => {
    for (const turnstileSitekey of [
      undefined,
      "too-short",
      "1x00000000000000000000AA!",
    ]) {
      expect(() => sleepylandMailingListConfig({
        [SLEEPYLAND_MAILING_TURNSTILE_SITEKEY_ENV]: turnstileSitekey,
      })).toThrow(SLEEPYLAND_MAILING_TURNSTILE_SITEKEY_ENV);
    }
  });
});
