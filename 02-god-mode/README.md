# Condition B — God Mode (Autonomous AI-Assisted Coding)

## Where is the actual application?

**The working source code lives on the separate [`condition/god-mode` Git branch](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/god-mode).** It was committed to GitHub under its own branch at the repository root. Switch GitHub's branch selector to view `app/`, `domain/` and `lib/`.

### Direct links

- [Independent app/ source](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/god-mode/app)
- [Domain models and lesson derivation](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/god-mode/domain)
- [Supabase browser integration](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/god-mode/lib)
- [God Mode tests](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/god-mode/test)
- [Autonomous decisions](https://github.com/alikhalessi/nordljud-software-construction/blob/condition/god-mode/02-god-mode/AGENT_NOTES.md)
- [Implementation history](https://github.com/alikhalessi/nordljud-software-construction/blob/condition/god-mode/02-god-mode/IMPLEMENTATION_LOG.md)
- [Actual CI failure, correction, and successful rerun](https://github.com/alikhalessi/nordljud-software-construction/blob/condition/god-mode/02-god-mode/CI_DEBUG_2026-10-13.md)
- [Autonomous master prompt (preregistered on main)](../research-evidence/GOD_MODE_MASTER_PROMPT.md)
- [Passing GitHub Actions run 38319216764](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38319216764)

## Status (13 October 2026)

**Implemented; automated tests, TypeScript and build now PASS.** Initial CI correctly caught a mistaken unique-spelling assertion: the corpus holds 456 *sense records* but 455 different written spellings, since `sticka` represents two senses. The agent fixed both this test and the corresponding UI ambiguity. The user viewed an earlier hosted version informally; the latest corrected commit must still be browser-tested. Google OAuth on the God Mode Preview URL and actual cross-account progress persistence are **not yet verified**. There were 21 commits ahead of baseline when indexed.

## Independence rule

God Mode began at the same frozen baseline as A and C; its code was independently authored. It was **not** copied from Vibe, nor directed to use mandatory Spec Kit. This `main` folder is a navigation hub, not the implementation root. The implementation files remain at root **within the God Mode branch**.

See [the repository root index](../README.md).
