# Feature Specification: Nordljud Classroom Swedish Learning MVP

**Feature Branch**: `condition/spec-driven` (experiment C; `specs/001-nordljud-classroom`)  
**Created**: 2026-10-13  
**Status**: Reviewed specification before technical design  
**Input**: Learner's common Nordljud brief and documented post-A scope expansion, **not** either completed A/B application's source code.

## User Scenarios & Testing

### User Story 1 — Practice Swedish through meaningful missions (P1)

A learner chooses A2, B1, B2 or C1 and receives one short situation appropriate to that level. They can read a Swedish phrase, optionally reveal the English translation, listen to it when supported, choose an English meaning and identify the verb's past form, and receive feedback.

**Why this priority:** The mission itself is the minimum useful pedagogical outcome; guest access must remain possible.

**Independent Test:** Without an account, choose each of four levels, inspect the corresponding seed, play audio or see an explicit unavailable notice, answer both exercises correctly and incorrectly.

**Acceptance Scenarios:**
1. **Given** a new visitor, **when** they select A2, **then** the mission uses `arbeta` and the common A2 examples.
2. **Given** the learner changes level to B1/B2/C1, **when** the mission opens, **then** the displayed target is respectively `förklara`, `föreslå`, `påverka`.
3. **Given** an incorrect answer, **when** it is submitted, **then** feedback indicates the answer was wrong without awarding a completion mark.
4. **Given** a correct answer, **when** it is submitted, **then** the corresponding exercise is marked done; finishing both completes the mission.
5. **Given** the browser has Swedish voice support, **when** the learner clicks Listen, **then** the example is read with a Swedish voice; otherwise an understandable unavailability message appears.

### User Story 2 — Explore level-aware verbs without losing the selection (P1)

A learner searches the teaching lexicon by Swedish spelling or English meaning; picks a word and a CEFR level; sees infinitive, imperative, present, preterite and supine forms, plus Swedish examples and English translation when data exists; favorites a sense.

**Independent Test:** Search `arbeta`; change A2 to C1; lemma stays `arbeta` while the sentence changes. Search `sticka`; both distinct sense records can be selected and are not silently collapsed.

**Acceptance Scenarios:**
1. **Given** A2 and `arbeta` selected, **when** the learner changes to C1, **then** the selection stays on the same word and only level-appropriate examples change.
2. **Given** `sticka`, **when** viewing search results, **then** two distinguishable entries appear, one for knitting and one for stinging/leaving.
3. **Given** a source record with an unavailable example, **when** the corresponding form is displayed, **then** it is labeled unavailable rather than fabricated.
4. **Given** the learner toggles favorites, **when** they visit My Learning, **then** the chosen sense is listed; it can be removed.
5. **Given** a search term with no matches, **when** filtering finishes, **then** a useful empty state appears.

### User Story 3 — Create and use a personal account (P2)

A learner can create an account via email/password or sign in with Google, leave the account and return later. A guest can try the lessons without providing personal data.

**Independent Test:** Test valid and invalid email/password; test a real Google OAuth round-trip when provider is enabled; sign out; confirm guest mode remains usable.

**Acceptance Scenarios:**
1. **Given** correct email/password, **when** the user signs in, **then** their identity and personal learning status appear.
2. **Given** wrong credentials, **when** sign-in is attempted, **then** an error is shown and no session is granted.
3. **Given** Google sign-in is supported, **when** an authorized learner chooses it, **then** the browser leaves for Google and returns to the app signed in.
4. **Given** a valid session, **when** Sign out is selected, **then** personal cloud details no longer appear.
5. **Given** the Google provider is not configured, **when** sign-in is attempted, **then** the app identifies the dependency rather than claiming success.

### User Story 4 — Retain private learning progress (P2)

A signed-in learner returns later and sees their individual mission results and favorites. Separate accounts must not be able to see or edit each other's activity.

**Independent Test:** Use two distinct accounts and different answers/favorites. Refresh, sign out/in, and verify data isolation in each account.

**Acceptance Scenarios:**
1. **Given** a signed-in learner completes a question and saves a favorite, **when** they reload and sign in again, **then** progress and favorite remain.
2. **Given** learners A and B, **when** B signs in, **then** B cannot view or modify A's learning state.
3. **Given** a network or save error, **when** progress cannot reach cloud storage, **then** the UI reports the failure instead of silently claiming a successful save.
4. **Given** a guest, **when** they finish a question and refresh on the same browser, **then** their non-cloud guest progress is recoverable where browser storage permits.

## Edge Cases

- Missing Swedish speech voice or `speechSynthesis` unavailable; avoid silent failures.
- Late initialization of browser voice list; delayed OAuth callbacks; incorrect passwords and confirmed-email requirements.
- Browser local storage disabled in private browsing.
- Two `sticka` entries have different meaning and inflection, but the same Swedish spelling; do not use spelling alone as React list key or source identity.
- Exactly 456 sense records **per CEFR level**, but 455 distinct written lemmas. Keep both senses, not an invented 456th unique word.
- Absent source forms (notably Imperative), invalid selected CEFR level, no lexicon matches.
- Favorite/progress requests failing due to network/RLS.
- Slow device or narrow screen; keyboard navigation; reload after signing out.

## Requirements

### Functional Requirements

- **FR-001**: Show A2, B1, B2 and C1 learner levels.
- **FR-002**: Offer exactly one representative mission per level, using unchanged shared mission seeds.
- **FR-003**: Display source Swedish example sentences and corresponding English meaning or translation.
- **FR-004**: Let the learner show/hide English assistance.
- **FR-005**: Request a Swedish voice (`sv-SE`) when audio is played, and show a useful status if unavailable.
- **FR-006**: Provide an English meaning comprehension question with correctness feedback.
- **FR-007**: Provide a Swedish verb-form question with correctness feedback; no credit for incorrect answers.
- **FR-008**: Offer searchable browsing across **456 sense records / 455 written lemmas** at each CEFR level, including both `sticka` senses.
- **FR-009**: Preserve the same selected sense across changes in example difficulty.
- **FR-010**: Show all five source word forms; unavailable examples must be explicitly unavailable.
- **FR-011**: Let the learner mark/unmark favorite sense records and review them in My Learning.
- **FR-012**: Offer email/password account creation, sign-in and sign-out.
- **FR-013**: Offer Google OAuth sign-in, with a graceful error if the externally configured provider is unavailable.
- **FR-014**: Save signed-in learner progress and favorites, and restore them after reload/re-login.
- **FR-015**: Enforce access isolation so one learner cannot access another learner's saved activity.
- **FR-016**: Allow guest study on one browser and disclose that guest work is not automatically merged into an account.
- **FR-017**: Display actionable errors for save failures, missing resources, invalid login and missing audio.
- **FR-018**: Work at desktop and narrow mobile widths with keyboard-accessible interactive controls.
- **FR-019**: Never expose elevated Supabase credentials in user-visible assets or source control.
- **FR-020**: Do not modify pre-existing Nordlyd deployments, study data, or experiments A/B.

### Key Entities

- **VerbSense**: stable pairing of Swedish written lemma and supplied meaning, five inflection forms, available examples, CEFR level, and source record order.
- **Mission**: ID, CEFR level, teaching goal, target sense, example forms, comprehension task and verb-form task.
- **Learner**: authenticated user ID from identity provider, or local guest.
- **ExerciseProgress**: per-user, per-mission completion flags.
- **FavoriteSense**: per-user reference to the exact saved verb sense.

## Success Criteria

- **SC-001**: Four levels produce four different missions with target words matching the seed data.
- **SC-002**: Lexicon serves all **456 entries per level**, preserves **455 written spellings** and lets both `sticka` senses be selected independently.
- **SC-003**: Changing A2→C1 does not change a selected sense but does change its examples.
- **SC-004**: In a controlled two-user check, each user retains their own progress and cannot see or edit the other's.
- **SC-005**: Users can complete each mission's two questions with immediate correct/incorrect feedback.
- **SC-006**: App passes source-data test suite, strict TypeScript check and framework production build.
- **SC-007**: Every requirement has an implementation task and a verification note, including explicit NOT TESTED for blocked browser-dependent cases.
- **SC-008**: User can navigate between study modes on a narrow mobile viewport without loss of the selected level or sense.

## Assumptions and Constraints

- Shared teaching records are historically recovered, not independently Swedish-teacher certified or commercially cleared.
- Browser voices are provided by the user's OS/browser; no prerecorded audio or speech-recognition service is needed.
- Supabase provider and host allowlists require external project-owner configuration; local code alone cannot activate Google.
- Consent/privacy legal review and commercial readiness are outside this **university-only** MVP.
- This post-A enhanced scope is a **dated change request**, not part of the original common snapshot. The comparison must disclose this history.
- A/B implementation source must not be read or reused to implement Condition C; engineering decisions must be justified by this specification and common educational inputs.

**Traceability source**: `shared-content/PRODUCT_BRIEF.md`, `shared-content/mission-seeds.json`, `research-evidence/SCOPE_CHANGE_01.md` on coordinating `main`, common evaluation `F01–F14`. The latter protocol is an evaluator artifact, not a substitute for this specification.
