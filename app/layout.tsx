import { getDesignPaletteTheme } from "@hraness/design-kit";
import { PostHogAnalytics } from "@hraness/posthog/react";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { sleepylandPostHogSite } from "./analytics";
import { sleepylandMailingListConfig } from "./mailing-config";
import {
  defaultSocialImage,
  organizationJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "./seo";
import { RESEARCH_FEED_PATH } from "./search-discovery";
import { SleepylandThemeProvider } from "./providers";
import { site } from "./site";
import { SleepylandSiteFooter } from "./site-footer";

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
    { color: "#f8f7f4", media: "(prefers-color-scheme: light)" },
    { color: "#12100f", media: "(prefers-color-scheme: dark)" },
  ],
  viewportFit: "cover",
};

/**
 * Paper is the default palette; the initial class supplies its compiled
 * values and the blocking bootstrap adds a concrete `data-theme` before
 * paint. With JavaScript disabled no `data-theme` is rendered, so the
 * Paper theme's light-dark() colors keep following the OS appearance.
 */
const initialPalette = getDesignPaletteTheme("paper", "light");

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className={initialPalette.className}
      data-hraness-material="lantern"
      data-hraness-theme="paper"
      data-palette="paper"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* The blocking external bootstrap applies a saved palette before first paint. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-bootstrap.js" />
      </head>
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
          <SleepylandSiteFooter mailingList={sleepylandMailingListConfig()} />
        </SleepylandThemeProvider>
      </body>
    </html>
  );
}
