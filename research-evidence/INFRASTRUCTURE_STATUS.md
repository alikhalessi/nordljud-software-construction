# Infrastructure status — inspected before the experiment

Read-only inspection of the user's connected services, 12 October 2026.

## GitHub

Repository: `alikhalessi/nordljud-software-construction` (private).

All method branches and `baseline-v1` were verified to have **identical** initial commits, SHA:

`1afd635324a788f18db19f83f338ad89ade54e33`

Coordination and evaluation documents on `main` were added **after** branch creation to avoid exposing the finished evaluation plan inside the method-specific branch snapshots.

## Historical Vercel project

Project `nordlyd-3b`, deployment status READY, with production alias `https://nordlyd-3b.vercel.app`.

READY confirms the hosting deployment, **not** the proper operation of signup, progress sync or Swedish teaching correctness. This deployment is reference-only and is not part of any of the three new implementations.

## Existing Supabase infrastructure

An existing user project named `Nordlyd-3B` is **ACTIVE_HEALTHY** in `eu-north-1`.

The public schema has one table:

`public.learner_states`: columns `user_id` (UUID primary key, FK to `auth.users`), `state` (JSONB), and `updated_at` (timestamp). **RLS is enabled.** Table was reported with **0 rows** at inspection time.

These checks do **not** demonstrate that auth is configured end-to-end, that row policies are correct, or that different-user access is blocked. These need explicit testing.

## Experiment deployment guideline

- Do not modify the historical deployment or Supabase schema merely to make the comparison look complete.
- Prefer isolated test accounts and namespace/state isolation per condition.
- The three conditions must have the same infrastructure privileges. Record any divergent environment.
- Do not commit service-role keys, access tokens, private API credentials, or test users' passwords.
- Deployment setup time and credential problems are recorded honestly; a working local build is not a verified production deployment.

**Status:** Repository and content baseline confirmed. Experimental implementation and live end-to-end auth have **not yet been run**.
