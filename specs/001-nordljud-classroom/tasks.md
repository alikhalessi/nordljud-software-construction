# Tasks: Nordljud Classroom Swedish MVP (Condition C)

**Source:** [Spec](./spec.md) → [Clarification](./clarifications.md) → [Plan](./plan.md) → [Data model](./data-model.md) and [Contract](./contracts/lexicon-api.md).  
**Generated BEFORE source implementation.** Mark task complete only once changed and checked in Git.

## Phase 1 — Setup

- [x] **T001** Create `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `.gitignore` and `.env.example` — supports FR-019/FR-020.
- [x] **T002** Add independent Next.js App Router layout/page skeleton and basic visual framework `app/layout.tsx`, `app/page.tsx`, `app/globals.css` — FR-001/FR-018.

## Phase 2 — Foundations

- [x] **T003** [P] Define `Level`, `VerbSense`, `Mission`, `LearnerState`, and composite source identity in `src/domain.ts`; assert spelling-vs-sense invariant — FR-008/FR-009.
- [x] **T004** [P] Write native Node tests `tests/source.test.mjs` that validate shared data integrity (456×4, 455 written lemmas, dual `sticka` senses), source forms and mission seeds — FR-002/FR-008/FR-010.
- [x] **T005** Derive mission examples and deterministic two-question exercises in `src/teaching.ts` using common data only — FR-002/FR-003/FR-006/FR-007.
- [x] **T006** [P] Create browser-safe Supabase client `src/supabase.ts`; never commit secret or elevated key — FR-019.
- [x] **T007** Add `GET /api/lexicon/[level]` implementing the contract, validating level and returning exactly one level's data — FR-008/FR-010.

**Checkpoint:** Data and test behavior independently inspectable before UI.

## Phase 3 — User Story 1 (P1) Mission Practice

- [x] **T008** [US1] Build four-level mission navigation, Swedish/English source sentences, show/hide translation in `app/experience.tsx` — FR-001–FR-004.
- [x] **T009** [US1] Implement Swedish speech synthesis and graceful voice failure feedback; no silent or artificial voice success — FR-005/FR-017.
- [x] **T010** [US1] Create two accessible exercises per mission with wrong/correct feedback and completion flags — FR-006/FR-007.

**Independent Test:** Use A2/B1/B2/C1 seeds; wrong answer does not complete and correct answer marks corresponding exercise.

## Phase 4 — User Story 2 (P1) Verb Library

- [x] **T011** [US2] Add level-specific lexicon fetch, text search, selectable **sense identity**, five forms and missing example messages — FR-008–FR-010.
- [x] **T012** [US2] Add per-sense favorites; ensure two `sticka` records are independently selectable and favoritable — FR-009/FR-011.

**Independent Test:** Choose `sticka` ‘knit’ and ‘sting’, switch A2→C1; check identity and distinct present forms. Search by English gloss.

## Phase 5 — User Story 3 (P2) Personal Account

- [x] **T013** [US3] Implement Supabase email signup/login/logout and existing session restoration — FR-012/FR-017.
- [x] **T014** [US3] Implement Google OAuth redirect with clear missing provider diagnostics; record external host allowlist steps — FR-013/FR-017.

**Independent Test:** Sign-in/back, wrong credentials, sign-out; Google test in a configured preview, mark BLOCKED if no allowlist.

## Phase 6 — User Story 4 (P2) Progress and Privacy

- [x] **T015** [US4] Implement `nordljud_sdd_v1` namespaced per-user progress/favorites; preserve unrelated Supabase JSONB keys and keep guest state local — FR-014–FR-016.
- [x] **T016** [US4] Display saved mission status and favorites in My Learning; expose save errors; document two-account manual isolation test — FR-014/FR-015/FR-017.

**Independent Test:** Reload while signed in; favorites and progress survive; different user does not inherit state.

## Phase 7 — Cross-cutting Verification

- [x] **T017** Add responsive CSS and keyboard-accessible states; confirm at narrow width — FR-018.
- [x] **T018** Add GitHub Actions workflow for `npm test`, `tsc --noEmit`, `npm run build`; capture actual outcomes and fix documented defects — SC-006.
- [ ] **T019** Deploy independent branch to own Vercel Preview project, never the publicly shared Vibe Production host — FR-020.
- [ ] **T020** Write `converge.md`: report actual tests, unmet FRs, external blockers, and honest final status; retain commits — SC-007.

## Dependencies

T001–T002 precede T003–T007. T003 and T004 are independent source/test tasks; T005 requires T003; T007 requires T003; T008–T010 require T005. T011–T012 require T007 and T003. T013–T014 require T006. T015–T016 require T006, T010 and T012. T017 depends on the UI; T018 follows test coverage; T019 follows build; T020 follows all attempted checks.

**Requirement coverage:** All FR-001 through FR-020 are assigned to tasks. **Human-only external tests** remain obligations and are not counted as successful merely because task implementation finishes.


## Execution update — 13 October 2026

**T001–T018 implemented and verified by GitHub Actions**, workflow `38320127745`, commit `32cff57687f2fea6b9a648b7f90f5eb572b35083`: 4 data tests PASS, strict TypeScript PASS, Next.js optimized production build PASS. These tests do **not** prove browser behavior, live Google OAuth, or two-account privacy.

**T019 BLOCKED** by Vercel deployment API HTTP 402 `api-deployments-free-per-day` (over 100 deployments within rolling 24-hour quota). Created empty `nordljud-sdd-lab` Vercel project and preview public Supabase env configuration, but no successful deployment. Do not label deployed. Never upgrade the plan or pay without user consent.

**T020 IN PROGRESS:** completed `converge.md` on 13 October, but final browser verification remains outstanding. Each manual test not run stays NOT TESTED.

---

## Post-first-build corrective task, CR-SDD-02

- [x] **T021** [US3] First create and execute browser acceptance tests that prove a signed-out visitor cannot directly discover Sign in on desktop/mobile from initial page. Preserve failing run (RED).
- [x] **T022** [US3] Add unmistakable initial-page Sign in action in `app/experience.tsx` with accessible header/mobile styling in `app/globals.css`; account panel must retain Google and email/password. Validate the same tests PASS (GREEN).
- [x] **T023** [US3] Rebuild and redeploy the *SDD branch only*. Record user-visible verification and remaining OAuth/2-account blockers without erasing pre-fix evidence.

**This is post-first-build rework**, not evidence of the original plan's execution. The task IDs and dated addendum are deliberately separated from T001–T020 to prevent retrospective contamination.

**T021 RED evidence:** Chromium Playwright CI run 38376988433, 2/2 browser tests FAIL because the landing screen has no accessible Sign in button. **T022 code implemented**, GREEN rerun and live account sign-in still to be confirmed.


## Acceptance update: T023 and actual Google OAuth (13 October 2026)

T023 is now **completed for deployment + owner-reported login success**: corrected SDD UI released to `https://nordljud-sdd-lab.vercel.app`; Chromium checks GREEN 3/3; owner confirmed real Google login and re-login data restoration after adding redirect guidance. The earlier localhost return **remains a recorded FAILED observation before the fix**. F10 cross-user isolation, explicit Favorites retention and complete F01–F14 matrix remain to do. No new application feature is authorized by this status-only update.
