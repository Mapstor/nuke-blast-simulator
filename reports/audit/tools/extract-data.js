#!/usr/bin/env node
/* Deterministically extract bombs[] and presetLocations[] array literals from
 * the TS source and emit weapons.csv + cities.csv. Read-only on source. */
const fs = require('fs');
const path = require('path');
const SRC = path.resolve(__dirname, '../../../src/lib/data');
const OUT = path.resolve(__dirname, '..');

function extractArray(file, marker) {
  const txt = fs.readFileSync(file, 'utf8');
  const i = txt.indexOf(marker);
  if (i < 0) throw new Error('marker not found: ' + marker);
  const eq = txt.indexOf('=', i);
  const start = txt.indexOf('[', eq);
  let depth = 0, inStr = null, esc = false;
  for (let j = start; j < txt.length; j++) {
    const c = txt[j];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { const lit = txt.slice(start, j + 1); return (new Function('"use strict"; return (' + lit + ')'))(); } }
  }
  throw new Error('unbalanced array');
}

const esc = (v) => { const s = (v === undefined || v === null) ? '' : String(v); return '"' + s.replace(/"/g, '""').replace(/[\r\n]+/g, ' ') + '"'; };

// ---- weapons.csv ----
const bombs = extractArray(path.join(SRC, 'bombs.ts'), 'export const bombs');
{
  const cols = ['slug', 'name', 'yield_kt', 'yield_raw', 'type', 'country', 'year', 'description', 'source_field'];
  const rows = [cols.join(',')];
  for (const b of bombs) {
    rows.push([
      esc(b.id), esc(b.name), esc(b.yield), esc(b.yield + ' kt'),
      esc(b.type), esc(b.country), esc(b.year), esc(b.description),
      esc('none (no source field in bombs.ts)'),
    ].join(','));
  }
  fs.writeFileSync(path.join(OUT, 'weapons.csv'), rows.join('\n') + '\n');
  console.log('weapons.csv:', bombs.length, 'rows (incl. any "custom")');
  console.log('  types:', JSON.stringify(bombs.reduce((a, b) => (a[b.type] = (a[b.type] || 0) + 1, a), {})));
  console.log('  yield range kt:', Math.min(...bombs.map(b=>b.yield)), '-', Math.max(...bombs.map(b=>b.yield)));
}

// ---- cities.csv ----
const cities = extractArray(path.join(SRC, 'cities.ts'), 'export const presetLocations');
{
  const cols = ['slug', 'name', 'country', 'region', 'population', 'density_per_km2', 'lat', 'lng', 'description', 'data_source'];
  const SRC_NOTE = 'cities.ts header: city statistical bureaus, Demographia World Urban Areas, UN WUP, encyclopedic refs (no per-row citation)';
  const rows = [cols.join(',')];
  for (const c of cities) {
    rows.push([
      esc(c.slug), esc(c.name), esc(c.country), esc(c.region),
      esc(c.population), esc(c.density), esc(c.lat), esc(c.lng),
      esc(c.description), esc(SRC_NOTE),
    ].join(','));
  }
  fs.writeFileSync(path.join(OUT, 'cities.csv'), rows.join('\n') + '\n');
  console.log('cities.csv:', cities.length, 'rows');
  console.log('  density range:', Math.min(...cities.map(c=>c.density)), '-', Math.max(...cities.map(c=>c.density)));
  console.log('  highest densities:', cities.slice().sort((a,b)=>b.density-a.density).slice(0,5).map(c=>`${c.name} ${c.density}`).join(', '));
  console.log('  regions:', JSON.stringify(cities.reduce((a,c)=>(a[c.region]=(a[c.region]||0)+1,a),{})));
}
