# Requirement Clarification — Nordljud Classroom

**Step:** Spec Kit `clarify` quality gate, conducted before technical planning. **Date:** 2026-10-13.
**Basis:** Existing learner-approved product brief and original shared datasets. The user delegated choices; items below are **agent decisions**, not verbatim user answers.

| ID | Ambiguity raised in spec | Resolution and evidence | Impact |
|---|---|---|---|
| CL-01 | Does “456 verbs” mean 456 unique spelled lemmas? | No. Frozen input contains 456 **sense records** at each level, 455 unique spellings. `sticka` occurs twice with different meanings and present forms. | Sense identity must include both lemma and supplied meaning; display exact source record count. |
| CL-02 | How many full lesson missions? | Exactly one representative per A2/B1/B2/C1, sourced from `mission-seeds.json` (four total). | Not 456 fully authored lessons. |
| CL-03 | Are undefined Swedish forms to be completed with AI? | No. Show source data if supplied; otherwise label unavailable. | No invented Swedish examples. |
| CL-04 | Does “save progress” mean anonymous guest sync? | Guests may use local browser storage; cloud persistence belongs to authenticated account. Do not silently merge guest work on sign-in. | Clear separate guest/account messaging. |
| CL-05 | What is saved for a favorite? | Favorite **sense record**; two `sticka` meanings remain distinct across levels. | Stable composite ID `lemma + meaning` (or equivalent). |
| CL-06 | How to handle Google OAuth before provider/admin config? | Client shall initiate provider flow, surface errors and document callback/allowed redirects. Never claim a working OAuth integration before an actual user test. | External integration blocker, no hardcoded credentials. |
| CL-07 | Could users overwrite other applications using the same `learner_states` table? | Persist within a Condition C-specific JSONB state key and preserve other existing keys. | Namespaced payload, per-user RLS. |
| CL-08 | Is this a startup-ready public product? | No. User explicitly postponed monetization and thousand-user engineering until after course completion. | No payment, analytics or scaling work. |
| CL-09 | What does success of test automation prove? | Passing CI proves supplied test scenarios, static type checking and build only; it does not prove OAuth, speech on all browsers, or user data isolation in vivo. | Annotate black-box test limitations. |
| CL-10 | Should SDD reuse implementations from earlier branches? | Absolutely not. Freeze same shared educational input; write SDD source independently from the feature spec and technical plan. | No import/copy of A/B implementation files. |

## Open External Items

- **EX-01:** Supabase Google provider must accept the SDD preview origin; its URL allowlist is an owner's dashboard choice. Until tested, F02/F09/F10 remain unverified.
- **EX-02:** Availability of a Swedish OS browser voice is device dependent.
- **EX-03:** Swedish language content's teacher validation is outside the classroom MVP.

## Gate Outcome

**CLARIFIED for planning**, subject to external configuration and explicit reporting of the unresolved real-user checks. No requirement is silently weakened or attributed to a nonexistent stakeholder interview.
