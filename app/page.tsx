import { ThemeMenuButton } from "@hraness/design-kit/react";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata, Viewport } from "next";

import { NOISE_DOCUMENT_PARAGRAPHS, NOISE_HEADING, markdownAlternatePath } from "./agent-access";
import { HomeInformation } from "./home-information";
import { NoiseStudio, type StudioResourceGroup } from "./noise-studio";
import { featuredResearchResources } from "./noise/research-resources";
import { defaultSocialImage, serializeJsonLd, webApplicationJsonLd } from "./seo";
import { noiseDescription, noiseTitle, site } from "./site";

const featuredResources = featuredResearchResources();
const studioResourceGroups = [{
  allPath: "/research",
  label: "Research",
  resources: featuredResources,
}] as const satisfies readonly StudioResourceGroup[];

export const metadata: Metadata = {
  title: noiseTitle,
  description: noiseDescription,
  robots: INDEXABLE_ROBOTS,
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": markdownAlternatePath("/"),
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: noiseTitle,
    description: noiseDescription,
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: noiseTitle,
    description: noiseDescription,
    images: [{ url: defaultSocialImage.url, alt: defaultSocialImage.alt }],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080604",
  viewportFit: "cover",
};

export default function Home() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webApplicationJsonLd("/")) }}
        id="sleepyland-application-structured-data"
        type="application/ld+json"
      />
      <section aria-hidden="true" className="sleepyland-visually-hidden">
        <h1>{NOISE_HEADING}</h1>
        {NOISE_DOCUMENT_PARAGRAPHS.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
      <NoiseStudio
        brand={{ name: site.shortName, tagline: "calming sound machine" }}
        headerActions={
          <ThemeMenuButton aria-label="Appearance" className="header-appearance" />
        }
        resourceGroups={studioResourceGroups}
      />
      <HomeInformation research={featuredResources} />
    </>
  );
}
