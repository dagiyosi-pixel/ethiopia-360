/**
 * ETHIOPIA//360 — domain types.
 * These mirror the SQL schema in `supabase/schema.sql`. Public routes are slug
 * based; `id` fields are only used for relations inside the app.
 */

export type ContentType =
  | "photo"
  | "video"
  | "story"
  | "place"
  | "event"
  | "history"
  | "architecture";

export type ContentStatus = "draft" | "published" | "pending" | "hidden" | "removed";

/** Category chips used across explore / gallery / upload filters. */
export const CATEGORIES = [
  "places",
  "stories",
  "photos",
  "videos",
  "history",
  "culture",
  "architecture",
  "food",
  "events",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type ArtworkPalette =
  | "highland"
  | "rift"
  | "danakil"
  | "nile"
  | "entoto"
  | "harar"
  | "gold"
  | "basalt";

/** Deterministic procedural artwork descriptor (used when no photo exists yet). */
export interface Artwork {
  palette: ArtworkPalette;
  seed: number;
  motif?: "contour" | "terrace" | "tower" | "weave" | "arch" | "coffee";
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface Region {
  slug: string;
  name: string;
  nameAm: string;
  kind: "region" | "city-administration";
  capital: string;
  coords: Coords;
  zoom: number;
  summary: string;
  description: string;
  artwork: Artwork;
  image?: string | null;
  imageSource?: string | null;
  imageSubject?: string | null;
  landscape: string;
  languages: string[];
  /** Illustrative figures from published public sources — marked approximate. */
  stats: {
    areaKm2?: number;
    populationApprox?: number;
    elevationM?: number;
  };
  highlights: string[];
  /** Slugs of cities in this region. */
  cities: string[];
  /**
   * Key of the boundary feature in `public/geo/ethiopia-regions.geojson`.
   * `null` when no reliable boundary exists for the unit (e.g. regions created
   * after the boundary dataset was published) — those render as markers only.
   */
  geoKey?: string | null;
  /** Shown to the reader when the boundary is approximate or absent. */
  geoNote?: string;
}

export interface City {
  slug: string;
  name: string;
  nameAm: string;
  regionSlug: string;
  coords: Coords;
  zoom: number;
  summary: string;
  description: string;
  artwork: Artwork;
  image?: string | null;
  imageSource?: string | null;
  imageSubject?: string | null;
  elevationM?: number;
  knownFor: string[];
  landmarks: string[];
}

export interface Contributor {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  location: string;
  regionSlug?: string;
  avatar: Artwork;
  role: string;
  joinedAt: string;
  followers: number;
  following: number;
  contributions: number;
  verified: boolean;
}

export interface Place {
  slug: string;
  name: string;
  nameAm?: string;
  category: "nature" | "heritage" | "urban" | "religious" | "market" | "landmark";
  regionSlug: string;
  citySlug?: string;
  coords: Coords;
  summary: string;
  description: string[];
  artwork: Artwork;
  image?: string | null;
  imageSource?: string | null;
  imageSubject?: string | null;
  contributorId: string;
  tags: string[];
  likes: number;
  comments: number;
  saves: number;
  views: number;
  featured: boolean;
  createdAt: string;
}

export interface Story {
  slug: string;
  title: string;
  titleAm?: string;
  excerpt: string;
  /** Paragraphs. Rendered as plain text nodes — no HTML is ever injected. */
  body: string[];
  authorId: string;
  regionSlug?: string;
  citySlug?: string;
  category: Category;
  tags: string[];
  artwork: Artwork;
  image?: string | null;
  imageSource?: string | null;
  imageSubject?: string | null;
  readMinutes: number;
  likes: number;
  comments: number;
  saves: number;
  views: number;
  featured: boolean;
  publishedAt: string;
}

export interface MediaItem {
  id: string;
  slug: string;
  type: "photo" | "video";
  title: string;
  caption: string;
  authorId: string;
  regionSlug?: string;
  citySlug?: string;
  placeSlug?: string;
  category: Category;
  tags: string[];
  artwork: Artwork;
  /** Real media URL once uploaded to storage. Null => procedural artwork. */
  src: string | null;
  /** Poster frame for videos. */
  poster: string | null;
  durationSec?: number;
  orientation: "portrait" | "landscape" | "square";
  likes: number;
  comments: number;
  saves: number;
  views: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  targetType: "post" | "place" | "story" | "photo" | "video";
  targetId: string;
  authorId: string;
  body: string;
  createdAt: string;
  likes: number;
  parentId?: string | null;
  status: ContentStatus;
}

export type HistoryKind = "event" | "figure" | "place" | "relic" | "era";

export interface HistoricalEntry {
  slug: string;
  /** Display label for the timeline axis, e.g. "c. 4th century". */
  period: string;
  sortYear: number;
  kind: HistoryKind;
  title: string;
  summary: string;
  detail: string[];
  location: string;
  regionSlug?: string;
  coords?: Coords;
  artwork: Artwork;
  image?: string | null;
  imageSource?: string | null;
  imageSubject?: string | null;
  tags: string[];
  /** Where the claim comes from; demo copy is explicitly labelled. */
  sourceNote: string;
}

export type CultureCategory =
  | "Languages"
  | "Food"
  | "Coffee"
  | "Music"
  | "Clothing"
  | "Festivals"
  | "Traditions"
  | "Art"
  | "Literature";

export interface CultureTopic {
  slug: string;
  category: CultureCategory;
  name: string;
  nameAm?: string;
  summary: string;
  description: string[];
  regionSlug?: string;
  artwork: Artwork;
  image?: string | null;
  imageSource?: string | null;
  imageSubject?: string | null;
  tags: string[];
  contributorId?: string;
  sourceNote: string;
}

export type ArchitectureCategory =
  | "historic"
  | "traditional"
  | "religious"
  | "urban"
  | "contemporary";

export interface ArchitectureEntry {
  slug: string;
  name: string;
  category: ArchitectureCategory;
  era: string;
  regionSlug: string;
  citySlug?: string;
  coords?: Coords;
  summary: string;
  description: string[];
  image?: string | null;
  imageSource?: string | null;
  imageSubject?: string | null;
  artwork: Artwork;
  contributorId: string;
  tags: string[];
  likes: number;
  views: number;
  featured: boolean;
}

export type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate"
  | "misinformation"
  | "copyright"
  | "other";

export interface Report {
  id: string;
  targetType: "post" | "comment" | "profile";
  targetId: string;
  reason: ReportReason;
  detail?: string;
  reporterId: string;
  createdAt: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
}

export interface Tag {
  slug: string;
  label: string;
  count: number;
}

export type DataSource = "supabase" | "demo";

/** Shape returned by every content-listing query. */
export interface ContentPage<T> {
  items: T[];
  total: number;
  source: DataSource;
}

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  location?: string;
  avatarUrl?: string | null;
  role: "user" | "moderator" | "admin";
  /** True when the session came from the local demo cookie, not Supabase Auth. */
  demo: boolean;
}

export interface UploadFileMeta {
  name: string;
  size: number;
  mime: string;
  previewUrl: string;
  durationSec?: number;
}

export interface UploadDraft {
  type: ContentType;
  title: string;
  description: string;
  regionSlug: string;
  citySlug: string;
  category: Category;
  tags: string[];
  attribution: string;
  files: UploadFileMeta[];
  storyBody: string;
  coords?: Coords | null;
  license: string;
}

export interface ActionResult<T = undefined> {
  ok: boolean;
  code:
    | "ok"
    | "unauthenticated"
    | "unconfigured"
    | "invalid"
    | "forbidden"
    | "rate_limited"
    | "server_error";
  message: string;
  data?: T;
}
