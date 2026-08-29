import { DesignSystemGallery } from "@/lib/ui";
import { NOINDEX_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { defaultSocialImage } from "../seo";
import { site } from "../site";

const title = "Design system";
const description =
  "Sleepyland's living browser design-system specification and responsive component stress lab.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/design",
  },
  openGraph: {
    type: "website",
    url: "/design",
    siteName: site.shortName,
    title,
    description,
    images: [
      {
        ...defaultSocialImage,
        alt: title,
      },
    ],
  },
  robots: NOINDEX_ROBOTS,
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        alt: title,
        url: defaultSocialImage.url,
      },
    ],
  },
};

export default function DesignPage() {
  return <DesignSystemGallery />;
}
