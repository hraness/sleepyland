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
