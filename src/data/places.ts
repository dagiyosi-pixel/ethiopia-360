import type { Place } from "@/types";
import { applyCuratedVisuals } from "@/data/images";

/**
 * DEMO SEED DATA , places.
 * Coordinates are approximate visitor-entrance points, good enough for map
 * pins. Descriptive copy is illustrative development copy, not a verified
 * travel guide. Append above SEED_PLACES_END.
 */
const placeSeed: Place[] = [
  {
    slug: "lalibela-rock-churches",
    name: "Lalibela Rock-Hewn Churches",
    nameAm: "ላሊበላ ውቅር አብያተ ክርስቲያናት",
    category: "religious",
    regionSlug: "amhara",
    citySlug: "lalibela",
    coords: { lat: 12.0317, lng: 39.0413 },
    summary:
      "Eleven churches cut downward into volcanic tuff, joined by trenches, tunnels and courtyards carved from the same rock.",
    description: [
      "The churches at Lalibela were not built upward from a foundation. Each was excavated from a single mass of volcanic tuff, so the visitor descends into a building whose walls and roof were never assembled.",
      "The complex sits in the middle of an active town and daily worship continues in most of the churches. Go early if you want the courtyards before the tour groups arrive.",
    ],
    artwork: { palette: "rift", seed: 401, motif: "arch" },
    contributorId: "u-dawit",
    tags: ["unesco", "rock-hewn", "pilgrimage", "highlands"],
    likes: 2841,
    comments: 96,
    saves: 1180,
    views: 41200,
    featured: true,
    createdAt: "2024-03-04",
  },
  {
    slug: "lake-tana-monasteries",
    name: "Lake Tana Island Monasteries",
    category: "religious",
    regionSlug: "amhara",
    citySlug: "bahir-dar",
    coords: { lat: 11.9, lng: 37.3 },
    summary:
      "Papyrus-boat country: island and peninsula monasteries on Ethiopia's largest lake, several holding painted manuscript tradition.",
    description: [
      "Lake Tana spreads across the highland basin, dotted with islands and peninsulas that have hosted monastic communities for centuries. Access is by tankwa, the local papyrus boat, or by motorboat from Bahir Dar.",
      "Several monasteries hold wall paintings and manuscript collections. Photography rules vary by site and season , ask before raising a camera.",
    ],
    artwork: { palette: "nile", seed: 402, motif: "contour" },
    contributorId: "u-selam",
    tags: ["lake", "monastery", "manuscripts", "boats"],
    likes: 1920,
    comments: 61,
    saves: 740,
    views: 26800,
    featured: true,
    createdAt: "2024-02-18",
  },
  {
    slug: "simien-mountains",
    name: "Simien Mountains",
    category: "nature",
    regionSlug: "amhara",
    coords: { lat: 13.2, lng: 38.2 },
    summary:
      "Escarpment country of sheer basalt walls and high plateau, home to gelada troops and the walia ibex.",
    description: [
      "The Simien massif is a wall of eroded basalt rising above the northern plateau, with camp sites set on the rim above enormous drops. Ras Dashen, the country's highest point, sits in the same range.",
      "Altitude is serious here , most trekking routes stay above 3,000 metres. Acclimatise first and carry layers; the swing between midday sun and night is severe.",
    ],
    artwork: { palette: "basalt", seed: 403, motif: "contour" },
    contributorId: "u-abebe",
    tags: ["trekking", "gelada", "escarpment", "national-park"],
    likes: 3120,
    comments: 142,
    saves: 1650,
    views: 52400,
    featured: true,
    createdAt: "2024-01-22",
  },
  {
    slug: "harar-jugol",
    name: "Harar Jugol",
    category: "heritage",
    regionSlug: "harari",
    citySlug: "harar",
    coords: { lat: 9.3117, lng: 42.1281 },
    summary:
      "The walled town of Harar: dense lanes, carved wooden doorways, gated courtyards and a cultural interior tradition.",
    description: [
      "Harar Jugol is entered through historic gates in a continuous wall. Inside, the street pattern folds around courtyard houses rather than running straight, which keeps the lanes shaded and private.",
      "The interiors are what most visitors remember: painted walls, stacked baskets, and coffee roasted and served in the same room.",
    ],
    artwork: { palette: "harar", seed: 404, motif: "arch" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Harar Jugol photograph.",
    imageSubject: "Harar Jugol",
    contributorId: "u-yusuf",
    tags: ["walled-city", "unesco", "courtyards", "coffee"],
    likes: 2410,
    comments: 88,
    saves: 1090,
    views: 33900,
    featured: true,
    createdAt: "2024-04-02",
  },
  {
    slug: "bale-mountains",
    name: "Bale Mountains",
    category: "nature",
    regionSlug: "oromia",
    coords: { lat: 6.85, lng: 39.8 },
    summary:
      "Afro-alpine plateau above 4,000 metres, with juniper forest, the Sanetti plateau and the Harenna cloud forest below.",
    description: [
      "The Bale massif holds one of the largest areas of afro-alpine habitat in Africa. The Sanetti plateau is open, high and cold, while the southern slope drops into Harenna's damp cloud forest.",
      "Endemic wildlife is the draw: the Ethiopian wolf is most often seen here in the early morning and late afternoon.",
    ],
    artwork: { palette: "highland", seed: 405, motif: "contour" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Bale Mountains photograph.",
    imageSubject: "Bale Mountains",
    contributorId: "u-abebe",
    tags: ["afro-alpine", "endemic", "wolves", "plateau"],
    likes: 2760,
    comments: 103,
    saves: 1320,
    views: 38700,
    featured: true,
    createdAt: "2024-02-05",
  },
  {
    slug: "danakil-depression",
    name: "Danakil Depression",
    category: "nature",
    regionSlug: "afar",
    coords: { lat: 14.24, lng: 40.3 },
    summary:
      "Salt flats, sulphur terraces and active lava lakes in a rift basin that drops below sea level.",
    description: [
      "The Danakil is a rift basin of salt pans, hot springs and volcanic vents. Dallol's sulphur formations sit on a layer of salt that has been cut into slabs for generations and moved out by camel caravan.",
      "This is genuinely extreme heat , trips run at night and in the cooler months for good reason. Travel with an organised convoy and local guides rather than independently.",
    ],
    artwork: { palette: "danakil", seed: 406, motif: "terrace" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Danakil photograph.",
    imageSubject: "Danakil Depression",
    contributorId: "u-meron",
    tags: ["desert", "volcanic", "salt", "extreme"],
    likes: 3480,
    comments: 171,
    saves: 2010,
    views: 61300,
    featured: true,
    createdAt: "2024-01-14",
  },
  {
    slug: "merkato",
    name: "Merkato",
    category: "market",
    regionSlug: "addis-ababa",
    citySlug: "addis-ababa",
    coords: { lat: 9.0345, lng: 38.7409 },
    summary:
      "One of the largest open-air trading districts in Africa , kilometres of stalls grouped by what they sell.",
    description: [
      "Merkato is not a single market but a district of specialist quarters: coffee, spices, metalwork, recycled electronics, textiles. Each trade occupies its own street or block.",
      "Go with a purpose and a local guide. Navigation is genuinely difficult, and the fastest way to learn the layout is to follow one commodity from wholesale to retail.",
    ],
    artwork: { palette: "gold", seed: 407, motif: "weave" },
    contributorId: "u-rahel",
    tags: ["market", "trade", "coffee", "urban"],
    likes: 2210,
    comments: 74,
    saves: 690,
    views: 29400,
    featured: false,
    createdAt: "2024-05-12",
  },
  {
    slug: "entoto-park",
    name: "Entoto Ridge",
    category: "urban",
    regionSlug: "addis-ababa",
    citySlug: "addis-ababa",
    coords: { lat: 9.0878, lng: 38.7594 },
    summary:
      "The eucalyptus ridge above the capital: forest trails, a viewpoint over the city bowl and the old imperial churches.",
    description: [
      "Entoto is the northern ridge that frames Addis Ababa. Eucalyptus was planted here in the late 19th century to supply the new capital with fuel, and the resulting forest is now the city's closest walking country.",
      "On clear mornings the whole city bowl is visible from the upper road, with the Entoto Maryam churches just below.",
    ],
    artwork: { palette: "entoto", seed: 408, motif: "contour" },
    contributorId: "u-tomas",
    tags: ["viewpoint", "forest", "walking", "urban"],
    likes: 1640,
    comments: 52,
    saves: 480,
    views: 19700,
    featured: false,
    createdAt: "2024-06-01",
  },
  {
    slug: "sof-omar-caves",
    name: "Sof Omar Caves",
    category: "nature",
    regionSlug: "oromia",
    coords: { lat: 6.9108, lng: 40.1897 },
    summary:
      "A river-cut limestone cave system with huge chambers, accessed through a narrow gorge and local footpaths.",
    description: [
      "The Web river has cut a long limestone cave system through the Bale lowlands, with chambers tall enough to hold a cathedral. Local guides lead the route, which includes wading and sections of narrow passage.",
      "It is remote: plan the access road carefully and treat the walk in as part of the trip rather than a formality.",
    ],
    artwork: { palette: "danakil", seed: 409, motif: "terrace" },
    contributorId: "u-abebe",
    tags: ["caves", "limestone", "remoteness", "geology"],
    likes: 1180,
    comments: 39,
    saves: 520,
    views: 14600,
    featured: false,
    createdAt: "2024-04-27",
  },
  {
    slug: "konso-terraces",
    name: "Konso Cultural Landscape",
    category: "heritage",
    regionSlug: "south-ethiopia",
    coords: { lat: 5.3, lng: 37.4 },
    summary:
      "Dry-stone terracing built up over generations on steep slopes, alongside a distinctive carved wooden tradition.",
    description: [
      "Konso's hillsides are held in place by dry-stone terraces, some of them centuries old and still farmed. The terracing is a working agricultural system rather than a monument.",
      "The area is also known for carved wooden figures associated with memorial practices, documented in local tradition and held in several museum collections.",
    ],
    artwork: { palette: "rift", seed: 410, motif: "terrace" },
    contributorId: "u-tomas",
    tags: ["unesco", "terracing", "agriculture", "carving"],
    likes: 1420,
    comments: 47,
    saves: 610,
    views: 17300,
    featured: false,
    createdAt: "2024-03-19",
  },
];

/**
 * Verified imagery is attached from the central registry in `src/data/images.ts`.
 * The registry only contains photographs that genuinely depict the subject; the
 * Harar entry, for example, is a gate in the Jugol wall , not a generic street
 * photograph from elsewhere. Places without a verified photograph keep an
 * explicitly labelled neutral generated visual.
 */
export const places: Place[] = applyCuratedVisuals(placeSeed, (place) => place.name);

export const placeBySlug = new Map(places.map((p) => [p.slug, p]));

export function getPlaceSeed(slug: string): Place | undefined {
  return placeBySlug.get(slug);
}

export function placesInRegion(regionSlug: string): Place[] {
  return places.filter((p) => p.regionSlug === regionSlug);
}

export function placesInCity(citySlug: string): Place[] {
  return places.filter((p) => p.citySlug === citySlug);
}
// SEED_PLACES_END
