/**
 * Environment detection.
 *
 * The application is designed to boot in two modes:
 *  - `supabase`: full persistence (auth, Postgres, Storage).
 *  - `demo`:     read-only seed content from `src/data`, local-only social state,
 *                and explicit "not configured" responses for writes.
 *
 * Nothing is silently simulated. Every write path checks `isSupabaseConfigured()`
 * and returns a `unconfigured` result the UI surfaces to the user.
 */

function readEnv(key: string): string | undefined {
  const value = process.env[key];
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export const SUPABASE_URL = readEnv("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
export const SUPABASE_SERVICE_ROLE_KEY = readEnv("SUPABASE_SERVICE_ROLE_KEY");
export const STORAGE_BUCKET = readEnv("NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET") ?? "media";

export const SITE_URL =
  readEnv("NEXT_PUBLIC_SITE_URL") ??
  (readEnv("VERCEL_URL") ? `https://${readEnv("VERCEL_URL")}` : "http://localhost:3000");

/** True only when both public Supabase values are present and well formed. */
export function isSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  try {
    const url = new URL(SUPABASE_URL);
    return url.protocol === "https:" || url.hostname === "localhost";
  } catch {
    return false;
  }
}

export function isServiceRoleConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Secret used to sign the local demo session cookie. Only relevant when
 * Supabase is not configured. In development we fall back to a per-process
 * random value so the cookie can never be forged across restarts; in
 * production the demo session is disabled entirely.
 */
export const DEMO_MODE_ENABLED = !isSupabaseConfigured() && process.env.NODE_ENV !== "production";

export function demoSessionSecret(): string {
  const configured = readEnv("DEMO_SESSION_SECRET");
  if (configured) return configured;
  return "ethiopia360-development-demo-secret";
}

export const MODE: "supabase" | "demo" = isSupabaseConfigured() ? "supabase" : "demo";

export const MISSING_ENV: string[] = [
  ...(SUPABASE_URL ? [] : ["NEXT_PUBLIC_SUPABASE_URL"]),
  ...(SUPABASE_ANON_KEY ? [] : ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]),
  ...(SUPABASE_SERVICE_ROLE_KEY ? [] : ["SUPABASE_SERVICE_ROLE_KEY (optional, server-side only)"]),
];
