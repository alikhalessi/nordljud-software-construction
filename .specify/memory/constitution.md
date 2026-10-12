# Nordljud Constitution — Condition C (Specification-Driven Development)

**Scope:** Åbo Akademi Software Construction classroom experiment only. A separate implementation from shared baseline commit `1afd635324a788f18db19f83f338ad89ade54e33`. Do not consume Condition A or B implementation code.

## Core Principles

### I. Requirements Before Source Changes (NON-NEGOTIABLE)
No application source is generated before an approved feature specification, clarification record, technical plan, ordered tasks, and acceptance traceability have been committed. Distinguish **what** the learner needs from **how** the system implements it. Record unresolved issues as explicit assumptions, not made-up user answers.

### II. Dataset Fidelity and Explicit Terminology
The frozen, preexisting `shared-content` teaching dataset is read-only input to all three conditions. Its current structure comprises **456 records per level / 455 unique written lemmas**, because `sticka` has two senses (`knit`, `sting/prick/leave`). Preserve both senses. Four levels each contain the same records in corresponding positions. Missing forms or examples must be indicated, not fabricated. Do not call the source teacher-verified.

### III. Security and Account Separation (NON-NEGOTIABLE)
Expose only browser-safe Supabase publishable credentials; never expose service-role secrets. User-specific progress and favorites must be isolated using authenticated `auth.uid()` and database RLS. No anonymous user can read another learner's state. Google OAuth and email/password sign-in are required; document external provider configuration and test limitations. Keep Condition C progress under its own namespace to avoid overwriting historic Nordlyd or other experimental outputs.

### IV. Testable User Stories and Traceability
Every requirement gets an ID; stories have independent Given/When/Then acceptance criteria. Use the shared blind evaluation tests `F01–F14` on coordinating `main` and additional scope-change tests. Ensure data, UI and persistence validation can be independently demonstrated. Test outcomes must be PASS/FAIL/PARTIAL/NOT TESTED with real evidence; a green Vercel Build is not a Google OAuth integration test.

### V. Educational Usability and Minimum Complexity
Swedish examples and requested voice use `sv-SE`; explanations and navigation are in English. Display readable semantic markup, keyboard-accessible controls, clear confirmation/errors and mobile layout. One representative mission per A2/B1/B2/C1 level is adequate. No artificial complexity, subscriptions, chatbot, load scaling, social features or startup architecture.

## Fixed Technology and Environment

- Next.js / React / TypeScript; Supabase client authentication + per-user database state; Vercel deployments; built-in browser speech synthesis.
- Educational input file names and mission seeds as recorded in `shared-content/PRODUCT_BRIEF.md`.
- Dependency availability, browser voices, third-party OAuth configuration and preview host allowlisting must be reported explicitly if not testable.
- Retain dated AI prompts, reasoning summaries, code commits, test logs and corrections. Do not invent method timing.

## Development Workflow and Quality Gates

1. **Constitution**: ratify the constraints; note any changed assumptions.
2. **Specify**: prioritize learner stories, functional requirements, edge cases and measurable outcomes without implementation details.
3. **Clarify**: decide ambiguities using the common experimental brief; flag not-yet-verified decisions. Never attribute an AI default to the user.
4. **Plan**: document stack, architecture, data model, privacy and dependency strategy, API contracts and tests.
5. **Tasks**: list path-specific tasks in implementable dependency order mapped to requirement IDs.
6. **Analyze**: check consistency and coverage *before* implementation, document the verdict.
7. **Implement and verify**: only then add program files and CI, validate results, note failures and changes.
8. **Converge**: compare delivered behavior to specifications; open issues for failures rather than silently weakening criteria.

## Governance

This constitution governs **Condition C only**. Common inputs and experiment design on `main` cannot be retroactively changed to improve one condition. Requirements discovered after Condition A began are documented in coordinating `research-evidence/SCOPE_CHANGE_01.md`; C implements the same expanded goals explicitly while acknowledging experiment order effects. Amendments require a dated rationale and version increase, never a quiet rewrite.

**Version:** 1.0.0 | **Ratified:** 2026-10-13 | **Last Amended:** 2026-10-13
