#!/usr/bin/env node
/**
 * npi-build.js — Weekly NPPES dental provider extractor
 *
 * Streams the 11GB NPPES full replacement file, filters to dental taxonomy codes,
 * writes compact JSON for NightLeak's NPI gate autocomplete.
 *
 * Run:
 *   node npi-build.js \
 *     --input  "../../hivera-archive/projects/mouthmap/data/npi/npidata_pfile_20050523-20260208.csv" \
 *     --output "./npi-dentists.json" \
 *     --sample "./npi-dentists-sample.json"
 *
 * Optional:
 *   --changelog "./npi-dentists-changelog-2026-04-12.json"
 *   --prev      "./npi-dentists-prev.json"   (compare against a prior run)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const readline = require('readline');

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i].replace(/^--/, '');
  args[key] = process.argv[i + 1];
}

const INPUT_PATH     = args.input;
const OUTPUT_PATH    = args.output     || './npi-dentists.json';
const SAMPLE_PATH    = args.sample     || './npi-dentists-sample.json';
const CHANGELOG_PATH = args.changelog  || null;
const PREV_PATH      = args.prev       || null;

if (!INPUT_PATH) {
  console.error('ERROR: --input <path> is required');
  process.exit(1);
}
if (!fs.existsSync(INPUT_PATH)) {
  console.error(`ERROR: Input file not found: ${INPUT_PATH}`);
  process.exit(1);
}

// ── Dental taxonomy codes ─────────────────────────────────────────────────────
// All codes starting with 1223 (dental specialties) + catch-all prefix check
const DENTAL_CODES = new Set([
  '122300000X', // General Practice
  '1223G0001X', // General Practice (alternate)
  '1223P0221X', // Pediatric Dentistry
  '1223D0001X', // Dental Public Health
  '1223E0200X', // Endodontics
  '1223X0400X', // Orthodontics and Dentofacial Orthopedics
  '1223P0300X', // Periodontics
  '1223S0112X', // Oral and Maxillofacial Surgery
  '1223P0106X', // Prosthodontics
  '1223D0008X', // Oral and Maxillofacial Radiology
  '1223X0008X', // Oral and Maxillofacial Pathology
]);

function isDentalCode(code) {
  return code && DENTAL_CODES.has(code.trim());
}

// ── Sample target states (active outreach markets) ───────────────────────────
const SAMPLE_STATES = new Set(['TX', 'CA', 'NY']);
const SAMPLE_LIMIT  = 100;

// ── NPPES column indices (0-based) ────────────────────────────────────────────
// Based on NPPES full replacement file layout (Jan 2026)
// Header row defines actual positions — we resolve these after reading header.
const COL = {
  NPI:            0,
  ENTITY_TYPE:    1,   // 1=individual, 2=organization
  ORG_NAME:       4,   // Provider Organization Name (Legal Business Name)
  FIRST_NAME:     6,   // Provider First Name
  LAST_NAME:      9,   // Provider Last Name (Legal Name)
  CREDENTIAL:     14,  // Provider Credential Text
  PRAC_CITY:      30,  // Provider Business Practice Location Address City Name
  PRAC_STATE:     31,  // Provider Business Practice Location Address State Name
  // Taxonomy codes: columns 47–106 (15 taxonomy code columns, 2 cols each: code + switch)
  TAXONOMY_START: 47,
  TAXONOMY_STEP:  4,   // every 4th col starting at 47: 47, 51, 55, ... (code cols)
  TAXONOMY_COUNT: 15,
};

// ── Column header → index resolver ───────────────────────────────────────────
// NPPES occasionally shifts columns. We resolve by header name on first row.
const HEADER_MAP = {
  'NPI':                                                    'NPI',
  'Entity Type Code':                                       'ENTITY_TYPE',
  'Provider Organization Name (Legal Business Name)':       'ORG_NAME',
  'Provider First Name':                                    'FIRST_NAME',
  'Provider Last Name (Legal Name)':                        'LAST_NAME',
  'Provider Credential Text':                               'CREDENTIAL',
  'Provider Business Practice Location Address City Name':  'PRAC_CITY',
  'Provider Business Practice Location Address State Name': 'PRAC_STATE',
};

// Taxonomy code columns are named "Healthcare Provider Taxonomy Code_1" through "_15"
// with "Healthcare Provider Primary Taxonomy Switch_1" interleaved between them.
// Pattern in header: Taxonomy Code_N appears at positions we detect dynamically.

let resolvedCols = { ...COL }; // populated after header parse
let taxonomyCols = [];         // array of column indices for taxonomy codes

function resolveColumns(headers) {
  // Map named columns
  headers.forEach((h, i) => {
    const clean = h.replace(/^"/, '').replace(/"$/, '').trim();
    if (HEADER_MAP[clean]) resolvedCols[HEADER_MAP[clean]] = i;
    // Detect taxonomy code columns by name pattern
    if (/^Healthcare Provider Taxonomy Code_\d+$/i.test(clean)) {
      taxonomyCols.push(i);
    }
  });

  if (!taxonomyCols.length) {
    // Fallback: use known fixed positions from NPPES spec
    for (let t = 0; t < COL.TAXONOMY_COUNT; t++) {
      taxonomyCols.push(COL.TAXONOMY_START + t * COL.TAXONOMY_STEP);
    }
    console.log('  Note: Taxonomy columns resolved via fixed offsets (header names not matched)');
  } else {
    console.log(`  Resolved ${taxonomyCols.length} taxonomy code columns from header`);
  }
}

// ── CSV line parser (handles quoted fields with commas) ───────────────────────
function parseCsvLine(line) {
  const result = [];
  let current  = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── Build display name from record fields ─────────────────────────────────────
function buildName(fields) {
  const entityType = (fields[resolvedCols.ENTITY_TYPE] || '').trim();
  if (entityType === '2') {
    return (fields[resolvedCols.ORG_NAME] || '').trim() || null;
  }
  // Individual provider
  const first  = (fields[resolvedCols.FIRST_NAME] || '').trim();
  const last   = (fields[resolvedCols.LAST_NAME]  || '').trim();
  const cred   = (fields[resolvedCols.CREDENTIAL] || '').trim();
  if (!first && !last) return null;
  return [first, last].filter(Boolean).join(' ') + (cred ? ` ${cred}` : '');
}

// ── Check if any taxonomy column is dental ────────────────────────────────────
function hasDentalTaxonomy(fields) {
  for (const idx of taxonomyCols) {
    if (isDentalCode(fields[idx])) return true;
  }
  return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('NightLeak NPI Build — NPPES Dental Extractor');
  console.log('Input:', INPUT_PATH);
  console.log('Output:', OUTPUT_PATH);
  console.log('Sample:', SAMPLE_PATH);
  if (CHANGELOG_PATH) console.log('Changelog:', CHANGELOG_PATH);
  console.log('');

  const startTime   = Date.now();
  const results     = [];
  const sampleRecs  = [];
  let   rowCount    = 0;
  let   firstRow    = true;

  const fileStream = fs.createReadStream(INPUT_PATH, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;

    const fields = parseCsvLine(line);

    if (firstRow) {
      resolveColumns(fields);
      firstRow = false;
      console.log('Header parsed. Streaming records...');
      continue;
    }

    rowCount++;
    if (rowCount % 500000 === 0) {
      process.stdout.write(`  ${(rowCount / 1e6).toFixed(1)}M rows processed, ${results.length} dentists found\r`);
    }

    if (!hasDentalTaxonomy(fields)) continue;

    const npi  = (fields[resolvedCols.NPI] || '').trim();
    const name = buildName(fields);
    if (!npi || !name) continue;

    const city  = (fields[resolvedCols.PRAC_CITY]  || '').trim();
    const state = (fields[resolvedCols.PRAC_STATE] || '').trim();

    const rec = { n: name, npi, c: city, s: state };

    // For org NPIs: include p field only if different from n (org name already in n)
    // For individual: no p field (practice name unreliable in NPPES for Entity Type 1)

    results.push(rec);

    // Sample: collect from target states
    if (sampleRecs.length < SAMPLE_LIMIT && SAMPLE_STATES.has(state)) {
      sampleRecs.push(rec);
    }
  }

  console.log('');
  console.log(`Processed ${rowCount.toLocaleString()} rows → ${results.length.toLocaleString()} dental providers found`);
  console.log(`Sample: ${sampleRecs.length} records from TX/CA/NY`);
  console.log('');

  // ── Write full output ───────────────────────────────────────────────────────
  const outputDir = path.dirname(OUTPUT_PATH);
  if (outputDir && !fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results), 'utf8');
  const outputSizeMB = (fs.statSync(OUTPUT_PATH).size / 1024 / 1024).toFixed(1);
  console.log(`Wrote ${OUTPUT_PATH} (${outputSizeMB} MB)`);

  // ── Write sample ────────────────────────────────────────────────────────────
  // If we didn't hit SAMPLE_LIMIT from target states, fill from head of results
  let finalSample = sampleRecs;
  if (finalSample.length < SAMPLE_LIMIT) {
    const seen = new Set(finalSample.map(r => r.npi));
    for (const r of results) {
      if (finalSample.length >= SAMPLE_LIMIT) break;
      if (!seen.has(r.npi)) { finalSample.push(r); seen.add(r.npi); }
    }
  }
  fs.writeFileSync(SAMPLE_PATH, JSON.stringify(finalSample), 'utf8');
  console.log(`Wrote ${SAMPLE_PATH} (${finalSample.length} records)`);

  // ── Changelog ───────────────────────────────────────────────────────────────
  if (CHANGELOG_PATH) {
    let added   = [];
    let removed = [];

    if (PREV_PATH && fs.existsSync(PREV_PATH)) {
      try {
        const prev    = JSON.parse(fs.readFileSync(PREV_PATH, 'utf8'));
        const prevSet = new Set(prev.map(r => r.npi));
        const currSet = new Set(results.map(r => r.npi));
        added   = results.filter(r => !prevSet.has(r.npi));
        removed = prev.filter(r => !currSet.has(r.npi));
      } catch (e) {
        console.warn('Could not parse previous file for changelog:', e.message);
      }
    } else {
      console.log('No previous file provided — changelog will show all records as new');
      added = results;
    }

    const changelog = {
      generated:        new Date().toISOString(),
      total:            results.length,
      added_count:      added.length,
      removed_count:    removed.length,
      added_sample:     added.slice(0, 50),
      removed_sample:   removed.slice(0, 50),
    };
    fs.writeFileSync(CHANGELOG_PATH, JSON.stringify(changelog, null, 2), 'utf8');
    console.log(`Wrote changelog: ${added.length} added, ${removed.length} removed`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
