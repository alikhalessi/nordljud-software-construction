# Phase 0: Technical Research and Decision Record

**Date:** 2026-10-13. Generated in Condition C after the specification and clarification gate, before application code.

## R-01 — Serving Four 456-Entry JSON Corpora

**Decision:** Load common datasets via server-side modules; deliver a selected level through `GET /api/lexicon/{level}`. Render only one mission per level in the main view.

**Rationale:** Four recovered teaching datasets are large and immutable. A level-specific endpoint avoids shipping all 1,824 records in the initial browser bundle. Responses are cacheable because no user data is involved.

**Alternative rejected:** Embed all data in a single client bundle, which is avoidable overhead for a small classroom MVP.

**Constraint:** Use each provided example verbatim and preserve all 456 entries including the two `sticka` senses.

## R-02 — Unique Sense and CEFR Changes

**Decision:** Build a stable sense identifier from `v` and `meaning`; record order is retained when rendering. Switching difficulty uses the same identifier against the newly selected level.

**Rationale:** `sticka` has two different meanings and conjugations. A word-only key loses source identity. Pairing the word and meaning supports deterministic favorites without generating new content.

**Alternative rejected:** Index alone; fragile under sorting/searching.

## R-03 — User Authentication and Per-Learner Storage

**Decision:** Supabase Auth (Google and email/password) with browser-safe publishable credentials, `public.learner_states` user-keyed JSONB, existing RLS. Namespace C-specific data under `nordljud_sdd_v1`.

**Rationale:** Matches the shared technology constraints and avoids contamination of other experiments using the same Supabase project. Do not modify security policies without evidence/approval.

**Alternatives rejected:** Local-only signed-in state (fails persistence), service-role credentials in browser (unsafe).

## R-04 — Speech

**Decision:** Browser Web Speech `speechSynthesis`, use Swedish locale `sv-SE` and try to select an explicit Swedish voice. Listen control reports missing API/voice.

**Rationale:** Appropriate for classroom pilot, no recurring speech API spend.

**Limitation:** Voice catalog availability varies by browser/OS and may load asynchronously.

## R-05 — Test Evidence

**Decision:** Node built-in test runner for pure source-data and selection invariants, TypeScript strict check, Next production build via GitHub Actions; separate human black-box checks for login and privacy.

**Rationale:** Unit tests cannot assert a real external Google grant or a real user's re-login. Report separate outcome categories.

## R-06 — Source Independence

**Decision:** Create all C application files independently after the plan and task gate; the only code-adjacent common input is frozen JSON teaching data. Does not incorporate implementation from Vibe or God Mode.

**Limitation:** The AI agent has previously seen defects from A/B; comparison has unavoidable learning/order contamination. Log it rather than pretend full experimental blinding.

**Technology references:** Official GitHub Spec Kit v1.1.3 scaffold initialized by actual CLI in GitHub Actions, run `38319369671`; app constraints are defined in `shared-content/PRODUCT_BRIEF.md`.
