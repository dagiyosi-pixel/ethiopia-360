import type { Coords, MapFilter, MapMarkerKind } from "@/types";

/**
 * Deep links into the shared map (`/map`).
 *
 * Every geographic page links here rather than inventing its own map view, so
 * there is exactly one map route and one marker vocabulary across the product.
 * The map page reads these parameters in `src/app/map/page.tsx`.
 */

export interface MapLinkOptions {
  /** Full marker id, e.g. `place:lalibela-rock-churches`. */
  markerId?: string;
  /** Pre-selected filter chip. */
  filter?: MapFilter;
  /** Centre the view on a point (used when a subject has coordinates but no marker). */
  focus?: Coords & { zoom?: number };
}

export function mapHref(options: MapLinkOptions = {}): string {
  const params = new URLSearchParams();
  if (options.markerId) params.set("marker", options.markerId);
  if (options.filter && options.filter !== "all") params.set("filter", options.filter);
  if (options.focus) {
    params.set("focus", `${options.focus.lat.toFixed(4)},${options.focus.lng.toFixed(4)}`);
    if (options.focus.zoom) params.set("zoom", String(options.focus.zoom));
  }
  const query = params.toString();
  return query ? `/map?${query}` : "/map";
}

/** Jump straight to one marker on the map. */
export function markerMapHref(kind: MapMarkerKind, slug: string, filter?: MapFilter): string {
  return mapHref({ markerId: `${kind}:${slug}`, filter });
}

/** Centre the map on a coordinate pair without selecting a marker. */
export function coordsMapHref(coords: Coords | null | undefined, zoom = 10): string {
  if (!coords) return "/map";
  return mapHref({ focus: { ...coords, zoom } });
}

/** "Show this region on the map" links used by region/city/place pages. */
export function regionMapHref(regionSlug: string): string {
  return mapHref({ markerId: `region:${regionSlug}`, filter: "region" });
}

/** Open a mapped point in Google Maps using its cross-platform Maps URL. */
export function googleMapsPlaceHref(coords: Coords): string {
  const params = new URLSearchParams({ api: "1", query: `${coords.lat},${coords.lng}` });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

/** Ask Google Maps for directions to a mapped point from the user's chosen origin. */
export function googleMapsDirectionsHref(coords: Coords): string {
  const params = new URLSearchParams({ api: "1", destination: `${coords.lat},${coords.lng}` });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
