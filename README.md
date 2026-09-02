# Sleepyland

[![CI](https://github.com/hraness/sleepyland/actions/workflows/ci.yml/badge.svg)](https://github.com/hraness/sleepyland/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Sleepyland](https://sleepy.land) gives readers a direct answer, the sources behind it, and the limit of the evidence before they make a sleep decision. The same site includes a [private browser sound machine](https://sleepy.land/noise) for sleep, relaxation, and focus.

The admitted publication covers insomnia, circadian light, routines, environmental sound, and common wellness claims. It is educational publishing, not medical advice. Medication, supplement-safety, and other higher-risk pages remain outside discovery until their exact claims receive documented qualified review.

## First proof

[Does White Noise Help You Sleep? What Three 2026 Studies Found](https://sleepy.land/research/noise-and-sleep-2026) leads with a qualified answer, compares three recent studies without forcing a single verdict, links its sources, and publishes its revision date. Its HTML, structured data, social image, RSS record, sitemap entry, and [Markdown representation](https://sleepy.land/research/noise-and-sleep-2026.md) come from the same typed article and image registries.

Request the canonical page as Markdown:

```sh
curl -H 'Accept: text/markdown' \
  https://sleepy.land/research/noise-and-sleep-2026
```

## Working model

1. **Name the question.** Each guide owns one practical reader decision instead of stretching a keyword into several thin pages.
2. **Follow the evidence.** Material claims sit beside the studies, guidelines, labels, and public-health sources that support them.
3. **Keep the limit.** Population, protocol, uncertainty, and the line between evidence and inference remain visible.

## Interfaces

| Surface | Reader job | Entry point |
| --- | --- | --- |
| Human | Read the short answer, evidence label, decision support, linked sources, revision date, and limits. | [sleepy.land](https://sleepy.land) |
| Agent | Retrieve the same canonical record as Markdown and discover the bounded public corpus. | [`/llms.txt`](https://sleepy.land/llms.txt), [`/sitemap.md`](https://sleepy.land/sitemap.md), or `Accept: text/markdown` |
| Listener | Start local browser-generated sound, then choose a mode or open Tune only when needed. | [sleepy.land/noise](https://sleepy.land/noise) |

Sleepyland does not publish an API, OAuth flow, GraphQL endpoint, MCP server, developer portal, or uploaded-track library. Agents should cite the visible guide and preserve its evidence label and limits.

## Evidence and generated surfaces

`app/research/articles.ts` and its focused expansion modules own article titles, direct answers, evidence labels, sources, dates, topics, and related reading. `app/research/admissions.ts` owns the case-specific reader job, contribution, overlap decision, evidence fit, risk, score, and reassessment that permit an article into discovery. `app/editorial-images.ts` owns literal alt text, visible captions, credits, dimensions, and content hashes for the registered WebP assets.

Those registries generate or feed:

- canonical HTML routes and `BlogPosting` or `CollectionPage` structured data;
- Open Graph and Twitter metadata;
- the research RSS feed and XML sitemap image records;
- content-negotiated Markdown and `.md` siblings; and
- the Markdown sitemap and `llms.txt` discovery guide.

Substantive research changes must keep those surfaces aligned. Read [the editorial method](docs/editorial-method.md) before changing a claim or source.

## Boundaries

- **Evidence:** Sleepyland distinguishes direct findings, mechanism, inference, and experience. It does not claim clinician review that did not happen.
- **Review:** Drafted by an AI agent and checked against the linked sources by a separate Codex AI reviewer; no human clinical review is claimed.
- **Health:** Sleepyland does not diagnose, prescribe, provide individualized dosing, or promise an outcome.
- **Sound:** The sound machine synthesizes brown, pink, and white noise, procedural ocean surf, slow spatial movement, and spectrum pulses with the Web Audio API. It uses no recorded audio, product account, microphone input, uploaded mix, or server-side sound generation.
- **Privacy:** Settings remain on the device. Canonical production analytics are cookieless, omit session replay and person profiles, and admit only the checked categorical event schema.

## Questions

### Does the sound machine send audio or settings to a server?

No audio is uploaded or generated on a server. Settings stay in browser-local storage. Bounded anonymous analytics can include categorical mode and session kind, but not tuning values, exact playback duration, or spectrum gestures.

### How is AI-drafted research checked?

An AI agent can organize and compare sources. Before publication, a separate Codex AI reviewer checks material wording against the linked sources, and inference stays labeled as inference. No human clinical review is claimed.

### How do I challenge a claim?

Use the [research correction template](https://github.com/hraness/sleepyland/issues/new?template=research_correction.yml) with the page, disputed wording, and a stronger source. The typed registry keeps the visible guide, metadata, feed, sitemap, and Markdown record together.

## Smallest useful action

Choose one question in the [research library](https://sleepy.land/#research-guides), or [open the sound machine](https://sleepy.land/noise) when steady sound is the immediate job.

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
- `docs/editorial-method.md` defines how research claims and sources are reviewed.
- `docs/editorial-lifecycle.md` records clinical quarantine and durable merge history.

## License

Sleepyland is available under the [MIT License](LICENSE). Third-party research, quotations, names, and linked materials remain subject to their respective rights and terms.
