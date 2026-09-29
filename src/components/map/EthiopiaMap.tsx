"use client";

import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { GeoJSON, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Feature, GeoJsonObject, Geometry } from "geojson";
import type { Layer } from "leaflet";
import { ArrowRight, ExternalLink, Layers, Locate, Navigation, RotateCcw, Search, X } from "lucide-react";
import type { MapFilter, MapMarker, MapMarkerKind } from "@/types";
import { MediaFrame } from "@/components/visual/MediaFrame";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { googleMapsDirectionsHref, googleMapsPlaceHref } from "@/lib/map-links";

/**
 * ETHIOPIA//360 map.
 *
 * This is the single map implementation for the whole application: the /map
 * page, region/city/place/story embeds and community uploads all render through
 * this component. It receives already-normalised `MapMarker` records from the
 * data layer (`src/lib/data/queries.ts`) so community content published to
 * Supabase appears alongside curated seed places , no second marker system.
 *
 * Markers always point at a real route; nothing here is decorative.
 */

const ETHIOPIA_CENTER: [number, number] = [9.15, 39.8];
const ETHIOPIA_ZOOM = 6;
const CLUSTER_MAX_ZOOM = 8;

/**
 * Filter type re-exported from the shared domain types so callers can import it
 * from the map module without reaching into `@/types` themselves.
 */
export type { MapFilter };

interface KindMeta {
  label: string;
  plural: string;
  color: string;
  /** Soft halo behind the dot, same hue as `color`. */
  halo: string;
}

const KIND_META: Record<MapMarkerKind, KindMeta> = {
  region: { label: "Region", plural: "Regions", color: "#e2b354", halo: "rgba(226,179,84,0.35)" },
  city: { label: "City", plural: "Cities", color: "#5aa9e6", halo: "rgba(90,169,230,0.35)" },
  place: { label: "Place", plural: "Places", color: "#e0703f", halo: "rgba(224,112,63,0.35)" },
  story: { label: "Story", plural: "Stories", color: "#3fb98c", halo: "rgba(63,185,140,0.35)" },
  photo: { label: "Photo", plural: "Photos", color: "#9aa8c2", halo: "rgba(154,168,194,0.35)" },
  video: { label: "Video", plural: "Videos", color: "#c4b5fd", halo: "rgba(196,181,253,0.35)" },
  history: { label: "History", plural: "History", color: "#d6a85d", halo: "rgba(214,168,93,0.35)" },
  culture: { label: "Culture", plural: "Culture", color: "#e879a9", halo: "rgba(232,121,169,0.35)" },
  architecture: { label: "Architecture", plural: "Architecture", color: "#7fc7c2", halo: "rgba(127,199,194,0.35)" },
};

const FILTER_ORDER: MapFilter[] = ["all", "place", "city", "story", "photo", "video", "history", "culture", "architecture", "region"];

/* ------------------------------- marker icons ------------------------------ */

function pinIcon(marker: MapMarker, selected: boolean) {
  const meta = KIND_META[marker.kind];
  const size = selected ? 22 : 15;
  const ring = marker.provenance === "community" ? "dashed" : "solid";
  const box = size + 10;
  return L.divIcon({
    className: "e360-marker",
    html:
      `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;` +
      `border-radius:9999px;background:${meta.color};border:2px ${ring} rgba(255,255,255,0.85);` +
      (selected
        ? `box-shadow:0 0 0 4px ${meta.halo},0 0 0 8px rgba(4,6,11,0.75);`
        : `box-shadow:0 0 0 3px rgba(4,6,11,0.8);`) +
      `"></span>`,
    iconSize: [box, box],
    iconAnchor: [box / 2, box / 2],
  });
}

function clusterIcon(count: number, color: string, halo: string) {
  const box = count > 99 ? 46 : count > 9 ? 40 : 34;
  return L.divIcon({
    className: "e360-marker",
    html:
      `<span style="display:flex;align-items:center;justify-content:center;width:${box}px;height:${box}px;` +
      `border-radius:9999px;background:rgba(7,10,18,0.92);border:2px solid ${color};color:#fff;` +
      `font-size:12px;font-weight:600;font-variant-numeric:tabular-nums;box-shadow:0 0 0 5px ${halo};` +
      `">${count}</span>`,
    iconSize: [box, box],
    iconAnchor: [box / 2, box / 2],
  });
}

/* -------------------------------- clustering ------------------------------- */

interface Cluster {
  key: string;
  center: [number, number];
  items: MapMarker[];
}

function cellSize(zoom: number): number {
  if (zoom <= 4) return 3.2;
  if (zoom <= 5) return 1.5;
  if (zoom <= 6) return 0.85;
  if (zoom <= 7) return 0.42;
  return 0.2;
}

/**
 * Grid clustering , deliberately dependency-free. At country scale markers
 * group into counted bubbles; from zoom 9 upward every item stands alone so
 * pins never hide each other.
 */
export function buildClusters(markers: MapMarker[], zoom: number): Cluster[] {
  if (zoom > CLUSTER_MAX_ZOOM) {
    return markers.map((marker) => ({
      key: marker.id,
      center: [marker.lat, marker.lng] as [number, number],
      items: [marker],
    }));
  }

  const size = cellSize(zoom);
  const buckets = new Map<string, MapMarker[]>();

  for (const marker of markers) {
    const key = `${Math.round(marker.lat / size)}:${Math.round(marker.lng / size)}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(marker);
    else buckets.set(key, [marker]);
  }

  const out: Cluster[] = [];
  buckets.forEach((items, key) => {
    const lat = items.reduce((sum, item) => sum + item.lat, 0) / items.length;
    const lng = items.reduce((sum, item) => sum + item.lng, 0) / items.length;
    out.push({ key, center: [lat, lng], items });
  });
  return out;
}


/* --------------------------------- layers --------------------------------- */

function ClusterLayer({
  markers,
  zoom,
  selectedId,
  onSelect,
}: {
  markers: MapMarker[];
  zoom: number;
  selectedId: string | null;
  onSelect: (marker: MapMarker) => void;
}) {
  const map = useMap();
  const clusters = useMemo(() => buildClusters(markers, zoom), [markers, zoom]);

  return (
    <>
      {clusters.map((cluster) => {
        if (cluster.items.length > 1) {
          const kinds = new Set(cluster.items.map((item) => item.kind));
          const shared = kinds.size === 1 ? KIND_META[cluster.items[0].kind] : KIND_META.region;
          const community = cluster.items.some((item) => item.provenance === "community");
          return (
            <Marker
              key={cluster.key}
              position={cluster.center}
              icon={clusterIcon(cluster.items.length, shared.color, shared.halo)}
              keyboard
              title={`${cluster.items.length} items in this area${community ? " (includes community uploads)" : ""}`}
              alt={`${cluster.items.length} mapped items`}
              eventHandlers={{
                click: () => map.setView(cluster.center, Math.min(11, Math.round(zoom) + 2)),
              }}
            />
          );
        }

        const marker = cluster.items[0];
        return (
          <Marker
            key={cluster.key}
            position={[marker.lat, marker.lng]}
            icon={pinIcon(marker, marker.id === selectedId)}
            keyboard
            title={`${marker.title} , ${KIND_META[marker.kind].label}`}
            alt={marker.imageAlt ?? marker.title}
            zIndexOffset={marker.id === selectedId ? 600 : 0}
            eventHandlers={{ click: () => onSelect(marker) }}
          />
        );
      })}
    </>
  );
}

/**
 * Region outlines come from the same GeoJSON the rest of the app uses
 * (geoBoundaries ETH ADM1, built by `scripts/build-geo.mjs`). A failed fetch is
 * silent: the map stays usable without the overlay.
 */
function RegionBoundaries({ onSelectRegion }: { onSelectRegion: (slug: string) => void }) {
  const [data, setData] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/geo/ethiopia-regions.geojson")
      .then((response) => (response.ok ? response.json() : null))
      .then((json: GeoJsonObject | null) => {
        if (!cancelled && json) setData(json);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      style={() => ({
        color: "#e2b354",
        weight: 1,
        opacity: 0.42,
        fillColor: "#e2b354",
        fillOpacity: 0.05,
      })}
      onEachFeature={(feature: Feature<Geometry, { name?: string; slug?: string }>, layer: Layer) => {
        const name = feature?.properties?.name;
        const slug = feature?.properties?.slug;
        if (name) {
          layer.bindTooltip(name, { direction: "center", className: "e360-region-tooltip" });
        }
        if (slug) {
          layer.on("click", () => onSelectRegion(slug));
        }
      }}
    />
  );
}

function ZoomWatcher({ onChange }: { onChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => onChange(map.getZoom()),
  });
  useEffect(() => {
    onChange(map.getZoom());
  }, [map, onChange]);
  return null;
}

function ViewController({
  target,
  onReady,
}: {
  target: { lat: number; lng: number; zoom?: number } | null;
  onReady: (map: L.Map) => void;
}) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], target.zoom ?? Math.max(map.getZoom(), 9), { duration: 0.8 });
  }, [map, target]);

  return null;
}

/* -------------------------------- component ------------------------------- */

export function EthiopiaMap({
  markers,
  className,
  heightClass = "h-[62vh] min-h-[380px] lg:h-[620px]",
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
  /** Restricts markers to a single region (used by region pages). */
  regionSlug?: string | null;
  showHeader?: boolean;
}) {
  const [filter, setFilter] = useState<MapFilter>(initialFilter);
  const [selectedId, setSelectedId] = useState<string | null>(initialMarkerId);
  const [zoom, setZoom] = useState(focus?.zoom ?? ETHIOPIA_ZOOM);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState<L.Map | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(focus);

  const scoped = useMemo(
    () => (regionSlug ? markers.filter((marker) => marker.regionSlug === regionSlug) : markers),
    [markers, regionSlug],
  );

  const counts = useMemo(() => {
    const tally = new Map<MapMarkerKind, number>();
    for (const marker of scoped) tally.set(marker.kind, (tally.get(marker.kind) ?? 0) + 1);
    return tally;
  }, [scoped]);

  const visible = useMemo(() => {
    const needle = searchTerm.trim().toLocaleLowerCase();
    return scoped.filter((marker) => {
      const matchesKind = filter === "all" || marker.kind === filter;
      const matchesText = !needle || [marker.title, marker.subtitle, marker.regionName, marker.category]
        .some((value) => value?.toLocaleLowerCase().includes(needle));
      return matchesKind && matchesText;
    });
  }, [scoped, filter, searchTerm]);

  const selected = useMemo(
    () => visible.find((marker) => marker.id === selectedId) ?? null,
    [visible, selectedId],
  );

  const selectMarker = useCallback((marker: MapMarker) => {
    setSelectedId(marker.id);
    setFlyTarget({ lat: marker.lat, lng: marker.lng, zoom: 11 });
  }, []);

  const resetView = useCallback(() => {
    setSelectedId(null);
    setFlyTarget(null);
    map?.flyTo(focus ? [focus.lat, focus.lng] : ETHIOPIA_CENTER, focus?.zoom ?? ETHIOPIA_ZOOM, {
      duration: 0.8,
    });
  }, [map, focus]);

  const handleRegionClick = useCallback(
    (slug: string) => {
      const marker = scoped.find((item) => item.kind === "region" && item.slug === slug);
      if (marker) selectMarker(marker);
    },
    [scoped, selectMarker],
  );

  const filterChips = FILTER_ORDER.filter(
    (value) => value === "all" || (counts.get(value as MapMarkerKind) ?? 0) > 0,
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showHeader && (
        <div className="flex flex-col gap-3">
          <label className="relative block w-full sm:max-w-md">
            <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search mapped places and stories"
              aria-label="Search mapped items"
              className="h-11 w-full rounded-full border border-white/10 bg-ink-900/80 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-400 focus:border-gold-500/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </label>
          {visible.length === 0 && <p role="status" className="text-sm text-ink-300">No mapped items match. Try another search or category.</p>}
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5">
            {filterChips.map((value) => {
              const active = filter === value;
              const total = value === "all" ? scoped.length : counts.get(value as MapMarkerKind) ?? 0;
              const label = value === "all" ? "Everything" : KIND_META[value as MapMarkerKind].plural;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={active}
                  className={cn("chip shrink-0", active && "chip-active")}
                >
                  {value !== "all" && (
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full"
                      style={{ background: KIND_META[value as MapMarkerKind].color }}
                    />
                  )}
                  {label}
                  <span className="tabular-nums text-ink-400">{total}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-300">
            <button
              type="button"
              onClick={() => setShowBoundaries((value) => !value)}
              aria-pressed={showBoundaries}
              className={cn("chip", showBoundaries && "chip-active")}
            >
              <Layers aria-hidden className="h-3.5 w-3.5" />
              Region boundaries
            </button>
            <button type="button" onClick={resetView} className="chip">
              <RotateCcw aria-hidden className="h-3.5 w-3.5" />
              Reset view
            </button>
            <span className="inline-flex items-center gap-1.5 text-ink-400">
              <Locate aria-hidden className="h-3.5 w-3.5" />
              {visible.length} of {markers.length} mapped items
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-900/80",
            heightClass,
          )}
        >
          <MapContainer
            center={focus ? [focus.lat, focus.lng] : ETHIOPIA_CENTER}
            zoom={focus?.zoom ?? ETHIOPIA_ZOOM}
            scrollWheelZoom
            className="h-full w-full"
            worldCopyJump
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {showBoundaries && <RegionBoundaries onSelectRegion={handleRegionClick} />}
            <ZoomWatcher onChange={setZoom} />
            <ViewController target={flyTarget} onReady={setMap} />
            <ClusterLayer
              markers={visible}
              zoom={zoom}
              selectedId={selectedId}
              onSelect={selectMarker}
            />
          </MapContainer>

          <div className="pointer-events-none absolute bottom-3 left-3 z-20 hidden max-w-[15rem] rounded-2xl border border-white/10 bg-ink-950/85 p-3 text-[11px] leading-relaxed text-ink-200 backdrop-blur-sm sm:block">
            <p className="uppercase tracking-wider2 text-gold-500">Legend</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
              {(Object.keys(KIND_META) as MapMarkerKind[])
                .filter((kind) => (counts.get(kind) ?? 0) > 0)
                .map((kind) => (
                  <li key={kind} className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: KIND_META[kind].color }}
                    />
                    {KIND_META[kind].plural}
                  </li>
                ))}
            </ul>
            <p className="mt-2 text-ink-400">Dashed ring = community upload.</p>
          </div>
        </div>

        <div>
          {selected ? (
            <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-850/85">
              <MediaFrame
                src={selected.image}
                artwork={selected.artwork}
                alt={selected.imageAlt ?? selected.title}
                aspect="16/9"
                rounded={false}
                sizes="(max-width: 1024px) 100vw, 320px"
              />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="gold">{KIND_META[selected.kind].label}</Badge>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Clear selection"
                    className="rounded-full p-1.5 text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X aria-hidden className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="font-display text-xl leading-tight text-white">{selected.title}</h3>
                  {selected.subtitle && (
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-300">{selected.subtitle}</p>
                  )}
                </div>

                <dl className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-400">
                  {selected.regionName && <div>{selected.regionName}</div>}
                  {selected.category && (
                    <div className="uppercase tracking-wider2">{selected.category}</div>
                  )}
                  <div className="tabular-nums">
                    {selected.lat.toFixed(3)}°, {selected.lng.toFixed(3)}°
                  </div>
                </dl>

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <Link
                    href={selected.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3.5 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:bg-gold-400"
                  >
                    Explore
                    <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                  </Link>
                  {selected.regionSlug && (
                    <Link
                      href={`/region/${selected.regionSlug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[13px] text-ink-100 transition-colors hover:border-gold-500/50 hover:text-white"
                    >
                      Region page
                    </Link>
                  )}
                  <a
                    href={googleMapsPlaceHref({ lat: selected.lat, lng: selected.lng })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[13px] text-ink-100 transition-colors hover:border-highland-400/50 hover:text-white"
                  >
                    Google Maps
                    <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={googleMapsDirectionsHref({ lat: selected.lat, lng: selected.lng })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[13px] text-ink-100 transition-colors hover:border-highland-400/50 hover:text-white"
                  >
                    Directions
                    <Navigation aria-hidden className="h-3.5 w-3.5" />
                  </a>
                </div>

                <p
                  className={cn(
                    "text-[11px]",
                    selected.provenance === "community" ? "text-highland-400" : "text-ink-400",
                  )}
                >
                  {selected.provenance === "community" ? "Community upload" : "Curated atlas entry"}
                </p>
              </div>
            </article>
          ) : (
            <div className="flex h-full flex-col justify-center rounded-[1.5rem] border border-dashed border-white/[0.12] bg-ink-850/50 p-6 text-center">
              <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Selected item</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">
                Pick any marker , or a region outline , to preview it here. Every preview links
                straight into its page in the atlas.
              </p>
              <p className="mt-4 text-xs text-ink-400">
                {visible.length} {visible.length === 1 ? "item" : "items"} plotted
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


