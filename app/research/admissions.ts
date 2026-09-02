import type { ResearchSlug, ResearchSourceId } from "./articles";

type AdmissionScore = 0 | 1 | 2;

export interface ResearchAdmission {
  readonly claimRisk: string;
  readonly contribution: string;
  readonly decision: "keep" | "keep-after-consolidation";
  readonly evidenceAnchor: Readonly<{
    fit: string;
    sourceId: ResearchSourceId;
  }>;
  readonly nearestSlugs: readonly [ResearchSlug, ResearchSlug, ResearchSlug];
  readonly owner: "Sleepyland maintainers";
  readonly evidenceType: "evidence synthesis";
  readonly humanReview: "not documented";
  readonly lifecycle: "active" | "keep-after-consolidation";
  readonly readerJob: string;
  readonly reassessOn: string;
  readonly sourceCheckedOn: string;
  readonly scores: Readonly<{
    factualConfidence: AdmissionScore;
    maintenanceValue: AdmissionScore;
    originalEvidence: AdmissionScore;
    readerUtility: AdmissionScore;
    sleepylandFit: AdmissionScore;
    voiceIntegrity: AdmissionScore;
  }>;
  readonly separation: string;
}

type ResearchAdmissionRegistry = Readonly<
  Partial<{ [Slug in ResearchSlug]: ResearchAdmission }>
>;

/**
 * The executable publication gate. Every entry is an authored editorial
 * judgment, not data derived from article length, source count, keywords,
 * images, or publication date.
 */
const RESEARCH_ADMISSION_DECISIONS = {
  "screens-blue-light-glasses-and-sleep": {
    claimRisk:
      "Product transmission data and circadian mechanisms must not become a universal treatment or a claim that one consumer lens improves sleep.",
    contribution:
      "Splits screen exposure into light, arousal, and displaced time, then connects measured filter transmission to a low-cost experiment that changes all three routes.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "blueGlassesMeta2025",
      fit:
        "The objective-outcomes meta-analysis supports the conclusion that filtering blue light has not shown a reliable sleep benefit; device and transmission studies answer narrower mechanism and product questions.",
    },
    nearestSlugs: [
      "morning-sunlight-and-sleep",
      "how-to-quiet-a-racing-mind-at-night",
      "why-you-sleep-badly-in-hotels",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Choose between a screen-free wind-down and blue-blocking glasses by understanding which part of evening screen use each intervention changes.",
    reassessOn: "2026-10-27",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 1,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 1,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns evening screens and filter claims. Morning sunlight owns phase-advancing daytime light, racing mind owns cognitive arousal, and the hotel guide owns unfamiliar-room sleep disruption.",
  },
  "how-to-quiet-a-racing-mind-at-night": {
    claimRisk:
      "Behavioral suggestions must remain educational, avoid diagnosing anxiety or insomnia, and distinguish small writing studies from the stronger CBT-I framework.",
    contribution:
      "Turns worry, task recall, clock monitoring, and sleep effort into a bounded shutdown sequence while labeling which steps are evidence-backed and which are practical extensions.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "cbtiGuideline2021",
      fit:
        "The clinical guideline anchors stimulus control and CBT-I boundaries; smaller writing and worry studies support only the specific offloading steps they measured.",
    },
    nearestSlugs: [
      "screens-blue-light-glasses-and-sleep",
      "why-you-sleep-badly-in-hotels",
      "is-eight-hours-of-sleep-necessary",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Reduce bedtime rumination with a short sequence that externalizes open loops and lowers sleep effort without promising an off switch.",
    reassessOn: "2026-10-27",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 1,
      readerUtility: 2,
      sleepylandFit: 1,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns cognitive and behavioral bedtime actions. The screen guide owns evening device exposure, the hotel guide owns first-night vigilance, and duration guidance owns sleep opportunity rather than thought content.",
  },
  "best-sleep-sounds": {
    claimRisk:
      "The comparison must not rank a universal winner or turn subjective comfort and adjacent relaxation evidence into a sleep-efficacy claim.",
    contribution:
      "Provides a problem-first choice table across silence, reduction, steady masking, music, and nature sound instead of ranking audio labels as competing treatments.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "noiseAidReview2020",
      fit:
        "The systematic review supports the mixed-evidence boundary for continuous noise; music, natural-sound, and environmental-noise sources support their own rows rather than one pooled verdict.",
    },
    nearestSlugs: [
      "how-to-use-white-noise-for-sleep",
      "how-sound-masking-works",
      "sound-masking-vs-earplugs-vs-noise-cancelling",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Choose a class of sleep sound—or no sound—based on the actual disturbance and desired job rather than a universal best-sound list.",
    reassessOn: "2026-10-13",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns cross-category selection. White-noise setup owns placement and level, masking mechanics owns auditory explanation, and the intervention comparison owns adding versus reducing sound.",
  },
  "what-frequency-helps-you-sleep": {
    claimRisk:
      "Frequency labels can invite neural-entrainment and therapeutic claims; the page must keep audible pitch, modulation, EEG rhythm, and noise spectrum categorically separate.",
    contribution:
      "Defines five incompatible meanings of hertz, audits category errors, and gives a track-evaluation procedure; it also absorbs the former binaural-beats page's distinct trial evidence.",
    decision: "keep-after-consolidation",
    evidenceAnchor: {
      sourceId: "binauralReview2026",
      fit:
        "The systematic review anchors the uncertain binaural-sleep conclusion, while neuroscience and acoustic sources establish why neighboring frequency concepts cannot inherit that evidence.",
    },
    nearestSlugs: [
      "white-pink-brown-noise-for-sleep",
      "best-sleep-sounds",
      "how-sound-masking-works",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Determine what a sleep-audio frequency label measures and evaluate the evidence without treating a shared number as a prescription.",
    reassessOn: "2026-10-13",
    scores: {
      factualConfidence: 1,
      maintenanceValue: 1,
      originalEvidence: 1,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns frequency-category errors and binaural claims. Noise colors owns spectral slopes, best sounds owns class selection, and masking mechanics owns audibility rather than brainwave entrainment.",
  },
  "how-sound-masking-works": {
    claimRisk:
      "Acoustic mechanism must not be described as cancellation, hearing protection, or proof that masking improves sleep in every room.",
    contribution:
      "Connects auditory-filter theory, spectral overlap, level, and temporal contrast to a practical diagnostic table while preserving the difference between audibility and sleep outcome.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "maskingReview2021",
      fit:
        "The masking review supports the auditory-filter and signal-to-noise explanation; sleep trials are used only to bound translation from audibility to sleep outcomes.",
    },
    nearestSlugs: [
      "sound-masking-vs-earplugs-vs-noise-cancelling",
      "white-pink-brown-noise-for-sleep",
      "best-sleep-sounds",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Understand when added sound can make an interruption less audible, which variables matter, and when masking cannot solve the room problem.",
    reassessOn: "2026-10-13",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This is the mechanism owner. The intervention comparison chooses between operations, the color guide explains spectra, and best sounds chooses among broad sound classes.",
  },
  "noise-and-sleep-2026": {
    claimRisk:
      "A dated evidence update must not imply that three heterogeneous studies settle white-noise efficacy or that subjective and sleep-stage outcomes are interchangeable.",
    contribution:
      "Audits the populations, signals, comparators, and outcomes of three 2026 studies side by side, explaining how benefit, null, and harm signals can coexist.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "basner2026",
      fit:
        "The controlled laboratory comparison anchors the REM and earplug findings; the older-adult trial and traffic-noise pilot remain separate evidence rows rather than pooled proof.",
    },
    nearestSlugs: [
      "how-to-use-white-noise-for-sleep",
      "white-pink-brown-noise-for-sleep",
      "how-sound-masking-works",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Understand why recent white- and pink-noise studies disagree and what those differences mean before using continuous sound for sleep.",
    reassessOn: "2026-10-06",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 1,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns the dated three-study evidence audit. Setup owns use parameters, colors owns spectral definitions, and masking owns the underlying auditory mechanism.",
  },
  "sound-for-focus-noise-music-silence": {
    claimRisk:
      "Attention effects depend on task, speech content, preference, and conflicts; employer-funded modulation research cannot justify an ADHD or cognitive-enhancement claim.",
    contribution:
      "Separates masking competing speech from supporting repetitive work and gives a same-task comparison that measures output as well as preference.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "focusNoiseMeta2024",
      fit:
        "The meta-analysis anchors the absence of a universal noise benefit; speech, music, and modulation studies answer narrower task-specific questions.",
    },
    nearestSlugs: [
      "best-sleep-sounds",
      "how-sound-masking-works",
      "white-pink-brown-noise-for-sleep",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Choose silence, masking noise, or music for a specific work task without treating one sound as a general attention enhancer.",
    reassessOn: "2026-10-13",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns waking task performance. Best sleep sounds owns bedtime class selection, masking explains audibility, and noise colors explains spectra rather than cognition.",
  },
  "how-to-use-white-noise-for-sleep": {
    claimRisk:
      "No universal decibel, distance, or slider setting is established; hearing-safety guidance must remain contextual and not become a medical dosage.",
    contribution:
      "Replaces false universal settings with a pillow-position measurement, source-first setup sequence, spectrum choice, timer decision, and reversible seven-night comparison.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "basner2026",
      fit:
        "The controlled exposure study shows why level and protocol matter; metering and safe-listening sources support measurement limits rather than a universal target.",
    },
    nearestSlugs: [
      "sound-masking-vs-earplugs-vs-noise-cancelling",
      "white-pink-brown-noise-for-sleep",
      "noise-and-sleep-2026",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Set up white or colored noise at home using the lowest useful level, sensible placement, and a timer matched to the disturbance.",
    reassessOn: "2026-10-13",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns implementation at the pillow. The intervention comparison chooses the operation, colors chooses spectral balance, and the 2026 evidence audit interprets study outcomes.",
  },
  "sound-masking-vs-earplugs-vs-noise-cancelling": {
    claimRisk:
      "The comparison must distinguish adding, attenuating, cancelling, and fixing sound and avoid overstating consumer active-noise-cancellation evidence for sleep.",
    contribution:
      "Compares four operations by disturbance type and orders combinations so readers reduce sound before adding more of it.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "basner2026",
      fit:
        "The seven-night comparison directly informs pink-noise and earplug tradeoffs; hearing-protection and ANC sources support only their respective mechanisms and fit limits.",
    },
    nearestSlugs: [
      "how-sound-masking-works",
      "best-sleep-sounds",
      "how-to-use-white-noise-for-sleep",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Choose whether to mask, block, actively cancel, or physically reduce a nighttime disturbance before buying overlapping tools.",
    reassessOn: "2026-10-13",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This is the intervention-choice owner. Masking mechanics explains one operation, best sounds compares audio classes, and setup explains how to configure a chosen masker.",
  },
  "why-fan-noise-helps-sleep": {
    claimRisk:
      "A familiar fan experience must not be converted into universal efficacy, and cooling, airflow, learned cue, and acoustic masking need separate evidence boundaries.",
    contribution:
      "Decomposes a fan into five plausible components and provides a way to test whether cooling or sound is doing the useful work.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "fanNoiseReview2021",
      fit:
        "The fan-noise evidence review anchors the absence of a reliable general sleep effect; thermal and masking sources separately support component hypotheses.",
    },
    nearestSlugs: [
      "how-to-use-white-noise-for-sleep",
      "white-pink-brown-noise-for-sleep",
      "airplane-sound-for-sleep",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Identify whether a fan helps through sound, cooling, airflow, familiarity, or a combination, then reproduce only the useful component.",
    reassessOn: "2026-10-20",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 1,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns the fan's coupled thermal and acoustic experience. Setup owns general masker placement, colors owns spectral slopes, and airplane sound owns cabin-like low rumble.",
  },
  "white-pink-brown-noise-for-sleep": {
    claimRisk:
      "Engineering spectra cannot be presented as different medicines, and color popularity or one protocol cannot establish comparative sleep efficacy.",
    contribution:
      "Explains slopes in perceptual terms, connects them to masking targets and speaker limits, and classifies unstandardized labels such as green noise.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "auditoryReview2022",
      fit:
        "The auditory-stimulation review supports the protocol heterogeneity boundary; acoustic definitions and controlled studies answer different parts of the choice.",
    },
    nearestSlugs: [
      "best-sleep-sounds",
      "what-frequency-helps-you-sleep",
      "how-sound-masking-works",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Choose among white, pink, and brown noise by understanding their spectral shapes, comfort tradeoffs, and masking fit rather than expecting a therapeutic winner.",
    reassessOn: "2026-10-13",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns color and spectral-slope choice. Best sounds chooses a broad class, frequency claims owns incompatible hertz meanings, and masking owns auditory mechanism.",
  },
  "ocean-waves-for-sleep": {
    claimRisk:
      "Plausible masking and arousal mechanisms must not become a claim that ocean recordings improve sleep architecture or that a wave interval entrains sleep.",
    contribution:
      "Separates continuous coverage, slow variation, natural-sound response, learned meaning, and direct sleep evidence, then explains how synthesis avoids a salient loop.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "naturalStress2024",
      fit:
        "The controlled natural-sound study supports an adjacent stress-recovery mechanism, while the page explicitly keeps that result separate from limited direct sleep trials.",
    },
    nearestSlugs: [
      "noise-and-sleep-2026",
      "why-fan-noise-helps-sleep",
      "white-pink-brown-noise-for-sleep",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Understand why ocean sound may feel calming, what direct sleep evidence can show, and how to avoid turning rhythm into an entrainment claim.",
    reassessOn: "2026-10-20",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 1,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns variable surf and natural-sound meaning. The 2026 audit owns broadband sleep outcomes, fan noise owns thermal coupling, and colors owns stationary spectra.",
  },
  "why-car-rides-make-you-sleepy": {
    claimRisk:
      "Passenger drowsiness must not normalize drowsy driving, and audio cannot be claimed to reproduce vestibular rocking or whole-body vibration.",
    contribution:
      "Separates sopite syndrome, vestibular rocking, vibration, monotony, and acoustic cues while drawing an explicit driver-safety boundary.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "sopite2020",
      fit:
        "The sopite review anchors the motion-induced symptom concept; rocking and vibration experiments support only their measured physical components.",
    },
    nearestSlugs: [
      "airplane-sound-for-sleep",
      "why-fan-noise-helps-sleep",
      "noise-and-sleep-2026",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Name the mechanisms behind passenger sleepiness in a moving car and distinguish the physical effect from a reusable sound cue.",
    reassessOn: "2026-11-03",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 1,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 1,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns motion-induced passenger drowsiness. Airplane sound owns cabin acoustics, fan noise owns airflow and cooling, and the noise evidence audit owns sleep outcomes from maskers.",
  },
  "airplane-sound-for-sleep": {
    claimRisk:
      "A steady cabin-like texture must not be confused with disruptive aircraft events or justify recreating real cabin sound pressure at home.",
    contribution:
      "Contrasts continuous cabin rumble with a flyover event and translates the distinction into a low-level synthetic texture rather than a realism target.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "aircraftSleep2019",
      fit:
        "The field study anchors aircraft-event sleep disruption; cabin spectra and comfort studies support only the distinct continuous-cabin description.",
    },
    nearestSlugs: [
      "why-car-rides-make-you-sleepy",
      "why-fan-noise-helps-sleep",
      "white-pink-brown-noise-for-sleep",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Understand why steady cabin-like sound may recede while aircraft passing over a bedroom remains disruptive, and recreate only the quieter acoustic character.",
    reassessOn: "2026-11-03",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 1,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 2,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns cabin texture versus flyover events. Car rides owns vestibular motion, fan noise owns airflow and cooling, and the color guide owns generic spectral slopes.",
  },
  "is-eight-hours-of-sleep-necessary": {
    claimRisk:
      "Population guidance cannot diagnose an individual need, and rare natural short sleep or field-study averages cannot justify chronic restriction.",
    contribution:
      "Combines consensus guidance, dose-response performance evidence, rare genetics, and field studies into a decision based on sleep opportunity and waking function.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "aasmDurationConsensus2015",
      fit:
        "The consensus anchors the adult population threshold; laboratory and field studies explain why subjective adaptation and observed averages do not replace it.",
    },
    nearestSlugs: [
      "hunter-gatherer-sleep",
      "morning-sunlight-and-sleep",
      "how-to-quiet-a-racing-mind-at-night",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Choose a realistic adult sleep opportunity without treating eight hours as a pass-fail line or six hours as safe because it feels tolerable.",
    reassessOn: "2026-11-03",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 1,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns individual planning against population duration evidence. Hunter-gatherer sleep owns cross-society interpretation, morning light owns timing, and racing mind owns cognitive wakefulness.",
  },
  "hunter-gatherer-sleep": {
    claimRisk:
      "Contemporary forager populations cannot be treated as replicas of prehistoric humans or as a prescription for shorter modern sleep.",
    contribution:
      "Compares multiple field populations and electrification studies to replace two opposing ancestral-sleep myths with a context-sensitive interpretation.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "crossSocietySleep2025",
      fit:
        "The cross-society comparison anchors variability across settings; individual field and electrification studies show context without defining one ancestral norm.",
    },
    nearestSlugs: [
      "is-eight-hours-of-sleep-necessary",
      "morning-sunlight-and-sleep",
      "why-you-sleep-badly-in-hotels",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Interpret hunter-gatherer sleep studies without turning contemporary field averages into a universal ancestral schedule.",
    reassessOn: "2026-11-10",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 1,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns cultural and evolutionary interpretation. The duration guide owns present-day sleep opportunity, morning light owns circadian timing, and the hotel guide owns novelty responses.",
  },
  "why-you-sleep-badly-in-hotels": {
    claimRisk:
      "Laboratory hemispheric asymmetry must not be exaggerated into literal unihemispheric sleep or used to explain every poor hotel night.",
    contribution:
      "Places the first-night laboratory effect beside travel timing, temperature, noise, expectation, and room familiarity, then gives a reversible first-night protocol.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "firstNightMeta2022",
      fit:
        "The meta-analysis anchors the general first-night phenomenon; neurophysiology studies support only the narrower vigilance mechanism they observed.",
    },
    nearestSlugs: [
      "sound-masking-vs-earplugs-vs-noise-cancelling",
      "morning-sunlight-and-sleep",
      "hunter-gatherer-sleep",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Understand a poor first hotel night and choose practical changes without reducing every cause to one brain-vigilance headline.",
    reassessOn: "2026-11-10",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 1,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns novelty and the first-night effect. The intervention comparison owns noise tools, morning light owns travel-related circadian timing, and hunter-gatherer sleep owns cross-society environments.",
  },
  "morning-sunlight-and-sleep": {
    claimRisk:
      "Circadian timing depends on biological phase and total light history; the page must not prescribe one duration or substitute casual outdoor exposure for supervised bright-light therapy.",
    contribution:
      "Connects phase-response timing, outdoor-versus-window intensity, daytime light history, and evening opposition into a falsifiable morning-light experiment without fake minutes precision.",
    decision: "keep",
    evidenceAnchor: {
      sourceId: "lightPhaseResponse2012",
      fit:
        "The human phase-response study anchors the timing mechanism; camping, review, and recommendation sources establish the broader day-night context.",
    },
    nearestSlugs: [
      "is-eight-hours-of-sleep-necessary",
      "hunter-gatherer-sleep",
      "screens-blue-light-glasses-and-sleep",
    ],
    owner: "Sleepyland maintainers",
    readerJob:
      "Use morning outdoor light to test an earlier circadian schedule while accounting for timing, intensity, season, and evening light.",
    reassessOn: "2026-11-10",
    scores: {
      factualConfidence: 2,
      maintenanceValue: 2,
      originalEvidence: 2,
      readerUtility: 2,
      sleepylandFit: 1,
      voiceIntegrity: 2,
    },
    separation:
      "This page owns daytime circadian light. Duration guidance owns sleep opportunity, field sleep owns environmental timing across societies, and the screen guide owns evening device exposure and filters.",
  },
} as const;

const SOURCE_CHECKED_ON = "2026-09-01";

export const RESEARCH_ADMISSIONS = Object.fromEntries(
  Object.entries(RESEARCH_ADMISSION_DECISIONS).map(([slug, admission]) => [
    slug,
    {
      ...admission,
      evidenceType: "evidence synthesis" as const,
      humanReview: "not documented" as const,
      lifecycle: admission.decision === "keep-after-consolidation"
        ? "keep-after-consolidation" as const
        : "active" as const,
      sourceCheckedOn: SOURCE_CHECKED_ON,
    },
  ]),
) as ResearchAdmissionRegistry & {
  readonly [Slug in keyof typeof RESEARCH_ADMISSION_DECISIONS]: ResearchAdmission;
};

export type AdmittedResearchSlug = keyof typeof RESEARCH_ADMISSIONS;

export function getResearchAdmission(
  slug: string,
): ResearchAdmission | undefined {
  const admissions: ResearchAdmissionRegistry = RESEARCH_ADMISSIONS;
  return admissions[slug as ResearchSlug];
}

export function researchAdmissionScore(admission: ResearchAdmission): number {
  return Object.values(admission.scores).reduce<number>(
    (total, score) => total + score,
    0,
  );
}

export function isResearchAdmissionValid(admission: ResearchAdmission): boolean {
  const validDate = /^\d{4}-\d{2}-\d{2}$/u;
  return admission.evidenceType === "evidence synthesis"
    && admission.humanReview === "not documented"
    && ["active", "keep-after-consolidation"].includes(admission.lifecycle)
    && validDate.test(admission.sourceCheckedOn)
    && validDate.test(admission.reassessOn)
    && Object.values(admission.scores).every((score) => score > 0)
    && researchAdmissionScore(admission) >= 9;
}

export function isResearchSlugAdmitted(slug: string): boolean {
  const admission = getResearchAdmission(slug);
  return admission !== undefined && isResearchAdmissionValid(admission);
}
