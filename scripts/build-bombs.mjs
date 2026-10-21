// NBS-005: apply chat-verified weapon corrections (facts-verified.csv rows
// 380–424) to src/lib/data/bombs.ts. Field overrides below are hand-checked
// against each row's verified_value (never auto-parsed). Adds sources[] (ids
// from the rows) to every weapon. Removes OFAB-5000 (no source confirms it).
import { readFileSync, writeFileSync } from 'node:fs'
import { readCsvObjects } from './lib/csv.mjs'

// --- extract existing bombs array ---
const srcTs = readFileSync('src/lib/data/bombs.ts', 'utf8')
function extractArray(txt, marker) {
  const i = txt.indexOf(marker); const eq = txt.indexOf('=', i); const start = txt.indexOf('[', eq)
  let depth = 0, inStr = null, esc = false
  for (let j = start; j < txt.length; j++) {
    const c = txt[j]
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === inStr) inStr = null; continue }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue }
    if (c === '[') depth++
    else if (c === ']') { depth--; if (depth === 0) return new Function('"use strict";return (' + txt.slice(start, j + 1) + ')')() }
  }
  throw new Error('bombs array not found')
}
const bombs = extractArray(srcTs, 'export const bombs')

// --- source_ids per weapon id (from facts rows 380–424) ---
const facts = readCsvObjects('research/facts-verified.csv')
const srcById = {}
for (const f of facts) {
  if (+f.row_id < 380 || +f.row_id > 424) continue
  const m = f.claim.match(/id:\s*'([a-z0-9-]+)'/)
  if (m) srcById[m[1]] = (f.source_ids || '').split(';').map((s) => s.trim()).filter(Boolean)
}

// --- hand-checked field overrides (verdict wrong/outdated/correct-minor) ---
// yield in kilotons (t → kt: divide by 1000).
const OV = {
  b61: { description: 'Variable-yield bomb with strategic and tactical versions' },
  b83: { description: 'Most powerful US weapon still in the stockpile (retirement pending)' },
  blockbuster: { yield: 0.0014, country: 'UK', year: 1941, description: "British 'cookie' blast bomb (about 1.4 t explosive fill)" },
  'blu-82': { yield: 0.0057, description: 'Vietnam-era 15,000 lb slurry-explosive blast bomb (about 5.7 t fill)' },
  'castle-yankee': { description: 'Second-largest US nuclear test' },
  'chagai-i': { description: 'First Pakistani nuclear test; claimed up to 40 kt (seismic estimates about 9 kt)' },
  'davy-crockett': { description: 'One of the smallest US nuclear weapons' },
  'fab-500': { year: 1954, description: 'Standard 500 kg high-explosive bomb (about 200 kg fill)' },
  'fab-5000': { yield: 0.0032, country: 'USSR', year: 1943, description: 'Largest Soviet bomb of World War II (about 3.2 t fill)' },
  foab: { description: 'Russia calls it the most powerful non-nuclear bomb (claimed ~44 t, unverified; thermobaric)' },
  'gbu-28': { description: 'Deep-penetrating bunker buster (about 0.3 t explosive fill)' },
  'gbu-57': { yield: 0.0024, year: 2007, description: 'Massive Ordnance Penetrator bunker buster (about 2.4 t fill; in service 2011)' },
  'grand-slam': { yield: 0.0066, year: 1945, description: 'Largest conventional bomb used in World War II (about 6.6 t TNT equivalent)' },
  'halifax-explosion': { yield: 2.9, country: 'Canada', year: 1917, description: 'Largest man-made explosion before nuclear weapons (Halifax, Nova Scotia)' },
  'hwasong-14': { name: 'North Korea 2017 Test', description: 'Device North Korea said was an H-bomb for an ICBM (~250 kt, NORSAR; thermonuclear claimed, unconfirmed)' },
  jdam: { yield: 0.00043, year: 1997, description: 'GPS-guided 2,000 lb bomb (about 0.43 t explosive fill)' },
  'mark-84': { yield: 0.00043, year: undefined, description: 'Standard 2,000 lb general-purpose bomb (in service since the 1950s; about 0.43 t fill)' },
  'mk-82': { yield: 0.00009, year: undefined, description: 'Standard 500 lb general-purpose bomb (in service since the 1950s; about 0.09 t fill)' },
  'orange-herald': { type: 'fission', year: 1957, description: 'Largest single-stage device ever tested (largest UK test: Grapple Y, about 3 Mt, 1958)' },
  'soviet-test-219': { description: 'Second-largest Soviet nuclear test' },
  tallboy: { description: 'Deep-penetration earthquake bomb (about 2.4 t Torpex fill)' },
  w54: { year: 1964, description: 'Special Atomic Demolition Munition (variable yield up to 1 kt)' },
  w76: { yield: 90, description: 'Common SLBM warhead (current W76-1 ~90 kt; W76-2 ~8 kt)' },
  w80: { yield: 150, year: 1981, description: 'Cruise missile warhead' },
  w88: { yield: 455, description: 'Modern SLBM warhead' },
}

const out = []
const removed = []
for (const b of bombs) {
  if (b.id === 'ofab-5000') { removed.push(b.id); continue }
  const ov = OV[b.id] || {}
  const merged = { ...b, ...ov }
  if ('year' in ov && ov.year === undefined) delete merged.year
  const sources = srcById[b.id] || []
  out.push({ ...merged, sources })
}

const esc = (s) => JSON.stringify(s)
const fieldLines = (b) => {
  const parts = [`id: ${esc(b.id)}`, `name: ${esc(b.name)}`, `yield: ${b.yield}`, `type: ${esc(b.type)}`, `country: ${esc(b.country)}`]
  if (b.year !== undefined) parts.push(`year: ${b.year}`)
  parts.push(`description: ${esc(b.description)}`)
  parts.push(`sources: ${JSON.stringify(b.sources)}`)
  return parts.join(', ')
}
const body = out.map((b) => `  { ${fieldLines(b)} },`).join('\n')

const file = `// lib/data/bombs.ts — weapons and tests. Every field is chat-verified
// (NBS-005) against research/facts-verified.csv rows 380–424; each entry cites
// its source ids. Regenerate with scripts/build-bombs.mjs. OFAB-5000 was
// removed (no source). Never edit a verified value by hand.
import { Bomb } from '@/lib/types'

export const bombs: Bomb[] = [
${body}
]
`
writeFileSync('src/lib/data/bombs.ts', file)
const nuclear = out.filter((b) => b.id !== 'custom' && b.type !== 'conventional').length
const conv = out.filter((b) => b.type === 'conventional').length
console.log(`bombs.ts: ${out.length} entries (removed: ${removed.join(',') || 'none'}) | nuclear(+tests) ${nuclear}, conventional ${conv}`)
console.log(`check: w88=${out.find((b) => b.id === 'w88').yield} halifax=${out.find((b) => b.id === 'halifax-explosion').yield}/${out.find((b) => b.id === 'halifax-explosion').country} orange-herald.type=${out.find((b) => b.id === 'orange-herald').type} w76=${out.find((b) => b.id === 'w76').yield}`)
