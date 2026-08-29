import { PostHogAnalytics } from "@hraness/posthog/react";
import { HranessSiteFooter } from "@hraness/site-footer/react";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { sleepylandPostHogSite } from "./analytics";
import {
  defaultSocialImage,
  organizationJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "./seo";
import { RESEARCH_FEED_PATH } from "./search-discovery";
import { SleepylandThemeProvider } from "./providers";
import { site } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl),
  applicationName: site.shortName,
  category: "sleep research",
  alternates: {
    types: {
      "application/rss+xml": RESEARCH_FEED_PATH,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.shortName,
  },
  openGraph: {
    type: "website",
    siteName: site.shortName,
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        alt: defaultSocialImage.alt,
        url: defaultSocialImage.url,
      },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
    { color: "#151515", media: "(prefers-color-scheme: dark)" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-theme="light" lang="en" suppressHydrationWarning>
      <body>
        <PostHogAnalytics
          apiHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
          apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
          site={sleepylandPostHogSite}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd([
              organizationJsonLd(),
              websiteJsonLd(),
            ]),
          }}
          id="sleepyland-site-structured-data"
          type="application/ld+json"
        />
        <SleepylandThemeProvider>
          {children}
          <HranessSiteFooter />
        </SleepylandThemeProvider>
      </body>
    </html>
  );
}
