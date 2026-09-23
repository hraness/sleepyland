# Sleepyland

[![CI](https://github.com/hraness/sleepyland/actions/workflows/ci.yml/badge.svg)](https://github.com/hraness/sleepyland/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Sleepyland](https://sleepy.land) is a free sound machine that runs in your browser, with sourced guides to sleep and sound. The sound machine generates brown, pink, and white noise and ocean waves on your device for sleep, relaxation, or focus.

The [research guides](https://sleepy.land/research) cover insomnia, light and the body clock, bedtime routines, environmental sound, and popular wellness claims. Each one starts with a short answer and links its sources. The guides are educational and are not medical advice, and no clinician has reviewed them. Guides on medications, supplement safety, and other higher-risk topics stay unlisted until a clinician or pharmacist reviews their exact claims.

## Example guide

[Does White Noise Help You Sleep? What Three 2026 Studies Found](https://sleepy.land/research/noise-and-sleep-2026) starts with a short answer, compares three recent studies, links its sources, and shows its revision date. Its HTML, structured data, social image, RSS entry, sitemap entry, and [Markdown version](https://sleepy.land/research/noise-and-sleep-2026.md) come from the same typed article and image registries.

Request the page as Markdown:

```sh
curl -H 'Accept: text/markdown' \
  https://sleepy.land/research/noise-and-sleep-2026
```

## How the guides work

Each guide answers one practical question, so a keyword does not turn into several thin pages. Its claims sit next to the studies, guidelines, labels, and public-health sources that support them, and it says who was studied, how, and where the evidence turns into inference.

## Interfaces

| Who | What they can do | Where |
| --- | --- | --- |
| Readers | Read the short answer, evidence label, sources, revision date, and limits. | [sleepy.land/research](https://sleepy.land/research) |
| Agents | Read any public page as Markdown and find every public page. | [`/llms.txt`](https://sleepy.land/llms.txt), [`/sitemap.md`](https://sleepy.land/sitemap.md), or `Accept: text/markdown` |
| Listeners | Start the sound, then pick a mode or open Tune when needed. | [sleepy.land](https://sleepy.land) |

Sleepyland has no API. Agents should cite the visible guide and keep its evidence label and limits.

## Evidence and generated surfaces

`app/research/articles.ts` and its focused expansion modules own article titles, direct answers, evidence labels, sources, dates, topics, and related reading. `app/research/admissions.ts` owns the case-specific reader job, contribution, overlap decision, evidence fit, risk, score, and reassessment that permit an article into discovery. `app/editorial-images.ts` owns literal alt text, visible captions, credits, dimensions, and content hashes for the registered WebP assets.

Those registries generate or feed:

- canonical HTML routes and `BlogPosting` or `CollectionPage` structured data;
- Open Graph and Twitter metadata;
- the research RSS feed and XML sitemap image records;
- content-negotiated Markdown and `.md` siblings; and
- the Markdown sitemap and `llms.txt` discovery guide.

Substantive research changes must keep those surfaces aligned. Read [the editorial method](docs/editorial-method.md) before changing a claim or source.

After you add or change a PubMed, PMC, or DOI source, run `bun run check:citations --write`. It compares each source's title, journal, and year with the record at its link, labels preprints, and refreshes `app/research/citation-records.json`, which the test suite checks without network access.

## Limits

- **Evidence:** Sleepyland separates direct findings, mechanism, inference, and experience. No clinician or pharmacist has reviewed the guides.
- **Health:** Sleepyland does not diagnose, prescribe, provide individualized dosing, or promise an outcome.
- **Sound:** The sound machine synthesizes brown, pink, and white noise, procedural ocean surf, slow spatial movement, and spectrum pulses with the Web Audio API. It uses no recorded audio, product account, microphone input, uploaded mix, or server-side sound generation.
- **Privacy:** Settings are saved in the browser. On sleepy.land, analytics are cookieless and anonymous, with no session replay or person profiles, and send only the events listed on the [privacy page](https://sleepy.land/privacy).

## Questions

### Does the sound machine send audio or settings to a server?

No audio is uploaded or generated on a server. Settings are saved in browser storage. Anonymous analytics can include the mode you pick and the kind of session you play, but not Tune settings, exact listening time, or spectrum gestures.

### How are the sources checked?

`bun run check:citations` compares every PubMed, PMC, and DOI source's title, journal, and year with the record at its link, and the test suite checks the registry against a committed snapshot of those records. Whether a source supports the nearby wording is an editorial check described in [the editorial method](docs/editorial-method.md). No clinician has reviewed the guides.

### How do I challenge a claim?

Use the [research correction template](https://github.com/hraness/sleepyland/issues/new?template=research_correction.yml) with the page, disputed wording, and a stronger source. The typed registry keeps the visible guide, metadata, feed, sitemap, and Markdown record together.

## Start here

Choose a question in the [research guides](https://sleepy.land/research), or [open the sound machine](https://sleepy.land) when you want steady sound now.

## Development

Use Bun 1.3.14 and Node 24.

```sh
bun install --frozen-lockfile
bun run dev
```

Run focused tests while editing. Run the complete gate before submitting a change:

```sh
bun run check
```

The gate validates tests, types, lint, and the production build.

## Contribute

Code, accessibility improvements, research corrections, source additions, reproducible analyses, and carefully scoped article proposals are welcome.

- Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
- Use the [bug report template](https://github.com/hraness/sleepyland/issues/new?template=bug_report.yml) for a reproducible product problem.
- Report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

## Structure

- `app/` contains the routes, Web Audio engine, research registry, metadata, discovery surfaces, and colocated tests.
- `lib/` contains product-owned UI and browser-storage helpers.
- `styles/` contains the fixed-viewport sound-machine and serif publication systems.
- `public/` contains the IndexNow proof, silent product demo, and registered editorial images.
- `scripts/check-citations.ts` checks source metadata against PubMed, PMC, and Crossref.
- `docs/editorial-method.md` defines how research claims and sources are reviewed.
- `docs/editorial-lifecycle.md` records clinical quarantine and durable merge history.

## License

Sleepyland is available under the [MIT License](LICENSE). Third-party research, quotations, names, and linked materials remain subject to their respective rights and terms.
