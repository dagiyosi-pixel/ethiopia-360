"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/types";
import { DEMO_MODE_ENABLED, isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { endDemoSession, makeDemoUser, startDemoSession } from "@/lib/auth";
import { fieldErrors, signInSchema, signUpSchema } from "@/lib/validation";
import { isSafeDisplayName, sanitizeLine } from "@/lib/sanitize";

export interface AuthFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  notice?: string;
  demoMode?: boolean;
}

function readString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

async function createProfileRow(
  userId: string,
  email: string,
  username: string,
  displayName: string,
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return;
  const { error } = await supabase.from("profiles").insert({
    id: userId,
    username,
    display_name: displayName,
    bio: "",
    location: "",
    is_public: true,
    role: "user",
  });
  if (error) {
    console.warn(`[auth] profile insert failed for ${email}: ${error.message}`);
  }
}

export async function signUpAction(
  _prev: AuthFormState | undefined,
  form: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: readString(form, "email"),
    password: readString(form, "password"),
    username: sanitizeLine(readString(form, "username"), 30).toLowerCase(),
    displayName: sanitizeLine(readString(form, "displayName"), 60),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), error: "Please check the highlighted fields." };
  }

  if (!isSafeDisplayName(parsed.data.displayName)) {
    return { fieldErrors: { displayName: "Remove special characters from your name." } };
  }

  if (!isSupabaseConfigured()) {
    return {
      demoMode: true,
      error:
        "Account creation needs Supabase. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, or continue with the local demo session below.",
    };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Supabase client could not be created." };

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username, display_name: parsed.data.displayName },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await createProfileRow(data.user.id, parsed.data.email, parsed.data.username, parsed.data.displayName);
  }

  if (!data.session) {
    return {
      notice: "Check your inbox to confirm your email address, then sign in.",
    };
  }

  redirect("/?welcome=1");
}

export async function signInAction(
  _prev: AuthFormState | undefined,
  form: FormData,
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: readString(form, "email"),
    password: readString(form, "password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), error: "Enter your email and password." };
  }

  if (!isSupabaseConfigured()) {
    return {
      demoMode: true,
      error:
        "Sign-in needs Supabase. Configure the environment variables, or use the local demo session so you can explore the authenticated UI.",
    };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Supabase client could not be created." };

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  const next = readString(form, "next");
  redirect(next && next.startsWith("/") ? next : "/explore");
}

export async function signInWithProviderAction(form: FormData): Promise<void> {
  const provider = readString(form, "provider");
  if (provider !== "google" && provider !== "github") return;
  if (!isSupabaseConfigured()) redirect("/login?error=demo");

  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/login?error=config");

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    await supabase?.auth.signOut();
  }
  await endDemoSession();
  redirect("/");
}

/**
 * Local demo session. Only available when Supabase is not configured and we are
 * not in production. It carries a signed, httpOnly cookie identifying a local
 * demo account — it grants NO database access, and every write action still
 * refuses to persist anything.
 */
export async function startDemoSessionAction(form: FormData): Promise<void> {
  if (!DEMO_MODE_ENABLED) redirect("/login?error=demo-disabled");

  const username = sanitizeLine(readString(form, "username"), 30).toLowerCase() || "demo.explorer";
  const displayName = sanitizeLine(readString(form, "displayName"), 60) || "Demo Explorer";

  await startDemoSession(makeDemoUser(username, displayName));
  const next = readString(form, "next");
  redirect(next && next.startsWith("/") ? next : "/explore");
}

export async function endDemoSessionAction(): Promise<ActionResult> {
  await endDemoSession();
  return { ok: true, code: "ok", message: "Demo session ended." };
}
