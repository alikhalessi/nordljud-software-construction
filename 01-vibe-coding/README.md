# Condition A — Vibe Coding

## Where is the actual application?

**The complete implementation is pushed to the separate Git branch [`condition/vibe`](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/vibe), not nested under this folder on `main`.** Switch GitHub's branch selector from `main` to `condition/vibe` to browse the working source.

### Direct links

- [Source code: app/](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/vibe/app)
- [Dependency and build manifest: package.json](https://github.com/alikhalessi/nordljud-software-construction/blob/condition/vibe/package.json)
- [Google OAuth and Supabase browser integration](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/vibe/lib)
- [Real iteration, prompts, bugs and corrections](https://github.com/alikhalessi/nordljud-software-construction/blob/condition/vibe/01-vibe-coding/vibe-log.md)
- [Google OAuth setup documentation](https://github.com/alikhalessi/nordljud-software-construction/blob/condition/vibe/01-vibe-coding/GOOGLE_AUTH_SETUP.md)
- [Public classroom pilot: https://nordljud.vercel.app](https://nordljud.vercel.app)
- [Snapshot branch: `checkpoint/vibe-2026-10-13`](https://github.com/alikhalessi/nordljud-software-construction/tree/checkpoint/vibe-2026-10-13)

## Status (13 October 2026)

**Implemented and deployed.** The learner confirmed the public website worked; a complete two-account persistence/privacy acceptance test has not yet been evidenced. The iteration log records speech synthesis and selected-verb regression fixes, and external Google OAuth configuration. There were 36 commits ahead of the frozen baseline when this index was prepared.

## Why a separate branch?

All three coding approaches began from frozen commit `1afd635324a788f18db19f83f338ad89ade54e33`. Each must have an independent application root (`app/`, `package.json`, config) so it can be built and compared without copying implementation code between methods or overwriting another branch. **The empty-looking directory on `main` was a navigation problem, not proof that work was not pushed.** This README is a landing/index page. See [the project's root README](../README.md) for all three branches.

No source files were moved or merged into `main`; doing so prematurely would obscure the experiment.
