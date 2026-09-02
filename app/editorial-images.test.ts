import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

import {
  EDITORIAL_IMAGE_HEIGHT,
  EDITORIAL_IMAGE_WIDTH,
  RESEARCH_EDITORIAL_IMAGES,
  editorialImages,
} from "./editorial-images";
import {
  discoverableResearchArticles,
  RESEARCH_SLUGS,
  researchArticles,
} from "./research/articles";

function lossyWebpDimensions(bytes: Uint8Array): Readonly<{
  height: number;
  width: number;
}> {
  const ascii = (offset: number, length: number) =>
    new TextDecoder().decode(bytes.subarray(offset, offset + length));

  expect(ascii(0, 4)).toBe("RIFF");
  expect(ascii(8, 4)).toBe("WEBP");

  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const kind = ascii(offset, 4);
    const size = bytes[offset + 4]
      | (bytes[offset + 5] << 8)
      | (bytes[offset + 6] << 16)
      | (bytes[offset + 7] << 24);
    const data = offset + 8;

    if (kind === "VP8 ") {
      expect([...bytes.subarray(data + 3, data + 6)]).toEqual([0x9d, 0x01, 0x2a]);
      return {
        width: (bytes[data + 6] | (bytes[data + 7] << 8)) & 0x3fff,
        height: (bytes[data + 8] | (bytes[data + 9] << 8)) & 0x3fff,
      };
    }

    offset = data + size + (size % 2);
  }

  throw new Error("Expected a decoded lossy WebP frame.");
}

describe("Sleepyland editorial image registry", () => {
  test("keeps registered research images unique without making them an admission quota", () => {
    expect(Object.keys(RESEARCH_EDITORIAL_IMAGES)).toEqual(
      editorialImages.map((image) => image.slug),
    );
    for (const image of editorialImages) {
      expect(RESEARCH_SLUGS).toContain(image.slug);
    }
    expect(new Set(editorialImages.map((image) => image.src)).size).toBe(
      editorialImages.length,
    );
    expect(new Set(editorialImages.map((image) => image.sha256)).size).toBe(
      editorialImages.length,
    );

    const discoverableSlugs = new Set(
      discoverableResearchArticles(researchArticles).map(
        (article) => article.slug,
      ),
    );
    for (const image of editorialImages) {
      expect(discoverableSlugs.has(image.slug)).toBe(true);
    }
  });

  test("ships no public research images outside the admitted registry", async () => {
    const publicImageDirectory = new URL(
      "../public/editorial/research/",
      import.meta.url,
    );
    const publicImageFiles = (await readdir(publicImageDirectory)).toSorted();
    const registeredImageFiles = editorialImages
      .map((image) => image.src.slice(image.src.lastIndexOf("/") + 1))
      .toSorted();

    expect(publicImageFiles).toEqual(registeredImageFiles);
  });

  test("pins compact, exact 1536 by 864 WebP assets to their content hashes", async () => {
    for (const image of editorialImages) {
      const file = Bun.file(new URL(`../public${image.src}`, import.meta.url));
      const bytes = new Uint8Array(await file.arrayBuffer());
      const hasher = new Bun.CryptoHasher("sha256");
      hasher.update(bytes);

      expect(file.type).toBe("image/webp");
      expect(file.size).toBeLessThan(400_000);
      expect(lossyWebpDimensions(bytes)).toEqual({
        height: EDITORIAL_IMAGE_HEIGHT,
        width: EDITORIAL_IMAGE_WIDTH,
      });
      expect(hasher.digest("hex")).toBe(image.sha256);
      expect(image.alt.trim()).not.toBe("");
      expect(image.caption.trim()).not.toBe("");
      expect(image.credit).toContain("Atet");
    }
  });
});
