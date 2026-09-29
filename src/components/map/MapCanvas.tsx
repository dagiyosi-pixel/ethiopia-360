"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/types";
import type { MapFilter } from "@/components/map/EthiopiaMap";

/**
 * Lazy boundary for the Leaflet map.
 *
 * Leaflet touches `window` at import time, so the map must never be part of the
 * server render. This tiny client wrapper is the only place that dynamic-imports
 * `EthiopiaMap`; server components pass already-serialised markers into it.
 */
const EthiopiaMap = dynamic(
  () => import("@/components/map/EthiopiaMap").then((mod) => mod.EthiopiaMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[62vh] min-h-[380px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-ink-900/80 text-sm text-ink-300 lg:h-[620px]">
        Loading map…
      </div>
    ),
  },
);

export function MapCanvas({
  markers,
  className,
  heightClass,
  initialFilter = "all",
  initialMarkerId = null,
  focus = null,
  regionSlug = null,
  showHeader = true,
}: {
  markers: MapMarker[];
  className?: string;
  heightClass?: string;
  initialFilter?: MapFilter;
  initialMarkerId?: string | null;
  focus?: { lat: number; lng: number; zoom?: number } | null;
  regionSlug?: string | null;
  showHeader?: boolean;
}) {
  return (
    <EthiopiaMap
      markers={markers}
      className={className}
      heightClass={heightClass}
      initialFilter={initialFilter}
      initialMarkerId={initialMarkerId}
      focus={focus}
      regionSlug={regionSlug}
      showHeader={showHeader}
    />
  );
}
