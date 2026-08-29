# Sleepyland

[![CI](https://github.com/hraness/sleepyland/actions/workflows/ci.yml/badge.svg)](https://github.com/hraness/sleepyland/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Sleepyland](https://sleepy.land) is an open-source, evidence-led publication about sleep, sound, and practical insomnia decisions. It includes a private-by-design browser sound machine at [sleepy.land/noise](https://sleepy.land/noise).

The sound machine synthesizes brown, pink, and white noise, procedural ocean surf, slow spatial movement, and interactive spectrum pulses locally with the Web Audio API. It uses no recorded audio, product account, microphone input, or server-side sound generation.

The publication covers sleep sounds, circadian light, insomnia techniques, supplements, medications, and common wellness claims. Articles lead with a direct answer, link material claims to sources, and keep direct evidence separate from mechanism, inference, and crowdsourced experience.

## Contribute

Code, accessibility improvements, research corrections, source additions, reproducible analyses, and carefully scoped article proposals are welcome.

- Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
- Use the [research correction template](https://github.com/hraness/sleepyland/issues/new?template=research_correction.yml) for an unsupported, outdated, or mischaracterized claim.
- Use the [bug report template](https://github.com/hraness/sleepyland/issues/new?template=bug_report.yml) for a reproducible product problem.
- Report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

Sleepyland is educational software and publishing, not medical advice. Contributions must not diagnose, prescribe, provide individualized treatment, or promise health outcomes.

## Development

Use Bun 1.3.14 and Node 24.

```sh
bun install --frozen-lockfile
bun run dev
```

Run the complete gate before submitting a change:

```sh
bun run check
```

The gate validates tests, types, lint, and the production build. Focused tests can be run directly with `bun test <path>` while editing.

## Structure

- `app/` contains the Next.js routes, Web Audio engine, spectrogram, research registry, metadata, and tests.
- `lib/` contains product-owned UI and browser-storage helpers.
- `styles/` contains the sound-machine and publication visual systems.
- `public/` contains the public IndexNow proof and silent product demo.
- `docs/editorial-method.md` explains how research claims and sources are reviewed.

## Privacy

Sound generation and settings remain on the device. The canonical production site uses bounded, cookieless PostHog analytics without session replay or person profiles. See the live [privacy page](https://sleepy.land/privacy) for the exact network and retention boundaries.

## License

Sleepyland is available under the [MIT License](LICENSE). Third-party research, quotations, names, and linked materials remain subject to their respective rights and terms.
