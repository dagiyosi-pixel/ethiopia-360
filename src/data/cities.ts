import type { City } from "@/types";
import { applyCuratedVisuals } from "@/data/images";

/**
 * DEMO SEED DATA , cities. See `src/data/regions.ts` for the disclaimer on
 * provenance: coordinates are approximate city centres, figures are indicative.
 * Append new cities above the SEED_CITIES_END marker.
 */
const citySeed: City[] = [
  {
    slug: "addis-ababa",
    name: "Addis Ababa",
    nameAm: "አዲስ አበባ",
    regionSlug: "addis-ababa",
    coords: { lat: 9.03, lng: 38.7469 },
    zoom: 12,
    summary:
      "The capital: a highland city of museums, markets, jazz rooms and a light-rail spine, ringed by eucalyptus-covered ridge.",
    description:
      "Addis Ababa reads as several cities stacked together , imperial-era palaces and squares, the immense Merkato trading district, a diplomatic quarter of embassies, and fast-growing satellite suburbs climbing the Entoto slopes.",
    artwork: { palette: "entoto", seed: 12, motif: "tower" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Addis Ababa photograph.",
    imageSubject: "Addis Ababa",
    elevationM: 2355,
    knownFor: ["Museums", "Coffee ceremony", "Jazz", "Merkato", "Light rail"],
    landmarks: [
      "National Museum",
      "Holy Trinity Cathedral",
      "Merkato",
      "Entoto Maryam",
      "Unity Park",
      "Mesob and Azmari Bet music houses",
    ],
  },
  {
    slug: "gondar",
    name: "Gondar",
    nameAm: "ጎንደር",
    regionSlug: "amhara",
    coords: { lat: 12.603, lng: 37.4521 },
    zoom: 13,
    summary:
      "Imperial capital of the 17th–18th centuries, known for its castle compound and walls of painted church interiors.",
    description:
      "Gondar was founded as a permanent royal capital and retains a remarkable concentration of castle and church architecture within a short walk of the centre.",
    artwork: { palette: "gold", seed: 21, motif: "arch" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Gondar photograph.",
    imageSubject: "Gondar and Fasil Ghebbi",
    elevationM: 2133,
    knownFor: ["Castles", "Church murals", "Imperial history", "Timkat celebrations"],
    landmarks: [
      "Fasil Ghebbi enclosure",
      "Debre Berhan Selassie",
      "Bath of Fasilides",
      "Kuskuam complex",
    ],
  },
  {
    slug: "bahir-dar",
    name: "Bahir Dar",
    nameAm: "ባሕር ዳር",
    regionSlug: "amhara",
    coords: { lat: 11.5936, lng: 37.3908 },
    zoom: 13,
    summary:
      "Lakeside administrative and university city on Lake Tana, gateway to island monasteries and the Blue Nile Falls.",
    description:
      "Bahir Dar's avenues are unusually wide and green, laid out along the southern shore of Lake Tana. Boats from the lakefront reach peninsula and island monasteries, and the Blue Nile leaves the lake about 30 km south.",
    artwork: { palette: "nile", seed: 33, motif: "contour" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Bahir Dar / Lake Tana photograph.",
    imageSubject: "Bahir Dar and Lake Tana",
    elevationM: 1800,
    knownFor: ["Lake Tana", "Monasteries", "Blue Nile Falls", "Wide avenues"],
    landmarks: [
      "Lake Tana shoreline",
      "Ura Kidane Mehret",
      "Azwa Maryam",
      "Tis Issat falls",
      "Papyrus tankwa workshops",
    ],
  },
  {
    slug: "hawassa",
    name: "Hawassa",
    nameAm: "ሀዋሳ",
    regionSlug: "sidama",
    coords: { lat: 7.0621, lng: 38.4763 },
    zoom: 13,
    summary:
      "Lakeside city on the Rift floor, with a fish market, a resident bird colony and a fast-growing university economy.",
    description:
      "Hawassa sits on the shore of its namesake lake at about 1,700 metres. The lakefront promenade, the morning fish market and the stork and pelican population make it one of the most immediately legible cities in the Rift.",
    artwork: { palette: "rift", seed: 44, motif: "contour" },
    elevationM: 1708,
    knownFor: ["Lake Hawassa", "Fish market", "Birdlife", "Conference centre"],
    landmarks: [
      "Hawassa fish market",
      "Amora Gedel park",
      "Lakefront promenade",
      "Fikir Hayk area",
    ],
  },
  {
    slug: "harar",
    name: "Harar",
    nameAm: "ሐረር",
    regionSlug: "harari",
    coords: { lat: 9.3117, lng: 42.1281 },
    zoom: 14,
    summary:
      "The walled eastern city: dense lanes, gated courtyards, coffee roasting on doorsteps and the evening hyena feeding ground.",
    description:
      "Harar Jugol is a walled city of a few square kilometres, entered through historic gates. Its architecture is distinctive for painted interior walls, stacked baskets, and a street plan that folds inward rather than outward.",
    artwork: { palette: "harar", seed: 55, motif: "arch" },
    elevationM: 1885,
    knownFor: ["Walled city", "Interior design", "Coffee", "Hyena feeding", "Chat trade"],
    landmarks: [
      "Jugol wall and gates",
      "Rimbaud House",
      "Jami Mosque",
      "Hyena feeding ground",
      "Harari cultural houses",
    ],
  },
  {
    slug: "dire-dawa",
    name: "Dire Dawa",
    nameAm: "ድሬ ዳዋ",
    regionSlug: "dire-dawa",
    coords: { lat: 9.5931, lng: 41.8661 },
    zoom: 13,
    summary:
      "Rail-era city on the hot plain beneath Harar's escarpment, split between the old town and the rail-side quarter.",
    description:
      "Dire Dawa is a two-part city: the older settlement on the Dechatu riverbed and the planned railway quarter of workshops and wide streets laid out after the line arrived from Djibouti.",
    artwork: { palette: "gold", seed: 66, motif: "tower" },
    elevationM: 1276,
    knownFor: ["Railway heritage", "Markets", "Trade routes", "Hot climate"],
    landmarks: [
      "Old railway station",
      "Kefira market",
      "Dechatu riverbed",
      "Ali Nahmed hill viewpoint",
    ],
  },
  {
    slug: "axum",
    name: "Axum",
    nameAm: "አክሱም",
    regionSlug: "tigray",
    coords: { lat: 14.1211, lng: 38.7237 },
    zoom: 14,
    summary:
      "The Aksumite capital: stelae fields, royal tombs and the foundations of an early trading empire that coined its own currency.",
    description:
      "Axum's archaeological landscape is the centrepiece of the country's earliest recorded state. Carved granite obelisks stand over underground tombs, beside later religious buildings still in active use.",
    artwork: { palette: "basalt", seed: 24, motif: "tower" },
    elevationM: 2130,
    knownFor: ["Stelae", "Aksumite archaeology", "Ancient script", "Early coinage"],
    landmarks: [
      "Stelae park",
      "Church of St Mary of Zion",
      "Ezana inscriptions",
      "Queen of Sheba's bath",
    ],
  },
  {
    slug: "mekelle",
    name: "Mekelle",
    nameAm: "መቀለ",
    regionSlug: "tigray",
    coords: { lat: 13.4967, lng: 39.4753 },
    zoom: 13,
    summary:
      "Highland regional capital on a plateau edge, with a university, stone-built townscape and dry, thin air.",
    description:
      "Mekelle sits above 2,000 metres on the northern plateau, its edges dropping toward the Danakil side. The city is a transport and education hub for the surrounding agricultural highlands.",
    artwork: { palette: "basalt", seed: 35, motif: "terrace" },
    elevationM: 2084,
    knownFor: ["Plateau views", "University", "Stone building", "Market trade"],
    landmarks: [
      "Romanat square",
      "Yohannes IV palace museum",
      "Mekelle market",
      "Plateau viewpoints",
    ],
  },
  {
    slug: "lalibela",
    name: "Lalibela",
    nameAm: "ላሊበላ",
    regionSlug: "amhara",
    coords: { lat: 12.0317, lng: 39.0413 },
    zoom: 14,
    summary:
      "Highland town of churches excavated downward into living rock , a single carved complex rather than separate built structures.",
    description:
      "Lalibela's churches were cut down into volcanic tuff, so the visitor descends into them rather than entering upward. The complex remains an active pilgrimage destination and a UNESCO World Heritage property.",
    artwork: { palette: "rift", seed: 46, motif: "arch" },
    elevationM: 2500,
    knownFor: ["Rock-hewn churches", "Pilgrimage", "Tuff geology", "Genna celebrations"],
    landmarks: [
      "Bete Giyorgis",
      "Bete Medhane Alem",
      "Bete Amanuel",
      "Asheton Maryam monastery",
    ],
  },
  {
    slug: "adama",
    name: "Adama",
    nameAm: "አዳማ",
    regionSlug: "oromia",
    coords: { lat: 8.54, lng: 39.267 },
    zoom: 13,
    summary:
      "Rift Valley transport hub on the main road and rail corridor south-east of the capital.",
    description:
      "Adama (also known as Nazret) sits where the escarpment road drops into the Rift floor. It is a logistics and industrial city, and the administrative seat of the Oromia regional government.",
    artwork: { palette: "danakil", seed: 57, motif: "terrace" },
    elevationM: 1712,
    knownFor: ["Rift Valley gateway", "Logistics", "Hot springs", "Rail corridor"],
    landmarks: [
      "Sodere hot springs",
      "Adama market",
      "Escarpment views",
      "Rail corridor",
    ],
  },
  {
    slug: "jimma",
    name: "Jimma",
    nameAm: "ጅማ",
    regionSlug: "oromia",
    coords: { lat: 7.6733, lng: 36.8344 },
    zoom: 13,
    summary:
      "Coffee-country city in the humid south-west, historically a trade centre for the Kaffa coffee belt.",
    description:
      "Jimma lies in high-rainfall forest country where coffee, spices and fruit dominate. The city has long been the market hinge between the south-western coffee zones and the rest of the country.",
    artwork: { palette: "highland", seed: 68, motif: "coffee" },
    elevationM: 1780,
    knownFor: ["Coffee trade", "Forest", "Markets", "University"],
    landmarks: [
      "Jimma coffee markets",
      "Jimma University gardens",
      "Limmu coffee zone",
      "Abba Jifar palace",
    ],
  },
  {
    slug: "arba-minch",
    name: "Arba Minch",
    nameAm: "አርባ ምንጭ",
    regionSlug: "snnpr",
    coords: { lat: 6.0333, lng: 37.55 },
    zoom: 13,
    summary:
      "'Forty springs' , a lake-view town on the ridge between Lakes Abaya and Chamo, gateway to Konso and the Omo.",
    description:
      "Arba Minch sits on a narrow ridge dividing two Rift Valley lakes, with the Nechisar plain below. It is the practical base for trips toward the Konso terraces and the lower Omo.",
    artwork: { palette: "nile", seed: 79, motif: "contour" },
    elevationM: 1285,
    knownFor: ["Twin lakes", "Nechisar park", "Crocodile shore", "Ridge views"],
    landmarks: [
      "Lake Abaya viewpoint",
      "Lake Chamo crocodile shore",
      "Nechisar National Park",
      "Forty Springs site",
    ],
  },
  {
    slug: "jigjiga",
    name: "Jigjiga",
    nameAm: "ጅጅጋ",
    regionSlug: "somali",
    coords: { lat: 9.35, lng: 42.8 },
    zoom: 13,
    summary:
      "Eastern highland town and regional capital, a trading centre on the road toward the Somali plains.",
    description:
      "Jigjiga sits on a plateau above the dry plains, functioning as the administrative and market hub for the eastern region and its livestock trade.",
    artwork: { palette: "gold", seed: 81, motif: "weave" },
    elevationM: 1609,
    knownFor: ["Livestock markets", "Regional administration", "Poetry tradition"],
    landmarks: [
      "Jigjiga livestock market",
      "Regional museum",
      "Kara Mara hills",
      "Trade road south",
    ],
  },
  {
    slug: "bishoftu",
    name: "Bishoftu",
    nameAm: "ቢሾፍቱ",
    regionSlug: "oromia",
    coords: { lat: 8.7519, lng: 38.9785 },
    zoom: 13,
    summary:
      "Crater-lake town south-east of the capital, long used as a weekend retreat from the city.",
    description:
      "Bishoftu sits among a chain of small volcanic crater lakes. Its lakeside resorts make it the capital's closest escape, and the surrounding plain specialises in horticulture.",
    artwork: { palette: "nile", seed: 91, motif: "contour" },
    elevationM: 1920,
    knownFor: ["Crater lakes", "Lakeside resorts", "Horticulture", "Birdlife"],
    landmarks: ["Lake Hora", "Lake Bishoftu", "Debre Zeit hills", "Horticulture belt"],
  },
  {
    slug: "semera",
    name: "Semera",
    nameAm: "ሰመራ",
    regionSlug: "afar",
    coords: { lat: 11.7933, lng: 41.0067 },
    zoom: 13,
    summary:
      "Purpose-built lowland capital on the road to Djibouti and the Danakil, between escarpment and desert.",
    description:
      "Semera is a planned administrative city on the Awash–Djibouti corridor, and the base from which Danakil salt routes are organised.",
    artwork: { palette: "danakil", seed: 93, motif: "terrace" },
    elevationM: 434,
    knownFor: ["Danakil access", "Salt routes", "Corridor to Djibouti"],
    landmarks: ["Awash corridor", "Salt caravan routes", "Afar cultural centre"],
  },
  {
    slug: "gambela",
    name: "Gambela",
    nameAm: "ጋምቤላ",
    regionSlug: "gambela",
    coords: { lat: 8.25, lng: 34.5833 },
    zoom: 13,
    summary:
      "River town on the Baro, with a wet-season waterfront and a cattle-and-fish market culture.",
    description:
      "Gambela town sits on the Baro river, a tributary route toward the White Nile. Its economy mixes river fishing, cattle and cross-border trade.",
    artwork: { palette: "nile", seed: 95, motif: "contour" },
    elevationM: 526,
    knownFor: ["Baro river", "Fishing", "Wetlands", "Border trade"],
    landmarks: ["Baro riverfront", "Gambela market", "Wetland birding sites"],
  },
  {
    slug: "assosa",
    name: "Assosa",
    nameAm: "አሶሳ",
    regionSlug: "benishangul-gumuz",
    coords: { lat: 10.0667, lng: 34.5333 },
    zoom: 13,
    summary: "Western regional capital on high wooded ground, set back from the Blue Nile gorge.",
    description:
      "Assosa is a small administrative city surrounded by woodland and farmland on the western escarpment, with gold and sesame trading in its markets.",
    artwork: { palette: "rift", seed: 99, motif: "contour" },
    elevationM: 1570,
    knownFor: ["Wooded highlands", "Sesame trade", "Blue Nile approaches"],
    landmarks: ["Assosa market", "Blue Nile gorge viewpoints", "Bamboo stands"],
  },
  {
    slug: "bonga",
    name: "Bonga",
    nameAm: "ቦንጋ",
    regionSlug: "southwest-ethiopia",
    coords: { lat: 7.2833, lng: 36.2333 },
    zoom: 13,
    summary:
      "Forest town in the coffee heartland, surrounded by remnant wild arabica populations.",
    description:
      "Bonga sits in montane rainforest country where Coffea arabica grows wild. Forest coffee, honey and spice gardens define the local economy.",
    artwork: { palette: "highland", seed: 101, motif: "coffee" },
    elevationM: 1720,
    knownFor: ["Wild coffee", "Montane forest", "Honey", "Spice gardens"],
    landmarks: ["Bonga forest trails", "Coffee gene bank", "Kafa cultural sites"],
  },
];

/**
 * Verified imagery is attached from the central registry in
 * `src/data/images.ts`. Cities without a verified photograph keep an explicitly
 * labelled neutral generated visual rather than an unrelated stock photo.
 */
export const cities: City[] = applyCuratedVisuals(citySeed, (city) => city.name);

export const cityBySlug = new Map(cities.map((c) => [c.slug, c]));

export function getCitySeed(slug: string): City | undefined {
  return cityBySlug.get(slug);
}

export function citiesInRegion(regionSlug: string): City[] {
  return cities.filter((c) => c.regionSlug === regionSlug);
}
// SEED_CITIES_END
