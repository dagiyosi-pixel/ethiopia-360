#!/usr/bin/env node
/**
 * Image provenance check.
 *
 * Every photograph in the atlas is declared in `src/data/images.ts` together
 * with the Wikimedia Commons file it came from. This script verifies:
 *
 *  1. the URL builds on a trusted host (structure, offline);
 *  2. the hash path matches the Commons file name it claims to come from, so a
 *     stale path or the wrong file is caught before it renders;
 *  3. the named file still exists on Commons (one batched API call).
 *
 * The API is used instead of HEAD requests because Wikimedia rate-limits bursts
 * of direct CDN requests, while a single API call can resolve dozens of files.
 *
 * Usage:  npm run check:images
 * Exit code 1 when anything fails, so it can be wired into CI later.
 */

import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const REGISTRY = new URL("../src/data/images.ts", import.meta.url);
const API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "Ethiopia360-image-check/1.0 (development; run by the site owner)";
const TRUSTED_HOSTS = new Set(["upload.wikimedia.org", "thumb.wikimedia.org"]);
const BATCH = 40;

/** `file: "…", url: wm("…")` pairs, including the multi-line ones. */
const ENTRY = /file:\s*"((?:[^"\\]|\\.)*)",\s*(?:\r?\n\s*)?url:\s*wm\(\s*"([^"]+)"\s*,?\s*\)/g;

/**
 * Wikimedia stores files under `<md5[0]>/<md5[0..2]>/<file name>`, and
 * thumbnails append `thumb/<hash path>/<width>px-<file name>`.
 */
function commonsPath(fileName) {
  const underscored = fileName.replace(/ /g, "_");
  const hash = createHash("md5").update(underscored, "utf8").digest("hex");
  return `${hash[0]}/${hash.slice(0, 2)}/${underscored}`;
}

const source = await readFile(REGISTRY, "utf8");
const entries = [...source.matchAll(ENTRY)].map((match) => ({
  file: match[1].replace(/\\"/g, '"'),
  path: match[2],
}));

if (entries.length === 0) {
  console.error("No curated image entries found — did the registry format change?");
  process.exit(1);
}

console.log(`Checking ${entries.length} curated image entries against Wikimedia Commons…\n`);

let failures = 0;
let warnings = 0;

/* ------------------------ structural checks (no network) ----------------------- */

for (const entry of entries) {
  const url = `https://upload.wikimedia.org/wikipedia/commons/${entry.path}`;
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    failures += 1;
    console.error(`  BAD URL  ${entry.file}`);
    continue;
  }

  if (!TRUSTED_HOSTS.has(host)) {
    failures += 1;
    console.error(`  HOST     ${entry.file}\n           unexpected host ${host}`);
    continue;
  }

  // Registry URLs are percent-encoded (spaces are underscores, commas are %2C),
  // so compare against the decoded path.
  const path = decodeURIComponent(entry.path).replace(/^thumb\//, "").replace(/\/\d+px-.*$/, "");
  if (path !== commonsPath(entry.file)) {
    warnings += 1;
    console.warn(
      `  PATH?    ${entry.file}\n           expected  ${commonsPath(entry.file)}\n           registry  ${path}`,
    );
  }
}

/* -------------------------- existence check (batched) ------------------------- */

for (let start = 0; start < entries.length; start += BATCH) {
  const batch = entries.slice(start, start + BATCH);
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: batch.map((entry) => `File:${entry.file}`).join("|"),
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1280",
  });

  let payload;
  try {
    const response = await fetch(`${API}?${params.toString()}`, {
      headers: { "user-agent": USER_AGENT },
    });
    payload = await response.json();
  } catch (error) {
    failures += batch.length;
    console.error(`  API request failed: ${error.message}`);
    continue;
  }

  const byTitle = new Map();
  for (const page of Object.values(payload?.query?.pages ?? {})) {
    byTitle.set(String(page.title).replace(/^File:/, ""), page);
  }

  for (const entry of batch) {
    const page = byTitle.get(entry.file);
    if (!page || page.missing !== undefined) {
      failures += 1;
      console.error(`  MISSING  ${entry.file}\n           (no such file on Commons)`);
      continue;
    }
    if (!page.imageinfo?.[0]?.thumburl) {
      warnings += 1;
      console.warn(`  NO THUMB ${entry.file}\n           (file exists but has no 1280px thumbnail)`);
      continue;
    }
    console.log(`  exists   ${entry.file}`);
  }
}

console.log(
  `\n${entries.length - failures - warnings}/${entries.length} curated images resolved.` +
    (failures ? ` ${failures} missing.` : "") +
    (warnings ? ` ${warnings} need review.` : ""),
);

/* Setting exitCode (rather than calling process.exit) lets Node close the fetch
   handles cleanly on Windows. */
process.exitCode = failures ? 1 : 0;