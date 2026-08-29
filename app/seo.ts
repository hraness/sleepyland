import { noiseDescription, noiseTitle, repositoryUrl, site } from "./site";

export const applicationFeatures = [
  "Sleep, Relax, and Focus functional soundscapes with distinct rhythm, spectrum, and movement",
  "Gentle, Balanced, and Strong Energy without hidden volume changes",
  "Brown, pink, and white noise synthesized locally in the browser",
  "Procedural ocean waves with changing swell, foam, wash, and undertow",
  "Deep airplane-like cabin sound through dark brown-noise shaping",
  "Independent noise and ocean-wave volume controls",
  "Live post-mix spectrogram and spectrum curve",
  "Interactive tap and hold filtered-noise spectrum",
  "Endless, countdown, and Focus interval sessions with smooth completion",
  "On-device sound generation and browser-local settings storage",
] as const;

export const defaultSocialImage = {
  alt: "Sleepyland noise machine with Sleep, Relax, and Focus modes",
  height: 630,
  url: "/opengraph-image",
  width: 1200,
} as const;

export function absoluteUrl(path: string): string {
  return path === "/"
    ? `${site.canonicalUrl}/`
    : new URL(path, `${site.canonicalUrl}/`).toString();
}

export function isoDateTime(date: string): string {
  return `${date}T00:00:00.000Z`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.canonicalUrl}/#organization`,
    name: site.shortName,
    url: absoluteUrl("/"),
    sameAs: [repositoryUrl],
    description: site.description,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.png"),
      width: 512,
      height: 512,
    },
  } as const;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.canonicalUrl}/#website`,
    name: site.shortName,
    url: absoluteUrl("/"),
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": `${site.canonicalUrl}/#organization` },
  } as const;
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: noiseTitle,
    url: absoluteUrl("/noise"),
    description: noiseDescription,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and Web Audio API support.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
    },
    featureList: applicationFeatures,
  } as const;
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}
