# Condition C — Specification-Driven Development (SDD)

## Where is the actual application?

**SDD has been pushed to the independent [`condition/spec-driven` branch](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven).** GitHub defaults to `main`, where only this index is visible. Switch to `condition/spec-driven` to see the implementation, its specifications, and the official Spec Kit scaffold.

### Direct links

- [Full SDD source: app/](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven/app)
- [Typed domain and learning models](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven/src)
- [Source-data tests](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven/tests)
- [Official `.specify/` toolkit initialized via Spec Kit CLI v1.1.3](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven/.specify)
- [SDD documentation: spec, clarifications, plan, tasks, analysis and convergence](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven/specs/001-nordljud-classroom)
- [Actual SDD method log](https://github.com/alikhalessi/nordljud-software-construction/blob/condition/spec-driven/03-spec-driven/SDD_METHOD_LOG.md)
- [Real Spec Kit CLI bootstrap — passing GitHub Actions run](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38319369671)
- [SDD data tests, TypeScript and Next.js build — passing GitHub Actions run](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38320127745)

## Status (13 October 2026)

**Independent implementation and pre-code documentation committed.** The SDD source passed four source-data tests, TypeScript checking and optimized Next.js build in CI. **NOT YET DEPLOYED**: Vercel blocked the attempted API deployment with HTTP 402, `api-deployments-free-per-day` (daily quota). A separate Vercel project `nordljud-sdd-lab` exists, but the live app and Google OAuth/real learner state remain unverified. See [convergence verdict](https://github.com/alikhalessi/nordljud-software-construction/blob/condition/spec-driven/specs/001-nordljud-classroom/converge.md).

The official toolkit CLI really ran in CI, but the agent-authored specifications followed the Spec Kit stages rather than claiming every Copilot slash command ran inside Copilot. See the method log for an honest distinction.

## Independence rule

This branch began at the same frozen baseline as A and B. Shared Swedish teaching JSON is reused under `shared-content/`; Vibe and God Mode **application code** is not merged here. Keeping the program under its own branch root lets CI and Vercel build it normally. This directory on `main` is a navigation hub.

See [the repository root index](../README.md).
