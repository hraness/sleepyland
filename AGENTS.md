# Contents

- `app/` contains the Next.js routes, Web Audio engine, sound controls, research registry, metadata, and colocated tests.
- `lib/` contains product-owned UI and browser-storage helpers.
- `styles/` contains the compact sound-machine and publication visual systems.
- `public/` contains static public assets.
- `docs/editorial-method.md` defines the public research-review method.
- `app/research/admissions.ts` is the executable admission, overlap, source-check, review-state, ownership, lifecycle, and reassessment registry for indexable editorial routes; `docs/editorial-lifecycle.md` records clinical quarantine and detailed consolidation history.
- `STYLE.md` defines the public and reader-facing prose contract.
- `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md` define the public project and contribution boundaries.

# Guidelines

- Keep Sleepyland independently installable with Bun 1.3.14 and Node 24. Do not add another package manager or lockfile.
- Preserve the private-by-design sound boundary: local Web Audio generation, browser-local settings, no microphone, no uploaded mix, and no product account.
- Keep analytics cookieless, canonical-production-only, query-free, and restricted to the checked event schema. Never enable session replay or person profiles.
- Keep the sound machine compact, dark, warm, responsive to the visual viewport, and free of document overflow on narrow portrait or short landscape screens.
- Preserve semantic controls, visible focus, reduced-motion behavior, conservative output gain, and smooth audio fades.
- Treat sleep and wellness content as health-adjacent. Source material claims, distinguish evidence from mechanism and inference, and never diagnose, prescribe, provide individualized dosing, or guarantee an outcome.
- Keep medication guides and comparisons, supplement interaction or adverse-effect guidance, other material health-safety instructions, controlled-substance topics, and dangerous-use queries noindex and out of every discovery surface until the exact claims have a documented clinical or pharmacist review.
- Curate at most eight research guides on the homepage, choose them by first-time-reader utility rather than recency, and route the complete accepted registry through `/research`.
- Follow `STYLE.md` for public research, product copy, documentation, and README prose.
- Follow `docs/editorial-method.md` and `CONTRIBUTING.md` for research changes. Update the typed article, source, and admission registries rather than generated output.
- Admit an indexable research route only at 9/12 or higher with no zero across reader utility, original evidence, factual confidence, Sleepyland fit, voice integrity, and maintenance value. Never use word, source, link, image, keyword, recency, or publishing-count quotas as proxies for usefulness.
- Keep public files self-contained. Never commit credentials, private analytics, personal health information, provider tokens, local absolute paths, or unpublished operational records.
- Use `apply_patch` for edits. Run focused tests while working and `bun run check` before handoff.

<!-- hra-local-efficiency:start -->
- Treat the user's request to change this repository as standing authorization for routine task-owned commits, pushes, pull requests, merges, releases, deployments, and production verification after the repository's required validation, review, identity, and rollout gates pass. Do not ask for another confirmation at each delivery step.
- Use the repository's documented delivery workflow and preserve every runtime-enforced approval, branch protection, environment rule, safety policy, and final gate. Ask for user input only when delivery needs a material product decision, missing credentials or authority, an irreversibly destructive action outside task scope, or resolution of a release failure that cannot be handled safely and autonomously.
- Prefer short-lived repository workload identities such as OIDC trusted publishing, GitHub Apps, and scoped service accounts. Do not add long-lived personal tokens, weaken two-factor authentication, or bypass provider controls to eliminate an interactive prompt. Batch unavoidable human-gated production promotions into intentional stable releases while agents publish validated prerelease or beta channels through workload identities when the repository supports them.
- Preserve useful reasoning fan-out, but avoid unnecessary checkout fan-out. Prefer subagents in the current task for bounded research, review, diagnosis, and focused checks when they can safely share one working tree; create a separate task or worktree only for independently deliverable divergent edits, an isolated verification tree, or a different execution environment.
- Give each expensive focused validation command and external wait one owner. The integration owner reviews that evidence and runs the repository-required aggregate or final gate once after convergence. Reuse evidence only for the exact Git tree, command, lockfiles, toolchain, relevant environment, and validity period, and never to skip a required final integration, merge, release, deployment, or production-verification gate.
- On Hraness development machines, use `$hra-local-efficiency` and the installed host scheduler for heavyweight top-level commands when available. Keep ordinary work in the compute lane; give authenticated browser/dev-server/Chromium work one `browser-auth` owner and Mac-only validation one `mac-native` owner.
- When a CI or policy gate scans complete Git history, check out the exact governed SHA and fetch only the fully qualified governed refs before scanning. Preserve the complete-history gate and reject unexpected refs instead of importing unrelated concurrent heads.
- At closeout, record applicable branch, PR, check, merge, release, deployment, and production evidence. Archive only conclusively finished tasks, never from silence alone, and reclaim only freshly revalidated clean merged worktrees through the guarded exact-path flow.
<!-- hra-local-efficiency:end -->
