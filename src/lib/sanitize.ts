/**
 * User-generated text handling.
 *
 * The UI never renders raw HTML , all content is placed into React text nodes,
 * which already escapes. These helpers remove control characters, collapse
 * whitespace and cap length so stored data stays predictable, and give us one
 * place to extend if rich text is ever introduced.
 */

const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const ZERO_WIDTH = /[\u200b-\u200f\u2028\u2029\ufeff]/g;

export function sanitizeText(input: string, maxLength = 5000): string {
  return input
    .replace(CONTROL_CHARS, "")
    .replace(ZERO_WIDTH, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

/** Single-line variant for titles, names, tags. */
export function sanitizeLine(input: string, maxLength = 160): string {
  return sanitizeText(input, maxLength).replace(/\s*\n+\s*/g, " ").trim();
}

export function sanitizeTags(tags: string[], limit = 12): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const tag = sanitizeLine(raw, 40).toLowerCase().replace(/\s+/g, "-");
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
    if (out.length >= limit) break;
  }
  return out;
}

export function parseTagInput(input: string): string[] {
  return sanitizeTags(input.split(/[,\n]/));
}

/**
 * Only allow media URLs we control or explicitly trust. Prevents a stored
 * `javascript:` or `data:` payload from ever reaching an <img>/<video> src.
 */
export function safeMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Amharic + Latin letters, numbers, spaces, hyphens and apostrophes. */
export function isSafeDisplayName(name: string): boolean {
  return /^[\p{L}\p{N}\s'’.\-]+$/u.test(name.trim());
}
