"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/env";

let cached: SupabaseClient | null = null;

/**
 * Browser client. Only ever constructed when the public env vars exist ,
 * returns null in demo mode so callers can render an honest fallback instead
 * of failing at runtime.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured() || !SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (cached) return cached;
  cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cached;
}
