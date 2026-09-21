import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { SessionUser } from "@/types";
import { DEMO_MODE_ENABLED, demoSessionSecret, isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { contributorByUsername } from "@/data/contributors";

export const DEMO_COOKIE = "e360_demo_session";
const MAX_AGE = 60 * 60 * 24 * 7;

/**
 * The demo session only exists when Supabase is not configured AND we are not in
 * production. It is clearly labelled everywhere it surfaces in the UI, and it
 * grants no database access — server actions still refuse to persist anything.
 */
function sign(payload: string): string {
  return crypto.createHmac("sha256", demoSessionSecret()).update(payload).digest("base64url");
}

function encode(user: SessionUser): string {
  const body = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(raw: string): SessionUser | null {
  const [body, signature] = raw.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export function makeDemoUser(username = "demo.explorer", displayName = "Demo Explorer"): SessionUser {
  const seed = contributorByUsername.get("selam.t");
  return {
    id: `demo-${username}`,
    email: `${username}@demo.local`,
    username,
    displayName,
    bio:
      seed?.bio ??
      "Local demo account. Connect Supabase to create a real profile, upload content and keep it.",
    location: seed?.location ?? "Addis Ababa",
    avatarUrl: null,
    role: "user",
    demo: true,
  };
}

export async function startDemoSession(user: SessionUser): Promise<void> {
  const store = await cookies();
  store.set(DEMO_COOKIE, encode(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endDemoSession(): Promise<void> {
  const store = await cookies();
  store.delete(DEMO_COOKIE);
}

async function readDemoSession(): Promise<SessionUser | null> {
  if (!DEMO_MODE_ENABLED) return null;
  const store = await cookies();
  const raw = store.get(DEMO_COOKIE)?.value;
  if (!raw) return null;
  return decode(raw);
}

export interface ProfileRow {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  role: SessionUser["role"];
}

/** Resolve the current user from Supabase Auth, falling back to the demo cookie. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, location, avatar_url, role")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    return {
      id: user.id,
      email: user.email ?? "",
      username: profile?.username ?? (user.email ?? "member").split("@")[0],
      displayName: profile?.display_name ?? user.email ?? "Member",
      bio: profile?.bio ?? "",
      location: profile?.location ?? "",
      avatarUrl: profile?.avatar_url ?? null,
      role: profile?.role ?? "user",
      demo: false,
    };
  }

  return readDemoSession();
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}
