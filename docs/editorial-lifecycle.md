# Sleepyland editorial lifecycle ledger

This ledger records why an indexable editorial route deserves a separate URL and when that decision must be revisited. Add the record before drafting. A record does not admit a page by itself: the evidence and rendered page still need independent review under `docs/editorial-method.md`.

Each record names the reader job, non-obvious answer, canonical host, original contribution, three nearest routes and their overlap, consolidation decision, primary evidence and checked date, claim-risk review state, voice evidence, homepage slot, owner, six admission scores, and reassessment date. Retired routes remain in the merge history of their canonical owner so a later contributor does not recreate them as keyword variants.

## Clinical-review quarantine

- **Routes:** `/research/benadryl-diphenhydramine-for-sleep` and `/research/z-drugs-zaleplon-zolpidem-eszopiclone`.
- **Review state:** No clinical or pharmacist review of the exact published claims is documented.
- **Indexing state:** Keep the public HTML and Markdown representations `noindex` and omit both routes from the homepage, research archive, feeds, sitemaps, and proactive indexing.
- **Exit condition:** A named clinician or pharmacist reviews the exact claims and the review scope and date are recorded here before either route becomes indexable.

## What frequency helps you sleep?

- **Canonical route:** `/research/what-frequency-helps-you-sleep`
- **Lifecycle state:** Keep after consolidation
- **Reader job:** Determine what a sleep-audio frequency label measures, whether the evidence supports the promised effect, and how to evaluate a track without treating a number as a prescription.
- **Non-obvious answer:** Audible pitch, tuning reference, binaural difference, modulation rate, EEG rhythm, and noise spectrum can all use hertz while describing different objects. A shared number does not transfer evidence between them.
- **Canonical host and why:** Sleepyland owns a browser sound generator with inspectable spectra and must explain why it offers adjustable broadband sound instead of a magic-frequency control.
- **Original contribution:** A checked taxonomy of five incompatible frequency meanings, a category-error table, and a decision procedure connecting the evidence boundary to Sleepyland's product default.
- **Nearest routes and overlap:** `/research/best-sleep-sounds` owns choosing a sound class; `/research/white-pink-brown-noise-for-sleep` owns spectral slopes and noise-color choice; `/research/how-sound-masking-works` owns auditory masking mechanics. Those pages may link here but do not need its EEG, tuning, binaural, and closed-loop taxonomy.
- **Consolidation decision:** The former `/research/binaural-beats-for-sleep` repeated the same 3 Hz example, delta category error, systematic review, closed-loop distinction, and safety boundary. Its one additional randomized trial, practical evaluation steps, and product-default conclusion were merged here on 2026-09-01; both its HTML and Markdown paths permanently redirect to this canonical route.
- **Primary evidence and checked date:** Sleep-oscillation review, brain-stimulation review, 2026 binaural review and randomized trial, 2024 dynamic-binaural study, 432 Hz pilot, adult auditory-stimulation review, and WHO safe-listening guidance; checked 2026-09-01 against the linked source records.
- **Claim-risk review:** Educational, health-adjacent synthesis with no clinician or pharmacist review claimed. It makes no diagnosis, treatment, dosing, or guaranteed-outcome claim.
- **Voice evidence:** Organizational evidence synthesis with software assistance disclosed on the public editorial-method surface; no personal experience or first-person endorsement.
- **Homepage slot:** None. Discovery is through the complete research archive and relevant canonical pages.
- **Owner:** Sleepyland maintainers.
- **Admission score:** Reader utility 2; original evidence 1; factual confidence 2; Sleepyland fit 2; voice integrity 2; maintenance value 1. Total 10/12, no zero.
- **Next source check:** 2026-10-13.
- **Reassess on:** 2026-10-13; choose keep, revise, merge, noindex, or remove after checking overlap and new controlled evidence.
