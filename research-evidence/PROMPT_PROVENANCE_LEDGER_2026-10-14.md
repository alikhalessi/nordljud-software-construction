# Nordljud — Authentic Prompt Provenance and Iteration Evidence

**Prepared 14 October 2026.** This ledger distinguishes text actually sent by the student, an agent-facing prompt written by the assistant and committed before an agent execution, and later descriptions/translated summaries. **Do not pass off assistant-written text as a verbatim student-authored prompt.**

## Authenticity categories

- **U — Verbatim user message:** exact message text is visible in the current conversation or the original Vibe log explicitly quotes it. The quote remains in its original language.
- **A — Preserved agent-facing prompt:** the text was created/preserved as an input to the agent, often written with ChatGPT. It is a real *engineering input* but **not proof the student typed those words**.
- **P — Paraphrase or translation:** describes intent from a log, not a literal student prompt. Do not print it inside quotation marks as if it were typed in English by the student.
- **M — Missing:** no reliable exact text in the evidence available to this ledger. Must not reconstruct.

## Condition A — Vibe Coding (Sections 3.1–3.3)

| Ref | Date | Class | Exact source or provenance | Expected / observed result |
|---|---|---|---|---|
| V-U01 | 12 Oct 2026 | **U** | Original utterance **“ok let's continue”**, quoted in `condition/vibe:01-vibe-coding/vibe-log.md`. | Resume the previously approved Nordljud Vibe development from the common baseline; generated Next.js scaffold and missions. This is a *continuation instruction*, not a detailed first product specification. |
| V-P02 | 12–13 Oct 2026 | **P** | Vibe log describes a user request in Persian to restore the complete library of about 456 records and support email/password plus Google OAuth. **The log explicitly labels its English description a translation**, not the original text. | Added the Verb Explorer, favorites and login. The scope-change record was created on coordinating main. |
| V-P03 | 13 Oct 2026 | **P** | Vibe log describes user's report that selecting A2→C1 reset a chosen verb and Google OAuth failed. **No exact complete user-typed message was stored in this Git file.** | Removed forced `setSelectedVerb("arbeta")`, preserved navigation context, added auth status feedback; Git commits `59f38f0e2`, `4c390b72a`, `61a442bc6`. |
| V-P04 | 12 Oct 2026 | **P** | Vibe log describes Chrome Swedish speech showing a playback failure. It does **not** preserve a verbatim complete student prompt. | Updated voice initialization and missing-voice reporting; Git commit `17e32e666`. |
| V-M05 | — | **M** | A complete original, student-authored Vibe initial product prompt and all its iterative refinements could **not** be recovered verbatim from the Git logs reviewed. | **Not supplied as a quotation**. Obtain exported original chat or user-approved transcript before final rubric grading. |

**Important:** The file `condition/vibe:01-vibe-coding/vibe-log.md` is explicitly an **after-the-fact action summary**, not a complete prompt transcript. It substantiates development history but not a list of verbatim original messages.

## Condition B — God Mode comparative condition

| Ref | Class | Authentic input | Provenance and limits |
|---|---|---|---|
| G-A01 | **A** | **“You are the autonomous engineering agent responsible for delivering the Nordljud classroom MVP. Make sensible engineering decisions, build the application end to end, test what you can actually execute, fix observed defects, and clearly disclose unfinished work and obstacles.”** | Literal opening text of the preserved, agent-facing master prompt at `main:research-evidence/GOD_MODE_MASTER_PROMPT.md`. The agent-facing prompt was committed before B execution. It is an actual recorded input but **not evidence Ali typed that exact English paragraph**. |
| G-A02 | **A** | **“You may freely decide whether to plan, specify, create intermediate documents, decompose tasks, verify, and improve your own work.”** | A separate literal excerpt from the same master prompt; a design decision allowing autonomous specifications. It does not mandate Spec Kit. |
| G-M03 | **M** | The complete original conversational user message that requested execution of God Mode was not recovered as a verbatim independent prompt transcript. | Do not label the master prompt above as “the prompt I typed manually.” |

**Full contemporaneous text:** [God Mode master prompt](./GOD_MODE_MASTER_PROMPT.md) and `condition/god-mode:02-god-mode/IMPLEMENTATION_LOG.md`.

## Condition C — Explicit Spec-driven method (Section 4.5)

The **real GitHub Spec Kit CLI** was initialized by `.github/workflows/sdd-speckit-bootstrap.yml` and recorded in [Actions 38319369671](https://github.com/alikhalessi/nordljud-software-construction/actions/runs/38319369671). The command was:

```bash
uvx --from specify-cli==1.1.3 specify init --here --force --non-interactive --integration copilot --ignore-agent-tools --script sh
```

This is an executed **CLI command**, **not a student-written natural-language prompt** and **not evidence that all `/speckit-*` skills ran in Copilot**. The assistant drafted constitution/specification/clarification/plan/tasks/analyze materials using the toolkit's templates; successive stage commits and their dates are inspectable.

The user did supply *real*, post-first-release correction/validation instructions in Persian, recorded in the current conversation:

> **C-U01 — exact student message (excerpt, original Persian):** “به خاطر چی این اتفاق افتاده؟ با دقت این رو بررسی کن. این رو حتی فکر کنم ارزش داره که ما رکوردش بکنیم.”

**Purpose:** Analyze why the SDD app lacked a visible login entry and record it as a research defect. **Outcome:** dated FR-021 amendment and Playwright RED 2/2 → GREEN 3/3; see `condition/spec-driven:specs/001-nordljud-classroom/DEFECT_001_HIDDEN_LOGIN.md`.

> **C-U02 — exact student message (excerpt, original Persian):** “لوکال هاست دو نقطه سه هزار رو نشون می‌ده توی بالا. و این نشون می‌ده که کار نمی‌کنه.”

**Purpose:** Report actual Google OAuth failure after account selection. **Outcome:** documented suspected Supabase redirect allowlist issue, later corrected/verified by user; see `condition/spec-driven:specs/001-nordljud-classroom/DEFECT_002_GOOGLE_OAUTH_LOCALHOST_REDIRECT.md`.

> **C-U03 — exact student message (original Persian):** “رفیق عالی داره کار می‌کنه. کاملاً جواب داد، اطلاعات رو ذخیره می‌کنه، خارج میشی برمی‌گردی اطلاعات ذخیره شده اوکیه. حالا بگو چکار کنیم.”

**Purpose:** Human verification of successful Google login and same-user persistence after correction. **Outcome:** recorded as **student-observed** acceptance in `main:evaluation/SDD_USER_ACCEPTANCE_2026-10-13.md`. It does not prove all other acceptance scenarios.

**Missing original SDD prompts:** Exact user-typed original instructions to run constitution/specify/clarify/plan/tasks were **not recovered in a reliable complete transcript**. The command and engineering documents should not be reclassified as student-authored prompt text.

## Rubric-oriented prompt outcome table (truthful distinction)

| Iteration | Input type | What I expected | What actually happened | Next step |
|---|---|---|---|---|
| Vibe resume | Verbatim user continuation, V-U01 | Start building the MVP | Independent code scaffold and missions committed; browser later surfaced defects | Human trial, scope corrections, voice/auth fixes |
| Vibe expanded scope | Translated summary, V-P02 | Searchable lexicon and personal login | Explorer and OAuth handlers generated; provider setup was still external | Human Google settings and validation |
| God Mode master | Assistant-drafted agent input, G-A01/G-A02 | Autonomous complete implementation with verification | Code, notes and CI were produced; initial uniqueness assertion FAILED; later fixed | Homograph sense ID correction, repeat CI |
| SDD requirements-first | Toolkit CLI + assistant-authored artifacts | Requirements and tests should precede source | Pre-code artifacts existed, but hidden login and OAuth return were not validated initially | Explicit FR-021 and browser RED/GREEN, owner OAuth re-test |
| SDD login discoverability | Verbatim user critique, C-U01 | Visible login, explain and record defect | RED 2/2, then GREEN 3/3 in Chromium | Real OAuth callback verification |
| SDD localhost redirect | Verbatim user defect excerpt, C-U02 | Return to hosted app | localhost fallback observed; owner followed redirect guidance and reported recovery | Same-user save/relogin, two-account check |

## Final submission action

For a rubric requiring **verbatim prompts typed by the student**, additional original conversation export/messages must be provided before declaring sections 3.2 and 4.5 complete. This ledger preserves the small number of authentic direct quotes **without invention** and explicitly attributes the God Mode master prompt to an agent-facing artifact drafted using ChatGPT. I retrospectively confirmed the model/setting as **GPT-6 with High thinking effort** on 14 October 2026 (exact user message: “نسخه دقیق مدلِ استفاده‌شده GPT-6 and high level”). This is a **student-supplied identification**, not a contemporaneous independently verifiable model-picker log for each prompt. Do **not** invent such per-run captures or change the attribution of missing verbatim prompts.
