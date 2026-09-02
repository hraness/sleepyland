export const homepageResult = {
  boundary:
    "Educational publishing · no diagnosis or individualized treatment · open source",
  eyebrow: "Evidence-led sleep decisions",
  heading: "Sleep research, without the wellness myths.",
  summary:
    "Start with a direct answer, follow the sources, and see where the evidence stops before you change a routine or sound setup.",
} as const;

export const homepageAgentRequest =
  "curl -H 'Accept: text/markdown' https://sleepy.land/";

export const homepageMethod = {
  boundary:
    "Educational evidence synthesis, not medical advice. Persistent insomnia, breathing symptoms during sleep, severe daytime impairment, medication questions, or substance dependence deserve qualified care.",
  detail:
    "Drafted by an AI agent and checked against the linked sources by a separate Codex AI reviewer; no human clinical review is claimed. Direct findings stay separate from mechanism and inference.",
  heading: "Read the answer, then check its limit.",
} as const;
