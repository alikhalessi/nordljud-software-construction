# Common independent evaluation — prepared before implementations

This checklist is **not an implementation-specific specification**. It is retained on the coordinating `main` branch and applied identically to the three frozen conditions.

For each test record `PASS`, `FAIL`, `PARTIAL`, or `NOT TESTED`, plus run date, browser, command/steps, screenshot or log, and relevant commit SHA. Record absent credentials or hosting blockers as blockers, never pretend a pass.

## Functional tests

| ID | Black-box test |
|---|---|
| F01 | User can create an account with valid email and password |
| F02 | User can sign in, refresh, and sign out; wrong credentials cannot sign in |
| F03 | Learner dashboard lists A2, B1, B2 and C1 |
| F04 | Each level exposes its corresponding mission seed |
| F05 | Each mission presents Swedish examples and correct associated English text from the shared dataset |
| F06 | Swedish speech playback requests `sv-SE`, or reports unavailable voice gracefully |
| F07 | Learner can submit a comprehension response and receives correct/incorrect feedback |
| F08 | Learner can submit a verb-form response and receives correct/incorrect feedback |
| F09 | Partial and completed mission progress survive reload and subsequent sign-in for the same user |
| F10 | Different signed-in users cannot read or change another learner's progress |
| F11 | UI works at desktop width and a narrow mobile viewport without blocking the mission |
| F12 | The app builds and is runnable; Vercel production deployment is tested separately and never assumed |
| F13 | Missing Swedish example forms remain visibly unavailable, not falsely filled with invented examples |
| F14 | Secrets (Supabase service-role keys / private tokens) are not embedded in client code or committed files |

The common mission target verbs are A2 `arbeta`, B1 `förklara`, B2 `föreslå`, C1 `påverka`. Every case should reference exactly the same `mission-seeds.json`.

## Process measures

- P01: elapsed wall time from first method-specific prompt until freeze.
- P02: distinct human prompts / manual correction interventions (define counting method before execution).
- P03: explicit debug/fix loops and first-observed failures.
- P04: actual passing and failing tests at freeze.
- P05: number and substance of Git commits and prompt/evidence entries.
- P06: SDD-like practices in God Mode documented as observed or absent: requirements discovery, ambiguity handling, explicit assumptions, architecture/plan, task decomposition, tests, requirements-to-output verification, sign-off/limitations.
- P07: traceability judged separately from code quality.

## Scoring discipline

Report every test individually; avoid an unexplained aggregate quality score. Do not score 'NOT TESTED' as 'PASS'. Run identical test steps after freeze and **do not patch the frozen implementation**. Manually inspect source quality and security with supporting examples.

## Timing

This document must be frozen before opening any method-specific implementation work. Reviewer or instructor may recommend changes; log and disclose any changes.
