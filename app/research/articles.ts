import {
  SLEEP_HEALTH_ARTICLES,
  SLEEP_HEALTH_SOURCES,
} from "./sleep-health-expansion";

export const RESEARCH_SLUGS = [
  "best-magnesium-for-sleep",
  "l-theanine-valerian-california-poppy-for-sleep",
  "kava-for-sleep",
  "benadryl-diphenhydramine-for-sleep",
  "screens-blue-light-glasses-and-sleep",
  "z-drugs-zaleplon-zolpidem-eszopiclone",
  "how-to-quiet-a-racing-mind-at-night",
  "best-sleep-sounds",
  "what-frequency-helps-you-sleep",
  "how-sound-masking-works",
  "noise-and-sleep-2026",
  "sound-for-focus-noise-music-silence",
  "how-to-use-white-noise-for-sleep",
  "sound-masking-vs-earplugs-vs-noise-cancelling",
  "why-fan-noise-helps-sleep",
  "white-pink-brown-noise-for-sleep",
  "ocean-waves-for-sleep",
  "why-car-rides-make-you-sleepy",
  "airplane-sound-for-sleep",
  "is-eight-hours-of-sleep-necessary",
  "hunter-gatherer-sleep",
  "why-you-sleep-badly-in-hotels",
  "morning-sunlight-and-sleep",
  "does-grounding-help-sleep",
] as const;

export type ResearchSlug = (typeof RESEARCH_SLUGS)[number];

export const HOMEPAGE_RESEARCH_SLUGS = [
  "noise-and-sleep-2026",
  "best-sleep-sounds",
  "how-sound-masking-works",
  "sound-masking-vs-earplugs-vs-noise-cancelling",
  "is-eight-hours-of-sleep-necessary",
  "morning-sunlight-and-sleep",
  "why-you-sleep-badly-in-hotels",
  "how-to-quiet-a-racing-mind-at-night",
] as const satisfies readonly ResearchSlug[];

export const CLINICAL_REVIEW_REQUIRED_RESEARCH_SLUGS = [
  "benadryl-diphenhydramine-for-sleep",
  "z-drugs-zaleplon-zolpidem-eszopiclone",
] as const satisfies readonly ResearchSlug[];

export const RESEARCH_TAGS = [
  { id: "sleep", label: "Sleep" },
  { id: "sound", label: "Sound" },
  { id: "circadian", label: "Circadian rhythm" },
  { id: "focus", label: "Focus" },
  { id: "environment", label: "Environment" },
  { id: "wellness-claims", label: "Wellness claims" },
  { id: "supplements", label: "Supplements" },
  { id: "medications", label: "Medications" },
  { id: "behavior", label: "Behavior" },
] as const;

export type ResearchTag = (typeof RESEARCH_TAGS)[number];
export type ResearchTagId = ResearchTag["id"];

export type InlinePart =
  | string
  | Readonly<{
      emphasis?: "em" | "strong";
      href?: string;
      text: string;
    }>;

export type InlineContent = readonly InlinePart[];

export type ResearchBlock =
  | Readonly<{
      content: InlineContent;
      type: "paragraph";
    }>
  | Readonly<{
      level: 2 | 3;
      text: string;
      type: "heading";
    }>
  | Readonly<{
      items: readonly InlineContent[];
      style: "ordered" | "unordered";
      type: "list";
    }>
  | Readonly<{
      content: InlineContent;
      label: string;
      type: "callout";
    }>
  | Readonly<{
      caption: string;
      columns: readonly string[];
      rows: readonly (readonly InlineContent[])[];
      type: "table";
    }>
  | Readonly<{
      imageSlug: ResearchSlug;
      type: "editorial-image";
    }>;

export interface ResearchSource {
  readonly note: string;
  readonly publication: string;
  readonly title: string;
  readonly url: `https://${string}`;
  readonly year: number;
}

export const RESEARCH_SOURCES = {
  ...SLEEP_HEALTH_SOURCES,
  basner2026: {
    title:
      "Efficacy of pink noise and earplugs for mitigating the effects of intermittent environmental noise exposure on sleep",
    publication: "Sleep",
    year: 2026,
    url: "https://doi.org/10.1093/sleep/zsag001",
    note:
      "A seven-night polysomnography study in 25 healthy adults comparing environmental noise, continuous pink noise, earplugs, and combinations.",
  },
  whiteNoiseOlderAdults2026: {
    title:
      "The effect of white noise on sleep quality and fatigue in community-dwelling older adults: a randomized controlled trial",
    publication: "BMC Geriatrics",
    year: 2026,
    url: "https://doi.org/10.1186/s12877-026-07311-2",
    note:
      "A 60-person, 30-night randomized study comparing sleep hygiene alone with sleep hygiene plus 30 minutes of participant-selected nature sound, using self-reported sleep and fatigue outcomes.",
  },
  noiseHealthReview2026: {
    title:
      "Auditory and non-auditory effects of noise on health: updated evidence and future directions",
    publication: "Environmental Research",
    year: 2026,
    url: "https://pubmed.ncbi.nlm.nih.gov/42081987/",
    note:
      "An updated review of environmental-noise evidence covering hearing, sleep disturbance, stress pathways, cardiometabolic outcomes, mental health, and mitigation.",
  },
  whiteNoiseMeta2025: {
    title:
      "Impact of white noise on sleep quality across age groups and in critically ill/non-critically ill patients",
    publication: "Sleep Medicine",
    year: 2025,
    url: "https://pubmed.ncbi.nlm.nih.gov/41151421/",
    note:
      "A meta-analysis of randomized trials that found possible benefits alongside substantial heterogeneity and methodological limitations.",
  },
  auditoryReview2022: {
    title: "Systematic review: auditory stimulation and sleep",
    publication: "Journal of Clinical Sleep Medicine",
    year: 2022,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9163611/",
    note:
      "A review of adult white-noise, pink-noise, and multiaudio studies that found no strong overall evidence and called for better-controlled research.",
  },
  noiseAidReview2020: {
    title: "Noise as a sleep aid: A systematic review",
    publication: "Sleep Medicine Reviews",
    year: 2021,
    url: "https://pubmed.ncbi.nlm.nih.gov/33007706/",
    note:
      "A systematic review concluding that the continuous-broadband-noise literature was heterogeneous and too uncertain for broad promotion.",
  },
  safeListening2026: {
    title: "Deafness and hearing loss: Safe listening",
    publication: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening",
    note:
      "Current public-health guidance explaining that hearing risk depends on sound level, duration, and frequency of exposure.",
  },
  environmentalNoiseWho: {
    title: "Environmental noise",
    publication: "World Health Organization",
    year: 2024,
    url: "https://www.who.int/tools/compendium-on-health-and-environment/environmental-noise",
    note:
      "A public-health overview of environmental noise, including sleep disturbance and the importance of reducing noise at its source.",
  },
  musicInsomniaCochrane2022: {
    title: "Listening to music for insomnia in adults",
    publication: "Cochrane Database of Systematic Reviews",
    year: 2022,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9400393/",
    note:
      "A 13-trial review of 1,007 adults finding moderate-certainty improvement in subjective sleep quality, with limited or uncertain evidence for objective sleep outcomes.",
  },
  acousticInsomniaMeta2025: {
    title:
      "A systematic review and meta-analysis of acoustic stimulation in the treatment of insomnia",
    publication: "Frontiers in Neuroscience",
    year: 2025,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12202548/",
    note:
      "An eight-study, 419-participant synthesis reporting improved questionnaire scores while finding no consistent improvement in sleep efficiency or total sleep time and combining heterogeneous sound protocols.",
  },
  sleepBrainOscillations2021: {
    title: "The interconnected causes and consequences of sleep in the brain",
    publication: "Science",
    year: 2021,
    url: "https://pubmed.ncbi.nlm.nih.gov/34709917/",
    note:
      "A neuroscience review defining slow-wave activity as measured low-frequency brain activity during NREM sleep, not an audible frequency prescription for a speaker.",
  },
  brainStimulationReview2023: {
    title:
      "Brain stimulation techniques as novel treatment options for insomnia: A systematic review",
    publication: "Journal of Sleep Research",
    year: 2023,
    url: "https://pubmed.ncbi.nlm.nih.gov/37202368/",
    note:
      "A systematic review separating experimental phase-locked auditory stimulation from ordinary playback and finding no eligible auditory-stimulation insomnia treatment trials.",
  },
  tuning432Pilot2020: {
    title:
      "Music tuned to 432 Hz versus music tuned to 440 Hz for improving sleep in patients with spinal cord injuries: a double-blind cross-over pilot study",
    publication: "Acta Biomedica",
    year: 2020,
    url: "https://pubmed.ncbi.nlm.nih.gov/33263352/",
    note:
      "A 12-person crossover pilot in a spinal-injury unit reporting a questionnaire improvement with 432 Hz tuning and calling for larger, more rigorous studies.",
  },
  auditoryProcessing2008: {
    title: "Basic auditory processes involved in the analysis of speech sounds",
    publication:
      "Philosophical Transactions of the Royal Society B: Biological Sciences",
    year: 2008,
    url: "https://pubmed.ncbi.nlm.nih.gov/17827102/",
    note:
      "A technical review of auditory filters, critical bands, masking, temporal resolution, and the spectro-temporal representation of speech.",
  },
  binauralReview2026: {
    title:
      "Music and binaural beat interventions for young adults: A systematic review of effects on anxiety, sleep, and cognition",
    publication: "Acta Neuropsychiatrica",
    year: 2026,
    url: "https://doi.org/10.1017/neu.2026.10057",
    note:
      "A broad review of music and rhythm-based interventions in young adults; useful but not a clean test of binaural beats as a sleep treatment.",
  },
  binauralTrial2026: {
    title:
      "The impact of sound intervention on sleep quality and stress levels in college students: a randomized controlled trial",
    publication: "Frontiers in Psychology",
    year: 2026,
    url: "https://doi.org/10.3389/fpsyg.2026.1859138",
    note:
      "A college-student trial in which both pink-noise and binaural-beat-plus-pink-noise groups improved, without a significant difference in sleep-quality scores between them.",
  },
  dynamicBinaural2024: {
    title:
      "Effect of dynamic binaural beats on sleep quality: a proof-of-concept study with questionnaire and biosignals",
    publication: "Frontiers in Human Neuroscience",
    year: 2024,
    url: "https://pubmed.ncbi.nlm.nih.gov/38629490/",
    note:
      "A small proof-of-concept study of changing low-frequency binaural differences, better treated as an early signal than definitive evidence.",
  },
  naturalStress2024: {
    title:
      "The effect of exposure to natural sounds on stress reduction: a systematic review and meta-analysis",
    publication: "Stress",
    year: 2024,
    url: "https://doi.org/10.1080/10253890.2024.2402519",
    note:
      "A synthesis reporting some physiological stress-recovery advantages for natural sound over quiet, with inconsistent subjective findings.",
  },
  naturalHealth2021: {
    title:
      "A synthesis of health benefits of natural sounds and their distribution in national parks",
    publication: "Proceedings of the National Academy of Sciences",
    year: 2021,
    url: "https://doi.org/10.1073/pnas.2013097118",
    note:
      "A systematic synthesis linking natural sounds with lower stress and annoyance and better health and positive affect outcomes.",
  },
  oceanCabg1992: {
    title:
      "The effects of ocean sounds on sleep after coronary artery bypass graft surgery",
    publication: "Heart & Lung",
    year: 1992,
    url: "https://pubmed.ncbi.nlm.nih.gov/1307884/",
    note:
      "An older before-and-after intervention in a specific postoperative population, not general evidence for healthy sleepers.",
  },
  oceanIcu2020: {
    title:
      "Sleep Promotion among Critically Ill Patients: Earplugs/Eye Mask versus Ocean Sound—A Randomized Controlled Trial Study",
    publication: "Critical Care Research and Practice",
    year: 2020,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7773452/",
    note:
      "A hospital study comparing ocean sound with earplugs and an eye mask in critically ill patients.",
  },
  rockingNap2011: {
    title: "Rocking synchronizes brain waves during a short nap",
    publication: "Current Biology",
    year: 2011,
    url: "https://pubmed.ncbi.nlm.nih.gov/21683897/",
    note:
      "A controlled human nap study in which gentle 0.25 Hz lateral rocking facilitated sleep transition and altered NREM oscillations.",
  },
  rockingNight2019: {
    title:
      "Whole-Night Continuous Rocking Entrains Spontaneous Neural Oscillations with Benefits for Sleep and Memory",
    publication: "Current Biology",
    year: 2019,
    url: "https://doi.org/10.1016/j.cub.2018.12.028",
    note:
      "A controlled whole-night study of gentle physical rocking in healthy sleepers, distinct from listening to rhythmic audio.",
  },
  sopite2020: {
    title:
      "Vestibular modulation of skin sympathetic nerve activity in sopite syndrome induced by low-frequency sinusoidal motion",
    publication: "Journal of Neurophysiology",
    year: 2020,
    url: "https://pubmed.ncbi.nlm.nih.gov/32965160/",
    note:
      "A laboratory study of drowsiness induced by very slow physical motion without nausea, supporting a vestibular component to sopite syndrome.",
  },
  vehicleVibration2018: {
    title:
      "The effects of physical vibration on heart rate variability as a measure of drowsiness",
    publication: "Ergonomics",
    year: 2018,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4963542/",
    note:
      "A seated-vibration experiment showing that vehicle-like whole-body vibration can increase drowsiness over a short exposure.",
  },
  cabinNoise2022: {
    title: "Assessment of in-cabin noise of wide-body aircrafts",
    publication: "Applied Acoustics",
    year: 2022,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9074885/",
    note:
      "Measurements showing that real aircraft cabins contain strong low-frequency energy and multiple tonal and broadband components.",
  },
  cabinComfort2012: {
    title: "Effects of aircraft cabin noise on passenger comfort",
    publication: "Ergonomics",
    year: 2012,
    url: "https://pubmed.ncbi.nlm.nih.gov/22849320/",
    note:
      "A simulator study showing that cabin-noise level and frequency spectrum both affect passenger acceptance.",
  },
  aircraftSleep2019: {
    title:
      "Aircraft Noise Effects on Sleep—Results of a Pilot Study Near Philadelphia International Airport",
    publication: "International Journal of Environmental Research and Public Health",
    year: 2019,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6747483/",
    note:
      "A field pilot linking individual nighttime aircraft events with measurable sleep disturbance.",
  },
  faaSleepProtocol2023: {
    title:
      "Effects of Aircraft Noise on Sleep: Federal Aviation Administration National Sleep Study Protocol",
    publication: "International Journal of Environmental Research and Public Health",
    year: 2023,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10650692/",
    note:
      "The protocol for a large U.S. field study designed around the relationship between individual aircraft events and awakening probability.",
  },
  vincens2026: {
    title:
      "Pink noise reduces impact of traffic noise on sleep and the blood metabolome: a cross-over pilot study",
    publication: "Communications Medicine",
    year: 2026,
    url: "https://doi.org/10.1038/s43856-026-01380-5",
    note:
      "A 12-person exploratory crossover trial finding that 45 dB pink noise attenuated some traffic-related acute sleep fragmentation and metabolite changes without establishing a general sleep benefit.",
  },
  nioshSlm2024: {
    title: "NIOSH Sound Level Meter App",
    publication: "National Institute for Occupational Safety and Health",
    year: 2024,
    url: "https://www.cdc.gov/niosh/noise/about/app.html",
    note:
      "Official documentation for a validated iOS measurement tool, including its occupational purpose, test conditions, accuracy limits, and lack of equivalent Android validation.",
  },
  nioshLimits2016: {
    title:
      "Understanding Noise Exposure Limits: Occupational vs. General Environmental Noise",
    publication: "National Institute for Occupational Safety and Health",
    year: 2016,
    url: "https://www.cdc.gov/niosh/blogs/2016/noise.html",
    note:
      "An official explanation that occupational exposure limits are not general bedroom recommendations and that sound level and cumulative duration must be interpreted together.",
  },
  nioshHearingProtection2024: {
    title: "Provide Hearing Protection",
    publication: "National Institute for Occupational Safety and Health",
    year: 2024,
    url: "https://www.cdc.gov/niosh/noise/prevent/ppe.html",
    note:
      "Official guidance explaining hearing-protector types, the importance of fit testing, and why active noise cancellation is not rated hearing protection unless labeled with an NRR.",
  },
  maskingReview2021: {
    title:
      "The role of the medial olivocochlear reflex in psychophysical masking and intensity resolution in humans: a review",
    publication: "Journal of Neurophysiology",
    year: 2021,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8285664/",
    note:
      "A technical review of auditory masking models, including the role of power inside auditory filters or critical bands in changing detection thresholds.",
  },
  ancHeadphones2012: {
    title:
      "Characteristics of noise-canceling headphones to reduce the hearing hazard for MP3 users",
    publication: "Journal of the Acoustical Society of America",
    year: 2012,
    url: "https://pubmed.ncbi.nlm.nih.gov/22712926/",
    note:
      "A 26-person headphone study finding additional low-frequency reduction when active cancellation was enabled, with performance varying by device and noise environment.",
  },
  acSound2019: {
    title:
      "The effect of air conditioner sound on sleep latency, duration, and efficiency in young adults",
    publication: "Annals of Thoracic Medicine",
    year: 2019,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6341869/",
    note:
      "A randomized two-night home study in 48 healthy young adults finding no significant benefit from standardized 43 dB air-conditioner sound on actigraphic sleep latency, duration, or efficiency.",
  },
  thermalSleep2012: {
    title: "Effects of thermal environment on sleep and circadian rhythm",
    publication: "Journal of Physiological Anthropology",
    year: 2012,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3427038/",
    note:
      "A human-focused review explaining that thermal environment, bedding, clothing, humidity, and individual comfort interact with sleep and thermoregulation.",
  },
  fanNoiseReview2021: {
    title: "An overview of testing methods for aeroengine fan noise",
    publication: "Progress in Aerospace Sciences",
    year: 2021,
    url: "https://www.sciencedirect.com/science/article/pii/S0376042121000270",
    note:
      "A technical review describing fan spectra as blade-passing harmonics superimposed on broadband components, a general acoustic distinction also relevant to household rotating fans.",
  },
  focusNoiseMeta2024: {
    title:
      "Systematic Review and Meta-Analysis: Do White Noise and Pink Noise Help With Attention in Attention-Deficit/Hyperactivity Disorder?",
    publication: "Journal of the American Academy of Child & Adolescent Psychiatry",
    year: 2024,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11283987/",
    note:
      "A 13-study meta-analysis finding a small average laboratory-task benefit for white or pink noise in young people with ADHD or elevated attention problems, a small negative effect in comparison groups, and no eligible brown-noise studies.",
  },
  auditoryAttentionReview2024: {
    title:
      "The effects of music and auditory stimulation on autonomic arousal, cognition and attention: A systematic review",
    publication: "International Journal of Psychophysiology",
    year: 2024,
    url: "https://pubmed.ncbi.nlm.nih.gov/38458383/",
    note:
      "A 31-study review finding mixed or insufficient evidence connecting music, ambient noise, white noise, or binaural beats with both autonomic arousal and cognitive performance.",
  },
  readingDistraction2018: {
    title:
      "Auditory Distraction During Reading: A Bayesian Meta-Analysis of a Continuing Controversy",
    publication: "Perspectives on Psychological Science",
    year: 2018,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6139986/",
    note:
      "A 65-study synthesis finding small, reliable reading-comprehension costs from background sound, with intelligible speech and lyrical music producing the largest distraction effects.",
  },
  musicLyrics2023: {
    title: "Should We Turn off the Music? Music with Lyrics Interferes with Cognitive Tasks",
    publication: "Journal of Cognition",
    year: 2023,
    url: "https://doi.org/10.5334/joc.273",
    note:
      "A controlled within-person study finding that lyrical music hindered verbal memory, visual memory, and reading, while instrumental lo-fi music showed no credible benefit or harm.",
  },
  preferredMusic2025: {
    title:
      "From Mozart to Fleetwood Mac: music listening is not detrimental to reading comprehension in university students",
    publication: "Cognition and Emotion",
    year: 2025,
    url: "https://pubmed.ncbi.nlm.nih.gov/40549986/",
    note:
      "A 279-person randomized study finding similar reading comprehension with self-selected music, background noise, and silence, while preferred music preserved positive mood and energy ratings.",
  },
  modulatedMusic2024: {
    title:
      "Rapid modulation in music supports attention in listeners with attentional difficulties",
    publication: "Communications Biology",
    year: 2024,
    url: "https://doi.org/10.1038/s42003-024-07026-3",
    note:
      "A four-experiment study of sustained attention and music, including an association between 16 Hz amplitude modulation and performance over time as self-reported attentional difficulty increased; company employees contributed and disclosed financial interests.",
  },
  irrelevantSpeech2020: {
    title:
      "The relation between the intelligibility of irrelevant speech and cognitive performance—A revised model based on laboratory studies",
    publication: "Indoor Air",
    year: 2020,
    url: "https://pubmed.ncbi.nlm.nih.gov/32735743/",
    note:
      "A systematic review of 14 laboratory studies linking more intelligible irrelevant speech with worse performance, especially on verbal short-term-memory tasks.",
  },
  aasmDurationConsensus2015: {
    title:
      "Recommended Amount of Sleep for a Healthy Adult: A Joint Consensus Recommendation",
    publication: "Sleep",
    year: 2015,
    url: "https://aasm.org/resources/pdf/adultsleepdurationconsensus.pdf",
    note:
      "The AASM and Sleep Research Society consensus that adults should regularly obtain at least seven hours of sleep, while acknowledging individual variability and uncertainty above nine hours.",
  },
  aasmDurationMethods2015: {
    title:
      "Recommended Amount of Sleep for a Healthy Adult: Methodology and Discussion",
    publication: "Sleep",
    year: 2015,
    url: "https://aasm.org/resources/pdf/adultsleepdurationmethods.pdf",
    note:
      "The consensus panel's methods and discussion, which distinguish duration from sleep timing, regularity, quality, and the presence of sleep disorders.",
  },
  vanDongen2003: {
    title:
      "The cumulative cost of additional wakefulness: dose-response effects on neurobehavioral functions and sleep physiology",
    publication: "Sleep",
    year: 2003,
    url: "https://pubmed.ncbi.nlm.nih.gov/12683469/",
    note:
      "A 48-person laboratory study in which 14 nights with four or six hours in bed produced cumulative, dose-dependent performance deficits that subjective sleepiness did not fully track.",
  },
  dec2NaturalShortSleep2009: {
    title: "The transcriptional repressor DEC2 regulates sleep length in mammals",
    publication: "Science",
    year: 2009,
    url: "https://pubmed.ncbi.nlm.nih.gov/19679812/",
    note:
      "A family and animal-model study associating a rare DEC2 mutation with a natural short-sleep phenotype, not evidence that most adults can train themselves to need less sleep.",
  },
  yetish2015: {
    title: "Natural sleep and its seasonal variations in three pre-industrial societies",
    publication: "Current Biology",
    year: 2015,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4720388/",
    note:
      "Actigraphy across Hadza, San, and Tsimane communities found 5.7 to 7.1 hours of sleep, seasonal variation, and sleep timed to darkness and falling temperature.",
  },
  crossSocietySleep2025: {
    title:
      "Are humans facing a sleep epidemic or enlightenment? Large-scale, industrial societies exhibit long, efficient sleep yet weak circadian function",
    publication: "Proceedings of the Royal Society B",
    year: 2025,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11858753/",
    note:
      "A synthesis of 54 population studies finding longer, more efficient sleep in industrial samples but stronger measured circadian function in non-industrial samples, with important cross-study limitations.",
  },
  hadzaSleep2017: {
    title: "Hadza sleep biology: Evidence for flexible sleep-wake patterns in hunter-gatherers",
    publication: "American Journal of Physical Anthropology",
    year: 2017,
    url: "https://pubmed.ncbi.nlm.nih.gov/28063234/",
    note:
      "Actigraphy from 33 Hadza volunteers across 393 days found about 6.25 hours of sleep, flexible timing, opportunistic naps, and strong ecological patterning.",
  },
  tobaElectricity2015: {
    title:
      "Access to Electric Light Is Associated with Shorter Sleep Duration in a Traditionally Hunter-Gatherer Community",
    publication: "Journal of Biological Rhythms",
    year: 2015,
    url: "https://journals.sagepub.com/doi/10.1177/0748730415590702",
    note:
      "A field comparison of two Toba/Qom communities associating electric-light access with later sleep onset and roughly 40 to 60 minutes less sleep, depending on season.",
  },
  tobaLongitudinal2025: {
    title:
      "Modern Times: Longitudinal Study of Toba/Qom Communities Reveals Delay and Shortening of Sleep in Real-Time Across Electrification",
    publication: "SLEEP Advances",
    year: 2025,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12324345/",
    note:
      "A 2012–2024 field dataset with more than 12,000 sleep records following Toba/Qom communities through electrification; observational design and changing devices limit causal precision.",
  },
  humanSleepEvolution2016: {
    title: "Shining evolutionary light on human sleep and sleep disorders",
    publication: "Evolution, Medicine, and Public Health",
    year: 2016,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4972941/",
    note:
      "An evolutionary review proposing that humans sleep less deeply and more efficiently than expected for a primate, while separating comparative hypotheses from direct clinical evidence.",
  },
  agnewFirstNight1966: {
    title: "The first night effect: an EEG study of sleep",
    publication: "Psychophysiology",
    year: 1966,
    url: "https://pubmed.ncbi.nlm.nih.gov/5903579/",
    note:
      "The foundational four-night laboratory study describing more wakefulness, lighter sleep, and altered REM on the first recorded night.",
  },
  firstNightMeta2022: {
    title: "A meta-analysis of the first-night effect in healthy individuals for the full age spectrum",
    publication: "Sleep Medicine Reviews",
    year: 2022,
    url: "https://pubmed.ncbi.nlm.nih.gov/34998093/",
    note:
      "A synthesis of 53 studies finding longer sleep latency and wakefulness plus lower total sleep time, efficiency, and REM on first laboratory nights.",
  },
  tamakiFirstNight2016: {
    title:
      "Night watch in one brain hemisphere during sleep associated with the first-night effect in humans",
    publication: "Current Biology",
    year: 2016,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4864126/",
    note:
      "A 35-person set of experiments linking the first-night effect with regional left-hemisphere slow-wave asymmetry and heightened responses to unusual sounds.",
  },
  firstNightHdEeg2022: {
    title: "Examining First Night Effect on Sleep Parameters with hd-EEG in Healthy Individuals",
    publication: "Brain Sciences",
    year: 2022,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8870064/",
    note:
      "Two-night high-density EEG recordings in 27 healthy people found shallower, more fragmented first-night sleep and regional rather than whole-brain differences.",
  },
  firstNightNonconsecutive2024: {
    title:
      "The first-night effect of sleep occurs over nonconsecutive nights in unfamiliar and familiar environments",
    publication: "Journal of Sleep Research",
    year: 2024,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11467056/",
    note:
      "Laboratory and familiar-setting recordings showing that first-night changes can reappear across nonconsecutive visits and are not reduced to a single universal pattern.",
  },
  firstNightMoreThanOne2001: {
    title: "The first-night effect may last more than one night",
    publication: "Journal of Psychiatric Research",
    year: 2001,
    url: "https://pubmed.ncbi.nlm.nih.gov/11461712/",
    note:
      "Four nights of home polysomnography in 26 healthy adults suggested that some REM-related adaptation continued through the fourth night.",
  },
  lightPhaseResponse2012: {
    title: "Human phase response curve to a 1 h pulse of bright white light",
    publication: "The Journal of Physiology",
    year: 2012,
    url: "https://pubmed.ncbi.nlm.nih.gov/22547633/",
    note:
      "A controlled human phase-response experiment showing that the direction and size of a clock shift depend on when bright light reaches the circadian system.",
  },
  naturalLightCamping2013: {
    title: "Entrainment of the Human Circadian Clock to the Natural Light-Dark Cycle",
    publication: "Current Biology",
    year: 2013,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4020279/",
    note:
      "A small midsummer field experiment in which a week of camping increased daytime light, reduced evening light, and shifted circadian timing about two hours earlier.",
  },
  eveningEreader2015: {
    title:
      "Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness",
    publication: "Proceedings of the National Academy of Sciences",
    year: 2015,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4313820/",
    note:
      "A controlled crossover study comparing four hours of evening e-reader and print reading, with later circadian timing and sleep onset after the bright screen condition.",
  },
  dailyLightReview2021: {
    title:
      "Are we still in the dark? A systematic review on personal daily light exposure, sleep-wake rhythm, and mood in healthy adults",
    publication: "Sleep Health",
    year: 2021,
    url: "https://pubmed.ncbi.nlm.nih.gov/34420891/",
    note:
      "A review of 25 observational studies rating the overall evidence low and the links between habitual light, sleep, circadian phase, and mood limited or conflicting.",
  },
  lightTimingReview2019: {
    title:
      "A systematic review of the amount and timing of light in association with objective and subjective sleep outcomes in community-dwelling adults",
    publication: "Sleep Health",
    year: 2019,
    url: "https://pubmed.ncbi.nlm.nih.gov/30670164/",
    note:
      "A 45-study review finding broad timing-dependent patterns: brighter morning light tracked with earlier sleep timing, while brighter evening light tracked with later timing.",
  },
  daytimeLightRecommendations2022: {
    title: "Recommendations for daytime, evening, and nighttime indoor light exposure to best support physiology, sleep, and wakefulness in healthy adults",
    publication: "PLOS Biology",
    year: 2022,
    url: "https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3001571",
    note:
      "Expert consensus recommendations expressed in melanopic equivalent daylight illuminance, useful for principles but not a personalized prescription for minutes outdoors.",
  },
  groundingTrial2025: {
    title:
      "A randomized, double-blind, placebo-controlled study on the improvement of sleep quality with Earthing mat",
    publication: "Advances in Integrative Medicine",
    year: 2025,
    url: "https://doi.org/10.1016/j.aimed.2025.01.005",
    note:
      "A 31-day sham-controlled pilot reporting improvements on several questionnaires and actigraphic sleep time; the paper contains sample-reporting inconsistencies and was funded by mat companies.",
  },
  groundingCortisol2004: {
    title:
      "The biologic effects of grounding the human body during sleep as measured by cortisol levels and subjective reporting of sleep, pain, and stress",
    publication: "Journal of Alternative and Complementary Medicine",
    year: 2004,
    url: "https://pubmed.ncbi.nlm.nih.gov/15650465/",
    note:
      "An uncontrolled 12-person pilot using a conductive mattress pad for eight weeks, with cortisol measurements and subjective outcomes but no sham comparison.",
  },
  groundingAlzheimer2022: {
    title: "Grounding the Body Improves Sleep Quality in Patients with Mild Alzheimer's Disease: A Pilot Study",
    publication: "Healthcare",
    year: 2022,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8954071/",
    note:
      "A small sham-controlled study in mild Alzheimer's disease: 22 enrolled, 15 completed, and sleep quality was questionnaire-based in a narrow clinical population.",
  },
  groundingReview2012: {
    title:
      "Earthing: Health Implications of Reconnecting the Human Body to the Earth's Surface Electrons",
    publication: "Journal of Environmental and Public Health",
    year: 2012,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3265077/",
    note:
      "A hypothesis-forward narrative review of early earthing studies; useful for tracing proposed mechanisms but not independent confirmation that those mechanisms improve sleep.",
  },
  cbtiGuideline2021: {
    title:
      "Behavioral and psychological treatments for chronic insomnia disorder in adults: an American Academy of Sleep Medicine clinical practice guideline",
    publication: "Journal of Clinical Sleep Medicine",
    year: 2021,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7853203/",
    note:
      "An evidence-graded clinical guideline giving multicomponent CBT-I a strong recommendation for adults with chronic insomnia disorder.",
  },
  insomniaAlternatives2023: {
    title: "Complementary and alternative treatments for insomnia disorder: a systematic umbrella review",
    publication: "Journal of Sleep Research",
    year: 2023,
    url: "https://pubmed.ncbi.nlm.nih.gov/37527850/",
    note:
      "An umbrella review of 15 systematic reviews finding mostly low-quality evidence for alternative insomnia treatments; grounding was not among the evaluated approaches.",
  },
} as const satisfies Record<string, ResearchSource>;

export type ResearchSourceId = keyof typeof RESEARCH_SOURCES;

export interface ResearchArticle {
  readonly body: readonly ResearchBlock[];
  readonly dek: string;
  readonly evidenceLabel: string;
  readonly focusPhrase: string;
  readonly keywords: readonly string[];
  readonly publishedAt: string;
  readonly relatedSlugs: readonly ResearchSlug[];
  readonly seoDescription: string;
  readonly slug: ResearchSlug;
  readonly sourceIds: readonly ResearchSourceId[];
  readonly tags: readonly ResearchTagId[];
  readonly title: string;
  readonly updatedAt: string;
}

function paragraph(...content: InlinePart[]): ResearchBlock {
  return { type: "paragraph", content };
}

function heading(text: string, level: 2 | 3 = 2): ResearchBlock {
  return { type: "heading", level, text };
}

function item(...content: InlinePart[]): InlineContent {
  return content;
}

function unordered(...items: InlineContent[]): ResearchBlock {
  return { type: "list", style: "unordered", items };
}

function ordered(...items: InlineContent[]): ResearchBlock {
  return { type: "list", style: "ordered", items };
}

function callout(label: string, ...content: InlinePart[]): ResearchBlock {
  return { type: "callout", label, content };
}

function table(
  caption: string,
  columns: readonly string[],
  ...rows: readonly (readonly InlineContent[])[]
): ResearchBlock {
  return { type: "table", caption, columns, rows };
}

function strong(text: string): InlinePart {
  return { text, emphasis: "strong" };
}

function emphasis(text: string): InlinePart {
  return { text, emphasis: "em" };
}

function link(text: string, href: string): InlinePart {
  return { text, href };
}

export const researchArticles = [
  ...SLEEP_HEALTH_ARTICLES,
  {
    slug: "best-sleep-sounds",
    title: "Best Sleep Sounds? Match the Sound to the Problem",
    dek:
      "Noise, nature sounds, music, earplugs, and silence solve different problems. The useful choice starts with what is keeping you awake, not with a universal ranking.",
    seoDescription:
      "Compare white noise, nature sounds, music, earplugs, and silence for sleep. Use an evidence-led decision table to match sound to the problem.",
    focusPhrase: "best sleep sounds",
    keywords: [
      "sleep sounds",
      "best sounds for sleep",
      "sounds to help you sleep",
      "relaxing sounds for sleep",
      "white noise vs nature sounds",
      "sleep music vs white noise",
    ],
    tags: ["sleep", "sound", "environment"],
    evidenceLabel: "No universal winner; evidence varies by sound and problem",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    sourceIds: [
      "noiseAidReview2020",
      "auditoryReview2022",
      "musicInsomniaCochrane2022",
      "acousticInsomniaMeta2025",
      "naturalStress2024",
      "naturalHealth2021",
      "basner2026",
      "environmentalNoiseWho",
      "safeListening2026",
    ],
    relatedSlugs: [
      "how-to-use-white-noise-for-sleep",
      "how-sound-masking-works",
      "sound-masking-vs-earplugs-vs-noise-cancelling",
    ],
    body: [
      callout(
        "The direct answer",
        "There is no best sleep sound for everyone. Use steady noise when unpredictable sound is the problem, music or a familiar nature sound when a low-information wind-down cue feels useful, and silence when added audio becomes the distraction. If the room is genuinely loud, reduce or block the noise before trying to cover it.",
      ),
      paragraph(
        "Search results often rank rain, white noise, brown noise, ocean waves, and music as if they were competing medicines. They are better understood as different tools. A sound can mask interruptions, lower the contrast between quiet and a sudden event, occupy attention without demanding much thought, or become a familiar bedtime cue. Those jobs need different evidence and different setups.",
      ),
      heading("Start with what is keeping you awake"),
      table(
        "Choose a sleep-sound strategy by the actual problem",
        ["Problem", "Useful first option", "Why it may fit", "Important limit"],
        [
          item("Unpredictable voices, traffic peaks, or hallway noise"),
          item("Low, steady pink or spectrally matched noise"),
          item("Reduces contrast and can make moderate events less noticeable"),
          item("Cannot make a loud room quiet and adds its own exposure"),
        ],
        [
          item("Steady engine, ventilation, or travel rumble"),
          item("Source reduction, passive isolation, ANC, or darker noise"),
          item("Low-frequency tools fit steady rumble better than bright hiss"),
          item("Small speakers reproduce deep bass poorly; ANC requires a worn device"),
        ],
        [
          item("A quiet room but an active bedtime routine"),
          item("Familiar music, calm nature sound, or a brief repeated cue"),
          item("Preference and repetition may make settling easier"),
          item("This is not proof that one track changes sleep stages"),
        ],
        [
          item("An already comfortable room where audio attracts attention"),
          item("Silence"),
          item("Avoids unnecessary stimulation and sound exposure"),
          item("Silence cannot mask an environment that changes through the night"),
        ],
        [
          item("Loud, structural, or impulsive noise"),
          item("Reduce the source or path; consider well-fitted earplugs"),
          item("Removes sound instead of competing with it"),
          item("Fit, alarms, caregiving needs, and vibration still matter"),
        ],
      ),
      heading("Continuous noise has a specific use, not a general victory"),
      paragraph(
        "White, pink, and brown noise are most defensible when they solve an environmental contrast problem. The evidence for continuous broadband noise as a general sleep aid remains uncertain. A ",
        link(
          "systematic review of continuous noise",
          RESEARCH_SOURCES.noiseAidReview2020.url,
        ),
        " judged the evidence very low quality, and a broader ",
        link(
          "review of 34 auditory-stimulation studies",
          RESEARCH_SOURCES.auditoryReview2022.url,
        ),
        " found no strong overall evidence despite positive findings in some protocols.",
      ),
      paragraph(
        "A newer ",
        link(
          "2025 acoustic-stimulation meta-analysis",
          RESEARCH_SOURCES.acousticInsomniaMeta2025.url,
        ),
        " reported better questionnaire scores across eight insomnia studies, while sleep efficiency and total sleep time did not improve consistently. It also combined different sounds and protocols. That result is a reason to study sound more carefully, not a basis for naming one universal winner.",
      ),
      paragraph(
        "The strongest recent caution comes from a ",
        link("2026 laboratory comparison", RESEARCH_SOURCES.basner2026.url),
        ". Continuous pink noise reduced REM sleep in the tested conditions, while earplugs protected sleep more consistently from intermittent environmental events. The finding does not make all pink noise harmful, but it shows why adding sound should solve a defined problem at the lowest useful level.",
      ),
      heading("Music has better subjective evidence than many lists admit"),
      paragraph(
        "Music is not a masker in the same sense as broadband noise. Melody, harmony, tempo, familiarity, and emotional association can hold attention or help a routine wind down. A ",
        link(
          "2022 Cochrane review",
          RESEARCH_SOURCES.musicInsomniaCochrane2022.url,
        ),
        " included 13 randomized studies with 1,007 adults and found moderate-certainty improvement in subjective sleep quality. Evidence for insomnia severity and objective sleep outcomes was limited or uncertain.",
      ),
      paragraph(
        "That distinction matters. Feeling that sleep improved is useful, but it is not the same measurement as EEG sleep stages, awakenings, or total sleep time. Music can also be too interesting. Lyrics, dramatic changes, familiar hooks, and a track ending abruptly can keep some listeners engaged. A calm instrumental track that fades after a wind-down period is a different intervention from an all-night playlist.",
      ),
      heading("Nature sounds may relax without proving a sleep effect"),
      paragraph(
        "Rain, wind, birds, and ocean waves vary over time rather than holding one fixed spectrum. A ",
        link(
          "2024 systematic review and meta-analysis",
          RESEARCH_SOURCES.naturalStress2024.url,
        ),
        " found some physiological stress-recovery advantages from natural sound, while subjective findings were inconsistent. A broader ",
        link(
          "2021 synthesis",
          RESEARCH_SOURCES.naturalHealth2021.url,
        ),
        " linked natural sounds with lower stress and annoyance across varied settings.",
      ),
      paragraph(
        "Those studies support relaxation as a plausible adjacent benefit. They do not establish that ocean waves improve sleep architecture in a quiet bedroom. Nature audio can also fail when a short recording loops, a bird call becomes salient, or a wave crash produces the same sudden event the listener was trying to avoid. The useful version is stable enough to recede but variable enough not to reveal a pattern.",
      ),
      heading("A practical order for choosing a sound"),
      ordered(
        item(
          strong("Reduce the real disturbance first. "),
          "Silence notifications, stabilize a vent, close a gap, move the bed, or ask whether the source can be lowered.",
        ),
        item(
          strong("Name the remaining sound. "),
          "Separate steady rumble, understandable speech, sharp events, and a need for a familiar cue.",
        ),
        item(
          strong("Choose one mechanism. "),
          "Try isolation for reduction, ANC for predictable low rumble, steady noise for masking, or music and nature sound for a wind-down cue.",
        ),
        item(
          strong("Change spectrum before level. "),
          "A brighter masker may fit speech; a darker one may fit low mechanical ambience. More volume is not the first adjustment.",
        ),
        item(
          strong("Test a timer. "),
          "Fade after sleep onset when the sound is only a cue. Continue quietly when the environmental problem persists all night.",
        ),
        item(
          strong("Judge several ordinary nights. "),
          "Notice awakenings, morning comfort, alarm audibility, and whether the sound keeps demanding more attention or level.",
        ),
      ),
      heading("What “best” cannot mean"),
      paragraph(
        "No review establishes one sleep sound as best across healthy adults, people with insomnia, hospital patients, noisy homes, quiet homes, speakers, headphones, and all-night playback. Preference matters, but preference does not erase exposure. The ",
        link(
          "WHO safe-listening framework",
          RESEARCH_SOURCES.safeListening2026.url,
        ),
        " treats level and duration together, while its ",
        link(
          "environmental-noise guidance",
          RESEARCH_SOURCES.environmentalNoiseWho.url,
        ),
        " prioritizes reducing noise at its source.",
      ),
      paragraph(
        "Sleepyland is most useful for testing the masking and nature-like options without short loops. Begin with the sound below the level you expect to need, adjust color or warmth toward the disturbance, and add slow waves only if they remain background. The right result is not the most impressive sound. It is the least intrusive setup that leaves the room easier to sleep in.",
      ),
    ],
  },
  {
    slug: "what-frequency-helps-you-sleep",
    title: "What Frequency Helps You Sleep? What Hz Claims Actually Mean",
    dek:
      "A pitch, a binaural difference, an EEG rhythm, and a noise spectrum can all be labeled in hertz. They are not interchangeable, and no single audible frequency is proven to cause sleep.",
    seoDescription:
      "What frequency helps you sleep? Separate audible pitch, EEG brainwaves, binaural beat differences, 432 Hz tuning, and noise spectra from proven effects.",
    focusPhrase: "what frequency helps you sleep",
    keywords: [
      "sleep frequency",
      "best frequency for sleep",
      "what hz helps you sleep",
      "delta waves for sleep",
      "432 hz sleep",
      "528 hz sleep",
      "binaural beats for sleep",
    ],
    tags: ["sleep", "sound", "wellness-claims"],
    evidenceLabel: "Frequency terms are real; single-Hz sleep claims are unproven",
    publishedAt: "2026-08-28",
    updatedAt: "2026-09-01",
    sourceIds: [
      "sleepBrainOscillations2021",
      "brainStimulationReview2023",
      "binauralReview2026",
      "binauralTrial2026",
      "dynamicBinaural2024",
      "tuning432Pilot2020",
      "auditoryReview2022",
      "safeListening2026",
    ],
    relatedSlugs: [
      "white-pink-brown-noise-for-sleep",
      "best-sleep-sounds",
    ],
    body: [
      callout(
        "The direct answer",
        "No single audible frequency is proven to make people sleep. “Sleep frequency” can mean the pitch of a tone, the difference between binaural tones, the speed of an amplitude pulse, a band measured in sleeping brain activity, or the spectral balance of noise. Those are different variables, and matching their numbers does not make them biologically equivalent.",
      ),
      paragraph(
        "Hertz means cycles per second. The unit is precise, but the object being counted often disappears in sleep-audio claims. A 432 Hz musical tuning, a 3 Hz binaural difference, a 1 Hz train of clicks, and 0.5 to 4 Hz EEG activity can all appear beside the word “frequency.” Only the first is an ordinary audible pitch. The others describe differences, timing, or measured neural activity.",
      ),
      heading("Five different things people call a sleep frequency"),
      table(
        "Frequency labels that should not be treated as interchangeable",
        ["Label", "What is cycling", "What you hear or measure", "What it does not prove"],
        [
          item("Audible carrier frequency"),
          item("Air-pressure vibration"),
          item("A pitch or part of a musical tone"),
          item("That the pitch creates a matching sleep stage"),
        ],
        [
          item("Musical tuning, such as A = 432 Hz"),
          item("The reference pitch used to tune the full piece"),
          item("The same music shifted slightly lower than A = 440 Hz"),
          item("That 432 is a unique biological resonance"),
        ],
        [
          item("Binaural beat difference"),
          item("The gap between separate left- and right-ear tones"),
          item("An internally perceived fluctuation with headphones"),
          item("That brain activity locks to the difference or improves sleep"),
        ],
        [
          item("Amplitude modulation or click rate"),
          item("How quickly a sound grows, fades, or repeats"),
          item("A pulse or rhythm imposed on an audible carrier"),
          item("That an open-loop pulse reproduces laboratory closed-loop stimulation"),
        ],
        [
          item("EEG frequency band"),
          item("Electrical activity measured from the scalp"),
          item("A feature researchers use to describe sleep physiology"),
          item("That playing the same number through a speaker causes that brain state"),
        ],
      ),
      heading("Delta is a measurement, not an audio prescription"),
      paragraph(
        "Deep NREM sleep contains prominent slow-wave activity. A ",
        link(
          "review of sleep physiology",
          RESEARCH_SOURCES.sleepBrainOscillations2021.url,
        ),
        " describes slow-wave activity around 0.5 to 4 Hz in EEG, alongside slower oscillations and higher-frequency sleep spindles. These numbers characterize electrical patterns recorded from networks of neurons. They do not describe a low note that a bedroom speaker can play to switch those networks on.",
      ),
      paragraph(
        "A track labeled “3 Hz delta” usually places a 3 Hz envelope, click rate, or binaural difference onto an audible carrier. That can create a slow pulsing sensation. It is still not the same signal as EEG voltage measured at the scalp, and the shared number alone does not establish causation. This is the central category error behind many “deep sleep frequency” claims.",
      ),
      heading("Closed-loop sleep research is much more specific"),
      paragraph(
        "Researchers have used brief sounds timed to the phase of a sleeper's measured slow oscillation. The system reads EEG in real time and delivers a stimulus at a selected moment. A ",
        link(
          "2023 systematic review of brain-stimulation techniques for insomnia",
          RESEARCH_SOURCES.brainStimulationReview2023.url,
        ),
        " notes that phase-locked auditory stimulation can alter sleep oscillations in experimental settings, but found no eligible auditory-stimulation trials establishing it as an insomnia treatment.",
      ),
      paragraph(
        "Timing a click from live EEG is not equivalent to playing an eight-hour audio file with a fixed pulse. The laboratory method depends on sleep stage, detected phase, stimulus level, algorithm, and individual response. A consumer track can be relaxing without inheriting the claims of a closed-loop protocol it does not perform.",
      ),
      heading("Binaural beats create a real percept and an uncertain sleep effect"),
      paragraph(
        "With headphones, separate tones can produce a perceived beat at their frequency difference. A 250 Hz tone in one ear and a 253 Hz tone in the other can create a 3 Hz fluctuation. The acoustic setup is real. The stronger claim, that the 3 Hz percept reliably entrains the brain into delta sleep, remains unproven.",
      ),
      paragraph(
        "A ",
        link(
          "2026 systematic review",
          RESEARCH_SOURCES.binauralReview2026.url,
        ),
        " found heterogeneous music and binaural-beat interventions across anxiety, sleep, and cognition. A ",
        link(
          "2024 proof-of-concept study",
          RESEARCH_SOURCES.dynamicBinaural2024.url,
        ),
        " reported early questionnaire and biosignal findings with changing low-frequency differences. Those studies justify better trials, not a universal beat prescription. Headphones are also a separate comfort and exposure decision for overnight use.",
      ),
      paragraph(
        "A separate ",
        link(
          "2026 randomized college-student trial",
          RESEARCH_SOURCES.binauralTrial2026.url,
        ),
        " compared pink noise with the same noise plus a 3 Hz binaural beat. Sleep-quality scores improved from baseline in both groups, but the between-group difference was not statistically significant. The result does not isolate a binaural advantage: a bedtime ritual, pink noise, expectancy, or a smaller effect all remain possible explanations.",
      ),
      heading("How to evaluate a binaural track without buying the entrainment story"),
      unordered(
        item(
          strong("Treat relaxation as the claim. "),
          "A steady pulse may narrow attention or become a learned wind-down cue without forcing a matching sleep stage.",
        ),
        item(
          strong("Remember the carrier. "),
          "Pink noise, music, or ambience mixed under the beat may contribute as much as the binaural difference.",
        ),
        item(
          strong("Test comfort before overnight use. "),
          "Classic binaural playback depends on separated left- and right-ear signals, usually through headphones. Pressure, heat, ringing, and sleep disruption are reasons to stop.",
        ),
        item(
          strong("Judge the morning, not the label. "),
          "Sleep onset, awakenings, comfort, and alertness are more useful observations than whether a playlist says delta or deep sleep.",
        ),
      ),
      paragraph(
        "Binaural beats are therefore a poor universal sound-machine default. Broadband noise and procedural waves work through speakers and have a clearer masking or soundscape job. A person who enjoys a quiet binaural track can still use it as a preference; the evidence does not support selling it as a guaranteed shortcut into deep sleep.",
      ),
      heading("What the 432 Hz evidence actually shows"),
      paragraph(
        "Tuning music to A = 432 Hz shifts every note slightly lower than the common A = 440 Hz reference. It does not make the whole recording a pure 432 Hz tone. In a ",
        link(
          "12-person crossover pilot",
          RESEARCH_SOURCES.tuning432Pilot2020.url,
        ),
        " people with spinal cord injuries listened to preferred music in both tunings. Sleep questionnaire scores improved after the 432 Hz condition, while listening periods and washout varied. The authors called for larger studies.",
      ),
      paragraph(
        "That is a narrow positive signal in a specific clinical group. It cannot establish 432 Hz as the best frequency for healthy sleepers, isolate tuning from preference and expectation across ordinary use, or support claims that 432 Hz resonates with the planet or repairs the body. Similar confidence around 528 Hz and other named frequencies runs ahead of comparative sleep evidence.",
      ),
      heading("Noise colors are spectra, not single frequencies"),
      paragraph(
        "White, pink, and brown noise contain broad ranges of frequency. Their color names describe how average energy changes across that range. White is brighter, pink falls with frequency, and brown falls more steeply. Choosing among them is a spectral-matching and comfort decision, not a search for one magic Hz value.",
      ),
      paragraph(
        "The ",
        link(
          "adult auditory-stimulation review",
          RESEARCH_SOURCES.auditoryReview2022.url,
        ),
        " found no strong overall sleep evidence across white, pink, and multiaudio protocols. A color can still be useful for masking a specific disturbance. The evidence boundary is that usefulness in a room does not prove direct control of brain rhythms.",
      ),
      heading("A better way to choose sleep audio"),
      ordered(
        item(
          strong("Ignore the isolated number first. "),
          "Ask whether the file is music, a tone, a binaural setup, pulsed audio, or broad noise.",
        ),
        item(
          strong("Name the intended job. "),
          "Masking a voice, creating a wind-down cue, and altering measured sleep physiology are different claims.",
        ),
        item(
          strong("Prefer the least stimulating version. "),
          "Avoid dramatic pulses, melodic hooks, or bright tones if they hold attention at bedtime.",
        ),
        item(
          strong("Compare ordinary alternatives. "),
          "Test the same routine with quiet music, steady noise, and silence rather than attributing one good night to a label.",
        ),
        item(
          strong("Keep exposure conservative. "),
          "Level and duration still matter even when a track is marketed as healing or low frequency.",
        ),
      ),
      paragraph(
        "The ",
        link(
          "WHO safe-listening framework",
          RESEARCH_SOURCES.safeListening2026.url,
        ),
        " does not create an exception for wellness frequencies. A quiet, comfortable track may be a useful preference. The number in its title is not a safety certificate or proof of a sleep effect.",
      ),
      paragraph(
        "Sleepyland deliberately uses broadband noise and procedural waves rather than a single-frequency promise. Its spectrum display shows where audible energy is present, which can help match an environmental sound. It does not measure EEG, deliver phase-locked stimulation, or claim to entrain a sleep stage.",
      ),
    ],
  },
  {
    slug: "how-sound-masking-works",
    title: "How Sound Masking Works: Frequency, Contrast, and Limits",
    dek:
      "Masking does not erase sound. It changes audibility by adding energy near the frequencies and moments that carry the unwanted signal, while reducing contrast against the room's baseline.",
    seoDescription:
      "Learn how sound masking works across frequency and time, why white noise cannot block every sound, and what to try for traffic, voices, bass, and impacts.",
    focusPhrase: "how sound masking works",
    keywords: [
      "sound masking",
      "how does white noise mask sound",
      "what sound masks traffic noise",
      "white noise masking voices",
      "sound masking for sleep",
      "critical bands hearing",
    ],
    tags: ["sleep", "sound", "environment"],
    evidenceLabel: "Acoustics established; sleep benefit depends on the disturbance",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    sourceIds: [
      "maskingReview2021",
      "auditoryProcessing2008",
      "irrelevantSpeech2020",
      "basner2026",
      "noiseAidReview2020",
      "environmentalNoiseWho",
      "safeListening2026",
    ],
    relatedSlugs: [
      "sound-masking-vs-earplugs-vs-noise-cancelling",
      "white-pink-brown-noise-for-sleep",
      "best-sleep-sounds",
    ],
    body: [
      callout(
        "The direct answer",
        "Sound masking raises the threshold at which another sound is noticed. It works best when the masker overlaps the unwanted signal in frequency and time and reduces its contrast without becoming the dominant sound. It does not absorb, block, or cancel acoustic energy, so some problems need earplugs, sealing, repair, distance, or source reduction instead.",
      ),
      paragraph(
        "A quiet room makes a small interruption conspicuous. Add a stable background and the same interruption may become harder to detect or understand. That everyday description is accurate but incomplete. Hearing separates sound into overlapping frequency channels, responds to changes over time, and remains sensitive to meaning. A masker must compete with the useful parts of the target signal inside that system.",
      ),
      heading("Masking happens inside auditory filters"),
      paragraph(
        "A ",
        link(
          "technical review of auditory masking",
          RESEARCH_SOURCES.maskingReview2021.url,
        ),
        " describes the power-spectrum model in terms of signal-to-noise ratio at the output of an auditory filter, also called a critical band or equivalent rectangular bandwidth. In plain language, the ear behaves partly like a bank of overlapping filters. Noise near a target frequency affects detection more efficiently than the same energy far away.",
      ),
      paragraph(
        "A separate ",
        link(
          "review of speech perception",
          RESEARCH_SOURCES.auditoryProcessing2008.url,
        ),
        " explains how frequency selectivity and temporal resolution shape the internal representation of speech. This is why one broad slider cannot predict every room. Consonants, vowel energy, low traffic rumble, and a door impact occupy different spectra and timescales.",
      ),
      heading("Three variables determine whether masking is efficient"),
      unordered(
        item(
          strong("Frequency overlap: "),
          "the masker needs useful energy near the informative part of the unwanted sound. Deep brown noise may feel comfortable but leave higher speech cues exposed.",
        ),
        item(
          strong("Level difference: "),
          "the added background must reduce the target's effective signal-to-noise ratio. If that requires a dominant masker, reduction is usually the better operation.",
        ),
        item(
          strong("Timing and variation: "),
          "a steady background can reduce contrast, but rare impacts and fast changes can still break through. A looping or pulsing masker may create its own events.",
        ),
      ),
      paragraph(
        "Meaning adds another layer. A partly intelligible conversation can recruit attention even when it is not loud. A ",
        link(
          "systematic review of irrelevant speech",
          RESEARCH_SOURCES.irrelevantSpeech2020.url,
        ),
        " linked greater intelligibility with worse performance, especially on verbal short-term-memory tasks. That is an attention finding rather than a sleep trial, but it helps explain why blurring consonants can matter more than making a room sound uniformly louder.",
      ),
      heading("What tends to mask what"),
      table(
        "Spectrum-first starting points for common nighttime disturbances",
        ["Disturbance", "Acoustic pattern", "Masking starting point", "When masking is the wrong tool"],
        [
          item("Distant traffic or engine rumble"),
          item("Mostly low, sometimes with intermittent higher tire noise"),
          item("Dark pink or brown on a speaker with clean low-frequency output"),
          item("Vibration, very loud events, or window transmission need source or path reduction"),
        ],
        [
          item("Voices or television"),
          item("Changing midrange energy with intelligible consonant cues"),
          item("Pink or moderately bright noise, adjusted before raising level"),
          item("A loud adjacent television or thin wall is better handled at the source or boundary"),
        ],
        [
          item("HVAC or fan tone"),
          item("Broad airflow plus stable tones and harmonics"),
          item("A nearby broad spectrum with enough energy around the tone"),
          item("Repair a rattle, squeal, or unstable motor instead of covering it"),
        ],
        [
          item("Footsteps, doors, or dropped objects"),
          item("Short, high-contrast impacts with structure-borne energy"),
          item("A modest baseline may soften the contrast only"),
          item("Do not maintain a loud all-night masker for rare peaks"),
        ],
        [
          item("Snoring"),
          item("Variable low fundamentals plus broad higher components"),
          item("Pink or mixed noise may blur moderate events"),
          item("Masking does not evaluate or treat the person producing the sound"),
        ],
        [
          item("High chirps, clinks, or electronic beeps"),
          item("Brief upper-frequency events"),
          item("A brighter masker if the event is moderate and recurring"),
          item("Silence, relocate, or disable the source when possible"),
        ],
      ),
      heading("White noise is not a universal blocker"),
      paragraph(
        "Ideal white noise has equal average power in each one-hertz band, which gives high frequencies substantial total energy across each octave. That brightness can mask sharp cues efficiently, but it can also feel abrasive. Pink noise reduces energy with frequency. Brown noise falls faster and feels deeper. The best spectral match can therefore be quieter and more comfortable than a badly matched white-noise signal.",
      ),
      paragraph(
        "Speaker response matters as much as the label. A phone may turn nominal brown noise into a midrange buzz because it cannot reproduce the intended low end. A room can amplify or cancel narrow bass regions. The spectrum at the pillow is the relevant result, not the file name or the shape before playback.",
      ),
      heading("Masking, cancellation, and reduction are different"),
      paragraph(
        "Masking adds sound. Passive isolation and room treatment reduce the energy that reaches the ear. Active noise cancellation estimates an incoming waveform and creates an opposing signal near the ear, working most predictably on steady low-frequency components. These methods can be layered, but they should not be described as one operation.",
      ),
      paragraph(
        "The ",
        link(
          "World Health Organization's environmental-noise guidance",
          RESEARCH_SOURCES.environmentalNoiseWho.url,
        ),
        " prioritizes reducing harmful noise and its sources. If a masker must become loud to compete with a room, that is evidence that the room needs reduction, not evidence that the masker needs a more fashionable color.",
      ),
      heading("What sleep studies add to the acoustics"),
      paragraph(
        "Masking is a well-established perceptual phenomenon. A sleep benefit does not follow automatically. A ",
        link(
          "systematic review of continuous broadband noise",
          RESEARCH_SOURCES.noiseAidReview2020.url,
        ),
        " found heterogeneous protocols and very low-certainty evidence. In the ",
        link("2026 Basner study", RESEARCH_SOURCES.basner2026.url),
        ", continuous pink noise made some fragmentation measures slightly better in environmental-noise conditions but reduced REM sleep and did not protect sleep structure overall. Earplugs performed better in most tested conditions.",
      ),
      paragraph(
        "The practical conclusion is narrower than “masking works” or “masking fails.” It can make a moderate target less perceptible. Whether that improves a particular person's sleep depends on the target, masker, level, room, duration, sleep stage, and sensitivity to the added sound.",
      ),
      heading("Set up masking without turning it into the problem"),
      ordered(
        item(
          strong("Listen to the intruder first. "),
          "Identify low rumble, speech, tonal whine, or impacts before choosing a color.",
        ),
        item(
          strong("Place the speaker for the listener, not the window. "),
          "A speaker does not form a barrier. Its value is the spectrum and level it creates at the sleeping position.",
        ),
        item(
          strong("Start below the expected level. "),
          "Increase only until ordinary events lose salience, not until every event disappears.",
        ),
        item(
          strong("Adjust spectrum before gain. "),
          "Move brighter for speech cues or darker for low rumble while checking comfort.",
        ),
        item(
          strong("Use a timer when the job ends. "),
          "Fade after sleep onset for a short-lived hallway or bedtime problem; continue quietly only when the disturbance persists.",
        ),
        item(
          strong("Recheck alarms and morning comfort. "),
          "Stop if the setup causes ringing, muffled hearing, headaches, worse sleep, or repeated pressure to increase level.",
        ),
      ),
      paragraph(
        "The ",
        link(
          "WHO safe-listening framework",
          RESEARCH_SOURCES.safeListening2026.url,
        ),
        " treats level and duration together. Sleepyland's live spectrum and tap interaction can make spectral overlap visible, but the graph is not a calibrated room measurement. Use it to understand shape, then judge the actual sound at the pillow and choose the lowest useful result.",
      ),
    ],
  },
  {
    slug: "noise-and-sleep-2026",
    title: "Does White Noise Help You Sleep? What Three 2026 Studies Found",
    dek:
      "Three 2026 studies reached different answers: one found better self-reported sleep in older adults, another found less REM with pink noise, and a small traffic-noise pilot found selective masking benefits.",
    seoDescription:
      "Does white noise help you sleep? Three 2026 studies found benefits and harms across self-reported sleep, REM, traffic masking, and short-term use.",
    focusPhrase: "does white noise help you sleep",
    keywords: [
      "does white noise help you sleep",
      "white noise sleep study",
      "white noise sleep research",
      "pink noise REM sleep",
      "continuous noise for sleep",
    ],
    tags: ["sleep", "sound"],
    evidenceLabel: "Evidence mixed; effects depend on the problem and protocol",
    publishedAt: "2026-07-24",
    updatedAt: "2026-08-31",
    sourceIds: [
      "whiteNoiseOlderAdults2026",
      "basner2026",
      "vincens2026",
      "noiseHealthReview2026",
      "whiteNoiseMeta2025",
      "auditoryReview2022",
      "noiseAidReview2020",
      "safeListening2026",
      "environmentalNoiseWho",
      "naturalStress2024",
      "binauralTrial2026",
      "rockingNight2019",
    ],
    relatedSlugs: [
      "how-to-use-white-noise-for-sleep",
      "white-pink-brown-noise-for-sleep",
      "how-sound-masking-works",
    ],
    body: [
      callout(
        "The short answer",
        "White noise can help some people, especially when it masks unpredictable sound, but 2026 evidence does not show a universal sleep benefit. One 30-night trial found better self-reported sleep and shorter reported sleep latency in older adults. A separate laboratory trial found that continuous pink noise reduced REM. Use the lowest level that solves a real noise problem.",
      ),
      paragraph(
        "For years, the popular explanation was tidy: white noise masks interruptions, pink noise resembles natural sound, and lower brown noise feels softer. Three 2026 studies now show why the answer depends on the listener, signal, setting, duration, and outcome. They include a ",
        link(
          "60-person home trial in older adults",
          RESEARCH_SOURCES.whiteNoiseOlderAdults2026.url,
        ),
        ", a ",
        link(
          "25-person laboratory trial",
          RESEARCH_SOURCES.basner2026.url,
        ),
        ", and a ",
        link(
          "12-person traffic-noise pilot",
          RESEARCH_SOURCES.vincens2026.url,
        ),
        ".",
      ),
      heading("Three 2026 studies found different things"),
      paragraph(
        "In the 60-person randomized trial, community-dwelling adults aged 65 and older with poor sleep and fatigue all received sleep-hygiene guidance. Half also played a selected sound from their phone for 30 minutes after getting into bed on 30 consecutive nights. Their questionnaire scores for sleep quality and fatigue improved more than the control group, and their reported sleep latency fell by an average of 10 minutes compared with two minutes in the control group. Total nighttime sleep duration did not change significantly.",
      ),
      paragraph(
        "The trial's label needs care. Participants chose among river, forest, rain, and sea-wave recordings rather than receiving one acoustically defined white-noise signal. They used their own phones in uncontrolled bedrooms, and the sleep outcomes came from questionnaires and personal logs rather than polysomnography. The result supports a short, participant-selected bedtime sound in this specific older group. It cannot isolate whether the useful element was a white-noise spectrum, natural sound, masking, expectation, or the added routine. Four of 30 listeners found the sound disruptive, while 10 said it helped mask environmental noise.",
      ),
      paragraph(
        "In the laboratory study, researchers followed 25 healthy adults across seven nights with polysomnography. Conditions included a quiet control night, 93 intermittent environmental-noise events, continuous pink noise at 40 or 50 dBA, earplugs, and combinations. Environmental noise reduced N3 deep sleep. Continuous pink noise reduced REM sleep. Adding pink noise produced small improvements in some fragmentation measures but worsened sleep structure overall. Earplugs protected sleep more consistently until the loudest environmental condition.",
      ),
      paragraph(
        "A separate ",
        link(
          "12-person crossover pilot",
          RESEARCH_SOURCES.vincens2026.url,
        ),
        " compared quiet, traffic events, continuous 45 dB pink noise, and traffic plus pink noise. Traffic caused brief event-related fragmentation and changed several measured blood metabolites even when total sleep time and broad sleep-stage measures were preserved. Pink noise attenuated some of those acute effects. The authors explicitly framed the result as exploratory because the sample was small and homogeneous.",
      ),
      table(
        "What three 2026 studies actually tested",
        ["Study", "Protocol", "Primary lens", "Result", "Boundary"],
        [
          item("Vahhabzadeh Mousavi et al."),
          item("60 older adults; 30 nights; sleep hygiene with or without 30 minutes of a selected nature-sound file"),
          item("Sleep and fatigue questionnaires, personal logs, and interviews"),
          item("Better self-reported sleep and fatigue; shorter reported latency; no significant sleep-duration change"),
          item("One-city convenience sample; uncontrolled rooms; self-report; intervention was not one standardized white-noise signal"),
        ],
        [
          item("Basner et al."),
          item("25 adults; seven nights; pink noise at 40 or 50 dBA; environmental events; earplugs"),
          item("Sleep stages, fragmentation, subjective sleep, cognition, cardiovascular and hearing measures"),
          item("Pink noise reduced REM and did not protect overall structure; earplugs performed better"),
          item("Small laboratory sample of healthy adults who did not habitually use masking sound"),
        ],
        [
          item("Vincens et al."),
          item("12 adults; five nights; 45 dB pink noise; traffic events; crossover design"),
          item("Event-related fragmentation, sleep macrostructure, questionnaires, and blood metabolomics"),
          item("Pink noise attenuated some traffic-related acute fragmentation and metabolite changes"),
          item("Exploratory pilot; too small to establish a general sleep or long-term health benefit"),
        ],
      ),
      paragraph(
        "These studies answer different questions. A short bedtime sound can improve a person's reported experience while an all-night masker changes REM in a laboratory. A masker can reduce the contrast of traffic events while the masker itself changes another part of sleep. Event-level protection, whole-night sleep architecture, subjective comfort, and downstream biomarkers are related but not interchangeable outcomes. Use sound to solve a specific environmental problem at the lowest useful level, not because a color name guarantees deeper sleep.",
      ),
      heading("Why reviews still cannot settle the question"),
      paragraph(
        "A ",
        link(
          "2025 meta-analysis of randomized white-noise trials",
          RESEARCH_SOURCES.whiteNoiseMeta2025.url,
        ),
        " reported improvements across several sleep outcomes, but also emphasized major differences in participants, settings, methods, and study quality. Hospital wards, newborn units, temporary laboratory insomnia, and ordinary bedrooms are not interchangeable contexts.",
      ),
      paragraph(
        "Two earlier systematic reviews reached the most durable conclusion. The ",
        link(
          "2022 auditory-stimulation review",
          RESEARCH_SOURCES.auditoryReview2022.url,
        ),
        " found many positive individual studies but no strong overall evidence. The ",
        link(
          "broadband-noise review",
          RESEARCH_SOURCES.noiseAidReview2020.url,
        ),
        " likewise judged the literature too heterogeneous to support blanket recommendations and warned that continuous noise could affect sleep or hearing.",
      ),
      paragraph(
        "These findings can coexist. A masker can improve sleep in a noisy ICU or apartment while adding no benefit in an already quiet bedroom. A person can sincerely sleep better with brown noise even if the average effect across a mixed group is uncertain. Subjective comfort, objective sleep stages, and protection from external events are related outcomes, not the same outcome.",
      ),
      heading("Reduce the source before adding a masker"),
      paragraph(
        "An ",
        link(
          "updated 2026 review of environmental noise and health",
          RESEARCH_SOURCES.noiseHealthReview2026.url,
        ),
        " summarizes extensive evidence that environmental noise can disturb sleep. That evidence concerns harmful exposure; it is not proof that adding broadband sound is therapeutic. Silence alerts, repair rattles, close gaps, or move the sleeper away from the source when possible. A masker is a fallback for sound you cannot control.",
      ),
      heading("What a calming sound can actually do"),
      unordered(
        item(
          strong("Masking: "),
          "A steady background raises the threshold at which a door, voice, pipe, or traffic event becomes noticeable. It does not remove the sound; it reduces contrast.",
        ),
        item(
          strong("Predictability: "),
          "The sleeping brain continues to evaluate sound. A stable, low-information texture is usually less attention-grabbing than speech, alerts, or tracks with sudden changes.",
        ),
        item(
          strong("Conditioning: "),
          "Repeatedly pairing one quiet sound with a wind-down routine can make it a learned cue. That is plausible behavioral conditioning, not proof that the sound directly changes sleep architecture.",
        ),
        item(
          strong("Relaxation: "),
          "Pleasant natural sounds may lower arousal before bed. Reviews of natural sound show some stress-recovery effects, but that is not identical to demonstrating more deep or REM sleep.",
        ),
      ),
      heading("White, pink, brown, waves, and binaural beats"),
      paragraph(
        strong("White noise"),
        " distributes equal power per hertz and therefore concentrates a great deal of energy in higher audible frequencies. It can mask speech and sharper household sounds well, but many people hear it as hissy.",
      ),
      paragraph(
        strong("Pink noise"),
        " falls by roughly 3 dB per octave, producing equal energy per octave and a softer balance. It is common in research, but the 2026 trial is a reason not to treat it as automatically restorative.",
      ),
      paragraph(
        strong("Brown noise"),
        " falls by roughly 6 dB per octave and sounds deeper. It is popular for sleep and airplane-like rumble, yet direct clinical comparisons showing that brown is better than pink or white remain scarce.",
      ),
      paragraph(
        strong("Ocean waves"),
        " combine broadband masking with slow, recognizable envelopes. Natural-sound research supports possible relaxation, while direct sleep evidence is concentrated in small or clinical studies. Their value may be experiential: enough variation to feel organic, not enough novelty to demand attention.",
      ),
      paragraph(
        strong("Binaural beats"),
        " require a different tone in each ear, usually headphones, to create a perceived beat. Some newer studies are encouraging, but interventions and outcomes vary and strong “brainwave entrainment” claims remain ahead of the evidence.",
      ),
      heading("A conservative way to test sleep sound"),
      ordered(
        item(
          strong("Fix the source first. "),
          "If traffic, a rattling vent, or a notification is the problem, reduce it physically before adding another sound.",
        ),
        item(
          strong("Start below the level that feels immersive. "),
          "Use the lowest output that softens interruptions. A device’s percentage is not a calibrated decibel reading.",
        ),
        item(
          strong("Prefer a speaker for long sessions. "),
          "Headphones can create pressure, heat, cable, and level-management problems during sleep.",
        ),
        item(
          strong("Use a timer when masking is only needed at sleep onset. "),
          "Continuous all-night exposure is not necessary for everyone.",
        ),
        item(
          strong("Compare several nights, not one impression. "),
          "Track awakenings, morning alertness, comfort, and whether you needed more volume over time.",
        ),
        item(
          strong("Stop if sleep or hearing feels worse. "),
          "Persistent insomnia, loud snoring, gasping, or daytime impairment deserves clinical attention rather than a louder sound machine.",
        ),
      ),
      paragraph(
        "The ",
        link(
          "World Health Organization’s 2026 safe-listening guidance",
          RESEARCH_SOURCES.safeListening2026.url,
        ),
        " emphasizes that risk depends on volume and duration together. Because phones, speakers, rooms, and ears differ, the practical sleep rule is simpler: quiet enough to remain background, never loud enough to dominate the room.",
      ),
      heading("Useful words for what people are feeling"),
      unordered(
        item(
          strong("Auditory masking: "),
          "one sound making another less detectable.",
        ),
        item(
          strong("Broadband noise: "),
          "a signal spread across a wide range of frequencies; white, pink, and brown are different spectral shapes.",
        ),
        item(
          strong("Soundscape: "),
          "the total acoustic environment, including meaning and context, not just decibels.",
        ),
        item(
          strong("Habituation: "),
          "a reduced response after repeated exposure; it is incomplete for many nighttime noise events.",
        ),
        item(
          strong("Conditioned sleep cue: "),
          "a repeated bedtime signal that becomes associated with winding down.",
        ),
        item(
          strong("Sopite syndrome: "),
          "motion-related drowsiness and fatigue, relevant to car and boat sleepiness rather than to sound alone.",
        ),
      ),
      heading("What this means for Sleepyland"),
      paragraph(
        "Sleepyland does not present one frequency as a cure. It lets you keep sound low, choose the spectral balance that feels least intrusive, mix a slow procedural surf layer, and use a timer. The default dark brown-noise profile is a starting point chosen for comfort, not a claim that brown noise has won a clinical comparison.",
      ),
      paragraph(
        "If your room is already quiet and you sleep well, silence remains an excellent option. If a steady sound helps you mask an irregular environment or settle into a repeatable ritual, use it as a modest tool and judge it by your own sleep and morning function—not by the color name on the button.",
      ),
    ],
  },
  {
    slug: "sound-for-focus-noise-music-silence",
    title: "Can Sound Help You Focus? Noise, Music, and Silence Compared",
    dek:
      "There is no universal best sound for focus. The useful choice depends on whether you are masking speech, supporting a repetitive task, reading language, or simply trying to make a session easier to begin.",
    seoDescription:
      "Compare brown, pink, and white noise, instrumental music, lyrics, silence, and modulated focus audio using current attention and reading research.",
    focusPhrase: "best sounds for focus",
    keywords: [
      "best sounds for focus",
      "brown noise for focus",
      "white noise for studying",
      "music vs silence for studying",
      "focus music research",
      "noise for ADHD focus",
    ],
    tags: ["sound", "focus"],
    evidenceLabel: "Effects depend on listener, task, and sound",
    publishedAt: "2026-07-26",
    updatedAt: "2026-07-26",
    sourceIds: [
      "focusNoiseMeta2024",
      "auditoryAttentionReview2024",
      "readingDistraction2018",
      "musicLyrics2023",
      "preferredMusic2025",
      "modulatedMusic2024",
      "irrelevantSpeech2020",
      "safeListening2026",
    ],
    relatedSlugs: [
      "best-sleep-sounds",
      "how-sound-masking-works",
      "white-pink-brown-noise-for-sleep",
    ],
    body: [
      callout(
        "The short answer",
        "Silence is the cleanest baseline, not a failure state. Steady noise can help when its job is to make speech or irregular sound less noticeable. Lyrics are a poor first choice for reading and verbal memory. Instrumental or preferred music may improve the experience without reliably improving the work. White or pink noise has a small average laboratory benefit in younger people with ADHD or elevated attention problems, but the same review found a small negative effect in comparison groups and no eligible brown-noise studies.",
      ),
      heading("Start with the problem, not the color"),
      paragraph(
        "“What is the best sound for focus?” hides at least two different jobs. One is environmental: a nearby conversation, HVAC change, or street event keeps capturing attention. The other is internal: silence feels flat, starting is difficult, or a repetitive task becomes tedious. A masker may help the first job by reducing contrast or speech intelligibility. Music or gentle movement may make the second job feel more tolerable. Neither mechanism proves a general cognitive upgrade.",
      ),
      paragraph(
        "That distinction matters because adding sound to an already quiet room creates another stream for the brain to process. A ",
        link(
          "31-study systematic review",
          RESEARCH_SOURCES.auditoryAttentionReview2024.url,
        ),
        " found mixed or insufficient evidence connecting music, ambient noise, white noise, or binaural beats with both autonomic arousal and cognitive performance. Preference, task demand, sound structure, and individual attention all change the result.",
      ),
      table(
        "A task-first focus-sound decision guide",
        ["Situation", "First test", "Why", "Change it when"],
        [
          item("Reading, memorizing, or writing language"),
          item("Silence; then very quiet steady noise if the room contains speech"),
          item("Words in lyrics or nearby conversation compete with language processing"),
          item("You reread sentences, lose the verbal thread, or notice the sound itself"),
        ],
        [
          item("Demanding work in a distracting room"),
          item("Low, steady pink noise; compare with source reduction or passive isolation"),
          item("A broad masker can reduce the intelligibility and contrast of remaining speech"),
          item("The masker must become dominant, harsh, or tiring to cover the room"),
        ],
        [
          item("Routine, repetitive, or low-demand work"),
          item("Preferred instrumental music or a gently moving soundscape"),
          item("Enjoyment and moderate stimulation may support task engagement even when accuracy is unchanged"),
          item("You follow the music, switch tracks, or make more errors"),
        ],
        [
          item("Idea generation or visual creation"),
          item("Silence or low-information instrumental sound; compare both"),
          item("Creativity studies conflict, and different creative tests reward different mental operations"),
          item("Movement becomes a foreground event or narrows rather than opens attention"),
        ],
        [
          item("Attention difficulties or ADHD"),
          item("A brief, quiet white- or pink-noise comparison against silence"),
          item("A meta-analysis found a small average task benefit in younger participants with ADHD or elevated symptoms"),
          item("Performance, comfort, or listening level gets worse; it is not treatment or a diagnostic test"),
        ],
      ),
      heading("Speech and lyrics are the clearest distraction risk"),
      paragraph(
        "The most durable rule is not “brown for deep work” or “pink for studying.” It is to protect a language task from competing language. A ",
        link(
          "Bayesian meta-analysis of 65 reading studies",
          RESEARCH_SOURCES.readingDistraction2018.url,
        ),
        " found small but reliable comprehension costs from background sound overall. Intelligible speech and lyrical music produced the largest effects, and lyrical music was more distracting than music without lyrics.",
      ),
      paragraph(
        "A later ",
        link(
          "systematic review of speech intelligibility and performance",
          RESEARCH_SOURCES.irrelevantSpeech2020.url,
        ),
        " reached a compatible practical conclusion: as irrelevant speech becomes easier to understand, performance tends to fall, with verbal short-term memory especially affected. This explains why a modest masker can be useful in an office even if noise does not improve cognition in a quiet laboratory. Its job is to make the competing speech less available.",
      ),
      heading("White and pink noise are not universal attention enhancers"),
      paragraph(
        "The strongest recent colored-noise result is specific. A ",
        link(
          "2024 systematic review and meta-analysis",
          RESEARCH_SOURCES.focusNoiseMeta2024.url,
        ),
        " combined 13 studies and 335 children, adolescents, or college-age participants with ADHD or elevated attention problems. White or pink noise produced a small average improvement on short laboratory tasks. In 11 comparison-group studies, the average effect was small and negative.",
      ),
      paragraph(
        "The limits are as important as the average. Most participants were young, exposures lasted minutes rather than workdays, levels varied, blinding was difficult, and the studies could not establish which tasks or people benefit. Only one eligible study used pink noise, and none tested brown noise. Brown noise may feel more comfortable because it emphasizes lower frequencies, but search popularity is not direct evidence of an attention effect.",
      ),
      callout(
        "What the ADHD evidence does not say",
        "A small group average does not predict an individual response, establish an all-day listening level, replace an ADHD assessment, or show that a darker color is better. A short personal comparison can be reasonable; a medicalized “ADHD frequency” claim is not.",
      ),
      heading("Music can support the session without improving the score"),
      paragraph(
        "Controlled music studies illustrate why “helps me focus” can be honest even when test accuracy does not rise. In a ",
        link(
          "2023 within-person experiment",
          RESEARCH_SOURCES.musicLyrics2023.url,
        ),
        " music with lyrics impaired verbal memory, visual memory, and reading by roughly a small effect, while instrumental lo-fi music showed no credible benefit or harm. Participants still sometimes perceived instrumental music as helpful.",
      ),
      paragraph(
        "A ",
        link(
          "2025 randomized study of 279 university students",
          RESEARCH_SOURCES.preferredMusic2025.url,
        ),
        " found similar reading comprehension with self-selected music, background noise, and silence. The music group maintained more positive mood, while positivity declined in the noise and silence groups. The reasonable inference is not that preferred music secretly raises comprehension. It may make some study sessions feel better or easier to sustain without changing the measured result.",
      ),
      heading("What rapid modulation research adds—and does not add"),
      paragraph(
        "Some commercial focus music adds fast amplitude changes to selected frequency bands. In a ",
        link(
          "2024 four-experiment study",
          RESEARCH_SOURCES.modulatedMusic2024.url,
        ),
        " rapidly modulated music changed EEG and fMRI measures. In the controlled rate experiment, 16 Hz modulation was associated with better sustained-attention performance over time as self-reported attentional difficulty increased. The modulation was limited to 200 Hz–1 kHz because broadband processing could become salient or annoying.",
      ),
      paragraph(
        "This is promising research, not proof that any 16 Hz track improves everyday work. The first behavioral advantage depended on presentation order, modulation depth produced no significant effect, the later conditions lasted about five minutes each, attentional difficulty was measured by self-report rather than a clinical diagnosis, and Brain.fm employees helped conduct the work and disclosed employment or equity interests. Sleepyland does not currently apply a 16 Hz “neural effect” or market an ADHD mode.",
      ),
      heading("How Sleepyland turns evidence into cautious product choices"),
      paragraph(
        "Sleepyland deliberately stops at three state-level soundscapes instead of claiming a different scientifically validated recipe for every kind of work. Focus combines a steady pink bed, low-salience rhythmic movement, and no surf. Relax moves more slowly and broadly with surf. Sleep is darker, steadier, and wave-led. Sleepyland does not currently add generated melodic events: foreground tones can become distracting, preference varies, and the available evidence does not establish that this layer improves sleep or attention. These are authored sound-design hypotheses, not guaranteed cognitive or medical effects.",
      ),
      paragraph(
        "Gentle, Balanced, and Strong change movement depth and pace without changing master volume, so “more energy” is not a hidden loudness comparison. If Focus makes reading harder, use silence or reduce every added layer. If it only helps because it covers nearby speech, source reduction, a quieter room, or passive isolation may solve the problem with less exposure.",
      ),
      heading("Run a three-session comparison instead of chasing a perfect track"),
      ordered(
        item(
          strong("Session one: establish silence. "),
          "Use the same task for 20–30 minutes in the quietest practical setting. Record one objective outcome—pages, correct items, or completed units—and one subjective outcome such as effort or distraction.",
        ),
        item(
          strong("Session two: solve the specific sound problem. "),
          "Use the lowest steady masker that makes speech or interruptions less noticeable. Keep the task, time, and break structure similar.",
        ),
        item(
          strong("Session three: test engagement. "),
          "Try a low-information instrumental or gently moving Focus profile at a comfortable level. Do not switch tracks during the block.",
        ),
      ),
      paragraph(
        "Compare output, errors, rereading, urge to switch, comfort, and willingness to repeat the setup. Keep a sound only if it improves the problem you named without demanding more attention or volume. Preference is useful data, but it is stronger when paired with a result from the actual task.",
      ),
      heading("Keep focus sound quiet enough to disappear"),
      paragraph(
        "Long work sessions turn a comfortable sound into cumulative exposure. The ",
        link(
          "World Health Organization’s safe-listening guidance",
          RESEARCH_SOURCES.safeListening2026.url,
        ),
        " emphasizes level and duration together. Start below the level you think you need, use breaks, and avoid raising headphones to overpower a loud room. Ringing, muffled hearing, discomfort, or a repeated urge to increase volume are reasons to stop and change the environment.",
      ),
      paragraph(
        "The best focus sound is therefore conditional. Silence wins when added audio competes with the work. Masking wins when it removes more distracting information than it adds. Instrumental sound wins when it improves engagement without changing the task. The right answer can change with the room, the work, and the listener—and that is more useful than pretending one color or frequency always wins.",
      ),
    ],
  },
  {
    slug: "how-to-use-white-noise-for-sleep",
    title: "How to Use White Noise for Sleep: Volume, Placement, and Timer",
    dek:
      "There is no evidence-based universal slider percentage, decibel target, or bedside distance. A better setup starts with the noise you are solving, measures where your head rests, and uses the lowest level that changes the interruption.",
    seoDescription:
      "Set up white noise for sleep without guessing: choose the lowest useful volume, measure at the pillow, place the speaker well, and decide when to use a timer.",
    focusPhrase: "how to use white noise for sleep",
    keywords: [
      "white noise volume for sleep",
      "how loud should white noise be for sleeping",
      "white noise machine placement",
      "where to place white noise machine",
      "white noise sleep timer",
    ],
    tags: ["sleep", "sound"],
    evidenceLabel: "Practical setup; no universal bedroom level",
    publishedAt: "2026-07-24",
    updatedAt: "2026-07-24",
    sourceIds: [
      "basner2026",
      "vincens2026",
      "whiteNoiseMeta2025",
      "noiseAidReview2020",
      "safeListening2026",
      "nioshSlm2024",
      "nioshLimits2016",
      "environmentalNoiseWho",
    ],
    relatedSlugs: [
      "sound-masking-vs-earplugs-vs-noise-cancelling",
      "white-pink-brown-noise-for-sleep",
      "noise-and-sleep-2026",
    ],
    body: [
      callout(
        "The practical answer",
        "Reduce the unwanted sound first. Then place one speaker where it can reach the pillow without sitting beside your ear, start quietly, and raise it only until interruptions become less conspicuous. Measure at the pillow if you measure at all. Use a timer when the problem ends after sleep onset; keep it running only when the disturbance continues.",
      ),
      heading("Start with the noise you are trying to solve"),
      paragraph(
        "“Use white noise” is incomplete advice. A steady sound can reduce contrast around voices, doors, traffic, plumbing, or a partner moving, but it does not remove acoustic energy from the room. If the source is a rattling vent, a phone alert, a window gap, or a loud appliance, fixing that source usually gives more quiet without adding an all-night exposure.",
      ),
      paragraph(
        "The ",
        link(
          "World Health Organization’s environmental-noise guidance",
          RESEARCH_SOURCES.environmentalNoiseWho.url,
        ),
        " treats source reduction as the real objective because nighttime environmental noise itself can disturb sleep. A masker is most defensible when a quieter source, path, or room is not immediately available.",
      ),
      table(
        "A setup matrix based on the actual reader problem",
        ["Problem", "First move", "Speaker position", "Level strategy", "Timer"],
        [
          item("Noise only while falling asleep"),
          item("Silence alerts and fix predictable room sounds"),
          item("Across the bedside area, not beside the ear"),
          item("Just enough to make small events less distinct"),
          item("Fade after the usual sleep-onset window"),
        ],
        [
          item("Intermittent traffic or hallway events"),
          item("Close gaps, move the bed, or reduce the path first"),
          item("Where the pillow receives an even field without one ear being blasted"),
          item("Compare events with and without masking before raising it"),
          item("Continue only while events continue"),
        ],
        [
          item("Voices or television"),
          item("Reduce the source or add passive isolation"),
          item("Near enough for clarity at the pillow, away from a shared wall when possible"),
          item("Try a brighter pink tone before adding overall level"),
          item("Match the schedule of the disturbance"),
        ],
        [
          item("A familiar wind-down cue in an already quiet room"),
          item("Ask whether silence already works"),
          item("Diffuse and unobtrusive"),
          item("Below immersive listening level"),
          item("A short fade is usually sufficient"),
        ],
      ),
      heading("There is no universal adult bedroom decibel target"),
      paragraph(
        "Search results commonly prescribe 50–70 dB for adults. That range is repeated more often than it is justified. The newest controlled trial found that continuous pink noise at 40 or 50 dBA altered sleep under its laboratory protocol; the 50 dBA condition reduced REM sleep by more than the lower condition. A separate 12-person pilot found that 45 dB pink noise attenuated some acute effects of traffic events. Those studies do not combine into a universal target. They show that level, purpose, outcome, and sleeper all matter.",
      ),
      paragraph(
        "Several familiar numbers answer different questions:",
      ),
      unordered(
        item(
          strong("85 dBA is an occupational exposure limit, not a bedtime recommendation. "),
          "NIOSH explicitly says its work limit is not designed as a general environmental target.",
        ),
        item(
          strong("WHO safe-listening examples describe cumulative hearing risk. "),
          "They do not prove that any quieter level improves sleep architecture.",
        ),
        item(
          strong("WHO bedroom guidance describes desirable environmental background. "),
          "It is not an instruction to turn a sound machine up to that number.",
        ),
        item(
          strong("A device percentage is not a decibel reading. "),
          "Signal spectrum, speaker efficiency, operating system, room reflections, and distance all change the sound at the ear.",
        ),
      ),
      paragraph(
        "The defensible rule is comparative rather than magical: use the lowest level that makes the target interruption less salient. If the masker becomes the most noticeable sound in the room, first change its spectrum or placement instead of automatically increasing it.",
      ),
      heading("Measure where your head actually rests"),
      paragraph(
        "Sound level belongs to a location. A reading beside the speaker does not describe the pillow, and a reading across the room does not describe either ear. If you use a meter, place the phone or microphone near the sleeping head position, run the actual sound, and measure for long enough to see whether the level is steady.",
      ),
      paragraph(
        "The ",
        link(
          "NIOSH Sound Level Meter app",
          RESEARCH_SOURCES.nioshSlm2024.url,
        ),
        " is a useful iOS reference because NIOSH tested it under controlled conditions. Its purpose is occupational measurement, its strongest validation is not at very quiet bedroom levels, and NIOSH cannot make the same hardware-wide claim for Android phones. Treat a phone reading as an approximate comparison tool unless the system is calibrated—not as a precise safety verdict.",
      ),
      ordered(
        item("Measure the room without the masker at the pillow."),
        item("Play the intended sound at the intended speaker position."),
        item("Raise it in small steps while listening to the actual disturbance."),
        item("Stop when the disturbance is less conspicuous, not when it disappears completely."),
        item("Recheck after changing the tone, speaker, operating system, or placement."),
      ),
      heading("Placement changes both usefulness and exposure"),
      paragraph(
        "A sound machine is not a wall. Putting it between a window and the bed does not physically block traffic like a barrier would. Placement matters because it changes the masker level and spectrum at the listener. In an ideal free field, level falls as distance increases; bedrooms add walls, furniture, standing waves, and reflections, so fixed internet distances are false precision.",
      ),
      paragraph(
        "Use one stable speaker on a surface that does not buzz. Keep it far enough from the head that one ear is not receiving a sharply stronger signal, but close enough that you do not need to fill the entire room. Avoid hiding it under bedding, aiming a bright tweeter directly at the pillow, or placing it where a partner must tolerate a higher level than the person using it. Then measure and listen at the pillow rather than trusting the distance alone.",
      ),
      heading("Choose the spectrum before adding volume"),
      paragraph(
        "White, pink, and brown noise distribute energy differently. White noise carries more high-frequency energy and may cover consonants or sharper events efficiently, but it can feel hissy. Pink is more balanced by octave. Brown is deeper and often more comfortable, but a small phone may reproduce its bass poorly. A poorly matched spectrum encourages unnecessary level.",
      ),
      unordered(
        item(
          strong("Speech and clatter: "),
          "try pink or a somewhat brighter tone before turning everything up.",
        ),
        item(
          strong("Traffic, engines, and HVAC: "),
          "try brown or dark pink on a speaker that can reproduce low frequencies cleanly.",
        ),
        item(
          strong("Mixed, changing noise: "),
          "begin with pink, then make one change at a time.",
        ),
        item(
          strong("No external noise: "),
          "choose the quietest comfortable cue—or silence. More spectral coverage is not automatically more sleep.",
        ),
      ),
      heading("Use a timer based on when the problem occurs"),
      paragraph(
        "A timer is not inherently better than all-night playback. It is a way to match exposure to the job. If sound is only a wind-down cue, a gentle fade after sleep onset avoids hours of unnecessary sound. If traffic, roommates, or building events continue until morning, an early cutoff may reveal the original problem and trigger an awakening.",
      ),
      paragraph(
        "Abrupt stopping can itself create contrast. Prefer a fade, and test the timer while awake so the endpoint is not a surprise. If the masker must run all night, resist compensating for rare loud events with a permanently high baseline. Passive reduction or a change to the room may handle those peaks more effectively.",
      ),
      heading("A seven-night setup experiment"),
      ordered(
        item(
          strong("Night one: "),
          "observe the untreated problem and note sleep onset, awakenings, and morning comfort.",
        ),
        item(
          strong("Nights two and three: "),
          "use one low, steady spectrum without changing placement.",
        ),
        item(
          strong("Nights four and five: "),
          "adjust tone before level if the target sound remains obvious.",
        ),
        item(
          strong("Nights six and seven: "),
          "test a timer if the disturbance is limited to the start of the night.",
        ),
      ),
      paragraph(
        "This is a personal setup check, not a clinical trial. Keep the room, bedtime, and speaker as consistent as practical. Judge the result by awakenings, morning alertness, comfort, and whether the setup keeps demanding more volume—not by whether one night felt unusually good.",
      ),
      heading("When to turn it down or choose another method"),
      paragraph(
        "Stop or reduce the sound if you notice ringing, muffled hearing, headaches, worse sleep, a need to keep raising the level, or missed alarms. Earplugs, door seals, moving the bed, quieter equipment, or addressing the source may be better when the room is genuinely loud. Persistent insomnia, loud snoring, gasping, or disabling daytime sleepiness is not a volume-setting problem.",
      ),
      paragraph(
        "In Sleepyland, start with the noise slider well below halfway, choose the least intrusive color, and use the timer when the sound is only a sleep-onset cue. The controls are intentionally relative: your ears, speaker, room, and approximate pillow measurement—not a web page’s universal number—determine the lowest useful setup.",
      ),
    ],
  },
  {
    slug: "sound-masking-vs-earplugs-vs-noise-cancelling",
    title: "Sound Masking vs Earplugs vs Noise Cancellation for Sleep",
    dek:
      "Masking adds sound, earplugs reduce sound at the ear, and active cancellation creates an opposing signal near the ear. Choosing well starts by naming the operation—not buying three products that solve different problems.",
    seoDescription:
      "Compare sound masking, earplugs, passive isolation, and active noise cancellation for sleep by mechanism, frequency, comfort, alarms, and evidence.",
    focusPhrase: "sound masking vs earplugs vs noise cancellation",
    keywords: [
      "sound masking vs earplugs",
      "white noise vs earplugs for sleep",
      "noise cancelling for sleep",
      "how to block noise while sleeping",
      "sleep earbuds vs earplugs",
    ],
    tags: ["sleep", "sound"],
    evidenceLabel: "Mechanisms clear; direct sleep comparisons limited",
    publishedAt: "2026-07-24",
    updatedAt: "2026-07-24",
    sourceIds: [
      "basner2026",
      "noiseAidReview2020",
      "environmentalNoiseWho",
      "safeListening2026",
      "nioshHearingProtection2024",
      "maskingReview2021",
      "ancHeadphones2012",
    ],
    relatedSlugs: [
      "how-sound-masking-works",
      "best-sleep-sounds",
      "how-to-use-white-noise-for-sleep",
    ],
    body: [
      callout(
        "Choose the operation",
        "Reduce the source or sound path when possible. Use earplugs or passive isolation when you need less sound at the ear. Use active cancellation mainly for steady low-frequency rumble near the ear. Use masking when a modest background can make remaining events less noticeable. None is universally best, and combining them changes alarm awareness and comfort.",
      ),
      heading("Four different ways to make a room feel quieter"),
      paragraph(
        "People often use “block,” “cancel,” and “mask” as synonyms. They are not. A door seal reduces transmission. An earplug creates a passive barrier at the ear canal. Active noise cancellation estimates an incoming waveform and produces an opposing signal close to the ear. A masker adds sound so the unwanted signal is harder to detect or understand.",
      ),
      paragraph(
        "Auditory masking is a perceptual effect, not deletion. The ",
        link(
          "power-spectrum model reviewed in human masking research",
          RESEARCH_SOURCES.maskingReview2021.url,
        ),
        " describes detection in terms of energy passing through auditory filters or critical bands. In practical language: spectrum overlap and level matter. A low rumble, a voice, and a door slam do not present the same masking problem.",
      ),
      table(
        "A decision matrix for nighttime noise control",
        ["Method", "What changes", "Usually strongest for", "Main limits", "Nighttime tradeoff"],
        [
          item("Source or path reduction"),
          item("Less acoustic energy enters the room"),
          item("Rattles, gaps, appliances, windows, shared-wall paths"),
          item("Can require repair, relocation, sealing, or building work"),
          item("Adds no sound and preserves ear comfort"),
        ],
        [
          item("Earplugs or passive isolation"),
          item("A physical barrier reduces sound reaching the ear"),
          item("Broadband and higher-frequency events when fit is good"),
          item("Fit varies; low bass and structure-borne vibration remain difficult"),
          item("Can affect comfort, alarms, occlusion, and side sleeping"),
        ],
        [
          item("Active noise cancellation"),
          item("Electronics create anti-noise near the ear"),
          item("Steady low-frequency engines, ventilation, and travel rumble"),
          item("Device-dependent; less complete for fast, spatial, or high-frequency events"),
          item("Requires a worn device, battery, fit, and safe playback behavior"),
        ],
        [
          item("Sound masking"),
          item("A controlled background reduces perceptual contrast"),
          item("Moderate speech, hallway sounds, traffic variation, and familiar cues"),
          item("Adds exposure and cannot make a loud room quiet"),
          item("Speaker-friendly, but may disturb a partner or hide alarms"),
        ],
      ),
      heading("What the newest direct comparison found"),
      paragraph(
        "The strongest recent sleep comparison tested pink noise and earplugs against intermittent environmental noise in 25 healthy adults. In that seven-night laboratory study, earplugs mitigated nearly all measured environmental-noise effects until the highest 65 dBA events. Continuous pink noise at 40 or 50 dBA did not protect overall sleep structure and reduced REM sleep; adding it to the environmental events produced only small improvements in some fragmentation measures.",
      ),
      paragraph(
        "That result favors earplugs for the tested traffic-like events, not for every sleeper and every sound. Participants were healthy young adults, the earplugs were part of a controlled protocol, and sleep devices involve comfort and fit over many nights. It does establish one important correction: adding broadband sound is not automatically gentler or more effective than reducing incoming sound.",
      ),
      heading("Earplugs work only as well as their fit"),
      paragraph(
        "Package ratings come from standardized tests. Real ears, insertion depth, movement, reuse, and material change the result. ",
        link(
          "NIOSH hearing-protection guidance",
          RESEARCH_SOURCES.nioshHearingProtection2024.url,
        ),
        " emphasizes fit testing because the protection a wearer actually receives can differ substantially from a label.",
      ),
      unordered(
        item(
          strong("Foam plugs: "),
          "often provide broad passive reduction when rolled and inserted correctly, but comfort and consistent fit vary.",
        ),
        item(
          strong("Premolded or silicone plugs: "),
          "may be easier to reuse but still depend on ear shape and seal.",
        ),
        item(
          strong("Custom plugs: "),
          "can improve fit and comfort for some people, but they are not a guarantee of complete quiet.",
        ),
        item(
          strong("Any plug: "),
          "can reduce alarm, child, partner, or emergency audibility. Decide what must remain hearable.",
        ),
      ),
      paragraph(
        "Earplugs do not stop structure-borne vibration, and no passive plug erases every frequency. If you feel pain, pressure, irritation, or recurring ear symptoms, stop experimenting and seek appropriate hearing care rather than forcing a tighter seal.",
      ),
      heading("What active noise cancellation is actually good at"),
      paragraph(
        "ANC is physical cancellation near the listening point, not a room-wide silence field. Microphones and electronics estimate the incoming sound, then a driver produces an opposing waveform. Long wavelengths and predictable low-frequency components provide more time and spatial tolerance for the control system than abrupt high-frequency events.",
      ),
      paragraph(
        "In a ",
        link(
          "26-person study of commercial noise-cancelling headphones",
          RESEARCH_SOURCES.ancHeadphones2012.url,
        ),
        ", passive headphone construction reduced some noise, while switching cancellation on produced additional low-frequency reduction. Performance differed by device and by street versus subway noise. That supports ANC for steady rumble; it does not establish that sleeping in a particular headphone is comfortable or safe all night.",
      ),
      paragraph(
        "NIOSH also notes that active cancellation is not hearing protection unless the device carries an appropriate noise-reduction rating. Silence perception and hearing protection are different claims. For sleep, a worn device also introduces pressure, heat, battery, charging, alarm, and side-sleeping tradeoffs.",
      ),
      heading("Masking is useful when contrast is the problem"),
      paragraph(
        "A quiet bedroom interrupted by modest voices or traffic peaks can feel more disruptive than a slightly louder but steadier room. Masking raises the background around those events. It is most efficient when the chosen spectrum overlaps the target; simply turning up bass to cover speech or bright hiss to cover low vibration wastes level.",
      ),
      paragraph(
        "The evidence for continuous broadband noise as a general sleep aid remains mixed. Its strongest practical case is specific: an irregular environment that cannot yet be made quieter, a modest masker, and a listener who finds that texture less disruptive than the original contrast. It is a weaker choice when the room is already quiet or the intruding events are so loud that the masker must dominate.",
      ),
      heading("Combine methods in the right order"),
      ordered(
        item(
          strong("Reduce the source. "),
          "Silence alerts, stabilize a vent, lower a television, or address the appliance.",
        ),
        item(
          strong("Reduce the path. "),
          "Close gaps, move the bed, add mass or sealing, or choose the quieter room.",
        ),
        item(
          strong("Reduce sound at the ear. "),
          "Try comfortable, correctly fitted passive protection when alarms and communication allow.",
        ),
        item(
          strong("Use ANC for the remaining low steady component. "),
          "Do not expect it to erase voices, bangs, or a whole room.",
        ),
        item(
          strong("Add the least masking sound needed. "),
          "Match spectrum before level and recheck alarm audibility.",
        ),
      ),
      paragraph(
        "Layering methods can work because each handles a different part of the problem. It can also over-isolate a sleeper. Test alarms, smoke and carbon-monoxide alerts, caregiving needs, and a partner’s ability to wake you before adopting a combined setup.",
      ),
      heading("A quick choice by disturbance"),
      unordered(
        item(
          strong("Steady engine or HVAC rumble: "),
          "source reduction first; ANC or dark masking may help the remaining low-frequency component.",
        ),
        item(
          strong("Speech, television, or hallway voices: "),
          "passive isolation and a pinker masker usually address more of the relevant spectrum than ANC alone.",
        ),
        item(
          strong("Doors, footsteps, and intermittent impacts: "),
          "fix the path or source where possible; a loud continuous masker is an inefficient response to rare peaks.",
        ),
        item(
          strong("A snoring partner: "),
          "consider position, room arrangement, and passive reduction. Loud snoring with gasping or pauses can warrant medical evaluation; masking is not treatment.",
        ),
        item(
          strong("An already quiet room: "),
          "silence or a brief familiar cue may be better than adding an all-night baseline.",
        ),
      ),
      heading("Where Sleepyland fits"),
      paragraph(
        "Sleepyland demonstrates masking only. It does not claim to cancel sound, protect hearing, or substitute for a quieter room. Use the spectrum and tone controls to find the least intrusive overlap with the remaining disturbance, keep the level modest, and use the timer when the problem is limited to sleep onset.",
      ),
      paragraph(
        "The best choice is the one that removes the most unwanted contrast with the least new burden. Sometimes that is a low brown-noise mix. Sometimes it is a correctly fitted earplug, a sealed door, a moved bed, or no added sound at all.",
      ),
    ],
  },
  {
    slug: "why-fan-noise-helps-sleep",
    title: "Why Fan Noise Helps Some People Sleep",
    dek:
      "A fan combines several experiences that search results often collapse into “white noise”: broadband airflow, mechanical tones, cooling, moving air, and a learned bedtime cue. The sound may help, but the closest direct home study did not find a significant sleep benefit.",
    seoDescription:
      "Why does fan noise help sleep? Separate masking, mechanical hum, cooling, airflow, habit, research limits, and how to recreate the useful sound safely.",
    focusPhrase: "why fan noise helps sleep",
    keywords: [
      "fan noise sleep",
      "why does fan noise help sleep",
      "fan sound for sleeping",
      "air conditioner noise sleep",
      "is fan noise bad for sleeping",
    ],
    tags: ["sleep", "sound", "environment"],
    evidenceLabel: "Plausible mechanisms; direct sleep benefit unproven",
    publishedAt: "2026-07-24",
    updatedAt: "2026-07-24",
    sourceIds: [
      "acSound2019",
      "fanNoiseReview2021",
      "thermalSleep2012",
      "noiseAidReview2020",
      "whiteNoiseMeta2025",
      "basner2026",
      "safeListening2026",
    ],
    relatedSlugs: [
      "how-to-use-white-noise-for-sleep",
      "white-pink-brown-noise-for-sleep",
      "airplane-sound-for-sleep",
    ],
    body: [
      callout(
        "The short answer",
        "Fan noise can reduce contrast around small nighttime sounds, feel familiar, and arrive with cooling or airflow that improves comfort. A fan is not pure white noise, and direct evidence that its sound improves healthy adult sleep is weak. If it helps, identify whether the useful part is the sound, the temperature, the air movement, or the ritual.",
      ),
      heading("A fan is more than a white-noise machine"),
      paragraph(
        "Real fan sound is a mixture. Turbulent airflow creates broadband energy, while rotation, blades, motor, housing, and speed can add narrow tones and slow modulation. A ",
        link(
          "technical fan-noise review",
          RESEARCH_SOURCES.fanNoiseReview2021.url,
        ),
        " describes blade-passing harmonics superimposed on broadband components. Household fans are smaller than aeroengine test systems, but the acoustic distinction is the same: hiss or rush plus mechanical structure.",
      ),
      paragraph(
        "That structure helps explain why a recording labeled “white noise” may not replace someone’s familiar box fan. The listener may prefer a particular spectral tilt, motor tone, fluctuation, room reflection, or airflow sensation—not equal power per hertz.",
      ),
      table(
        "What a fan contributes—and what a sound generator can reproduce",
        ["Component", "What it may do", "Evidence boundary", "Sleepyland equivalent"],
        [
          item("Broadband airflow sound"),
          item("Reduces contrast around moderate voices, traffic, or room events"),
          item("Masking is plausible; general sleep benefit remains mixed"),
          item("Pink or brown noise shaped toward the target"),
        ],
        [
          item("Blade and motor tones"),
          item("Creates the recognizable identity of one familiar fan"),
          item("Fan acoustics are established; sleep advantage is not"),
          item("Only an approximation through spectral shaping"),
        ],
        [
          item("Cooling"),
          item("Changes thermal comfort and heat load"),
          item("Thermal environment affects sleep, but comfort varies with bedding, humidity, and person"),
          item("Cannot be reproduced by audio"),
        ],
        [
          item("Airflow on skin"),
          item("Adds a tactile cue and may improve comfort in heat"),
          item("Distinct from the sound itself and not always comfortable"),
          item("Cannot be reproduced by audio"),
        ],
        [
          item("Learned bedtime cue"),
          item("Signals a familiar routine after repeated pairing"),
          item("Plausible conditioning, not proof of changed sleep stages"),
          item("A consistent saved sound can serve as a cue"),
        ],
      ),
      heading("The closest direct home study found no significant benefit"),
      paragraph(
        "Researchers tested standardized air-conditioner sound in 48 healthy young adults at home over two randomized nights. The sound condition used 43 dB playback during winter while light and temperature were monitored. Actigraphy found no significant difference in sleep duration, sleep-onset latency, or sleep efficiency between the air-conditioner-sound and no-sound nights.",
      ),
      paragraph(
        "The ",
        link(
          "authors’ conclusion",
          RESEARCH_SOURCES.acSound2019.url,
        ),
        " was appropriately narrow: this AC sound did not produce a significant positive effect in that protocol. Two nights, one standardized sound, young healthy adults, and actigraphy cannot settle every fan preference. But the study is a strong reason not to say fan noise is clinically proven to improve sleep.",
      ),
      paragraph(
        "Broader white-noise reviews are mixed for the same reason. Clinical wards, self-reported sleep, actigraphy, EEG sleep stages, habitual users, and quiet healthy sleepers are different experiments. The perceived comfort of a fan can be real without proving a universal average benefit.",
      ),
      heading("Masking is the clearest acoustic explanation"),
      paragraph(
        "A steady fan raises the background around creaks, plumbing, distant voices, and passing vehicles. The events still reach the ear, but the jump from baseline to event is smaller. This is most useful when interruptions are moderate. If a fan must be uncomfortably loud to cover them, source reduction or passive isolation is the better next move.",
      ),
      paragraph(
        "Spectrum matters. Broadband airflow can overlap a wide range, while a darker mechanical hum can make low urban or ventilation noise less distinct. Tonal whine, bearing rattle, oscillation clicks, and sudden speed changes can do the opposite by adding salient events.",
      ),
      heading("Cooling is a separate sleep mechanism"),
      paragraph(
        "A fan can help because the room or sleeper is too warm, even if its sound contributes nothing. A ",
        link(
          "review of thermal environment and human sleep",
          RESEARCH_SOURCES.thermalSleep2012.url,
        ),
        " explains that heat, cold, humidity, bedding, clothing, and thermoregulation interact. In real-life conditions with bedding, excessive heat can increase wakefulness and reduce slow-wave or REM sleep. There is no single ideal fan setting for every body and climate.",
      ),
      paragraph(
        "This distinction is practical. If cooling is the helpful part, replacing the fan with a recording may fail. If sound is the helpful part, a synthetic fan-like texture can preserve the cue without blowing air, circulating dust, or changing room temperature. Test those two components separately.",
      ),
      heading("Familiarity can become a cue without becoming a cure"),
      paragraph(
        "Repeatedly turning on the same fan during a stable bedtime routine can make its sound predictive. That is consistent with ordinary conditioning: a cue acquires meaning through repetition. It does not mean the motor frequency directly entrains the brain, and it does not prove addiction when someone misses a familiar sound while traveling.",
      ),
      paragraph(
        "A learned cue can still be useful. The practical questions are whether the volume stays modest, the fan remains optional enough for travel, the setup preserves alarms, and the ritual is not replacing attention to persistent sleep difficulty.",
      ),
      heading("How to recreate the useful part of fan sound"),
      ordered(
        item(
          strong("Identify the component. "),
          "Compare the real fan with a recording or synthetic noise while keeping the room temperature similar.",
        ),
        item(
          strong("Start with pink or brown. "),
          "Pink approximates broad airflow more evenly; brown emphasizes a deeper box-fan or ventilation character.",
        ),
        item(
          strong("Shape before raising level. "),
          "A slightly brighter tone can cover voices; a darker tone can match low mechanical ambience.",
        ),
        item(
          strong("Avoid obvious loops and events. "),
          "Clicks, repeated recordings, dramatic gusts, and sudden oscillation are more informative than a steady fan floor.",
        ),
        item(
          strong("Match the timer to the job. "),
          "Use a fade for a bedtime cue; continue only when the environmental disturbance continues.",
        ),
      ),
      paragraph(
        "Sleepyland synthesizes noise continuously rather than replaying a short fan loop. Brown noise with a dark tone is the closest starting point for a low mechanical hum; pink with a balanced tone resembles broader airflow. Slow waves add organic variation, but they are not required for a fan-like result.",
      ),
      heading("When a real fan is the wrong tool"),
      paragraph(
        "Turn down, repair, clean, or replace a fan that rattles, squeals, changes speed unpredictably, or needs to be loud beside the bed. Keep moving parts and cords safely positioned, do not cover ventilation, and separate claims about comfort from claims about treating allergies, breathing problems, or insomnia.",
      ),
      paragraph(
        "The ",
        link(
          "WHO safe-listening framework",
          RESEARCH_SOURCES.safeListening2026.url,
        ),
        " emphasizes level and duration together. That applies whether the sound comes from a speaker, air conditioner, or fan. The best fan-like sleep sound is not the most realistic or enveloping one; it is the quietest stable texture that solves a specific problem without becoming a new disturbance.",
      ),
    ],
  },
  {
    slug: "white-pink-brown-noise-for-sleep",
    title: "White, Pink, or Brown Noise for Sleep? The Real Differences",
    dek:
      "The colors are engineering descriptions, not different medicines. Their spectral slopes change what you hear, what they mask, and how much volume feels comfortable.",
    seoDescription:
      "Compare white, pink, and brown noise for sleep: frequency slopes, masking strengths, research limits, safe volume, and how to choose a sound.",
    focusPhrase: "white pink brown noise for sleep",
    keywords: [
      "white noise vs pink noise vs brown noise",
      "best color noise for sleep",
      "brown noise sleep",
      "pink noise sleep",
      "green noise for sleep",
      "white noise machine",
    ],
    tags: ["sleep", "sound"],
    evidenceLabel: "Physics established; sleep superiority unproven",
    publishedAt: "2026-07-24",
    updatedAt: "2026-08-28",
    sourceIds: [
      "basner2026",
      "whiteNoiseMeta2025",
      "auditoryReview2022",
      "noiseAidReview2020",
      "safeListening2026",
    ],
    relatedSlugs: [
      "best-sleep-sounds",
      "what-frequency-helps-you-sleep",
      "how-sound-masking-works",
    ],
    body: [
      callout(
        "Choose by the problem, not the trend",
        "White noise is brighter and often masks speech and sharp sounds efficiently. Pink is gentler. Brown is deeper and often more comfortable at bedtime. Research has not established one universal winner.",
      ),
      paragraph(
        "“Noise color” describes how signal power is distributed across frequency. It does not mean the sound contains light, and it does not assign a biological effect. The names are useful because two signals can contain the same broad range of frequencies while feeling radically different.",
      ),
      heading("White noise: flat per hertz, bright to the ear"),
      paragraph(
        "Ideal white noise has equal average power in every one-hertz-wide band. An octave from 10,000 to 20,000 Hz contains ten thousand such bands, while the octave from 100 to 200 Hz contains only one hundred. That arithmetic gives the high end far more total energy, which is why true white noise sounds like strong hiss rather than a neutral “all frequencies equally loud” blanket.",
      ),
      paragraph(
        "That brightness is not automatically bad. Higher-frequency energy can be useful against consonants, clinking, distant voices, and other sharp events. But if the masker itself feels abrasive, you may need less high-frequency energy rather than more overall volume.",
      ),
      heading("Pink noise: equal energy per octave"),
      paragraph(
        "Pink noise reduces power as frequency rises, approximately 3 dB per octave. Each octave carries roughly equal energy, which better matches the logarithmic way people organize pitch. The result is fuller and less hissy than white noise. Rain, wind, and surf are often described as pink-like, although real natural sounds are time-varying and do not follow one perfect slope.",
      ),
      paragraph(
        "Pink noise appears frequently in sleep research, including precisely timed pulses intended to interact with measured slow-wave sleep. That closed-loop laboratory technique is not the same as playing continuous pink noise from a speaker. In the ",
        link("2026 Basner trial", RESEARCH_SOURCES.basner2026.url),
        ", continuous pink noise reduced REM sleep in the tested conditions, so “pink” should not be shorthand for proven sleep enhancement.",
      ),
      heading("Brown noise: a steeper, bass-heavy slope"),
      paragraph(
        "Brown noise—also called Brownian or red noise—drops by about 6 dB per octave. The name comes from Brownian motion, not from the color brown. Its high frequencies recede quickly, leaving a low, rounded rumble that many listeners compare with heavy rain, distant surf, ventilation, or an aircraft cabin.",
      ),
      paragraph(
        "Brown noise is one of the most searched sleep sounds, but popularity is not comparative evidence. There are far fewer controlled sleep studies of standardized brown noise than of white or pink noise. Its strongest practical case is comfort: a deeper spectrum can remain audible without the edge that makes some people reject white noise.",
      ),
      heading("Masking depends on frequency overlap"),
      paragraph(
        "A masker works best when it overlaps the intrusive sound. Bright white or pink noise may cover speech and a squeaky hallway better. Dark brown noise may make a distant engine, HVAC drone, or low urban rumble less distinct, but bass is difficult for small phone speakers to reproduce and can travel through walls. No color cancels sound; each changes the contrast within a shared spectrum.",
      ),
      unordered(
        item(
          strong("Voices and television: "),
          "start with pink or a moderately bright tone before raising volume.",
        ),
        item(
          strong("Traffic and ventilation: "),
          "try brown or dark pink, then check whether the speaker produces clean low frequencies.",
        ),
        item(
          strong("Mixed apartment noise: "),
          "pink often offers a balanced starting spectrum.",
        ),
        item(
          strong("A quiet room with a busy mind: "),
          "choose the least interesting, most comfortable sound—or choose silence. Masking is not required when there is nothing to mask.",
        ),
      ),
      heading("Why study results conflict"),
      paragraph(
        "The label on the sound is only one variable. Studies use different levels, durations, speakers, participants, bedrooms, hospital environments, outcomes, and definitions of “white noise.” Some measure a questionnaire the next morning; others measure EEG sleep stages. A sound can reduce reported disturbance yet change REM or deep sleep. It can benefit a noisy group while doing nothing for a quiet group.",
      ),
      paragraph(
        "The ",
        link(
          "2022 systematic review",
          RESEARCH_SOURCES.auditoryReview2022.url,
        ),
        " found positive studies across white, pink, and multiaudio stimulation but no strong overall evidence. A ",
        link(
          "2025 meta-analysis",
          RESEARCH_SOURCES.whiteNoiseMeta2025.url,
        ),
        " found possible white-noise benefits while emphasizing heterogeneity and methodological limits. Those are reasons to personalize conservatively, not to declare that sound never helps.",
      ),
      heading("How to choose without chasing color names"),
      ordered(
        item(
          "Set the room and speaker where you will actually sleep. Speaker response can transform a nominal color.",
        ),
        item(
          "Begin at a low level with pink or brown. Increase brightness only if the target sound remains conspicuous.",
        ),
        item(
          "Adjust tone before volume. A better spectral match often feels quieter and masks more effectively.",
        ),
        item(
          "Try the same setting for several nights, ideally with a timer, and notice awakenings and morning alertness.",
        ),
        item(
          "Keep the lowest setting that works. Do not turn up a masker to erase every trace of the environment.",
        ),
      ),
      paragraph(
        "Sleepyland exposes both color and tone because a fixed label is too coarse. Brown with a brighter tone can approach dark pink; pink with a dark tone can feel brown-like. The useful setting is the one that remains background while making disruptive events less salient.",
      ),
      heading("What about green noise for sleep, and the other colors?"),
      paragraph(
        "Green noise is widely used online for a midrange-heavy, nature-like sound, but it does not have one universally adopted engineering definition. Search popularity does not standardize the label, and the sleep reviews do not establish that a newly named green spectrum outperforms white, pink, or brown noise.",
      ),
      paragraph(
        "Blue and violet noise have established rising spectral slopes and therefore sound progressively brighter than white noise. Gray noise is shaped around an equal-loudness model so that frequencies are perceived more evenly, although the exact result depends on the chosen curve and listening level. Black noise can mean near-silence, silence interrupted by events, or simply a product name. These labels may describe useful technical signals, but they are not separate proven sleep treatments.",
      ),
      paragraph(
        "Fans and drones are different again. Their spectra contain broadband airflow plus stable tones and mechanical harmonics. They may feel calming because they are continuous, low in information, familiar, and effective at masking—not because they belong to a secret color category.",
      ),
      heading("Frequently asked questions"),
      paragraph(
        strong("Is brown noise scientifically better for sleep? "),
        "No controlled evidence currently establishes it as the universal best color. Many people prefer its lower spectrum, which is a valid comfort preference.",
      ),
      paragraph(
        strong("Is pink noise dangerous? "),
        "The 2026 study warrants caution about continuous exposure under its tested conditions, not panic about every quiet pink-noise session. Level, duration, context, age, and individual response matter.",
      ),
      paragraph(
        strong("Can I use a phone speaker? "),
        "Yes, but small speakers reproduce deep brown noise poorly. If raising volume adds harsh mids without useful bass, use a better speaker rather than continuing upward.",
      ),
      paragraph(
        strong("What volume should a sleep sound be? "),
        "There is no reliable universal slider percentage. Use the lowest level that reduces the contrast of interruptions, follow device exposure monitoring when available, avoid prolonged loud headphone listening, and use the ",
        link(
          "white-noise setup guide",
          researchArticlePath("how-to-use-white-noise-for-sleep"),
        ),
        " for placement and timer decisions.",
      ),
    ],
  },
  {
    slug: "ocean-waves-for-sleep",
    title: "Why Ocean Waves Feel Calming—and What Sleep Research Can Prove",
    dek:
      "Ocean sound combines masking, slow energy changes, natural variation, and learned meaning. Those mechanisms are plausible; direct proof of better sleep in healthy adults is still limited.",
    seoDescription:
      "Why do ocean waves help sleep? Explore sound masking, natural-sound research, wave rhythm, direct sleep studies, and how to mix ocean sounds safely.",
    focusPhrase: "ocean waves for sleep research",
    keywords: [
      "ocean sounds for sleep",
      "wave sounds sleep",
      "natural sounds relaxation",
      "ocean noise sound machine",
    ],
    tags: ["sleep", "sound"],
    evidenceLabel: "Relaxation evidence stronger than sleep evidence",
    publishedAt: "2026-07-24",
    updatedAt: "2026-07-24",
    sourceIds: [
      "naturalStress2024",
      "naturalHealth2021",
      "oceanCabg1992",
      "oceanIcu2020",
      "auditoryReview2022",
      "safeListening2026",
    ],
    relatedSlugs: [
      "noise-and-sleep-2026",
      "why-fan-noise-helps-sleep",
      "white-pink-brown-noise-for-sleep",
    ],
    body: [
      callout(
        "What the evidence supports",
        "Natural sounds can support stress recovery, and ocean sound has helped in some hospital sleep studies. We do not yet have strong direct evidence that wave audio improves objective sleep in healthy adults. Its likely value is a combination of masking, low information, gentle variation, and positive association.",
      ),
      heading("A wave is more than colored noise"),
      paragraph(
        "A spectral snapshot of surf may resemble pink or brown noise, but its identity lives in time. Energy gathers, a breaker adds a brighter transient, foam spreads, wash recedes, and the next event arrives with similar structure at a slightly different interval and height. The pattern is recognizable without being perfectly repetitive.",
      ),
      paragraph(
        "That middle ground matters. A short loop can reveal its seam and invite prediction. Chaotic crashes can trigger attention. A naturalistic sequence offers bounded surprise: enough variation to avoid an obvious loop, but enough regularity that the nervous system does not need to interpret every event as new.",
      ),
      heading("Mechanism one: waves mask interruptions"),
      paragraph(
        "Surf is broadband. The wash carries sustained mid and high frequencies; swell and undertow add lower energy; breakers briefly raise the masking floor. Together they can reduce the contrast of distant speech, traffic, plumbing, or a hotel corridor. This is ordinary auditory masking, not cancellation.",
      ),
      paragraph(
        "Wave sound is also intermittent, so its masking strength rises and falls. A low continuous noise bed beneath the waves can fill those valleys. That is why many people prefer a mix rather than waves alone: the noise layer handles steady coverage while the surf supplies a more organic foreground.",
      ),
      heading("Mechanism two: natural sound may reduce arousal"),
      paragraph(
        "A ",
        link(
          "2024 systematic review and meta-analysis",
          RESEARCH_SOURCES.naturalStress2024.url,
        ),
        " found that natural sounds produced some favorable changes in heart rate, blood pressure, and respiratory rate compared with quiet, although subjective stress results were inconsistent. A broader ",
        link(
          "2021 synthesis",
          RESEARCH_SOURCES.naturalHealth2021.url,
        ),
        " linked natural sounds with lower stress and annoyance and better positive affect, with water sounds showing strong average benefits in the included literature.",
      ),
      paragraph(
        "Those outcomes matter at bedtime because arousal can delay settling. They still do not prove that an ocean track increases N3 deep sleep or REM sleep. Relaxation before sleep, perceived sleep quality, and measured sleep architecture should not be collapsed into one promise.",
      ),
      heading("What direct ocean-sleep studies show"),
      paragraph(
        "The direct literature is small and context-specific. An ",
        link(
          "older postoperative study",
          RESEARCH_SOURCES.oceanCabg1992.url,
        ),
        " reported benefits after coronary bypass surgery. A later ",
        link(
          "ICU randomized trial",
          RESEARCH_SOURCES.oceanIcu2020.url,
        ),
        " compared ocean sound with earplugs and an eye mask. Clinical wards are noisy, stressful environments where any reduction in disruptive contrast may matter more than it would in a quiet home bedroom.",
      ),
      paragraph(
        "These studies make ocean sound reasonable to investigate, not proven for every sleeper. Healthy-adult trials with objective sleep measures, well-defined sound levels, realistic wave dynamics, and comparison against quiet and other maskers remain a gap.",
      ),
      heading("Does the wave interval entrain sleep?"),
      paragraph(
        "There is no established magic ten-second ocean interval that synchronizes human sleep. Real swell periods and breaking patterns vary with weather, bathymetry, shoreline shape, and wave groups. Breathing may spontaneously slow while listening to a calm rhythm, but that is different from proving that wave timing drives brainwaves into a sleep stage.",
      ),
      paragraph(
        "A slow average interval can still be good design. It leaves quiet space, avoids a frantic shorebreak character, and creates a sense of long nighttime swell. Organic timing should wander around that average rather than firing one identical crash on a metronome.",
      ),
      heading("What makes synthesized waves sound convincing"),
      unordered(
        item(
          strong("Correlated swell groups: "),
          "several stronger or weaker waves cluster together instead of drawing every height independently.",
        ),
        item(
          strong("Variable breaker anatomy: "),
          "surge, impact, cavity noise, foam, wash, and undertow occupy different frequency ranges and timescales.",
        ),
        item(
          strong("Bounded timing variance: "),
          "intervals drift without creating implausibly rapid doubles or long accidental silence.",
        ),
        item(
          strong("Micro-events: "),
          "small splashes and foam detail prevent one repeated envelope from becoming audible.",
        ),
        item(
          strong("Shared spectral shaping: "),
          "the surf can be tuned darker or brighter to sit naturally beside brown, pink, or white noise.",
        ),
      ),
      paragraph(
        "Sleepyland builds its wave layer from those moving parts rather than playing a recorded loop. That does not make it clinically superior. It makes the acoustic experience less repetitive and gives the listener direct control over the balance between masking noise and changing surf.",
      ),
      heading("A practical nighttime mix"),
      ordered(
        item(
          "Begin with waves low enough that individual breakers do not feel like alerts.",
        ),
        item(
          "Add a quiet brown or pink bed if outside sounds remain obvious between waves.",
        ),
        item(
          "Use a slower average interval for open-ocean calm and a shorter interval only if you prefer active shoreline texture.",
        ),
        item(
          "Darken the shared tone if foam sounds sharp; brighten it if speech remains too intelligible.",
        ),
        item(
          "Use a timer when the sound is primarily a wind-down cue, and reassess if morning sleep feels worse.",
        ),
      ),
      paragraph(
        "Ocean sound works best as a soundscape, not a dosage. The goal is not to simulate a storm at realistic level. It is to create a quiet, predictable acoustic boundary around an otherwise irregular room.",
      ),
    ],
  },
  {
    slug: "why-car-rides-make-you-sleepy",
    title: "Why Car Rides Make You Sleepy: Rocking, Vibration, and Sopite Syndrome",
    dek:
      "The sleepy passenger effect has names: motion-induced drowsiness, vestibular stimulation, whole-body vibration, and—in a stronger form—sopite syndrome. Sound is only one part of it.",
    seoDescription:
      "Why do car rides make you sleepy? Learn about sopite syndrome, vestibular motion, vibration, rocking research, road noise, and conditioned sleep cues.",
    focusPhrase: "why car rides make you sleepy",
    keywords: [
      "car ride sleepiness",
      "sopite syndrome",
      "motion induced drowsiness",
      "rocking sleep research",
      "vehicle vibration sleep",
    ],
    tags: ["sleep", "environment"],
    evidenceLabel: "Physical-motion mechanism supported",
    publishedAt: "2026-07-24",
    updatedAt: "2026-07-24",
    sourceIds: [
      "sopite2020",
      "vehicleVibration2018",
      "rockingNap2011",
      "rockingNight2019",
      "cabinNoise2022",
    ],
    relatedSlugs: [
      "airplane-sound-for-sleep",
      "why-fan-noise-helps-sleep",
      "noise-and-sleep-2026",
    ],
    body: [
      callout(
        "The key distinction",
        "A moving car supplies low-frequency vestibular motion and whole-body vibration as well as steady sound. A recording can recreate the acoustic cue, but it cannot reproduce the physical rocking that human studies have linked with drowsiness and sleep changes.",
      ),
      heading("The term people are looking for: sopite syndrome"),
      paragraph(
        "Sopite syndrome describes motion-related drowsiness, fatigue, yawning, low motivation, and sometimes irritability. It can occur with little or no nausea, which is why a sleepy passenger may not think of the experience as motion sickness. The name comes from the Latin-rooted idea of putting someone to sleep.",
      ),
      paragraph(
        "In a ",
        link(
          "2020 laboratory study",
          RESEARCH_SOURCES.sopite2020.url,
        ),
        ", imperceptibly slow sinusoidal motion from 0.03 to 0.2 Hz altered sympathetic activity and induced the drowsy state without nausea. That supports a vestibular mechanism: the inner-ear organs that sense linear acceleration are participating even when the rider is not consciously tracking each movement.",
      ),
      heading("Rocking can alter human sleep"),
      paragraph(
        "The familiar image of rocking a baby has an adult laboratory analogue. A ",
        link(
          "2011 nap experiment",
          RESEARCH_SOURCES.rockingNap2011.url,
        ),
        " used gentle 0.25 Hz lateral movement and found a faster transition into sleep with changes in NREM slow oscillations and sleep spindles. A ",
        link(
          "2019 whole-night study",
          RESEARCH_SOURCES.rockingNight2019.url,
        ),
        " reported better sleep maintenance, more deep sleep, and memory-related changes in healthy sleepers.",
      ),
      paragraph(
        "These were controlled rocking beds, not ordinary vehicles, and their movements were selected rather than chaotic. They show that physical rhythmic motion can interact with sleep; they do not establish that every bumpy road improves it.",
      ),
      heading("Whole-body vibration adds another route to drowsiness"),
      paragraph(
        "A car seat transmits engine, tire, suspension, and road vibration through the body. In a ",
        link(
          "2018 seated-vibration experiment",
          RESEARCH_SOURCES.vehicleVibration2018.url,
        ),
        ", exposure to vehicle-like vibration increased physiological signs of drowsiness within about twenty minutes. Later driving research has continued to study frequency-dependent vibration and fatigue.",
      ),
      paragraph(
        "Motion and vibration overlap but are not identical. Slow swaying strongly engages vestibular sensing. Faster vibration can affect alertness through repeated mechanical stimulation, posture, monotony, and fatigue. A real ride layers both.",
      ),
      heading("What the sound contributes"),
      unordered(
        item(
          strong("Broadband masking: "),
          "tire and airflow noise reduce the contrast of smaller environmental events.",
        ),
        item(
          strong("Low information: "),
          "steady road and ventilation sound carries little language or narrative to follow.",
        ),
        item(
          strong("Monotony: "),
          "a stable sound field and unchanging passenger task reduce demands on attention.",
        ),
        item(
          strong("Conditioned association: "),
          "people who repeatedly slept as passengers may learn to associate the acoustic profile with letting go.",
        ),
        item(
          strong("Enclosure: "),
          "a dim, temperature-controlled cabin with a fixed seat removes many choices and visual tasks.",
        ),
      ),
      paragraph(
        "A brown-noise generator can approximate the low spectral tilt of road or cabin sound. That may recover masking, monotony, and learned association. It cannot move the otolith organs or vibrate the body, so describing it as the same mechanism would be inaccurate.",
      ),
      heading("Passenger sleepiness and driver sleepiness are not the same opportunity"),
      paragraph(
        "For a passenger, drowsiness may be welcome. For a driver, it is a safety warning. Motion-induced drowsiness, vibration, circadian low points, sleep debt, warm cabins, and monotonous roads can compound one another while the driver is responsible for continuous attention.",
      ),
      callout(
        "Safety",
        "Never use calming noise, binaural beats, or a deliberately sleep-associated soundscape while driving. If you become drowsy at the wheel, audio stimulation is not a substitute for stopping in a safe place and resting.",
      ),
      heading("Why the sound can work later at home"),
      paragraph(
        "A sound does not need to reproduce the entire original cause to become a cue. If low road rumble repeatedly accompanied safe passenger sleep, the acoustic component can acquire meaning through conditioning. At home, a similar dark broadband texture may signal enclosure and low demand even without motion.",
      ),
      paragraph(
        "This is a plausible explanation for people who say they sleep unusually well on cars, trains, planes, or boats and later seek those sounds online. The shared words are ",
        emphasis("motion-induced drowsiness"),
        ", ",
        emphasis("sopite syndrome"),
        ", ",
        emphasis("vestibular stimulation"),
        ", ",
        emphasis("whole-body vibration"),
        ", and ",
        emphasis("conditioned sleep cue"),
        ". Each names a different slice of the experience.",
      ),
      heading("How Sleepyland approaches the acoustic slice"),
      paragraph(
        "Start with brown noise, dark tone, and modest volume. A slow procedural wave layer can add the rise-and-fall motion metaphor without claiming to provide physical rocking. Keep the result quieter than an actual vehicle cabin: the goal is a familiar low-information texture, not a realistic recreation of road or engine level.",
      ),
    ],
  },
  {
    slug: "airplane-sound-for-sleep",
    title: "Why Airplane Cabin Sound Helps Some People Sleep",
    dek:
      "A steady cabin rumble and an aircraft passing over a bedroom are acoustically and psychologically different. One can become a familiar masker; the other is an intermittent sleep disruption.",
    seoDescription:
      "Why does airplane sound help sleep? Compare steady cabin noise with aircraft flyovers, low-frequency masking, motion, conditioning, and safe home playback.",
    focusPhrase: "airplane sound for sleep",
    keywords: [
      "airplane noise for sleep",
      "airplane sound to sleep to",
      "airplane cabin noise sleep",
      "plane sound machine",
      "aircraft cabin rumble",
    ],
    tags: ["sleep", "sound", "environment"],
    evidenceLabel: "Plausible masking and cue; no direct proof",
    publishedAt: "2026-07-24",
    updatedAt: "2026-07-24",
    sourceIds: [
      "cabinNoise2022",
      "cabinComfort2012",
      "aircraftSleep2019",
      "faaSleepProtocol2023",
      "basner2026",
      "safeListening2026",
      "environmentalNoiseWho",
      "rockingNight2019",
    ],
    relatedSlugs: [
      "why-car-rides-make-you-sleepy",
      "why-fan-noise-helps-sleep",
      "white-pink-brown-noise-for-sleep",
    ],
    body: [
      callout(
        "Cabin sound is not flyover noise",
        "People searching for airplane noise to sleep usually mean a steady, enclosed cabin-like rumble. Environmental research studies discrete aircraft events over homes, which can trigger awakenings. The same word—airplane—covers opposite acoustic patterns.",
      ),
      heading("What an airplane cabin actually sounds like"),
      paragraph(
        "A real cabin combines engine and aerodynamic energy, fuselage transmission, ventilation, airflow, seat-position differences, and tonal components. In-cabin measurements show substantial low-frequency energy rather than a single clean “brown noise” curve. The spectrum and level also change across takeoff, cruise, descent, aircraft type, and seat location.",
      ),
      paragraph(
        "A ",
        link(
          "wide-body cabin assessment",
          RESEARCH_SOURCES.cabinNoise2022.url,
        ),
        " documented dominant low-frequency components and complex spectra. A ",
        link(
          "cabin simulator study",
          RESEARCH_SOURCES.cabinComfort2012.url,
        ),
        " found that both overall level and frequency spectrum affected passenger acceptance. In other words, “plane sound” is a family resemblance, not one frequency.",
      ),
      heading("Why the steady version may feel sleepy"),
      unordered(
        item(
          strong("Low-frequency spectral tilt: "),
          "a bass-heavy texture can feel softer than bright white noise while covering engines, HVAC, and distant traffic.",
        ),
        item(
          strong("Continuous masking: "),
          "the cabin floor reduces contrast between small events, conversations, and mechanical changes.",
        ),
        item(
          strong("Predictability: "),
          "cruise sound is relatively stationary and contains little semantic information.",
        ),
        item(
          strong("Learned context: "),
          "reclining, dimming lights, relinquishing control, and repeated passenger naps can turn the sound into a cue.",
        ),
        item(
          strong("Physical motion: "),
          "vibration and slow movement can contribute to drowsiness, but audio playback cannot recreate this vestibular component.",
        ),
      ),
      paragraph(
        "The first three properties can be approximated by filtered brown or pink noise. The learned context may return when a familiar spectrum plays at home. The motion mechanism belongs to the vehicle itself, as human rocking and vibration studies make clear.",
      ),
      heading("Why aircraft over a house are different"),
      paragraph(
        "A nighttime flyover rises from the background, peaks, changes spectrum and location, then falls away. That event structure is exactly what a sleeper’s monitoring system can notice. Field and laboratory studies consistently treat aircraft events as environmental disruptions, not soothing continuous sound.",
      ),
      paragraph(
        "A ",
        link(
          "Philadelphia field pilot",
          RESEARCH_SOURCES.aircraftSleep2019.url,
        ),
        " linked individual aircraft events with sleep disturbance. The ",
        link(
          "FAA National Sleep Study protocol",
          RESEARCH_SOURCES.faaSleepProtocol2023.url,
        ),
        " is designed around the relationship between indoor event levels and awakening probability. In the ",
        link("2026 pink-noise trial", RESEARCH_SOURCES.basner2026.url),
        ", intermittent environmental noise and continuous pink noise altered different parts of sleep architecture.",
      ),
      paragraph(
        "This distinction resolves an apparent contradiction: “airplane sounds help me sleep” can be true as a report about a steady cabin cue, while “aircraft noise disrupts community sleep” is true about unpredictable events.",
      ),
      heading("Do not copy the level of a real cabin"),
      paragraph(
        "Real travel environments can be loud. A home sound machine does not need realistic sound pressure to evoke the spectral character. Recreating cabin loudness would add unnecessary exposure and could make sleep worse. The goal is recognition and masking at the lowest useful level.",
      ),
      paragraph(
        "The ",
        link(
          "World Health Organization’s safe-listening guidance",
          RESEARCH_SOURCES.safeListening2026.url,
        ),
        " stresses that level and duration work together. A slider percentage cannot reveal bedroom decibels because device output, speaker distance, room acoustics, and signal spectrum all vary.",
      ),
      heading("How to make a cabin-like sleep sound"),
      ordered(
        item(
          "Choose brown noise as the base, then darken it until hiss recedes without turning the sound into a booming tone.",
        ),
        item(
          "Place a capable speaker away from the pillow and keep the level low enough that it remains background.",
        ),
        item(
          "If voices are still clear, brighten the tone slightly before increasing volume.",
        ),
        item(
          "Add a small amount of slow waves only if you enjoy motion-like variation; keep breakers below alert level.",
        ),
        item(
          "Use a timer if the cabin cue is mainly useful while falling asleep.",
        ),
      ),
      paragraph(
        "Sleepyland’s dark brown-noise setting is intentionally airplane-like rather than a recorded aircraft preset. It contains no engine sample and makes no claim to reproduce a specific jet. That abstraction is useful: it keeps the low-information, bass-weighted character while allowing quieter playback and continuous local synthesis.",
      ),
      heading("When a masker is the wrong fix"),
      paragraph(
        "If actual aircraft, traffic, or mechanical events are entering the bedroom, source reduction, sealing gaps, moving the bed, acoustic treatment, or comfortable earplugs may provide more protection than adding sound. The latest controlled evidence found earplugs more consistently protective than pink noise under the tested environmental-noise conditions.",
      ),
      paragraph(
        "Cabin-like sound is best treated as an optional comfort cue. It can make an irregular room feel more uniform, but it cannot turn a loud bedroom into a quiet one or replace attention to persistent sleep problems.",
      ),
    ],
  },
  {
    slug: "is-eight-hours-of-sleep-necessary",
    title: "Is Eight Hours of Sleep Necessary? What Duration Misses",
    dek:
      "Eight hours is a useful planning number, not a biological pass-fail line. Adult guidance says at least seven hours regularly, while experiments show why six can feel easier than it performs.",
    seoDescription:
      "Is eight hours of sleep necessary? Adult guidance, sleep-debt experiments, natural short sleepers, and why quality, timing, and regularity matter.",
    focusPhrase: "is 8 hours of sleep necessary",
    keywords: [
      "is 8 hours of sleep necessary",
      "eight hours of sleep myth",
      "how much sleep do adults need",
      "is 7 hours of sleep enough",
      "natural short sleeper",
      "sleep duration and quality",
    ],
    tags: ["sleep"],
    evidenceLabel: "Seven-plus is guidance, not an eight-hour law",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    sourceIds: [
      "aasmDurationConsensus2015",
      "aasmDurationMethods2015",
      "vanDongen2003",
      "dec2NaturalShortSleep2009",
      "yetish2015",
      "crossSocietySleep2025",
    ],
    relatedSlugs: [
      "hunter-gatherer-sleep",
      "morning-sunlight-and-sleep",
      "noise-and-sleep-2026",
    ],
    body: [
      callout(
        "The short answer",
        "Most adults do not need exactly eight hours. The joint American Academy of Sleep Medicine and Sleep Research Society recommendation is at least seven hours regularly for healthy adults, with individual variation. Eight remains a sensible opportunity to schedule because time in bed is not the same as time asleep. A good number also has to work in waking life: stable alertness, mood, performance, and health matter more than landing on 8:00 every night.",
      ),
      heading("Where the eight-hour rule stops being useful"),
      paragraph(
        "The familiar eight-hour target compresses several different quantities into one number. Time in bed includes the minutes spent falling asleep and brief periods awake. A wearable estimates sleep through an algorithm. A laboratory can measure sleep stages, but one or two monitored nights may not represent ordinary life. Even accurate duration says nothing by itself about timing, regularity, fragmentation, breathing, or how a person functions the next day.",
      ),
      paragraph(
        "The ",
        link(
          "adult sleep-duration consensus",
          RESEARCH_SOURCES.aasmDurationConsensus2015.url,
        ),
        " chose seven or more hours as the public-health threshold for adults aged 18 to 60. It did not declare that everyone needs exactly seven, or that eight is excessive. The panel's ",
        link(
          "methods paper",
          RESEARCH_SOURCES.aasmDurationMethods2015.url,
        ),
        " also treats duration as one dimension among timing, regularity, quality, and sleep disorders. Seven to nine hours can be appropriate for many adults, while more than nine may be appropriate for young adults, recovery from sleep debt, or illness. The right interpretation is a range with context, not a timer that awards perfect sleep.",
      ),
      table(
        "What a nightly sleep number can and cannot tell you",
        ["Number or signal", "What it measures", "Useful interpretation", "What it misses"],
        [
          item("Time in bed"),
          item("Interval between getting into and leaving bed"),
          item("Whether the schedule leaves enough opportunity for sleep"),
          item("Time awake, sleep stages, breathing, and next-day function"),
        ],
        [
          item("Wearable sleep estimate"),
          item("Movement and often heart-rate patterns classified by software"),
          item("Personal trends when the same device and routine are compared"),
          item("Clinical certainty and accurate staging for every individual"),
        ],
        [
          item("Seven-plus guideline"),
          item("Population-level consensus for healthy adult sleep duration"),
          item("A floor that makes chronic restriction easier to recognize"),
          item("Your exact need, age-specific advice, and sleep quality"),
        ],
        [
          item("Daytime function"),
          item("Alertness, mood, errors, sleepiness, and recovery"),
          item("Whether the current pattern works outside the bedroom"),
          item("A hidden disorder that may need proper assessment"),
        ],
      ),
      heading("Why six hours can feel adequate while performance declines"),
      paragraph(
        "A frequently cited laboratory experiment helps explain why intuition is unreliable. In the ",
        link(
          "Van Dongen sleep-restriction study",
          RESEARCH_SOURCES.vanDongen2003.url,
        ),
        ", 48 healthy adults were assigned four, six, or eight hours in bed for 14 nights, or total sleep deprivation for three nights. Performance deficits accumulated in the four- and six-hour groups. Subjective sleepiness rose early but did not keep pace with the continuing decline, and participants did not reliably distinguish how impaired the shorter schedules had made them.",
      ),
      paragraph(
        "That study does not prove that every person sleeping six hours will fail in the same way. It used young adults, controlled conditions, time in bed rather than guaranteed sleep, and a two-week exposure. It does show why “I am used to it” is weak evidence of full adaptation. A restricted schedule can become familiar without restoring the performance that was lost.",
      ),
      heading("Natural short sleepers are real and rare"),
      paragraph(
        "Some people appear to need unusually little sleep without the usual daytime cost. The best-known evidence began with a family carrying a rare variant in DEC2. The ",
        link(
          "2009 genetic and animal-model paper",
          RESEARCH_SOURCES.dec2NaturalShortSleep2009.url,
        ),
        " connected that variant with a short-sleep phenotype and altered sleep regulation. It did not show that willpower, an alarm, caffeine, or a polyphasic schedule can reproduce the biology.",
      ),
      paragraph(
        "Natural short sleep is defined by functioning well on little sleep without forcing it and without persistent sleepiness. It is not the same as wanting to need less. Because the known variants are rare and genetic research remains limited, a six-hour habit should not be treated as proof of a special genotype.",
      ),
      heading("Field studies do not turn 6.5 hours into a new rule"),
      paragraph(
        "Research outside industrial settings complicates the story without replacing one magic number with another. A ",
        link(
          "2015 study of Hadza, San, and Tsimane communities",
          RESEARCH_SOURCES.yetish2015.url,
        ),
        " measured roughly 5.7 to 7.1 hours of sleep, with seasonal variation and strong relationships to darkness and temperature. A ",
        link(
          "2025 synthesis of 54 population studies",
          RESEARCH_SOURCES.crossSocietySleep2025.url,
        ),
        " estimated longer and more efficient sleep in industrial samples, but stronger circadian function in non-industrial samples.",
      ),
      paragraph(
        "Those are population comparisons across different communities, devices, climates, ages, and study designs. They cannot tell an individual that six and a half hours is sufficient. They do challenge a simpler claim: modernity did not merely subtract hours from one universal ancestral schedule. Sleep duration, circadian alignment, environment, safety, and flexibility changed together.",
      ),
      heading("A better way to judge your sleep window"),
      ordered(
        item(
          strong("Protect enough opportunity. "),
          "Start with a window that can produce at least seven hours asleep rather than treating seven hours in bed as seven hours of sleep.",
        ),
        item(
          strong("Keep wake time reasonably stable. "),
          "Large daily swings make duration harder to interpret because timing and accumulated sleep pressure keep changing.",
        ),
        item(
          strong("Watch several weeks, not one night. "),
          "Look for repeated daytime sleepiness, errors, mood changes, reliance on alarms or stimulants, and long weekend catch-up sleep.",
        ),
        item(
          strong("Separate opportunity from obstruction. "),
          "Enough time in bed will not fix loud snoring, gasping, restless legs, pain, a circadian disorder, or persistent insomnia.",
        ),
        item(
          strong("Treat the target as revisable. "),
          "Sleep need can change with age, illness, pregnancy, training load, recovery, and prior sleep debt.",
        ),
      ),
      paragraph(
        "Eight hours is useful when it creates breathing room around a seven-plus-hour sleep need. It becomes unhelpful when it creates anxiety, excuses chronic six-hour restriction, or turns a population guideline into a diagnosis. If adequate opportunity still leaves you persistently sleepy, or sleep includes loud snoring, gasping, or repeated awakenings, the missing information is more important than the missing minutes.",
      ),
    ],
  },
  {
    slug: "hunter-gatherer-sleep",
    title: "How Did Hunter-Gatherers Sleep? What Field Studies Show",
    dek:
      "Contemporary forager studies find shorter, flexible, environmentally timed sleep rather than one pristine ancestral pattern. The useful lesson is about context, not copying a schedule.",
    seoDescription:
      "Hunter-gatherer sleep studies complicate the eight-hour myth. Compare duration, timing, seasonality, flexibility, and the limits of ancestral analogies.",
    focusPhrase: "hunter gatherer sleep",
    keywords: [
      "hunter gatherer sleep",
      "hunter gatherer sleep schedule",
      "ancestral sleep pattern",
      "preindustrial sleep",
      "Hadza sleep study",
      "natural human sleep",
    ],
    tags: ["sleep", "circadian"],
    evidenceLabel: "Field evidence is diverse, ecological, and easy to overread",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    sourceIds: [
      "yetish2015",
      "hadzaSleep2017",
      "crossSocietySleep2025",
      "tobaElectricity2015",
      "tobaLongitudinal2025",
      "humanSleepEvolution2016",
    ],
    relatedSlugs: [
      "is-eight-hours-of-sleep-necessary",
      "morning-sunlight-and-sleep",
      "why-you-sleep-badly-in-hotels",
    ],
    body: [
      callout(
        "The short answer",
        "There is no single hunter-gatherer sleep schedule. Field studies of contemporary small-scale societies often find about six to seven hours of night sleep, strong seasonal and environmental timing, flexible naps, and more variation than an idealized dusk-to-dawn story allows. These communities are not replicas of prehistoric humans, and their measured averages are not instructions to sleep less.",
      ),
      heading("The field evidence overturns two opposite myths"),
      paragraph(
        "One myth says people without electric light naturally sleep eight or nine uninterrupted hours from sunset to sunrise. Another says short field-study averages prove modern adults have been told to sleep too much. Neither follows from the data. Researchers are observing living communities with their own histories, work, food systems, social lives, sleeping places, climates, and exposure to surrounding economies. The studies broaden the range of known human sleep. They do not reveal a single untouched baseline.",
      ),
      paragraph(
        "The ",
        link(
          "three-society study by Yetish and colleagues",
          RESEARCH_SOURCES.yetish2015.url,
        ),
        " measured Hadza in Tanzania, San in Namibia, and Tsimane in Bolivia. Estimated sleep duration ranged from 5.7 to 7.1 hours even though the sleep period was longer. People generally fell asleep several hours after sunset, woke around or before sunrise, and slept nearly an hour longer in winter in the groups with enough seasonal contrast. Extended middle-of-the-night waking was uncommon in those samples.",
      ),
      table(
        "What major field studies add to the picture",
        ["Evidence", "Population and measure", "Main observation", "Boundary"],
        [
          item("Yetish et al., 2015"),
          item("Hadza, San, and Tsimane; wrist actigraphy"),
          item("5.7–7.1 hours asleep; later than sunset; seasonal timing linked to light and temperature"),
          item("Three contemporary tropical or subtropical societies cannot represent all human history"),
        ],
        [
          item("Samson et al., 2017"),
          item("33 Hadza volunteers; 393 person-days of actigraphy"),
          item("About 6.25 hours, low measured efficiency, flexible timing, and opportunistic naps"),
          item("Actigraphy estimates sleep from movement and one community cannot define a species norm"),
        ],
        [
          item("Samson and McKinnon, 2025"),
          item("54 industrial and non-industrial population studies; more than 5,000 participants"),
          item("Industrial samples slept longer and more efficiently; non-industrial samples showed stronger circadian function"),
          item("A study-level synthesis combines countries, devices, years, and protocols rather than tracking matched individuals"),
        ],
        [
          item("Toba/Qom electrification studies"),
          item("Community comparisons and longitudinal actigraphy in northern Argentina"),
          item("Electricity accompanied later, shorter, and less regular sleep, especially through later onset"),
          item("Electrification changes technology, activity, work, and social life together, so light is not the only possible cause"),
        ],
      ),
      heading("Hadza sleep was short, fragmented, and flexible"),
      paragraph(
        "The dedicated ",
        link(
          "Hadza sleep-biology study",
          RESEARCH_SOURCES.hadzaSleep2017.url,
        ),
        " followed 33 volunteers for 393 days. Estimated night sleep averaged about 6.25 hours, and measured sleep efficiency was low. Activity, age, light, moon phase, day length, and nighttime temperature were associated with parts of the pattern. Naps appeared on many days, but not as a rigid planned schedule. The authors described flexible sleep-wake behavior embedded in ecology rather than one fixed block.",
      ),
      paragraph(
        "That finding matters because sleep efficiency is often treated as a universal score. A noisy, socially active camp may produce movement and awakenings while sleepers still judge their sleep in the context of ordinary life. This does not make fragmentation harmless. It shows that a laboratory-derived metric and a person's appraisal can describe different parts of the same night.",
      ),
      heading("Industrial sleep may be longer but less strongly timed"),
      paragraph(
        "The largest comparison in this cluster reaches a counterintuitive result. The ",
        link(
          "2025 analysis of 54 population studies",
          RESEARCH_SOURCES.crossSocietySleep2025.url,
        ),
        " estimated 7.1 hours for industrial samples and 6.4 hours for non-industrial samples. Industrial sleep was also more efficient. A separate analysis found stronger circadian function in non-industrial populations. Comfortable, protected bedrooms may support longer consolidated sleep while electric light, indoor days, fixed schedules, and evening activity weaken alignment with environmental time cues.",
      ),
      paragraph(
        "This is a population-level tradeoff hypothesis, not proof that any particular city resident has a weak body clock. The source studies span decades and use different equipment and sampling frames. Country, age, sex, climate, and culture remain intertwined. The result is most useful as a warning against treating duration as the whole of sleep health.",
      ),
      heading("Electrification shows change in real time"),
      paragraph(
        "Two studies of Toba/Qom communities make the transition more concrete. A ",
        link(
          "2015 field comparison",
          RESEARCH_SOURCES.tobaElectricity2015.url,
        ),
        " associated access to electric light with later sleep onset and roughly 40 to 60 minutes less sleep, depending on season. The samples were small and compared communities at one stage of change.",
      ),
      paragraph(
        "A later ",
        link(
          "longitudinal analysis covering 2012 to 2024",
          RESEARCH_SOURCES.tobaLongitudinal2025.url,
        ),
        " assembled more than 12,000 nightly records and followed electrification as it spread. Sleep shifted later, became less regular, and shortened in the rural community. The record is unusually valuable, but it remains observational and used several actigraph devices and algorithms over time. Electricity arrived with phones, television, social changes, and new options after dark. The study supports a transition; it cannot assign every minute to light alone.",
      ),
      heading("What evolutionary sleep research can and cannot say"),
      paragraph(
        "Comparative primate work suggests that humans evolved unusually short, consolidated, REM-rich sleep relative to predictions based on other primates. The ",
        link(
          "evolutionary review by Samson and Nunn",
          RESEARCH_SOURCES.humanSleepEvolution2016.url,
        ),
        " connects changes in sleeping sites, predation risk, social learning, and cognition with that pattern. These are testable evolutionary explanations, not a clinical protocol. Fossils do not preserve sleep stages, and contemporary behavior cannot simply be projected backward tens of thousands of years.",
      ),
      heading("Lessons worth bringing into a modern bedroom"),
      unordered(
        item(
          strong("Strengthen daytime and morning light. "),
          "The field studies repeatedly place sleep inside a strong natural light-dark cycle, even when total duration is short.",
        ),
        item(
          strong("Let nights become darker and cooler. "),
          "Light and falling temperature are recurring timing signals, though neither has one universal dose or thermostat setting.",
        ),
        item(
          strong("Allow some flexibility without engineering deprivation. "),
          "An occasional nap or variable bedtime is different from cutting nightly opportunity to imitate a population average.",
        ),
        item(
          strong("Judge sleep in context. "),
          "Duration, timing, regularity, awakenings, safety, and daytime function describe different dimensions.",
        ),
      ),
      paragraph(
        "The durable result is not that hunter-gatherers discovered the perfect six-hour schedule. It is that human sleep remains responsive to environment and culture. Modern bedrooms improve safety, temperature control, and continuity. Modern schedules can also detach sleep from light, temperature, and personal timing. The useful project is to restore strong cues and enough opportunity, not to cosplay an imagined ancestral night.",
      ),
    ],
  },
  {
    slug: "why-you-sleep-badly-in-hotels",
    title: "Why You Sleep Badly in Hotels: The First-Night Effect",
    dek:
      "The first night in a new place is often lighter and more fragmented. Brain-vigilance studies explain part of it, but hotel noise, temperature, travel timing, and expectation still matter.",
    seoDescription:
      "Why do you sleep badly in hotels? Learn what first-night studies show about brain vigilance, REM adaptation, noise, travel, and unfamiliar rooms.",
    focusPhrase: "why do I sleep badly in hotels",
    keywords: [
      "why do I sleep badly in hotels",
      "first night effect sleep",
      "can't sleep in hotel",
      "sleeping in a new place",
      "hotel insomnia",
      "first night effect brain",
    ],
    tags: ["sleep", "environment"],
    evidenceLabel: "A real laboratory effect, not a complete hotel diagnosis",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    sourceIds: [
      "agnewFirstNight1966",
      "firstNightMeta2022",
      "tamakiFirstNight2016",
      "firstNightHdEeg2022",
      "firstNightNonconsecutive2024",
      "firstNightMoreThanOne2001",
    ],
    relatedSlugs: [
      "sound-masking-vs-earplugs-vs-noise-cancelling",
      "morning-sunlight-and-sleep",
      "hunter-gatherer-sleep",
    ],
    body: [
      callout(
        "The short answer",
        "Sleep often becomes lighter, shorter, and more fragmented on the first night in an unfamiliar place. Researchers call this the first-night effect. Controlled studies suggest the sleeping brain remains more responsive to a novel environment, sometimes with regional left-right differences in deep sleep. A hotel adds other causes that laboratory studies do not isolate: travel fatigue, time-zone shifts, alcohol, late meals, noise, room temperature, pillows, and the worry that you must sleep well before an important day.",
      ),
      heading("The first-night effect began as a measurement problem"),
      paragraph(
        "Sleep laboratories noticed the pattern because the first recording night often looked unlike later nights. In the original ",
        link(
          "1966 EEG study",
          RESEARCH_SOURCES.agnewFirstNight1966.url,
        ),
        ", 43 participants spent four consecutive nights in a laboratory. The first night contained more wakefulness and light stage-one sleep, delayed deep sleep, and less REM. Researchers began using an adaptation night so the sensors and room would be less likely to distort the night they wanted to analyze.",
      ),
      paragraph(
        "A ",
        link(
          "2022 meta-analysis of 53 studies",
          RESEARCH_SOURCES.firstNightMeta2022.url,
        ),
        " found the same broad pattern across healthy participants: longer time to fall asleep, more wakefulness after sleep onset, lower total sleep time and efficiency, and less REM on the first night than the second. Effects differed by outcome and study. The first-night effect is a statistical tendency, not a guarantee that every traveler will have one bad night and then reset.",
      ),
      table(
        "Which parts of a bad hotel night the evidence can explain",
        ["Observation", "Best-supported explanation", "Evidence boundary", "Practical response"],
        [
          item("You take longer to fall asleep and wake more"),
          item("First-night studies show greater vigilance and lighter, less efficient sleep in novelty"),
          item("Most studies use sleep laboratories, not commercial hotels"),
          item("Reduce novelty and protect enough time instead of forcing sleep"),
        ],
        [
          item("Small sounds feel unusually noticeable"),
          item("One experiment found stronger first-night responses to rare sounds during regional slow-wave asymmetry"),
          item("It does not prove that half the brain stays awake all night"),
          item("Remove alerts and irregular noise; use a low masker only when it solves a real sound problem"),
        ],
        [
          item("The second night is better, but not normal"),
          item("Some sleep measures adapt quickly while REM-related changes can take several nights"),
          item("Adaptation varies by person, interval, setting, and measurement"),
          item("Do not schedule the shortest sleep window for the first night of an important trip"),
        ],
        [
          item("You are awake at the wrong local time"),
          item("Jet lag or a shifted routine can misalign the circadian clock"),
          item("That is a separate mechanism from unfamiliar-place vigilance"),
          item("Use destination-timed light, meals, and sleep rather than treating the room alone"),
        ],
      ),
      heading("The brain-asymmetry finding is narrower than the headline"),
      paragraph(
        "The most memorable explanation comes from ",
        link(
          "Tamaki and colleagues' 2016 experiments",
          RESEARCH_SOURCES.tamakiFirstNight2016.url,
        ),
        ". During the first laboratory session, a network in the left hemisphere showed less slow-wave activity than the corresponding right-side regions. The left side also responded more strongly to unusual sounds, and stronger asymmetry was associated with longer sleep-onset latency. The pattern was absent on the second session.",
      ),
      paragraph(
        "That is evidence for regional vigilance, not literal unihemispheric sleep like a dolphin and not proof that one whole hemisphere remains awake. The experiments included 35 healthy young adults across several protocols, with smaller subsets in individual analyses. A later ",
        link(
          "high-density EEG study of 27 people",
          RESEARCH_SOURCES.firstNightHdEeg2022.url,
        ),
        " also found shallower and more fragmented first-night sleep, but its regional pattern was more complex. The safe summary is that novelty can alter local sleep depth and responsiveness. “Half your brain stays awake” is too strong.",
      ),
      heading("One adaptation night is not a universal reset"),
      paragraph(
        "The name suggests a neat two-night story. The data are messier. In a ",
        link(
          "four-night home polysomnography study",
          RESEARCH_SOURCES.firstNightMoreThanOne2001.url,
        ),
        " 26 healthy adults showed REM-related adaptation extending as far as the fourth night. A ",
        link(
          "2024 study of nonconsecutive recordings",
          RESEARCH_SOURCES.firstNightNonconsecutive2024.url,
        ),
        " found first-night changes across unfamiliar laboratory visits and examined whether familiar settings erased them. Familiarity helped define the comparison, but no single marker captured adaptation for everyone.",
      ),
      paragraph(
        "Travelers can therefore have different trajectories. One person sleeps normally after an hour. Another adapts on night two. Someone crossing time zones may feel worse later because circadian misalignment peaks after the room has become familiar. Repeated hotel stays do not necessarily train a general immunity because each building has new sounds, light, temperature, and expectations.",
      ),
      heading("A hotel contains more than novelty"),
      unordered(
        item(
          strong("Irregular sound: "),
          "doors, elevators, plumbing, voices, traffic, and HVAC changes can trigger awakenings even after the room feels familiar.",
        ),
        item(
          strong("Temperature and bedding: "),
          "a warm duvet, unfamiliar pillow, dry air, or direct vent can create discomfort that a vigilance study does not measure.",
        ),
        item(
          strong("Travel timing: "),
          "early departures, late arrival, jet lag, and a shifted meal schedule change sleep pressure and circadian timing.",
        ),
        item(
          strong("Behavior: "),
          "alcohol may hasten sleep onset but fragment later sleep; caffeine, a heavy late meal, and bright evening light can add separate effects.",
        ),
        item(
          strong("Performance pressure: "),
          "trying to guarantee sleep before a meeting or event can make ordinary wakefulness feel urgent and self-reinforcing.",
        ),
      ),
      heading("A first-night hotel protocol"),
      ordered(
        item(
          "Choose a room away from elevators, ice machines, event spaces, and street-facing noise when the hotel can accommodate it.",
        ),
        item(
          "On arrival, remove tiny surprises: silence the room phone, cover blinking lights, test the thermostat, and set one dependable alarm.",
        ),
        item(
          "Bring one compact familiar cue such as a pillowcase, sleep mask, or quiet sound profile. Familiarity may reduce cognitive load, though direct trial evidence for any specific object is limited.",
        ),
        item(
          "If noise is the problem, reduce it first. Comfortable earplugs or a low, steady masker can help, but make sure alarms and emergency signals remain detectable.",
        ),
        item(
          "Leave a larger sleep opportunity than usual. Extra time lowers the cost of slower sleep onset without demanding that sleep happen on command.",
        ),
        item(
          "After time-zone travel, treat the clock separately with appropriately timed light and a stable local wake time.",
        ),
      ),
      paragraph(
        "A poor first hotel night is common enough to have a name and measurable physiology. That can be reassuring. It is not a reason to ignore repeated severe insomnia, loud snoring, gasping, or dangerous daytime sleepiness at home and away. The first-night effect explains a temporary response to novelty. It does not explain every bad night in a new bed.",
      ),
    ],
  },
  {
    slug: "morning-sunlight-and-sleep",
    title: "Does Morning Sunlight Help Sleep? Timing Matters",
    dek:
      "Morning outdoor light can strengthen an earlier circadian signal, especially when evenings are dimmer. The effect depends on biological timing, intensity, duration, spectrum, season, and prior light.",
    seoDescription:
      "Does morning sunlight help sleep? Human circadian studies explain phase timing, outdoor light, evening light, and why no single minutes rule fits everyone.",
    focusPhrase: "does morning sunlight help sleep",
    keywords: [
      "does morning sunlight help sleep",
      "morning sunlight sleep",
      "morning light circadian rhythm",
      "sunlight for better sleep",
      "how much morning sunlight",
      "circadian rhythm light timing",
    ],
    tags: ["sleep", "circadian"],
    evidenceLabel: "Strong clock mechanism; no universal minutes prescription",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    sourceIds: [
      "lightPhaseResponse2012",
      "naturalLightCamping2013",
      "eveningEreader2015",
      "dailyLightReview2021",
      "lightTimingReview2019",
      "daytimeLightRecommendations2022",
    ],
    relatedSlugs: [
      "is-eight-hours-of-sleep-necessary",
      "hunter-gatherer-sleep",
      "why-you-sleep-badly-in-hotels",
    ],
    body: [
      callout(
        "The short answer",
        "Morning outdoor light usually supports earlier circadian timing and a stronger day-night signal, which can make earlier sleep and waking easier. Light is not a sedative, and more is not always better. Its effect depends on when it reaches your biological clock, how bright and spectrally effective it is, how long it lasts, and what light you received before and after. No human study establishes one universal rule such as exactly 10 or 15 minutes for every latitude, season, window, eye, and sleep schedule.",
      ),
      heading("Light changes when sleep is promoted, not just how sleepy you feel"),
      paragraph(
        "The eyes send light information to the brain's central circadian clock. That clock helps time melatonin, alertness, body temperature, and the changing tendency to sleep across roughly 24 hours. Light can have an immediate alerting effect, and it can shift the clock so the same biological events happen earlier or later on following days. Those are related but different effects.",
      ),
      paragraph(
        "A controlled ",
        link(
          "human phase-response experiment",
          RESEARCH_SOURCES.lightPhaseResponse2012.url,
        ),
        " mapped clock shifts after one-hour pulses of bright white light at different circadian phases. Light in the biological evening and early night generally shifted timing later. Light in the later biological night and morning generally shifted it earlier. Near the crossover points, the same nominal dose produced smaller or less predictable changes. This is why “morning” should mean morning relative to the person's internal night, not merely any clock time before noon.",
      ),
      table(
        "A timing-first guide to light and sleep",
        ["Light pattern", "Likely clock direction", "Who might find it useful", "Important limit"],
        [
          item("Outdoor light after habitual waking"),
          item("Usually earlier timing and a stronger daytime signal"),
          item("People drifting later or struggling to feel awake early"),
          item("The effect varies with internal phase, season, weather, duration, and prior light"),
        ],
        [
          item("Bright light late in the evening"),
          item("Usually later timing plus acute alerting"),
          item("Sometimes used deliberately for an overly early clock under guidance"),
          item("Can work against an earlier bedtime when used casually"),
        ],
        [
          item("Bright daytime light beyond the first hour"),
          item("Supports contrast between day and night; timing effect depends on phase"),
          item("Indoor workers with dim days and bright evenings"),
          item("Habitual field evidence is mostly observational and not a precise dose trial"),
        ],
        [
          item("Dimmer light before bed and darkness overnight"),
          item("Removes competing late signals rather than forcing an advance"),
          item("People seeking earlier sleep timing"),
          item("Dimming does not treat every cause of insomnia or delayed sleep"),
        ],
      ),
      heading("Why outdoors usually beats a window"),
      paragraph(
        "Outdoor daylight is often much brighter than ordinary indoor lighting, even on an overcast day. Glass, shade, room orientation, distance from a window, and where you look can reduce the light reaching the eyes. Lux is also weighted for visual brightness rather than the full circadian response, which is especially sensitive to short-wavelength light through melanopsin-containing retinal cells.",
      ),
      paragraph(
        "That does not mean staring at the sun. Direct sun viewing can injure the eye and is unnecessary. An ordinary outdoor walk, breakfast on a porch, or time in open shade can provide a strong daytime signal while you look around normally. The goal is environmental light reaching open eyes, not pain, glare, or a vision challenge.",
      ),
      heading("Natural-light experiments change the whole day"),
      paragraph(
        "In a small ",
        link(
          "2013 camping experiment",
          RESEARCH_SOURCES.naturalLightCamping2013.url,
        ),
        " participants first lived their normal work-home schedules and then spent a week outdoors without electric light. During camping they received far more daytime light and less light after sunset. Their melatonin timing shifted about two hours earlier and became more closely aligned with solar time.",
      ),
      paragraph(
        "Camping did not isolate a 15-minute morning exposure. It changed morning light, all-day light, evening darkness, activity, social schedule, and probably meal timing together. The experiment supports a stronger natural light-dark cycle. It cannot tell you that one brief ritual will reproduce a week outdoors.",
      ),
      heading("Morning light works better when evenings stop pushing back"),
      paragraph(
        "A ",
        link(
          "controlled e-reader crossover study",
          RESEARCH_SOURCES.eveningEreader2015.url,
        ),
        " illustrates the other side of the clock. Participants read either a light-emitting tablet at maximum brightness or a printed book in dim light for four hours before bed on five consecutive evenings. The tablet condition delayed circadian timing, lengthened sleep latency, reduced evening sleepiness, and worsened next-morning alertness.",
      ),
      paragraph(
        "That was an intensive laboratory contrast, not evidence that every phone glance causes the same shift. It demonstrates a direction: a bright, prolonged evening signal can counter the earlier pattern people seek from morning light. Building contrast across the day is more coherent than collecting sunlight in the morning and then keeping the eyes in a bright environment until bedtime.",
      ),
      heading("Why the evidence does not support one minutes rule"),
      paragraph(
        "A ",
        link(
          "systematic review of personal daily light exposure",
          RESEARCH_SOURCES.dailyLightReview2021.url,
        ),
        " found 25 eligible observational studies. Only five received a good quality rating, all were cross-sectional, and the overall links among habitual light, sleep, circadian phase, and mood were limited or conflicting. Wrist sensors also estimate what reached the eye imperfectly.",
      ),
      paragraph(
        "Another ",
        link(
          "45-study review of light amount, timing, and sleep",
          RESEARCH_SOURCES.lightTimingReview2019.url,
        ),
        " found broader directional patterns: brighter morning light was associated with earlier sleep timing, while brighter evening light was associated with later timing. Protocols differed substantially. Expert ",
        link(
          "indoor-light recommendations",
          RESEARCH_SOURCES.daytimeLightRecommendations2022.url,
        ),
        " therefore express principles using light measured at the eye, including melanopic equivalent daylight illuminance. They do not validate a universal social-media stopwatch.",
      ),
      heading("A practical experiment without fake precision"),
      ordered(
        item(
          strong("Anchor wake time first. "),
          "Choose a wake time you can keep reasonably stable so light arrives at a comparable point each day.",
        ),
        item(
          strong("Go outdoors soon after waking when your goal is an earlier schedule. "),
          "Stay long enough to experience ordinary daylight without staring at the sun; dim winter or deeply shaded conditions may require more time than a bright open morning.",
        ),
        item(
          strong("Add daytime light. "),
          "A brighter morning cannot fully compensate for spending every remaining hour in a dim room. Take work or breaks near daylight when practical.",
        ),
        item(
          strong("Reduce late competition. "),
          "Dim the environment in the hours before bed and avoid holding a bright display close to the eyes for long periods.",
        ),
        item(
          strong("Track timing, not perfection. "),
          "Over two weeks, note sleep onset, wake time, ease of waking, and daytime sleepiness rather than treating one morning as a verdict.",
        ),
      ),
      paragraph(
        "Deliberate bright-light therapy is more powerful than casual outdoor exposure and can be mistimed. People with bipolar disorder, significant eye disease, light-sensitive conditions, or medications that increase light sensitivity should seek individualized guidance before using a high-intensity light box. Anyone with persistent inability to sleep or wake at required times may be dealing with a circadian sleep-wake disorder rather than a shortage of generic wellness advice.",
      ),
    ],
  },
  {
    slug: "does-grounding-help-sleep",
    title: "Does Grounding Help Sleep? What the Evidence Shows",
    dek:
      "Grounding has a new sham-controlled pilot and two earlier human sleep studies. The results are interesting, but small samples, mixed comparisons, reporting problems, and industry funding keep the answer uncertain.",
    seoDescription:
      "Does grounding help sleep? A close review of earthing-mat trials, their methods, funding, limitations, safety, and evidence-based insomnia care.",
    focusPhrase: "does grounding help sleep",
    keywords: [
      "does grounding help sleep",
      "grounding mat sleep",
      "earthing mat sleep study",
      "grounding sheets evidence",
      "earthing sleep research",
      "grounding for insomnia",
    ],
    tags: ["sleep", "wellness-claims"],
    evidenceLabel: "Promising pilots; reliable benefit not established",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    sourceIds: [
      "groundingTrial2025",
      "groundingCortisol2004",
      "groundingAlzheimer2022",
      "groundingReview2012",
      "cbtiGuideline2021",
      "insomniaAlternatives2023",
    ],
    relatedSlugs: [
      "morning-sunlight-and-sleep",
      "is-eight-hours-of-sleep-necessary",
      "noise-and-sleep-2026",
    ],
    body: [
      callout(
        "The short answer",
        "Grounding may help sleep, but current evidence does not establish a reliable effect. A 2025 sham-controlled pilot reported longer actigraphic sleep and improvements on some symptom measures. Two earlier studies also reported positive sleep outcomes. Across the three, samples were small, populations and protocols differed, most outcomes were questionnaires, and the strongest new paper has inconsistent participant reporting plus manufacturer funding. That is enough evidence to investigate, not enough to promise better sleep or recommend a mat as insomnia treatment.",
      ),
      heading("What grounding means in these studies"),
      paragraph(
        "Grounding, also called earthing, means electrically connecting the body to the ground. Outdoors, advocates describe direct skin contact with soil, grass, or sand. Indoor studies use conductive pads, sheets, or mats connected to the ground contact of an electrical outlet. The proposed explanation is that electrons move between the Earth and body and influence stress, inflammation, cortisol, or electrical physiology.",
      ),
      paragraph(
        "A mechanism can be physically measurable without producing a meaningful health benefit. It can also be plausible in one part and speculative in the next. The relevant test is whether well-controlled human trials produce consistent improvements in prespecified sleep outcomes, with credible blinding, adequate samples, transparent analysis, and independent replication.",
      ),
      table(
        "An evidence audit of grounding and sleep",
        ["Study", "Design", "Positive signal", "Why it is not decisive"],
        [
          item("Ghaly and Teplitz, 2004"),
          item("12 adults with sleep, pain, and stress complaints; conductive mattress pad for eight weeks"),
          item("Changed overnight cortisol profiles and improved subjective reports"),
          item("No sham or ungrounded control group, so expectation, time, and regression to the mean remain plausible"),
        ],
        [
          item("Lin et al., 2022"),
          item("Sham-controlled 12-week pilot in mild Alzheimer's disease; 22 enrolled and 15 completed"),
          item("Better Pittsburgh Sleep Quality Index scores in the grounding group"),
          item("Very small completion sample, narrow clinical population, subjective primary sleep measure, and no result for anxiety or depression"),
        ],
        [
          item("Park et al., 2025"),
          item("Randomized, double-blind, sham-mat pilot for 31 days with questionnaires and actigraphy"),
          item("Reported longer sleep time and improvement on several symptom scores"),
          item("Small study, unclear primary outcome, baseline imbalance, conflicting sample counts, mixed between-group results, and mat-company funding"),
        ],
        [
          item("AASM insomnia guideline, 2021"),
          item("Evidence-graded guideline drawing on dozens of controlled behavioral-treatment trials"),
          item("Strong recommendation for multicomponent CBT-I"),
          item("It did not evaluate grounding; it shows the evidence standard an insomnia treatment should eventually meet"),
        ],
      ),
      heading("The 2025 trial is stronger than the old evidence"),
      paragraph(
        "The newest ",
        link(
          "earthing-mat trial",
          RESEARCH_SOURCES.groundingTrial2025.url,
        ),
        " improved on the earliest work by using computer randomization, visually similar grounded and ungrounded mats, participant and researcher blinding, multiple validated questionnaires, and an actigraph measure. Sixty eligible participants were assigned to use a mat for at least six hours a day over 31 days, followed by a seven-day check. The paper reports a significant between-group increase in total sleep time and some symptom improvements.",
      ),
      paragraph(
        "Several details prevent a confident efficacy claim. The results text says 56 participants were analyzed, split 26 control and 30 experimental, while the demographic table lists 30 control and 28 experimental. The insomnia score began substantially worse in the experimental group. At day 31, the between-group differences reported for insomnia severity, Pittsburgh sleep quality, daytime sleepiness, and stress were not statistically significant, even though several within-group before-after comparisons improved. For a randomized trial, change relative to the sham group is more informative than improvement within the treatment group alone.",
      ),
      paragraph(
        "The paper reports a significant actigraphic total-sleep-time comparison, but gives limited numerical detail in the text and does not clearly identify one prespecified primary endpoint among the questionnaires and actigraphy. It also says the work was funded by World Home Dr. and Geosan Corp.; the mat came from World Home Dr., and two authors list company affiliations. The authors declared no known competing interests. Funding does not invalidate a result, but independent replication becomes especially important when a study evaluates a sponsor's product.",
      ),
      heading("The earlier studies are signals, not confirmation"),
      paragraph(
        "The ",
        link(
          "2004 cortisol pilot",
          RESEARCH_SOURCES.groundingCortisol2004.url,
        ),
        " followed 12 people who reported sleep dysfunction, pain, and stress. After sleeping on a conductive mattress pad, their cortisol profiles and subjective symptoms changed. Without a sham group, the study cannot separate grounding from expectation, concurrent changes, natural fluctuation, or repeated measurement.",
      ),
      paragraph(
        "A ",
        link(
          "2022 pilot in mild Alzheimer's disease",
          RESEARCH_SOURCES.groundingAlzheimer2022.url,
        ),
        " enrolled 22 people and retained 15 through 12 weeks. The grounding group had better questionnaire-based sleep quality than the sham group, while anxiety and depression did not differ. A positive controlled result in seven or eight completers per arm cannot be assumed to apply to healthy adults, chronic insomnia, or a consumer using a different mat.",
      ),
      heading("Mechanism claims remain ahead of clinical proof"),
      paragraph(
        "A widely shared ",
        link(
          "2012 earthing review",
          RESEARCH_SOURCES.groundingReview2012.url,
        ),
        " assembles early studies and proposes that Earth's surface electrons could act as antioxidants, reduce inflammation, normalize cortisol, or change autonomic balance. It is a narrative, hypothesis-forward review written by researchers associated with much of the underlying earthing literature. It is useful for locating the proposed chain of causation. It does not independently verify each link in that chain.",
      ),
      paragraph(
        "Sleep can improve during an outdoor grounding routine for ordinary reasons that have nothing to do with electron transfer. A morning barefoot walk can add daylight, physical activity, time in nature, and a repeated calming ritual. An indoor mat can create expectation and a consistent bedtime cue. Those are plausible benefits of the surrounding behavior, but they cannot validate the specific electrical mechanism.",
      ),
      heading("What would make the answer more convincing"),
      unordered(
        item("A preregistered, independently funded trial large enough to detect a clinically meaningful difference."),
        item("One clearly named primary sleep outcome, with all planned analyses and dropouts reported consistently."),
        item("Credible sham validation showing that participants and staff could not guess assignment."),
        item("Objective sleep measures over enough nights to distinguish adaptation and ordinary night-to-night variation."),
        item("Replication in the intended population, such as adults with diagnosed chronic insomnia, rather than extrapolation across unrelated groups."),
        item("Adverse-event and electrical-safety reporting for the exact commercial setup being tested."),
      ),
      heading("If you are deciding whether to try it"),
      paragraph(
        "A grounding mat should not displace a medical evaluation or a treatment with stronger evidence. Do not improvise a connection to household wiring, and follow the safety instructions for a properly certified product if you choose to use one. Outdoor barefoot time carries ordinary risks from heat, cold, sharp objects, infection, insects, falls, and reduced foot sensation. The safe choice depends on the person and setting, not on the claim that natural means harmless.",
      ),
      paragraph(
        "For persistent chronic insomnia, the ",
        link(
          "American Academy of Sleep Medicine guideline",
          RESEARCH_SOURCES.cbtiGuideline2021.url,
        ),
        " gives multicomponent cognitive behavioral therapy for insomnia a strong recommendation, supported by a much larger controlled evidence base. An ",
        link(
          "umbrella review of complementary insomnia treatments",
          RESEARCH_SOURCES.insomniaAlternatives2023.url,
        ),
        " found generally low-quality evidence even for more frequently studied approaches; grounding was not among the evaluated categories.",
      ),
      paragraph(
        "The fairest current verdict is neither “grounding is proven” nor “there is no evidence.” There are small positive studies, including one modern sham-controlled trial, and substantial uncertainty about effect size, generalizability, analysis, and mechanism. That makes grounding an open research question and an optional personal experiment, not an established sleep treatment.",
      ),
    ],
  },
] as const satisfies readonly ResearchArticle[];

export const researchArticlesNewestFirst: readonly ResearchArticle[] =
  researchArticles.toSorted((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt));

export function researchTagLabel(tagId: ResearchTagId): ResearchTag["label"] {
  const tag = RESEARCH_TAGS.find((candidate) => candidate.id === tagId);

  if (tag === undefined) {
    throw new Error(`Unknown research tag: ${tagId}`);
  }

  return tag.label;
}

export function researchArticlePath(slug: ResearchSlug): `/research/${ResearchSlug}` {
  return `/research/${slug}`;
}

export function getResearchArticle(slug: string): ResearchArticle | undefined {
  return researchArticles.find((article) => article.slug === slug);
}

export function homepageResearchArticles(): readonly ResearchArticle[] {
  return HOMEPAGE_RESEARCH_SLUGS.map((slug) => {
    const article = getResearchArticle(slug);
    if (article === undefined) throw new Error(`Missing curated guide: ${slug}`);
    return article;
  });
}

export function isIndexableResearchArticle(article: ResearchArticle): boolean {
  return !CLINICAL_REVIEW_REQUIRED_RESEARCH_SLUGS.some(
    (slug) => slug === article.slug,
  );
}

export function relatedResearchArticles(
  article: ResearchArticle,
): readonly ResearchArticle[] {
  const sourceIsIndexable = isIndexableResearchArticle(article);

  return article.relatedSlugs
    .map(getResearchArticle)
    .filter((candidate) => candidate !== undefined)
    .filter((candidate) =>
      !sourceIsIndexable || isIndexableResearchArticle(candidate));
}

export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/^-|-$/gu, "");
}

export function articleWordCount(article: ResearchArticle): number {
  const text = article.body
    .flatMap((block) => {
      if (block.type === "heading") return [block.text];
      if (block.type === "editorial-image") return [];
      if (block.type === "list") {
        return block.items.flatMap((entry) =>
          entry.map((part) => (typeof part === "string" ? part : part.text)));
      }
      if (block.type === "table") {
        return [
          block.caption,
          ...block.columns,
          ...block.rows.flatMap((row) =>
            row.flatMap((entry) =>
              entry.map((part) => typeof part === "string" ? part : part.text)),
          ),
        ];
      }
      return block.content.map((part) =>
        typeof part === "string" ? part : part.text);
    })
    .join(" ");

  return text.match(/\b[\p{L}\p{N}’'-]+\b/gu)?.length ?? 0;
}

export function articleReadingMinutes(article: ResearchArticle): number {
  return Math.max(1, Math.ceil(articleWordCount(article) / 220));
}

export function latestResearchUpdatedAt(): string {
  return researchArticles.reduce<string>(
    (latest, article) => article.updatedAt > latest ? article.updatedAt : latest,
    researchArticles[0]?.updatedAt ?? "1970-01-01",
  );
}
