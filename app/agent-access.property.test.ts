import { describe, expect, test } from "bun:test";
import * as fc from "fast-check";

import {
  parseAccept,
  preferredProducedType,
  type AcceptEntry,
} from "./agent-access";

function serializeAccept(entries: readonly AcceptEntry[]): string {
  return entries.map((entry) => {
    const quality = entry.q === 1 ? "" : `;q=${entry.q}`;
    return `${entry.type}${quality}`;
  }).join(", ");
}

describe("Accept negotiation properties", () => {
  test("round-trips type, quality, and client order", () => {
    fc.assert(fc.property(
      fc.array(
        fc.record({
          type: fc.constantFrom(
            "text/html",
            "text/markdown",
            "text/*",
            "*/*",
            "application/pdf",
          ),
          q: fc.constantFrom(0, 0.1, 0.5, 0.8, 1),
        }),
        { minLength: 1, maxLength: 5 },
      ),
      (candidates) => {
        const header = serializeAccept(candidates.map((candidate, position) => ({
          position,
          q: candidate.q,
          specificity: 0,
          type: candidate.type,
        })));
        const parsed = parseAccept(header);

        expect(parsed.map((entry) => entry.type)).toEqual(
          candidates.map((candidate) => candidate.type),
        );
        expect(parsed.map((entry) => entry.q)).toEqual(
          candidates.map((candidate) => candidate.q),
        );
        expect(parsed.map((entry) => entry.position)).toEqual(
          candidates.map((_, position) => position),
        );
      },
    ));
  });

  test("never returns a q=0 type when another produced type remains", () => {
    fc.assert(fc.property(
      fc.constantFrom("text/html", "text/markdown"),
      fc.constantFrom(0.1, 0.5, 1),
      (accepted, quality) => {
        const rejected = accepted === "text/html" ? "text/markdown" : "text/html";
        expect(preferredProducedType(
          `${rejected};q=0, ${accepted};q=${quality}`,
        )).toBe(accepted);
      },
    ));
  });

  test("prefers the higher quality produced type", () => {
    fc.assert(fc.property(
      fc.double({ min: 0.1, max: 0.8, noNaN: true }),
      (lower) => {
        const higher = Math.min(1, lower + 0.15);
        expect(preferredProducedType(
          `text/html;q=${lower}, text/markdown;q=${higher}`,
        )).toBe("text/markdown");
        expect(preferredProducedType(
          `text/markdown;q=${lower}, text/html;q=${higher}`,
        )).toBe("text/html");
      },
    ));
  });
});
