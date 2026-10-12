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


## Session 1 continuation — first real browser observation, 12 October 2026

**Observed evidence:** The learner opened Vercel's preview deployment of the Vibe branch in Chrome and supplied a screenshot. The screenshot visibly confirms that the landing/dashboard layout, A2 mission, four selected verb examples, English translations, and level picker render. Progress reads `0/4` in **Guest** mode. The screenshot alone does not demonstrate a working sign-in flow, completed quiz, persistence, or C1 mission.

**First surfaced user-visible defect:** After testing the speaker, the A2 page displayed `Playback failed. Check browser speech settings.`. This is a **failed audio acceptance check** until a successful replay is observed. A Swedish text-to-speech voice missing on the learner's Windows/Chrome machine is a plausible cause, **not yet a proven root cause**.

**Follow-up engineering iteration (not a proven audio fix):** Changed `app/learning-client.tsx` to wait briefly for asynchronous Chrome `voiceschanged`, check for an available Swedish-language voice, report actionable missing-voice guidance, and preserve the exact browser audio error code rather than hiding it. Ignore canceled/interrupted audio when a different sentence is selected. Git commit: `17e32e6666ce7526a58eb3394e00999c2b8872bb`.

**Vercel history:** First import deployed the `main` branch and failed (`No Next.js version detected`); subsequently a preview deployment from `condition/vibe`, commit `20255231b715774240d640341dfa7066c30e7fa0`, reached READY and displayed the app. Both failures and corrective actions are preserved in Vercel/ Git history.

**Pending evidence:** Rebuild result and manual retest of revised audio code; confirm whether the user's browser actually exposes a `sv-SE` voice; test comprehension and verb exercises; separate cloud auth and RLS validation. No claim of a functioning Swedish voice should be made until the learner hears it.


## Session continuation — Scope Change 01: Verb Library and login (13 October 2026)

**Actual user request (translated from Persian):** Restore the former view containing all ~456 verbs and add account login with username/password, especially Google one-click sign-in. The user explicitly endorsed the proposed Explore/Verb Library and My Learning design. The coordinator recorded `research-evidence/SCOPE_CHANGE_01.md` on `main` to give Conditions B and C the same expanded objective later. This expanded requirement came **after Condition A had started**.

**Implemented in Condition A:** An authenticated route `/api/verbs/[level]` (educational content is public; authentication is not required to read it); lazy level-specific retrieval of the recovered 456 verbs; search over Swedish verbs and English meanings/example sentences; all five inflection forms and A2/B1/B2/C1 level switch; Swedish audio; Favorites and My Learning progress view. Added OAuth button calling `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/" } })`. Existing email/password forms remain.

**Engineering correction:** First client explorer imported form labels from a file that also imported all four large verb JSON datasets; refactored into lightweight `lib/verb-types.ts` and server-only dataset module `lib/verb-library.ts` to avoid bundling all Swedish examples in the browser's initial JS.

**Infrastructure:** Existing Supabase project `Nordlyd-3B` has an active browser-safe publishable key; configured `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as encrypted **Preview-only** environment variables in Vercel. No service-role secrets were put in application code. These public browser credentials must not be confused with Google Cloud Client ID and secret; Google provider authorization and redirect allowlist must still be verified.

**Verification:** Vercel builds and browser OAuth sign-in, navigation, search, favorite persistence and isolation still require manual validation at the time of this log. A button reaching the Supabase OAuth method does **not** by itself prove Google login is enabled in the Supabase Dashboard. Email/password accounts are identified by email; a separate unique username identity was not implemented or promised as complete.


## Session continuation — real user-found consistency and Google OAuth failures (13 October 2026)

**User evidence:** After personally opening Explore, selecting a verb, and changing the level A2 → C1, the learner reported that the UI jumped to a different verb, violating continuity. The user also reported that **Continue with Google** navigates to a separate error page, does not log in, and Back navigation loses the previous context. This was observed from the user's report; the actual external OAuth error text was **not** supplied. Do not invent its exact code or cause.

**Root cause for verb switch confirmed by code inspection:** The handler in `app/verb-explorer.tsx` explicitly executed `setSelectedVerb("arbeta")` after every level change. The component also chose the first matching entry if the selected verb was not in the current filter.

**Corrections performed:**
- Removed the forced selection reset on CEFR level change, retained the verb identity across all four datasets, and ensured entries only display when tagged for the currently selected level. Preserve selected term/search/favorites settings in sessionStorage so reopening the explorer on the same browser origin restores context. Git commit: `59f38f0e294ef8c9797de7fd40f94bbabef18e33`.
- Added `/api/auth-status` to read Supabase's public provider status safely without returning credentials; show in-app explanatory text and disable the Google button if the public settings identify the provider as disabled. Git commit: `4c390b72a7e783df2cca16f58d2b00e8449e5373`.
- Preserved the learner's current navigation tab and CEFR level when navigating away and returning. Handle `error_description` from OAuth URL or fragment inside Nordljud. Send the current tab and level in OAuth `redirectTo` query parameters, for a user returning across browser navigation. Git commit: `61a442bc6f30451e5e5f64515a163de93b26b378`.
- Prevented a premature Google click while the provider-status check is running. Commit: `44798bf99174858dd2fa351c7fc4bd9c1153c905`.
- Added source-data regression assertions proving the 456 verb identities exist in the same order across all four levels and that `arbeta` preserves its identity while example complexity changes. Commit: `0fb3a1622396446867da451a8888f712dfd9b58b`.
- Documented Google Cloud Client ID/Secret setup, the correct Supabase OAuth callback, and Vercel preview redirect allowlisting in `01-vibe-coding/GOOGLE_AUTH_SETUP.md`.

**Outstanding verification:** The new Vercel preview needs actual browser confirmation that switching A2/C1 keeps the verb and that OAuth provider status is reported correctly. A **Google sign-in success is still NOT VERIFIED**. Google login may require external Google Cloud and Supabase Dashboard configuration which cannot be inferred from JavaScript code or a READY build. Credential values are not committed to GitHub.

**Research value:** These real user-found issues demonstrate the difference between a technically successful deployment and verified behavior. They are part of the Vibe condition's genuine iteration/rework record, not evidence manufactured after the fact.
