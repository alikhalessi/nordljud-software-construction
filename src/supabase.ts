"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let singleton: SupabaseClient | null | undefined;

/** This function intentionally accepts only public, browser-safe credentials. */
export function learnerAuth(): SupabaseClient | null {
  if (singleton !== undefined) return singleton;
  const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  singleton = endpoint && publishable ? createClient(endpoint, publishable, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }) : null;
  return singleton;
}
