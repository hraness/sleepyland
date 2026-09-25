import {
  MarketingPage,
  MarketingPillars,
  MarketingQuestionList,
  MarketingSection,
  MarketingTrustBoundary,
} from "@hraness/design-kit/react/server";
import Link from "next/link";

import { NOISE_DOCUMENT_PARAGRAPHS } from "./agent-access";
import type { StudioResource } from "./noise-studio";
import { RESEARCH_HEALTH_BOUNDARY } from "./research/editorial-disclosure";
import { applicationFeatures } from "./seo";
import { analyticsSummary, repositoryUrl, researchContributionUrl } from "./site";
import { SOUND_MODES, type SoundModeId } from "./sound-modes";

/**
 * Homepage information layer on the shared Hraness marketing grammar. Every
 * statement here already appears on the site: the in-app "How to use
 * Sleepyland" dialog, the about and privacy pages, the sound-mode registry,
 * or the shared site footer. Add a claim here only after it exists on one of
 * those surfaces. Maker attribution belongs to the organization and is owned
 * by `@hraness/site-footer`; this layer never carries a personal credit.
 */

export const HOME_INFORMATION_HEADING = "Steady sound for sleep, made in your browser.";
export const HOME_INFORMATION_LEAD =
  "Press play for deep brown noise and slow ocean waves, made on your device as you listen. Free, no account, and every guide links its sources.";

export const HOME_LISTENING_NOTE =
  "Start quietly, especially with headphones, and set the mix that feels most comfortable to you.";

/** The same descriptions as the in-app "Choose a starting sound" section. */
const SOUND_MODE_SUMMARIES = {
  sleep: "Deep brown noise with slow waves.",
  calm: "Softer pink noise with spacious waves.",
  focus: "Brighter pink noise with a subtle, steady rhythm and no waves.",
} as const satisfies Record<SoundModeId, string>;

export const HOME_PILLARS = SOUND_MODES.map((mode) => ({
  label: mode.label,
  summary: SOUND_MODE_SUMMARIES[mode.id],
}));

export const HOME_TRUST_ITEMS = [
  {
    label: "Made on your device",
    detail: "Brown, pink, or white noise and ocean waves are generated in the page as you listen.",
  },
  {
    label: "No recordings",
    detail: "The sound machine plays no audio files, and no sound is made on a server.",
  },
  {
    label: "No account",
    detail: "The sound machine is free and needs no account.",
  },
  {
    label: "Settings saved in this browser",
    detail: "Your mode, Energy, session, and Tune settings are saved in this browser.",
  },
  {
    label: "No microphone, ads, or replay",
    detail: "Sleepyland never asks for microphone access, shows no ads, and uses no session replay.",
  },
  {
    label: "Analytics",
    detail: analyticsSummary,
  },
] as const;

export const HOME_PUBLISHER_URL = "https://hraness.com";

export function HomeInformation({
  research,
}: Readonly<{ research: readonly StudioResource[] }>) {
  return (
    <MarketingPage className="sleepyland-home-information" id="information">
      <MarketingSection
        heading={HOME_INFORMATION_HEADING}
        headingId="home-information-title"
        id="about"
        label="Sleep sound machine"
        summary={HOME_INFORMATION_LEAD}
      >
        <p>{NOISE_DOCUMENT_PARAGRAPHS[2]}</p>
        <p>{HOME_LISTENING_NOTE}</p>
        <p>
          A silent <Link href="/demo">product demo</Link> shows a mode change, Tune,
          and playback.
        </p>
      </MarketingSection>

      <MarketingPillars ariaLabel="Sleep, Relax, and Focus" pillars={HOME_PILLARS} />

      <MarketingSection
        heading="Pick a mode, then shape the sound."
        headingId="home-features-title"
        id="features"
        label="Controls"
        summary="Each mode starts from its own mix. Tune changes the noise color, volumes, warmth, and movement."
      >
        <ul className="sleepyland-home-features">
          {applicationFeatures.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
      </MarketingSection>

      <MarketingTrustBoundary
        heading="Sound is made on your device, and your settings are saved there."
        headingId="home-trust-title"
        id="privacy"
        items={HOME_TRUST_ITEMS}
        label="Privacy"
        summary="The privacy page lists everything that can leave your device and which services receive it."
      />

      <MarketingSection
        heading="Research for a better sleep setup."
        headingId="home-research-title"
        id="research"
        label="Research"
        summary={`Each guide links the sources behind its answer. ${RESEARCH_HEALTH_BOUNDARY}`}
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
            Read the guides
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
                No. The sound machine is free and needs no account. Sleepyland never asks
                for microphone access, shows no ads, and uses no session replay.
              </p>
            ),
          },
          {
            question: "Does it upload anything?",
            answer: (
              <>
                <p>
                  Not sound. The sound machine plays no audio files and makes no sound on
                  a server, and your settings are saved in this browser.
                </p>
                <p>
                  {analyticsSummary} The <Link href="/privacy">privacy page</Link> lists
                  everything that can leave your device.
                </p>
              </>
            ),
          },
          {
            question: "What does it need to run?",
            answer: (
              <p>
                A browser with JavaScript and Web Audio support. The sound is generated in
                the page.
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
                Sleepyland is built by <a href={HOME_PUBLISHER_URL}>Hraness</a>. It is
                free to use, needs no account, and is{" "}
                <a href={repositoryUrl}>open source on GitHub</a> under the MIT License,
                and{" "}
                <a href={researchContributionUrl}>corrections to the guides are welcome</a>.
              </p>
            ),
          },
        ]}
      />
    </MarketingPage>
  );
}
