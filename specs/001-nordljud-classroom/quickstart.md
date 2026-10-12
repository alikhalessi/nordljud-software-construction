# Independent SDD Classroom Implementation — Quickstart

**Branch:** `condition/spec-driven` (never merge A or B application code).

After the constitution/spec/clarification/plan/task/analyze gates are all committed:

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Set browser-safe variables using `.env.local` (not committed):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<public publishable key>
```

Do **not** use service-role or Google OAuth client secret in the browser. Google provider activation and preview host allowlisting are managed in Supabase/Google dashboards, not by Git commits.

For manual black-box testing follow coordinating `main:evaluation/TEST_PLAN.md`. In particular test two genuine separate signed-in users, login persistence, Swedish audio availability, and the dual sense `sticka`. Record unavailable integrations as NOT TESTED.

**Dataset note:** the common source contains four groups of 456 records but only 455 distinct written lemmas. They must not be altered.
