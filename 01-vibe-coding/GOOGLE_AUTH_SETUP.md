# Google sign-in — setup and verification (Condition A)

**State as of 13 October 2026:** The Vibe application calls Supabase Auth using `signInWithOAuth({ provider: "google" })` and has browser-safe Supabase environment variables in the Vercel **Preview** environment. A successful live Google sign-in is **not** verified. The user reported being redirected to an error page when clicking Continue with Google.

## 1. Supabase project

Open the existing Supabase project **Nordlyd-3B**, reference `uhyzuivllmztptmcduci`:

<https://supabase.com/dashboard/project/uhyzuivllmztptmcduci/auth/providers?provider=Google>

Under **Authentication → Sign In / Providers → Google**, enable Google sign-in. It requires a Google Cloud OAuth **Web application** Client ID and Client Secret. Do not paste the Client Secret into the GitHub repository or browser environment variables; enter it only in the secure Supabase provider configuration.

## 2. Google Cloud OAuth client

In Google Cloud Auth Platform (<https://console.cloud.google.com/auth/clients>), register a Web application OAuth client.

**Authorized redirect URI in Google Cloud** (this points to Supabase, NOT to Vercel):

`https://uhyzuivllmztptmcduci.supabase.co/auth/v1/callback`

The app's authorized JavaScript origin may include:

`https://nordljud-vibe-lab-git-condition-vibe-aleksi9.vercel.app`

Confirm Google consent screen/audience settings permit the intended test user. If the app is in Testing mode, add the user's Google account as a test user.

## 3. Supabase redirect allowlist

Open Supabase **Authentication → URL Configuration**:

<https://supabase.com/dashboard/project/uhyzuivllmztptmcduci/auth/url-configuration>

The app uses `redirectTo` equal to its browser origin plus `/?auth_return=google&tab=...&explore_level=...`.

For the **stable Vibe preview branch domain**, add:

`https://nordljud-vibe-lab-git-condition-vibe-aleksi9.vercel.app/**`

For temporary Vercel preview deployments (testing only), a narrowly scoped wildcard may be used:

`https://nordljud-vibe-*.vercel.app/**`

The wildcard matches individual deployment domains. For production, prefer an exact canonical application URL.

**Do not confuse** the Google Cloud **Authorized redirect URI** with the **Supabase application Redirect URLs**; both are required in different places.

## 4. In-app diagnostics

`/api/auth-status` shows only whether environment variables exist and whether Supabase's public auth settings describe Google as enabled, disabled or unknown. It exposes neither public key values nor secrets.

The Google button is deliberately unavailable if Supabase confirms the provider is disabled. If provider status is unknown, a live sign-in attempt and its exact error must be captured.

The app stores the selected navigation tab and Explore verb temporarily in sessionStorage before leaving for Google, allowing a Back navigation or OAuth return to restore the last screen in the same browser origin.

## 5. Manual acceptance test

- Use the stable branch URL above rather than rotating one-off deployment URLs.
- Choose an Explore verb; switch A2 to C1 and ensure the **same Swedish lemma** remains while examples change.
- Start Google sign-in; verify the account chooser, the return to Nordljud and the signed-in user identity.
- If Google shows an error, record **its exact text or screenshot**. Error pages can arise from different causes: provider disabled, client ID/secret, consent-screen test users, wrong Google callback or a missing application redirect URL.
- Refresh the app; confirm user session and cloud progress/favorites persist. Sign out and verify an unauthenticated session.
- Never mark Google OAuth PASS until these steps actually succeed.

Official references:
- <https://supabase.com/docs/guides/auth/social-login/auth-google>
- <https://supabase.com/docs/guides/auth/redirect-urls>
