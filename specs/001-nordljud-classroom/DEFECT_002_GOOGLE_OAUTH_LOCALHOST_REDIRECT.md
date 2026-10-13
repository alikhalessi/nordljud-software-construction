# SDD Defect 002 — Google OAuth returns to localhost:3000

**Date reported:** 13 October 2026  
**Environment:** Hosted Condition C, https://nordljud-sdd-lab.vercel.app  
**Reported by:** Student (manual observation)  
**Status:** OPEN — suspected configuration issue; needs Supabase dashboard confirmation and a new real OAuth sign-in test  
**Severity:** BLOCKER for authenticated Google login in the SDD pilot, independent of working app build or sign-in UI.

## Reproduction supplied by the learner

1. Open hosted SDD site.
2. Click **Sign in**, then **Continue with Google**.
3. Google's account chooser displays local Google identities, indicating that the redirect to the identity provider was initiated.
4. Choose the user's own Google account.
5. Instead of returning to Nordljud, the browser navigates to **localhost:3000**, which is not the hosted app; login cannot be completed there.

**Source of evidence:** User's manual report. We do NOT have a captured browser HAR, final redirect response, screenshot, or independent successful OAuth test yet.

## Verified engineering evidence

1. `app/experience.tsx` implements Google authentication via:
   `client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/" } })`.
   For this canonical hosted domain the intended `redirectTo` is `https://nordljud-sdd-lab.vercel.app/`.
2. The browser-safe `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` variables are present on the SDD Vercel project for **both Preview and Production**. Do not infer client configuration is absent.
3. SDD is connected to active Supabase project `uhyzuivllmztptmcduci`; deployment is READY, and the earlier Sign in discoverability defect was fixed with Chromium 3/3 acceptance tests.
4. The connected Supabase project tooling currently exposes **no operation to read or change Authentication → URL Configuration / Redirect URLs**. Its exact stored Site URL and allowlist have *not* been confirmed.

## Probable root cause (not yet confirmed in admin dashboard)

Supabase documents this exact behavior: if `redirectTo` isn't included in the project's **allowed Redirect URLs**, login may return to the default Site URL (often `http://localhost:3000`), rather than the requested hosted origin.

- Supabase troubleshooting: https://supabase.com/docs/guides/troubleshooting/why-am-i-being-redirected-to-the-wrong-url-when-using-auth-redirectto-option-_vqIeO
- Supabase guide: https://supabase.com/docs/guides/auth/redirect-urls

**Hypothesis:** The SDD canonical origin was not added to the shared Supabase project's allowlist, and the default Site URL still points to localhost. The behavior fits strongly, but requires examining URL Configuration before saying it is definitive. No Google Cloud client secret change is indicated by the evidence.

## Proposed smallest corrective action (owner dashboard, no code change)

1. Open https://supabase.com/dashboard/project/uhyzuivllmztptmcduci/auth/url-configuration
2. Under **Redirect URLs**, ADD and SAVE `https://nordljud-sdd-lab.vercel.app/**`.
3. If testing the branch-specific Preview too, independently add `https://nordljud-sdd-lab-git-condition-spec-driven-aleksi9.vercel.app/**`.
4. Keep existing Vibe and other Nordlyd redirect URLs; **do not change shared Site URL or remove old entries** just to fix SDD, because this shared Supabase instance serves other experimental applications.
5. In a fresh private browser session initiate Google sign-in from `https://nordljud-sdd-lab.vercel.app/` and confirm redirect returns to **that exact origin** with an authenticated session. Then save a correct answer and favorite, sign out and sign back in, confirm persistence.
6. Repeat on a second distinct account to verify user-specific RLS isolation. Never capture or publish tokens, authorization codes or real email addresses in screenshots/issue logs.

The Google Cloud Web OAuth client's authorized callback remains the Supabase broker endpoint `https://uhyzuivllmztptmcduci.supabase.co/auth/v1/callback` unless a separate Google-side error demonstrates otherwise; adding the Vercel page as the Google authorized **redirect URI** is not the fix for this Supabase flow.

## Academic interpretation

The earlier first-pass issue **DEFECT_001** was UI discoverability, shown by Chromium browser tests (RED 2/2, GREEN 3/3 after correction). DEFECT_002 is an integration/operations failure that survived those browser tests because they intentionally verified only **discovering the account panel**, not an actual third-party OAuth grant.

The initial SDD specification correctly required Google sign-in, and `clarifications.md` even noted provider allowlisting as an external dependency. Yet the work was marked implemented and a deployed READY build was observed **without verifying the actual OAuth return path**. The process therefore failed to close an integration acceptance requirement, not necessarily to implement the API call.

**Do not report OAuth PASS** until a user confirms real return to the hosted site and a signed-in session. The corrective action should be logged as a post-implementation environment step, not backdated as part of original specification or code.

**Verification:** PENDING OWNER ACTION. After real user verification update the status and add date, browser/device, and test outcome.
