import {
  type ProductPageInline,
  type ProductPageSection,
} from "./product-pages";

export const READING_NOTE_SLUGS = [
  "good-ideas",
  "habit-and-rest",
  "anger-anxiety-agency",
  "weird-is-a-weird-word",
] as const;

export type ReadingNoteSlug = (typeof READING_NOTE_SLUGS)[number];

export const READING_DESCRIPTION =
  "Reading notes on rest, attention, habit, anxiety, curiosity, language, and the limited role of a quiet listening environment.";

export type ReadingNoteDefinition = Readonly<{
  description: string;
  heading: string;
  intro: readonly ProductPageInline[];
  path: `/reading/${ReadingNoteSlug}`;
  publishedAt: string;
  sections: readonly ProductPageSection[];
  slug: ReadingNoteSlug;
  title: string;
  updatedAt: string;
}>;

function link(text: string, href: string): Readonly<{ href: string; text: string }> {
  return { href, text };
}

export const READING_NOTES = [
  {
    slug: "good-ideas",
    path: "/reading/good-ideas",
    heading: "Rest is a practiced state that keeps unfashionable ideas alive",
    title: "Rest is a practiced state that keeps unfashionable ideas alive | Sleepyland",
    description:
      "Henrik and Johanna Karlsson describe solitude as a practiced state of mind that protects fragile, unfashionable ideas. Sleepyland is a browser sound machine; rest can hold that practice. It is not a habit loop and not a treatment.",
    publishedAt: "2026-08-26",
    updatedAt: "2026-09-01",
    intro: [
      "Henrik and Johanna Karlsson write that unusually good ideas begin as fragile thoughts, and that those thoughts need a cultivated state of mind rather than a room of peers. Sleepyland does not write the idea. It is a free browser sound machine that can hold a listening state while you rest or work. The claim on this page is narrower: rest and solitude are a practiced state that can keep an unfashionable idea alive. They are not treatments, and they do not guarantee insight.",
    ],
    sections: [
      {
        heading: "What the Karlssons describe",
        paragraphs: [
          [
            "In ",
            link(
              "“Cultivating a state of mind where new ideas are born”",
              "https://www.henrikkarlsson.xyz/p/good-ideas",
            ),
            " (Escaping Flatland, 26 July 2023), Henrik and Johanna Karlsson start from a practical observation about startup coworking. Sam Altman argued that great early ideas often sound bad, and that a room of peers can laugh those ideas into safer, smaller work. The Karlssons treat that social filter as a wider creative problem. Picasso, Baldwin, and Dylan talk about solitude, but the essay says the useful object is a state of mind: a stretch of attention in which other people’s opinions recede and larval questions can be noticed.",
          ],
          [
            "They read working notes that were not written for publication. Alexander Grothendieck spent three isolated years at Montpellier reinventing measurement ideas that mathematicians already knew. He later called that isolation the way he learned “the capacity to be alone.” The scarce skill in the essay is not answering fashionable questions. It is lingering in confusion long enough for a more precise question to appear. Ingmar Bergman’s workbooks are the other portrait: an uncensored daily notebook, fixed morning hours, and a private voice that can be commonplace or transgressive before a film exists.",
          ],
          [
            "The essay’s point is that this state is practiced. Sitting in a room is not enough. Grothendieck learned solitude by working alone for years. Bergman kept the state from collapsing with a daily workbook and a fixed morning window. The Karlssons also collect techniques that keep the state from collapsing back into fashion: delayed publication, chosen collaborators, and working faster than self-censorship. They are not writing a sleep protocol. They are describing how a person keeps an internal reference for curiosity so later collaboration does not replace it.",
          ],
        ],
      },
      {
        heading: "What Hraness recorded",
        paragraphs: [
          [
            link("Hraness", "https://hraness.com"),
            " published a ",
            link(
              "reading note on the same essay",
              "https://hraness.com/reading/cultivating-a-state-of-mind-where-new-ideas-are-born",
            ),
            ". That note compresses the argument into a gist and five ideas: premature consensus as a two-tailed filter, reinvention as attention training, question selection as the scarce skill, solitude as an internal reference point, and embodied practices that keep the state open.",
          ],
          [
            "This Sleepyland page is a different document. It is not that Reading digest. It starts from the Karlsson essay and from ",
            link("what Sleepyland is", "/about"),
            ", then asks what rest has to do with practicing the solitude they describe.",
          ],
        ],
      },
      {
        heading: "Rest as a practiced state",
        paragraphs: [
          [
            "The Karlssons’ filter is social. A coworking table, a fashionable problem, or a premature audience can kill a larval idea by making it sound foolish. The practiced state is what keeps that unfashionable idea from dying on first contact. Rest belongs here as one of the embodied practices the essay points at. A night of broken sleep, a day of context switching, or a room that keeps capturing attention leaves no interval in which other people’s opinions can recede. Rest can hold that interval. That sentence is an inference from ordinary working life and from what the product does. It is not a trial result, and it does not diagnose an attention disorder.",
          ],
          [
            "This is a different job from ",
            link(
              "the reading take on habit and rest",
              "/reading/habit-and-rest",
            ),
            ". That later page starts from James Somers’s 2012 excerpts of William James, which ",
            link(
              "Hraness recorded as practical advice on habit",
              "https://hraness.com/reading/the-best-general-advice-on-earth",
            ),
            ": act while the resolve is fresh, and keep effort alive with small unnecessary hard things. The habit page asks when starting a rest environment becomes a habit. This page asks what the practiced state can hold: an unfashionable idea. James on habit does not explain how larval questions survive a fashionable room.",
          ],
          [
            "It is also a different job from ",
            link(
              "the reading take on rest as a place where anxiety can become curiosity",
              "/reading/anger-anxiety-agency",
            ),
            ". That later page starts from Armin Ronacher. This page starts from a different essay and a different failure: an unfashionable idea that dies because it sounded foolish too early. Rest can be the practiced state in which that idea stays.",
          ],
          [
            "It is also a different job from ",
            link(
              "the reading take on rest as practiced attention to language",
              "/reading/weird-is-a-weird-word",
            ),
            ". That later page starts from Colin Gorrie’s essay on English weird. Following a word backward is a sibling practice: another stretch of attention that a fashionable or casual meaning can close too soon. This page still asks what rest can hold for an unfashionable idea, not for an older word.",
          ],
          [
            "Sleepyland’s job, if it has one here, is modest. Sleep, Relax, and Focus are listening contexts. They generate local brown, pink, or white noise with procedural waves so a stretch of rest or work can continue in a room that would otherwise keep interrupting. Energy changes movement, not volume. Settings stay on this device. The generator does not produce ideas, score creativity, or promise that a session will yield a question worth keeping.",
          ],
        ],
      },
      {
        heading: "What Sleepyland actually does",
        paragraphs: [
          [
            "The ",
            link("about page", "/about"),
            " records the product facts. Sleepyland is a free browser sound machine. It uses no recorded files, product accounts, or server-side audio. The ",
            link("interactive machine", "/noise"),
            " is the product.",
          ],
          [
            "This page is not that record. It is a reading take. If you want the machine, open ",
            link("the Sleepyland sound machine", "/noise"),
            ". If you want the publisher, ",
            link("Hraness", "https://hraness.com"),
            " lists the project among its public work. If you want sourced comparisons of noise, music, and silence for attention tasks, that evidence lives in ",
            link("Sleepyland Research", "/research/sound-for-focus-noise-music-silence"),
            ".",
          ],
        ],
      },
      {
        heading: "What this page does not claim",
        paragraphs: [
          [
            "Sleepyland is not a medical device. This page is not medical advice. It does not diagnose insomnia, attention problems, or any other condition. It does not recommend supplements or treatment. Sleep, Relax, and Focus name intended listening contexts, not guaranteed outcomes. A practiced stretch of rest can hold solitude. It does not produce ideas, start a habit, convert anxiety, or recover an older meaning. Silence remains a complete option when the room is already usable.",
          ],
        ],
      },
      {
        heading: "Sources",
        items: [
          [
            link(
              "Henrik Karlsson and Johanna Karlsson, “Cultivating a state of mind where new ideas are born,” Escaping Flatland, 26 July 2023",
              "https://www.henrikkarlsson.xyz/p/good-ideas",
            ),
            ".",
          ],
          [
            link(
              "Hraness reading note on the same essay",
              "https://hraness.com/reading/cultivating-a-state-of-mind-where-new-ideas-are-born",
            ),
            ".",
          ],
          [
            link(
              "Hraness reading note on Somers’s James excerpts",
              "https://hraness.com/reading/the-best-general-advice-on-earth",
            ),
            ".",
          ],
          [
            link(
              "Sleepyland reading take on habit and rest",
              "/reading/habit-and-rest",
            ),
            ".",
          ],
          [
            link(
              "Sleepyland reading take on rest as a place where anxiety can become curiosity",
              "/reading/anger-anxiety-agency",
            ),
            ".",
          ],
          [
            link(
              "Sleepyland reading take on rest as practiced attention to language",
              "/reading/weird-is-a-weird-word",
            ),
            ".",
          ],
          [
            link("What Sleepyland is", "/about"),
            ".",
          ],
        ],
      },
    ],
  },
  {
    slug: "habit-and-rest",
    path: "/reading/habit-and-rest",
    heading: "Rest is not a habit until the first small hard thing starts",
    title: "Rest is not a habit until the first small hard thing starts | Sleepyland",
    description:
      "Shreyans Bhansali pointed at James Somers’s 2012 William James excerpts on habit. Sleepyland is a local sound environment; rest becomes a habit only after the first small act starts.",
    publishedAt: "2026-08-27",
    updatedAt: "2026-08-28",
    intro: [
      "Shreyans Bhansali pointed at James Somers’s 2012 excerpts of William James on habit: seize the first chance to act, and keep effort alive with small unnecessary hard things. Sleepyland is a free browser sound machine for sleep, relaxation, and focus. It can hold a listening environment. The claim on this page is the loop after rest and attention: that environment is not a habit until the first small act starts.",
    ],
    sections: [
      {
        heading: "What Bhansali pointed at",
        paragraphs: [
          [
            "On 19 August 2026, ",
            link("Shreyans Bhansali posted on X", "https://x.com/shreyans___/status/2090209900076949677"),
            ". The visible text begins “Very much in line with…,” and the image is Somers’s 2012 post. ",
            link("Hraness recorded that pairing", "https://hraness.com/reading/very-much-in-line-with-william-james"),
            " as a note about daily action and discipline set beside the James excerpts. This page starts from that pointer. It does not reconstruct Bhansali’s career, and it does not treat the post as a sleep study.",
          ],
        ],
      },
      {
        heading: "The James excerpts Somers kept",
        paragraphs: [
          [
            "Somers published “The best general advice on earth” on 25 July 2012. The live URL is ",
            link("jsomers.net/blog/william-james-advice", "https://jsomers.net/blog/william-james-advice"),
            ". The title-slug address does not resolve. The post extracts five passages from William James’s 1890 ",
            "Principles of Psychology, Chapter IV, “Habit.”",
          ],
          [
            "Two of those passages do the work here. James says a resolve trains the nervous system when it produces a motor effect, so the useful move is to take the first concrete chance to act. He also says unused maxims can leave character untouched, and that a little unnecessary hard thing every day or two keeps the faculty of effort available. Those are 1890 psychology excerpts, not a trial of sleep sound.",
          ],
          [
            link(
              "Hraness’s note on the same Somers post",
              "https://hraness.com/reading/the-best-general-advice-on-earth",
            ),
            " compresses that argument: make useful actions automatic, act while the resolve is fresh, and practice small unnecessary effort. This Sleepyland page is a different document. It asks what that loop has to do with a rest environment.",
          ],
        ],
      },
      {
        heading: "The next loop after rest and attention",
        paragraphs: [
          [
            "The earlier Sleepyland ",
            link(
              "reading take on rest as a practiced state that keeps unfashionable ideas alive",
              "/reading/good-ideas",
            ),
            " starts from Henrik and Johanna Karlsson. Their essay is about solitude as a cultivated state of mind in which a fragile, unfashionable idea can survive. That page asks whether rest can hold that practice.",
          ],
          [
            "This page starts after that practiced state is available. A quiet room, a listening state, or a plan to rest later is still a maxim if nothing starts. James, through Somers, treats the first acted chance as the training event. The inference on this page is ordinary and limited: an environment you never start does not become a habit. That is not a finding from Sleepyland Research, and it does not explain how ideas form.",
          ],
          [
            "A later ",
            link(
              "reading take on rest as a place where anxiety can become curiosity",
              "/reading/anger-anxiety-agency",
            ),
            " starts from Armin Ronacher. That page is about a condition during rest, not about when starting becomes a habit.",
          ],
        ],
      },
      {
        heading: "What starting looks like here",
        paragraphs: [
          [
            "On this site, the first small act can be opening the ",
            link("sound machine", "/noise"),
            ", choosing Sleep, Relax, or Focus, and starting playback. That is a motor effect in James’s sense only as an analogy. The generator synthesizes brown, pink, or white noise with procedural waves in the browser. Settings stay on this device. Energy changes movement, not volume. The machine does not score discipline, count streaks, or turn a session into character.",
          ],
          [
            "The ",
            link("about page", "/about"),
            " records those product facts. Sleepyland is an environment for sleep, relaxation, and focus. It is not a treatment. Silence remains a complete option when the room is already usable.",
          ],
          [
            "If you want sourced comparisons of noise, music, and silence once a focus session has begun, that evidence lives in ",
            link(
              "the research guide on sound for focus",
              "/research/sound-for-focus-noise-music-silence",
            ),
            ". That page asks which sound, if any, helps an attention task. This page asks when starting the environment becomes a habit. Hotel-sleep research is a third job: it studies novelty and first-night vigilance in unfamiliar rooms, not habit training.",
          ],
        ],
      },
      {
        heading: "What this page does not claim",
        paragraphs: [
          [
            "Sleepyland is not a medical device. This page is not medical advice. It does not diagnose insomnia, anxiety, attention problems, or any other condition. It does not recommend supplements or treatment. Sleep, Relax, and Focus name intended listening contexts, not guaranteed outcomes. William James on habit is historical advice about action, not a protocol for sleep or mental health.",
          ],
        ],
      },
      {
        heading: "Sources",
        items: [
          [
            link(
              "Shreyans Bhansali, public post beginning “Very much in line with…,” X, 19 August 2026",
              "https://x.com/shreyans___/status/2090209900076949677",
            ),
            ".",
          ],
          [
            link(
              "James Somers, “The best general advice on earth,” 25 July 2012",
              "https://jsomers.net/blog/william-james-advice",
            ),
            ".",
          ],
          [
            link(
              "Hraness reading note on Bhansali’s pointer to those excerpts",
              "https://hraness.com/reading/very-much-in-line-with-william-james",
            ),
            ".",
          ],
          [
            link(
              "Hraness reading note on Somers’s James excerpts",
              "https://hraness.com/reading/the-best-general-advice-on-earth",
            ),
            ".",
          ],
          [
            link("What Sleepyland is", "/about"),
            ".",
          ],
        ],
      },
    ],
  },
  {
    slug: "anger-anxiety-agency",
    path: "/reading/anger-anxiety-agency",
    heading: "Rest is where anxiety can become curiosity",
    title: "Rest is where anxiety can become curiosity | Sleepyland",
    description:
      "Armin Ronacher writes that anxiety fits an uncertain craft better than anger. Sleepyland is a browser sound machine; a stretch of rest is one place that anxiety can become curiosity.",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    intro: [
      "Armin Ronacher writes that anger at work rarely helps, and that anxiety is a reasonable response to an uncertain craft. Sleepyland is a free browser sound machine with Sleep, Relax, and Focus listening contexts. The claim on this page is narrower: a stretch of rest is one place that anxiety can turn into curiosity instead of into anger that needs a villain. That is a condition, not a cure.",
    ],
    sections: [
      {
        heading: "What Ronacher describes",
        paragraphs: [
          [
            "In ",
            link(
              "“Anger, Anxiety and Agency”",
              "https://lucumr.pocoo.org/2026/8/24/anger-anxiety-agency/",
            ),
            " (24 August 2026), Ronacher starts from Sean Goedecke’s argument that you should not stay angry at work. Anger can signal a problem, but it often lands on people who cannot change the cause. A comment asked how anyone in tech can avoid anger now. Ronacher’s answer is that the fitting emotion is often anxiety, not anger.",
          ],
          [
            "Anxiety does not need someone to blame. It can name an uncertain craft, workplace, or future. Anger needs a target. It can turn a loss of control into a story with a villain, and during a large disruption that villain is often the wrong person. Uncertainty can become curiosity: poke at what is changing, treat it as interesting, then experiment. Ownership grants agency without foresight. Leaders can act and speak with confidence while remaining privately unsure.",
          ],
          [
            "Ronacher is not writing a sleep protocol. He is writing about work, craft, and how to stay curious before naming a villain.",
          ],
        ],
      },
      {
        heading: "What Hraness recorded",
        paragraphs: [
          [
            link("Hraness", "https://hraness.com"),
            " published a ",
            link(
              "Reading digest of the same essay",
              "https://hraness.com/reading/anger-anxiety-and-agency",
            ),
            ". That digest compresses the argument into a gist and five ideas: anger as a poor workplace instrument, anxiety as a better fit for this moment, uncertainty becoming curiosity, agency without foresight, and learning before naming a villain.",
          ],
          [
            "This Sleepyland page is a different document. It is not that Reading digest. It starts from Ronacher’s distinction and from ",
            link("what Sleepyland is", "/about"),
            ", then asks what a rest stretch has to do with converting anxiety toward curiosity. An earlier ",
            link(
              "reading take on habit and rest",
              "/reading/habit-and-rest",
            ),
            " starts from a different loop: a rest environment is not a habit until the first small act starts.",
          ],
        ],
      },
      {
        heading: "A stretch of rest as a condition",
        paragraphs: [
          [
            "Ronacher’s useful move is to keep uncertainty from hardening into a villain story. That work happens in attention. A later stretch of rest is one place it can happen, because the next task is not yet demanding a target. Anxiety can stay unnamed long enough to become a question.",
          ],
          [
            "That sentence is an inference from ordinary rest and from what the product does. It is not a trial result. It does not diagnose anxiety, and it does not treat anger. A listening state can hold the stretch. It cannot convert the emotion for you.",
          ],
          [
            "This is a different job from ",
            link(
              "rest as a practiced state that keeps unfashionable ideas alive",
              "/reading/good-ideas",
            ),
            ". That earlier take starts from Henrik and Johanna Karlsson and asks whether rest can hold the solitude that keeps an unfashionable idea alive. This page starts from a different essay and a different failure: anxiety that becomes anger because it needs a villain. Starting the environment is a later act, and that loop belongs on the habit page.",
          ],
        ],
      },
      {
        heading: "What Sleepyland actually does",
        paragraphs: [
          [
            "The ",
            link("about page", "/about"),
            " records the product facts. Sleepyland is a free browser sound machine. It uses no recorded files, product accounts, or server-side audio. The ",
            link("interactive machine", "/noise"),
            " is the product.",
          ],
          [
            "This page is not that record. It is a reading take. If you want the machine, open ",
            link("the Sleepyland sound machine", "/noise"),
            ". Sleep, Relax, and Focus are listening contexts. They generate local brown, pink, or white noise with procedural waves so a stretch of rest or work can continue in a room that would otherwise keep interrupting. Energy changes movement, not volume. Settings stay on this device. The generator does not score emotion or name a villain. It does not promise that a session will turn anxiety into curiosity.",
          ],
          [
            "If you want sourced duration guidance, ",
            link(
              "the research guide on whether eight hours of sleep is necessary",
              "/research/is-eight-hours-of-sleep-necessary",
            ),
            " studies a planning number, not this conversion. That page notes that an eight-hour target can become unhelpful when it creates its own duration anxiety. That is a different reader job.",
          ],
        ],
      },
      {
        heading: "What this page does not claim",
        paragraphs: [
          [
            "Sleepyland is not a medical device. This page is not medical advice. It does not diagnose anxiety, anger, insomnia, or any other condition. It does not recommend supplements or treatment. Sleep, Relax, and Focus name intended listening contexts, not guaranteed outcomes. A rest stretch is a condition in which curiosity can appear. It is not a cure. Silence remains a complete option when the room is already usable.",
          ],
        ],
      },
      {
        heading: "Sources",
        items: [
          [
            link(
              "Armin Ronacher, “Anger, Anxiety and Agency,” 24 August 2026",
              "https://lucumr.pocoo.org/2026/8/24/anger-anxiety-agency/",
            ),
            ".",
          ],
          [
            link(
              "Hraness Reading digest of the same essay",
              "https://hraness.com/reading/anger-anxiety-and-agency",
            ),
            ".",
          ],
          [
            link("What Sleepyland is", "/about"),
            ".",
          ],
        ],
      },
    ],
  },
  {
    slug: "weird-is-a-weird-word",
    path: "/reading/weird-is-a-weird-word",
    heading: "Rest is a practiced state that can follow a word backward",
    title: "Rest is a practiced state that can follow a word backward | Sleepyland",
    description:
      "Colin Gorrie traces English weird from Old English fate to everyday oddness. Sleepyland is a browser sound machine; following a word backward is a practiced state of attention, sibling to solitude. It is not a habit loop and not a treatment.",
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-01",
    intro: [
      "Colin Gorrie writes that English weird once named fate, nearly vanished after French and Latin loanwords arrived, then returned through a chain of literary accidents until it meant odd. Sleepyland is a free browser sound machine for sleep, relaxation, and focus. The claim on this page is narrower: following a word backward is a practiced state of attention, sibling to the solitude that keeps an unfashionable idea alive. Rest can hold that attention. It is not a habit, and it does not treat anxiety.",
    ],
    sections: [
      {
        heading: "What Gorrie describes",
        paragraphs: [
          [
            "In ",
            link(
              "“Weird” is a weird word",
              "https://www.deadlanguagesociety.com/p/weird-is-a-weird-word",
            ),
            " (Dead Language Society, 8 July 2026), Gorrie starts from a casual modern use. People say weird for a coincidence, a fridge smell, or an odd colleague. A thousand years earlier, Old English wyrd named fate. It appears at the bleakest turns of Beowulf and The Wanderer: fate always goes as it must; fate is inexorable. The word comes from the same root as weorþan, “to happen” or “become.” So wyrd is that which happens. Poets praised the person who could face it without flinching.",
          ],
          [
            "After 1066, French fortune and destiny, then Latin fate, made the native word superfluous in the south. It survived in Scots, spelled weird. That Scots spelling is why the English word looks irregular beside weed, field, and beard.",
          ],
          [
            "Scots writers used weird sisters for the classical Fates. Raphael Holinshed’s Chronicles applied the phrase to the three women in the Macbeth story and glossed them as goddesses of destiny. When Shakespeare took the scene into Macbeth, he kept weird sisters and left out the explanation. The First Folio often set weyward, a compositor’s likelier English word. Lewis Theobald later restored weird from Holinshed. For a long time, most English readers met the word only in that play, without a gloss. Romantic writers filled the blank with “eerie” or “uncanny.” Dickens used it for “odd.” The Oxford English Dictionary later records a sharp rise in the adjective’s frequency. Gorrie is not writing a sleep protocol. He is tracing how a heavy word became casual, and how a few literary choices kept it alive at all.",
          ],
        ],
      },
      {
        heading: "What Hraness recorded",
        paragraphs: [
          [
            link("Hraness", "https://hraness.com"),
            " published a ",
            link(
              "reading note on the same essay",
              "https://hraness.com/reading/weird-is-a-weird-word",
            ),
            ". That note compresses the argument into a gist and five ideas about fate, loanwords, Scots spelling, the literary chain, and semantic drift.",
          ],
          [
            "This Sleepyland page is a different document. It is not that Reading digest. It starts from Gorrie’s history and from ",
            link("what Sleepyland is", "/about"),
            ", then asks what rest has to do with practicing the attention a word’s older meaning needs.",
          ],
        ],
      },
      {
        heading: "Rest as practiced attention to language",
        paragraphs: [
          [
            "Gorrie’s useful object is not a trivia fact. It is the stretch of attention in which a casual word can be followed back to a heavier one. Opening a dictionary is not enough if the current meaning closes the question. The practiced state is lingering after “odd” until fate, Scots survival, and an unexplained Shakespearean phrase can still be noticed.",
          ],
          [
            "That lingering is a sibling of the solitude Henrik and Johanna Karlsson describe. Their essay, and the Sleepyland ",
            link(
              "reading take on rest as a practiced state that keeps unfashionable ideas alive",
              "/reading/good-ideas",
            ),
            ", ask how a fragile thought survives a fashionable room. This page asks how an older meaning survives a casual one. Both are practiced attention. They are not the same filter.",
          ],
          [
            "This is a different job from ",
            link(
              "the reading take on habit and rest",
              "/reading/habit-and-rest",
            ),
            ". That page starts from James Somers’s excerpts of William James: a rest environment is not a habit until the first small act starts. Following a word backward is not that loop. Starting playback does not recover wyrd.",
          ],
          [
            "It is also a different job from ",
            link(
              "the reading take on rest as a place where anxiety can become curiosity",
              "/reading/anger-anxiety-agency",
            ),
            ". That page starts from Armin Ronacher. This page does not ask how anxiety becomes curiosity, and it does not need a villain. It asks whether rest can hold the quieter work of following a word.",
          ],
          [
            "A night of broken sleep or a room that keeps capturing attention leaves no interval in which a casual meaning can recede. Rest can hold that interval. That sentence is an inference from ordinary working life and from what the product does. It is not a trial result, and it does not diagnose an attention disorder.",
          ],
          [
            "Sleepyland’s job, if it has one here, is modest. Sleep, Relax, and Focus are listening contexts. They generate local brown, pink, or white noise with procedural waves so a stretch of rest or work can continue in a room that would otherwise keep interrupting. Energy changes movement, not volume. Settings stay on this device. The generator does not teach etymology, score curiosity, or promise that a session will recover an older meaning.",
          ],
        ],
      },
      {
        heading: "What Sleepyland actually does",
        paragraphs: [
          [
            "The ",
            link("about page", "/about"),
            " records the product facts. Sleepyland is a free browser sound machine. It uses no recorded files, product accounts, or server-side audio. The ",
            link("interactive machine", "/noise"),
            " is the product.",
          ],
          [
            "This page is not that record. It is a reading take. If you want the machine, open ",
            link("the Sleepyland sound machine", "/noise"),
            ". If you want the publisher, ",
            link("Hraness", "https://hraness.com"),
            " lists the project among its public work. If you want sourced comparisons of noise, music, and silence for attention tasks, that evidence lives in ",
            link("Sleepyland Research", "/research/sound-for-focus-noise-music-silence"),
            ".",
          ],
        ],
      },
      {
        heading: "What this page does not claim",
        paragraphs: [
          [
            "Sleepyland is not a medical device. This page is not medical advice. It does not diagnose insomnia, attention problems, or any other condition. It does not recommend supplements or treatment. Sleep, Relax, and Focus name intended listening contexts, not guaranteed outcomes. A practiced stretch of rest can hold attention to language. It does not produce etymology, start a habit, or convert anxiety. Silence remains a complete option when the room is already usable.",
          ],
        ],
      },
      {
        heading: "Sources",
        items: [
          [
            link(
              "Colin Gorrie, “Weird” is a weird word, Dead Language Society, 8 July 2026",
              "https://www.deadlanguagesociety.com/p/weird-is-a-weird-word",
            ),
            ".",
          ],
          [
            link(
              "Hraness reading note on the same essay",
              "https://hraness.com/reading/weird-is-a-weird-word",
            ),
            ".",
          ],
          [
            link(
              "Sleepyland reading take on rest as a practiced state that keeps unfashionable ideas alive",
              "/reading/good-ideas",
            ),
            ".",
          ],
          [
            link(
              "Sleepyland reading take on habit and rest",
              "/reading/habit-and-rest",
            ),
            ".",
          ],
          [
            link("What Sleepyland is", "/about"),
            ".",
          ],
        ],
      },
    ],
  },
] as const satisfies readonly ReadingNoteDefinition[];

export function getReadingNote(slug: string): ReadingNoteDefinition | undefined {
  return READING_NOTES.find((note) => note.slug === slug);
}

export function isReadingNotePath(pathname: string): boolean {
  return READING_NOTES.some((note) => note.path === pathname);
}
