import type { ArchitectureEntry } from "@/types";

/**
 * DEMO SEED DATA , architecture.
 * Illustrative development copy. Each entry carries a `sourceNote`; specific
 * dates, patrons and attributions must be sourced by an editor before they are
 * presented as fact. Append above SEED_ARCH_END.
 */
export const architectureEntries: ArchitectureEntry[] = [
  {
    slug: "rock-hewn-churches-lalibela",
    name: "Rock-hewn churches of Lalibela",
    category: "religious",
    era: "Medieval",
    regionSlug: "amhara",
    citySlug: "lalibela",
    coords: { lat: 12.0317, lng: 39.0413 },
    summary:
      "Monolithic churches excavated downward into volcanic tuff, interconnected by trenches and tunnels.",
    description: [
      "Each church is carved in place from a single mass of tuff, so the structure has no joints. Roofs, walls, columns and the courtyards between them were all removed as material, not assembled.",
      "The result behaves like a quarry and a cathedral at once. Rainwater management, drainage and the way light enters the excavated courtyards are integral to how the buildings work.",
    ],
    artwork: { palette: "rift", seed: 901, motif: "arch" },
    contributorId: "u-dawit",
    tags: ["religious", "monolithic", "tuff", "medieval"],
    likes: 641,
    views: 18400,
    featured: true,
  },
  {
    slug: "fasil-ghebbi",
    name: "Fasil Ghebbi",
    category: "historic",
    era: "17th century",
    regionSlug: "amhara",
    citySlug: "gondar",
    coords: { lat: 12.6081, lng: 37.4674 },
    summary:
      "A walled royal enclosure of castles and halls in Gondar, mixing local masonry with imported stylistic details.",
    description: [
      "The enclosure holds several distinct buildings from successive reigns, so it reads as an accumulation rather than a single design. Stone masonry, crenellation and arched openings recur throughout.",
      "Interior planning mixes audience halls, residential quarters and service spaces, which makes the compound a useful record of how the court actually operated.",
    ],
    artwork: { palette: "gold", seed: 902, motif: "arch" },
    contributorId: "u-dawit",
    tags: ["castle", "royal", "gondar", "masonry"],
    likes: 512,
    views: 14200,
    featured: true,
  },
  {
    slug: "harari-courtyard-house",
    name: "The Harari courtyard house",
    category: "traditional",
    era: "Developed over several centuries",
    regionSlug: "harari",
    citySlug: "harar",
    coords: { lat: 9.3117, lng: 42.1281 },
    summary:
      "Inward-facing houses organised around a raised hall with wall niches, painted plaster and stacked basketry.",
    description: [
      "The houses turn away from the lane and open into an interior hall raised above street level, with a platform at one end for seating and a wall of niches for display.",
      "Basketry, textiles and painted plaster carry almost all of the decoration, which means the design is portable and frequently rearranged rather than fixed.",
    ],
    artwork: { palette: "harar", seed: 903, motif: "weave" },
    contributorId: "u-yusuf",
    tags: ["domestic", "interior", "harar", "craft"],
    likes: 448,
    views: 11300,
    featured: true,
  },
  {
    slug: "aksumite-stelae",
    name: "Aksumite stelae",
    category: "historic",
    era: "1st millennium CE",
    regionSlug: "tigray",
    citySlug: "axum",
    coords: { lat: 14.1319, lng: 38.7192 },
    summary:
      "Carved granite obelisks set over tomb structures, shaped as multi-storey facades with false windows.",
    description: [
      "The stelae are representations of buildings: each face is carved with a grid of false windows and door frames, as if recording a multi-storey timber-and-masonry architecture that no longer survives.",
      "They stand above underground chambers, which is what makes the field an archaeological site rather than a sculpture park.",
    ],
    artwork: { palette: "basalt", seed: 904, motif: "tower" },
    contributorId: "u-tomas",
    tags: ["granite", "funerary", "axum", "monolith"],
    likes: 571,
    views: 15800,
    featured: true,
  },
  {
    slug: "tukul-and-highland-vernacular",
    name: "Highland vernacular building",
    category: "traditional",
    era: "Continuous tradition",
    regionSlug: "amhara",
    summary:
      "Circular or rectangular houses with stone or mud walls, timber framing and thatched or corrugated roofs.",
    description: [
      "Highland domestic buildings are typically formed from locally available material: dressed or rubble stone, mud render, timber poles and a conical thatch. Where corrugated sheeting has replaced thatch, the plan often stays the same.",
      "The form is climate-driven. Walls are comparatively thick and openings small, which keeps heat in during cold nights at altitude.",
    ],
    artwork: { palette: "highland", seed: 905, motif: "terrace" },
    contributorId: "u-tomas",
    tags: ["vernacular", "domestic", "thatch", "highland"],
    likes: 296,
    views: 7400,
    featured: false,
  },
  {
    slug: "debre-damo-monastery",
    name: "Debre Damo",
    category: "religious",
    era: "Late Aksumite tradition",
    regionSlug: "tigray",
    coords: { lat: 14.3667, lng: 39.2833 },
    summary:
      "A monastery on a flat-topped mountain reached by rope up a sheer cliff, with an early basilica plan.",
    description: [
      "Access is by rope over a vertical rock face, which has kept the site's fabric unusually intact. The church is an early basilica form with timber beams and a carved ceiling.",
      "Because materials could not easily be carried up, the architecture reflects what was possible with local stone and timber rather than imported design.",
    ],
    artwork: { palette: "basalt", seed: 906, motif: "tower" },
    contributorId: "u-dawit",
    tags: ["monastery", "cliff", "basilica", "tigray"],
    likes: 388,
    views: 9600,
    featured: false,
  },
  {
    slug: "light-rail-corridor",
    name: "Addis Ababa light rail",
    category: "contemporary",
    era: "2015",
    regionSlug: "addis-ababa",
    citySlug: "addis-ababa",
    coords: { lat: 9.0192, lng: 38.7525 },
    summary:
      "An elevated and at-grade light rail system threaded through the capital's two main axes.",
    description: [
      "The system runs on two lines crossing the centre, mixing elevated viaduct sections with at-grade track and overhead power. Stations range from simple platforms to multi-level interchange structures.",
      "As infrastructure it is a planning instrument: the alignment defines where density is now being added, rather than following it.",
    ],
    artwork: { palette: "entoto", seed: 907, motif: "tower" },
    contributorId: "u-selam",
    tags: ["transport", "urban", "infrastructure", "modern"],
    likes: 342,
    views: 10200,
    featured: false,
  },
  {
    slug: "merkato-trading-typology",
    name: "The Merkato trading typology",
    category: "urban",
    era: "20th century onward",
    regionSlug: "addis-ababa",
    citySlug: "addis-ababa",
    coords: { lat: 9.0345, lng: 38.7409 },
    summary:
      "An accreted district where structure is provided by commodity, not by a master plan.",
    description: [
      "Merkato has almost no designed public space. Its logic is internal: each trade colonises a street or block, wholesale sits beside retail, and circulation paths follow the goods.",
      "Studying it as architecture means studying logistics , where trucks can reach, where goods can be stored, how a lane widens just enough for a hand cart to turn.",
    ],
    artwork: { palette: "gold", seed: 908, motif: "weave" },
    contributorId: "u-rahel",
    tags: ["market", "informal", "logistics", "urban"],
    likes: 264,
    views: 6800,
    featured: false,
  },
  {
    slug: "hawassa-lakefront",
    name: "Hawassa lakefront promenade",
    category: "contemporary",
    era: "Recent decades",
    regionSlug: "sidama",
    citySlug: "hawassa",
    coords: { lat: 7.0605, lng: 38.4594 },
    summary:
      "A public edge along the lake combining walkways, landings and resort frontage on the Rift floor.",
    description: [
      "The promenade is the city's main public room: a continuous edge where boats, anglers, walkers and hotel frontage meet the water.",
      "It is also the clearest example in the city of how lake access is negotiated , between fishing livelihoods, tourism and public use.",
    ],
    artwork: { palette: "rift", seed: 909, motif: "contour" },
    contributorId: "u-meron",
    tags: ["public-space", "lakefront", "landscape", "rift"],
    likes: 231,
    views: 5600,
    featured: false,
  },
  {
    slug: "dire-dawa-rail-quarter",
    name: "Dire Dawa railway quarter",
    category: "urban",
    era: "Early 20th century",
    regionSlug: "dire-dawa",
    citySlug: "dire-dawa",
    coords: { lat: 9.5908, lng: 41.8619 },
    summary:
      "A planned industrial grid of sheds, platforms and avenues laid out around freight rather than residents.",
    description: [
      "The rail-side quarter was planned for throughput: long sheds parallel to the track, wide turning space for goods yards, and staff housing on a separate grid.",
      "Much of the fabric survives in altered use, which makes it an unusually legible record of colonial-era rail infrastructure in the interior.",
    ],
    artwork: { palette: "gold", seed: 910, motif: "tower" },
    contributorId: "u-nahom",
    tags: ["railway", "industrial", "grid", "dire-dawa"],
    likes: 198,
    views: 4900,
    featured: false,
  },
];

export const architectureBySlug = new Map(architectureEntries.map((a) => [a.slug, a]));

export function getArchitectureSeed(slug: string): ArchitectureEntry | undefined {
  return architectureBySlug.get(slug);
}

export const ARCHITECTURE_CATEGORY_LABELS: Record<ArchitectureEntry["category"], string> = {
  historic: "Historic",
  traditional: "Traditional",
  religious: "Religious",
  urban: "Urban",
  contemporary: "Contemporary",
};
// SEED_ARCH_END
