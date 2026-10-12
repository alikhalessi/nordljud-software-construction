# Nordljud three-condition experiment — preregistered preparation

**This document is prepared before any of the three experimental implementations begin.** It is kept on the coordinating `main` branch **after** condition branches were created so the condition start snapshots remain equivalent.

## Study objective

Assess whether a capable AI coding agent using a powerful high-level master prompt independently reproduces engineering practices that an explicit SDD workflow mandates, and compare the practical costs and outcomes.

## Conditions

| Condition | Human/AI workflow | Required discipline |
|---|---|---|
| A — Vibe Coding | Short natural-language prompts, human–AI iteration | Repeated run/observe/fix cycles; human code review, evidence log and commits |
| B — God Mode | A strong master prompt delegates engineering decisions to the agent | AI is free to generate requirements, architecture, plans, tests and specifications *spontaneously*, but Spec Kit is not imposed |
| C — Explicit SDD | The investigator imposes a structured requirements-first process, using GitHub Spec Kit if available | Produce and review explicit specification, clarification, plan, tasks, implementation and verification evidence |

C must demonstrate actual explicit methodology; B must not be artificially forbidden from making specifications; A must not be deliberately sabotaged through poor prompting/testing.

## Hypothesis

H1 (exploratory): A highly capable AI coding agent may autonomously generate some specification-like engineering structure and achieve comparable functional outcomes to explicit SDD with less externally imposed process overhead.

H0/alternatives: Explicit SDD may improve traceability, validation and completeness despite additional overhead; or outcomes may be inconclusive.

**No predetermined winner and no inference that one case proves SDD obsolete.**

## Controlled inputs

- Exactly the Git commit `a9fc8da579c24284e3dacd79660c5324b15fb5cd`.
- The unchanged `shared-content` JSON data, `mission-seeds.json` and `PRODUCT_BRIEF.md`.
- Same model/version and AI coding tools where feasible; record differences.
- Same human operator and available technical resources.
- Same four learning levels, functions and nominal stack.
- Same independent post-freeze evaluation.

## Starting branches

- `baseline-v1` — immutable reference, do not develop on this branch.
- `condition/vibe` — Condition A.
- `condition/god-mode` — Condition B.
- `condition/spec-driven` — Condition C.

At branch creation all four pointed to the exact common starting commit listed above. Any subsequent commit must be attributed to its condition or to post-freeze evaluation.

## Timebox targets (planning, not results)

- Condition A: 120 minutes.
- Condition B: 120 minutes.
- Condition C: 180 minutes.
- Evaluation and evidence packaging: 90 minutes.
- Preparation and reporting time are measured separately.

Record wall-clock start/end, waiting/deployment time, human editing vs model execution time if measurable, and total time. A timebox is *not* permission to invent missing evidence. Incomplete work at the stop time remains incomplete.

## Primary outcomes

- Functional task completion from the blinded common checklist.
- Functional defects and tests passed/failed.
- Per-user auth and progress persistence.
- Elapsed time, human intervention and number of significant prompt/fix cycles.
- Self-generated requirements/planning/test practices in B (count documented observable acts, not vague impressions).
- Traceability and maintainability (reviewer-scored with stated criteria).

## Validity limitations

Single application, single developer, likely single implementation per condition, order/learning effects, stochastic LLM behaviour, variations in agent tools, and observer bias. Results are an **experience report**, not a statistically generalizable claim. Existing familiarity with the old Nordlyd app and reuse of language content must be disclosed.

## Reporting rule

The university's required Vibe and SDD report sections remain mandatory. God Mode is a **third comparative condition**, not a replacement for either mandatory condition. Keep original logs, all failures, tests, and screenshots. Avoid fabricated prompts and retroactive specifications.
