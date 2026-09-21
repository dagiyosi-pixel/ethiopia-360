"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult, ContentType, Coords } from "@/types";
import { STORAGE_BUCKET, isSupabaseConfigured, MODE } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  MAX_FILES,
  checkImageFile,
  checkVideoFile,
  fieldErrors,
  uploadSchema,
} from "@/lib/validation";
import { parseTagInput, sanitizeLine, sanitizeText } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";

export interface UploadOutcome extends ActionResult<{ slug?: string; storagePaths?: string[] }> {
  fieldErrors?: Record<string, string>;
  /** Present when files were accepted but could not be stored. */
  blocked?: boolean;
}

const UNCONFIGURED: UploadOutcome = {
  ok: false,
  blocked: true,
  code: "unconfigured",
  message:
    "Nothing was uploaded. This build is running in demo mode with no Supabase project connected, so there is no storage bucket or database to write to.",
};

/** Types that require attached media. */
const MEDIA_TYPES: ContentType[] = ["photo", "video", "place", "event"];

export async function submitUploadAction(form: FormData): Promise<UploadOutcome> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, code: "unauthenticated", message: "Sign in before publishing." };
  }

  const rawTags = form.get("tags");
  const rawCoords = form.get("coords");
  let coords: Coords | null = null;
  if (typeof rawCoords === "string" && rawCoords.includes(",")) {
    const [lat, lng] = rawCoords.split(",").map((value) => Number(value.trim()));
    if (Number.isFinite(lat) && Number.isFinite(lng)) coords = { lat, lng };
  }

  const parsed = uploadSchema.safeParse({
    type: form.get("type"),
    title: form.get("title"),
    description: form.get("description") ?? "",
    regionSlug: form.get("regionSlug") ?? "",
    citySlug: form.get("citySlug") ?? "",
    category: form.get("category"),
    tags: typeof rawTags === "string" ? parseTagInput(rawTags) : [],
    attribution: form.get("attribution") ?? "",
    license: form.get("license") ?? "cc-by",
    storyBody: form.get("storyBody") ?? "",
    coords,
  });

  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid",
      message: "Check the highlighted fields and try again.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const draft = parsed.data;

  if (draft.type === "story" && sanitizeText(draft.storyBody, 20000).length < 80) {
    return {
      ok: false,
      code: "invalid",
      message: "A story needs at least a couple of paragraphs (80 characters minimum).",
      fieldErrors: { storyBody: "Write a little more before publishing." },
    };
  }

  // Re-validate declared files server side — never trust the client.
  const declared = form
    .getAll("filemeta")
    .filter((value): value is string => typeof value === "string")
    .map((raw) => {
      try {
        return JSON.parse(raw) as { name: string; size: number; type: string };
      } catch {
        return null;
      }
    })
    .filter((value): value is { name: string; size: number; type: string } => value !== null);

  if (MEDIA_TYPES.includes(draft.type) && declared.length === 0) {
    return {
      ok: false,
      code: "invalid",
      message: "Add at least one file for this content type.",
      fieldErrors: { files: "No files attached." },
    };
  }

  if (declared.length > MAX_FILES) {
    return { ok: false, code: "invalid", message: `Attach up to ${MAX_FILES} files.` };
  }

  for (const file of declared) {
    const check = file.type.startsWith("video/") ? checkVideoFile(file) : checkImageFile(file);
    if (!check.ok) {
      return {
        ok: false,
        code: "invalid",
        message: check.error ?? "Invalid file.",
        fieldErrors: { files: check.error ?? "" },
      };
    }
  }

  // ---- Honest gate: no Supabase project, no write. ------------------------
  if (MODE === "demo" || user.demo || !isSupabaseConfigured()) {
    return UNCONFIGURED;
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return UNCONFIGURED;

  // ---- 1. Upload the binary payloads -------------------------------------
  const uploadedPaths: string[] = [];
  const uploads = form.getAll("file");

  for (const entry of uploads) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    const check = entry.type.startsWith("video/") ? checkVideoFile(entry) : checkImageFile(entry);
    if (!check.ok) {
      return { ok: false, code: "invalid", message: check.error ?? "Invalid file." };
    }

    const rawExtension = entry.name.includes(".") ? entry.name.split(".").pop() : "";
    const extension = rawExtension ? rawExtension.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    const objectPath = `${user.id}/${Date.now()}-${slugify(entry.name.replace(/\.[^.]+$/, ""))}${
      extension ? `.${extension}` : ""
    }`;

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, entry, { contentType: entry.type, upsert: false });

    if (storageError) {
      // Roll back anything already written so we never half-publish.
      if (uploadedPaths.length) {
        await supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths);
      }
      return {
        ok: false,
        code: "server_error",
        message: `Upload failed while transferring "${entry.name}": ${storageError.message}`,
      };
    }

    uploadedPaths.push(objectPath);
  }

  // ---- 2. Write the metadata row ----------------------------------------
  const publicUrl = (path: string | null) =>
    path ? supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl : null;

  const slug = `${slugify(sanitizeLine(draft.title, 80))}-${Date.now().toString(36).slice(-4)}`;
  const title = sanitizeLine(draft.title, 140);
  const summary = sanitizeText(draft.description, 400);
  const body = sanitizeText(draft.description, 4000);

  const { data: regionRow } = draft.regionSlug
    ? await supabase
        .from("regions")
        .select("id")
        .eq("slug", draft.regionSlug)
        .maybeSingle<{ id: string }>()
    : { data: null };
  const { data: cityRow } = draft.citySlug
    ? await supabase
        .from("cities")
        .select("id")
        .eq("slug", draft.citySlug)
        .maybeSingle<{ id: string }>()
    : { data: null };

  let insertError: string | null = null;

  if (draft.type === "story") {
    const paragraphs = sanitizeText(draft.storyBody, 20000)
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    const { error } = await supabase.from("stories").insert({
      slug,
      title,
      excerpt: summary,
      body: paragraphs,
      author_id: user.id,
      region_id: regionRow?.id ?? null,
      city_id: cityRow?.id ?? null,
      category: draft.category,
      tags: draft.tags,
      read_minutes: Math.max(1, Math.round(paragraphs.join(" ").split(/\s+/).length / 220)),
      status: "published",
      published_at: new Date().toISOString(),
    });
    insertError = error?.message ?? null;
  } else if (draft.type === "place") {
    const { error } = await supabase.from("places").insert({
      slug,
      name: title,
      summary,
      description: [body],
      category: draft.category === "places" ? "landmark" : draft.category,
      region_id: regionRow?.id ?? null,
      city_id: cityRow?.id ?? null,
      contributor_id: user.id,
      tags: draft.tags,
      lat: draft.coords?.lat ?? null,
      lng: draft.coords?.lng ?? null,
      status: "published",
    });
    insertError = error?.message ?? null;
  } else {
    const firstPath = uploadedPaths[0] ?? null;
    const { error } = await supabase.from("media").insert({
      slug,
      type: draft.type === "video" ? "video" : "photo",
      title,
      caption: summary,
      author_id: user.id,
      region_id: regionRow?.id ?? null,
      city_id: cityRow?.id ?? null,
      category: draft.category,
      tags: draft.tags,
      asset_url: publicUrl(firstPath),
      poster_url: draft.type === "video" ? publicUrl(uploadedPaths[1] ?? null) : null,
      orientation: "landscape",
      status: "published",
      lat: draft.coords?.lat ?? null,
      lng: draft.coords?.lng ?? null,
    });
    insertError = error?.message ?? null;
  }

  if (insertError) {
    // The binaries are useless without a row — clean them up.
    if (uploadedPaths.length) {
      await supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths);
    }
    return { ok: false, code: "server_error", message: `Could not save the record: ${insertError}` };
  }

  revalidatePath("/explore");
  revalidatePath("/gallery");

  return {
    ok: true,
    code: "ok",
    message: "Published. Thank you for contributing to the archive.",
    data: { slug, storagePaths: uploadedPaths },
  };
}

/** Used early in the wizard so users are warned before they spend time uploading. */
export async function uploadAvailabilityAction(): Promise<{ available: boolean; reason?: string }> {
  if (!isSupabaseConfigured()) {
    return { available: false, reason: "Supabase is not configured, so uploads cannot be stored." };
  }
  const user = await getSessionUser();
  if (!user) return { available: false, reason: "Sign in to upload." };
  if (user.demo) return { available: false, reason: "Demo sessions cannot publish." };
  return { available: true };
}
