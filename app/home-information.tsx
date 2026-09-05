import {
  MarketingMaker,
  MarketingPage,
  MarketingPillars,
  MarketingQuestionList,
  MarketingSection,
  MarketingTrustBoundary,
} from "@hraness/design-kit/react/server";
import Link from "next/link";

import { NOISE_DOCUMENT_PARAGRAPHS } from "./agent-access";
import type { StudioResource } from "./noise-studio";
import { RESEARCH_AUTHORSHIP_DISCLOSURE } from "./research/editorial-disclosure";
import { applicationFeatures } from "./seo";
import { repositoryUrl, researchContributionUrl } from "./site";
import { SOUND_MODES, type SoundModeId } from "./sound-modes";

/**
 * Homepage information layer on the shared Hraness marketing grammar. Every
 * statement here already appears on the site: the studio explanation, the
 * about and privacy pages, the research disclosure, or the sound-mode
 * registry. Add a claim here only after it exists on one of those surfaces.
 */

export const HOME_INFORMATION_HEADING = "A sound machine that runs in your browser";
export const HOME_INFORMATION_LEAD =
  "Brown, pink, and white noise with ocean waves and cabin rumble, all synthesized on your device. No audio files, no account, no uploaded mix.";

export const HOME_LISTENING_NOTE =
  "Start quietly, especially with headphones, and set the mix that feels most comfortable to you.";

const SOUND_MODE_SUMMARIES = {
  sleep: "a dark brown bed with slow surf.",
  calm: "a softer pink field with broad spatial movement.",
  focus: "a clearer pink field with steady, low-salience rhythmic movement, and no surf.",
} as const satisfies Record<SoundModeId, string>;

export const HOME_PILLARS = SOUND_MODES.map((mode) => ({
  label: mode.label,
  summary: `${mode.detail}: ${SOUND_MODE_SUMMARIES[mode.id]}`,
}));

export const HOME_TRUST_ITEMS = [
  {
    label: "On-device synthesis",
    detail:
      "Sleepyland synthesizes brown, pink, or white noise, procedural ocean waves, and an airplane-like rumble in the page.",
  },
  {
    label: "No audio files",
    detail:
      "The sound generator uses no recorded or hosted audio files, product accounts, or server-side audio.",
  },
  {
    label: "No account",
    detail: "The hosted product is free to use without an account.",
  },
  {
    label: "Settings stay in this browser",
    detail: "Your state, Energy, session, and tuning are stored in this browser.",
  },
  {
    label: "No microphone or replay",
    detail:
      "There are no accounts, ads, session replay, cloud audio, or microphone permissions.",
  },
  {
    label: "Analytics",
    detail:
      "On the canonical production site, anonymous, cookieless events can include the selected state and session kind; they do not include Energy, tuning, exact playback duration, or audio.",
  },
] as const;

export const HOME_MAKER_BIO =
  "Ben Guo is a musician and builder. He was a founder and an engineering leader at companies including Venmo and Stripe, and he now builds from Puerto Rico.";
export const HOME_MAKER_PUBLISHER =
  "Sleepyland is published by Hraness and is open source on GitHub under the MIT License.";

export const HOME_MAKER_LINKS = [
  { href: "https://hraness.com", label: "hraness.com" },
  { href: "https://x.com/hraness", label: "@hraness on X" },
  { href: repositoryUrl, label: "Source on GitHub" },
] as const;

export function HomeInformation({
  research,
}: Readonly<{ research: readonly StudioResource[] }>) {
  return (
    <MarketingPage className="sleepyland-home-information" id="information">
      <MarketingSection
        heading={HOME_INFORMATION_HEADING}
        headingId="home-information-title"
        id="about"
        label="Sleepyland"
        summary={HOME_INFORMATION_LEAD}
      >
        <p>{NOISE_DOCUMENT_PARAGRAPHS[2]}</p>
        <p>{HOME_LISTENING_NOTE}</p>
        <p>
          A silent <Link href="/demo">product demo</Link> shows mode selection, Tune,
          playback, and the live spectrum.
        </p>
      </MarketingSection>

      <MarketingPillars ariaLabel="Sleep, Relax, and Focus" pillars={HOME_PILLARS} />

      <MarketingSection
        heading="What you can do."
        headingId="home-features-title"
        id="features"
        label="Controls"
        summary="Each state is a distinct engine recipe with its own rhythm, spectrum, and movement."
      >
        <ul className="sleepyland-home-features">
          {applicationFeatures.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
      </MarketingSection>

      <MarketingTrustBoundary
        heading="Sound is made on your device, and your settings stay there."
        headingId="home-trust-title"
        id="privacy"
        items={HOME_TRUST_ITEMS}
        label="Privacy"
        summary="The privacy page describes what can leave the device and where retention and deletion remain provider-controlled."
      />

      <MarketingSection
        heading="Research for a better sleep setup."
        headingId="home-research-title"
        id="research"
        label="Research"
        summary={RESEARCH_AUTHORSHIP_DISCLOSURE}
      >
        <ul className="sleepyland-home-research">
          {research.map((resource) => (
            <li className="sleepyland-home-research__card" key={resource.path}>
              <h3><Link href={resource.path}>{resource.title}</Link></h3>
              <p>{resource.description}</p>
            </li>
          ))}
        </ul>
        <p className="sleepyland-home-research__actions">
          <Link className="hraness-marketing-action" data-emphasis="secondary" href="/research">
            Browse all research
          </Link>
        </p>
      </MarketingSection>

      <MarketingQuestionList
        heading="Questions about accounts, uploads, and limits."
        headingId="home-questions-title"
        id="questions"
        label="Questions"
        questions={[
          {
            question: "Does it need an account?",
            answer: (
              <p>
                No. The hosted product is free to use without an account. There are no
                accounts, ads, session replay, cloud audio, or microphone permissions.
              </p>
            ),
          },
          {
            question: "Does it upload anything?",
            answer: (
              <>
                <p>
                  Not sound. The sound generator uses no recorded or hosted audio files,
                  product accounts, or server-side audio, and settings are stored on this
                  device.
                </p>
                <p>
                  On the canonical production site, anonymous, cookieless events can
                  include the selected state and session kind; they do not include Energy,
                  tuning, exact playback duration, or audio. The{" "}
                  <Link href="/privacy">privacy page</Link> lists what can leave the
                  device.
                </p>
              </>
            ),
          },
          {
            question: "What does it need to run?",
            answer: (
              <p>
                A browser with JavaScript and Web Audio API support. Sound is generated in
                the page; there is no server-side audio.
              </p>
            ),
          },
          {
            question: "Is it a medical device?",
            answer: (
              <>
                <p>
                  No. Sleepyland is not a medical device, diagnosis, or treatment. The
                  names Sleep, Relax, and Focus describe intended listening contexts, not
                  guaranteed outcomes.
                </p>
                <p>{HOME_LISTENING_NOTE}</p>
              </>
            ),
          },
          {
            question: "Who made it?",
            answer: (
              <p>
                Ben Guo, publishing as <a href="https://hraness.com">Hraness</a>, which
                lists sleepy.land among its public projects. Sleepyland is{" "}
                <a href={repositoryUrl}>open source on GitHub</a> under the MIT License,
                and <a href={researchContributionUrl}>research contributions are welcome</a>.
              </p>
            ),
          },
        ]}
      />

      <MarketingMaker
        heading="Built by Ben Guo."
        headingId="home-maker-title"
        id="maker"
        label="Maker"
        links={HOME_MAKER_LINKS}
      >
        <p>{HOME_MAKER_BIO}</p>
        <p>{HOME_MAKER_PUBLISHER}</p>
      </MarketingMaker>
    </MarketingPage>
  );
}
