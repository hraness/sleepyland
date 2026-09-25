export const publicationDescription =
  "Sleepyland is a free sound machine that makes brown, pink, or white noise and ocean waves in your browser, with sourced guides to sleep.";
export const homepageUpdatedAt = "2026-09-25";
export const noiseTagline = "Steady sound for sleep, made in your browser";
export const noiseTitle = `Sleepyland | ${noiseTagline}`;
export const noiseDescription = publicationDescription;
export const siteIntroduction =
  "Sleepyland is a free sound machine that runs in your browser. Press play and it makes brown, pink, or white noise and ocean surf on your device as you listen, with no recordings to download and no account to create. Start from Sleep, Relax, or Focus, then tune the noise color, warmth, volumes, and the time between waves. Beside the sound machine, Sleepyland publishes short guides to sleep, sound, and light that link every source. It is open source under the MIT License and built by Hraness.";
/**
 * The one reader-facing summary of product analytics. The privacy page lists
 * every event in full; other surfaces use this sentence.
 */
export const analyticsSummary =
  "On sleepy.land, anonymous analytics without cookies can include the mode you pick and the kind of session you play. They don’t include Energy, Tune settings, exact listening time, or audio.";
export const socialImageAlt =
  `The Sleepyland mark and the title “${noiseTagline}” on a dark card`;
export const repositoryUrl = "https://github.com/hraness/sleepyland";
export const researchContributionUrl =
  `${repositoryUrl}/issues/new?template=research_correction.yml`;

export const site = {
  description: publicationDescription,
  domain: "sleepy.land",
  emoji: "💤",
  introduction: siteIntroduction,
  shortName: "Sleepyland",
  tagline: noiseTagline,
  title: noiseTitle,
  canonicalUrl: "https://sleepy.land",
  updatedAt: "2026-09-25",
} as const;
