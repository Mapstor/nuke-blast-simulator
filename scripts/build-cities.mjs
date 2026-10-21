// NBS-005: rebuild src/lib/data/cities.ts by merging research/cities-verified.csv
// (verified population/area/density/coordinates + source_ids) into the existing
// records (which hold region + description). Verified numeric values are copied
// exactly — never recomputed. Description fixes flagged in the notes column are
// applied from DESC_OVERRIDES below.
import { readFileSync, writeFileSync } from 'node:fs'
import { readCsvObjects } from './lib/csv.mjs'

// --- extract existing presetLocations array literal and eval it ---
const srcTs = readFileSync('src/lib/data/cities.ts', 'utf8')
function extractArray(txt, marker) {
  const i = txt.indexOf(marker)
  const eq = txt.indexOf('=', i)
  const start = txt.indexOf('[', eq)
  let depth = 0, inStr = null, esc = false
  for (let j = start; j < txt.length; j++) {
    const c = txt[j]
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === inStr) inStr = null; continue }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue }
    if (c === '[') depth++
    else if (c === ']') { depth--; if (depth === 0) return new Function('"use strict";return (' + txt.slice(start, j + 1) + ')')() }
  }
  throw new Error('array not found')
}
const existing = extractArray(srcTs, 'export const presetLocations')
const existingBySlug = Object.fromEntries(existing.map((c) => [c.slug, c]))

// Corrected descriptions (from cities-verified.csv notes flagged WRONG/imprecise).
const DESC_OVERRIDES = {
  'new-york': "The most populous city in the United States and a global financial capital, with a metropolitan area of about 20 million people.",
  'san-francisco': "The financial and technology capital of the western United States, on a dense 121 km² footprint at the tip of the San Francisco Peninsula.",
  'washington-dc': "The capital of the United States, home to the federal government and most major U.S. agencies.",
  'toronto': "The largest city in Canada and a major financial center, with a metro area of about 7 million.",
  'vancouver': "The largest metropolitan area in western Canada and a major Pacific port.",
  'atlanta': "The capital of Georgia and the economic center of the southeastern United States, whose metro area of about 6.4 million anchors the region.",
  'denver': "The capital of Colorado, on the western edge of the High Plains just east of the Rocky Mountain Front Range.",
  'sao-paulo': "The largest city in the southern hemisphere and Brazil's economic capital, with more than 20 million people in its metro area.",
  'bogota': "The capital and largest city of Colombia.",
  'quito': "The capital of Ecuador and one of the highest-altitude capital cities in the world.",
  'salvador': "The capital of Bahia and Brazil's fifth-largest city.",
  'vienna': "The capital of Austria and host to many major international organizations.",
  'stockholm': "The capital of Sweden, spanning 14 islands where Lake Mälaren meets the Baltic Sea.",
  'moscow': "The capital of Russia and the most populous city entirely in Europe.",
  'lisbon': "The capital of Portugal, on the Tagus estuary near the Atlantic.",
  'tokyo': "The capital of Japan; Greater Tokyo is the world's third-most-populous metropolitan area, with about 33 million residents.",
  'mumbai': "The financial capital of India and one of its most densely populated cities.",
  'delhi': "The capital territory of India; its urban area is the world's second-largest after Tokyo.",
  'bangkok': "The capital of Thailand; more than 17 million people live in the Bangkok Metropolitan Region.",
  'jakarta': "The capital of Indonesia and its largest city (the capital is being relocated to Nusantara).",
  'singapore': "A city-state off the southern tip of the Malay Peninsula.",
  'busan': "South Korea's second-largest city and its busiest port, on the Korea Strait.",
  'nairobi': "The capital and largest city of Kenya and a major hub in East Africa.",
  'perth': "The capital of Western Australia and one of the most isolated major cities in the world.",
}

const verified = readCsvObjects('research/cities-verified.csv')
const n = (v) => (v === '' || v == null ? undefined : Number(v))

const merged = []
const missing = []
for (const v of verified) {
  const ex = existingBySlug[v.slug]
  if (!ex) { missing.push(v.slug); continue }
  const area = n(v.area_km2)
  merged.push({
    slug: v.slug,
    name: ex.name,
    country: ex.country,
    region: ex.region,
    lat: n(v.lat),
    lng: n(v.lng),
    population: n(v.population),
    populationYear: n(v.population_year),
    populationDefinition: v.population_definition,
    areaKm2: area,
    density: n(v.density_per_km2),
    sourceIds: (v.source_ids || '').split(';').map((s) => s.trim()).filter(Boolean),
    description: DESC_OVERRIDES[v.slug] ?? ex.description,
  })
}
if (missing.length) { console.error('MISSING existing city for verified slug(s):', missing); process.exit(1) }

const esc = (s) => JSON.stringify(s)
const lines = merged.map((c) => {
  const area = c.areaKm2 === undefined ? '' : `area_km2: ${c.areaKm2}, `
  // Density is shown only where area is known (NBS-005).
  const dens = c.density === undefined || c.areaKm2 === undefined ? '' : `density: ${c.density}, `
  return `  { slug: ${esc(c.slug)}, name: ${esc(c.name)}, country: ${esc(c.country)}, region: ${esc(c.region)}, lat: ${c.lat}, lng: ${c.lng}, population: ${c.population}, populationYear: ${c.populationYear}, populationDefinition: ${esc(c.populationDefinition)}, ${area}${dens}sourceIds: ${JSON.stringify(c.sourceIds)}, description: ${esc(c.description)} },`
}).join('\n')

const out = `// lib/data/cities.ts — preset locations for the example city pages and the
// on-map quick-jump. Population/area/density/coordinates are chat-verified
// (NBS-005) from research/cities-verified.csv; regenerate with
// scripts/build-cities.mjs. Every figure shows its unit + year and cites its
// source_ids. Never edit a verified value by hand.

export const DEFAULT_URBAN_DENSITY = 3_500 // per km² — global average urban density, tool fallback

export type PresetLocation = {
  slug: string
  name: string
  country: string
  region: 'North America' | 'South America' | 'Europe' | 'Asia' | 'Middle East' | 'Africa' | 'Oceania'
  lat: number
  lng: number
  population: number
  populationYear: number
  populationDefinition: string
  area_km2?: number
  density?: number // per km² — only when area_km2 is known
  sourceIds: string[]
  description: string
}

export const presetLocations: PresetLocation[] = [
${lines}
]
`
writeFileSync('src/lib/data/cities.ts', out)
console.log(`cities.ts: ${merged.length} cities | descriptions overridden: ${Object.keys(DESC_OVERRIDES).length} | without area: ${merged.filter((c) => c.areaKm2 === undefined).map((c) => c.slug).join(',')}`)
