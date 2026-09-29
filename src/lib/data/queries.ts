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
  MapMarker,
  MediaItem,
  Place,
  Provenance,
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
import { withCuratedVisual } from "@/data/images";

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

/** Image provenance columns. Kept in one helper so every mapper stays honest. */
function imageFields(r: Row) {
  return {
    image: str(r.image_url) || null,
    imageSource: str(r.image_source) || null,
    imageSubject: str(r.image_subject) || null,
    imageAlt: str(r.image_alt) || null,
  };
}

function optionalCoords(lat: unknown, lng: unknown): Coords | null {
  const hasLat = lat !== null && lat !== undefined && lat !== "";
  const hasLng = lng !== null && lng !== undefined && lng !== "";
  if (!hasLat || !hasLng) return null;
  const parsed = { lat: num(lat, NaN), lng: num(lng, NaN) };
  if (!Number.isFinite(parsed.lat) || !Number.isFinite(parsed.lng)) return null;
  return parsed;
}

/**
 * Seed/demo records all use `u-*` ids for fictional contributors. Anything else
 * came from a real account, so the map and cards can label it as community
 * content instead of implying editorial provenance.
 */
export function provenanceOf(ownerId: string | undefined | null): Provenance {
  if (!ownerId) return "community";
  return ownerId.startsWith("u-") ? "curated" : "community";
}


function page<T>(items: T[], source: DataSource): ContentPage<T> {
  return { items, total: items.length, source };
}

function contentKey(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  for (const field of ["slug", "username", "id"]) {
    if (typeof row[field] === "string" && row[field]) return `${field}:${row[field]}`;
  }
  return null;
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
    // A newly-created Supabase table may be empty, and a partial live dataset
    // should not hide the curated records. Live rows replace matching seed
    // slugs; unrelated editorial and community entries remain available.
    const combined = [...fallback, ...map(rows)];
    const unique = new Map<string, T>();
    combined.forEach((item, index) => unique.set(contentKey(item) ?? `row:${index}`, item));
    return page([...unique.values()], "supabase");
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
  ...imageFields(r),
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
  ...imageFields(r),
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
  ...imageFields(r),
  coords: optionalCoords(r.lat, r.lng),
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
  coords: optionalCoords(r.lat, r.lng),
  imageSource: str(r.image_source) || null,
  imageSubject: str(r.image_subject) || null,
  imageAlt: str(r.image_alt) || null,
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
  citySlug: slugOf(r.city) ?? (typeof r.city_slug === "string" ? r.city_slug : undefined),
  authorId: typeof r.author_id === "string" ? r.author_id : undefined,
  coords: r.lat != null && r.lng != null ? coords(r.lat, r.lng) : undefined,
  artwork: artwork(r.artwork),
  ...imageFields(r),
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
  citySlug: slugOf(r.city) ?? (typeof r.city_slug === "string" ? r.city_slug : undefined),
  coords: optionalCoords(r.lat, r.lng),
  artwork: artwork(r.artwork),
  ...imageFields(r),
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
  ...imageFields(r),
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
  coords: optionalCoords(r.lat, r.lng),
  summary: str(r.summary),
  description: strArray(r.description),
  artwork: artwork(r.artwork),
  ...imageFields(r),
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
    (rows) => rows.map((row) => {
      const region = mapRegion(row);
      return region.image ? region : withCuratedVisual(region, region.name);
    }),
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
      const response = await c.from("historical_entries").select("*, region:regions(slug), city:cities(slug)").eq("status", "published").order("sort_year");
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapHistory),
    seedHistory,
  );
}

export async function listCulture(): Promise<ContentPage<CultureTopic>> {
  return query(
    async (c) => {
      const response = await c.from("culture_topics").select("*, region:regions(slug), city:cities(slug)").eq("status", "published").order("name");
      return { data: response.data, error: response.error };
    },
    (rows) => rows.map(mapCulture),
    seedCulture,
  );
}

export async function listArchitecture(): Promise<ContentPage<ArchitectureEntry>> {
  return query(
    async (c) => {
      const response = await c.from("architecture_entries").select(CONTENT_SELECT).eq("status", "published").order("name");
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

/* ------------------------------------------------------------------------- */
/* Map                                                                        */
/* ------------------------------------------------------------------------- */

/**
 * Every geographic point the platform can plot, normalised into one shape.
 *
 * The map is therefore never a separate hand-maintained list: curated seed
 * content and published community contributions flow through the same query
 * layer, so an upload with a region/city or coordinates becomes discoverable on
 * the map as soon as it is published. Items without a usable point are skipped
 * rather than dropped onto a guessed location.
 */
export async function getMapMarkers(): Promise<{ markers: MapMarker[]; source: DataSource }> {
  const [regions, cities, places, stories, media, history, culture, architecture] = await Promise.all([
    listRegions(),
    listCities(),
    listPlaces(),
    listStories(),
    listMedia(),
    listHistory(),
    listCulture(),
    listArchitecture(),
  ]);

  const regionName = new Map(regions.items.map((region) => [region.slug, region.name]));
  const markers: MapMarker[] = [];

  for (const region of regions.items) {
    markers.push({
      id: `region:${region.slug}`,
      kind: "region",
      slug: region.slug,
      title: region.name,
      subtitle: region.summary,
      lat: region.coords.lat,
      lng: region.coords.lng,
      href: `/region/${region.slug}`,
      regionSlug: region.slug,
      regionName: region.name,
      category: region.kind === "city-administration" ? "city administration" : "region",
      provenance: "curated",
      image: region.image ?? null,
      imageAlt: region.imageAlt ?? null,
      artwork: region.artwork,
    });
  }

  for (const city of cities.items) {
    markers.push({
      id: `city:${city.slug}`,
      kind: "city",
      slug: city.slug,
      title: city.name,
      subtitle: city.summary,
      lat: city.coords.lat,
      lng: city.coords.lng,
      href: `/city/${city.slug}`,
      regionSlug: city.regionSlug,
      regionName: regionName.get(city.regionSlug),
      category: "city",
      provenance: "curated",
      image: city.image ?? null,
      imageAlt: city.imageAlt ?? null,
      artwork: city.artwork,
    });
  }

  for (const place of places.items) {
    if (!place.coords) continue;
    markers.push({
      id: `place:${place.slug}`,
      kind: "place",
      slug: place.slug,
      title: place.name,
      subtitle: place.summary,
      lat: place.coords.lat,
      lng: place.coords.lng,
      href: `/place/${place.slug}`,
      regionSlug: place.regionSlug,
      regionName: regionName.get(place.regionSlug),
      category: place.category,
      provenance: provenanceOf(place.contributorId),
      image: place.image ?? null,
      imageAlt: place.imageAlt ?? null,
      artwork: place.artwork,
    });
  }

  for (const story of stories.items) {
    const point = story.coords;
    if (!point) continue;
    markers.push({
      id: `story:${story.slug}`,
      kind: "story",
      slug: story.slug,
      title: story.title,
      subtitle: story.excerpt,
      lat: point.lat,
      lng: point.lng,
      href: `/story/${story.slug}`,
      regionSlug: story.regionSlug,
      regionName: story.regionSlug ? regionName.get(story.regionSlug) : undefined,
      category: story.category,
      provenance: provenanceOf(story.authorId),
      image: story.image ?? null,
      imageAlt: story.imageAlt ?? null,
      artwork: story.artwork,
    });
  }

  for (const item of media.items) {
    const point = item.coords;
    if (!point) continue;
    markers.push({
      id: `${item.type}:${item.slug}`,
      kind: item.type,
      slug: item.slug,
      title: item.title,
      subtitle: item.caption,
      lat: point.lat,
      lng: point.lng,
      href: `/gallery/${item.slug}`,
      regionSlug: item.regionSlug,
      regionName: item.regionSlug ? regionName.get(item.regionSlug) : undefined,
      category: item.category,
      provenance: provenanceOf(item.authorId),
      image: item.src ?? null,
      imageAlt: item.imageAlt ?? item.title,
      artwork: item.artwork,
    });
  }

  for (const entry of history.items) {
    if (!entry.coords) continue;
    markers.push({
      id: `history:${entry.slug}`, kind: "history", slug: entry.slug, title: entry.title,
      subtitle: entry.summary, lat: entry.coords.lat, lng: entry.coords.lng,
      href: `/history#${entry.slug}`, regionSlug: entry.regionSlug,
      regionName: entry.regionSlug ? regionName.get(entry.regionSlug) : undefined,
      category: entry.kind, provenance: provenanceOf(entry.authorId), image: entry.image ?? null,
      imageAlt: entry.imageAlt ?? entry.title, artwork: entry.artwork,
    });
  }

  for (const topic of culture.items) {
    if (!topic.coords) continue;
    markers.push({
      id: `culture:${topic.slug}`, kind: "culture", slug: topic.slug, title: topic.name,
      subtitle: topic.summary, lat: topic.coords.lat, lng: topic.coords.lng,
      href: `/culture#${topic.slug}`, regionSlug: topic.regionSlug,
      regionName: topic.regionSlug ? regionName.get(topic.regionSlug) : undefined,
      category: topic.category, provenance: provenanceOf(topic.contributorId), image: topic.image ?? null,
      imageAlt: topic.imageAlt ?? topic.name, artwork: topic.artwork,
    });
  }

  for (const entry of architecture.items) {
    if (!entry.coords) continue;
    markers.push({
      id: `architecture:${entry.slug}`, kind: "architecture", slug: entry.slug, title: entry.name,
      subtitle: entry.summary, lat: entry.coords.lat, lng: entry.coords.lng,
      href: `/architecture/${entry.slug}`, regionSlug: entry.regionSlug,
      regionName: regionName.get(entry.regionSlug), category: entry.category,
      provenance: provenanceOf(entry.contributorId), image: entry.image ?? null,
      imageAlt: entry.imageAlt ?? entry.name, artwork: entry.artwork,
    });
  }

  return { markers, source: places.source };
}

export async function getMediaItem(slug: string): Promise<MediaItem | null> {
  const all = await listMedia();
  return (
    all.items.find((item) => item.slug === slug) ??
    seedMedia.find((item) => item.slug === slug) ??
    null
  );
}

export async function getRelatedMedia(slug: string, limit = 4): Promise<MediaItem[]> {
  const all = await listMedia();
  const current = all.items.find((item) => item.slug === slug) ?? seedMedia.find((item) => item.slug === slug);
  if (!current) return all.items.slice(0, limit);
  return all.items
    .filter((item) => item.slug !== slug)
    .map((item) => ({
      item,
      score:
        (item.citySlug && item.citySlug === current.citySlug ? 4 : 0) +
        (item.regionSlug && item.regionSlug === current.regionSlug ? 2 : 0) +
        (item.category === current.category ? 1 : 0) +
        item.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

/**
 * Everything a media detail page needs: the item, its author, the place it was
 * filed under and other media from the same area.
 */
export async function getMediaBundle(slug: string) {
  const item = await getMediaItem(slug);
  if (!item) return null;

  const [author, region, city, related] = await Promise.all([
    item.authorId ? getContributor(item.authorId) : Promise.resolve(null),
    item.regionSlug ? getRegion(item.regionSlug) : Promise.resolve(null),
    item.citySlug ? getCity(item.citySlug) : Promise.resolve(null),
    getRelatedMedia(slug, 4),
  ]);

  return { item, author, region, city, related, provenance: provenanceOf(item.authorId) };
}

/** Place detail bundle: gallery, contributor and related reading in one read. */
export async function getPlaceBundle(slug: string) {
  const place = await getPlace(slug);
  if (!place) return null;

  const [region, city, storiesPage, mediaPage, contributor, related] = await Promise.all([
    getRegion(place.regionSlug),
    place.citySlug ? getCity(place.citySlug) : Promise.resolve(null),
    listStories(),
    listMedia(),
    place.contributorId ? getContributor(place.contributorId) : Promise.resolve(null),
    getRelatedPlaces(place.slug, 3),
  ]);

  const media = mediaPage.items.filter(
    (item) => item.citySlug === place.citySlug || item.regionSlug === place.regionSlug,
  );
  const stories = storiesPage.items.filter(
    (story) => story.citySlug === place.citySlug || story.regionSlug === place.regionSlug,
  );

  return {
    place,
    region,
    city,
    contributor,
    media,
    stories: stories.slice(0, 3),
    related,
    source: mediaPage.source,
    provenance: provenanceOf(place.contributorId),
    communityMedia: media.filter((item) => provenanceOf(item.authorId) === "community"),
  };
}


