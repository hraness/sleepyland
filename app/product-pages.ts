import { repositoryUrl, researchContributionUrl } from "./site";

export type ProductPageInline =
  | string
  | Readonly<{
      href: string;
      text: string;
    }>;

export type ProductPageSection = Readonly<{
  heading: string;
  paragraphs?: readonly (readonly ProductPageInline[])[];
  items?: readonly (readonly ProductPageInline[])[];
}>;

export type ProductPageDefinition = Readonly<{
  description: string;
  heading: string;
  intro: readonly ProductPageInline[];
  path: `/${string}`;
  sections: readonly ProductPageSection[];
  slug: ProductPageSlug;
  title: string;
  updatedAt: string;
}>;

export const PRODUCT_PAGE_UPDATED_AT = "2026-08-30";
export const SUPPORT_EMAIL = "ben@substrate.run";
export const LAUNCH_DEMO_PATH = "/sleepyland-mode-tune-play.mp4";
export const LAUNCH_DEMO_SHA256 =
  "71d03d6414d37c0a9b2c523d7ebc933e63fd3b8e535574da10e934465122092d";

export const PRODUCT_PAGE_SLUGS = [
  "about",
  "privacy",
  "support",
  "accessibility",
  "license",
  "demo",
] as const;

export type ProductPageSlug = (typeof PRODUCT_PAGE_SLUGS)[number];

function link(text: string, href: string): Readonly<{ href: string; text: string }> {
  return { href, text };
}

export const PRODUCT_PAGES = [
  {
    slug: "about",
    path: "/about",
    heading: "What Sleepyland is",
    title: "What Sleepyland is | Sleepyland",
    description:
      "Sleepyland is an open-source sleep publication and browser sound machine that synthesizes noise and procedural waves locally on this device.",
    updatedAt: PRODUCT_PAGE_UPDATED_AT,
    intro: [
      "Sleepyland is a free browser sound machine. It synthesizes brown, pink, or white noise, procedural ocean waves, and an airplane-like rumble in the page. The generator uses no recorded or hosted audio files, product accounts, or server-side audio.",
    ],
    sections: [
      {
        heading: "What you can do",
        items: [
          ["Choose Sleep, Relax, or Focus. Each state is a distinct engine recipe with its own rhythm, spectrum, and movement."],
          ["Use Gentle, Balanced, or Strong Energy. Energy scales movement depth and pace without changing volume."],
          ["Open Tune for noise color, shared warmth, independent noise and wave levels, and wave pace."],
          ["Run Endless, Countdown, or Focus Interval sessions."],
          ["Watch the live post-mix spectrogram and spectrum curve, including an interactive tap-and-hold filtered-noise spectrum."],
        ],
        paragraphs: [
          [
            "Settings stay in this browser. Selected mode and session kind can also appear as categorical fields in bounded anonymous production analytics. Read the ",
            link("privacy page", "/privacy"),
            " for what can leave the device.",
          ],
        ],
      },
      {
        heading: "What Sleepyland is not",
        paragraphs: [
          [
            "Sleepyland is not a medical device, diagnosis, or treatment. The names Sleep, Relax, and Focus describe intended listening contexts, not guaranteed outcomes. ",
            link("Sleepyland Research", "/"),
            " publishes sourced guides and states that the publication is educational, not medical advice. ",
            link("Support", "/support"),
            " does not provide medical advice, hearing-safety certification, or crisis services.",
          ],
          [
            "It is also not a supplement calculator. A ",
            link(
              "Hraness reading note on creatine and cognition",
              "https://hraness.com/reading/does-creatine-make-you-smarter",
            ),
            " records that the cognitive-enhancement case is weak: later trials and reviews point, at most, to a small uncertain mental benefit, and large effects in healthy adults are unlikely. Sleepyland does not recommend, dose, or track creatine or any other supplement. It generates sound in the browser.",
          ],
        ],
      },
      {
        heading: "Who publishes it",
        paragraphs: [
          [
            link("Hraness", "https://hraness.com"),
            " lists sleepy.land among its public projects. The hosted product is free to use without an account. Sleepyland is ",
            link("open source on GitHub", repositoryUrl),
            " under the MIT License, and ",
            link("research contributions are welcome", researchContributionUrl),
            ". The ",
            link("license page", "/license"),
            " records the exact reuse terms and third-party boundaries.",
          ],
          [
            "A silent ",
            link("product demo", "/demo"),
            " shows mode selection, Tune, playback, and the live spectrum. The ",
            link("interactive sound machine", "/noise"),
            " is the product itself.",
          ],
          [
            "A separate ",
            link("reading note", "/reading/good-ideas"),
            " discusses rest as a practiced state that keeps unfashionable ideas alive, starting from Henrik and Johanna Karlsson’s essay on how new ideas are born. Another ",
            link("reading take on habit and rest", "/reading/habit-and-rest"),
            " starts from William James: a rest environment is not a habit until the first small act starts. A later ",
            link(
              "reading take on rest as a place where anxiety can become curiosity",
              "/reading/anger-anxiety-agency",
            ),
            " starts from Armin Ronacher. A later ",
            link(
              "reading take on rest as practiced attention to language",
              "/reading/weird-is-a-weird-word",
            ),
            " starts from Colin Gorrie’s essay on English weird.",
          ],
        ],
      },
    ],
  },
  {
    slug: "privacy",
    path: "/privacy",
    heading: "Privacy",
    title: "Privacy | Sleepyland",
    description:
      "What Sleepyland keeps on this device, what analytics and support messages can leave it, and where retention and deletion remain provider-controlled.",
    updatedAt: PRODUCT_PAGE_UPDATED_AT,
    intro: [
      "Sleepyland does not require a product account and does not upload audio. Sound is generated in your browser. Its settings are stored in browser local storage; selected mode and session kind can also appear as categorical fields in the anonymous product events listed below. Those product and reliability events can leave the device on the canonical production site. An optional newsletter subscription is a separate Hraness Accounts record.",
    ],
    sections: [
      {
        heading: "Data that stays in your browser",
        paragraphs: [
          [
            "Sleepyland stores the selected mode, Energy, session plan, noise color, warmth, noise level, wave level, and wave pace in browser local storage. Playback state and an in-progress countdown or interval are not persisted.",
          ],
          [
            "Brown, pink, and white noise, procedural waves, and spectrum gestures are generated on the device. Sleepyland does not request microphone access, upload the sound mix, or send tuning values, exact playback duration, or spectrum positions to analytics.",
          ],
        ],
      },
      {
        heading: "Requests that leave the device",
        paragraphs: [
          [
            "Vercel serves the site and its static assets. Standard HTTPS requests can expose network information such as an IP address, browser headers, and the requested path to the hosting provider.",
          ],
          [
            "On sleepy.land and www.sleepy.land in production, PostHog can receive cookieless page views and page leaves, the LCP, CLS, FCP, and INP web-vital measurements, selected mode, playback start and stop, completed session kind, and bounded redacted browser or server failures. Canonical route and coarse referral classifications accompany those events. Query strings are removed.",
          ],
          [
            "The analytics client uses memory-only persistence, creates no person profile, respects Do Not Track, and disables session replay, autocapture, heatmaps, surveys, feature flags, product tours, and conversations. It does not run on Preview deployments, localhost, or unregistered hosts.",
          ],
          [
            "If you email Sleepyland support, your sender address, message, attachments, and ordinary email transport metadata leave the site and are processed by the sender’s and maintainer’s email services. Do not send medical or other sensitive information.",
          ],
          [
            "If you use the footer newsletter form, your email address, the Sleepyland audience identifier, the form source, and a short-lived Cloudflare Turnstile proof are sent to Hraness Accounts at account.hraness.com. Cloudflare verifies the anti-abuse proof. Hraness Accounts records the pending request and Resend sends a confirmation message from news.hraness.com. You are not subscribed until you confirm that message.",
          ],
        ],
      },
      {
        heading: "Processor and transport boundary",
        paragraphs: [
          [
            "Vercel is the hosting provider. PostHog is the analytics and error processor. Cloudflare verifies newsletter anti-abuse challenges. Hraness Accounts stores newsletter consent state, and Resend delivers confirmation and newsletter email. The production application sends allowed analytics events over HTTPS to the configured PostHog ingestion host. The application contains no advertising integration or product-data sale path.",
          ],
          [
            "Cookieless analytics still requires a network request. The receiving providers can process normal transport metadata even though Sleepyland does not create a product account or a persistent PostHog person profile. A newsletter record is separate from Sleepyland product use and records consent for the Sleepyland audience only.",
          ],
        ],
      },
      {
        heading: "Retention and deletion",
        paragraphs: [
          [
            "Local settings remain until you replace them or clear sleepy.land site data in your browser. Clearing that site data removes the settings stored by Sleepyland on that device.",
          ],
          [
            "The application source does not set a fixed PostHog retention period. Retention and project-level deletion are controlled in the configured PostHog project. Because Sleepyland has no account or persistent person profile, an anonymous event may not be safely isolatable as one person’s record. Contact ",
            link("Sleepyland support", "/support"),
            " with an approximate time, route, and event if you want the maintainer to assess a deletion request. Do not send medical or other sensitive information.",
          ],
          [
            "No fixed provider-retention promise is made on this page. A channel or assessor that requires one needs a separate review of the live PostHog project and provider terms.",
          ],
          [
            "Support email has a separate retention and deletion boundary controlled by the email services and maintainer mailbox. The application does not set that retention period. You can ask support to delete a message, but this page does not promise deletion from provider backups or infrastructure that has not been independently verified.",
          ],
          [
            "Every Sleepyland newsletter message includes a product-specific unsubscribe link. Using it ends the Sleepyland subscription without unsubscribing the same address from other Hraness products. Hraness Accounts retains the dated consent and unsubscribe history needed to enforce that choice and avoid resubscribing the address without a new confirmation.",
          ],
        ],
      },
    ],
  },
  {
    slug: "support",
    path: "/support",
    heading: "Support",
    title: "Support | Sleepyland",
    description:
      "Contact Sleepyland support, report a browser-audio problem, or request help with privacy and accessibility barriers.",
    updatedAt: PRODUCT_PAGE_UPDATED_AT,
    intro: [
      "Sleepyland is a free browser product without a required product account or billing. Its optional newsletter is separate from product use. Contact the maintainer at ",
      link(SUPPORT_EMAIL, `mailto:${SUPPORT_EMAIL}?subject=Sleepyland%20support`),
      ".",
    ],
    sections: [
      {
        heading: "Report a product problem",
        items: [
          ["Name the browser and version, operating system, and page URL."],
          ["Describe the action you took and the exact visible error message."],
          ["Say whether other browser audio works and whether the Play control changes to Stop."],
          ["For an accessibility barrier, name the control, input method, and assistive technology involved."],
        ],
        paragraphs: [
          [
            "Do not send passwords, private browsing history, recordings, medical information, or other sensitive data. A screenshot is useful only when it contains no private material.",
          ],
        ],
      },
      {
        heading: "Try these checks first",
        items: [
          ["Start playback from the Play control. Browsers require a direct user action before audio can begin."],
          ["Check the browser tab, operating-system output, and device volume."],
          ["Reload the page. If a saved setting appears corrupt, clear sleepy.land site data and choose the mode again."],
        ],
      },
      {
        heading: "Privacy, contributions, and reuse",
        paragraphs: [
          [
            "Read the ",
            link("privacy page", "/privacy"),
            " before requesting analytics deletion, and include only an approximate time, route, and event. Open a ",
            link("GitHub issue", repositoryUrl + "/issues"),
            " for a public product or research contribution that contains no sensitive information. Read the ",
            link("license and reuse posture", "/license"),
            " for the project terms.",
          ],
        ],
      },
      {
        heading: "Health boundary",
        paragraphs: [
          [
            "Sleepyland support does not provide medical advice, diagnosis, treatment, hearing-safety certification, or crisis services. The names Sleep, Relax, and Focus describe intended listening contexts, not guaranteed outcomes. If you may be in immediate danger, contact local emergency services.",
          ],
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    path: "/accessibility",
    heading: "Accessibility evidence",
    title: "Accessibility evidence | Sleepyland",
    description:
      "The accessibility behavior Sleepyland currently tests, the contact path for barriers, and the assessment claims it does not make.",
    updatedAt: PRODUCT_PAGE_UPDATED_AT,
    intro: [
      "This page records behavior that the repository and browser interface currently verify. It is not a third-party audit, a WCAG conformance claim, or an NYC 988 accessibility assessment.",
    ],
    sections: [
      {
        heading: "Current checked behavior",
        items: [
          ["Play, mode, session, Tune, segmented choices, and range controls expose semantic names, roles, values, and selected states."],
          ["The spectrogram is a named keyboard-reachable control with a keyboard pulse path as well as pointer input."],
          ["Playback completion uses a polite live status, and audio failures use an alert."],
          ["Compact product controls have a 44-pixel minimum target, with larger link targets on coarse-pointer devices."],
          ["Visible focus styling, forced-color boundaries, and light and dark text contrast are checked in source tests."],
          ["Reduced-motion preference slows spectrogram history updates and removes nonessential interface transitions."],
          ["Narrow portrait and short landscape layouts reflow the control deck without hiding the primary controls."],
        ],
      },
      {
        heading: "Known evidence boundary",
        paragraphs: [
          [
            "The repository uses unit, server-render, CSS-contract, and browser design-surface checks. It does not yet contain an independent screen-reader matrix, third-party accessibility report, formal WCAG conformance evaluation, or NYC 988 assessment. Sleepyland must not claim those reviews have occurred.",
          ],
        ],
      },
      {
        heading: "Report a barrier",
        paragraphs: [
          [
            "Contact ",
            link("Sleepyland support", "/support"),
            " with the page, control, input method, browser, and assistive technology involved. Do not include medical or other sensitive information.",
          ],
        ],
      },
    ],
  },
  {
    slug: "license",
    path: "/license",
    heading: "License and reuse posture",
    title: "License and reuse posture | Sleepyland",
    description:
      "Sleepyland is open source on GitHub under the MIT License, with research contributions welcome and third-party sources kept under their own terms.",
    updatedAt: PRODUCT_PAGE_UPDATED_AT,
    intro: [
      "Sleepyland is free to use at sleepy.land, and its source repository is public. The project’s source code and repository-authored documentation are available under the MIT License.",
    ],
    sections: [
      {
        heading: "MIT-licensed project",
        items: [
          ["People can use the hosted browser application without payment or a product account."],
          ["The public repository includes the MIT License and package metadata identifies MIT as the project license."],
          ["The MIT License permits use, copying, modification, distribution, sublicensing, and sale subject to its copyright and permission-notice condition."],
          ["Contributions accepted into the repository are distributed under the same MIT License."],
        ],
        paragraphs: [
          [
            "Read the license text and source at ",
            link("github.com/hraness/sleepyland", repositoryUrl),
            ". This page summarizes the project posture but does not replace the license text or provide legal advice.",
          ],
        ],
      },
      {
        heading: "Research and third-party material",
        paragraphs: [
          [
            "Sleepyland’s article code and repository-authored documentation are part of the MIT-licensed project. Linked papers, quotations, journal figures, product names, study instruments, and other third-party materials remain under their respective rights and terms. A citation does not relicense its source.",
          ],
          [
            "Research corrections, source additions, reproducible analyses, and carefully scoped article proposals are ",
            link("welcome on GitHub", researchContributionUrl),
            ". Contributions must follow the public editorial method and may not provide individualized medical advice, dosing instructions, or guaranteed health outcomes.",
          ],
        ],
      },
    ],
  },
  {
    slug: "demo",
    path: "/demo",
    heading: "Product demo",
    title: "Product demo | Sleepyland",
    description:
      "A silent 7.5-second Sleepyland walkthrough showing mode selection, Tune controls, playback, and the live spectrum.",
    updatedAt: PRODUCT_PAGE_UPDATED_AT,
    intro: [
      "This silent 7.5-second walkthrough starts in Sleep, selects Relax, opens Tune, and starts playback so the final post-mix spectrum becomes visible.",
    ],
    sections: [
      {
        heading: "What the demo shows",
        items: [
          ["Sleep, Relax, and Focus remain the three primary modes."],
          ["Tune reveals Energy, noise color, independent noise and wave levels, warmth, and wave interval."],
          ["Starting playback changes the persistent Play control to Stop and activates the post-mix spectrum."],
        ],
        paragraphs: [
          [
            "The video contains no audio, voice, captions, user data, health claim, or outcome claim. It was captured from the checked browser product at 1280 by 720 and encoded as H.264 without an audio track.",
          ],
          [
            link("Open the MP4 asset", LAUNCH_DEMO_PATH),
            " or ",
            link("try the interactive sound machine", "/noise"),
            ".",
          ],
        ],
      },
    ],
  },
] as const satisfies readonly ProductPageDefinition[];

export function getProductPage(slug: string): ProductPageDefinition | undefined {
  return PRODUCT_PAGES.find((page) => page.slug === slug);
}

export function isProductPagePath(pathname: string): boolean {
  return PRODUCT_PAGES.some((page) => page.path === pathname);
}
