# Nordljud — Swedish You Can Use

Nordljud is an English-to-Swedish, mission-based learning web application with four sentence levels (**A2, B1, B2, C1**) and a recovered verb library.

## Start Here — Three Independent Implementations

**Important:** The three numbered folders visible on the default `main` branch are **navigation indexes**. The full, pushed source code of each experimental condition lives at the **root of its own Git branch**, so each project can be built independently. This is intentional, not a missing push.

| Condition | Main-branch index | Complete code branch | Current evidence/status |
|---|---|---|---|
| A — Vibe Coding | [01-vibe-coding/](./01-vibe-coding/) | [condition/vibe](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/vibe) | Public pilot [nordljud.vercel.app](https://nordljud.vercel.app); learner confirmed it works |
| B — God Mode | [02-god-mode/](./02-god-mode/) | [condition/god-mode](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/god-mode) | Independent app; GitHub CI [PASS](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38319216764); detailed browser auth tests outstanding |
| C — Spec-Driven Development | [03-spec-driven/](./03-spec-driven/) | [condition/spec-driven](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven) | Real Spec Kit CLI initialized; CI [PASS](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38320127745); Vercel Preview now READY; browser and OAuth acceptance still pending (initial daily quota blocker documented) |

### How to find the files

1. Click the implementation branch above, or use the GitHub **branch selector** to switch away from `main`.
2. Each branch has its own root `app/`, `package.json`, app-specific source modules, tests and the relevant numbered-method folder.
3. For artifacts and direct source links, open the corresponding `01`/`02`/`03` index on `main`. Those now point to the actual program source and evidence.

**Do not merge all three app roots into main.** Each contains different versions of `app/`, `package.json` and config. Merging these roots would overwrite implementations, violate the planned separation and disrupt reproducibility. A final read-only archive or comparison branch may be created later if useful, but the branches remain the canonical sources.

## Purpose and Experiment Design

This project supports the Åbo Akademi Software Construction experience report on three AI-assisted development approaches:

- **Vibe Coding (A):** iterative human–AI prompting, real browser feedback and fixes.
- **God Mode (B):** a strong master prompt, autonomous engineering choices; the agent may create plans and tests voluntarily.
- **Specification-Driven Development (C):** explicit pre-code constitution, spec, clarify, architecture/plan, tasks, analyze, implement and convergence stages; official GitHub Spec Kit 1.1.3 scaffold.

### Frozen Common Starting Point

All three experiment branches and `baseline-v1` began from Git commit `1afd635324a788f18db19f83f338ad89ade54e33`.

The **shared teaching input** under [shared-content/](./shared-content/) is reused; application implementation code from one experimental condition is **not** copied to the others. The user-requested late scope expansion for the verb explorer, favorites and login is documented rather than retroactively written into the baseline; see [SCOPE_CHANGE_01.md](./research-evidence/SCOPE_CHANGE_01.md).

The static corpus contains **456 sense records per level** but **455 unique written verb lemmas** because `sticka` has two senses, `knit` and `sting/prick/leave`. The full original teaching data remains unchanged.

## Evidence and Reporting

- [Common independent evaluation checklist — F01–F14](./evaluation/TEST_PLAN.md)
- [Experimental design, conditions and validity limitations](./research-evidence/EXPERIMENT_DESIGN.md)
- [University report rubric mapping](./research-evidence/COURSE_RUBRIC_ALIGNMENT.md)
- [Course-first decision: defer startup scaling](./research-evidence/COURSE_FIRST_DECISION_2026-10-13.md)
- [God Mode preregistered master prompt](./research-evidence/GOD_MODE_MASTER_PROMPT.md)
- [Vibe public beta release record](./research-evidence/VIBE_PILOT_RELEASE_2026-10-13.md)
- [Evidence-based draft experience report (not yet a final student submission)](./research-evidence/EXPERIENCE_REPORT_DRAFT_2026-10-13.md)

## Current Limitations

A Vercel READY build or passing automated CI does **not** guarantee browser speech, OAuth redirect or cross-user persistence. Google Login was configured externally for Vibe and the learner reported successful use; B and C still require careful end-to-end tests. Condition C's live deployment was blocked by Vercel's API quota at the time of its CI PASS.

The ordered A→B→C comparison has carryover/learning effects and a user-driven scope increase during A. The report must disclose them. No wall-clock timings should be invented.

**Scope remains university coursework first.** No commercial payments, scalability project or product launch work is planned before the course is completed.


## Deployment status update — 13 October 2026

The earlier Vercel free-tier API quota has lifted. A deliberate SDD deployment (`dpl_7vZHDamMkLLkLYBiaHr4H18dZuVy`, starting commit `01281282400d6d441e29535b192a82f8ff4f72d1`) is READY at [nordljud-sdd-lab.vercel.app](https://nordljud-sdd-lab.vercel.app). The latest corrected God Mode branch (`308cccf1ed559b575dd17014b459ac11ecfd233c`) also reached READY at [its separate preview](https://nordljud-godmode-lab-git-condition-god-mode-aleksi9.vercel.app). Preview access remains protected, and neither Google OAuth nor per-user cloud persistence has yet been verified in the new builds. All three projects received Vercel Ignored Build Step filters intended to deploy only the matching condition branch; subsequent pushes must confirm filter behavior.


## Current independent assessment — 14 October 2026

A coordinating **unchanged-source** CI matrix independently checked out all three method branches, then separately ran source tests, TypeScript and Next.js build. All three **TypeScript and build** stages succeeded. Vibe's frozen source tests had four failures caused by the incorrect expectation of 456 distinct written lemmas instead of the real 455 distinct spellings/456 sense records; God Mode and SDD source tests passed. See [audit 38483644760](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38483644760).

A second independent **Chromium guest browser** evaluator ran the same two narrowly defined behaviors on each unchanged branch: all four level/mission targets with visible Swedish examples, and independent selection of the two `sticka` meanings. Vibe **1/2** (the second `sticka` selection still displayed `knit`), God Mode **2/2**, SDD **2/2**. Failure evidence is retained rather than patching the frozen Vibe implementation. See [browser run 38484229887](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38484229887) and [Vibe homograph defect report](./evaluation/DEFECT_VIBE_HOMOGRAPH_2026-10-14.md).

The learner has reported a **successful two-account check in SDD** after Google redirect configuration. This is **student-reported UI acceptance**, not an independent adversarial API audit. The shared Supabase `learner_states` RLS policies were also checked read-only; authenticated SELECT/INSERT/UPDATE/DELETE use `auth.uid()=user_id`. Other login/mobile/speech paths remain partial or untested as documented in the [evidence-graded F01–F14 comparison matrix](./evaluation/COMPARATIVE_ACCEPTANCE_MATRIX_2026-10-14.md).

**Revised seven-part report:** [An Experience Report on a Specification-Driven, AI-Assisted Software Construction Project (14 Oct evidence-based revision)](./research-evidence/EXPERIENCE_REPORT_REVISED_2026-10-14.md). It supersedes the older chronological working draft for review, but is **not** an unreviewed automatic academic submission. Before submission, verify current Moodle requirements and add legitimate screenshots where requested.
