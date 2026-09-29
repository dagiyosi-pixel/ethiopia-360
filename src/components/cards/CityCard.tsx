import Link from "next/link";
import { MapPin } from "lucide-react";
import type { City } from "@/types";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { Badge, MetaRow } from "@/components/ui/Badge";
import { cn, formatNumber } from "@/lib/utils";

export function CityCard({
  city,
  regionName,
  contentCount,
  className,
}: {
  city: City;
  regionName?: string;
  contentCount?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/city/${city.slug}`}
      className={cn(
        "group flex gap-4 rounded-xl2 border border-white/[0.08] bg-ink-850/70 p-3 transition-colors duration-300 hover:border-white/20 sm:p-4",
        className,
      )}
    >
      <MediaFrame
        src={city.image}
        artwork={city.artwork}
        alt={`${city.name} , generated city artwork`}
        aspect="1/1"
        rounded
        sizes="140px"
        className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg leading-tight text-white">{city.name}</h3>
            <p className="ethiopic truncate text-xs text-ink-400">{city.nameAm}</p>
          </div>
          {regionName && <Badge className="shrink-0">{regionName}</Badge>}
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-300">{city.summary}</p>

        <MetaRow className="mt-2.5">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="h-3.5 w-3.5 text-ink-500" />
            {city.coords.lat.toFixed(2)}°N {city.coords.lng.toFixed(2)}°E
          </span>
          {typeof city.elevationM === "number" && <span>{formatNumber(city.elevationM)} m</span>}
          {typeof contentCount === "number" && (
            <span className="text-ink-400">{contentCount} items</span>
          )}
        </MetaRow>
      </div>
    </Link>
  );
}
