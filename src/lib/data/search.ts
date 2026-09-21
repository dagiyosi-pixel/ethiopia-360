import "server-only";

import type { ArchitectureEntry, City, Contributor, MediaItem, Place, Region, Story } from "@/types";
import {
  listArchitecture,
  listCities,
  listContributors,
  listMedia,
  listPlaces,
  listRegions,
  listStories,
} from "@/lib/data/queries";

export type SearchKind =
  | "all"
  | "places"
  | "stories"
  | "photos"
  | "videos"
  | "regions"
  | "cities"
  | "people";

export const SEARCH_KINDS: { value: SearchKind; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "places", label: "Places" },
  { value: "stories", label: "Stories" },
  { value: "photos", label: "Photos" },
  { value: "videos", label: "Videos" },
  { value: "regions", label: "Regions" },
  { value: "cities", label: "Cities" },
  { value: "people", label: "People" },
];

export interface SearchGroup<T> {
  kind: SearchKind;
  label: string;
  items: T[];
  total: number;
}

export interface SearchResults {
  query: string;
  kind: SearchKind;
  groups: SearchGroup<unknown>[];
  total: number;
  /** Narrowing chips derived from the current matches. */
  facets: {
    region: { slug: string; label: string; count: number }[];
    tag: { tag: string; count: number }[];
  };
}

function normalise(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function matches(query: string, ...fields: (string | string[] | undefined)[]): boolean {
  const q = normalise(query);
  return fields.some((field) => {
    if (!field) return false;
    if (Array.isArray(field)) return field.some((f) => normalise(f).includes(q));
    return normalise(field).includes(q);
  });
}

function scoreOf(query: string, primary: string, secondary?: string): number {
  const q = normalise(query);
  const p = normalise(primary);
  if (p === q) return 100;
  if (p.startsWith(q)) return 60;
  if (p.includes(q)) return 30;
  if (secondary && normalise(secondary).includes(q)) return 12;
  return 1;
}

function topN<T>(items: T[], limit: number): T[] {
  return items.slice(0, limit);
}

/**
 * Database-backed search.
 *
 * It loads the public collections and filters in memory — honest about its
 * limits (fine at the current catalogue size) and structured so it can be
 * swapped for Postgres full-text search (`search_vector` in `supabase/schema.sql`)
 * without changing any caller.
 */
export async function searchEverything(
  rawQuery: string,
  kind: SearchKind = "all",
  opts: { region?: string; tag?: string; limit?: number } = {},
): Promise<SearchResults> {
  const query = rawQuery.trim();
  const limit = opts.limit ?? 24;

  const [regions, cities, places, stories, media, people, architecture] = await Promise.all([
    listRegions(),
    listCities(),
    listPlaces(),
    listStories(),
    listMedia(),
    listContributors(),
    listArchitecture(),
  ]);

  if (query.length < 1) {
    return { query, kind, groups: [], total: 0, facets: { region: [], tag: [] } };
  }

  const regionFilter = opts.region;
  const tagFilter = opts.tag;

  const regionMatches: Region[] = regions.items
    .filter(
      (r) =>
        matches(query, r.name, r.nameAm, r.summary, r.capital, r.highlights, r.landscape) ||
        normalise(r.slug).includes(normalise(query)),
    )
    .sort((a, b) => scoreOf(query, b.name) - scoreOf(query, a.name));

  const cityMatches: City[] = cities.items
    .filter((c) => matches(query, c.name, c.nameAm, c.summary, c.knownFor, c.landmarks))
    .sort((a, b) => scoreOf(query, b.name) - scoreOf(query, a.name));

  let placeMatches: Place[] = places.items.filter((p) =>
    matches(query, p.name, p.nameAm, p.summary, p.tags, p.description),
  );
  let storyMatches: Story[] = stories.items.filter((s) =>
    matches(query, s.title, s.titleAm, s.excerpt, s.tags, s.body),
  );
  let mediaMatches: MediaItem[] = media.items.filter((m) =>
    matches(query, m.title, m.caption, m.tags),
  );
  const peopleMatches: Contributor[] = people.items.filter((c) =>
    matches(query, c.displayName, c.username, c.bio, c.location, c.role),
  );
  const architectureMatches: ArchitectureEntry[] = architecture.items.filter((a) =>
    matches(query, a.name, a.summary, a.tags, a.era),
  );

  if (regionFilter) {
    placeMatches = placeMatches.filter((p) => p.regionSlug === regionFilter);
    storyMatches = storyMatches.filter((s) => s.regionSlug === regionFilter);
    mediaMatches = mediaMatches.filter((m) => m.regionSlug === regionFilter);
  }
  if (tagFilter) {
    placeMatches = placeMatches.filter((p) => p.tags.includes(tagFilter));
    storyMatches = storyMatches.filter((s) => s.tags.includes(tagFilter));
    mediaMatches = mediaMatches.filter((m) => m.tags.includes(tagFilter));
  }

  const photoMatches = mediaMatches.filter((m) => m.type === "photo");
  const videoMatches = mediaMatches.filter((m) => m.type === "video");
  const groups: SearchGroup<unknown>[] = [];

  if (kind === "all" || kind === "regions") {
    groups.push({ kind: "regions", label: "Regions", items: topN(regionMatches, limit), total: regionMatches.length });
  }
  if (kind === "all" || kind === "cities") {
    groups.push({ kind: "cities", label: "Cities", items: topN(cityMatches, limit), total: cityMatches.length });
  }
  if (kind === "all" || kind === "places") {
    groups.push({ kind: "places", label: "Places", items: topN(placeMatches, limit), total: placeMatches.length });
  }
  if (kind === "all" || kind === "stories") {
    groups.push({ kind: "stories", label: "Stories", items: topN(storyMatches, limit), total: storyMatches.length });
  }
  if (kind === "all" || kind === "photos") {
    groups.push({ kind: "photos", label: "Photos", items: topN(photoMatches, limit), total: photoMatches.length });
  }
  if (kind === "all" || kind === "videos") {
    groups.push({ kind: "videos", label: "Videos", items: topN(videoMatches, limit), total: videoMatches.length });
  }
  if (kind === "all" || kind === "people") {
    groups.push({ kind: "people", label: "People", items: topN(peopleMatches, limit), total: peopleMatches.length });
  }
  if (architectureMatches.length && (kind === "all" || kind === "places")) {
    groups.push({
      kind: "places",
      label: "Architecture",
      items: topN(architectureMatches, limit),
      total: architectureMatches.length,
    });
  }

  const regionCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  for (const item of [...placeMatches, ...storyMatches, ...mediaMatches]) {
    const slug = item.regionSlug;
    if (slug) regionCounts.set(slug, (regionCounts.get(slug) ?? 0) + 1);
    for (const tag of item.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }

  const facets = {
    region: [...regionCounts.entries()]
      .map(([slug, count]) => ({
        slug,
        label: regions.items.find((r) => r.slug === slug)?.name ?? slug,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    tag: [...tagCounts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
  };

  return {
    query,
    kind,
    groups: groups.filter((g) => g.total > 0),
    total: groups.reduce((sum, g) => sum + g.total, 0),
    facets,
  };
}
