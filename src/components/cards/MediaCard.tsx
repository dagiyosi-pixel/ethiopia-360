import Link from "next/link";
import { Bookmark, Heart, MessageCircle, Play } from "lucide-react";
import type { Contributor, MediaItem } from "@/types";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { MetaRow } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatCompact, formatDuration } from "@/lib/utils";

/**
 * Photo / video card. Videos get a duration chip and a play affordance; photos
 * get nothing but the image and its metadata, so the grid stays quiet.
 */
export function MediaCard({
  item,
  author,
  placeName,
  className,
  aspect,
  showMeta = true,
}: {
  item: MediaItem;
  author?: Contributor | null;
  placeName?: string;
  className?: string;
  aspect?: "1/1" | "4/3" | "3/2" | "16/9" | "3/4" | "2/3";
  showMeta?: boolean;
}) {
  const derivedAspect =
    aspect ??
    (item.orientation === "portrait" ? "3/4" : item.orientation === "square" ? "1/1" : "4/3");

  return (
    <Link
      href={`/gallery/${item.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl2 border border-white/[0.08] bg-ink-850/70 transition-colors duration-300 hover:border-white/20",
        className,
      )}
      aria-label={`${item.title} , ${item.type}`}
    >
      <MediaFrame
        src={item.src}
        poster={item.poster}
        artwork={item.artwork}
        alt={item.title}
        aspect={derivedAspect}
        rounded={false}
        scrim={showMeta}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      >
        {item.type === "video" && (
          <>
            <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-ink-950/60 text-white transition-colors group-hover:border-gold-500/70 group-hover:text-gold-400">
              <Play aria-hidden className="h-3.5 w-3.5 fill-current" />
            </span>
            {item.durationSec ? (
              <span className="absolute right-3 top-3 rounded-full bg-ink-950/75 px-2 py-1 text-[10px] font-medium tabular-nums text-ink-100">
                {formatDuration(item.durationSec)}
              </span>
            ) : null}
          </>
        )}

        {showMeta && (
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="line-clamp-2 text-sm font-medium leading-snug text-white">{item.title}</p>
            {placeName && <p className="mt-1 text-xs text-ink-300">{placeName}</p>}
          </div>
        )}
      </MediaFrame>

      {showMeta && (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          {author ? (
            <span className="flex min-w-0 items-center gap-2">
              <Avatar name={author.displayName} artwork={author.avatar} size="xs" />
              <span className="truncate text-xs text-ink-300">{author.displayName}</span>
            </span>
          ) : (
            <span className="text-xs text-ink-400">Contribution</span>
          )}
          <MetaRow className="shrink-0 gap-x-2.5">
            <span className="inline-flex items-center gap-1">
              <Heart aria-hidden className="h-3.5 w-3.5" />
              {formatCompact(item.likes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle aria-hidden className="h-3.5 w-3.5" />
              {formatCompact(item.comments)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Bookmark aria-hidden className="h-3.5 w-3.5" />
              {formatCompact(item.saves)}
            </span>
          </MetaRow>
        </div>
      )}
    </Link>
  );
}
