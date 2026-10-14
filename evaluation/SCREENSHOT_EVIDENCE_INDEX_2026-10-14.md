# Real Nordljud Browser Screenshots — Permanent Evidence

**Nine verified PNG images committed to GitHub**, sourced directly from the independent Chromium/Playwright evaluator. They were **not generated, recreated, retouched or converted from a visual mockup**.

- Original run: [GitHub Actions 38485026386](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38485026386), testing all three method branches as guests.
- Verified archival run: [GitHub Actions 38491787132](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38491787132), which downloaded the original artifact ZIP contents, checked the original PNG signatures, and committed exactly **nine** images.
- Permanent source directory: [evaluation/screenshots/](./screenshots/), including original capture provenance.
- Images are in the **private** course repository: the instructor needs repository access to see them. The earlier CI ZIPs can expire; the Git-committed copies do not share that CI artifact expiration.

## A2 classroom mission screenshots

| Method | Permanent original PNG | Source |
|---|---|---|
| Vibe | [vibe-a2-mission.png](./screenshots/vibe-a2-mission.png) | A source branch `condition/vibe` |
| God Mode | [god-mode-a2-mission.png](./screenshots/god-mode-a2-mission.png) | B source branch `condition/god-mode` |
| SDD | [sdd-a2-mission.png](./screenshots/sdd-a2-mission.png) | C source branch `condition/spec-driven` |

## Second meaning of the Swedish homograph `sticka`

| Method | Permanent original PNG | Actual independently asserted result |
|---|---|---|
| Vibe | [vibe-sticka-second-sense.png](./screenshots/vibe-sticka-second-sense.png) | **FAIL:** after selecting the second (`sting`) source row, detail pane still said `knit`. |
| God Mode | [god-mode-sticka-second-sense.png](./screenshots/god-mode-sticka-second-sense.png) | **PASS:** displayed the selected second meaning. |
| SDD | [sdd-sticka-second-sense.png](./screenshots/sdd-sticka-second-sense.png) | **PASS:** displayed the selected second meaning. |

## Both A2 question groups completed as a guest

| Method | Permanent original PNG | Actual independent result |
|---|---|---|
| Vibe | [vibe-guest-a2-exercises-complete.png](./screenshots/vibe-guest-a2-exercises-complete.png) | PASS; completion remained after browser reload. |
| God Mode | [god-mode-guest-a2-exercises-complete.png](./screenshots/god-mode-guest-a2-exercises-complete.png) | PASS; completion remained after browser reload. |
| SDD | [sdd-guest-a2-exercises-complete.png](./screenshots/sdd-guest-a2-exercises-complete.png) | PASS; completion remained after browser reload. |

### What the images can and cannot support

The images show **unauthenticated guest application displays** from actual locally running frozen branch code in Chromium. They do **not** prove Google sign-in, email/password registration, authenticated cloud persistence, two-account security or actual Swedish voice/audio output on a learner's machine. CI log assertions and an explicit student-reported manual acceptance are distinct kinds of evidence; neither should be represented as the other.

For report export, include actual PNG bytes and descriptive captions rather than Mermaid/HTML source alone. For reproducibility, link both the immutable Git image and its original workflow run.

**User privacy:** the browser jobs did not authenticate, and the screenshot artifacts were generated without entering real Google accounts or exposing access tokens.
