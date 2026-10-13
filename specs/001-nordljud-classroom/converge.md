# Nordljud SDD — Convergence Audit

**Audit date:** 2026-10-13  
**Method:** Official GitHub Spec Kit v1.1.3 CLI scaffold + assistant-authored gated SDD documents and independent implementation.  
**Condition branch:** `condition/spec-driven`, initially created at shared baseline commit `1afd635324a788f18db19f83f338ad89ade54e33`.

## Verification performed

| Gate | Evidence | Result |
|---|---|---|
| Real Spec Kit CLI initialized | GitHub Actions `38319369671` successfully ran `specify-cli==1.1.3 specify init --here --force --non-interactive --integration copilot --ignore-agent-tools --script sh` | **PASS** |
| Constitution + prioritized functional specification before code | `.specify/memory/constitution.md`; `spec.md`; ten clarifications; technical plan, domain contract, 20 tracked tasks and `analyze.md` committed before `package.json` and program source | **PASS** |
| Shared input consistency | CI tested 456 source records per level / 455 unique spellings; `sticka` has two inflections | **PASS, 4 tests** |
| Four mission seeds and unchanged examples | CI seed invariants, source tests | **PASS** |
| Strict TypeScript compilation | GitHub Actions `38320127745`, step `TypeScript strict check` | **PASS** |
| Optimized production build | Same run, step `Production build` | **PASS** |
| Real browser layout and interactions | No SDD live deployment yet | **NOT TESTED** |
| Google OAuth on SDD origin | App integration code exists; separate SDD preview URL not deployed or allowlisted | **NOT TESTED** |
| User-specific state restored on actual sign-out/in | Code implemented using `nordljud_sdd_v1` JSONB namespace and Supabase RLS | **NOT TESTED** |
| Two signed-in users see only personal data | Existing Supabase RLS policies verified externally; no two-person black-box test on SDD yet | **NOT TESTED** |
| Swedish voices on real learner devices | Browser `speechSynthesis` implementation present; no SDD browser run | **NOT TESTED** |
| Public/preview hosting | Vercel project `nordljud-sdd-lab` created and public Preview Supabase variables configured | **BLOCKED** |

## Deployment blocker

An explicit Vercel API deployment request for `nordljud-sdd-lab` returned HTTP **402 payment_required**, code `api-deployments-free-per-day`, reporting a **100 API deployments per rolling day** free-plan limit and an estimated 24-hour retry. This is **not** a Next.js compile error. Do not automatically upgrade or pay, do not confuse a created Vercel project with a successfully hosted app, and do not invent a URL.

The user can continue code inspection and CI tests while this external quota is exhausted. Retry once permitted and then do manual F01–F14 verification using the same checklist as other methods.

## Requirement-to-result classification

- **Source-and-build verified**: FR-001–FR-003 basic source structure, FR-008 source counts/sense identity, FR-009 content-level identity invariant, FR-010 missing examples, FR-019 public-only client credentials (manual code inspection), FR-020 independent source branch.
- **Implemented, live behavior unverified**: FR-004–FR-007 (translation/audio/questions); FR-011 (favorites); FR-012–FR-013 (account/Google); FR-014–FR-016 (private persistence); FR-017–FR-018 (error UX/mobile responsiveness).
- **No requirement removed** to make a build green.

## Convergence verdict

**PARTIAL / NOT YET CONVERGED.** The code passes 4 source invariants, strict type checks and Next production build, but real browser acceptance and OAuth/account persistence are incomplete because deployment was blocked by a provider quota. “Successful CI” and “successful user acceptance” must remain distinct statements.

## Traceability / future verification

After Vercel quota resets:
1. Deploy `condition/spec-driven` to `nordljud-sdd-lab` Preview. Keep public Vibe `https://nordljud.vercel.app` untouched.
2. In Supabase Authentication URL Configuration allow the specific SDD Preview origin for OAuth. Never expose client secret.
3. Ask learner to test all four study levels, both `sticka` meanings and mobile/audio controls.
4. Test account sign-in with two different identities and check persistence and isolation.
5. Attach real screenshots/logs, update tests table and this verdict without retroactively hiding failures.

**Research limitations:** single developer and app; condition order A→B→C, known defect carryover, differing code construction and deployment conditions; not a controlled randomized comparison. Exact elapsed times were not instrumented and must not be invented.


---

## Post-audit update — 13 October 2026, 12:14+03:00 and later (Finland)

**Vercel quota blocker RESOLVED for deployment.** After the earlier HTTP 402, a new explicit deployment targeting `condition/spec-driven` at commit `01281282400d6d441e29535b192a82f8ff4f72d1` succeeded and Vercel reported **READY** for deployment `dpl_7vZHDamMkLLkLYBiaHr4H18dZuVy`, URL `https://nordljud-sdd-lab.vercel.app` (alias). The previous quota error remains authentic historical evidence; it is no longer the current publication blocker.

**Changed verdict:** SDD is now **built and deployed**, but **PARTIAL / NOT YET FUNCTIONALLY CONVERGED** because authenticated Google roundtrip, browser audio and two-user per-account persistence/isolation are still untested on this deployment. The SDD site is a Vercel Preview/test deployment and may require Vercel-account authorization to open; do not automatically enable public access.

Vercel deployment protection for the experiment remains in place. A project Ignored Build Step command was also submitted to limit each Vercel project's Git deployment builds to its designated method branch; its behavior must be checked on later pushes.

**Note:** This appendix updates hosting status only; all earlier sections reflect the historical state at the time they were written, and must not be silently erased.

---

## Live user-observed OAuth failure — 13 October 2026

After landing-page login discoverability was corrected (Chromium RED 2/2 -> GREEN 3/3), the learner initiated **Continue with Google** from hosted SDD. Google displayed the account chooser, but on choosing an account the browser reached **localhost:3000**, not the hosted app.

**Current result:** `FR-013` Google OAuth live acceptance **FAIL (user-observed)**, not merely NOT TESTED. A signed-in SDD session and cloud persistence are therefore not verified.

The client requests `redirectTo: window.location.origin + "/"`, and the production Supabase public credentials are configured. Supabase's published troubleshooting identifies an absent/mismatched allowed Redirect URL as the leading cause of return to localhost (default Site URL). Its exact project setting has not yet been inspected: log this as a **strong hypothesis**, not a confirmed configuration fact.

Corrective plan: user adds `https://nordljud-sdd-lab.vercel.app/` to the project Authentication > URL Configuration > Redirect URLs. Keep all other app URLs and shared Site URL unchanged. Re-test real Google account selection, confirm return to Nordljud, complete a mission/favorite and verify persistence on re-login. See `DEFECT_002_GOOGLE_OAUTH_LOCALHOST_REDIRECT.md`. No source code patch is justified merely to work around Supabase's allowlist.


---

## User-acceptance recovery after OAuth redirect defect — 13 October 2026

The student confirmed Google login is now successful and that saved learner information persists after signing out and back in. This **supersedes the previous current-status `FR-013 FAIL`** from the earlier localhost redirect report; **FR-013 is now PASS (student-observed on one account)**. Some same-user authenticated persistence is also **PASS (student-observed)**, but F09's distinction between *partial and completed* mission flags has not been separately detailed, and favorites persistence is not explicitly confirmed. The root cause is probably the Supabase redirect allowlist, but its actual dashboard values were not read.

**Remaining convergence gates:** (a) Two separate user accounts with disjoint learning and favorites, and no leakage (F10), (b) detailed F01–F14 independent test matrix, including incorrect credentials and narrow/mobile audio, (c) evidence screenshots with private information hidden. A successful owner test does not establish two-user data isolation or independent RLS security proof.

See `DEFECT_002_GOOGLE_OAUTH_LOCALHOST_REDIRECT.md` and `main:evaluation/SDD_USER_ACCEPTANCE_2026-10-13.md`. Prior failure is intentionally preserved as the chronological outcome of that version.
