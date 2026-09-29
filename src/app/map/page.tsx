import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Layers, MapPin, Sparkles, Upload } from "lucide-react";
import { MapCanvas } from "@/components/map/MapCanvas";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { DemoNotice } from "@/components/ui/states";
import { getMapMarkers, getStats, listRegions } from "@/lib/data/queries";
import type { MapFilter, MapMarker, MapMarkerKind } from "@/types";

/**
 * /map , the central discovery surface.
 *
 * This is a server component on purpose: markers are assembled by the data layer
 * (`getMapMarkers`), so curated seed content and published community uploads
 * travel through exactly the same path, and Leaflet is loaded lazily on the
 * client by `MapCanvas`. Deep links (`?marker=`, `?filter=`, `?focus=`, `?zoom=`)
 * are parsed here, which is what lets region, city, place, story and gallery
 * pages send readers to the same map view instead of embedding their own.
 */

export const metadata: Metadata = {
  title: "Map",
  description:
    "Explore Ethiopia geographically: regions, cities, heritage sites, landscapes, stories and community contributions plotted on one interactive map.",
  alternates: { canonical: "/map" },
  openGraph: {
    title: "Map , explore Ethiopia geographically",
    description:
      "Regions, cities, places, stories and community uploads on a single interactive map of Ethiopia.",
    url: "/map",
  },
};

const FILTERS: MapFilter[] = ["all", "region", "city", "place", "story", "photo", "video", "history", "culture", "architecture"];

const KIND_LABEL: Record<MapMarkerKind, string> = {
  region: "Regions",
  city: "Cities",
  place: "Places",
  story: "Stories",
  photo: "Photos",
  video: "Videos",
  history: "History",
  culture: "Culture",
  architecture: "Architecture",
};

function firstParam(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && raw.trim().length > 0 ? raw.trim() : undefined;
}

function parseFocus(value: string | undefined, zoom: number | undefined) {
  if (!value) return null;
  const [lat, lng] = value.split(",").map((part) => Number(part));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  const safeZoom = typeof zoom === "number" && Number.isFinite(zoom) ? zoom : 10;
  return { lat, lng, zoom: Math.min(18, Math.max(2, safeZoom)) };
}

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [{ markers, source }, stats, regions] = await Promise.all([
    getMapMarkers(),
    getStats(),
    listRegions(),
  ]);

  const requestedMarkerId = firstParam(params.marker);
  const selected: MapMarker | null =
    markers.find((marker) => marker.id === requestedMarkerId) ?? null;

  const requestedFilter = firstParam(params.filter);
  const initialFilter: MapFilter = FILTERS.includes(requestedFilter as MapFilter)
    ? (requestedFilter as MapFilter)
    : "all";

  const zoomParam = Number(firstParam(params.zoom));
  const focus =
    (selected ? { lat: selected.lat, lng: selected.lng, zoom: 11 } : null) ??
    parseFocus(firstParam(params.focus), Number.isFinite(zoomParam) ? zoomParam : undefined);

  const counts = markers.reduce<Partial<Record<MapMarkerKind, number>>>((tally, marker) => {
    tally[marker.kind] = (tally[marker.kind] ?? 0) + 1;
    return tally;
  }, {});
  const communityCount = markers.filter((marker) => marker.provenance === "community").length;
  const photoCount = (counts.photo ?? 0) + (counts.video ?? 0);

  const markersByRegion = markers.reduce<Record<string, number>>((tally, marker) => {
    if (!marker.regionSlug) return tally;
    tally[marker.regionSlug] = (tally[marker.regionSlug] ?? 0) + 1;
    return tally;
  }, {});

  const overview = [
    { label: "Regions & city administrations", value: stats.regions, href: "/explore/regions" },
    { label: "Cities", value: stats.cities, href: "/explore" },
    { label: "Places", value: stats.places, href: "/places" },
    { label: "Stories", value: stats.stories, href: "/stories" },
    { label: "Photos & videos", value: photoCount, href: "/gallery" },
    { label: "Mapped points", value: markers.length, href: "/map" },
  ];

  return (
    <main className="mx-auto max-w-shell px-4 pb-24 pt-5 sm:px-8 lg:pb-28">
      <section className="reveal rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(226,179,84,0.14),_transparent_35%),linear-gradient(135deg,#0a0e18,#04060b_45%,#090d16)] p-5 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Map</p>
            <h1 className="mt-2 max-w-2xl font-display text-4xl leading-[1.05] tracking-tightest text-white sm:text-5xl">
              Explore Ethiopia by geography
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-300 sm:text-base">
              Explore regions, cities and located content across Ethiopia. Pick a marker to preview
              its coordinates, open its atlas page, or continue to Google Maps for directions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-200">
              <Compass aria-hidden className="h-3.5 w-3.5" />
              {source === "supabase" ? "Live database" : "Curated demo data"}
            </span>
            {communityCount > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-highland-500/35 bg-highland-500/10 px-3 py-1.5 text-xs text-highland-300">
                <Sparkles aria-hidden className="h-3.5 w-3.5" />
                {communityCount} community {communityCount === 1 ? "upload" : "uploads"}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {overview.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-gold-500/40 hover:bg-gold-500/[0.04]"
            >
              <p className="text-[11px] uppercase tracking-wider3 text-ink-400">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-white">{item.value}</p>
            </Link>
          ))}
        </div>

        {source === "demo" && (
          <DemoNotice className="mt-5">
            The map is plotting curated seed data. Published content appears here only when it has
            saved coordinates; a region or city label alone is not treated as the content&apos;s exact
            location.
          </DemoNotice>
        )}
      </section>

      <section className="mt-10 rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MapPin aria-hidden className="h-5 w-5 text-gold-400" />
            <h2 className="font-display text-2xl text-white">Interactive Ethiopia map</h2>
          </div>
          {selected && (
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-200">
              Focused: {selected.title}
            </span>
          )}
        </div>

        <MapCanvas
          markers={markers}
          initialFilter={initialFilter}
          initialMarkerId={selected?.id ?? null}
          focus={focus}
        />

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <Layers aria-hidden className="h-3.5 w-3.5" />
            Region boundaries: geoBoundaries ETH ADM1 (CC BY 4.0)
          </span>
          <span>Map data and tiles: © OpenStreetMap contributors</span>
          <span className="tabular-nums">{markers.length} mapped points, clustered by zoom level</span>
        </div>
      </section>
<section className="mt-10 rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Regions</p>
            <h2 className="mt-2 font-display text-2xl text-white">Jump into a region</h2>
          </div>
          <Link
            href="/explore/regions"
            className="text-sm text-ink-200 transition-colors hover:text-gold-400"
          >
            All regions
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {regions.items.map((region) => (
            <Link
              key={region.slug}
              href={`/region/${region.slug}`}
              className="group rounded-2xl border border-white/[0.08] bg-ink-900/60 p-4 transition-colors hover:border-gold-500/40 hover:bg-gold-500/[0.04]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-white">{region.name}</p>
                  <p className="ethiopic mt-1 text-xs text-ink-400">{region.nameAm}</p>
                </div>
                <Badge tone={region.kind === "city-administration" ? "nile" : "neutral"}>
                  {region.kind === "city-administration" ? "City admin" : "Region"}
                </Badge>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-300">
                {region.summary}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-400">
                <span>Capital: {region.capital}</span>
                <span className="tabular-nums">{markersByRegion[region.slug] ?? 0} mapped points</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-wider3 text-gold-500">Reading the map</p>
          <h2 className="mt-2 font-display text-2xl text-white">What the pins mean</h2>
          <ul className="mt-5 grid gap-3 text-sm text-ink-200 sm:grid-cols-2">
            {FILTERS.filter((filter) => filter !== "all").map((filter) => (
              <li
                key={filter}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5"
              >
                <span>{KIND_LABEL[filter as MapMarkerKind]}</span>
                <span className="tabular-nums text-ink-400">
                  {counts[filter as MapMarkerKind] ?? 0}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-ink-400">
            Community uploads are drawn with a dashed ring, curated atlas entries with a solid one.
            Coordinates in this dataset are approximate reference points , good for placing a pin,
            not survey data.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-ink-850/80 p-5 sm:p-6">
          <Upload aria-hidden className="h-5 w-5 text-gold-400" />
          <h2 className="mt-3 font-display text-2xl text-white">Put a place on the map</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            Add coordinates to a contribution to place it on this map. Region and city details still
            connect it to the atlas, but the map will not guess its exact location.
          </p>
          <ButtonLink href="/upload" size="sm" className="mt-5">
            Contribute to the map
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
