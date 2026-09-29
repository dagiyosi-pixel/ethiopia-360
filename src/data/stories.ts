import type { Story } from "@/types";

/**
 * DEMO SEED DATA , stories.
 * All articles below are clearly-labelled development copy written to make the
 * reading experience testable. They are illustrative, not verified reporting.
 * Append above SEED_STORIES_MARKER.
 */
export const stories: Story[] = [
  {
    slug: "the-long-way-to-merkato",
    title: "The Long Way to Merkato",
    excerpt:
      "A wholesaler's morning starts four hours before the market opens. This is the route coffee takes before anyone tastes it.",
    body: [
      "By four in the morning the wholesale lanes behind Merkato are already working. Sacks arrive stacked on shoulders and hand carts, sorted by origin and grade, weighed on scales older than most of the people using them.",
      "The trade is organised by commodity rather than geography. Walk three hundred metres and the smell changes completely: green coffee to spice to scrap metal to second-hand clothing, each with its own brokers, its own credit arrangements, its own language of haggling.",
      "What is easy to miss is how much of the district is a repair economy. Nothing is thrown away if it can be re-soldered, re-stitched or re-soled. In that sense Merkato is a very accurate portrait of the city around it.",
    ],
    authorId: "u-rahel",
    regionSlug: "addis-ababa",
    citySlug: "addis-ababa",
    category: "places",
    tags: ["trade", "coffee", "urban", "markets"],
    artwork: { palette: "gold", seed: 501, motif: "weave" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Merkato photograph.",
    imageSubject: "Merkato, Addis Ababa",
    readMinutes: 6,
    likes: 412,
    comments: 28,
    saves: 190,
    views: 8410,
    featured: true,
    publishedAt: "2024-06-18",
  },
  {
    slug: "what-the-terraces-hold",
    title: "What the Terraces Hold",
    excerpt:
      "Konso's hillsides are kept in place by walls nobody drew plans for. Repairing them is a shared, seasonal job.",
    body: [
      "The stone walls on Konso's slopes do not run straight. They follow the shape of each field, which means every terrace is slightly different from the next, and none of them matches a drawing.",
      "Maintenance is communal and seasonal. After heavy rain, families walk their boundaries and replace the stones that shifted, a task that has been repeated for long enough that the resulting system now supports dense cultivation on gradients that would otherwise wash out.",
      "Sitting above the terraces, the carved wooden figures associated with memorial traditions are a reminder that the landscape is also a record , of who held which ground, and of who is remembered for it.",
    ],
    authorId: "u-tomas",
    regionSlug: "south-ethiopia",
    category: "culture",
    tags: ["terracing", "agriculture", "heritage", "konso"],
    artwork: { palette: "rift", seed: 502, motif: "terrace" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified terrace photograph.",
    imageSubject: "Konso terraces",
    readMinutes: 5,
    likes: 268,
    comments: 19,
    saves: 121,
    views: 5320,
    featured: true,
    publishedAt: "2024-05-29",
  },
  {
    slug: "coffee-at-two-thousand-metres",
    title: "Coffee at Two Thousand Metres",
    excerpt:
      "In the forests around Bonga, arabica grows wild. Following one harvest from plot to drying bed to cup.",
    body: [
      "Wild coffee in the south-west grows as an understorey plant in montane forest, not in tidy rows. Pickers work through the shade, taking only the ripe cherries, which means a single tree is visited several times over a season.",
      "Drying is where a lot of quality is decided. Cherries spread on raised beds are turned by hand for days; if rain arrives at the wrong moment, the work of a whole plot can be downgraded.",
      "The distance from a forest plot to a city café is short in kilometres and enormous in price. Understanding that gap , who adds value, and where , is the fastest way to understand the country's most important agricultural export.",
    ],
    authorId: "u-hiwot",
    regionSlug: "southwest-ethiopia",
    citySlug: "bonga",
    category: "food",
    tags: ["coffee", "forest", "harvest", "trade"],
    artwork: { palette: "highland", seed: 503, motif: "coffee" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Ethiopian coffee image.",
    imageSubject: "Ethiopian coffee culture",
    readMinutes: 7,
    likes: 634,
    comments: 44,
    saves: 302,
    views: 12900,
    featured: true,
    publishedAt: "2024-07-02",
  },
  {
    slug: "nights-in-harar-jugol",
    title: "Nights in Harar Jugol",
    excerpt:
      "Inside the walls, the evening ritual is coffee, incense and a short walk past the hyena feeding ground.",
    body: [
      "The lanes of Harar Jugol narrow until they are barely a doorway wide, then open suddenly into a courtyard. The walls keep the heat of the day out and the noise of the town away.",
      "In the evening, incense is burned and coffee is roasted in the same room where it is served , green beans in a flat pan over coals, then ground and brewed in a clay pot. Every household seems to have its own rhythm for this.",
      "Outside the gates, the hyenas that gather after dark have been fed at the same spot for a very long time. It is a strange and slightly theatrical tradition, and the town treats it matter-of-factly.",
    ],
    authorId: "u-yusuf",
    regionSlug: "harari",
    citySlug: "harar",
    category: "culture",
    tags: ["walled-city", "coffee", "courtyards", "harar"],
    artwork: { palette: "harar", seed: 504, motif: "arch" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified Harar image.",
    imageSubject: "Harar Jugol",
    readMinutes: 6,
    likes: 521,
    comments: 37,
    saves: 266,
    views: 11200,
    featured: true,
    publishedAt: "2024-04-16",
  },
  {
    slug: "salt-camels-and-the-danakil-road",
    title: "Salt, Camels and the Danakil Road",
    excerpt:
      "Cutting salt slabs by hand, loading them onto camels and moving them out of the hottest place in the country.",
    body: [
      "The salt is not loose. It is cut into rectangular slabs with a long axe, lifted out of the pan, trimmed and stacked into a load a camel can carry in two balanced bundles.",
      "Caravans move at night and rest in shade during the day, because daytime ground temperature makes the work genuinely dangerous. The route out to the highland edge has been the same for a very long time; only the market at the end of it has changed.",
      "Photographing this is a negotiation. Guides are essential, convoys are not optional, and the people working do not exist to be photographed. Ask, pay fairly, and be prepared for a straight no.",
    ],
    authorId: "u-meron",
    regionSlug: "afar",
    category: "history",
    tags: ["danakil", "salt", "caravans", "desert"],
    artwork: { palette: "danakil", seed: 505, motif: "terrace" },
    readMinutes: 8,
    likes: 708,
    comments: 52,
    saves: 341,
    views: 15400,
    featured: false,
    publishedAt: "2024-03-08",
  },
  {
    slug: "rebuilding-mekelle-stone-houses",
    title: "Rebuilding Mekelle's Stone Houses",
    excerpt:
      "Dressed stone, lime mortar and the slow work of putting a highland town back together.",
    body: [
      "Mekelle's older houses are built from dressed local stone laid in lime mortar, with timber lintels over doors and windows. The technique is labour-intensive and, where it survived, remarkably durable.",
      "Repair work is a different discipline from new construction. Matching a wall means matching the stone course, the mortar mix and the way the roof meets the parapet , details that are easy to lose when a rebuild is done quickly.",
      "Architects and masons working in the city describe the same tension everywhere: the fastest way to rebuild is with concrete block, and the slowest way is the one that keeps the town looking like itself.",
    ],
    authorId: "u-dawit",
    regionSlug: "tigray",
    citySlug: "mekelle",
    category: "architecture",
    tags: ["architecture", "stone", "rebuilding", "mekelle"],
    artwork: { palette: "basalt", seed: 506, motif: "tower" },
    readMinutes: 7,
    likes: 455,
    comments: 33,
    saves: 214,
    views: 9800,
    featured: true,
    publishedAt: "2024-06-25",
  },
  {
    slug: "the-lake-fishermen-of-hawassa",
    title: "The Lake Fishermen of Hawassa",
    excerpt:
      "Gill nets, papyrus edges and a market that sells out before nine in the morning.",
    body: [
      "Fishing on Lake Hawassa is a dawn occupation. Boats push off before light and return with tilapia and catfish, gutted and sold at the shore while still cold from the water.",
      "The lake is small enough that a bad season is visible immediately across the whole fleet. Fishers talk about catch size the way farmers elsewhere talk about rain: as the one variable that decides the year.",
      "By mid-morning the market is over and the boats are pulled up along the papyrus edge, nets hanging to dry , a rhythm closer to a market square than to the resorts along the promenade.",
    ],
    authorId: "u-meron",
    regionSlug: "sidama",
    citySlug: "hawassa",
    category: "stories",
    tags: ["fishing", "lake", "market", "hawassa"],
    artwork: { palette: "rift", seed: 507, motif: "contour" },
    readMinutes: 5,
    likes: 389,
    comments: 24,
    saves: 155,
    views: 7600,
    featured: false,
    publishedAt: "2024-05-07",
  },
  {
    slug: "learning-geez-in-an-age-of-screens",
    title: "Learning Ge'ez in an Age of Screens",
    excerpt:
      "The script survived in churches and manuscripts. Teaching it to a new generation is a different problem.",
    body: [
      "Ge'ez is a liturgical and historical language, and its script , fidel , is the writing system that Amharic and Tigrinya inherited and adapted. Most students meet the script through a religious setting long before any classroom.",
      "Manuscript collections in Gondar and elsewhere are being photographed and catalogued, which changes what is possible for a student working outside a monastery or an archive city.",
      "Learning to read a hand-written manuscript is still not the same as reading type. The training depends on someone sitting beside you, correcting the shape of a character until it is right.",
    ],
    authorId: "u-dawit",
    regionSlug: "amhara",
    citySlug: "gondar",
    category: "history",
    tags: ["geez", "manuscripts", "language", "education"],
    artwork: { palette: "gold", seed: 508, motif: "weave" },
    readMinutes: 6,
    likes: 297,
    comments: 41,
    saves: 178,
    views: 6900,
    featured: false,
    publishedAt: "2024-02-27",
  },
  {
    slug: "dire-dawas-railway-ghosts",
    title: "Dire Dawa's Railway Ghosts",
    excerpt:
      "Metal sheds, a station clock and the long corridor toward the coast that built the city.",
    body: [
      "Dire Dawa exists because of a railway. When the line from Djibouti reached this plain at the start of the twentieth century, a town appeared around the workshops almost immediately.",
      "The old station area still reads as an industrial plan: long sheds, loading platforms, and avenues laid out for freight rather than people. Some of it is in use, some of it is quietly rusting.",
      "Family photo collections from this period are among the most requested donations at local archives. The images document a working rail society , crews, machine shops, station staff , that no longer exists in the same form.",
    ],
    authorId: "u-nahom",
    regionSlug: "dire-dawa",
    citySlug: "dire-dawa",
    category: "history",
    tags: ["railway", "archive", "urban", "dire-dawa"],
    artwork: { palette: "gold", seed: 509, motif: "tower" },
    readMinutes: 6,
    likes: 231,
    comments: 17,
    saves: 96,
    views: 4800,
    featured: false,
    publishedAt: "2024-07-09",
  },
  {
    slug: "bale-in-the-rain",
    title: "Bale in the Rain",
    excerpt:
      "Three days on the Sanetti plateau, where the weather decides everything and the wolves keep their distance.",
    body: [
      "Above 4,000 metres the Sanetti plateau is open, stony and cold, with giant lobelia standing in the drainage lines. Weather moves across it fast enough that a clear morning can be gone within the hour.",
      "The Ethiopian wolf is the reason most people come. Sightings depend on patience and on getting out early , the animals hunt during daylight but they are not performative about it.",
      "Below the plateau, the Harenna forest is the opposite environment: damp, closed-canopy and loud with birds. Moving between the two in a single day is one of the more disorienting experiences the country offers.",
    ],
    authorId: "u-abebe",
    regionSlug: "oromia",
    category: "stories",
    tags: ["bale", "wildlife", "trekking", "weather"],
    artwork: { palette: "highland", seed: 510, motif: "contour" },
    readMinutes: 7,
    likes: 366,
    comments: 21,
    saves: 188,
    views: 8100,
    featured: false,
    publishedAt: "2024-06-11",
  },
];

export const storyBySlug = new Map(stories.map((s) => [s.slug, s]));

export function getStorySeed(slug: string): Story | undefined {
  return storyBySlug.get(slug);
}

export function storiesInRegion(regionSlug: string): Story[] {
  return stories.filter((s) => s.regionSlug === regionSlug);
}

export function storiesByAuthor(authorId: string): Story[] {
  return stories.filter((s) => s.authorId === authorId);
}
// SEED_STORIES_MARKER
