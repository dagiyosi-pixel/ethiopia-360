import type { Region } from "@/types";

/**
 * DEMO SEED DATA.
 *
 * Descriptive copy below is clearly-labelled illustrative material for
 * development. Figures are approximate, drawn from widely published public
 * references and are NOT presented as authoritative. Boundary geometry is
 * derived from geoBoundaries (ETH ADM1, CC BY 4.0) — see `scripts/build-geo.mjs`.
 *
 * This file mirrors the shape of the `regions` table. `lib/data/queries.ts`
 * prefers Supabase when configured and falls back to this seed when it is not.
 */
export const regions: Region[] = [
  {
    slug: "addis-ababa",
    name: "Addis Ababa",
    nameAm: "አዲስ አበባ",
    kind: "city-administration",
    capital: "Addis Ababa",
    coords: { lat: 9.03, lng: 38.7469 },
    zoom: 11,
    landscape: "Highland plateau · ~2,300 m",
    summary:
      "The federal capital and the country's densest collision of old and new — diplomatic quarter, Merkato, jazz clubs and mountain-edge viewpoints.",
    description:
      "Addis Ababa sits in a bowl of highland ridges at roughly 2,300 metres. It is both the political centre of the federation and the largest single gathering of Ethiopia's many communities, which makes it the most useful place to start understanding the rest of the country.",
    artwork: { palette: "entoto", seed: 11, motif: "tower" },
    image: null,
    imageSource: "Neutral generated artwork — pending a verified Addis Ababa photograph.",
    imageSubject: "Addis Ababa",
    languages: ["Amharic", "Oromo", "English", "many others"],
    stats: { areaKm2: 527, populationApprox: 5_200_000, elevationM: 2355 },
    highlights: [
      "National Museum",
      "Merkato",
      "Entoto ridge",
      "Unity Park",
      "Light Rail",
    ],
    cities: ["addis-ababa"],
    geoKey: "Addis Ababa",
  },
  {
    slug: "tigray",
    name: "Tigray",
    nameAm: "ትግራይ",
    kind: "region",
    capital: "Mekelle",
    coords: { lat: 13.6, lng: 39.1 },
    zoom: 7,
    landscape: "Escarpments, sandstone massifs and high plateau",
    summary:
      "Northern highlands of rock-hewn churches, painted monasteries and escarpments that fall sharply toward the Danakil lowlands.",
    description:
      "Tigray's northern geometry is defined by steep sandstone escarpments and old trade corridors that once linked the Red Sea coast to the highland interior. Its towns carry an unusually deep record of Aksumite, manuscript and monastic tradition.",
    artwork: { palette: "basalt", seed: 23, motif: "tower" },
    image: null,
    imageSource: "Neutral generated artwork — pending a verified Tigray photograph.",
    imageSubject: "Tigray",
    languages: ["Tigrinya", "Amharic"],
    stats: { areaKm2: 53_000, populationApprox: 5_700_000 },
    highlights: [
      "Rock-hewn churches",
      "Aksum",
      "Gheralta cliffs",
      "Debre Damo",
      "Hawzien plains",
    ],
    cities: ["mekelle", "axum"],
    geoKey: "Tigray",
  },
  {
    slug: "amhara",
    name: "Amhara",
    nameAm: "አማራ",
    kind: "region",
    capital: "Bahir Dar",
    coords: { lat: 11.7, lng: 37.9 },
    zoom: 7,
    landscape: "Lake Tana basin, Simien massifs, high plateaus",
    summary:
      "Lake Tana, the Simien escarpments and the historic northern circuit from Gondar to Lalibela to the Blue Nile falls.",
    description:
      "Amhara holds a large share of the country's best-known historic sites alongside highland farming landscapes, island monasteries and the source of the Blue Nile. Altitude dominates daily life — the plateau sits mostly between 1,800 and 3,000 metres.",
    artwork: { palette: "nile", seed: 7, motif: "contour" },
    image: null,
    imageSource: "Neutral generated artwork — pending a verified Amhara photograph.",
    imageSubject: "Amhara region",
    languages: ["Amharic", "Agaw", "Qimant"],
    stats: { areaKm2: 154_000, populationApprox: 22_000_000 },
    highlights: [
      "Lake Tana",
      "Simien Mountains",
      "Lalibela",
      "Gondar castles",
      "Blue Nile Falls",
    ],
    cities: ["gondar", "bahir-dar", "lalibela"],
    geoKey: "Amhara",
  },
  {
    slug: "oromia",
    name: "Oromia",
    nameAm: "ኦሮሚያ",
    kind: "region",
    capital: "Adama",
    coords: { lat: 8.6, lng: 39.6 },
    zoom: 6,
    landscape: "Rift Valley floor, Bale and Arsi highlands, coffee forest",
    summary:
      "The largest region by area, wrapping the capital and running from Rift Valley lakes to the Bale Mountains and the coffee forests of the south-west.",
    description:
      "Oromia surrounds Addis Ababa and spans almost every landscape the country has: dry Rift Valley floor, lake chains, the Arsi and Bale massifs, and humid montane forest where much of the country's coffee originates.",
    artwork: { palette: "highland", seed: 31, motif: "terrace" },
    languages: ["Oromo (Afaan Oromoo)", "Amharic"],
    stats: { areaKm2: 353_690, populationApprox: 40_000_000 },
    highlights: [
      "Bale Mountains",
      "Sof Omar caves",
      "Rift Valley lakes",
      "Wonchi crater",
      "Coffee forests",
    ],
    cities: ["adama", "jimma", "bishoftu"],
    geoKey: "Oromia",
  },
  {
    slug: "afar",
    name: "Afar",
    nameAm: "አፋር",
    kind: "region",
    capital: "Semera",
    coords: { lat: 11.8, lng: 41.0 },
    zoom: 7,
    landscape: "Danakil depression · below sea level to volcanic plateau",
    summary:
      "One of the hottest inhabited landscapes on earth: salt flats, sulphur vents, lava lakes and camel caravans across the Danakil.",
    description:
      "Afar stretches from the Red Sea escarpment into the Danakil Depression, a rift zone of salt pans and active volcanism. Settlement follows water and grazing, and much of the region is crossed rather than lived in.",
    artwork: { palette: "danakil", seed: 43, motif: "terrace" },
    languages: ["Afar (Qafar af)", "Amharic"],
    stats: { areaKm2: 72_053, populationApprox: 2_100_000 },
    highlights: [
      "Danakil Depression",
      "Dallol",
      "Erta Ale",
      "Lake Afrera",
      "Salt caravans",
    ],
    cities: ["semera"],
    geoKey: "Afar",
  },
  {
    slug: "somali",
    name: "Somali",
    nameAm: "ሶማሊ",
    kind: "region",
    capital: "Jigjiga",
    coords: { lat: 7.6, lng: 44.6 },
    zoom: 6,
    landscape: "Ogaden plains, dry bush, seasonal rivers",
    summary:
      "The vast eastern plains: open rangeland, camel and cattle herding, and the long caravan corridor toward Dire Dawa and the coast.",
    description:
      "Somali regional state is the country's second-largest region by area and among its driest. Livelihoods centre on pastoralism and trade, with a strong poetic and oral literary tradition.",
    artwork: { palette: "gold", seed: 17, motif: "weave" },
    languages: ["Somali", "Amharic"],
    stats: { areaKm2: 279_252, populationApprox: 6_700_000 },
    highlights: [
      "Ogaden plains",
      "Jigjiga",
      "Camel markets",
      "Degeh Bur plateau",
      "Seasonal riverbeds",
    ],
    cities: ["jigjiga"],
    geoKey: "Somali",
  },
  {
    slug: "snnpr",
    name: "Southern Nations (SNNPR)",
    nameAm: "ደቡብ ብሔሮች ብሔረሰቦች",
    kind: "region",
    capital: "Hawassa",
    coords: { lat: 6.6, lng: 37.6 },
    zoom: 7,
    landscape: "Rift Valley lakes, escarpments, enset highlands",
    summary:
      "A mosaic of dozens of communities, lake chains and terraced enset highlands — the most linguistically dense part of the federation.",
    description:
      "The southern region contains an extraordinary concentration of distinct languages and food cultures, organised around enset, coffee and Rift Valley lake fisheries. Several new regional states have been created from this area since 2019 — see the Sidama, South Ethiopia and South West entries.",
    artwork: { palette: "highland", seed: 59, motif: "weave" },
    languages: ["Sidaama", "Wolaytta", "Gamo", "Gurage", "many others"],
    stats: { areaKm2: 105_887, populationApprox: 12_000_000 },
    highlights: [
      "Lake Abaya",
      "Dorze terraces",
      "Konso cultural landscape",
      "Omo Valley",
      "Lake Chamo",
    ],
    cities: ["arba-minch", "hawassa"],
    geoKey: "SNNPR",
    geoNote:
      "This boundary is the pre-2020 SNNPR extent. Regional states created since then are shown as markers only.",
  },
  {
    slug: "sidama",
    name: "Sidama",
    nameAm: "ሲዳማ",
    kind: "region",
    capital: "Hawassa",
    coords: { lat: 6.72, lng: 38.42 },
    zoom: 9,
    landscape: "Rift lakeshore and enset–coffee highlands",
    summary:
      "Enset and coffee country on the eastern Rift shoulder, with lakeside Hawassa as a national conference and fisheries hub.",
    description:
      "Sidama was established as a regional state in 2019/2020, with Hawassa as its capital. Farming revolves around enset and coffee, and Lake Hawassa anchors the region's tourism and fishing economy.",
    artwork: { palette: "rift", seed: 61, motif: "coffee" },
    languages: ["Sidaama", "Amharic"],
    stats: { areaKm2: 6_695, populationApprox: 4_200_000 },
    highlights: [
      "Lake Hawassa",
      "Yirgalem forest",
      "Coffee smallholdings",
      "Sidama coffee co-ops",
    ],
    cities: ["hawassa"],
    geoKey: null,
    geoNote:
      "Created in 2019/2020, after the boundary dataset used here was published — shown as a marker.",
  },
  {
    slug: "south-ethiopia",
    name: "South Ethiopia",
    nameAm: "ደቡብ ኢትዮጵያ",
    kind: "region",
    capital: "Wolaita Sodo",
    coords: { lat: 6.05, lng: 37.35 },
    zoom: 7,
    landscape: "Terraced highlands above the Rift, Omo approaches",
    summary:
      "Steep, intensively terraced highlands between the Rift Valley and the Omo lowlands.",
    description:
      "South Ethiopia regional state was reorganised in 2023 from part of the former SNNPR. The landscape is dominated by terraced highlands and dramatic escarpment drops toward the Omo basin.",
    artwork: { palette: "entoto", seed: 67, motif: "terrace" },
    languages: ["Wolaytta", "Gamo", "Konso", "Dawro"],
    stats: { areaKm2: 47_000, populationApprox: 7_500_000 },
    highlights: [
      "Konso terraces",
      "Wolaita highlands",
      "Omo escarpment",
      "Lake Abaya shoreline",
    ],
    cities: ["arba-minch"],
    geoKey: null,
    geoNote:
      "Reorganised in 2023, after the boundary dataset used here was published — shown as a marker.",
  },
  {
    slug: "southwest-ethiopia",
    name: "South West Ethiopia",
    nameAm: "ደቡብ ምዕራብ ኢትዮጵያ",
    kind: "region",
    capital: "Bonga",
    coords: { lat: 7.3, lng: 36.1 },
    zoom: 7,
    landscape: "Montane rainforest, tea and coffee zones",
    summary:
      "Humid montane forest — the country's coffee heartland and one of its richest wild coffee gene pools.",
    description:
      "South West Ethiopia Peoples' Region was formed in 2021. High rainfall supports dense montane forest, wild Coffea arabica populations, spice gardens and honey production.",
    artwork: { palette: "highland", seed: 71, motif: "coffee" },
    languages: ["Kafa", "Bench", "Sheko", "Amharic"],
    stats: { areaKm2: 39_000, populationApprox: 3_200_000 },
    highlights: [
      "Bonga coffee forests",
      "Kafa biosphere",
      "Tea estates",
      "Wild coffee gene bank",
    ],
    cities: ["bonga"],
    geoKey: null,
    geoNote:
      "Formed in 2021, after the boundary dataset used here was published — shown as a marker.",
  },

  {
    slug: "harari",
    name: "Harari",
    nameAm: "ሐረሪ",
    kind: "region",
    capital: "Harar",
    coords: { lat: 9.31, lng: 42.12 },
    zoom: 11,
    landscape: "Eastern highland ridge, walled city",
    summary:
      "A small, dense regional state around the walled city of Harar — dozens of mosques inside a single fortification, and a distinctive interior design tradition.",
    description:
      "Harari covers the city of Harar and its surroundings. The old walled town (Jugol) is compact but layered: narrow lanes, gated courtyards, a long-standing night-time hyena feeding tradition and its own language, Harari.",
    artwork: { palette: "harar", seed: 53, motif: "arch" },
    languages: ["Harari", "Amharic", "Oromo"],
    stats: { areaKm2: 374, populationApprox: 280_000, elevationM: 1885 },
    highlights: [
      "Harar Jugol walls",
      "Jugol gates",
      "Hyena feeding",
      "Harari house interiors",
      "Coffee markets",
    ],
    cities: ["harar"],
    geoKey: "Hareri",
  },
  {
    slug: "dire-dawa",
    name: "Dire Dawa",
    nameAm: "ድሬ ዳዋ",
    kind: "city-administration",
    capital: "Dire Dawa",
    coords: { lat: 9.5931, lng: 41.8661 },
    zoom: 10,
    landscape: "Rift-edge plain below the Harar escarpment",
    summary:
      "The historic rail town on the plains below Harar — caravan, railway and industrial crossroads between highland and coast.",
    description:
      "Dire Dawa grew around the Addis Ababa–Djibouti railway in the early 20th century, on the hot plain below the Harar escarpment. Its grid of wide avenues and industrial yards reflects that rail-era planning.",
    artwork: { palette: "gold", seed: 83, motif: "tower" },
    languages: ["Amharic", "Oromo", "Somali", "Harari"],
    stats: { areaKm2: 1_213, populationApprox: 500_000, elevationM: 1276 },
    highlights: [
      "Railway heritage",
      "Kefira market",
      "Dechatu riverbed",
      "Ali Nahmed hill",
      "Trade corridors",
    ],
    cities: ["dire-dawa"],
    geoKey: "Dire Dawa",
  },
  {
    slug: "gambela",
    name: "Gambela",
    nameAm: "ጋምቤላ",
    kind: "region",
    capital: "Gambela",
    coords: { lat: 8.0, lng: 34.0 },
    zoom: 8,
    landscape: "Lowland riverine forest, wetlands, Baro floodplain",
    summary:
      "Wet, low-lying river country along the Baro and Akobo — fisheries, wildlife corridors and western border trade.",
    description:
      "Gambela lies low and wet along rivers draining toward the White Nile. Seasonal flooding, grassland and gallery forest shape settlement, grazing and the region's cattle-keeping cultures.",
    artwork: { palette: "nile", seed: 89, motif: "contour" },
    languages: ["Nuer", "Anuak", "Amharic"],
    stats: { areaKm2: 29_783, populationApprox: 500_000 },
    highlights: [
      "Baro river",
      "Gambela National Park",
      "Wetland birdlife",
      "Akobo confluence",
    ],
    cities: ["gambela"],
    geoKey: "Gambela",
  },
  {
    slug: "benishangul-gumuz",
    name: "Benishangul-Gumuz",
    nameAm: "ቤንሻንጉል ጉሙዝ",
    kind: "region",
    capital: "Assosa",
    coords: { lat: 10.6, lng: 35.0 },
    zoom: 7,
    landscape: "Blue Nile gorge, low wooded hills, river valleys",
    summary:
      "The western frontier along the Blue Nile — river gorges, gold and sesame country, and the road toward Sudan.",
    description:
      "Benishangul-Gumuz occupies the lowland west of the Blue Nile gorge. Settlement patterns, river crossings and trade routes are closely tied to the Nile corridor and the western border.",
    artwork: { palette: "rift", seed: 97, motif: "contour" },
    languages: ["Berta", "Gumuz", "Amharic"],
    stats: { areaKm2: 50_699, populationApprox: 1_200_000 },
    highlights: [
      "Blue Nile gorge",
      "Assosa",
      "Bamboo forest",
      "Gold panning belts",
      "Nile corridor",
    ],
    cities: ["assosa"],
    geoKey: "Beneshangul Gumu",
  },
];

export const regionBySlug = new Map(regions.map((r) => [r.slug, r]));

export function getRegionSeed(slug: string): Region | undefined {
  return regionBySlug.get(slug);
}
