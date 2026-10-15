#!/usr/bin/env node
/* Aggregate SEO signals from pages.json → analysis.json + stdout summary. */
const fs = require('fs');
const path = require('path');
const PROD = 'https://nukeblastsimulator.com';
const pages = JSON.parse(fs.readFileSync(path.join(__dirname, 'pages.json'), 'utf8'));

const entries = Object.entries(pages).map(([p, r]) => ({ path: p, ...r }));

function groupDup(key) {
  const m = new Map();
  for (const e of entries) {
    const v = (e[key] || '').trim();
    if (!v) continue;
    if (!m.has(v)) m.set(v, []);
    m.get(v).push(e.path);
  }
  return [...m.entries()].filter(([, paths]) => paths.length > 1).sort((a, b) => b[1].length - a[1].length);
}

const dupTitles = groupDup('title');
const dupDescs = groupDup('metaDesc');

const missingH1 = entries.filter((e) => !e.h1s || e.h1s.length === 0).map((e) => e.path);
const multiH1 = entries.filter((e) => e.h1s && e.h1s.length > 1).map((e) => `${e.path} (${e.h1s.length})`);
const missingDesc = entries.filter((e) => !e.metaDesc).map((e) => e.path);
const noindex = entries.filter((e) => /noindex/i.test(e.robotsMeta || '')).map((e) => e.path);

// canonical mismatch (normalize: strip trailing slash)
const norm = (u) => (u || '').replace(/\/$/, '');
const canonMismatch = entries.filter((e) => {
  const expect = norm(PROD + (e.path === '/' ? '' : e.path));
  return norm(e.canonical) !== expect;
}).map((e) => `${e.path} -> ${e.canonical}`);

// orphans: 0 content inlinks (home excluded)
const orphans = entries.filter((e) => e.path !== '/' && (e.inlinks || 0) === 0).map((e) => `${e.path} [${e.template}]`);

// title/desc length
const longTitles = entries.filter((e) => (e.title || '').length > 60).length;
const veryLongTitles = entries.filter((e) => (e.title || '').length > 70).length;
const longDescs = entries.filter((e) => (e.metaDesc || '').length > 160).length;
const shortDescs = entries.filter((e) => e.metaDesc && e.metaDesc.length < 70).length;

// word count distribution per template
const byTpl = {};
for (const e of entries) {
  (byTpl[e.template] = byTpl[e.template] || []).push(e.visWords || 0);
}
const wcStats = {};
for (const [t, arr] of Object.entries(byTpl)) {
  arr.sort((a, b) => a - b);
  const med = arr[Math.floor(arr.length / 2)];
  wcStats[t] = { n: arr.length, min: arr[0], median: med, max: arr[arr.length - 1],
    under300: arr.filter((x) => x < 300).length, under500: arr.filter((x) => x < 500).length };
}

// dateModified distribution
const modDates = {};
for (const e of entries) { const d = (e.dateMod || '(none)'); modDates[d] = (modDates[d] || 0) + 1; }
const pubDates = {};
for (const e of entries) { const d = (e.datePub || '(none)'); pubDates[d] = (pubDates[d] || 0) + 1; }

// jsonld coverage
const schemaByTpl = {};
for (const e of entries) {
  schemaByTpl[e.template] = schemaByTpl[e.template] || new Set();
  (e.types || []).forEach((t) => schemaByTpl[e.template].add(t));
}
const schemaOut = {};
for (const [t, s] of Object.entries(schemaByTpl)) schemaOut[t] = [...s].sort();

const out = {
  totalPages: entries.length,
  dupTitles: dupTitles.map(([t, p]) => ({ title: t, count: p.length, sample: p.slice(0, 4) })),
  dupTitleGroups: dupTitles.length,
  dupDescs: dupDescs.map(([d, p]) => ({ desc: d.slice(0, 80), count: p.length, sample: p.slice(0, 4) })),
  dupDescGroups: dupDescs.length,
  missingH1, multiH1, missingDesc, noindex, canonMismatch, orphans,
  titleLen: { over60: longTitles, over70: veryLongTitles, total: entries.length },
  descLen: { over160: longDescs, under70: shortDescs, missing: missingDesc.length },
  wcStats, modDates, pubDates, schemaByTemplate: schemaOut,
};
fs.writeFileSync(path.join(__dirname, '..', 'analysis.json'), JSON.stringify(out, null, 2));

console.log('=== SEO AGGREGATES ===');
console.log('total pages:', out.totalPages);
console.log('duplicate TITLE groups:', out.dupTitleGroups, '| duplicate DESC groups:', out.dupDescGroups);
if (dupTitles.length) console.log('  top dup title:', JSON.stringify(out.dupTitles[0]));
if (dupDescs.length) console.log('  top dup desc:', JSON.stringify(out.dupDescs[0]));
console.log('missing H1:', missingH1.length, missingH1.slice(0, 10));
console.log('multiple H1:', multiH1.length, multiH1.slice(0, 10));
console.log('missing meta desc:', missingDesc.length);
console.log('noindex pages:', noindex.length, noindex.slice(0, 10));
console.log('canonical mismatches:', canonMismatch.length, canonMismatch.slice(0, 5));
console.log('orphans (0 content inlinks):', orphans.length, orphans.slice(0, 10));
console.log('titles >60:', longTitles, '| >70:', veryLongTitles, '/', entries.length);
console.log('descs >160:', longDescs, '| <70:', shortDescs, '| missing:', missingDesc.length);
console.log('word count per template:', JSON.stringify(wcStats, null, 1));
console.log('dateModified distribution:', JSON.stringify(modDates));
console.log('datePublished distribution:', JSON.stringify(pubDates));
console.log('schema types by template:'); for (const [t,s] of Object.entries(schemaOut)) console.log('  '+t+':', s.join(', '));
