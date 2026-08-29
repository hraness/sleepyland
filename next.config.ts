import type { NextConfig } from "next";

import { withPostHogSourceMaps } from "@hraness/posthog/next-config";
import { withProductionDeliveryProof } from "@hraness/vercel-delivery";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        destination: "https://sleepy.land/:path*",
        has: [{ type: "host", value: "rgnrte.com" }],
        permanent: true,
        source: "/:path*",
      },
      {
        destination: "https://sleepy.land/:path*",
        has: [{ type: "host", value: "www.rgnrte.com" }],
        permanent: true,
        source: "/:path*",
      },
      {
        destination: "https://sleepy.land/:path*",
        has: [{ type: "host", value: "rgnrte.vercel.app" }],
        permanent: true,
        source: "/:path*",
      },
      {
        destination: "https://sleepy.land/:path*",
        has: [{ type: "host", value: "www.sleepy.land" }],
        permanent: true,
        source: "/:path*",
      },
      {
        destination: "/",
        permanent: true,
        source: "/research",
      },
    ];
  },
  webpack(config) {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js"],
    };
    return config;
  },
};

export default withProductionDeliveryProof(
  withPostHogSourceMaps(nextConfig, { siteId: "sleepyland" }),
  { projectName: "sleepyland" },
);
