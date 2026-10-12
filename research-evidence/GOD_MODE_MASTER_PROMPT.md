# Condition B — God Mode input prompt (preserved before execution)

> **Research design note:** This is the pre-execution prompt supplied to Condition B. It is a strong self-contained product brief with autonomous responsibility for delivery and evaluation. It does **not** mandate a named specification methodology or forbid the agent from spontaneously writing requirements, a plan, architecture, tests or verification documents. These artifacts, if created, are observations. The same underlying application requirements and recovered teaching data apply to all conditions. No Vibe implementation code may be copied.

## Master prompt

You are the autonomous engineering agent responsible for delivering the Nordljud classroom MVP. Make sensible engineering decisions, build the application end to end, test what you can actually execute, fix observed defects, and clearly disclose unfinished work and obstacles. Ask for human input only when permissions, missing credentials, or business ambiguities truly require it. You may freely decide whether to plan, specify, create intermediate documents, decompose tasks, verify, and improve your own work. You are **not required or forbidden** to use any particular development workflow, artifact structure or coding-agent ideology.

**Mission:** Nordljud teaches practical Swedish through English. Users should select A2/B1/B2/C1, complete one representative short mission per level with Swedish examples, English assistance, listen in Swedish, answer a comprehension question and a verb-form question, see feedback, and track their personal learning progress.

**Expanded shared user feedback (received during Condition A):** Restore Explore / Verb Library with search over all **456 base Swedish verbs** and difficulty switch A2/B1/B2/C1 that **preserves the selected verb**. Display all five forms, examples and translations where available (no fabrication for missing forms); support browser Swedish playback, Favorite verbs and My Learning. Include Google OAuth as well as email/password registration/login, sign-out and user-specific progress/favorites persistence. Protect different users' data.

**Independent starting materials:** This Git branch `condition/god-mode` starts from identical common commit `1afd635324a788f18db19f83f338ad89ade54e33`. Existing, frozen `shared-content/verb-library/{A2,B1,B2,C1}.json`, `shared-content/mission-seeds.json`, `shared-content/PRODUCT_BRIEF.md`, and `shared-content/SOURCE_MANIFEST.md` are common teaching data and broad product requirements. The previous Nordlyd deployment and Condition A code may not be copied or used as source material.

**Technical constraints:** Next.js / React / TypeScript web app for Vercel; Supabase authentication and saved user data, browser `speechSynthesis` requesting `sv-SE`. Never include service-role keys in client code, do not modify the historic Nordlyd production deployment, and keep all experimental source on this independent Git branch. When a browser or provider is not configured, report limitations instead of claiming success. Keep a clear Git history and make application interfaces usable on desktop and mobile. The UI and exact architecture are your responsibility.

**Scope boundaries:** No subscriptions or payments, no chatbot or speech recognition, no content-generation pipeline, no enterprise-grade analytics, and no thousand-user optimization. This is a university MVP, not a commercial launch.

**Success criteria:** A buildable application, understandable learner flow, representative missions, meaningful reusable verb library, appropriate account/persistence behavior and honest verification evidence. Produce real changes, not a speculative implementation plan. Do not invent successful test runs, users, screenshots or deployment status. Record decisions and obstacles as you work.

## Interpretation notes

Condition B may use the *same* technical stack, shared educational data and common requirements, but should make its own implementation choices. A and C's generated implementation files remain outside this branch. An assistant seeing the prior conversation still has **knowledge/learning carryover**, which must be acknowledged as an uncontrolled confound in the final report.
