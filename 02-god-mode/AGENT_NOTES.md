# Autonomous agent's working notes — God Mode condition

**Experiment start:** 13 October 2026. This is a newly started implementation; neither the older Nordlyd application nor Condition A source has been copied.

## Initial decisions

The master request delegates engineering choices. I chose to:

- Keep the browser payload small: derive the four missions on the server, load the 456-verb library by level on demand.
- Preserve a selected Swedish verb across CEFR level changes by storing its canonical lemma, not the list index.
- Keep lesson progress and favorite verbs under a **condition-specific namespace** within the existing `learner_states.state` JSONB column; do not overwrite the other experiments' keys.
- Share only already recovered *educational data*, not Condition A's UI, auth code, app configuration, or tests.
- Favor accessible buttons, status announcements, helpful failure messages and desktop/mobile display.
- Handle normal Google OAuth return and provider configuration failures gracefully; successful OAuth must still be tested with real credentials.
- Build in small verifiable increments even though the agent has broad autonomy; commit tests and evidence.

These notes were generated autonomously after seeing the God Mode master prompt; no external Spec Kit workflow is imposed.

## Known external dependencies

A Supabase project (Nordlyd-3B) exists with RLS policy on user-specific `learner_states`. Its Google provider has been configured by the user, but this experiment uses **separate application code and preview deployment**, requiring the redirect allowlist to include the new test host. Do not rely on Condition A's deployment as a working version of B.

## Verification status

No code runs, tests, deployments, screenshots or sign-in outcomes are claimed yet.
