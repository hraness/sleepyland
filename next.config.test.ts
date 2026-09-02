import { describe, expect, test } from "bun:test";

import nextConfig from "./next.config";

describe("site migration redirects", () => {
  test("permanently redirects predecessor and www hosts to the canonical domain", async () => {
    if (nextConfig.redirects === undefined) {
      throw new Error("Next.js redirects are not configured.");
    }

    const redirects = await nextConfig.redirects();
    expect(redirects.map((redirect) => ({
      destination: redirect.destination,
      host: redirect.has?.find((condition) => condition.type === "host")?.value,
      permanent: redirect.permanent,
      source: redirect.source,
    }))).toEqual([
      {
        destination: "https://sleepy.land/:path*",
        host: "rgnrte.com",
        permanent: true,
        source: "/:path*",
      },
      {
        destination: "https://sleepy.land/:path*",
        host: "www.rgnrte.com",
        permanent: true,
        source: "/:path*",
      },
      {
        destination: "https://sleepy.land/:path*",
        host: "rgnrte.vercel.app",
        permanent: true,
        source: "/:path*",
      },
      {
        destination: "https://sleepy.land/:path*",
        host: "www.sleepy.land",
        permanent: true,
        source: "/:path*",
      },
    ]);
  });

  test("does not redirect retired editorial routes to unrelated pages", async () => {
    if (nextConfig.redirects === undefined) {
      throw new Error("Next.js redirects are not configured.");
    }

    const redirects = await nextConfig.redirects();
    expect(redirects.some(({ source }) => source.startsWith("/reading"))).toBe(false);
    expect(redirects.some(({ source }) =>
      source === "/research/blue-light-scatter-and-visual-detail"
    )).toBe(false);
  });
});
