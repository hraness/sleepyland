import { describe, expect, test } from "bun:test";

import { sleepylandMailingListConfig } from "./mailing-config";

describe("Sleepyland mailing configuration", () => {
  test("binds the stable Sleepyland audience unconditionally", () => {
    expect(sleepylandMailingListConfig()).toEqual({
      audience: "sleepyland",
      kind: "signup",
    });
  });
});
