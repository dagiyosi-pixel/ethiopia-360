import type { HistoricalEntry } from "@/types";

/**
 * DEMO SEED DATA — history timeline.
 *
 * IMPORTANT: every entry below carries a `sourceNote`. These are development
 * placeholders written to exercise the timeline UI. Period labels are broad and
 * deliberately unspecific; no figure, date or claim here should be cited or
 * relied upon until reviewed against published scholarship. Editors should
 * replace `detail` and flip `sourceNote` to a real citation.
 */
export const history: HistoricalEntry[] = [
  {
    slug: "early-state-formation",
    period: "1st millennium BCE – early 1st millennium CE",
    sortYear: -800,
    kind: "era",
    title: "Early state formation in the northern highlands",
    summary:
      "States and trading networks emerge in the northern highlands, connecting the interior to Red Sea ports.",
    detail: [
      "The northern highlands sit between the interior and the Red Sea, and that position shaped much of what followed: plateau agriculture, routes toward the coast, and the slow consolidation of political power around them.",
      "Precise chronologies, boundaries and cultural attributions for this period are the subject of ongoing archaeological work.",
    ],
    location: "Northern highlands",
    regionSlug: "tigray",
    coords: { lat: 14.0, lng: 38.7 },
    artwork: { palette: "basalt", seed: 701, motif: "tower" },
    tags: ["archaeology", "trade", "prehistory"],
    sourceNote: "PLACEHOLDER — needs citation. Add an academic reference before publishing.",
  },
  {
    slug: "aksumite-period",
    period: "1st millennium CE",
    sortYear: 300,
    kind: "era",
    title: "The Aksumite period",
    summary:
      "A major trading polity centred on Axum issues its own coinage and develops monumental architecture and script.",
    detail: [
      "Aksum appears in external written sources as a significant trading power, with its own coinage and a monumental funerary architecture of carved granite stelae.",
      "Its script and language — Ge'ez — remain foundational to writing in the region today. The dating of individual monuments and the extent of Aksumite control at different points are debated in the literature.",
    ],
    location: "Axum",
    regionSlug: "tigray",
    coords: { lat: 14.1211, lng: 38.7237 },
    artwork: { palette: "basalt", seed: 702, motif: "tower" },
    tags: ["axum", "archaeology", "script", "trade"],
    sourceNote: "PLACEHOLDER — needs citation.",
  },
  {
    slug: "adoption-of-christianity",
    period: "4th century CE",
    sortYear: 330,
    kind: "event",
    title: "Christianity adopted at the royal court",
    summary:
      "The Aksumite court adopts Christianity, an event that reshapes architecture, manuscript culture and language.",
    detail: [
      "The court's adoption of Christianity in the fourth century is conventionally associated with the reign of Ezana, and remains one of the most consequential turning points in the region's history.",
      "It set in motion a long tradition of church building, manuscript production and liturgical use of Ge'ez that still structures the country's religious landscape.",
    ],
    location: "Axum",
    regionSlug: "tigray",
    coords: { lat: 14.1211, lng: 38.7237 },
    artwork: { palette: "gold", seed: 703, motif: "arch" },
    tags: ["religion", "ezana", "manuscripts", "geez"],
    sourceNote: "PLACEHOLDER — dates conventional in the literature; verify before publishing.",
  },
  {
    slug: "rock-hewn-church-tradition",
    period: "Medieval period",
    sortYear: 1200,
    kind: "place",
    title: "The rock-hewn church tradition",
    summary:
      "Churches excavated downward into rock appear in the highlands, most famously at Lalibela.",
    detail: [
      "Excavating a church down into bedrock is technically distinct from cutting into a cliff face, and it produced a recognisable group of monuments in the highlands.",
      "The Lalibela complex is the best known. Attribution, patronage and construction sequence are historically complex and remain a live area of research.",
    ],
    location: "Lalibela",
    regionSlug: "amhara",
    coords: { lat: 12.0317, lng: 39.0413 },
    artwork: { palette: "rift", seed: 704, motif: "arch" },
    tags: ["architecture", "religion", "lalibela", "tuff"],
    sourceNote: "PLACEHOLDER — needs citation.",
  },
  {
    slug: "gondarine-period",
    period: "17th–18th century",
    sortYear: 1636,
    kind: "era",
    title: "The Gondarine period",
    summary:
      "A permanent royal capital is established at Gondar, producing a distinctive castle-and-church architecture.",
    detail: [
      "Gondar's foundation as a fixed capital changed the relationship between court and country: palaces, churches and a permanent urban population replaced a peripatetic royal camp.",
      "The resulting building complex — the Fasil Ghebbi enclosure and its associated churches — is the clearest surviving expression of that period's architecture.",
    ],
    location: "Gondar",
    regionSlug: "amhara",
    coords: { lat: 12.603, lng: 37.4521 },
    artwork: { palette: "gold", seed: 705, motif: "arch" },
    tags: ["gondar", "architecture", "capital", "castles"],
    sourceNote: "PLACEHOLDER — needs citation.",
  },
  {
    slug: "harar-walled-city",
    period: "16th century onward",
    sortYear: 1550,
    kind: "place",
    title: "Harar as a walled trading city",
    summary:
      "Harar develops behind continuous fortifications as a centre of trade, scholarship and a distinctive urban culture.",
    detail: [
      "The walled town's gates, courtyards and dense lane pattern developed over centuries, producing an urban form quite unlike the highland towns.",
      "Harar also developed as a centre of Islamic scholarship and manuscript production in the Horn, with a distinct spoken language and craft tradition.",
    ],
    location: "Harar",
    regionSlug: "harari",
    coords: { lat: 9.3117, lng: 42.1281 },
    artwork: { palette: "harar", seed: 706, motif: "arch" },
    tags: ["harar", "urban", "trade", "scholarship"],
    sourceNote: "PLACEHOLDER — century is approximate; verify before publishing.",
  },
  {
    slug: "battle-of-adwa",
    period: "1896",
    sortYear: 1896,
    kind: "event",
    title: "The Battle of Adwa",
    summary:
      "A decisive military engagement in the northern highlands with lasting consequences for the region and beyond.",
    detail: [
      "Adwa is among the most widely referenced events in Ethiopian history, commemorated nationally and studied internationally as a turning point in colonial-era African history.",
      "This entry exists as a placeholder so the timeline can demonstrate a discrete, dated event. It requires proper sourcing and an editorial review before publication.",
    ],
    location: "Adwa",
    regionSlug: "tigray",
    coords: { lat: 14.1667, lng: 38.9833 },
    artwork: { palette: "rift", seed: 707, motif: "tower" },
    tags: ["1896", "commemoration", "northern-highlands"],
    sourceNote:
      "PLACEHOLDER — placeholder text only. Must be replaced with sourced copy before publication.",
  },
  {
    slug: "railway-to-the-coast",
    period: "Early 20th century",
    sortYear: 1917,
    kind: "event",
    title: "The railway reaches the interior",
    summary:
      "A rail line from the coast reaches the highland interior, restructuring trade and creating new towns.",
    detail: [
      "The railway corridor changed the geography of trade. Freight that had moved by caravan shifted onto rails, and towns along the line grew around stations and workshops.",
      "Dire Dawa is the clearest example: a city that effectively appeared because the line arrived on the plain below the Harar escarpment.",
    ],
    location: "Dire Dawa",
    regionSlug: "dire-dawa",
    coords: { lat: 9.5931, lng: 41.8661 },
    artwork: { palette: "gold", seed: 708, motif: "tower" },
    tags: ["railway", "trade", "urban", "dire-dawa"],
    sourceNote: "PLACEHOLDER — year approximate; needs citation.",
  },
  {
    slug: "modern-federal-structure",
    period: "Late 20th century – present",
    sortYear: 1995,
    kind: "era",
    title: "The federal structure and later reorganisations",
    summary:
      "The country is organised as a federal republic of regional states, with several later splits and new units.",
    detail: [
      "The current federal arrangement dates to the mid-1990s, and the number of regional states has changed several times since — including the creation of Sidama, South West Ethiopia and later reorganisations in the south.",
      "This matters for any geographic platform: boundary datasets go out of date, which is why this project keeps boundary geometry separate from region records and labels approximate shapes explicitly.",
    ],
    location: "National",
    artwork: { palette: "entoto", seed: 709, motif: "weave" },
    tags: ["federalism", "geography", "administration"],
    sourceNote:
      "PLACEHOLDER — general framing only. Verify specific dates and unit names against official sources.",
  },
  {
    slug: "digital-archive-era",
    period: "Present",
    sortYear: 2024,
    kind: "era",
    title: "A living digital archive",
    summary:
      "Community-contributed photography, oral history and mapping begin to supplement institutional archives.",
    detail: [
      "Institutional archives hold what institutions collected. A community archive can hold the rest: ordinary streets, working days, family photographs, remembered place names.",
      "That is the premise of this platform. Every photograph, story and place added here is intended to become part of a public record that anyone can search by location.",
    ],
    location: "Everywhere",
    artwork: { palette: "nile", seed: 710, motif: "contour" },
    tags: ["archive", "community", "platform"],
    sourceNote: "Editorial, not historical. No citation required.",
  },
];

export const historyBySlug = new Map(history.map((h) => [h.slug, h]));

export function getHistorySeed(slug: string): HistoricalEntry | undefined {
  return historyBySlug.get(slug);
}

/** Timeline order. */
export const historyTimeline = [...history].sort((a, b) => a.sortYear - b.sortYear);
// SEED_HISTORY_END
