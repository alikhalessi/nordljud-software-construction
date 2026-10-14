# Nordljud — Swedish You Can Use

**Owner and sole student:** Ali Khalessi (`alikhalessi`) · **Course:** Software Construction, Åbo Akademi University  
**Project:** A reproducible experience report comparing three AI-assisted development methods on the same Swedish-learning MVP.

## Three independent, pushed implementations

The numbered directories on `main` are *navigation indexes*. Each complete runnable application lives at the repository root of a separate Git branch, starting from common frozen commit `1afd635324a788f18db19f83f338ad89ade54e33`. Common Swedish teaching data are shared, but A/B/C application code is not copied between branches.

| Method | Index / implementation | Live reference and verification |
|---|---|---|
| A — Vibe Coding | [01-vibe-coding](./01-vibe-coding/) · [condition/vibe](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/vibe) | [Public classroom pilot](https://nordljud.vercel.app); independent Build and TypeScript PASS; guest Chromium **2/3** (two-`sticka` sense bug preserved) |
| B — God Mode | [02-god-mode](./02-god-mode/) · [condition/god-mode](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/god-mode) | Separate Vercel preview; source tests **3/3**, guest Chromium **3/3**; separate Google OAuth end-to-end not independently confirmed |
| C — SDD / Spec Kit | [03-spec-driven](./03-spec-driven/) · [condition/spec-driven](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven) | [SDD classroom deployment](https://nordljud-sdd-lab.vercel.app); source tests **4/4**, guest Chromium **3/3**, student-reported Google OAuth/data-retention/two-account success |

**Independent shared CI:** [Node tests, TypeScript and builds](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38483644760) · [Three-way Chromium guest browser tests](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38485026386).

The outer CI matrix is configured to continue after a failed individual test so that the other conditions are still measured. Thus a green workflow container **does not override Vibe's original data-test or browser-test failures**. Review per-method outcomes.

## Course report and direct research evidence

- [Revised seven-section experience report](./research-evidence/EXPERIENCE_REPORT_REVISED_2026-10-14.md)
- [Original course-rubric summary (not full verified Moodle template)](./research-evidence/COURSE_RUBRIC_ALIGNMENT.md)
- [Authentic prompt provenance and missing verbatim prompt records](./research-evidence/PROMPT_PROVENANCE_LEDGER_2026-10-14.md)
- [Functional requirements and comparison matrix F01–F14](./evaluation/COMPARATIVE_ACCEPTANCE_MATRIX_2026-10-14.md)
- [Ten verified Issue/Resolution findings in report §5.2](./research-evidence/EXPERIENCE_REPORT_REVISED_2026-10-14.md)
- [God Mode's pre-execution agent-facing master prompt](./research-evidence/GOD_MODE_MASTER_PROMPT.md)
- [SDD actual Spec Kit 1.1.3 workflow and specifications](https://github.com/alikhalessi/nordljud-software-construction/tree/condition/spec-driven/specs/001-nordljud-classroom)
- [SDD login discoverability failure: RED→GREEN](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38377362037)
- [Observed Vibe homograph failure](./evaluation/DEFECT_VIBE_HOMOGRAPH_2026-10-14.md)
- [Nine permanently archived genuine guest browser PNGs](./evaluation/screenshots/) · [provenance/evidence index](./evaluation/SCREENSHOT_EVIDENCE_INDEX_2026-10-14.md)
- [Submission readiness and access requirements](./research-evidence/SUBMISSION_READINESS_AND_ACCESS_2026-10-14.md)

## Honest scope and authorship

**Ali Khalessi is the only student.** ChatGPT helped generate much of the code, tests, prompts to agents, documents and connected GitHub/Vercel/Supabase actions. GitHub Actions bots are automation, not student collaborators. Git attribution under `alikhalessi` does not prove manual typing. An exact historical ChatGPT model variant was not recorded for each experimental phase.

Condition C actually ran the **GitHub Spec Kit 1.1.3 CLI bootstrap** and created specification artifacts following its process. Its `--integration copilot` flag generates Copilot-compatible tooling; **it does not prove Copilot ran every skill or wrote the application**. C initially had real login discoverability and OAuth redirect problems, subsequently documented and corrected.

The dataset comprises **456 sense records per level**, but only **455 distinct written Swedish lemmas**, because `sticka` occurs twice with different meanings. This concrete ambiguity caused incorrect tests and a broken Vibe word-selection experience.

## Repository privacy and access

This repository is **private**. An instructor needs explicit permitted access before they can inspect its branch history, CI and defect logs. No visibility change or collaborator invitation was performed without the owner's approval. Administrative follow-up details are in the [submission checklist](./research-evidence/SUBMISSION_READINESS_AND_ACCESS_2026-10-14.md). Links to private CI runs may not be readable by an unauthenticated reviewer.

**Project scope:** University coursework first. No unapproved subscriptions, thousands-of-users scaling work, payment features or commercial product launch.
