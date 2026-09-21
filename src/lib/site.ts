export const SITE = {
  name: "ETHIOPIA//360",
  tagline: "One country. Thousands of stories.",
  description:
    "A community-built digital record of Ethiopia: places, photographs, stories, history, culture and architecture — mapped, searchable and open to contribution.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export interface NavItem {
  href: string;
  label: string;
  /** Amharic label shown as a secondary line where space allows. */
  labelAm?: string;
  description?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: "/explore", label: "Explore", labelAm: "ያስሱ", description: "Map, regions and filters" },
  { href: "/map", label: "Map", labelAm: "ካርታ", description: "See Ethiopia on the map" },
  { href: "/places", label: "Places", labelAm: "ቦታዎች", description: "Destinations across the country" },
  { href: "/stories", label: "Stories", labelAm: "ታሪኮች", description: "Long-form writing" },
  { href: "/culture", label: "Culture", labelAm: "ባህል", description: "Food, coffee, music, language" },
  { href: "/architecture", label: "Architecture", labelAm: "አርክቴክቸር", description: "Built tradition" },
  { href: "/history", label: "History", labelAm: "ታሪክ", description: "Timeline and places" },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: "/map", label: "Map" },
  { href: "/explore/regions", label: "Regions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/search", label: "Search" },
];

export const MOBILE_NAV: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/map", label: "Map" },
  { href: "/stories", label: "Stories" },
  { href: "/upload", label: "Upload" },
  { href: "/profile", label: "Profile" },
];

/** Explore/gallery filters. Single source of truth for category chips. */
export const CATEGORY_LABELS: Record<string, string> = {
  places: "Places",
  stories: "Stories",
  photos: "Photos",
  videos: "Videos",
  history: "History",
  culture: "Culture",
  architecture: "Architecture",
  food: "Food",
  events: "Events",
};

export const FOOTER_COLUMNS: { title: string; links: NavItem[] }[] = [
  {
    title: "Discover",
    links: [
      { href: "/map", label: "Explore the map" },
      { href: "/explore", label: "Explore" },
      { href: "/explore/regions", label: "Regions" },
      { href: "/places", label: "Places" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    title: "Read",
    links: [
      { href: "/stories", label: "Stories" },
      { href: "/history", label: "History" },
      { href: "/culture", label: "Culture" },
      { href: "/architecture", label: "Architecture" },
    ],
  },
  {
    title: "Contribute",
    links: [
      { href: "/upload", label: "Upload content" },
      { href: "/signup", label: "Create an account" },
      { href: "/login", label: "Sign in" },
      { href: "/settings", label: "Account settings" },
    ],
  },
];

/** Amharic strings used in the interface. Kept in one place for future i18n. */
export const AMHARIC = {
  ethiopia: "ኢትዮጵያ",
  explore: "ያስሱ",
  places: "ቦታዎች",
  stories: "ታሪኮች",
  culture: "ባህል",
  architecture: "አርክቴክቸር",
  history: "የኢትዮጵያ ታሪክ",
  upload: "ያስገቡ",
  search: "ፈልግ",
  profile: "መገለጫ",
} as const;
