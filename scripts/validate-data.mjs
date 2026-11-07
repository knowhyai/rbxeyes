#!/usr/bin/env node
/**
 * Data validation precheck — runs before every build (see package.json:
 * "build": "node scripts/validate-data.mjs && astro build").
 *
 * Guards the JSON under src/data against schema drift so a bad edit fails
 * the build loudly instead of rendering wrong pages. This validates shape
 * and consistency only; it deliberately never touches the network and
 * never re-checks codes automatically — our data is manually maintained
 * (see About page and SOURCE.md).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES = new Set(['active', 'needs-check', 'expired']);
const IDENTIFIERS = /^[a-z0-9-]+$/;

const errors = [];
const warnings = [];

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function isIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateGame(file, game) {
  if (typeof game !== 'object' || game === null) {
    fail(file, 'root must be an object');
    return;
  }

  // --- top-level fields ---
  if (typeof game.id !== 'string' || !IDENTIFIERS.test(game.id)) {
    fail(file, `id must be a lowercase kebab-case string (got ${JSON.stringify(game.id)})`);
  }
  if (typeof game.title !== 'string' || game.title.trim() === '') {
    fail(file, 'title must be a non-empty string');
  }
  if (!isIsoDate(game.lastChecked)) {
    fail(file, `lastChecked must be an ISO calendar date YYYY-MM-DD (got ${JSON.stringify(game.lastChecked)})`);
  }
  if (game.gameUrl !== undefined && !isHttpsUrl(game.gameUrl)) {
    fail(file, `gameUrl must be an https URL (got ${JSON.stringify(game.gameUrl)})`);
  }

  // --- sources ---
  if (!Array.isArray(game.sources) || game.sources.length < 2) {
    fail(file, 'sources must be an array with at least two entries (our two-source rule)');
  } else {
    const seenUrls = new Set();
    for (const [index, source] of game.sources.entries()) {
      const label = `sources[${index}]`;
      if (typeof source.name !== 'string' || source.name.trim() === '') {
        fail(file, `${label}.name must be a non-empty string`);
      }
      if (typeof source.url !== 'string' || !isHttpsUrl(source.url)) {
        fail(file, `${label}.url must be an https URL (got ${JSON.stringify(source.url)})`);
      } else if (seenUrls.has(source.url)) {
        fail(file, `${label}.url duplicates an earlier source: ${source.url}`);
      } else {
        seenUrls.add(source.url);
      }
      if (!isIsoDate(source.updated)) {
        fail(file, `${label}.updated must be an ISO calendar date (got ${JSON.stringify(source.updated)})`);
      }
      if (source.dateKind !== undefined && !['updated', 'published'].includes(source.dateKind)) {
        fail(file, `${label}.dateKind must be "updated" or "published"`);
      }
    }

    // --- codes ---
    if (!Array.isArray(game.codes) || game.codes.length === 0) {
      fail(file, 'codes must be a non-empty array');
      return;
    }
    const seenCodes = new Set();
    for (const [index, code] of game.codes.entries()) {
      const label = `codes[${index}] (${code?.code ?? '?'})`;
      if (typeof code !== 'object' || code === null) {
        fail(file, `${label} must be an object`);
        continue;
      }
      if (typeof code.code !== 'string' || code.code.trim() === '' || code.code !== code.code.trim()) {
        fail(file, `${label}.code must be a non-empty string without surrounding whitespace`);
      } else if (seenCodes.has(code.code)) {
        fail(file, `duplicate code string: ${code.code}`);
      } else {
        seenCodes.add(code.code);
      }
      if (typeof code.reward !== 'string' || code.reward.trim() === '') {
        fail(file, `${label}.reward must be a non-empty string (verbatim from a source)`);
      }
      if (typeof code.status !== 'string' || !STATUSES.has(code.status)) {
        fail(file, `${label}.status must be one of active|needs-check|expired (got ${JSON.stringify(code.status)})`);
      }
      if (typeof code.note !== 'string') {
        fail(file, `${label}.note must be a string (may be empty, must exist)`);
      }
      if (code.status === 'needs-check' && code.note.trim() === '') {
        fail(file, `${label} is needs-check and must explain the uncertainty in its note`);
      }
      if (!Array.isArray(code.sources) || code.sources.length === 0) {
        fail(file, `${label}.sources must be a non-empty array of source URLs`);
      } else {
        for (const url of code.sources) {
          if (!seenUrls.has(url)) {
            fail(file, `${label}.sources references a URL not listed in this game's sources: ${url}`);
          }
        }
        if (code.status === 'active' && new Set(code.sources).size < 2) {
          warnings.push(
            `${file}: ${label} is active but cites fewer than two sources — our two-source rule says such codes belong in needs-check`,
          );
        }
      }
      if (!isIsoDate(code.lastChecked)) {
        fail(file, `${label}.lastChecked must be an ISO calendar date (got ${JSON.stringify(code.lastChecked)})`);
      } else if (code.lastChecked !== game.lastChecked) {
        fail(file, `${label}.lastChecked (${code.lastChecked}) must match the game's lastChecked (${game.lastChecked})`);
      }
      if (!Array.isArray(code.sourceUpdated) || code.sourceUpdated.length === 0) {
        fail(file, `${label}.sourceUpdated must be a non-empty array of dates`);
      } else {
        for (const date of code.sourceUpdated) {
          if (!isIsoDate(date)) {
            fail(file, `${label}.sourceUpdated contains a non-ISO date: ${JSON.stringify(date)}`);
          }
        }
        // sourceUpdated must equal the unique dates of the referenced sources.
        const expected = [
          ...new Set(
            code.sources
              .map((url) => game.sources.find((s) => s.url === url)?.updated)
              .filter((d) => d !== undefined),
          ),
        ].sort();
        const actual = [...new Set(code.sourceUpdated)].sort();
        if (expected.length > 0 && JSON.stringify(actual) !== JSON.stringify(expected)) {
          fail(
            file,
            `${label}.sourceUpdated ${JSON.stringify(actual)} does not match the dates of its referenced sources ${JSON.stringify(expected)}`,
          );
        }
      }
    }
  }
}

/* --- run over every JSON file in src/data --- */
const files = readdirSync(DATA_DIR).filter((name) => name.endsWith('.json')).sort();
if (files.length === 0) {
  console.error('validate-data: no JSON files found in src/data');
  process.exit(1);
}

for (const file of files) {
  const path = join(DATA_DIR, file);
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(file, `JSON parse error: ${error.message}`);
    continue;
  }
  validateGame(file, parsed);
}

for (const warning of warnings) {
  console.warn(`validate-data: warning: ${warning}`);
}

if (errors.length > 0) {
  console.error(`\nvalidate-data: ${errors.length} error(s) in src/data:`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  console.error('\nFix the JSON above (see README.md → "Updating code data") and rebuild.');
  process.exit(1);
}

const totalCodes = files.reduce((sum, file) => {
  const parsed = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8'));
  return sum + (Array.isArray(parsed.codes) ? parsed.codes.length : 0);
}, 0);
console.log(
  `validate-data: OK — ${files.length} game file(s), ${totalCodes} code entries checked (${files.join(', ')})`,
);
