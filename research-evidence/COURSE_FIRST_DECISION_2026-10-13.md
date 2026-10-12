# Course-first decision — 13 October 2026

The learner explicitly decided to **postpone commercial startup work and thousand-user readiness** until after passing the Software Construction course.

## In scope now

- A meaningful, comparable classroom Nordljud MVP across three development workflows
- Shared Swedish educational content (456 verbs across A2, B1, B2 and C1)
- Four representative missions, one per level
- Optional Explore / Verb Library, Google and email login, personal progress and favorites as documented in `SCOPE_CHANGE_01.md`
- Honest code history, human observations, defects, screenshots, test evidence and comparative report

## Out of scope until after the course

- Thousand-user load engineering, production scalability, payment/subscriptions, commercial SLAs, monetization, growth tooling and enterprise-grade administration
- Large-scale curriculum writing or exhaustive language teacher review beyond clearly disclosed limitations
- Unrequested expansion of requirements for any one condition

## Condition A checkpoint

A read-only snapshot branch **`checkpoint/vibe-2026-10-13`** captures Condition A's then-current source. **The Vibe implementation itself is not changed by creating this checkpoint.**

Confirmed evidence:
- READY Vercel preview deployment with an interface and A2 mission photographed by the learner.
- Browser Swedish speech initially failed; learner later reported it working.
- Explore selected-verb inconsistency was found by learner, traced to `setSelectedVerb("arbeta")` and corrected.
- Google OAuth initially disabled in Supabase. User subsequently reported enabling it successfully after setting Google Cloud credentials and Supabase provider settings. **Independent end-to-end signed-in verification not yet recorded.**
- Multiple Next.js builds deployed as READY.

**Not independently verified:** final interactive acceptance tests F01–F14, cross-user data isolation, browser reload retention, CI test execution results, or Google login across accounts. Do not mark them PASS without evidence.

**Fair-comparison warning:** Condition A expanded in scope during implementation. Later conditions receive the same expanded product brief as a dated addendum, and the study must disclose this order and learning effect. Condition A's elapsed wall-clock time was not reliably captured; do not invent timing.

## Next steps

1. Begin **Condition B — God Mode** independently from original common `baseline-v1`, without reusing A implementation code.
2. Begin **Condition C — Spec Kit / Specification-Driven Development** independently from `baseline-v1`.
3. Apply common evaluation criteria; record limitations; prepare required Vibe vs SDD-focused university experience report, with God Mode as supplemental comparison.
4. Only after course completion consider merging lessons into a separate `product/` branch.
