# Vibe Coding — private-course pilot made publicly reachable (13 Oct 2026)

## Pilot audience and scope
The user asked to share the **existing Condition A (Vibe) implementation** with approximately 10–15 volunteer users before finishing the course. This is a limited academic usability pilot, **not** a scale-up to a commercial product. Condition A implementation source commit was kept unchanged at `c4e610e87943e8ac2ae7b23b00bcdf960ee68b30`.

## Vercel infrastructure changes
- Existing project: `nordljud-vibe-lab` (`prj_h8eD1ENirVMFHZHJX4fOC1PR30dY`).
- Added encrypted **Production** browser-safe public Supabase URL and public publishable key. No private/service-role key exposed.
- Changed project-level SSO protection from `all_except_custom_domains` to `preview`, allowing non-Vercel users to reach Production while keeping Preview deployments protected.
- Explicit Production deployment of **Condition A Vibe branch**, using original Vibe head commit `c4e610e87943e8ac2ae7b23b00bcdf960ee68b30`.
- Production deployment ID: `dpl_5Euff8xKyj4f9T6uWT7C9rfTztNi`; Vercel API shows **READY**. Deployment aliases include `https://nordljud-vibe-lab.vercel.app` and `https://nordljud-vibe-lab-aleksi9.vercel.app`.

## Supabase security review
Verified RLS policies on `public.learner_states`: SELECT, INSERT, UPDATE, DELETE guarded by authenticated caller's `auth.uid() = user_id`. Application writes progress and favorites in separate namespaced keys in `learner_states.state`.

## Manual and end-to-end checks required
The Supabase dashboard currently has **no connector action available to read or edit Auth URL Configuration**. To support the exact production origin, add `https://nordljud-vibe-lab.vercel.app/**` under Authentication → URL Configuration → Redirect URLs. Prefer set Site URL to this origin only after confirming it will not disrupt the historic Nordlyd application sharing the same Supabase project; a Redirect URL entry alone is sufficient for Vibe Google login's explicit `redirectTo`.

Google Cloud OAuth is currently configured by the user and Google sign-in has worked on the earlier Vibe preview. Google app is in Testing with External audience; it uses standard identity scopes only. Do not claim production OAuth works until testing the production URL. The Google Cloud authorized OAuth redirect URI remains `https://uhyzuivllmztptmcduci.supabase.co/auth/v1/callback`.

Suggested short voluntary pilot acceptance:
1. Open Production from logged-out or incognito browser without Vercel login.
2. Sign in with a **second, genuinely separate Google account** (not just the owner).
3. Solve a correct question; favorite a verb in Explore.
4. Reload page and sign out / sign back in; confirm same user retains progress and favorites.
5. Sign in as another user; confirm the first learner's private saved progress and favorites **do not appear**.
6. Confirm separate users' progress is isolated in Supabase without reading personal email addresses unnecessarily.
7. Check phone layout and Swedish audio availability; document browser/device dependencies.

**Not yet verified:** actual public webpage fetch, browser login on the new origin, cross-user persistence and guest UX. Vercel READY is successful build only.

The Vibe code has not been further changed by this infrastructure action. All post-implementation research observations are recorded on the coordinating branch.
