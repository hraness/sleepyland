import type { ReadingNoteSlug } from "./reading-notes";
import type { ResearchSlug } from "./research/articles";

export const EDITORIAL_IMAGE_WIDTH = 1536;
export const EDITORIAL_IMAGE_HEIGHT = 864;
export const EDITORIAL_IMAGE_CREDIT =
  "Sleepyland editorial illustration · Atet with Recraft V4";

export type EditorialImageKind = "reading" | "research";

export type EditorialImage<
  Kind extends EditorialImageKind = EditorialImageKind,
  Slug extends string = string,
> = Readonly<{
  alt: string;
  caption: string;
  credit: typeof EDITORIAL_IMAGE_CREDIT;
  height: typeof EDITORIAL_IMAGE_HEIGHT;
  kind: Kind;
  sha256: string;
  slug: Slug;
  src: `/editorial/${Kind}/${Slug}.webp`;
  width: typeof EDITORIAL_IMAGE_WIDTH;
}>;

type EditorialImageRecord<
  Kind extends EditorialImageKind,
  Slug extends string,
> = Readonly<{ [Key in Slug]: EditorialImage<Kind, Key> }>;

function image<Kind extends EditorialImageKind, Slug extends string>(
  kind: Kind,
  slug: Slug,
  alt: string,
  caption: string,
  sha256: string,
): EditorialImage<Kind, Slug> {
  return {
    alt,
    caption,
    credit: EDITORIAL_IMAGE_CREDIT,
    height: EDITORIAL_IMAGE_HEIGHT,
    kind,
    sha256,
    slug,
    src: `/editorial/${kind}/${slug}.webp`,
    width: EDITORIAL_IMAGE_WIDTH,
  };
}

export const RESEARCH_EDITORIAL_IMAGES = {
  "best-magnesium-for-sleep": image(
    "research",
    "best-magnesium-for-sleep",
    "Four pale mineral forms with different textures dissolve and reflect across a dark nocturnal surface.",
    "Different magnesium forms vary in solubility and tolerance; the illustration gives none a proven sleep advantage.",
    "588f6d7744dc1972e530c5f89f5750a1970155503d9a31a5c12958c7591b5344",
  ),
  "l-theanine-valerian-california-poppy-for-sleep": image(
    "research",
    "l-theanine-valerian-california-poppy-for-sleep",
    "Three distinct botanical forms—a curled bundle, knotted root, and pale bloom—rest in separate shallow vessels.",
    "Three traditions sit on different evidence levels; no ingredient or preparation is shown as the winner.",
    "a2df520f43f8784376bdc55ae68fc5cabeab5d7b4c92c5c4f712d0b996a5632d",
  ),
  "kava-for-sleep": image(
    "research",
    "kava-for-sleep",
    "A rough wooden bowl of pale roots sits inside a dark circle beside folded cloth and an opaque black form.",
    "The shared bowl evokes kava's communal context, while the separated dark form marks unresolved product and safety uncertainty.",
    "a5c36a95a0739839e5ff7c8a71cb6b5f759856745121a2dcfb15f75b95761755",
  ),
  "benadryl-diphenhydramine-for-sleep": image(
    "research",
    "benadryl-diphenhydramine-for-sleep",
    "Repeated rust-colored folds thin as they cross from a black night field into a pale dawn opening.",
    "Sedation can fade with rapid tolerance while residual next-morning impairment extends past the night.",
    "01ade68f95ed7e5110b241981efc6d448fe923e84088783a82bf55215c2518d0",
  ),
  "screens-blue-light-glasses-and-sleep": image(
    "research",
    "screens-blue-light-glasses-and-sleep",
    "A blank cool screen glows through a translucent amber panel beside a closed book and small warm light.",
    "Evening screens combine light, attention, and time; filtering one part does not prove better sleep.",
    "12b687d27f40ebe8afa9d0906505cdf4657add60f9e81dfaae916c5cb0be2da5",
  ),
  "blue-light-scatter-and-visual-detail": image(
    "research",
    "blue-light-scatter-and-visual-detail",
    "Two close points of light smear into a wide blue halo while longer copper wavelengths stay tighter on a dark field.",
    "Short-wave light spreads more in this editorial metaphor; the image is not a photograph of the UGA apparatus.",
    "1f5fa10b1faa3566381e536425997a845d753b2f7ad1f52e0e44fe4eeafe3d70",
  ),
  "z-drugs-zaleplon-zolpidem-eszopiclone": image(
    "research",
    "z-drugs-zaleplon-zolpidem-eszopiclone",
    "Three pale copper currents rise to different heights from the same dark nocturnal threshold.",
    "Different exposure windows fit different insomnia patterns; this conceptual illustration is not a dosing chart.",
    "66634ab5f57512e08c82959d42e56b0d5b3c808df3788e8395c9ce9b0962725e",
  ),
  "ghb-sodium-oxybate-and-sleep": image(
    "research",
    "ghb-sodium-oxybate-and-sleep",
    "Two matching dark forms sit side by side, one enclosed by rings and one surrounded by a fractured pale edge.",
    "The same molecule sits inside very different control systems; monitored evidence does not transfer to unsupervised use.",
    "a211a71fd5a121a8cdd2c37baf59a3e98f836189ea2299e3c47c8cf126fb93e8",
  ),
  "kratom-after-no-sleep": image(
    "research",
    "kratom-after-no-sleep",
    "A green leaf-like form lifts a small copper ember above an interrupted black current leading into pale dawn.",
    "A brief feeling of alertness does not repair the missing sleep represented by the broken current below.",
    "92c4d246e7dd843cb49d2d657bcf76914ad7507071c3bc5abd4fbcaac6b5fc23",
  ),
  "how-to-quiet-a-racing-mind-at-night": image(
    "research",
    "how-to-quiet-a-racing-mind-at-night",
    "Tangled copper threads separate into blank paper scraps and converge on a quiet grid.",
    "Open loops become less demanding when captured and assigned a next action outside the bed.",
    "9e145a1d81ade440c01fe4865dff65f1f8f4eb5e20c06d0b198d0ecff7a4b511",
  ),
  "best-sleep-sounds": image(
    "research",
    "best-sleep-sounds",
    "Copper-edged acoustic currents settling toward a dark central horizon.",
    "Different sound textures settle into one low-information field—an editorial metaphor, not a scientific plot.",
    "23bd5858e213b01161d443e02f2ad5909f08dc22d0db2f46d795871afd88dd5b",
  ),
  "what-frequency-helps-you-sleep": image(
    "research",
    "what-frequency-helps-you-sleep",
    "Fine and broad frequency ribbons crossing a dark field without a dominant band.",
    "The visual gives no frequency special status, matching the article’s evidence boundary.",
    "6fea1163ca0d85713f4232a677396a3e6d157094b56b21e59c42d0585254961b",
  ),
  "how-sound-masking-works": image(
    "research",
    "how-sound-masking-works",
    "A continuous dark sound field surrounding a sharper copper pulse.",
    "Masking lowers contrast around an intrusive event; it does not erase the event.",
    "311899c3bef66450874415c25349df9136f758204b22a5ab8c9f64376f01c458",
  ),
  "noise-and-sleep-2026": image(
    "research",
    "noise-and-sleep-2026",
    "Layered nocturnal sound fields split by irregular copper disturbances.",
    "The divided field reflects mixed evidence on steady maskers and intermittent environmental noise.",
    "c5834ef8ee901f275d065033ff1186f830fbc3fc74eb2a35e974ca69c0b1c641",
  ),
  "sound-for-focus-noise-music-silence": image(
    "research",
    "sound-for-focus-noise-music-silence",
    "Quiet, granular, and repeating sound paths converging around a small ember.",
    "Silence, broadband sound, and patterned audio approach attention differently; the image names no winner.",
    "a6282c55133ffca8f3e19907b325332eeb4dfec73c1a5ad4c318b0c0b8cf471b",
  ),
  "how-to-use-white-noise-for-sleep": image(
    "research",
    "how-to-use-white-noise-for-sleep",
    "A measured white sound field moving through a dark room-like enclosure.",
    "The restrained field represents low-volume placement and setup, not a universal dosage.",
    "2ebc9734321f8b0660b5d7c3bff910051c57eb8d43e68ab12c2d15a3940c6831",
  ),
  "sound-masking-vs-earplugs-vs-noise-cancelling": image(
    "research",
    "sound-masking-vs-earplugs-vs-noise-cancelling",
    "Three dark acoustic structures separating, blocking, and opposing incoming texture.",
    "Three strategies use different mechanisms; the composition deliberately avoids a universal winner.",
    "0d755497f0c39fa2538b4ce261323b6fdbff026da0647514b280d4a3bd419a2a",
  ),
  "why-fan-noise-helps-sleep": image(
    "research",
    "why-fan-noise-helps-sleep",
    "Slow concentric airflow folding into a stable dark center.",
    "Steady airflow combines broadband texture, predictability, and familiar mechanical rhythm.",
    "7db602cb328f6953518d712e92fb2f37386f55f3d35d30d74f8a2a493419dca1",
  ),
  "white-pink-brown-noise-for-sleep": image(
    "research",
    "white-pink-brown-noise-for-sleep",
    "Three spectral fabrics shifting from pale fine grain to deep brown folds.",
    "White, pink, and brown describe different spectral slopes—not different medicines.",
    "171afc3f3a3d97b94977216bcb34fbac38c0130ba8cec93419c07aa8866e0a28",
  ),
  "binaural-beats-for-sleep": image(
    "research",
    "binaural-beats-for-sleep",
    "Separate coiled tone fields forming a subtle pulse in the space between them.",
    "The central rhythm is presented as a perceptual effect, not a picture of brain entrainment.",
    "8e713efe396e8349d3989a2db9ba1e20d103cf282fa6416f4111777c277926e7",
  ),
  "ocean-waves-for-sleep": image(
    "research",
    "ocean-waves-for-sleep",
    "Long copper-black swells gathering and receding under a dark sky.",
    "Varying swell groups evoke procedural surf without implying a therapeutic dose.",
    "be79e86fb37bd10986acd716940992d83cf0fd6354c3df347dbe2e9551159ed1",
  ),
  "why-car-rides-make-you-sleepy": image(
    "research",
    "why-car-rides-make-you-sleepy",
    "A dark road-like current passing through layered vibration and rocking arcs.",
    "The layers separate physical motion and vibration from the softer acoustic cue.",
    "7fe2f06eb621bcd4f902c343d0a25e4d2945c2d018bcfe6ad1680df440c04acc",
  ),
  "airplane-sound-for-sleep": image(
    "research",
    "airplane-sound-for-sleep",
    "A warm cabin-window opening surrounded by continuous low nocturnal layers.",
    "Steady cabin texture is visually enclosed from disruptive events outside it.",
    "fb934280e2cf6b38bae12295fc19222ebf1850778970aec0c23393d8ba13d60b",
  ),
  "is-eight-hours-of-sleep-necessary": image(
    "research",
    "is-eight-hours-of-sleep-necessary",
    "Unequal nocturnal arcs circling a quiet center without a marked endpoint.",
    "Duration appears as a flexible range rather than an exact pass-fail number.",
    "bf7717fe5579cdc1078e83e365cd56f98e53856445f317c1c6dedef08e1de2bb",
  ),
  "hunter-gatherer-sleep": image(
    "research",
    "hunter-gatherer-sleep",
    "Varied earth-toned resting forms gathered in a cool nocturnal landscape.",
    "Different forms resist the myth of one pristine ancestral sleep schedule.",
    "cf2afc3e3e74a41fefa08e372f6d6a7d7950f26f3805a6acba2f415599839617",
  ),
  "why-you-sleep-badly-in-hotels": image(
    "research",
    "why-you-sleep-badly-in-hotels",
    "An unfamiliar dark room divided by a thin warm corridor glow.",
    "The partially open enclosure suggests first-night vigilance without depicting a sleeping brain.",
    "fc49ad2732dd58625c77ef6e4685f64ed9acea4949b3e0f43c0bb1be2501bda3",
  ),
  "morning-sunlight-and-sleep": image(
    "research",
    "morning-sunlight-and-sleep",
    "A restrained dawn band shifting layered nocturnal arcs toward warm light.",
    "Morning light changes timing in context; the image deliberately avoids a minutes prescription.",
    "34ee4e57859f074b936fe8407d95d9dc000125f4575fbe316cc22340183d50ce",
  ),
  "does-grounding-help-sleep": image(
    "research",
    "does-grounding-help-sleep",
    "A floating conductive form making uneven contact with layered earth lines.",
    "Some copper paths connect and others remain unresolved, reflecting the small and uncertain evidence base.",
    "f519ba057577991f9662252bdeed34b8eff97a58f6d40c36f0b663ee5b7af01c",
  ),
} as const satisfies EditorialImageRecord<"research", ResearchSlug>;

export const READING_EDITORIAL_IMAGES = {
  "good-ideas": image(
    "reading",
    "good-ideas",
    "A small ember-seed protected inside a deep branching nocturnal hollow.",
    "A fragile idea survives inside protected attention; the image does not claim to explain creativity.",
    "3cc487b8a45e71c37c8e439a1410cb75f8ea1dd17c4bb2a1f81ad0332f909919",
  ),
  "habit-and-rest": image(
    "reading",
    "habit-and-rest",
    "A modest copper ripple beginning a repeated path through dark space.",
    "One small acted start becomes a quiet repeating pattern rather than a triumphant streak.",
    "ae05cc611bf9377df71cf8962d81226463ab053e5921ff12d30f64f846b582d9",
  ),
  "anger-anxiety-agency": image(
    "reading",
    "anger-anxiety-agency",
    "Dense dark currents loosening into exploratory copper branches.",
    "The movement from tension toward open paths is a reading metaphor, not a treatment claim.",
    "440bae17e00624215fa647ce648ff290a01c1b526fbb45cc2cd368587c71b888",
  ),
  "weird-is-a-weird-word": image(
    "reading",
    "weird-is-a-weird-word",
    "A thin copper thread climbing stacked nocturnal strata toward a distant ember.",
    "One mark recedes through older layers; the image does not claim that rest teaches etymology.",
    "79ca399421b8d9ddf5a59d4e6e5ba3562c79730f5c2151894e896693a0d7fdca",
  ),
} as const satisfies EditorialImageRecord<"reading", ReadingNoteSlug>;

export function researchEditorialImage(
  slug: ResearchSlug,
): EditorialImage<"research", ResearchSlug> {
  return RESEARCH_EDITORIAL_IMAGES[slug];
}

export function readingEditorialImage(
  slug: ReadingNoteSlug,
): EditorialImage<"reading", ReadingNoteSlug> {
  return READING_EDITORIAL_IMAGES[slug];
}

export const editorialImages = [
  ...Object.values(RESEARCH_EDITORIAL_IMAGES),
  ...Object.values(READING_EDITORIAL_IMAGES),
] as const;
