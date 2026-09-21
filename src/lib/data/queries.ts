import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ArchitectureEntry,
  City,
  Comment,
  ContentPage,
  Contributor,
  CultureTopic,
  DataSource,
  HistoricalEntry,
  MediaItem,
  Place,
  Region,
  Story,
  Artwork,
  Coords,
  Category,
} from "@/types";
import { isSupabaseConfigured } from "@/lib/env";
import { rankByLatest, rankByTrending } from "@/lib/ranking";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { regions as seedRegions } from "@/data/regions";
import { cities as seedCities } from "@/data/cities";
import { places as seedPlaces } from "@/data/places";
import { stories as seedStories } from "@/data/stories";
import { media as seedMedia } from "@/data/media";
import { contributors as seedContributors } from "@/data/contributors";
import { history as seedHistory } from "@/data/history";
import { cultureTopics as seedCulture } from "@/data/culture";
import { architectureEntries as seedArchitecture } from "@/data/architecture";

/* ------------------------------------------------------------------------- */
/* Low-level helpers                                                          */
/* ------------------------------------------------------------------------- */

type Row = Record<string, any>;

const FALLBACK_ARTWORK: Artwork = { palette: "basalt", seed: 1, motif: "contour" };

function num(value: unknown, fallback = 0): number {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function artwork(value: unknown): Artwork {
  if (value && typeof value === "object" && "palette" in (value as Row)) {
    const a = value as Partial<Artwork>;
    return {
      palette: (a.palette as Artwork["palette"]) ?? FALLBACK_ARTWORK.palette,
      seed: num(a.seed, 1),
      motif: a.motif,
    };
  }
  return FALLBACK_ARTWORK;
}

function coords(lat: unknown, lng: unknown): Coords {
  return { lat: num(lat, 9.0), lng: num(lng, 38.7) };
}

function slugOf(relation: unknown): string | undefined {
  if (relation && typeof relation === "object" && "slug" in (relation as Row)) {
    const slug = (relation as Row).slug;
    return typeof slug === "string" ? slug : undefined;
  }
  return undefined;
}

function page<T>(items: T[], source: DataSource): ContentPage<T> {
  return { items, total: items.length, source };
}

/**
 * Runs a Supabase query when configured; otherwise (or on error) returns the
 * seed data. `source` tells the UI which happened, so demo content can be
 * labelled rather than mistaken for live data.
 */
async function query<T>(
  build: (client: SupabaseClient) => Promise<{ data: unknown; error: { message: string } | null }>,
  map: (rows: Row[]) => T[],
  fallback: T[],
): Promise<ContentPage<T>> {
  if (!isSupabaseConfigured()) return page(fallback, "demo");

  const client = await getSupabaseServerClient();
  if (!client) return page(fallback, "demo");

  try {
    const { data, error } = await build(client);
    if (error) {
      console.warn(`[data] query failed, using seed data: ${error.message}`);
      return page(fallback, "demo");
    }
    const rows = Array.isArray(data) ? (data as Row[]) : [];
    return page(map(rows), "supabase");
  } catch (error) {
    console.warn("[data] unexpected query error, using seed data", error);
    return page(fallback, "demo");
  }
}


/* ------------------------------------------------------------------------- */
/* Row mappers                                                                */
/* ------------------------------------------------------------------------- */

const mapRegion = (r: Row): Region => ({
  slug: str(r.slug),
  name: str(r.name),
  nameAm: str(r.name_am),
  kind: r.kind === "city-administration" ? "city-administration" : "region",
  capital: str(r.capital),
  coords: coords(r.lat, r.lng),
  zoom: num(r.zoom, 7),
  summary: str(r.summary),
  description: str(r.description),
  artwork: artwork(r.artwork),
  landscape: str(r.landscape),
  languages: strArray(r.languages),
  stats: {
    areaKm2: num(r.area_km2, 0) || undefined,
    populationApprox: num(r.population_approx, 0) || undefined,
    elevationM: num(r.elevation_m, 0) || undefined,
  },
  highlights: strArray(r.highlights),
  cities: strArray(r.cities),
  geoKey: typeof r.geo_key === "string" ? r.geo_key : null,
  geoNote: typeof r.geo_note === "string" ? r.geo_note : undefined,
});

const mapCity = (r: Row): City => ({
  slug: str(r.slug),
  name: str(r.name),
  nameAm: str(r.name_am),
  regionSlug: slugOf(r.region) ?? str(r.region_slug),
  coords: coords(r.lat, r.lng),
  zoom: num(r.zoom, 13),
  summary: str(r.summary),
  description: str(r.description),
  artwork: artwork(r.artwork),
  elevationM: num(r.elevation_m, 0) || undefined,
  knownFor: strArray(r.known_for),
  landmarks: strArray(r.landmarks),
});

const mapContributor = (r: Row): Contributor => ({
  id: str(r.id),
  username: str(r.username),
  displayName: str(r.display_name),
  bio: str(r.bio),
  location: str(r.location),
  regionSlug: slugOf(r.region) ?? (typeof r.region_slug === "string" ? r.region_slug : undefined),
  avatar: artwork(r.artwork),
  role: str(r.role, "Contributor"),
  joinedAt: str(r.created_at, new Date().toISOString()).slice(0, 10),
  followers: num(r.followers),
  following: num(r.following),
  contributions: num(r.contributions),
  verified: Boolean(r.verified),
});


const mapStory = (r: Row): Story => ({
  slug: str(r.slug),
  title: str(r.title),
  titleAm: str(r.title_am) || undefined,
  excerpt: str(r.excerpt),
  body: strArray(r.body),
  authorId: str(r.author_id),
  regionSlug: slugOf(r.region) ?? (typeof r.region_slug === "string" ? r.region_slug : undefined),
  citySlug: slugOf(r.city) ?? (typeof r.city_slug === "string" ? r.city_slug : undefined),
  category: (r.category ?? "stories") as Category,
  tags: strArray(r.tags),
  artwork: artwork(r.artwork),
  readMinutes: num(r.read_minutes, 4),
  likes: num(r.likes),
  comments: num(r.comments),
  saves: num(r.saves),
  views: num(r.views),
  featured: Boolean(r.featured),
  publishedAt: str(r.published_at ?? r.created_at, new Date().toISOString()).slice(0, 10),
});

const mapMedia = (r: Row): MediaItem => ({
  id: str(r.id),
  slug: str(r.slug),
  type: r.type === "video" ? "video" : "photo",
  title: str(r.title),
  caption: str(r.caption),
  authorId: str(r.author_id),
  regionSlug: slugOf(r.region) ?? (typeof r.region_slug === "string" ? r.region_slug : undefined),
  citySlug: slugOf(r.city) ?? (typeof r.city_slug === "string" ? r.city_slug : undefined),
  placeSlug: slugOf(r.place),
  category: (r.category ?? "photos") as Category,
  tags: strArray(r.tags),
  artwork: artwork(r.artwork),
  src: typeof r.asset_url === "string" ? r.asset_url : null,
  poster: typeof r.poster_url === "string" ? r.poster_url : null,
  durationSec: num(r.duration_sec, 0) || undefined,
  orientation: (r.orientation ?? "landscape") as MediaItem["orientation"],
  likes: num(r.likes),
  comments: num(r.comments),
  saves: num(r.saves),
  views: num(r.views),
  createdAt: str(r.created_at, new Date().toISOString()).slice(0, 10),
});

const mapComment = (r: Row): Comment => ({
  id: str(r.id),
  targetType: (r.target_type ?? "post") as Comment["targetType"],
  targetId: str(r.target_id),
  authorId: str(r.author_id),
  body: str(r.body),
  createdAt: str(r.created_at, new Date().toISOString()),
  likes: num(r.likes),
  parentId: typeof r.parent_id === "string" ? r.parent_id : null,
  status: (r.status ?? "published") as Comment["status"],
});

const mapHistory = (r: Row): HistoricalEntry => ({
  slug: str(r.slug),
  period: str(r.period),
  sortYear: num(r.sort_year),
  kind: (r.kind ?? "event") as HistoricalEntry["kind"],
  title: str(r.title),
  summary: str(r.summary),
  detail: strArray(r.detail),
  location: str(r.location),
  regionSlug: slugOf(r.region) ?? (typeof r.region_slug === "string" ? r.region_slug : undefined),
  coords: r.lat != null && r.lng != null ? coords(r.lat, r.lng) : undefined,
  artwork: artwork(r.artwork),
  tags: strArray(r.tags),
  sourceNote: str(r.source_note),
});

const mapCulture = (r: Row): CultureTopic => ({
  slug: str(r.slug),
  category: (r.category ?? "Traditions") as CultureTopic["category"],
  name: str(r.name),
  nameAm: str(r.name_am) || undefined,
  summary: str(r.summary),
  description: strArray(r.description),
  regionSlug: slugOf(r.region) ?? (typeof r.region_slug === "string" ? r.region_slug : undefined),
  artwork: artwork(r.artwork),
  tags: strArray(r.tags),
  contributorId: typeof r.author_id === "string" ? r.author_id : undefined,
  sourceNote: str(r.source_note),
});

const mapArchitecture = (r: Row): ArchitectureEntry => ({
  slug: str(r.slug),
  name: str(r.name),
  category: (r.category ?? "historic") as ArchitectureEntry["category"],
  era: str(r.era),
  regionSlug: slugOf(r.region) ?? str(r.region_slug),
  citySlug: slugOf(r.city) ?? (typeof r.city_slug === "string" ? r.city_slug : undefined),
  coords: r.lat != null && r.lng != null ? coords(r.lat, r.lng) : undefined,
  summary: str(r.summary),
  description: strArray(r.description),
  artwork: artwork(r.artwork),
  contributorId: str(r.author_id),
  tags: strArray(r.tags),
  likes: num(r.likes),
  views: num(r.views),
  featured: Boolean(r.featured),
});

const CONTENT_SELECT = "*, region:regions(slug), city:cities(slug)";

const mapPlace = (r: Row): Place => ({
  slug: str(r.slug),
  name: str(r.name),
  nameAm: str(r.name_am) || undefined,
  category: (r.category ?? "landmark") as Place["category"],
  regionSlug: slugOf(r.region) ?? str(r.region_slug),
  citySlug: slugOf(r.city) ?? (typeof r.city_slug === "string" ? r.city_slug : undefined),
  coords: coords(r.lat, r.lng),
  summary: str(r.summary),
  description: strArray(r.description),
  artwork: artwork(r.artwork),
  contributorId: str(r.author_id ?? r.contributor_id),
  tags: strArray(r.tags),
  likes: num(r.likes),
  comments: num(r.comments),
  saves: num(r.saves),
  views: num(r.views),
  featured: Boolean(r.featured),
  createdAt: str(r.created_at, new Date().toISOString()).slice(0, 10),
});

/* ------------------------------------------------------------------------- */
/* Public query API                                                           */
/* ------------------------------------------------------------------------- */

export async function listRegions(): Promise<ContentPage<Region>> {
  return query(
    async (c) => {
      const response = await c.from("regions").select("*").order("name");
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapRegion),
    seedRegions,
  );
}

export async function listCities(): Promise<ContentPage<City>> {
  return query(
    async (c) => {
      const response = await c.from("cities").select("*, region:regions(slug)").order("name");
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapCity),
    seedCities,
  );
}

export async function listContributors(): Promise<ContentPage<Contributor>> {
  return query(
    async (c) => {
      const response = await c
        .from("profiles")
        .select("*, region:regions(slug)")
        .eq("is_public", true)
        .order("contributions", { ascending: false });
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapContributor),
    seedContributors,
  );
}

export async function listPlaces(): Promise<ContentPage<Place>> {
  return query(
    async (c) => {
      const response = await c.from("places").select(CONTENT_SELECT).eq("status", "published").order("created_at", { ascending: false });
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapPlace),
    seedPlaces,
  );
}

export async function listStories(): Promise<ContentPage<Story>> {
  return query(
    async (c) => {
      const response = await c.from("stories").select(CONTENT_SELECT).eq("status", "published").order("published_at", { ascending: false });
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapStory),
    seedStories,
  );
}

export async function listMedia(): Promise<ContentPage<MediaItem>> {
  return query(
    async (c) => {
      const response = await c.from("media").select(CONTENT_SELECT).eq("status", "published").order("created_at", { ascending: false });
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapMedia),
    seedMedia,
  );
}

export async function listHistory(): Promise<ContentPage<HistoricalEntry>> {
  return query(
    async (c) => {
      const response = await c.from("historical_entries").select("*").order("sort_year");
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapHistory),
    seedHistory,
  );
}

export async function listCulture(): Promise<ContentPage<CultureTopic>> {
  return query(
    async (c) => {
      const response = await c.from("culture_topics").select("*, region:regions(slug)").order("name");
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapCulture),
    seedCulture,
  );
}

export async function listArchitecture(): Promise<ContentPage<ArchitectureEntry>> {
  return query(
    async (c) => {
      const response = await c.from("architecture_entries").select(CONTENT_SELECT).order("name");
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapArchitecture),
    seedArchitecture,
  );
}

export async function listComments(targetId: string): Promise<ContentPage<Comment>> {
  return query(
    async (c) => {
      const response = await c
        .from("comments")
        .select("*")
        .eq("target_id", targetId)
        .eq("status", "published")
        .order("created_at", { ascending: false });
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapComment),
    [],
  );
}

/* ------------------------------- by slug --------------------------------- */

export async function getRegion(slug: string): Promise<Region | null> {
  const all = await listRegions();
  return all.items.find((r) => r.slug === slug) ?? seedRegions.find((r) => r.slug === slug) ?? null;
}

export async function getCity(slug: string): Promise<City | null> {
  const all = await listCities();
  return all.items.find((c) => c.slug === slug) ?? seedCities.find((c) => c.slug === slug) ?? null;
}

export async function getPlace(slug: string): Promise<Place | null> {
  const all = await listPlaces();
  return all.items.find((p) => p.slug === slug) ?? seedPlaces.find((p) => p.slug === slug) ?? null;
}

export async function getStory(slug: string): Promise<Story | null> {
  const all = await listStories();
  return all.items.find((s) => s.slug === slug) ?? seedStories.find((s) => s.slug === slug) ?? null;
}

export async function getArchitectureEntry(slug: string): Promise<ArchitectureEntry | null> {
  const all = await listArchitecture();
  return (
    all.items.find((a) => a.slug === slug) ?? seedArchitecture.find((a) => a.slug === slug) ?? null
  );
}

export async function getContributorByUsername(username: string): Promise<Contributor | null> {
  const all = await listContributors();
  return (
    all.items.find((c) => c.username === username) ??
    seedContributors.find((c) => c.username === username) ??
    null
  );
}

export async function getContributorsByIds(ids: string[]): Promise<Contributor[]> {
  const all = await listContributors();
  const wanted = new Set(ids);
  const found = all.items.filter((c) => wanted.has(c.id));
  if (found.length === ids.length) return found;
  // Ensure every requested id resolves, even if the live table is partial.
  return ids
    .map(
      (id) =>
        found.find((c) => c.id === id) ??
        seedContributors.find((c) => c.id === id) ??
        null,
    )
    .filter((c): c is Contributor => Boolean(c));
}

export async function getContributor(id: string): Promise<Contributor | null> {
  const all = await listContributors();
  return all.items.find((c) => c.id === id) ?? seedContributors.find((c) => c.id === id) ?? null;
}

/* ------------------------------------------------------------------------- */
/* Discovery                                                                  */
/* ------------------------------------------------------------------------- */

export interface Stats {
  regions: number;
  cities: number;
  places: number;
  stories: number;
  photos: number;
  videos: number;
  contributors: number;
  architecture: number;
  source: DataSource;
}

export async function getStats(): Promise<Stats> {
  const [r, c, p, s, m, u, a] = await Promise.all([
    listRegions(),
    listCities(),
    listPlaces(),
    listStories(),
    listMedia(),
    listContributors(),
    listArchitecture(),
  ]);

  return {
    regions: r.total,
    cities: c.total,
    places: p.total,
    stories: s.total,
    photos: m.items.filter((item) => item.type === "photo").length,
    videos: m.items.filter((item) => item.type === "video").length,
    contributors: u.total,
    architecture: a.total,
    source: r.source,
  };
}

export async function getTrendingStories(limit = 6): Promise<ContentPage<Story>> {
  const all = await listStories();
  return page(rankByTrending(all.items).slice(0, limit), all.source);
}

export async function getTrendingPlaces(limit = 6): Promise<ContentPage<Place>> {
  const all = await listPlaces();
  return page(rankByTrending(all.items).slice(0, limit), all.source);
}

export async function getTrendingMedia(limit = 8): Promise<ContentPage<MediaItem>> {
  const all = await listMedia();
  return page(rankByTrending(all.items).slice(0, limit), all.source);
}

export async function getFeaturedStories(limit = 3): Promise<ContentPage<Story>> {
  const all = await listStories();
  const featured = all.items.filter((s) => s.featured);
  const pool = featured.length >= limit ? featured : all.items;
  return page(rankByTrending(pool).slice(0, limit), all.source);
}

export async function getFeaturedPlaces(limit = 4): Promise<ContentPage<Place>> {
  const all = await listPlaces();
  const featured = all.items.filter((p) => p.featured);
  const pool = featured.length >= limit ? featured : all.items;
  return page(rankByTrending(pool).slice(0, limit), all.source);
}

export async function getFeaturedMedia(limit = 6): Promise<ContentPage<MediaItem>> {
  const all = await listMedia();
  return page(rankByLatest(all.items).slice(0, limit), all.source);
}

export async function getTopContributors(limit = 6): Promise<ContentPage<Contributor>> {
  const all = await listContributors();
  return page(all.items.slice(0, limit), all.source);
}

export async function getRegionBundle(regionSlug: string) {
  const [region, placesPage, storiesPage, mediaPage, contributorsPage, architecturePage, citiesPage] =
    await Promise.all([
      getRegion(regionSlug),
      listPlaces(),
      listStories(),
      listMedia(),
      listContributors(),
      listArchitecture(),
      listCities(),
    ]);

  if (!region) return null;

  return {
    region,
    cities: citiesPage.items.filter((c) => c.regionSlug === regionSlug),
    places: placesPage.items.filter((p) => p.regionSlug === regionSlug),
    stories: storiesPage.items.filter((s) => s.regionSlug === regionSlug),
    media: mediaPage.items.filter((m) => m.regionSlug === regionSlug),
    architecture: architecturePage.items.filter((a) => a.regionSlug === regionSlug),
    contributors: contributorsPage.items.filter((c) => c.regionSlug === regionSlug),
    source: placesPage.source,
  };
}

export async function getCityBundle(citySlug: string) {
  const city = await getCity(citySlug);
  if (!city) return null;

  const [placesPage, storiesPage, mediaPage, contributorsPage, architecturePage] = await Promise.all([
    listPlaces(),
    listStories(),
    listMedia(),
    listContributors(),
    listArchitecture(),
  ]);

  const region = await getRegion(city.regionSlug);

  return {
    city,
    region,
    places: placesPage.items.filter((p) => p.citySlug === citySlug),
    stories: storiesPage.items.filter((s) => s.citySlug === citySlug),
    media: mediaPage.items.filter((m) => m.citySlug === citySlug),
    architecture: architecturePage.items.filter((a) => a.citySlug === citySlug),
    contributors: contributorsPage.items.filter((c) => c.regionSlug === city.regionSlug),
    source: placesPage.source,
  };
}

export async function getRelatedPlaces(slug: string, limit = 3): Promise<Place[]> {
  const [all, current] = await Promise.all([listPlaces(), getPlace(slug)]);
  if (!current) return all.items.slice(0, limit);
  const sameRegion = all.items.filter((p) => p.slug !== slug && p.regionSlug === current.regionSlug);
  const sharedTags = all.items.filter(
    (p) => p.slug !== slug && p.tags.some((t) => current.tags.includes(t)),
  );
  const merged = [...sameRegion, ...sharedTags, ...all.items.filter((p) => p.slug !== slug)];
  const seen = new Set<string>();
  const out: Place[] = [];
  for (const place of merged) {
    if (seen.has(place.slug)) continue;
    seen.add(place.slug);
    out.push(place);
    if (out.length >= limit) break;
  }
  return out;
}

export async function getRelatedStories(slug: string, limit = 3): Promise<Story[]> {
  const all = await listStories();
  const current = all.items.find((s) => s.slug === slug);
  if (!current) return all.items.slice(0, limit);
  return all.items
    .filter((s) => s.slug !== slug)
    .map((s) => ({
      story: s,
      score:
        (s.category === current.category ? 3 : 0) +
        (s.regionSlug && s.regionSlug === current.regionSlug ? 2 : 0) +
        s.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.story);
}

export async function getStoriesByAuthor(authorId: string): Promise<Story[]> {
  const all = await listStories();
  return all.items.filter((s) => s.authorId === authorId);
}

export async function getMediaByAuthor(authorId: string): Promise<MediaItem[]> {
  const all = await listMedia();
  return all.items.filter((m) => m.authorId === authorId);
}

export async function getPlacesByContributor(authorId: string): Promise<Place[]> {
  const all = await listPlaces();
  return all.items.filter((p) => p.contributorId === authorId);
}

export async function getArchitectureByContributor(authorId: string): Promise<ArchitectureEntry[]> {
  const all = await listArchitecture();
  return all.items.filter((a) => a.contributorId === authorId);
}

