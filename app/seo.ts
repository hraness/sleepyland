import { noiseDescription, noiseTitle, repositoryUrl, site, socialImageAlt } from "./site";

export const applicationFeatures = [
  "Sleep, Relax, and Focus modes, each a different starting mix",
  "Gentle, Balanced, and Strong Energy levels that change how the sound moves without changing its overall volume",
  "Brown, pink, and white noise generated in your browser",
  "Ocean waves generated with changing swell, foam, wash, and undertow",
  "A low airplane-like rumble shaped from dark brown noise",
  "Separate volume controls for noise and waves",
  "A live spectrogram of the sound you hear",
  "Tap the spectrum to play a pulse, or hold and move to explore pitches",
  "Sessions that play until you stop, end after 15 to 90 minutes, or run Focus work and break blocks",
  "Sound made on your device, with settings saved in this browser",
] as const;

export const defaultSocialImage = {
  alt: socialImageAlt,
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

export function webApplicationJsonLd(path: "/" | "/noise" = "/noise") {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: noiseTitle,
    url: absoluteUrl(path),
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
