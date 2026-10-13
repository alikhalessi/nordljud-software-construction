# Real Browser Screenshots — Downloadable Evidence Index

**Captured:** 14 October 2026 (Finnish date; CI 13 October 23:33 UTC).  
**Workflow:** https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38484891437  
**Source:** Separate unchanged checkout of each branch; browser screenshots were made by the independent Chromium/Playwright guest evaluator, **not** generated images or reconstructed mockups.

## How to retrieve the screenshot artifacts

1. Sign in to GitHub with access to the private course repository.
2. Open [Actions run 38484891437](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38484891437).
3. Under the **Artifacts** section download each of the following ZIP archives.
4. Extract the `test-results` files. Each method has actual **A2 mission** and **second `sticka` sense after selection** screenshots. Vibe's artifact also has a failure trace archive.
5. Add selected images to the university report after reviewing them, and caption each with branch, guest browser, test ID and screenshot date.

| GitHub Actions artifact | ID | Approximate archive size | Expiration (UTC) |
|---|---|---|---|
| `playwright-Vibe` | 11858943598 | 2.1 MB | 12 Nov 2026 23:33 |
| `playwright-God_Mode` | 11859475169 | 0.59 MB | 12 Nov 2026 23:33 |
| `playwright-SDD` | 11857439924 | 0.73 MB | 12 Nov 2026 23:33 |

**Important:** GitHub Action artifacts are temporary (30-day retention), not automatically embedded in GitHub Markdown. Download or archive them before expiration. These are not sandbox links and no permanent external public URL is invented.

## What these screenshots actually prove

- Each app rendered a guest A2 mission screen in Chromium running locally from its own frozen branch.
- The separate `sticka` screenshot shows the **right-side detail pane after the second sense is selected**.
- Vibe's screenshot captures the observable mismatch: the detail pane still shows *knit* although the second source entry is *sting/prick/leave*. The corresponding Playwright test FAIL and trace support the interpretation.
- God Mode and SDD screenshots accompany browser PASS assertions for the second sense. They are stronger when interpreted together with the CI logs, not as standalone independent semantic correctness proof.

## What they do NOT prove

These screenshots are taken as unauthenticated **guest UI** only. They do **not** prove Google sign-in, real account persistence, two-user row-level security, audio output from a learner's OS, invalid password handling, smartphone hardware performance or all F01–F14 criteria.

Separate student-reported real OAuth and two-account acceptance is documented in `evaluation/SDD_USER_ACCEPTANCE_2026-10-13.md`, without including account names, login codes or private user screenshots.

## Relevant independent runs

- [Guest Chromium 2-test run with screenshot evidence](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38484891437)
- [Independent source/type/build matrix](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38483644760)
- [Vibe `sticka` defect report](./DEFECT_VIBE_HOMOGRAPH_2026-10-14.md)
- [Evidence-graded F01–F14 comparison](./COMPARATIVE_ACCEPTANCE_MATRIX_2026-10-14.md)

**Preservation rule:** Do not retouch a failure screenshot to make an experiment look better. Use the same visual evidence and same test logic for all three methods.


---

## Latest extended screenshot set — 14 October 2026 (30-day retention)

The earlier 2-test screenshot archive above remains reproducible. The **newest** independent 3-test run is [GitHub Actions 38485026386](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38485026386). Download its three artifacts, which now additionally contain an **A2 exercise-completion screenshot** in each method's `test-results` output directory:

| ZIP artifact | Artifact ID | Approximate size | Expiration UTC |
|---|---:|---:|---|
| `playwright-Vibe` | 11859415631 | 2.55 MB | 12 Nov 2026 23:35 |
| `playwright-God_Mode` | 11860070225 | 0.91 MB | 12 Nov 2026 23:35 |
| `playwright-SDD` | 11859011659 | 1.12 MB | 12 Nov 2026 23:35 |

The repeated browser outcomes are Vibe **2/3**, God Mode **3/3**, SDD **3/3**; the failed Vibe detail screenshot is retained in its ZIP. These captures are real **guest** local-browser displays (not actual live Google account sessions), and must be labeled as such when used in the report. Download before their expiry; screenshots were not copied permanently into the repository.
