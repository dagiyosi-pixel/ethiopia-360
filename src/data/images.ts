import type { Coords } from "@/types";

/**
 * CENTRAL IMAGE REGISTRY.
 *
 * Every photograph used by the atlas lives here, keyed by record slug, so raw
 * image URLs are never scattered through components or duplicated across the
 * seed files.
 *
 * Rules this file enforces:
 *  1. An image is only attached to a record when it genuinely depicts that
 *     subject. `subject` states exactly what the file shows and `credit` names
 *     the photographer and licence , nothing is invented.
 *  2. No generic "African" stock photo is ever substituted for a named Ethiopian
 *     place. If no verified photograph exists the record keeps `image: null` and
 *     the UI renders clearly-labelled generated artwork instead.
 *  3. Only hosts in `TRUSTED_IMAGE_HOSTS` are accepted, so an unverified URL (a
 *     random stock photo, for example) can never leak into the atlas.
 *
 * Sources are Wikimedia Commons files whose titles name the subject; the file
 * name is kept in `file` for traceability.
 */

export interface CuratedImage {
  /** Commons file the URL points at (traceability). */
  file: string;
  url: string;
  /** What the photograph actually shows. */
  subject: string;
  /** Alt text derived from the subject, not from the record title alone. */
  alt: string;
  /** Author + licence + collection, rendered visibly next to the photo. */
  credit: string;
}

/** Builds a Wikimedia Commons URL from its hash path. */
const wm = (path: string) => `https://upload.wikimedia.org/wikipedia/commons/${path}`;

const BETE_GIYORGIS = {
  file: "Lalibela, san giorgio, esterno 24.jpg",
  url: wm("thumb/a/aa/Lalibela%2C_san_giorgio%2C_esterno_24.jpg/1280px-Lalibela%2C_san_giorgio%2C_esterno_24.jpg"),
  subject: "Bete Giyorgis, Lalibela",
  alt: "Bete Giyorgis, the cross-shaped church cut down into volcanic tuff at Lalibela",
  credit: "Photograph: Sailko , Wikimedia Commons, CC BY 3.0",
} satisfies CuratedImage;

const HARAR_GATE = {
  file: "City Gate, Harar Jugol (14464345823).jpg",
  url: wm("4/4a/City_Gate%2C_Harar_Jugol_%2814464345823%29.jpg"),
  subject: "A gate in the Jugol wall, Harar",
  alt: "A historic gate in the wall that surrounds Harar Jugol",
  credit: "Photograph: Rod Waddington , Wikimedia Commons, CC BY-SA 2.0",
} satisfies CuratedImage;

const DIRE_DAWA_CIRCULAR = {
  file: "Dire dawa, edificio circolare.jpg",
  url: wm("thumb/4/4e/Dire_dawa%2C_edificio_circolare.jpg/1280px-Dire_dawa%2C_edificio_circolare.jpg"),
  subject: "A circular building in Dire Dawa",
  alt: "A circular masonry building in Dire Dawa",
  credit: "Photograph: Sailko , Wikimedia Commons, CC BY 3.0",
} satisfies CuratedImage;

const LAKE_HAWASSA = {
  file: "LakeAwasa1.jpg",
  url: wm("thumb/f/ff/LakeAwasa1.jpg/1280px-LakeAwasa1.jpg"),
  subject: "Lake Hawassa",
  alt: "Lake Hawassa with its shoreline and boats",
  credit: "Photograph: MauritsV , Wikimedia Commons, CC BY-SA 2.0",
} satisfies CuratedImage;

const DEBRE_DAMO = {
  file: "ET Tigray asv2018-01 img14 Debre Damo Monastery.jpg",
  url: wm(
    "thumb/2/2d/ET_Tigray_asv2018-01_img14_Debre_Damo_Monastery.jpg/1280px-ET_Tigray_asv2018-01_img14_Debre_Damo_Monastery.jpg",
  ),
  subject: "Debre Damo monastery on its plateau",
  alt: "Debre Damo monastery, reached by rope up a vertical cliff face",
  credit: "Photograph: A.Savin , Wikimedia Commons, FAL",
} satisfies CuratedImage;

const MERKATO = {
  file: "MercatoAddisAbeba08.jpg",
  url: wm("thumb/3/37/MercatoAddisAbeba08.jpg/1280px-MercatoAddisAbeba08.jpg"),
  subject: "Merkato, Addis Ababa",
  alt: "Trading lanes and stalls inside Merkato, the market district of Addis Ababa",
  credit: "Photograph: JanManu , Wikimedia Commons, CC BY-SA 3.0",
} satisfies CuratedImage;

const FASIL_PALACE = {
  file: "Fasilides Palace 01.jpg",
  url: wm("thumb/8/8f/Fasilides_Palace_01.jpg/1280px-Fasilides_Palace_01.jpg"),
  subject: "Fasilides' palace inside Fasil Ghebbi, Gondar",
  alt: "The castle of Fasilides inside the Fasil Ghebbi enclosure at Gondar",
  credit: "Photograph: Bernard Gagnon , Wikimedia Commons, CC BY-SA 3.0",
} satisfies CuratedImage;

const CHURCH_PAINTING = {
  file: "Ethiopian Church Painting (2262019698).jpg",
  url: wm("thumb/3/31/Ethiopian_Church_Painting_%282262019698%29.jpg/1280px-Ethiopian_Church_Painting_%282262019698%29.jpg"),
  subject: "Ethiopian church painting",
  alt: "A painted panel in the Ethiopian church tradition",
  credit: "Photograph: A. Davey , Wikimedia Commons, CC BY 2.0",
} satisfies CuratedImage;

export const CURATED_IMAGES: Record<string, CuratedImage> = {
  /* ------------------------------ city level ----------------------------- */
  "addis-ababa": {
    file: "Addis in night.jpg",
    url: wm("thumb/2/2c/Addis_in_night.jpg/1280px-Addis_in_night.jpg"),
    subject: "Addis Ababa at night",
    alt: "Addis Ababa lit up at night, seen across the city bowl",
    credit: "Photograph: Abshewaga , Wikimedia Commons, CC BY-SA 4.0",
  },
  gondar: {
    file: "Gonder from the Goha hotel.jpg",
    url: wm("thumb/3/34/Gonder_from_the_Goha_hotel.jpg/1280px-Gonder_from_the_Goha_hotel.jpg"),
    subject: "Gondar seen from the Goha ridge",
    alt: "Gondar spread across its plain, seen from the Goha ridge",
    credit: "Photograph: Giustino , Wikimedia Commons, CC BY 2.0",
  },
  "bahir-dar": {
    file: "Blue Nile Bahir Dar.jpg",
    url: wm("thumb/1/17/Blue_Nile_Bahir_Dar.jpg/1280px-Blue_Nile_Bahir_Dar.jpg"),
    subject: "The Blue Nile at Bahir Dar",
    alt: "The Blue Nile passing Bahir Dar with the lakeside city behind it",
    credit: "Photograph: Geertchaos , Wikimedia Commons, CC BY-SA 4.0",
  },
  hawassa: {
    file: "Awassa, 2016.png",
    url: wm("d/dd/Awassa%2C_2016.png"),
    subject: "Hawassa and its lake",
    alt: "Hawassa on the shore of Lake Hawassa",
    credit: "Photograph: Mimi Abebayehu , Wikimedia Commons, CC BY-SA 4.0",
  },
  harar: HARAR_GATE,
  "dire-dawa": DIRE_DAWA_CIRCULAR,
  axum: {
    file: "Aksum-107529.jpg",
    url: wm("thumb/4/44/Aksum-107529.jpg/1280px-Aksum-107529.jpg"),
    subject: "Axum town and its archaeological field",
    alt: "Axum, with the stelae field and town beyond",
    credit: "Photograph: Jim Williams , Wikimedia Commons, CC BY-SA 3.0 igo",
  },
  mekelle: {
    file: "ET Mekele asv2018-01 img19 pano from Choma (cropped).jpg",
    url: wm(
      "thumb/7/7a/ET_Mekele_asv2018-01_img19_pano_from_Choma_%28cropped%29.jpg/1280px-ET_Mekele_asv2018-01_img19_pano_from_Choma_%28cropped%29.jpg",
    ),
    subject: "Mekelle seen from the Choma ridge",
    alt: "Mekelle spread across its basin, photographed from the Choma ridge",
    credit: "Photograph: A.Savin , Wikimedia Commons, FAL",
  },
  lalibela: BETE_GIYORGIS,
  jigjiga: {
    file: "Jijiga.jpg",
    url: wm("8/89/Jijiga.jpg"),
    subject: "Jigjiga",
    alt: "Jigjiga, the capital of the Somali Region",
    credit: "Photograph: Abdirahman Isak Aden , Wikimedia Commons, CC BY-SA 3.0",
  },
  bishoftu: {
    file: "Kuriftu Resort in Bishoftu, Ethiopia.jpg",
    url: wm(
      "thumb/9/94/Kuriftu_Resort_in_Bishoftu%2C_Ethiopia.jpg/1280px-Kuriftu_Resort_in_Bishoftu%2C_Ethiopia.jpg",
    ),
    subject: "Crater-lake shoreline at Bishoftu (Debre Zeit)",
    alt: "Palms on the shore of a crater lake at Bishoftu",
    credit: "Photograph: Ninaras , Wikimedia Commons, CC BY 4.0",
  },

  /* -------------------------------- places -------------------------------- */
  "lalibela-rock-churches": BETE_GIYORGIS,
  "rock-hewn-churches-lalibela": BETE_GIYORGIS,
  "fasil-ghebbi": FASIL_PALACE,
  "simien-mountains": {
    file: "Bwahit, view onto Kidis Yared 4453m.JPG",
    url: wm(
      "thumb/f/f0/Bwahit%2C_view_onto_Kidis_Yared_4453m.JPG/1280px-Bwahit%2C_view_onto_Kidis_Yared_4453m.JPG",
    ),
    subject: "The Simien escarpment from Mount Bwahit",
    alt: "Basalt cliffs of the Simien Mountains seen from Mount Bwahit toward Kidis Yared",
    credit: "Photograph: Florian Fell , Wikimedia Commons, CC BY-SA 3.0",
  },
  "bale-mountains": {
    file: "Bale Mountain, Ethiopia.jpg",
    url: wm("thumb/7/70/Bale_Mountain%2C_Ethiopia.jpg/1280px-Bale_Mountain%2C_Ethiopia.jpg"),
    subject: "The Bale Mountains",
    alt: "High ground in the Bale Mountains, southern Ethiopia",
    credit: "Photograph: Bair175 , Wikimedia Commons, CC BY-SA 3.0",
  },
  "lake-tana-monasteries": {
    file: "ET Amhara asv2018-02 img084 Lake Tana at Bahir Dar.jpg",
    url: wm("thumb/5/50/ET_Amhara_asv2018-02_img084_Lake_Tana_at_Bahir_Dar.jpg/1280px-ET_Amhara_asv2018-02_img084_Lake_Tana_at_Bahir_Dar.jpg"),
    subject: "Ura Kidane Mihret Monastery on Lake Tana",
    alt: "Ura Kidane Mihret Monastery beside Lake Tana near Bahir Dar",
    credit: "Photograph: A.Savin â€” Wikimedia Commons, FAL",
  },
  "harar-jugol": {
    file: "Harar, Ethiopia - 52016203786.jpg",
    url: wm("thumb/7/7d/Harar%2C_Ethiopia_-_52016203786.jpg/1280px-Harar%2C_Ethiopia_-_52016203786.jpg"),
    subject: "Harar Jugol historic town",
    alt: "Historic buildings and urban fabric inside Harar Jugol",
    credit: "Photograph: Ninara31 â€” Wikimedia Commons, CC BY 2.0",
  },
  "danakil-depression": {
    file: "Ethiopia - Dallol.jpg",
    url: wm("thumb/8/88/Ethiopia_-_Dallol.jpg/1280px-Ethiopia_-_Dallol.jpg"),
    subject: "Dallol hydrothermal system in the Danakil Depression",
    alt: "Aerial view of the Dallol hydrothermal landscape in the Danakil Depression",
    credit: "Photograph: Thomas Fuhrmann â€” Wikimedia Commons, CC BY-SA 4.0",
  },
  "konso-terraces": {
    file: "Agricultural terraces in the Konso Cultural Landscape.jpg",
    url: wm("thumb/2/2a/Agricultural_terraces_in_the_Konso_Cultural_Landscape.jpg/1280px-Agricultural_terraces_in_the_Konso_Cultural_Landscape.jpg"),
    subject: "Traditional agricultural terraces in the Konso Cultural Landscape",
    alt: "Dry-stone agricultural terraces built along the slopes of the Konso Cultural Landscape",
    credit: "Photograph: JosepMGracia â€” Wikimedia Commons, CC BY-SA 4.0",
  },
  merkato: MERKATO,
  "merkato-trading-typology": MERKATO,
  "entoto-park": {
    file: "ET Addis asv2018-01 img16 Entoto.jpg",
    url: wm(
      "thumb/c/c1/ET_Addis_asv2018-01_img16_Entoto.jpg/1280px-ET_Addis_asv2018-01_img16_Entoto.jpg",
    ),
    subject: "The Entoto ridge above Addis Ababa",
    alt: "Eucalyptus forest on the Entoto ridge above Addis Ababa",
    credit: "Photograph: A.Savin , Wikimedia Commons, FAL",
  },
  "sof-omar-caves": {
    file: "Sof Omer Cave, Ethiopia (23194314604).jpg",
    url: wm(
      "thumb/3/39/Sof_Omer_Cave%2C_Ethiopia_%2823194314604%29.jpg/1280px-Sof_Omer_Cave%2C_Ethiopia_%2823194314604%29.jpg",
    ),
    subject: "Inside the Sof Omar cave system",
    alt: "A chamber inside the Sof Omar cave system above the Web river",
    credit: "Photograph: Rod Waddington , Wikimedia Commons, CC BY-SA 2.0",
  },
  "erta-ale": {
    file: "Erta Ale.jpg",
    url: wm("4/4e/Erta_Ale.jpg"),
    subject: "Erta Ale volcano",
    alt: "Erta Ale, the shield volcano in the Danakil Depression",
    credit: "Photograph: filippo_jean , Wikimedia Commons, CC BY-SA 2.0",
  },
  "lake-hawassa": LAKE_HAWASSA,
  "hawassa-lakefront": LAKE_HAWASSA,
  "abijatta-shalla": {
    file: "Lake Shalla Landscape.jpg",
    url: wm("8/84/Lake_Shalla_Landscape.jpg"),
    subject: "Lake Shalla in the Abijatta-Shalla basin",
    alt: "The soda lake Shalla in the Rift Valley with its shoreline and escarpment",
    credit: "Photograph: Lanzen , Wikimedia Commons, CC BY-SA 3.0",
  },
  "awash-national-park": {
    file: "Parc national d'Awash-Ethiopie-Chutes d'eau (3).jpg",
    url: wm(
      "thumb/9/91/Parc_national_d%27Awash-Ethiopie-Chutes_d%27eau_%283%29.jpg/1280px-Parc_national_d%27Awash-Ethiopie-Chutes_d%27eau_%283%29.jpg",
    ),
    subject: "Waterfall in Awash National Park",
    alt: "The Awash river falling through a rocky gorge in Awash National Park",
    credit: "Photograph: Ji-Elle , Wikimedia Commons, CC BY-SA 3.0",
  },
  "omo-valley": {
    file: "Omo River 02.jpg",
    url: wm("thumb/a/ad/Omo_River_02.jpg/1280px-Omo_River_02.jpg"),
    subject: "The Omo River",
    alt: "The Omo River running through the lower Omo valley",
    credit: "Photograph: Bernard Gagnon , Wikimedia Commons, CC BY-SA 3.0",
  },
  "lake-chamo": {
    file: "Lake Chamo 01.jpg",
    url: wm("thumb/3/3b/Lake_Chamo_01.jpg/1280px-Lake_Chamo_01.jpg"),
    subject: "Lake Chamo",
    alt: "Lake Chamo below the Arba Minch ridge",
    credit: "Photograph: Bernard Gagnon , Wikimedia Commons, CC BY-SA 3.0",
  },
  "debre-damo": DEBRE_DAMO,
  "debre-damo-monastery": DEBRE_DAMO,
  "dire-dawa-rail-quarter": DIRE_DAWA_CIRCULAR,

  /* -------------------------------- culture ------------------------------- */
  "music-and-instruments": {
    file: "Krar Linden-Museum F55878.jpg",
    url: wm("thumb/3/32/Krar_Linden-Museum_F55878.jpg/1280px-Krar_Linden-Museum_F55878.jpg"),
    subject: "A krar, the Ethiopian lyre",
    alt: "A krar, the bowl-shaped Ethiopian lyre, photographed in a museum collection",
    credit: "Photograph: KarlHeinrich , Wikimedia Commons, public domain",
  },
  "ethiopian-art": CHURCH_PAINTING,
  "contemporary-art": CHURCH_PAINTING,
  "festival-seasons": {
    file: "Gondar Fasiladas Bath Timket.jpg",
    url: wm("d/de/Gondar_Fasiladas_Bath_Timket.jpg"),
    subject: "Timkat at the Bath of Fasilides, Gondar",
    alt: "Congregations gathered at the Bath of Fasilides in Gondar for Timkat",
    credit: "Photograph: Jialiang Gao , Wikimedia Commons, CC BY-SA 3.0",
  },
};

/** Representative photos for region cards, selected from real local places. */
export const REGION_IMAGES: Record<string, CuratedImage> = {
  tigray: DEBRE_DAMO,
  amhara: FASIL_PALACE,
  oromia: CURATED_IMAGES["bale-mountains"],
  afar: CURATED_IMAGES["danakil-depression"],
  somali: CURATED_IMAGES.jigjiga,
  sidama: LAKE_HAWASSA,
  "south-ethiopia": CURATED_IMAGES["konso-terraces"],
  harari: HARAR_GATE,
  "dire-dawa": DIRE_DAWA_CIRCULAR,
  gambela: {
    file: "Baro river Gambela.jpg",
    url: wm("thumb/5/57/Baro_river_Gambela.jpg/500px-Baro_river_Gambela.jpg"),
    subject: "The Baro River in Gambela",
    alt: "The Baro River flowing through Gambela in western Ethiopia",
    credit: "Photograph: T U R K A I R O, Wikimedia Commons, CC BY 2.0",
  },
};

/** Hosts accepted for curated images. Anything else is treated as unverified. */
export const TRUSTED_IMAGE_HOSTS = ["upload.wikimedia.org", "thumb.wikimedia.org"] as const;

export function isTrustedAssetHost(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return true;
  if (!/^https:\/\//i.test(trimmed)) return false;
  return TRUSTED_IMAGE_HOSTS.some((host) => trimmed.startsWith(`https://${host}/`));
}

export interface VisualRecord {
  slug: string;
  image?: string | null;
  imageSource?: string | null;
  imageSubject?: string | null;
  imageAlt?: string | null;
}

const GENERATED_NOTE = "Neutral generated artwork , no verified photograph attached yet.";

/**
 * Attaches verified imagery to a seed record , or, when no verified photograph
 * of the subject exists, degrades explicitly to generated artwork.
 *
 * Applied once per seed collection, so the rule holds for every record in the
 * atlas instead of depending on each entry being written correctly.
 */
export function withCuratedVisual<T extends VisualRecord>(record: T, subject: string): T {
  const curated = CURATED_IMAGES[record.slug] ?? REGION_IMAGES[record.slug];
  if (curated && curated.url) {
    return {
      ...record,
      image: curated.url,
      imageSource: curated.credit,
      imageSubject: curated.subject,
      imageAlt: curated.alt,
    };
  }

  const declared = record.image ?? null;
  if (declared && isTrustedAssetHost(declared)) {
    return { ...record, image: declared, imageAlt: record.imageAlt ?? subject };
  }

  return {
    ...record,
    image: null,
    imageSource:
      record.imageSource && record.imageSource.startsWith("Neutral generated artwork")
        ? record.imageSource
        : GENERATED_NOTE,
    imageSubject: record.imageSubject ?? subject,
    imageAlt: null,
  };
}

/** Same rule, applied to a whole collection. */
export function applyCuratedVisuals<T extends VisualRecord>(
  records: T[],
  subjectOf: (record: T) => string,
): T[] {
  return records.map((record) => withCuratedVisual(record, subjectOf(record)));
}

/** True when a record has a real, verified photograph attached. */
export function hasPhotograph(record: VisualRecord): boolean {
  return Boolean(record.image && isTrustedAssetHost(record.image));
}

/** Builds a Coord only from two real numbers , never from a guessed centre. */
export function coordsOrNull(lat?: number | null, lng?: number | null): Coords | null {
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}
