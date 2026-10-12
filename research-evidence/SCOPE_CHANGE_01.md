# Change Request 01 — Verb Explorer and account access

**Source:** User feedback after visually testing Condition A's first deployed application, 12–13 October 2026.

## User-requested adjustment

The learner asked to restore the standalone historical Verb Library across the **456 unique Swedish verbs**, switch example sentence levels A2/B1/B2/C1, and include **email/password signup and Google one-click login**, explicitly asking not to forget both methods. The agent proposed **Today (Missions)**, **Explore (Verb Library)**, and **My Learning (Progress/Favorites)**. The user explicitly agreed.

## Scope added to the common product target

- Browse and search all 456 unique verbs, including Swedish forms or English equivalents.
- Switch sentence difficulty A2, B1, B2 and C1.
- Display Infinitive, Imperative, Present, Preterite and Supine when provided by the recovered educational datasets; do not fabricate unavailable examples.
- Swedish browser speech playback, English translation controls, favorites, and a distinct My Learning page.
- Email/password registration and login, **Google OAuth login**, sign-out, per-user saved progress and favorites.

## Experimental integrity

**Change was requested after Condition A started.** Do not falsify the original baseline or rewrite the original experiment goals retroactively. This file is on the **coordinating main branch**, not injected into method-specific branches' original snapshot.

Before Conditions B and C begin, provide the full adjusted user request verbatim as an additional **common, timestamped product change**. Record A's interruption and additional development time as part of A. Either apply the new acceptance tests equally to all three implementations, or report original-scope and expanded-scope comparisons as separate results. The resulting three runs are **not a perfectly controlled experiment**; reflect order effects and timing of the requirements change.

## Status

- Condition A: Implementation attempted in `condition/vibe`; subsequent production build, browser usability and sign-in still require evidence.
- Conditions B and C: Not started.
- Existing code from A must **not** be reused in B or C.

The shared educational dataset remains unchanged and traceable to previous historical Nordlyd assets.
