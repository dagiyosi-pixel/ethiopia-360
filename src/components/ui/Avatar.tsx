import Image from "next/image";
import type { Artwork, Contributor } from "@/types";
import { cn, initials } from "@/lib/utils";
import { safeSrc } from "@/components/visual/media-utils";
import { GeneratedArtwork } from "@/components/visual/GeneratedArtwork";

const SIZES = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-base",
  xl: "h-24 w-24 text-xl sm:h-28 sm:w-28 sm:text-2xl",
} as const;

export function Avatar({
  name,
  artwork,
  src,
  size = "md",
  className,
  ring = false,
}: {
  name: string;
  artwork?: Artwork;
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
}) {
  const safe = safeSrc(src);
  const fallbackArtwork: Artwork = artwork ?? { palette: "basalt", seed: 3, motif: "weave" };

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.12] bg-ink-800",
        SIZES[size],
        ring && "ring-2 ring-gold-500/40 ring-offset-2 ring-offset-ink-900",
        className,
      )}
    >
      {safe ? (
        <Image src={safe} alt={name} fill sizes="120px" className="object-cover" />
      ) : (
        <>
          <GeneratedArtwork artwork={fallbackArtwork} title={name} />
          <span className="absolute inset-0 flex items-center justify-center font-medium uppercase tracking-wide text-white/90">
            {initials(name)}
          </span>
        </>
      )}
    </span>
  );
}

export function ContributorInline({
  contributor,
  className,
}: {
  contributor: Pick<Contributor, "displayName" | "username" | "avatar"> & { avatarUrl?: string | null };
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs text-ink-300", className)}>
      <Avatar
        name={contributor.displayName}
        artwork={contributor.avatar}
        src={contributor.avatarUrl}
        size="xs"
      />
      <span className="truncate">{contributor.displayName}</span>
    </span>
  );
}
