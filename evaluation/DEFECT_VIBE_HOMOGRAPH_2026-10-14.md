# Independent Cross-Method Browser Finding — Vibe Homograph Selection

**Observed:** 14 October 2026 (Finnish date; CI UTC 13 October 23:25)  
**Preserved baseline:** Vibe `c4e610e87943e8ac2ae7b23b00bcdf960ee68b30`  
**Evaluator:** coordinating main's independent Chromium/Playwright guest suite, not a method-specific test.  
**Initial evidence:** https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38484033148  
**Tester credentials:** none. All tests run with the method-specific branch checked out separately at localhost in a GitHub-hosted runner, without changing application code.

## Actual observed outcomes

| Method | F03/F04 mission navigation: A2,B1,B2,C1 and Swedish example visible | G03 independently selectable `sticka` senses | Result |
|---|---|---|---|
| Vibe | **PASS** | **FAIL** | 1/2 passed |
| God Mode | **PASS** | **PASS** | 2/2 passed |
| SDD | **PASS** | **PASS** | 2/2 passed |

These are two specific independent **guest browser tests**, not a proof that F01–F14 all passed.

## Exact reproducible Vibe failure

The evaluator opened the Vibe verb library, searched `sticka`, found both entries (`knit` and `sting, prick; to leave (colloquial)`), selected the **knitting** entry, then selected the **stinging/leaving** entry. The right-side detail pane **continued showing** the knitting sense instead of the selected second sense.

Playwright Chromium's actual assertion:

```text
Locator: locator('.verb-heading p')
Expected substring: "sting"
Received string: "knit"
```

The independent test passed all four mission-level selection checks and the first half of the homograph test. The failure is therefore not a server not starting, missing content or invalid generic UI selector. Preserve raw CI logs and the failure trace artifact for submission.

## Why this happened — inspectable application code

Vibe `app/verb-explorer.tsx` stores `selectedVerb` as the **spelling alone**, initializes the selection to `arbeta`, sets `setSelectedVerb(entry.v)` on result clicks, and uses `key={entry.v}` for React result rows. Selecting either `sticka` record therefore sets the same value. The detail pane resolves by spelling, apparently displaying the first matching record, so the second meaning cannot reliably be chosen. Favorites are also keyed only by spelling, not meaning; the app thus cannot faithfully distinguish both senses in favorites (the exact favorite operation was not independently browser-tested).

This is distinct from the Vibe `npm test` issue, where the test **incorrectly asserts 456 unique written lemmas** although the frozen source has 456 **sense entries** and 455 unique spellings. Independent audit `38483644760` showed the Vibe test FAIL (7/11 pass) while its TypeScript and Next production build both PASS. Do not merge the data assertion bug with the UI identity bug.

## Comparison with B and C

- God Mode originally made the same **456=unique spelling** test assumption and failed CI. It later corrected the source test and app sense selection/favorites to use a composite sense identity, documenting a real debug/fix iteration.
- In the SDD condition, source clarification explicitly recorded 456 senses / 455 spellings, and the app's `senseKey` uses `[lemma, meaning]`, allowing two distinct `sticka` records.
- The independent Chromium test on their later inspected branch heads confirms **both meanings are selectable** in God Mode and SDD. That is direct functional evidence for this narrowly defined behavior.

**Methodology caveat:** SDD was implemented after agents/developer had already learned the homograph issue in Vibe/God Mode. The differing outcomes cannot be attributed solely to a randomized treatment effect of formal specification. SDD also had other post-release defects (login discoverability, OAuth redirect), which are preserved separately.

## Reporting and remediation discipline

**Do NOT silently patch the original Vibe experiment before assessment.** It is one of the frozen observations and a publicly shared classroom pilot. If a later non-experimental product release is desired, perform a separately dated change request:

1. Replace spelling-only selected-verb identity with an unambiguous sense ID based on source spelling and meaning, maintaining cross-level consistency.
2. Use unique React keys and favorite identifiers; design migration behavior for historic favorites saved as spelling-only values so old data is not silently misinterpreted.
3. Add a regression test for selecting both `sticka` senses.
4. Re-run Vibe CI and browser acceptance on a separate post-freeze branch.

Such maintenance must be labeled **post-experiment**; do not retroactively count it as a correct first-pass Vibe implementation. No mutation of `shared-content/`, public Vibe deployment or source code occurred in this independent evaluation.

**Evidence status:** Chromium reproduction PASS/FAIL confirmed. Cross-user account tests and speech audio on this branch were **not** part of this audit.
