# Condition A — Actual Vibe Coding development log

> This is an **after-the-fact summary of the observable actions taken in this conversation**, not a verbatim transcript of every internal tool operation. No prompts or successful tests have been invented. The exact Git commit history is the primary record.

## Session 1 — 12 October 2026 (Europe/Helsinki)

### User intent that initiated this session

**User:** "ok let's continue"

Context: previous conversation approved creating Nordljud as three independent implementations from the common baseline. The agreed first activity was to begin **Vibe Coding**, with the same A2/B1/B2/C1 Swedish–English educational material, browser Swedish audio, Next.js/React/TypeScript, Supabase and Vercel.

### Starting baseline

- Branch: `condition/vibe`
- Original common commit: `1afd635324a788f18db19f83f338ad89ade54e33`
- `git compare` showed **identical** with `baseline-v1` before writing code.
- No existing historical app source was copied into this branch.

### Iterations and observable outcome

1. **Foundation.** Added `package.json`, Next.js config, TypeScript config, .gitignore, env template, root layout, and Supabase client helper. Framework choice followed the common brief. Outcome: files committed. Not yet build-tested.
2. **Content integration.** Wrote `lib/missions.ts` to derive four mission cards and two exercises per level from the pre-existing educational JSON. Outcome: code committed. This is new implementation code, not extracted historical app code.
3. **Learner interface.** Created `app/page.tsx`, `app/learning-client.tsx` with four level tabs, Swedish examples, English translations, browser `speechSynthesis` with `sv-SE`, question feedback, guest localStorage, optional Supabase email/password auth, and cloud progress persistence in `learner_states`. Outcome: files committed, not yet runtime verified.
4. **Visual iteration.** Added `app/globals.css` responsive layout. Outcome: committed, visual QA outstanding.
5. **Verification setup.** Added `tests/content.test.mjs`, GitHub Actions validation workflow, and `npm test` command. Corrected workflow configuration to avoid caching with a missing npm lockfile. This is a real setup correction; no CI pass claimed.
6. **Read-only backend check.** Confirmed the historical Nordlyd-3B Supabase database exists and has per-user SELECT, INSERT, UPDATE and DELETE RLS policies on `learner_states`. This is policy inspection only; no end-to-end auth or cross-user security test has run.
7. **Deployment attempt.** Tried creating a new Vercel project `nordljud-vibe-lab` connected to the private GitHub repo. Vercel rejected the request (HTTP 400) because a **GitHub Login Connection** is not configured in that Vercel account. No claim of deployment.

### Implementation status at this checkpoint

- **Committed source:** YES.
- **Data integrity assertions written:** YES.
- **Automated tests successfully executed:** NOT VERIFIED.
- **TypeScript check successfully executed:** NOT VERIFIED.
- **Next.js production build:** NOT VERIFIED.
- **Browser/UI test:** NOT VERIFIED.
- **Live auth / cross-user RLS behavior:** NOT VERIFIED.
- **Vercel deployment:** BLOCKED on Vercel-side GitHub Login Connection.

### Research integrity

This is only an initial Vibe implementation increment. Do **not** mark Condition A finished or freeze it as a successful MVP yet. Keep any genuine failures, prompts, later corrections, screenshots, timings and working links. The elapsed time has not been reliably instrumented; do not invent a 120-minute result. Conditions B and C have not been touched.
