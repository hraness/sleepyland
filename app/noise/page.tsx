import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata, Viewport } from "next";
import Link from "next/link";

import {
  NOISE_DOCUMENT_PARAGRAPHS,
  NOISE_HEADING,
  markdownAlternatePath,
} from "../agent-access";
import {
  NoiseStudio,
  type StudioResourceGroup,
} from "../noise-studio";
import {
  applicationFeatures,
  defaultSocialImage,
  serializeJsonLd,
  webApplicationJsonLd,
} from "../seo";
import { noiseDescription, noiseTitle, site } from "../site";
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
  themeColor: "#080604",
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
      <section aria-hidden="true" className="sleepyland-visually-hidden">
        <h1>{NOISE_HEADING}</h1>
        {NOISE_DOCUMENT_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <h2>What you can do</h2>
        <ul>
          {applicationFeatures.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <p><Link href="/">Read Sleepyland Research</Link></p>
      </section>
      <NoiseStudio
        brand={{ domain: site.domain, tagline: "calming sound machine" }}
        resourceGroups={studioResourceGroups}
      />
    </>
  );
}
