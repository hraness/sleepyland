export const homepageResult = {
  boundary:
    "Educational publishing · no diagnosis or individualized treatment · open source",
  eyebrow: "Evidence-led sleep decisions",
  heading: "Sleep research, without the wellness myths.",
  summary:
    "Start with a direct answer, follow the sources, and see where the evidence stops before you change a routine, buy a supplement, or start a sound.",
} as const;

export const homepageAgentRequest =
  "curl -H 'Accept: text/markdown' https://sleepy.land/";

export const homepageMethod = {
  boundary:
    "Educational evidence synthesis, not medical advice. Persistent insomnia, breathing symptoms during sleep, severe daytime impairment, medication questions, or substance dependence deserve qualified care.",
  detail:
    "Material claims link to the evidence that supports their exact wording. Direct findings stay separate from mechanism and inference, and software-assisted synthesis is checked against the linked source before publication.",
  heading: "Read the answer, then check its limit.",
} as const;
