# Nordljud — Three-Method Comparative Verification Matrix

**Coordinator:** `main` | **Prepared:** 14 October 2026 (Finland)  
**Purpose:** The common pre-implementation F01–F14 protocol applied to three independently committed app roots. Do **not** treat source presence, CI build, deployment READY, or a casual user comment as interchangeable evidence.

**Branches and unchanged audit snapshots:**
- **A Vibe:** `condition/vibe`, commit `c4e610e87943e8ac2ae7b23b00bcdf960ee68b30`
- **B God Mode:** `condition/god-mode`, commit `308cccf1ed559b575dd17014b459ac11ecfd233c`
- **C SDD:** `condition/spec-driven`, commit `eaa4bcfd41b907a93470271660c715ccfb5d6d3b` (documentation appended after deployed UI commit `898b72b76ba720c6403ec30e114fa5351648a2c7`)

Source code is separate in each branch; the educational input is inherited from frozen common baseline `1afd635324a788f18db19f83f338ad89ade54e33`. Compromises and post-baseline expanded scope are recorded separately.

## Evidence legend

- **PASS [automated]** — an actual command or browser test visibly passed against named SHA; not an external live-login claim.
- **PASS [learner]** — the student's reported manual success; no invented screenshots or account-specific records.
- **PARTIAL** — portion of compound test confirmed, remaining cases not demonstrated.
- **FAIL** — explicit documented failure in the tested snapshot; failures remain in the record even if later corrected.
- **NOT TESTED** — no actual evidence; implementation code *may* exist but that is not a completed functional test.
- **PENDING** — a scheduled/started independent check with outcome not yet reported when this document was created.

**Important:** F01–F14 combines source, security and human-interface concerns. Part of a test may pass in code/CI while the black-box scenario is still NOT TESTED.

## Original protocol F01–F14 (evidence current to this draft)

| ID | Test | A: Vibe | B: God Mode | C: SDD |
|---|---|---|---|---|
| F01 | Email/password account registration | NOT TESTED (source implemented) | NOT TESTED (source implemented) | NOT TESTED (source implemented) |
| F02 | Sign in/reload/sign out; invalid credentials rejected | PARTIAL: Google login reportedly working; invalid password untested | NOT TESTED: separate God login not confirmed | PARTIAL: Google sign-out/re-login confirmed [learner], invalid credentials untested |
| F03 | Four visible levels A2–C1 | PASS [Chromium guest audit] — A2/B1/B2/C1 level buttons | PASS [Chromium guest audit] | PASS [Chromium guest audit] |
| F04 | Four correct seeded missions | PASS [Chromium guest audit] + original checks of four seed targets | PASS [Chromium guest audit] + source tests | PASS [Chromium guest audit] + source tests |
| F05 | Source Swedish and English examples match | PARTIAL: Swedish examples visible in guest Chromium; exact translations not compared | PARTIAL: Swedish examples visible in guest Chromium; exact translations not compared | PARTIAL: Swedish examples visible in guest Chromium; exact translations not compared |
| F06 | Swedish speech or graceful fallback | PASS [learner, historical Vibe feedback]; not audited on multiple devices | NOT TESTED on learner device | NOT TESTED on learner device |
| F07 | Meaning/comprehension correctness feedback | PARTIAL: correct-answer completion PASS in guest Chromium; incorrect feedback not asserted | PARTIAL: same | PARTIAL: same |
| F08 | Verb-form correctness feedback | PARTIAL: correct-answer completion PASS in guest Chromium; incorrect feedback not asserted | PARTIAL: same | PARTIAL: same |
| F09 | Partial/full progress persists after reload/re-login | NOT TESTED as exact compound test | NOT TESTED as exact compound test | PARTIAL: *some* stored learning information retained [learner], exact partial/full markers unspecified |
| F10 | Account A cannot read/change B's progress | NOT TESTED through two accounts | NOT TESTED through two accounts | PASS [learner-reported two-account scenario]; PostgreSQL RLS policy independently inspected; no adversarial API test |
| F11 | Desktop and mobile mission usability | NOT TESTED full viewport mission | NOT TESTED full viewport mission | PARTIAL: 390px mobile Sign in is tested in Chromium, not full mission |
| F12 | App builds, runnable; deployment separate | **PASS TypeScript and Next build** [independent audit]; **FAIL 4/11 source tests** due false 456-unique assertion; production Vercel previously READY | PASS TypeScript, 3/3 source tests and Next build [independent audit], Vercel READY | PASS TypeScript, 4/4 source tests and Next build [independent audit], Vercel READY |
| F13 | Missing source examples marked unavailable, not invented | Implementation code present; no browser check | Implementation code present; no browser check | Test of missing corpus content PASS; browser behavior not tested |
| F14 | No private service-role secret committed or embedded | Browser-only public key documented; a full repository secret scan not run | Browser-only public key documented; a full repository secret scan not run | Browser-only public key documented; a full repository secret scan not run |

### Expanded-scope checks (added after A began; not in frozen original)

| ID | Expanded behavior | Vibe | God Mode | SDD |
|---|---|---|---|---|
| G01 | Google OAuth returns signed in to actual deployment | PASS [learner] after external provider setup | NOT TESTED on separate God Mode origin | PASS [learner] after correcting Supabase redirect allowlist |
| G02 | Favorites independently persist after reload/re-login | NOT TESTED as exact separate scenario | NOT TESTED as exact separate scenario | NOT TESTED as exact separate scenario; user's aggregate “stored data remains” is insufficient |
| G03 | Two meanings of `sticka` independently selectable/favoritable | **FAIL [Chromium]:** selecting the second `sticka` sense leaves detail meaning on `knit`; spelling-only keys confirmed in source | **PASS [Chromium]** composite `senseId` selects both `sticka` meanings | **PASS [Chromium]** composite `senseKey` selects both `sticka` meanings |
| G04 | Auth entry point findable from initial screen | Explicit Sign in code in Vibe; detailed guest-browser test not run | Explicit Sign in code in God Mode; detailed guest-browser test not run | **Initial FAIL** (Chromium RED 2/2); **post-fix PASS** (Chromium GREEN 3/3) |
| G05 | Account progress namespace isolation between experiments | Unique namespace coded; no cross-app concurrency test | Unique namespace coded; no cross-app concurrency test | Unique namespace coded; no cross-app concurrency test |

## Actual independent automated audit — existing implementations, no source modifications

**GitHub Actions:** https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38483644760

| Method | Source tests | TypeScript | Next.js production build | Exact method SHA |
|---|---|---|---|---|
| Vibe | **FAIL** 7 PASS / 4 FAIL (false unique-lemma assertion) | **PASS** | **PASS** | `c4e610e87943e8ac2ae7b23b00bcdf960ee68b30` |
| God Mode | **PASS** 3/3 | **PASS** | **PASS** | `308cccf1ed559b575dd17014b459ac11ecfd233c` |
| SDD | **PASS** 4/4 | **PASS** | **PASS** | `eaa4bcfd41b907a93470271660c715ccfb5d6d3b` |

The original Vibe action was blocked by its test before reaching TypeScript or build, but this independent workflow deliberately continued after the FAILED test to measure both subsequent stages. Its **GitHub overall workflow is green by design** due `continue-on-error`; use the above **per-step actual outcomes**, not the green overall status to claim Vibe tests passed.

**A/B false assertion:** There are 456 sense records **per level** but only 455 unique written lemmas; `sticka` has knitting (`stickar`) and stinging/leaving (`sticker`) senses. God Mode identified/repaired the issue after CI failure; Vibe's frozen source test still asserts 456 uniquely spelled lemmas; SDD specified correct sense-based identity before implementation. Do **not** alter frozen input datasets or change original research snapshots to hide errors.

## Independent guest-browser cross-method audit

**Workflow:** `.github/workflows/independent-guest-browser-audit.yml`, running local versions of all three original branches, no credentials, with two original guest checks per method:
1. F03/F04/F05: A2 `arbeta`, B1 `förklara`, B2 `föreslå`, C1 `påverka`; source Swedish examples visible.
2. G03: both `sticka` meanings independently selectable and reflected in detail pane.

**Actual result:** GitHub Actions run [38484033148](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38484033148) executed real Chromium on the isolated original branches:

| Method | F03/F04 guest mission targets + visible Swedish sentence | G03 two independently selectable `sticka` senses | Actual tests passed |
|---|---|---|---|
| Vibe | **PASS** | **FAIL** (second sense displays `knit`, expected `sting`) | **1/2** |
| God Mode | **PASS** | **PASS** | **2/2** |
| SDD | **PASS** | **PASS** | **2/2** |

**Exact Vibe browser assertion:** `locator('.verb-heading p')` expected substring `"sting"`, received `"knit"`, after selecting the second of two visible `sticka` entries. See [independent defect analysis](./DEFECT_VIBE_HOMOGRAPH_2026-10-14.md). The evaluator has a small *workflow summary shell-quoting* issue (literal backticks were treated as command substitution) that did **not** affect the Chromium tests. An otherwise identical summary-quoting correction rerun was started; distinguish any automation infrastructure noise from actual application test failures.

## User acceptance, verified database policy and method validity

- The learner confirmed initial Vibe public app worked and its Google sign-in functioned after setup. This is *not* evidence of full F01–F14.
- The learner confirmed SDD Google OAuth recovered from its earlier localhost redirect, and that saved information was restored after sign-out/re-login. In a following reply to a specifically requested two-account test, they reported it worked very well. Classify two-account result as **student-reported**; exact screenshots, browser/device, intermediate step records and adversarial attack checks were not supplied.
- On 14 October a read-only Supabase SQL inspection confirmed `public.learner_states` has RLS **enabled** and SELECT/INSERT/UPDATE/DELETE policies for authenticated users require `auth.uid()=user_id`. This supports, but does not prove, comprehensive data isolation in a deployed multi-account system.
- God Mode's separate Google flow has not been reported successful. Treat its source-level auth implementation as *not yet manually validated*.
- A→B→C order and requirement expansion after A, plus later agent exposure to A/B defects, mean this is not randomized nor fully independent reasoning. The technical code bases are separate; developer/AI learning effects remain.
- The SDD scaffold really used the official Spec Kit CLI v1.1.3. The assistant wrote the constitution/spec/plan/tasks following template-based stages; a separate Copilot slash-command execution of every stage is **not** established. Disclose this in conclusions.
- Source tests are **not equivalent numbers**: Vibe has 11 data checks, God Mode has 3, SDD has 4. Fractions alone are not comparable quality scores.
- No reliable experimental end-to-end wall-clock effort instrumentation exists; do not invent a speed ranking.

## Remaining minimum course submission evidence

1. Finalize independent guest-browser results, retaining any fails and exact SHAs.
2. Obtain genuine screenshots of each live UI for course visuals, hiding account details; currently not collected via the connected tools.
3. Run any remaining manual F01/F02/F06/F07/F08/F09/F11/F13 cases if feasible; otherwise mark NOT TESTED and discuss the limitation.
4. Confirm current official Moodle rubric and course-specific AI-use policy before final submission. This file uses the learner-provided rubric correspondence, not a fresh Moodle lookup.
5. Update the report's executive summary and seven required sections with **actual observations**, not an unsupported “SDD always wins” narrative.


---

## Extended shared guest browser evaluation — 14 October 2026

The *same unchanged-source* Playwright evaluator was expanded with a third functional test. The added case starts in guest mode, selects correct answers to **both** A2 exercise groups (trying the available answer options until a completed state is reached), then reloads the page and verifies **both completion states remain disabled/completed** in the same browser. It **does not verify a separate wrong-answer message or real authenticated cloud persistence**. This is an independent test of the correct-answer guest flow and guest local storage only.

[CI run 38485026386](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38485026386) completed with the following **actual per-test** outcomes:

| Browser scenario | Vibe | God Mode | SDD |
|---|---|---|---|
| Four CEFR missions and visible Swedish examples | **PASS** | **PASS** | **PASS** |
| Independent second `sticka` meaning | **FAIL** (detail stayed `knit`) | **PASS** | **PASS** |
| Both A2 quiz groups completed and remained completed after a guest reload | **PASS** | **PASS** | **PASS** |
| **Total same three checks** | **2/3** | **3/3** | **3/3** |

GitHub's overall workflow outcome is green because **the browser-test step deliberately continues after an assertion failure** to archive evidence from all conditions. **Never claim the Vibe guest suite passed**; its own logs report `RESULT: failure`. These outcomes reinforce a narrowly scoped difference in sense identity, not a general ranking of reliability, code maintainability or teaching quality.

The run also attaches **real, unauthenticated screenshots** of A2 missions, chosen `sticka` details, and completed A2 exercises for each implementation. See [Screenshot Evidence Index](./SCREENSHOT_EVIDENCE_INDEX_2026-10-14.md). No user accounts, credentials or personal progress were accessed by this automated evaluator.
