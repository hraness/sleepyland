# Contents

- `app/` contains the Next.js routes, Web Audio engine, sound controls, research registry, metadata, and colocated tests.
- `lib/` contains product-owned UI and browser-storage helpers.
- `styles/` contains the compact sound-machine and publication visual systems.
- `public/` contains static public assets.
- `docs/editorial-method.md` defines the public research-review method.
- `STYLE.md` defines the public and reader-facing prose contract.
- `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md` define the public project and contribution boundaries.

# Guidelines

- Keep Sleepyland independently installable with Bun 1.3.14 and Node 24. Do not add another package manager or lockfile.
- Preserve the private-by-design sound boundary: local Web Audio generation, browser-local settings, no microphone, no uploaded mix, and no product account.
- Keep analytics cookieless, canonical-production-only, query-free, and restricted to the checked event schema. Never enable session replay or person profiles.
- Keep the sound machine compact, dark, warm, responsive to the visual viewport, and free of document overflow on narrow portrait or short landscape screens.
- Preserve semantic controls, visible focus, reduced-motion behavior, conservative output gain, and smooth audio fades.
- Treat sleep and wellness content as health-adjacent. Source material claims, distinguish evidence from mechanism and inference, and never diagnose, prescribe, provide individualized dosing, or guarantee an outcome.
- Follow `STYLE.md` for public research, product copy, documentation, and README prose.
- Follow `docs/editorial-method.md` and `CONTRIBUTING.md` for research changes. Update the typed article and source registries rather than generated output.
- Keep public files self-contained. Never commit credentials, private analytics, personal health information, provider tokens, local absolute paths, or unpublished operational records.
- Use `apply_patch` for edits. Run focused tests while working and `bun run check` before handoff.

<!-- hra-local-efficiency:start -->
- Preserve useful agent fan-out. Give each expensive focused validation command and external wait one owner; the integration owner reviews that evidence and runs the repository-required aggregate or final gate once after convergence. Reuse evidence only for the exact Git tree, command, lockfiles, toolchain, relevant environment, and validity period, and never to skip a required final integration, merge, release, deployment, or production-verification gate. On Hraness development machines, use `$hra-local-efficiency` and the installed host scheduler for heavyweight top-level commands when available.
<!-- hra-local-efficiency:end -->
