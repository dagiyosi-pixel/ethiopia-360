import type { CultureTopic } from "@/types";

/**
 * DEMO SEED DATA , culture topics.
 * Illustrative development copy. Each topic carries a `sourceNote`; anything
 * involving a specific claim, name or attribution must be sourced by an editor
 * before it is presented as fact. Append above SEED_CULTURE_END.
 */
export const cultureTopics: CultureTopic[] = [
  {
    slug: "languages-of-ethiopia",
    category: "Languages",
    name: "Languages and the fidel script",
    nameAm: "ቋንቋዎች",
    summary:
      "Dozens of languages are spoken across the country, and the Ge'ez-derived fidel script writes several of them.",
    description: [
      "The country's language map is one of the densest in Africa. Cushitic, Semitic, Omotic and Nilo-Saharan languages are all represented, and most speakers work in more than one language day to day.",
      "The fidel script, developed from Ge'ez, is used with adaptations for Amharic and Tigrinya and has been extended to write additional languages. It is a syllabary: each character is a consonant plus a vowel.",
    ],
    artwork: { palette: "gold", seed: 801, motif: "weave" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified script or manuscript photograph.",
    imageSubject: "Ethiopian scripts and language heritage",
    tags: ["language", "script", "geez", "amharic"],
    sourceNote: "PLACEHOLDER , general framing. Verify any counts before publishing.",
  },
  {
    slug: "injera-and-the-shared-plate",
    category: "Food",
    name: "Injera and the shared plate",
    nameAm: "እንጀራ",
    summary:
      "A fermented flatbread of teff, eaten from a shared platter with stews, pulses and greens arranged on top.",
    description: [
      "Injera is both plate and utensil: the bread is spread across a wide tray, toppings are spooned onto it, and everyone eats from the same surface using pieces torn by hand.",
      "Fermentation is what gives it the characteristic sourness, which means preparation starts days before the meal. Regional variations shift the grain mix and the toppings far more than the method.",
    ],
    artwork: { palette: "rift", seed: 802, motif: "weave" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified injera or shared-meal photograph.",
    imageSubject: "Injera and communal dining",
    tags: ["food", "teff", "fermentation", "shared-meal"],
    sourceNote: "PLACEHOLDER , verify regional specifics with local contributors.",
  },
  {
    slug: "coffee-ceremony",
    category: "Coffee",
    name: "The coffee ceremony",
    nameAm: "የቡና ሥርዓት",
    summary:
      "Green beans roasted over coals, ground by hand and brewed three times in a clay pot , a social occasion, not a quick drink.",
    description: [
      "The ceremony is a sequence: incense, roasting, grinding, brewing, then three rounds served in small cups. Each round has its own name and its own strength.",
      "Guests are expected to stay for at least part of it. Refusing outright is unusual; the point is the time spent rather than the caffeine.",
    ],
    artwork: { palette: "highland", seed: 803, motif: "coffee" },
    image: null,
    imageSource: "Neutral generated artwork , pending a verified coffee-ceremony photograph.",
    imageSubject: "Ethiopian coffee ceremony",
    tags: ["coffee", "ceremony", "hospitality", "jebena"],
    sourceNote: "PLACEHOLDER , general description.",
  },
  {
    slug: "music-and-instruments",
    category: "Music",
    name: "Instruments and regional music",
    nameAm: "ሙዚቃ",
    summary:
      "The krar, masenqo and washint belong to the highland tradition, and scale systems differ from place to place.",
    description: [
      "Highland music is built around a small set of instruments , the krar (lyre), masenqo (one-stringed fiddle) and washint (bamboo flute) , often with a vocalist using a distinctly nasal delivery.",
      "Traditional tuning and scale systems vary between regions and are not interchangeable with Western scales, which is why transcriptions often lose something.",
    ],
    artwork: { palette: "gold", seed: 804, motif: "weave" },
    tags: ["music", "instruments", "krar", "washint"],
    sourceNote: "PLACEHOLDER , general description.",
  },
  {
    slug: "traditional-clothing",
    category: "Clothing",
    name: "Handwoven cloth",
    nameAm: "ባህላዊ ልብስ",
    summary:
      "Cotton is spun and woven on narrow handlooms in long strips, then joined with embroidered borders.",
    description: [
      "Much traditional dress is made from handwoven cotton: narrow strips joined edge to edge, finished with embroidered borders that carry most of the colour.",
      "The strongest colour and pattern conventions belong to ceremonial dress, particularly the white ground with woven detail worn on festive occasions.",
    ],
    artwork: { palette: "gold", seed: 805, motif: "weave" },
    tags: ["clothing", "textiles", "weaving", "cotton"],
    sourceNote: "PLACEHOLDER , verify ceremonial specifics.",
  },
  {
    slug: "festival-seasons",
    category: "Festivals",
    name: "Festival seasons",
    nameAm: "በዓላት",
    summary:
      "The religious calendar structures the year: fasting periods, processions and celebrations that move with the local calendar.",
    description: [
      "The liturgical calendar paces the year with long fasting periods followed by major feasts, so food, markets and travel all move with it.",
      "Timkat and Meskel are the most visible public celebrations, involving processions, water and large gatherings of white-clad crowds. Exact dates follow the local calendar, not the Gregorian one.",
    ],
    artwork: { palette: "entoto", seed: 806, motif: "arch" },
    tags: ["festival", "timkat", "meskel", "calendar"],
    sourceNote: "PLACEHOLDER , dates vary by calendar; verify before publishing a schedule.",
  },
  {
    slug: "hospitality-and-everyday-customs",
    category: "Traditions",
    name: "Hospitality and everyday customs",
    nameAm: "እንግዳ ተቀባይነት",
    summary:
      "Sharing food, gifting coffee and receiving guests are social obligations rather than optional courtesies.",
    description: [
      "Offering food and coffee to a visitor is a social obligation rather than a favour, and accepting at least a token amount is the polite move.",
      "Traditions differ sharply between highland, lowland and pastoral communities , from coffee rituals to cattle-naming and age-set systems , so 'local custom' is always a specific, located thing.",
    ],
    artwork: { palette: "harar", seed: 807, motif: "weave" },
    tags: ["traditions", "hospitality", "custom", "social"],
    sourceNote: "PLACEHOLDER , general description.",
  },
  {
    slug: "contemporary-art",
    category: "Art",
    name: "From manuscript painting to contemporary art",
    nameAm: "ጥበብ",
    summary:
      "A long tradition of manuscript illumination informs a contemporary scene of painting, photography and installation.",
    description: [
      "Illuminated manuscripts established a formal visual vocabulary , stylised figures, flat colour fields, patterned borders , that contemporary artists frequently quote and rework.",
      "The contemporary scene is concentrated in the capital, with growing exhibition spaces and a strong photographic and documentary practice.",
    ],
    artwork: { palette: "rift", seed: 808, motif: "weave" },
    tags: ["art", "manuscript", "contemporary", "painting"],
    sourceNote: "PLACEHOLDER , verify named artists before publishing.",
  },
  {
    slug: "oral-and-written-literature",
    category: "Literature",
    name: "Oral poetry and written literature",
    nameAm: "ሥነ ጽሑፍ",
    summary:
      "Poetry is a competitive public form in several traditions, alongside a substantial written literature in multiple languages.",
    description: [
      "In several parts of the country poetry is a public, competitive activity , performed, judged and remembered , and it carries political as well as artistic weight.",
      "Written literature spans Ge'ez religious texts, early twentieth-century Amharic fiction, and contemporary writing in Amharic, Oromo and other languages, much of it now circulating through online publishing.",
    ],
    artwork: { palette: "basalt", seed: 809, motif: "contour" },
    tags: ["literature", "poetry", "oral-tradition", "publishing"],
    sourceNote: "PLACEHOLDER , verify named works before publishing.",
  },
];

export const cultureBySlug = new Map(cultureTopics.map((c) => [c.slug, c]));

export function getCultureSeed(slug: string): CultureTopic | undefined {
  return cultureBySlug.get(slug);
}
// SEED_CULTURE_END
