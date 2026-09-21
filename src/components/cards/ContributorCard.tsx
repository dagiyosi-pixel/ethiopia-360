import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import type { Contributor } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatCompact } from "@/lib/utils";

export function ContributorCard({
  contributor,
  className,
  variant = "standard",
  action,
}: {
  contributor: Contributor;
  className?: string;
  variant?: "standard" | "row";
  /** Optional interactive slot (e.g. a follow button) injected by the caller. */
  action?: React.ReactNode;
}) {
  const stat = (label: string, value: number) => (
    <span className="flex flex-col">
      <span className="text-sm font-medium tabular-nums text-white">{formatCompact(value)}</span>
      <span className="text-[10px] uppercase tracking-wider text-ink-400">{label}</span>
    </span>
  );

  if (variant === "row") {
    return (
      <div className={cn("flex items-center gap-4 py-3.5", className)}>
        <Link href={`/profile/${contributor.username}`} className="shrink-0">
          <Avatar name={contributor.displayName} artwork={contributor.avatar} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/profile/${contributor.username}`}
            className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-gold-400"
          >
            <span className="truncate">{contributor.displayName}</span>
            {contributor.verified && (
              <BadgeCheck aria-label="Verified contributor" className="h-3.5 w-3.5 shrink-0 text-gold-500" />
            )}
          </Link>
          <p className="truncate text-xs text-ink-400">
            @{contributor.username} · {contributor.role}
          </p>
        </div>
        <div className="hidden shrink-0 gap-6 sm:flex">
          {stat("Items", contributor.contributions)}
          {stat("Followers", contributor.followers)}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl2 border border-white/[0.08] bg-ink-850/70 p-5 transition-colors duration-300 hover:border-white/20",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <Link href={`/profile/${contributor.username}`} className="shrink-0">
          <Avatar name={contributor.displayName} artwork={contributor.avatar} size="lg" />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/profile/${contributor.username}`}
            className="flex items-center gap-1.5 font-display text-lg leading-tight text-white hover:text-gold-400"
          >
            <span className="truncate">{contributor.displayName}</span>
            {contributor.verified && (
              <BadgeCheck aria-label="Verified contributor" className="h-4 w-4 shrink-0 text-gold-500" />
            )}
          </Link>
          <p className="mt-1 text-xs text-ink-400">
            @{contributor.username} · {contributor.role}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-300">
            <MapPin aria-hidden className="h-3.5 w-3.5 text-ink-500" />
            {contributor.location}
          </p>
        </div>
      </div>

      <p className="line-clamp-3 text-[13px] leading-relaxed text-ink-300">{contributor.bio}</p>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
        <div className="flex gap-6">
          {stat("Items", contributor.contributions)}
          {stat("Followers", contributor.followers)}
        </div>
        {action}
      </div>
    </div>
  );
}
