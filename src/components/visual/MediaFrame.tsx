import Image from "next/image";
import type { Artwork } from "@/types";
import { cn, safeSrc } from "@/components/visual/media-utils";
import { GeneratedArtwork } from "@/components/visual/GeneratedArtwork";

/**
 * Renders real media when an asset URL exists, otherwise the generated artwork.
 * This is the single place that decides how a "visual" is displayed, so cards
 * never have to know whether content has been uploaded yet.
 */
export function MediaFrame({
  src,
  image,
  poster,
  alt,
  artwork,
  aspect = "4/3",
  className,
  imageClassName,
  scrim = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  rounded = true,
  children,
}: {
  src?: string | null;
  image?: string | null;
  poster?: string | null;
  alt: string;
  artwork: Artwork;
  aspect?: "1/1" | "4/3" | "3/2" | "16/9" | "3/4" | "2/3";
  className?: string;
  imageClassName?: string;
  scrim?: boolean;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
  children?: React.ReactNode;
}) {
  const safe = safeSrc(src ?? image ?? null);
  const safePoster = safeSrc(poster);
  const aspectClass = {
    "1/1": "aspect-square",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "16/9": "aspect-video",
    "3/4": "aspect-[3/4]",
    "2/3": "aspect-[2/3]",
  }[aspect];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-ink-900",
        rounded && "rounded-xl2",
        aspectClass,
        className,
      )}
    >
      {safe ? (
        <Image
          src={safe}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={safePoster ? "blur" : "empty"}
          blurDataURL={safePoster ?? undefined}
          className={cn(
            "object-cover transition-transform duration-700 ease-out will-change-transform motion-safe:group-hover:scale-[1.04]",
            imageClassName,
          )}
        />
      ) : (
        <GeneratedArtwork artwork={artwork} title={alt} scrim={scrim} />
      )}

      {safe && scrim && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent"
        />
      )}
      <span className="sr-only">{alt}</span>
      {children}
    </div>
  );
}
