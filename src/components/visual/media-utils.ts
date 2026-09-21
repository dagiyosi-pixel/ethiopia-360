import { cn } from "@/lib/utils";

/** Strip anything that is not a safe relative path or https URL. */
export function safeSrc(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  return null;
}

export { cn };
