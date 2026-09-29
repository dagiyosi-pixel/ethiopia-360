"use client";

import { Bookmark, Heart } from "lucide-react";
import { cn, formatCompact } from "@/lib/utils";
import { toggleLikeAction, toggleSaveAction, type SocialTarget } from "@/lib/actions/community";
import { useToggleAction } from "@/hooks/useToggleAction";

interface BaseProps {
  targetId: string;
  targetType: SocialTarget;
  count?: number;
  initiallyActive?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function LikeButton({
  targetId,
  targetType,
  count = 0,
  initiallyActive = false,
  className,
  size = "sm",
}: BaseProps) {
  const { active, count: value, pending, toggle } = useToggleAction({
    initialActive: initiallyActive,
    initialCount: count,
    onToggle: () => toggleLikeAction(targetType, targetId),
  });

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-busy={pending}
      aria-label={active ? "Remove like" : "Like this"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-[13px]",
        active
          ? "border-rift-500/50 bg-rift-600/15 text-rift-400"
          : "border-white/[0.12] text-ink-300 hover:border-white/25 hover:text-white",
        className,
      )}
    >
      <Heart aria-hidden className={cn("h-3.5 w-3.5", active && "fill-current")} />
      <span className="tabular-nums">{formatCompact(value ?? 0)}</span>
    </button>
  );
}

export function SaveButton({
  targetId,
  targetType,
  count,
  initiallyActive = false,
  className,
  size = "sm",
}: BaseProps) {
  const { active, pending, toggle } = useToggleAction({
    initialActive: initiallyActive,
    initialCount: null,
    onToggle: () => toggleSaveAction(targetType, targetId),
  });

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-busy={pending}
      aria-label={active ? "Remove from saved" : "Save this"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-[13px]",
        active
          ? "border-gold-500/50 bg-gold-500/15 text-gold-400"
          : "border-white/[0.12] text-ink-300 hover:border-white/25 hover:text-white",
        className,
      )}
    >
      <Bookmark aria-hidden className={cn("h-3.5 w-3.5", active && "fill-current")} />
      <span>{active ? "Saved" : "Save"}</span>
      {typeof count === "number" && <span className="tabular-nums text-ink-400">{formatCompact(count)}</span>}
    </button>
  );
}
