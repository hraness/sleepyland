export const homepageResult = {
  boundary:
    "Educational publishing · no diagnosis or individualized treatment · open source",
  eyebrow: "Evidence-led sleep decisions",
  heading: "Sleep research, without the wellness myths.",
  summary:
    "Start with a direct answer, follow the sources, and see where the evidence stops before you change a routine, buy a supplement, or start a sound.",
} as const;

export const homepageWorkingModel = [
  {
    detail:
      "Each guide owns one practical decision instead of stretching a keyword into several thin pages.",
    label: "Name the question",
  },
  {
    detail:
      "Material claims sit beside the studies, guidelines, labels, and public-health sources that support them.",
    label: "Follow the evidence",
  },
  {
    detail:
      "Population, protocol, uncertainty, and the line between evidence and inference stay visible in the answer.",
    label: "Keep the limit",
  },
] as const;

export const homepageInterfaces = [
  {
    label: "For a reader",
    summary:
      "Open a guide for the short answer, evidence label, decision tables, linked sources, revision date, and practical limits.",
  },
  {
    label: "For an agent",
    summary:
      "Request the same canonical page as Markdown, or use the Markdown sitemap and llms.txt to find the right record.",
  },
] as const;

export const homepageAgentRequest =
  "curl -H 'Accept: text/markdown' https://sleepy.land/";

export const homepageBoundaryItems = [
  {
    detail:
      "Sleepyland distinguishes direct findings, mechanism, inference, and experience. It does not claim clinician review that did not happen.",
    label: "Evidence",
  },
  {
    detail:
      "Software can help collect and synthesize material, but a published claim is checked against the source linked beside it.",
    label: "Review",
  },
  {
    detail:
      "The publication is educational. It does not diagnose, prescribe, give individualized dosing, or promise an outcome.",
    label: "Health",
  },
  {
    detail:
      "The sound machine generates audio in the browser, stores settings on the device, and needs no microphone, uploaded mix, or product account.",
    label: "Sound",
  },
] as const;

export const homepageQuestions = [
  {
    answer:
      "No. Sleepyland explains published evidence and its limits. Persistent insomnia, breathing symptoms during sleep, severe daytime impairment, medication questions, or substance dependence deserves qualified care.",
    question: "Is Sleepyland medical advice?",
  },
  {
    answer:
      "Software can help organize and compare sources. Before publication, material wording is checked against the linked source, and inference stays labeled as inference.",
    question: "How is software-assisted research checked?",
  },
  {
    answer:
      "No audio is uploaded or generated on a server. The browser creates the sound locally. Settings remain on the device, while bounded anonymous analytics can include only categorical mode and session kind on the canonical production site.",
    question: "Does the sound machine send audio or settings to a server?",
  },
  {
    answer:
      "Open a research-correction issue with the page, disputed wording, and a stronger source. The article registry updates the visible guide, metadata, feed, sitemap, and Markdown record together.",
    question: "How do I challenge a claim?",
  },
] as const;
