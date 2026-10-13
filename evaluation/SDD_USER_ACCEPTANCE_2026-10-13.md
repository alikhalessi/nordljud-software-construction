# Condition C (SDD) — Student-reported successful Google OAuth and data retention

**Date reported:** 13 October 2026 (Finland)  
**Tester:** Student / application owner, in this project's ongoing ChatGPT conversation  
**Application under test:** https://nordljud-sdd-lab.vercel.app  
**Method / branch:** Condition C — `condition/spec-driven`  
**Evidence provenance:** Direct student report, **not** a captured log, screenshot, automated OAuth test, or independent second-user audit.

## Observation, in sequence

1. Earlier, the initial SDD release's Google sign-in sent the learner to `localhost:3000` after choosing an account — documented as `DEFECT_002_GOOGLE_OAUTH_LOCALHOST_REDIRECT.md`.
2. The owner received instructions to add the canonical hosted SDD URL to the existing Supabase project's **Authentication → URL Configuration → Redirect URLs**, while preserving existing applications. The exact dashboard screenshot and action are **not available**, so this configuration correction is likely but not independently confirmed.
3. The owner subsequently reported in Persian, in substance: “Great, it's working; it worked completely. It saves the information; you sign out and return and the saved information is OK.”
4. This supports a successful real Google sign-in/callback and restoration of some previously stored user information after sign-out and sign-in again, **for the reporting account**.
5. No independent Google provider telemetry or personal account contents were retrieved; no tokens, emails or user IDs should be included in published course evidence.

## Evidence grading for shared test plan

| Test | Result currently supported | Why |
|---|---|---|
| Expanded G01: Google OAuth callback returns to SDD origin | **PASS — student-observed** | Owner reports working login after prior localhost failure |
| Expanded G02: Some authenticated learning data retained after sign-out/re-login | **PASS — student-observed** | Owner explicitly reports saved information remains |
| F02: Email/password login, wrong credentials, refresh and logout | **PARTIAL** | Google login and logout/re-login tested; password / invalid credential paths not verified |
| F09: Both partial/completed mission progress persist | **PARTIAL** | Generic saved-information persistence reported; specific partial vs completed flags not detailed |
| Favorites persist after reload and re-login | **NOT TESTED separately** | Not clearly included in the owner's specific report |
| F10: Two distinct signed-in users cannot read/change each other's state | **NOT TESTED** | Only one reporting account is evidenced |
| SDD browser auth-discoverability | **PASS — automated browser** | RED 2/2 initial, GREEN 3/3 after fix, GitHub Actions 38376988433 and 38377362037 |

## What was fixed and what remains uncertain

**Functional issue resolved by student re-test:** OAuth navigation previously ended at localhost; it now successfully returns to the SDD application and allows retained user data. This is not proof that the exact Redirect URLs configuration has been independently inspected. Supabase allowlist fallback is the leading causal explanation, not a captured final root-cause confirmation.

**Next independent acceptance:** Using two separate authenticated Google accounts and separate browser profiles/private windows, record distinct mission flags and favorite senses. Confirm that B sees none of A's work and A sees none of B's work, while both retain their own data after re-login. Do not share real emails, Google tokens or session codes in screenshots. This UI test does not by itself substitute for an adversarial RLS API test.

## Research value

Two post-first-pass SDD issues were observable: hidden Login entry (missing discoverability acceptance criterion) and a Google redirect/integration dependency (missing real OAuth end-to-end acceptance). The student has now confirmed the **functional recovery**, but first-pass failure is preserved for the comparative experience report. Never rewrite the sequence to claim the initial AI agent delivered perfect authentication from the outset.

**Future updates:** Add time/browser/screenshot only after the student supplies them; do not invent. Record two-user privacy, favorites and exact mission progress separately.
