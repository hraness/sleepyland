# Sleepyland editorial method

Sleepyland publishes practical, evidence-led guides for people making decisions about sleep, sound, light, routines, supplements, and medications. The publication is educational and does not provide medical advice.

## Choose the reader question

One page should own one decision. Search language helps identify unresolved questions, but it does not justify thin pages or wording variants. A new article must have a distinct reader job, sufficient evidence, and an original contribution that an existing page cannot absorb cleanly.

Before drafting an indexable route, add a record to `docs/editorial-lifecycle.md` with the reader's concrete job, its canonical owner, the original decision aid or inspectable result, the three nearest existing pages, why consolidation is insufficient, the primary evidence, claim-risk reviewer, owner, score, and next evidence-refresh and reassessment dates. Source count and word count do not establish usefulness. A page that only restates a caveat, targets a wording variant, or forces an unrelated essay into Sleepyland's product vocabulary should be merged or rejected.

Score reader utility, original evidence, factual confidence, Sleepyland fit,
voice integrity, and maintenance value from 0–2. An indexable route needs at
least 9/12 and no zero. Scores of 6–8 require revision or consolidation; 5 or
less is a rejection. Keywords, article length, source count, link count, image
count, recency, and a publishing calendar cannot raise the score.

Treat publication as provisional until a 28- to 56-day consolidation review chooses keep, revise, merge-and-redirect, or remove. Generate editorial imagery only after admission; a completed banner never creates a reason to retain a weak page.

## Build the evidence map

Start with current systematic reviews, professional guidelines, regulator records, official labels, and controlled human studies. Follow citations into primary research when protocol details or subgroup claims matter. Record the population, intervention, comparator, outcome, duration, and limitations that change interpretation.

Crowdsourced experience can identify vocabulary, practical questions, and adverse patterns that formal literature misses. It remains anecdotal. Historical and folk use adds cultural context but does not establish efficacy.

## Classify every claim

Keep these categories distinct in the prose:

- **Direct evidence:** the cited study measured the relevant sleep or daytime outcome in an applicable population.
- **Mechanism:** physiology or acoustics makes an effect plausible but does not prove the reader outcome.
- **Inference:** the article draws a bounded conclusion across several facts.
- **Experience or preference:** a person or community describes a subjective result.
- **Product behavior:** the repository or browser implementation can verify the claim directly.

Do not transfer a result across populations, preparations, doses, devices, or clinical settings without stating the gap.

## Write for retrieval and verification

Lead with a short qualified answer. Use descriptive headings, semantic tables, ordinary crawlable links, visible dates, and source titles that let a reader inspect the evidence. Metadata and structured data must match the visible page. Answer engines do not need special hidden prose or unsupported FAQ markup.

## Apply health safeguards

Do not diagnose, prescribe, provide individualized treatment, recommend dangerous or illegal use, or promise sleep outcomes. Avoid dosing schedules and interaction advice that belongs with a clinician or pharmacist. State when evidence is observational, indirect, commercially conflicted, underpowered, or too heterogeneous for a confident conclusion.

Persistent insomnia, breathing symptoms during sleep, severe daytime impairment, medication questions, substance dependence, or immediate danger deserves qualified help beyond this publication.

Medication comparisons, controlled-substance topics, and dangerous-use queries stay `noindex` and out of feeds, sitemaps, home modules, and proactive indexing until a documented clinical or pharmacist review approves the exact claims. Community reports may identify a safety question, but they are not a mandate to publish an acquisition page.

## Review before publication

A substantive article change should pass this checklist:

- The direct answer matches the body and metadata.
- Each material claim has a source that supports the nearby wording.
- The evidence is sufficient for the exact claims and the page adds original decision support; a source-count target is not a substitute for either.
- Evidence, mechanism, inference, history, and experience remain distinguishable.
- Related links are intentional and no existing page owns the same reader job.
- Homepage promotion is curated rather than date-driven and never exceeds eight guides; the full registry belongs at `/research`.
- Any health-risk review and indexing decision is documented beside the change.
- The article route, canonical, structured data, RSS, sitemap, and Markdown representation agree.
- `bun run check` passes.

Corrections should update the visible claim, metadata, structured data, source record, and substantive revision date together when applicable.
