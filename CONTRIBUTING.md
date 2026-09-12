# Contributing to Sleepyland

Sleepyland welcomes focused contributions to its sound engine, interface, accessibility, tests, documentation, and research publication.

## Before starting

Search existing issues and pull requests before opening a new one. For a substantial feature, article, or architectural change, open an issue first so the reader problem, evidence boundary, and implementation scope can be agreed before either side invests heavily.

Use GitHub Security Advisories or the private contact in [SECURITY.md](SECURITY.md) for vulnerabilities. Do not open a public issue containing an exploit, secret, private analytics, or personal health information.

## Development

Use Bun 1.3.14 and Node 24.

```sh
bun install --frozen-lockfile
bun run dev
```

Run focused tests while editing and the complete gate before submitting:

```sh
bun run check
```

Keep changes narrow, preserve existing behavior unless the issue requires changing it, and add deterministic evidence for regressions. Do not add another package manager or lockfile.

### Browser regression check

After `bun run check` builds the production application, set
`SLEEPYLAND_BROWSER_EXECUTABLE` to the absolute path of an installed Chromium or
Google Chrome executable, then run:

```sh
bun run check:browser
```

The check starts and stops its own loopback production server and isolated,
headless browser. It does not download browsers or reuse a signed-in profile.
On machines with a host or repository resource scheduler, run this command in
its exclusive browser lane.

The original 18 cases cover `/`, `/noise`, `/research`, and `/design` in light and dark
appearance on desktop and touch portrait, plus the studio in short touch
landscape. Assertions cover compiled package layers, loaded Nebula Sans cuts,
Paper colors, serif and monospace roles, overflow, footer boundaries, appearance
menus, themed dialogs, disclosures, research filters, and mixer controls. Two short playback
checks use native Web Audio with browser output muted, then verify suspension
and disposal on navigation. The check never grants microphone access, submits
forms, or sends external requests. Mailing-list challenges are blocked, so this
is not provider or production-delivery verification.

Twelve additional cases retain saved Light, Dark, and System preferences while
navigating from the forced-dark studio to About and back, under both operating-system
schemes at 320px and desktop widths. They check concrete root and Jelly appearance,
Paper browser chrome and body portals, unchanged saved preferences, client-side
navigation, and keyboard focus restoration. These cases never start audio.

Screenshots and a JSON receipt are retained in ignored `.browser-artifacts/`
directories. The receipt records the Git identity, browser version and executable
digest, cases, and local asset paths. Review the screenshots as well as the
assertions. Rebuild after application or dependency changes before rerunning.

## Research contributions

Research corrections, stronger sources, and new article proposals are especially welcome. A publishable contribution should:

1. Identify one distinct reader decision or question rather than a keyword permutation.
2. Lead with a concise, qualified answer.
3. Prefer systematic reviews, controlled human studies, current labels, public-health guidance, and primary research.
4. Match every material claim to evidence that supports its exact wording; source quantity does not compensate for weak fit.
5. Distinguish direct findings from mechanism, inference, historical use, preference, and crowdsourced experience.
6. Explain study population, intervention, comparator, outcome, duration, and important limitations when they affect interpretation.
7. Add original value such as a decision table, evidence comparison, protocol audit, calculation, or reproducible analysis.
8. Avoid diagnosis, individualized treatment, dosing instructions, medical promises, and unsupported safety claims.
9. Disclose relevant financial, professional, or product conflicts.

Crowdsourced reports can reveal questions, vocabulary, and failure modes. They cannot establish efficacy, prevalence, or safety. Historical use provides cultural context, not proof that an intervention works.

Read [the editorial method](docs/editorial-method.md) before changing an article or source record. Article data lives in `app/research/articles.ts` and focused expansions beside it; `app/research/admissions.ts` owns the case-specific decision to index and distribute each route. Those registries drive routes, metadata, structured data, RSS, sitemaps, Markdown alternatives, and related reading, so update the typed sources rather than generated output.

## Pull requests

A useful pull request includes:

- a direct description of the problem and outcome;
- the smallest coherent implementation;
- tests or other reproducible evidence;
- screenshots for visible interface changes;
- source links and an evidence-boundary note for research changes; and
- confirmation that `bun run check` passes.

By contributing, you agree that your contribution is licensed under the project’s MIT License.
