import Link from "next/link";
import { Heart, MessageCircle, MapPin } from "lucide-react";
import type { Place } from "@/types";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { Badge, Dot, MetaRow } from "@/components/ui/Badge";
import { cn, formatCompact, formatDate } from "@/lib/utils";

const CATEGORY_TONES = {
  nature: "highland",
  heritage: "gold",
  urban: "nile",
  religious: "rift",
  market: "gold",
  landmark: "neutral",
} as const;

export function PlaceCard({
  place,
  regionName,
  cityName,
  className,
  variant = "standard",
}: {
  place: Place;
  regionName?: string;
  cityName?: string;
  className?: string;
  variant?: "standard" | "wide";
}) {
  if (variant === "wide") {
    return (
      <Link
        href={`/place/${place.slug}`}
        className={cn(
          "premium-card group isolate grid min-w-0 grid-cols-1 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
          className,
        )}
      >
        <MediaFrame
          src={place.image}
          artwork={place.artwork}
          alt={place.name}
          aspect="4/3"
          rounded={false}
          className="w-full min-w-0 sm:aspect-auto sm:h-full sm:min-h-[16rem]"
          sizes="(max-width: 640px) 100vw, 45vw"
        />
        <div className="relative z-10 flex min-w-0 flex-col gap-3 p-5 sm:p-6">
          <Badge tone={CATEGORY_TONES[place.category]}>{place.category}</Badge>
          <h3 className="font-display text-2xl leading-tight text-white transition-colors group-hover:text-gold-400">
            {place.name}
          </h3>
          <p className="text-sm leading-relaxed text-ink-300">{place.summary}</p>
          <PlaceMeta place={place} regionName={regionName} cityName={cityName} className="mt-auto" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/place/${place.slug}`}
      className={cn(
        "premium-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20",
        className,
      )}
    >
      <MediaFrame
        src={place.image}
        artwork={place.artwork}
        alt={place.name}
        aspect="3/2"
        rounded={false}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      >
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone={CATEGORY_TONES[place.category]} className="bg-ink-950/70">
            {place.category}
          </Badge>
        </div>
      </MediaFrame>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="font-display text-lg leading-tight text-white transition-colors group-hover:text-gold-400">
          {place.name}
        </h3>
        {place.nameAm && <p className="ethiopic -mt-1 text-xs text-ink-400">{place.nameAm}</p>}
        <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-300">{place.summary}</p>
        <PlaceMeta place={place} regionName={regionName} cityName={cityName} className="mt-auto pt-1" />
      </div>
    </Link>
  );
}

function PlaceMeta({
  place,
  regionName,
  cityName,
  className,
}: {
  place: Place;
  regionName?: string;
  cityName?: string;
  className?: string;
}) {
  return (
    <MetaRow className={className}>
      <span className="inline-flex items-center gap-1.5">
        <MapPin aria-hidden className="h-3.5 w-3.5 text-ink-500" />
        {cityName ?? regionName ?? "Ethiopia"}
      </span>
      <Dot />
      <span className="inline-flex items-center gap-1.5">
        <Heart aria-hidden className="h-3.5 w-3.5 text-ink-500" />
        {formatCompact(place.likes)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MessageCircle aria-hidden className="h-3.5 w-3.5 text-ink-500" />
        {formatCompact(place.comments)}
      </span>
      <Dot />
      <span>{formatDate(place.createdAt, { month: "short", year: "numeric" })}</span>
    </MetaRow>
  );
}
