# Nordljud — common product brief (all three conditions)

**Product idea:** Nordljud is a small, responsive web app teaching **Swedish through English** with practical, short lessons. The same product must be attempted independently through three AI-assisted development approaches.

## Learner journey

A learner can create an account, sign in, see a learning dashboard, select a level (**A2, B1, B2, C1**), select one corresponding mission, read and hear Swedish examples, reveal English assistance, complete a comprehension question and a verb-form exercise, receive feedback, and return later to resume their progress. Provide sign-out. Learner progress should be user-specific and retained after reloading/signing in again.

## Shared teaching inputs

- Source data: `shared-content/verb-library/{A2,B1,B2,C1}.json` (recovered, unchanged).
- Four mission goals and target verbs: `shared-content/mission-seeds.json`.
- Browser speech synthesis requesting `sv-SE`; no pre-recorded MP3 requirement for this classroom MVP. Communicate gracefully if Swedish speech is unavailable.
- Use **English** for the UI, explanations, and translations; **Swedish** for learning examples and exercises.
- No requirement to create hundreds of new lessons. **One representative mission per level** is enough.
- Swedish examples are unreviewed; do not claim teacher-certified content.

## Common technology constraints

- Web app suitable for deployment on **Vercel**.
- **Next.js + React + TypeScript** for the implementation, **Supabase** for account authentication and progress persistence, and browser `speechSynthesis` for audio.
- Secure per-user data access; do not expose elevated Supabase credentials in the browser.
- Local development must be demonstrable even if deployment configuration is unavailable; report unimplemented/failed cloud integrations honestly.

## Out of scope

Paid subscriptions, AI tutor/chatbot, pronunciation grading, speech recognition, large curriculum, admin tools, social features, and complex gamification.

## Fair comparison

Each implementation must start from the **same frozen initial Git state**, consume the exact same teaching data and goals, and be evaluated by a common independent checklist. Do not reuse historical Nordlyd application code or copy working code from another condition.

This brief is a **common product objective**, not a completed SRS or Spec Kit specification. Detailed requirements engineering is an activity to observe or explicitly perform within the individual development condition.

**Status:** Common scope agreed for experiment preparation. Any later changes must be logged and applied fairly to all conditions.
