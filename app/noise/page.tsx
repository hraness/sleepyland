import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata, Viewport } from "next";

import { markdownAlternatePath } from "../agent-access";
import {
  NoiseStudio,
  type StudioResourceGroup,
} from "../noise-studio";
import {
  defaultSocialImage,
  serializeJsonLd,
  webApplicationJsonLd,
} from "../seo";
import { noiseDescription, noiseTagline, noiseTitle, site } from "../site";
import { featuredResearchResources } from "./research-resources";

const studioResourceGroups = [
  {
    allPath: "/research",
    label: "Research",
    resources: featuredResearchResources(),
  },
] as const satisfies readonly StudioResourceGroup[];

export const metadata: Metadata = {
  title: noiseTitle,
  description: noiseDescription,
  alternates: {
    canonical: "/noise",
    types: { "text/markdown": markdownAlternatePath("/noise") },
  },
  openGraph: {
    type: "website",
    url: "/noise",
    siteName: site.shortName,
    title: noiseTitle,
    description: noiseDescription,
    images: [defaultSocialImage],
  },
  robots: INDEXABLE_ROBOTS,
  twitter: {
    card: "summary_large_image",
    title: noiseTitle,
    description: noiseDescription,
    images: [{ alt: defaultSocialImage.alt, url: defaultSocialImage.url }],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#12100f",
  viewportFit: "cover",
};

export default function NoisePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webApplicationJsonLd()) }}
        id="sleepyland-application-structured-data"
        type="application/ld+json"
      />
      <NoiseStudio
        brand={{ name: site.shortName, tagline: noiseTagline }}
        resourceGroups={studioResourceGroups}
      />
    </>
  );
}
