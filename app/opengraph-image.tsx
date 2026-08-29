import {
  createSocialImageResponse,
  socialImageContentType,
  socialImageSize,
} from "@hraness/web-discovery/social-image";
import { site } from "./site";

export const alt =
  "Sleepyland noise machine for sleep, calm, and focus";
export const contentType = socialImageContentType;
export const size = socialImageSize;

export default function Image() {
  return createSocialImageResponse({
    description:
      "Generated soundscapes built from colored noise, procedural ocean waves, rhythmic movement, and live spectral shaping.",
    domain: "sleepy.land",
    eyebrow: "Sleepyland",
    mark: site.emoji,
    theme: {
      accent: "#D58A3A",
      background: "#080604",
      foreground: "#F0D5B3",
      muted: "#A88D70",
    },
    title: "Sound for sleep, calm, and focus",
  });
}
