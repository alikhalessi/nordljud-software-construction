// Minimal diagnostics: no credentials are ever returned to the browser.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!base || !key) {
    return Response.json(
      { configured: false, google: "unknown", detail: "Supabase environment variables are not configured." },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const response = await fetch(base.replace(/\/$/, "") + "/auth/v1/settings", {
      method: "GET",
      headers: { apikey: key },
      cache: "no-store"
    });

    if (!response.ok) {
      return Response.json(
        { configured: true, google: "unknown", detail: "Could not read Supabase Auth provider settings." },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const result: unknown = await response.json();
    const settings = result && typeof result === "object"
      ? result as { external?: Record<string, unknown> }
      : {};
    const google = settings.external?.google;
    return Response.json({
      configured: true,
      google: google === true ? "enabled" : google === false ? "disabled" : "unknown"
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { configured: true, google: "unknown", detail: "Could not contact Supabase Auth settings." },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
