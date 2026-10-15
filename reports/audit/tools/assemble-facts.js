#!/usr/bin/env node
/* Read the workflow result file, extract factsRows, write facts.csv. */
const fs = require('fs');
const path = require('path');
const SRC = process.argv[2];
const OUT = path.resolve(__dirname, '..', 'facts.csv');
let raw = fs.readFileSync(SRC, 'utf8');
// the file may be the raw JSON result, or have surrounding text; extract the JSON object
let data;
try { data = JSON.parse(raw); } catch (e) {
  const i = raw.indexOf('{"reportDigests"');
  if (i < 0) { console.error('could not locate result JSON'); process.exit(1); }
  // find matching end by scanning braces with string awareness
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let j = i; j < raw.length; j++) {
    const c = raw[j];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = j + 1; break; } }
  }
  data = JSON.parse(raw.slice(i, end));
}
if (data.result) data = data.result; // unwrap workflow envelope
const rows = data.factsRows || [];
const esc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""').replace(/[\r\n]+/g, ' ').trim() + '"';
const cols = ['path', 'claim', 'value', 'cited_source', 'hardcoded_or_computed'];
const out = [cols.join(',')];
// stable sort by path then claim; dedupe identical rows
const seen = new Set();
rows.sort((a, b) => (a.path || '').localeCompare(b.path || '') || (a.claim || '').localeCompare(b.claim || ''));
for (const r of rows) {
  const key = [r.path, r.claim, r.value].join('|');
  if (seen.has(key)) continue; seen.add(key);
  out.push([esc(r.path), esc(r.claim), esc(r.value), esc(r.source || 'none'), esc(r.kind || '')].join(','));
}
fs.writeFileSync(OUT, out.join('\n') + '\n');
console.log('facts.csv written:', out.length - 1, 'rows (deduped from', rows.length, ')');
// breakdown
const byPath = {}; const bySrc = { none: 0, cited: 0 }; const byKind = {};
for (const r of rows) {
  const t = (r.path || '').split('/').slice(0, 2).join('/') || '/';
  byPath[t] = (byPath[t] || 0) + 1;
  if (!r.source || /^none$/i.test(r.source)) bySrc.none++; else bySrc.cited++;
  byKind[r.kind || '?'] = (byKind[r.kind || '?'] || 0) + 1;
}
console.log('by path-prefix:', JSON.stringify(byPath));
console.log('sourced vs none:', JSON.stringify(bySrc));
console.log('hardcoded vs computed:', JSON.stringify(byKind));
