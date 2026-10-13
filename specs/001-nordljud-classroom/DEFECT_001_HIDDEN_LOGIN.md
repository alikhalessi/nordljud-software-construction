# SDD Post-Release Defect 001 — Hidden Login Entry Point

**Observed:** 2026-10-13, after first SDD Preview deployment became READY.  
**Reported by:** Student, reviewing the live SDD site.  
**Original published application snapshot:** `01281282400d6d441e29535b192a82f8ff4f72d1`, `https://nordljud-sdd-lab.vercel.app`.  
**SDD branch at inspection:** `c8d415bcae2e41a8484f69215b53f74e9955edf5` (documentation-only append after original deployment).  
**Severity:** High usability discoverability; impact on adoption and evaluation, not proven data loss.  
**Original status:** REPORTED + SOURCE CONFIRMED; no screenshots or live OAuth round-trip available.

## User report

Student reports that the "Spec-Driven" app has no visible Login section and questions why a supposedly complete specification and agent implementation missed it. They explicitly request preserving this observation for the academic comparison.

## Source-based root cause

1. User Story 3 and FR-012/FR-013 in `spec.md` require email/password and Google sign-in. They do **not** say "visible Sign in button in the header of the initial screen, one click to auth" or include UI-placement acceptance.
2. `app/experience.tsx` contains real `emailAuth`, `googleAuth`, `signOut` functions, Supabase session subscription and a form with Continue with Google and email/password fields. Therefore **the auth section is implemented in source**.
3. The entire form is gated by `screen === "me"` in the `My learning` branch, while initial `screen` is `study`. The header only says `Guest learner`, not `Sign in`. A new visitor must infer that My learning leads to account management.
4. The Node tests test corpus integrity, not DOM or navigation. TypeScript and `next build` cannot catch missing/hidden prominent entry points. `analyze.md` recorded FR coverage on paper without evaluating user discoverability.
5. Vercel Preview variables include public Supabase URL and publishable key, so their *absence in the project environment* is not the observed cause of no visible entry point. Real runtime auth and Google OAuth callback are still **NOT TESTED**; a redirect allowlist entry may be required. Vercel team SSO protection is a separate access gate and must not be confused with app Login.

## Study implications

**Research classification:** Specification *omission of an important usability acceptance criterion* + implementation choice + absence of automated/browser validation, not intrinsic inability of SDD to code authentication and not proof of successful Google integration. The previous report's CI **PASS** was accurate *only for tested source/type/build checks*. Original release **was not functionally converged**.

**Method caution:** Official Spec Kit CLI `specify init` ran, but assistant-authored stages followed the toolkit templates. A separately operated Copilot slash-command agent did not execute all the skills. Avoid claiming the failure happened under a fully automated official Spec Kit /speckit-* sequence.

## Remediation plan (post-first-build, keep initial failure evidence)

1. Append a dated spec amendment `CR-SDD-02` with explicit FR-021 and SC-009.
2. Write Playwright browser acceptance tests at desktop and 390px mobile widths **before** changing UI; preserve failing CI evidence (RED).
3. Add visible Sign in entry on initial screen and keep existing My learning account panel and Google/email options (GREEN).
4. Rerun CI and deploy updated Condition C independently; browser replay against the finished deployment is needed.
5. Actual OAuth, sign-out/re-login, data separation and Google callback allowlist remain separate acceptance obligations. User's sign-in evidence is needed to move them from NOT TESTED to PASS/FAIL.

## Interpretation

"Spec-driven" means engineering is organized around explicit, testable specifications and controlled validation. It **does not mean** a specification or an AI agent guarantees a flawless, full product at the first deployment. Missing criteria in the spec, shallow testing, assumptions, and external integrations can fail at any stage. The failure here is exactly the kind of case a real SDD convergence loop should reveal and correct, not hide.

**Status:** PRE-FIX evidence captured. Update with actual failing and passing CI run IDs after tests.

---

## Reproducible initial browser failure — RED (before any UI patch)

GitHub Actions Playwright run **38376988433** at commit `7e9c467f75a65982c8168a2846ba8f61e8cc2a49` completed **FAIL** while rendering the unchanged pre-fix SDD UI in real Chromium. Both browser acceptance tests failed:
- **Desktop:** `getByRole('button', { name: 'Sign in', exact: true })` not found / not visible.
- **390px mobile:** same absence in initial page header.

The runner installed Chromium, successfully launched Next.js, and executed the tests; the failures were not caused by missing browser dependencies or a failed build. The earlier original SDD source-dataset CI could still be green at the same time, illustrating different coverage.

**Evidence:** https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38376988433  
This RED run preserves the learner-observed defect reproducibly and will not be overwritten or concealed.

## Post-RED minimal UI correction

- Give signed-out visitor an explicit top-header **Sign in** button, accessible by role/name at desktop and mobile widths.
- Add a secondary "Sign in to save across devices" CTA on the learning snapshot.
- Both controls open the existing My learning account panel with Google OAuth and email/password options in one click; no auth provider logic, account data, or source datasets are modified.
- Keep the normal account button for signed-in learners.
- Show an explicit title "Sign in or create an account" in the account card.

**Expected next evidence:** re-run the same Chromium acceptance tests (GREEN). The actual outcome is not yet claimed in this entry. Real Google OAuth and data isolation require separate testing.

---

## GREEN: repeated real browser tests passed — 13 October 2026

The original tests were not edited to make the failure go away. Following the UI correction, GitHub Actions **38377362037** executed Chromium and reported **3/3 PASS**:
1. Desktop initial screen exposes "Sign in"; clicking shows Google and email/password.
2. 390px mobile initial screen exposes Sign in inside viewport; clicking shows auth methods.
3. Existing My learning route still exposes the original account controls.

The previous **38376988433** (2/2 FAIL) remains preserved as baseline defect evidence. The corrected source commit is `898b72b76ba720c6403ec30e114fa5351648a2c7`. Full standard CI **38377362015** also passed (source-data tests, TypeScript and Next.js build). A distinct Vercel Preview deployment for that commit was READY.

**Not proven by these results:** successful third-party Google round-trip, same-account progress surviving sign-out/re-login, absence of cross-account leakage, or unrestricted public access. These need real accounts and external redirect configuration.

**Corrected methodology interpretation:** SDD did create a source implementation of the stated FR-012/FR-013, but the original acceptance criteria missed discoverability, and CI lacked E2E browser coverage. After stakeholder feedback, the specification gained CR-SDD-02 and the implementation gained an accessible entry point. That is a legitimate SDD convergence cycle, not a flawless first attempt.
