import { z } from "zod";
import { CATEGORIES } from "@/types";

/* ------------------------------------------------------------------------- */
/* Upload constraints — enforced client side for UX and server side for safety */
/* ------------------------------------------------------------------------- */

export const IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
] as const;

export const VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"] as const;

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB
export const MAX_FILES = 10;
export const MAX_IMAGE_DIMENSION = 8000;

export interface FileCheck {
  ok: boolean
  error?: string
}

export function checkImageFile(file: { type: string; size: number; name: string }): FileCheck {
  if (!IMAGE_MIME.includes(file.type as (typeof IMAGE_MIME)[number])) {
    return { ok: false, error: `${file.name}: unsupported image type (${file.type || "unknown"}).` };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `${file.name}: larger than 15 MB.` };
  }
  if (file.size === 0) {
    return { ok: false, error: `${file.name}: file is empty.` };
  }
  return { ok: true };
}

export function checkVideoFile(file: { type: string; size: number; name: string }): FileCheck {
  if (!VIDEO_MIME.includes(file.type as (typeof VIDEO_MIME)[number])) {
    return { ok: false, error: `${file.name}: unsupported video type (${file.type || "unknown"}).` };
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return { ok: false, error: `${file.name}: larger than 200 MB.` };
  }
  if (file.size === 0) {
    return { ok: false, error: `${file.name}: file is empty.` };
  }
  return { ok: true };
}

/* ------------------------------------------------------------------------- */
/* Text input                                                                */
/* ------------------------------------------------------------------------- */

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be 30 characters or fewer.")
  .regex(/^[a-z0-9._]+$/i, "Use letters, numbers, dots and underscores only.");

export const signUpSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(72, "Passwords over 72 characters are not supported."),
  username: usernameSchema,
  displayName: z.string().min(2, "Tell us your name.").max(60),
});

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const profileSchema = z.object({
  displayName: z.string().min(2, "Display name is too short.").max(60),
  username: usernameSchema,
  bio: z.string().max(400, "Keep your bio under 400 characters.").default(""),
  location: z.string().max(80).default(""),
  isPublic: z.boolean().default(true),
  showSaved: z.boolean().default(false),
});

export const commentSchema = z.object({
  targetType: z.enum(["post", "place", "story", "photo", "video"]),
  targetId: z.string().min(1).max(120),
  body: z.string().min(2, "Comment is too short.").max(2000, "Comment is too long."),
  parentId: z.string().max(120).optional().nullable(),
});

export const reportSchema = z.object({
  targetType: z.enum(["post", "comment", "profile"]),
  targetId: z.string().min(1).max(120),
  reason: z.enum(["spam", "harassment", "inappropriate", "misinformation", "copyright", "other"]),
  detail: z.string().max(1000).optional().default(""),
});

export const uploadSchema = z.object({
  type: z.enum(["photo", "video", "story", "place", "event", "history", "architecture"]),
  title: z.string().min(3, "Give this a title.").max(140),
  description: z.string().max(4000).default(""),
  regionSlug: z.string().max(60).default(""),
  citySlug: z.string().max(60).default(""),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string().max(40)).max(12).default([]),
  attribution: z.string().max(240).default(""),
  license: z.string().max(60).default("cc-by"),
  storyBody: z.string().max(20000).default(""),
  coords: z
    .object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) })
    .nullable()
    .optional(),
});

export type UploadInput = z.infer<typeof uploadSchema>;

/** Flatten zod issues into `{ field: message }` for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
