import {
  createSocialImageResponse,
  socialImageContentType,
  socialImageSize,
} from "@hraness/web-discovery/social-image";
import { noiseDescription, noiseTitle, site, socialImageAlt } from "./site";
import { SleepylandMark } from "./social-mark";

export const alt = socialImageAlt;
export const contentType = socialImageContentType;
export const size = socialImageSize;

export default function Image() {
  return createSocialImageResponse({
    description: noiseDescription,
    domain: site.domain,
    eyebrow: site.shortName,
    mark: <SleepylandMark />,
    theme: {
      accent: "#D58A3A",
      background: "#080604",
      foreground: "#F0D5B3",
      muted: "#A88D70",
    },
    title: noiseTitle,
  });
}
