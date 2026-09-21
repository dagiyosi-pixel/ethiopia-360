/**
 * Builds the region boundary file used by the interactive map.
 *
 * Input : public/geo/_raw.geojson  (downloaded from geoBoundaries, ETH ADM1,
 *         CC BY 4.0 — see README for the exact source URL)
 * Output: public/geo/ethiopia-regions.geojson  (rounded + decimated, with the
 *         application's region slugs attached)
 *
 * Run with:  node scripts/build-geo.mjs
 *
 * The output is intentionally kept separate from the region records in
 * `src/data/regions.ts`: boundary datasets go out of date (Ethiopia has created
 * new regional states several times since 2019), so the app treats geometry as
 * a replaceable asset rather than a source of truth.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const RAW = path.join(ROOT, "public", "geo", "_raw.geojson");
const OUT = path.join(ROOT, "public", "geo", "ethiopia-regions.geojson");

/** geoBoundaries `shapeName` -> application region slug. */
const SLUG_BY_KEY = {
  "Addis Ababa": "addis-ababa",
  Afar: "afar",
  Amhara: "amhara",
  "Beneshangul Gumu": "benishangul-gumuz",
  "Dire Dawa": "dire-dawa",
  Gambela: "gambela",
  Hareri: "harari",
  Oromia: "oromia",
  SNNPR: "snnpr",
  Somali: "somali",
  Tigray: "tigray",
};

const PRECISION = 3; // ~110 m at this latitude — plenty for a country-scale map
const MAX_VERTICES_PER_RING = 900;

function round(coord) {
  const factor = 10 ** PRECISION;
  return [
    Math.round(coord[0] * factor) / factor,
    Math.round(coord[1] * factor) / factor,
  ];
}

function decimate(ring) {
  if (ring.length <= MAX_VERTICES_PER_RING) return ring;
  const step = Math.ceil(ring.length / MAX_VERTICES_PER_RING);
  const out = [];
  for (let i = 0; i < ring.length; i += step) out.push(ring[i]);
  const last = ring[ring.length - 1];
  const first = out[0];
  if (first[0] !== last[0] || first[1] !== last[1]) out.push(last);
  return out;
}

function simplifyGeometry(geometry) {
  if (geometry.type === "Polygon") {
    return {
      type: "Polygon",
      coordinates: geometry.coordinates.map((ring) => decimate(ring.map(round))),
    };
  }
  if (geometry.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: geometry.coordinates.map((polygon) =>
        polygon.map((ring) => decimate(ring.map(round))),
      ),
    };
  }
  return geometry;
}

async function main() {
  const raw = JSON.parse(await readFile(RAW, "utf8"));

  const features = [];
  const unmapped = [];

  for (const feature of raw.features) {
    const key = feature.properties?.shapeName ?? feature.properties?.shapeISO;
    const slug = SLUG_BY_KEY[key];
    if (!slug) {
      unmapped.push(key);
      continue;
    }
    features.push({
      type: "Feature",
      properties: { key, slug, name: key },
      geometry: simplifyGeometry(feature.geometry),
    });
  }

  const collection = {
    type: "FeatureCollection",
    // Attribution travels with the data so the licence is never lost.
    license: "geoBoundaries gbOpen ETH ADM1 — CC BY 4.0",
    source: "https://www.geoboundaries.org/",
    features,
  };

  await writeFile(OUT, JSON.stringify(collection), "utf8");

  const size = JSON.stringify(collection).length;
  console.log(`Wrote ${features.length} region boundaries to ${path.relative(ROOT, OUT)}`);
  console.log(`Size: ${(size / 1024).toFixed(1)} KB`);
  if (unmapped.length) {
    console.log(`Unmapped boundary names (skipped): ${unmapped.join(", ")}`);
  }
}

main().catch((error) => {
  console.error("build-geo failed:", error);
  process.exitCode = 1;
});
