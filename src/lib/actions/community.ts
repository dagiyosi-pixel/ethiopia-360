"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";
import { isSupabaseConfigured } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SocialTarget = "post" | "place" | "story" | "photo" | "video";

export interface SocialResult extends ActionResult<{ count?: number; id?: string }> {
  /** True when the change was applied only to local UI state. */
  local?: boolean;
}

const UNCONFIGURED_MESSAGE =
  "Not saved. This build has no database connected, so nothing was written. Add the Supabase environment variables in .env.local to persist contributions.";

const UNAUTHENTICATED_MESSAGE = "Sign in to do that.";

function unauth(action: string): SocialResult {
  return { ok: false, code: "unauthenticated", message: `${UNAUTHENTICATED_MESSAGE} (${action})` };
}

/* ------------------------------------------------------------------------- */
/* Likes and saves                                                            */
/* ------------------------------------------------------------------------- */

const COUNTER_TABLES: Record<SocialTarget, { table: string; countColumn: string }> = {
  post: { table: "media", countColumn: "likes" },
  photo: { table: "media", countColumn: "likes" },
  video: { table: "media", countColumn: "likes" },
  place: { table: "places", countColumn: "likes" },
  story: { table: "stories", countColumn: "likes" },
};

async function toggleRelation(
  table: "likes" | "saves",
  targetType: SocialTarget,
  targetId: string,
  userId: string,
): Promise<{ added: boolean; error: string | null }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { added: false, error: "no-client" };

  const { data: existing, error: readError } = await supabase
    .from(table)
    .select("id")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle<{ id: string }>();

  if (readError) return { added: false, error: readError.message };

  if (existing) {
    const { error } = await supabase.from(table).delete().eq("id", existing.id);
    return { added: false, error: error?.message ?? null };
  }

  const { error } = await supabase
    .from(table)
    .insert({ user_id: userId, target_type: targetType, target_id: targetId });
  return { added: true, error: error?.message ?? null };
}

export async function toggleLikeAction(
  targetType: SocialTarget,
  targetId: string,
): Promise<SocialResult> {
  const user = await getSessionUser();
  if (!user) return unauth("like");
  if (user.demo || !isSupabaseConfigured()) {
    return { ok: true, local: true, code: "ok", message: "Applied to this browser only." };
  }

  const { added, error } = await toggleRelation("likes", targetType, targetId, user.id);
  if (error) return { ok: false, code: "server_error", message: error };

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.rpc("adjust_counter", {
      p_table: COUNTER_TABLES[targetType].table,
      p_id: targetId,
      p_column: COUNTER_TABLES[targetType].countColumn,
      p_delta: added ? 1 : -1,
    });
  }

  return { ok: true, code: "ok", message: added ? "Liked" : "Like removed" };
}

export async function toggleSaveAction(
  targetType: SocialTarget,
  targetId: string,
): Promise<SocialResult> {
  const user = await getSessionUser();
  if (!user) return unauth("save");
  if (user.demo || !isSupabaseConfigured()) {
    return { ok: true, local: true, code: "ok", message: "Applied to this browser only." };
  }

  const { added, error } = await toggleRelation("saves", targetType, targetId, user.id);
  if (error) return { ok: false, code: "server_error", message: error };

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.rpc("adjust_counter", {
      p_table: COUNTER_TABLES[targetType].table,
      p_id: targetId,
      p_column: "saves",
      p_delta: added ? 1 : -1,
    });
  }

  return {
    ok: true,
    code: "ok",
    message: added ? "Saved to your collection" : "Removed from saved",
  };
}

/* ------------------------------------------------------------------------- */
/* Follows                                                                    */
/* ------------------------------------------------------------------------- */

export async function toggleFollowAction(targetUserId: string): Promise<SocialResult> {
  const user = await getSessionUser();
  if (!user) return unauth("follow");

  if (user.id === targetUserId) {
    return { ok: false, code: "invalid", message: "You cannot follow yourself." };
  }
  if (user.demo || !isSupabaseConfigured()) {
    return { ok: true, local: true, code: "ok", message: "Applied to this browser only." };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, code: "unconfigured", message: UNCONFIGURED_MESSAGE };

  const { data: existing, error: readError } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle<{ follower_id: string }>();

  if (readError) return { ok: false, code: "server_error", message: readError.message };

  if (existing) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);
    if (error) return { ok: false, code: "server_error", message: error.message };
    return { ok: true, code: "ok", message: "Unfollowed" };
  }

  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: user.id, following_id: targetUserId });
  if (error) return { ok: false, code: "server_error", message: error.message };

  revalidatePath("/settings");
  return { ok: true, code: "ok", message: "Following" };
}

/* ------------------------------------------------------------------------- */
/* Comments                                                                   */
/* ------------------------------------------------------------------------- */

export async function addCommentAction(form: FormData): Promise<SocialResult> {
  const { commentSchema } = await import("@/lib/validation");
  const { sanitizeText } = await import("@/lib/sanitize");

  const parsed = commentSchema.safeParse({
    targetType: form.get("targetType"),
    targetId: form.get("targetId"),
    body: form.get("body"),
    parentId: form.get("parentId") || null,
  });

  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid",
      message: parsed.error.issues[0]?.message ?? "That comment could not be accepted.",
    };
  }

  const user = await getSessionUser();
  if (!user) return unauth("comment");

  const body = sanitizeText(parsed.data.body, 2000);

  if (user.demo || !isSupabaseConfigured()) {
    return { ok: false, code: "unconfigured", message: UNCONFIGURED_MESSAGE, local: true };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, code: "unconfigured", message: UNCONFIGURED_MESSAGE };

  const { data, error } = await supabase
    .from("comments")
    .insert({
      target_type: parsed.data.targetType,
      target_id: parsed.data.targetId,
      author_id: user.id,
      body,
      parent_id: parsed.data.parentId ?? null,
      status: "published",
    })
    .select("id")
    .single<{ id: string }>();

  if (error) return { ok: false, code: "server_error", message: error.message };

  const targetPath = form.get("revalidate");
  if (typeof targetPath === "string" && targetPath.startsWith("/")) {
    revalidatePath(targetPath);
  }

  return { ok: true, code: "ok", message: "Comment posted", data: { id: data.id } };
}

/* ------------------------------------------------------------------------- */
/* Reports (moderation intake)                                                */
/* ------------------------------------------------------------------------- */

export async function submitReportAction(form: FormData): Promise<SocialResult> {
  const { reportSchema } = await import("@/lib/validation");
  const { sanitizeText } = await import("@/lib/sanitize");

  const parsed = reportSchema.safeParse({
    targetType: form.get("targetType"),
    targetId: form.get("targetId"),
    reason: form.get("reason"),
    detail: form.get("detail") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, code: "invalid", message: "Choose a reason for the report." };
  }

  const user = await getSessionUser();
  if (!user) return unauth("report");

  if (user.demo || !isSupabaseConfigured()) {
    return {
      ok: false,
      code: "unconfigured",
      message:
        "Report not submitted: no moderation database is connected. Configure Supabase to file reports.",
    };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, code: "unconfigured", message: UNCONFIGURED_MESSAGE };

  const { error } = await supabase.from("reports").insert({
    target_type: parsed.data.targetType,
    target_id: parsed.data.targetId,
    reason: parsed.data.reason,
    detail: sanitizeText(parsed.data.detail ?? "", 1000),
    reporter_id: user.id,
    status: "open",
  });

  if (error) return { ok: false, code: "server_error", message: error.message };

  return { ok: true, code: "ok", message: "Thanks — this has been sent to the moderation queue." };
}
