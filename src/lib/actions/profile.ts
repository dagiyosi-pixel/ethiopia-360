"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";
import { isSupabaseConfigured } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { fieldErrors, profileSchema } from "@/lib/validation";
import { isSafeDisplayName, sanitizeLine, sanitizeText } from "@/lib/sanitize";

export interface ProfileOutcome extends ActionResult {
  fieldErrors?: Record<string, string>;
}

const UNCONFIGURED: ProfileOutcome = {
  ok: false,
  code: "unconfigured",
  message:
    "Profile changes were not saved: no database is connected. Add the Supabase environment variables to persist this.",
};

export async function updateProfileAction(form: FormData): Promise<ProfileOutcome> {
  const user = await getSessionUser();
  if (!user) return { ok: false, code: "unauthenticated", message: "Sign in to edit your profile." };

  const parsed = profileSchema.safeParse({
    displayName: sanitizeLine(String(form.get("displayName") ?? ""), 60),
    username: sanitizeLine(String(form.get("username") ?? ""), 30).toLowerCase(),
    bio: sanitizeText(String(form.get("bio") ?? ""), 400),
    location: sanitizeLine(String(form.get("location") ?? ""), 80),
    isPublic: form.get("isPublic") === "on" || form.get("isPublic") === "true",
    showSaved: form.get("showSaved") === "on" || form.get("showSaved") === "true",
  });

  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid",
      message: "Please fix the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  if (!isSafeDisplayName(parsed.data.displayName)) {
    return {
      ok: false,
      code: "invalid",
      message: "Display name contains unsupported characters.",
      fieldErrors: { displayName: "Use letters, numbers, spaces, apostrophes and hyphens." },
    };
  }

  if (user.demo || !isSupabaseConfigured()) return UNCONFIGURED;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return UNCONFIGURED;

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      username: parsed.data.username,
      bio: parsed.data.bio,
      location: parsed.data.location,
      is_public: parsed.data.isPublic,
      show_saved: parsed.data.showSaved,
      updated_at: new Date().toISOString(),
    })
    // Scoped to the signed-in user; RLS enforces the same rule server side.
    .eq("id", user.id);

  if (error) {
    const duplicate = error.message.toLowerCase().includes("duplicate");
    return {
      ok: false,
      code: duplicate ? "invalid" : "server_error",
      message: duplicate ? "That username is already taken." : error.message,
      fieldErrors: duplicate ? { username: "Already taken." } : undefined,
    };
  }

  revalidatePath("/settings");
  revalidatePath(`/profile/${parsed.data.username}`);

  return { ok: true, code: "ok", message: "Profile updated." };
}

export async function updateAvatarAction(form: FormData): Promise<ProfileOutcome> {
  const user = await getSessionUser();
  if (!user) return { ok: false, code: "unauthenticated", message: "Sign in first." };

  const file = form.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, code: "invalid", message: "Choose an image first." };
  }

  const { checkImageFile } = await import("@/lib/validation");
  const check = checkImageFile(file);
  if (!check.ok) return { ok: false, code: "invalid", message: check.error ?? "Invalid image." };

  if (user.demo || !isSupabaseConfigured()) return UNCONFIGURED;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return UNCONFIGURED;

  const { STORAGE_BUCKET } = await import("@/lib/env");
  const extension = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `avatars/${user.id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    return { ok: false, code: "server_error", message: uploadError.message };
  }

  const publicUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { ok: false, code: "server_error", message: error.message };

  revalidatePath("/settings");
  return { ok: true, code: "ok", message: "Avatar updated." };
}

/**
 * Account deletion request. We never delete immediately from the client — this
 * marks the profile for review, which is also the moderation-friendly path.
 */
export async function requestAccountDeletionAction(form: FormData): Promise<ProfileOutcome> {
  const user = await getSessionUser();
  if (!user) return { ok: false, code: "unauthenticated", message: "Sign in first." };

  const confirm = String(form.get("confirm") ?? "").trim().toLowerCase();
  if (confirm !== "delete my account") {
    return {
      ok: false,
      code: "invalid",
      message: 'Type "delete my account" exactly to confirm.',
    };
  }

  if (user.demo || !isSupabaseConfigured()) return UNCONFIGURED;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return UNCONFIGURED;

  const { error } = await supabase.from("account_requests").insert({
    user_id: user.id,
    kind: "deletion",
    status: "open",
    detail: "Requested from account settings.",
  });

  if (error) return { ok: false, code: "server_error", message: error.message };

  return {
    ok: true,
    code: "ok",
    message: "Your deletion request has been recorded and will be reviewed.",
  };
}
