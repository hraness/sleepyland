import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata, Viewport } from "next";
import Link from "next/link";

import { NOISE_DOCUMENT_PARAGRAPHS, NOISE_HEADING, markdownAlternatePath } from "./agent-access";
import { NoiseStudio, type StudioResourceGroup } from "./noise-studio";
import { featuredResearchResources } from "./noise/research-resources";
import { RESEARCH_AUTHORSHIP_DISCLOSURE } from "./research/editorial-disclosure";
import { applicationFeatures, defaultSocialImage, serializeJsonLd, webApplicationJsonLd } from "./seo";
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
        <h2>What you can do</h2>
        <ul>{applicationFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <p><Link href="/research">Browse Sleepyland Research</Link></p>
      </section>
      <NoiseStudio
        brand={{ domain: site.domain, tagline: "calming sound machine" }}
        resourceGroups={studioResourceGroups}
      />
      <section aria-labelledby="home-research-title" className="sleepyland-home-research">
        <header>
          <h2 id="home-research-title">Research for a better sleep setup</h2>
          <Link href="/research">Browse all research</Link>
        </header>
        <p className="sleepyland-home-research__disclosure">
          {RESEARCH_AUTHORSHIP_DISCLOSURE}
        </p>
        <div>
          {featuredResources.map((resource) => (
            <article key={resource.path}>
              <h3><Link href={resource.path}>{resource.title}</Link></h3>
              <p>{resource.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
