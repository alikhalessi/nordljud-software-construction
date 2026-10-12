# Spec Kit Consistency Analysis — PRE-IMPLEMENTATION Gate

**Date:** 2026-10-13. **Analyzed before any SDD source code.**
Artifacts checked: constitution 1.0, spec with FR-001–FR-020, clarifications CL-01–CL-10, research R-01–R-06, plan, data model, API contract and T001–T020.

## Coverage Findings

| Concern | Explicit source requirement | Plan/contract | Tasks | Verdict |
|---|---|---|---|---|
| Four level missions | FR-001–FR-003 | Derive from frozen mission seeds | T003/T005/T008 | covered |
| English assistance and speech | FR-004–FR-005 | Client audio with sv-SE fallback | T008/T009 | covered |
| Two independent checks | FR-006–FR-007 | Deterministic answer logic | T005/T010 | covered |
| Complete lexicon and two sticka senses | FR-008–FR-010 | Immutable corpus, composite sense key, GET API | T003/T004/T007/T011 | covered |
| Favorite senses | FR-011 | Per-user sense IDs | T012/T015/T016 | covered |
| Email and Google login | FR-012–FR-013 | Supabase Auth, external consent/redirect | T006/T013/T014 | covered; real Google test deferred |
| Private persistence | FR-014–FR-016 | Separate namespace + existing RLS | T015/T016 | covered; user isolation acceptance deferred |
| Error clarity and mobile | FR-017–FR-018 | UI feedback, responsive styles | T009/T013/T016/T017 | covered |
| Secrets / cross-condition isolation | FR-019–FR-020 | Public-key only and separate Vercel project | T001/T006/T019 | covered |

## Contradiction and Ambiguity Audit

1. The wording “456 verbs” conflicts with unique-lemma count. **Resolved** consistently to 456 *sense entries*, 455 unique spellings; test both.
2. Browser audio support varies by OS and cannot be guaranteed. **Resolved** as audible Swedish where supported, explicit message elsewhere.
3. External Google login configuration is outside program code; no false PASS permitted. **Open execution dependency**.
4. No cross-app code reuse permitted; design structure is generated from source requirements without imports from A or B.
5. Data retention/production privacy policy outside the explicitly bounded course MVP; protect accounts and accurately disclose test limitations.
6. Concurrency / lost-update risks in one JSONB object: MVP mitigates rapid repeated UI writes but **cross-device concurrent updates are not guaranteed atomic**. Record limitation rather than claiming production-grade sync.

## Gate Decision

**PASS — implementation may begin** with 20 planned tasks, 20 mapped FRs, no unaddressed blocking contradictions. Requirement quality is not a substitute for execution-time test evidence.

**Process integrity caveat:** The official Spec Kit **CLI** v1.1.3 was genuinely initialized in GitHub Actions (run `38319369671`), placing its official templates and Copilot skills in this branch. The requirement documents are produced by the assistant following those templates and workflow stages, **not** by claiming that a separate Copilot agent successfully invoked every slash command. This is an important distinction for the experience report.
