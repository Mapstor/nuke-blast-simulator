// NBS-008: generate src/lib/seo/pageSeo.ts — the title, meta description and H1
// for every live page, built around each page's PRIMARY keyword from
// research/keyword-ledger.csv (the kw-research attack plan). Slugs never change.
//
// Rules enforced here (the script throws if any fail, so the output is always
// valid): title <= 60 chars and unique; description <= 155 chars and unique;
// every non-structural page's title contains all non-stopword tokens of its
// primary keyword. Numbers in descriptions come from the verified data files
// (bombs/cities yields and populations), never typed by hand.
//
// Head/awkward pages are hand-tuned in OVERRIDES; the rest use archetype
// builders. Regenerate: node scripts/build-page-seo.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { readCsvObjects } from './lib/csv.mjs'

// ── inputs ────────────────────────────────────────────────────────────────
const pages = readCsvObjects('research/page-map.csv').filter((r) => r.status === 'live')
const ledger = readCsvObjects('research/keyword-ledger.csv')

const primary = {}
const secondaries = {}
for (const r of ledger) {
  if (r.role === 'primary') primary[r.page_slug] = r.keyword
  else if (r.role === 'secondary') (secondaries[r.page_slug] ??= []).push([r.keyword, Number(r.volume || 0)])
}
for (const k of Object.keys(secondaries)) secondaries[k].sort((a, b) => b[1] - a[1])

// ── data facts ────────────────────────────────────────────────────────────
function field(obj, key, numeric = false) {
  const re = numeric ? new RegExp(`${key}:\\s*([0-9.]+)`) : new RegExp(`${key}:\\s*"([^"]*)"`)
  const m = obj.match(re)
  return m ? m[1] : null
}
const bombsSrc = readFileSync('src/lib/data/bombs.ts', 'utf8')
const bombs = {}
for (const m of bombsSrc.matchAll(/\{\s*id:\s*"([^"]+)"[^}]*\}/g)) {
  const o = m[0]
  bombs[field(o, 'id')] = {
    name: field(o, 'name'), yield: field(o, 'yield', true), type: field(o, 'type'),
    country: field(o, 'country'), year: field(o, 'year', true), desc: field(o, 'description'),
  }
}
const citiesSrc = readFileSync('src/lib/data/cities.ts', 'utf8')
const cities = {}
for (const m of citiesSrc.matchAll(/\{[^{}]*slug:\s*"([^"]+)"[^{}]*\}/g)) {
  const o = m[0]
  cities[field(o, 'slug')] = {
    name: field(o, 'name'), country: field(o, 'country'),
    population: field(o, 'population', true), popYear: field(o, 'populationYear', true),
  }
}
const glossSrc = readFileSync('src/lib/data/glossary.ts', 'utf8')
const gloss = {}
for (const m of glossSrc.matchAll(/slug:\s*['"]([^'"]+)['"][\s\S]*?term:\s*['"]([^'"]+)['"][\s\S]*?short:\s*['"]([^'"]+)['"]/g)) {
  gloss[m[1]] = { term: m[2], short: m[3] }
}

// ── helpers ──────────────────────────────────────────────────────────────
const ACRONYMS = new Set(['us', 'uk', 'usa', 'ussr', 'npt', 'ctbt', 'tpnw', 'icbm', 'slbm', 'mirv',
  'emp', 'moab', 'foab', 'gbu', 'jdam', 'blu', 'fab', 'tnt', 'psi', 'mad', 'dc', 'nyc', 'un',
  'iaea', 'fas', 'sipri', 'nato', 'sf'])
const SMALL = new Set(['of', 'the', 'a', 'an', 'to', 'in', 'on', 'at', 'by', 'for', 'and', 'or', 'vs', 'with', 'from'])
// Stopwords excluded from the title-token coverage check. Mirror this exactly in
// tests/titles-meta.test.ts.
const STOP = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'and', 'or', 'vs',
  'with', 'is', 'are', 'was', 'how', 'do', 'does', 'did', 'what', 'from', 'it', 'its', 'i', 'if', 'would'])

function tc(str) {
  return str.split(/\s+/).map((w, i) => {
    const lw = w.toLowerCase()
    if (ACRONYMS.has(lw)) return w.toUpperCase()
    if (/^[wb]\d+[a-z]?$/i.test(w)) return w.toUpperCase()
    if (i > 0 && SMALL.has(lw)) return lw
    return w.charAt(0).toUpperCase() + w.slice(1)
  }).join(' ')
}
function tokens(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean)
}
function nonStop(s) { return tokens(s).filter((t) => !STOP.has(t)) }
function redundant(base, q) {
  const words = new Set(tokens(base))
  return nonStop(q).some((w) => w.length > 3 && words.has(w))
}
function withQualifier(base, quals) {
  for (const q of quals) {
    const t = `${base} — ${q}`
    if (t.length <= 60 && !redundant(base, q)) return t
  }
  return base
}
function yt(kt) {
  kt = Number(kt)
  if (kt >= 1000) { const m = kt / 1000; return `${Number.isInteger(m) ? m : m.toFixed(1)} Mt` }
  if (kt >= 1) return `${kt.toLocaleString('en-US')} kt`
  const tons = kt * 1000
  if (tons >= 1) return `${Math.round(tons).toLocaleString('en-US')} t TNT`
  return `${Math.round(kt * 1e6).toLocaleString('en-US')} kg TNT`
}
function popShort(p) {
  p = Number(p)
  return p >= 1e6 ? `${(p / 1e6).toFixed(1)}M` : p >= 1e3 ? `${Math.round(p / 1e3)}K` : `${p}`
}
function clampDesc(s) {
  if (s.length <= 155) return s
  let cut = s.slice(0, 152)
  const sp = cut.lastIndexOf(' ')
  if (sp > 110) cut = cut.slice(0, sp) // break on a word boundary, never mid-word
  return cut.replace(/[\s,.;:—-]+$/, '') + '…'
}
// Meta descriptions must carry no em dashes (anti-slop rule for this field).
function noEmDash(s) { return s.replace(/\s*—\s*/g, ', ').replace(/,\s*,/g, ',') }

// ── hand-tuned head pages (title/h1/description; any field may be omitted) ──
const OVERRIDES = {
  '/': { title: 'Nuke Map: Nuclear Bomb Simulator for Any City', h1: 'Nuke Map — Nuclear Bomb Simulator', description: 'Free nuke map. Click any city to see the fireball, blast and thermal-burn radii for 29 nuclear weapons, from Little Boy to Tsar Bomba, on an air burst.' },
  '/weapons': { title: 'Nuclear Bombs: Every Weapon by Yield and Country', h1: 'Nuclear Bombs Database', description: 'Browse 29 nuclear weapons and tests plus 14 conventional bombs, each with a cited yield, history and blast-radius profile, sortable by yield and country.' },
  '/examples': { title: 'What If a Nuke Hit Your City? 100 Blast Radius Maps', h1: 'What If a Nuke Hit Your City?', description: 'Pick any of 100 world cities and see its nuclear blast radius: population, fireball, blast and thermal rings on an interactive map.' },
  '/compare': { title: 'Nuclear Bomb Size Comparison: Any Two Weapons', h1: 'Nuclear Bomb Size Comparison', description: 'Compare any two nuclear bombs side by side: yields, fireball, blast and thermal-burn radii for an air burst, with every figure cited.' },
  '/nuclear-weapons-by-country': { title: 'Nuclear Weapons by Country: 2026 Arsenals', h1: 'Nuclear Weapons by Country', description: 'How many nuclear weapons each country has as of early 2026: warheads, delivery systems and trends for all nine nuclear powers, every figure cited.' },
  '/glossary': { title: 'Nuclear Weapons Glossary: Terms Defined', h1: 'Nuclear Weapons Glossary', description: 'Plain, cited definitions of nuclear weapon terms: fireball, overpressure, fallout, yield, ICBM, MIRV, fission, fusion and more.' },
  '/blog': { title: 'Nuclear Weapons Blog: Physics, History and Effects', h1: 'Nuclear Weapons Blog', description: 'Long-form, cited articles on nuclear weapon physics, history, doctrine and effects: Tsar Bomba, Hiroshima, nuclear winter, EMP and more.' },
  '/about': { title: 'About the Nuke Blast Simulator', h1: 'About This Project', description: 'The educational mission, scientific method and named author behind the Nuke Blast Simulator, built on published Glasstone & Dolan scaling laws.' },
  '/methodology': { title: 'Methodology: How the Blast Radii Are Computed', h1: 'Methodology', description: 'The scaling-law formulas behind the simulator: how the fireball, 20/5/1 psi blast and thermal-burn radii are computed for an air burst at optimum height.' },
  '/how-it-works': { title: 'How to Use the Nuclear Blast Simulator', h1: 'How It Works', description: 'A step-by-step guide to the nuclear blast simulator: pick a weapon, click a location and read the fireball, blast and thermal-burn radii.' },
  '/faq': { title: 'Nuclear Blast Simulator FAQ', h1: 'Frequently Asked Questions', description: 'Answers to common questions about nuclear weapon effects, blast radii, air versus surface bursts and how the simulator computes its numbers.' },
  '/sources': { title: 'Data Sources and Scientific References', h1: 'Data Sources', description: 'Every number on the site traces to a verified primary source. Browse the full reference list behind the weapons, cities and effect calculations.' },
  '/resources': { title: 'Nuclear Treaties and Official Data Sources', h1: 'Treaties and Data Sources', description: 'The main nuclear arms-control treaties (NPT, CTBT, TPNW) and the official bodies that publish nuclear-forces data: FAS, SIPRI, CTBTO and UN ODA.' },
  '/contact': { title: 'Contact the Nuke Blast Simulator', h1: 'Contact', description: 'How to reach the Nuke Blast Simulator for feedback, corrections and educational inquiries.' },
  '/privacy': { title: 'Privacy Policy', h1: 'Privacy Policy', description: 'How the Nuke Blast Simulator handles analytics, cookies and your data. No simulations or locations are ever stored or transmitted.' },
  '/terms': { title: 'Terms of Service', h1: 'Terms of Service', description: 'The terms governing use of the Nuke Blast Simulator, a free educational tool for understanding the physical scale of nuclear weapon effects.' },
  // blog articles (7)
  '/blog/tsar-bomba-largest-test-ever': { title: 'Tsar Bomba: The Largest Nuclear Test Ever', h1: 'Tsar Bomba: The Largest Nuclear Test Ever', description: "Tsar Bomba, the 50-megaton Soviet test of 1961 and the largest nuclear explosion ever. Its fireball, blast and thermal effects, every figure cited." },
  '/blog/hiroshima-nagasaki-80-years-of-data': { title: 'Hiroshima Death Toll: 80 Years of Data', h1: 'Hiroshima and Nagasaki: 80 Years of Data', description: 'The Hiroshima death toll and Nagasaki casualties, 80 years on: RERF dose and mortality data for both cities, with the radiation question answered.' },
  '/blog/four-kill-mechanisms': { title: 'What Happens in a Nuclear Explosion', h1: 'The Four Kill Mechanisms of a Nuclear Explosion', description: 'A nuclear explosion kills four ways: fireball, blast wave, thermal radiation and ionizing radiation. How hot it gets and how far each reaches, cited.' },
  '/blog/how-nuclear-weapons-work': { title: 'How Do Nuclear Bombs Work? Fission and Fusion', h1: 'How Nuclear Weapons Work', description: 'How nuclear bombs work, from fission chain reactions to the fusion stage of a hydrogen bomb, explained with the real weapons behind each design.' },
  '/blog/physics-of-nuclear-blast': { title: 'What Is a Megaton? Nuclear Yield Explained', h1: 'The Physics of Nuclear Yield', description: 'What a megaton and a kiloton mean in TNT equivalent, and why doubling a bomb\'s yield does not double its blast radius. Cube-root scaling explained.' },
  '/blog/nuclear-winter-regional-war-cooling': { title: 'Nuclear Winter: Could a War Cool the Planet?', h1: 'Nuclear Winter', description: 'Nuclear winter: how soot from burning cities could cool the planet for years. What the TTAPS and modern climate models actually project, cited.' },
  '/blog/emp-high-altitude-nuclear-burst': { title: 'What Is an EMP? High-Altitude Nuclear Burst', h1: 'EMP: How a High-Altitude Nuclear Burst Works', description: 'What an EMP is and how a single high-altitude nuclear burst, like Starfish Prime, could disable electronics across much of a continent.' },
  // Long-tail primaries that title-case into awkward strings: hand-tuned.
  '/weapons/joe-1': { title: 'Joe-1 (RDS-1) — Blast Radius & Effects', h1: 'Joe-1 (RDS-1)' },
  // NBS-009: the two most-searched weapons get name + place titles.
  '/weapons/little-boy': { title: 'Little Boy: Hiroshima Bomb Blast Radius & Effects', h1: 'Little Boy (Hiroshima Bomb) Blast Radius' },
  '/weapons/fat-man': { title: 'Fat Man Bomb: Nagasaki Blast Radius & Effects', h1: 'Fat Man (Nagasaki Bomb) Blast Radius' },
  // MOAB's full name makes the generic compare description overflow 155 and clamp.
  '/compare/little-boy-vs-moab': { description: 'Little Boy (15 kt) vs MOAB (11 t TNT): the smallest WWII nuclear bomb against the largest conventional bomb, blast and thermal radii side by side.' },
}

// ── archetype builders ─────────────────────────────────────────────────────
function buildWeapon(slug, p) {
  const f = bombs[slug.split('/')[1]] || {}
  const base = tc(p)
  const title = withQualifier(base, ['Blast Radius & Effects', 'Blast Radius Map', 'Map & Effects', 'Yield & Blast Map', 'Nuclear Weapon'])
  const kind = f.type === 'conventional' ? 'conventional bomb' : 'nuclear weapon'
  // Avoid a duplicate year when the name already carries one, e.g. "Halifax Explosion (1917)".
  const loc = f.year && !f.name.includes(`(${f.year})`) ? `${f.country}, ${f.year}` : f.country
  const desc = clampDesc(`${f.name}: ${yt(f.yield)} ${kind} (${loc}). Fireball, blast and thermal-burn radii for an air burst, mapped on any city.`)
  return { title, h1: base, description: desc }
}
function buildCity(slug, p) {
  const f = cities[slug.split('/')[1]] || {}
  // NBS-009: one neutral, brand-safe pattern — no "Nuke {City}" imperative and
  // no "attack"/"strike" anywhere. The "nuclear bomb" lead is used only when the
  // page's primary keyword says "nuclear bomb"; otherwise "nuke". Both variants
  // contain the primary's tokens because every city primary is a "nuke {city}"
  // or "nuclear bomb {city}" form.
  const lead = /\bnuclear bomb\b/.test(p || '') ? 'What If a Nuclear Bomb Hit' : 'What If a Nuke Hit'
  const title = `${lead} ${f.name}? Blast Radius Map`
  const desc = clampDesc(`What a nuclear bomb would do to ${f.name}, ${f.country} (population ${popShort(f.population)}): fireball, blast and thermal-burn radii from Little Boy to Tsar Bomba, mapped.`)
  return { title, h1: `${lead} ${f.name}?`, description: desc }
}
function buildCompare(slug, p) {
  const pair = slug.split('/')[1]
  const [aId, bId] = pair.split('-vs-')
  const a = bombs[aId] || {}, b = bombs[bId] || {}
  const base = tc(p)
  const title = withQualifier(base, ['Blast Radius Compared', 'Yield & Blast Comparison', 'Nuclear Comparison'])
  const desc = clampDesc(`${a.name} (${yt(a.yield)}) vs ${b.name} (${yt(b.yield)}): yields, fireball, blast and thermal-burn radii side by side for an air burst at optimum height.`)
  return { title, h1: `${a.name} vs ${b.name}`, description: desc }
}
function buildGlossary(slug, p) {
  const f = gloss[slug.split('/')[1]] || {}
  const base = tc(p)
  const title = withQualifier(base, ['Definition & Meaning', 'Explained', 'Facts & Figures'])
  const desc = clampDesc(f.short ? `${f.short}` : `${base}: a cited definition from the nuclear weapons glossary.`)
  return { title, h1: f.term || base, description: desc }
}
function buildArticle(slug, p) {
  const base = tc(p)
  const title = withQualifier(base, ['Explained', 'Facts & Figures'])
  return { title, h1: base, description: clampDesc(`${base}: a cited, long-form explainer on nuclear weapon effects, physics and history.`) }
}

// ── assemble ──────────────────────────────────────────────────────────────
const STRUCTURAL = new Set(['about', 'methodology', 'sources', 'blog', 'contact', 'faq', 'glossary',
  'how-it-works', 'privacy', 'resources', 'terms'])

const result = {}
const problems = []
for (const row of pages) {
  const slug = row.slug
  const path = slug === 'home' ? '/' : `/${slug}`
  const p = primary[slug]
  let seo
  if (slug.startsWith('weapons/')) seo = buildWeapon(slug, p)
  else if (slug.startsWith('examples/')) seo = buildCity(slug, p)
  else if (slug.startsWith('compare/')) seo = buildCompare(slug, p)
  else if (slug.startsWith('glossary/')) seo = buildGlossary(slug, p)
  else if (slug.startsWith('blog/') || row.archetype === 'article') seo = buildArticle(slug, p)
  else seo = { title: tc(p || slug), h1: tc(p || slug), description: `${tc(p || slug)}.` }
  // overrides win field-by-field
  seo = { ...seo, ...(OVERRIDES[path] || {}) }
  seo.description = noEmDash(seo.description)
  result[path] = seo

  // validation
  if (seo.title.length > 60) problems.push(`${path}: title ${seo.title.length}>60 "${seo.title}"`)
  if (seo.description.length > 155) problems.push(`${path}: desc ${seo.description.length}>155`)
  if (!seo.h1) problems.push(`${path}: empty h1`)
  const isStructural = STRUCTURAL.has(slug)
  if (!isStructural && p) {
    const tset = new Set(tokens(seo.title))
    const missing = nonStop(p).filter((t) => !tset.has(t))
    if (missing.length) problems.push(`${path}: title missing primary tokens [${missing}] ("${p}" -> "${seo.title}")`)
  }
}
// uniqueness
const seenT = {}, seenD = {}
for (const [path, s] of Object.entries(result)) {
  if (seenT[s.title]) problems.push(`dup title "${s.title}" (${seenT[s.title]} & ${path})`); else seenT[s.title] = path
  if (seenD[s.description]) problems.push(`dup desc (${seenD[s.description]} & ${path})`); else seenD[s.description] = path
}

if (problems.length) {
  console.error(`FAIL: ${problems.length} problems:\n` + problems.join('\n'))
  process.exit(1)
}

const body = Object.keys(result).sort().map((path) => {
  const s = result[path]
  const esc = (x) => x.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `  '${esc(path)}': { title: '${esc(s.title)}', h1: '${esc(s.h1)}', description: '${esc(s.description)}' },`
}).join('\n')

const out = `// GENERATED by scripts/build-page-seo.mjs — do not edit.
// Title, meta description and H1 for every live page, built around the page's
// primary keyword in research/keyword-ledger.csv. Titles <=60, descriptions
// <=155, both unique; numbers come from the verified data files.
// Regenerate: node scripts/build-page-seo.mjs

export type PageSeo = { title: string; h1: string; description: string }

export const PAGE_SEO: Record<string, PageSeo> = {
${body}
}
`
writeFileSync('src/lib/seo/pageSeo.ts', out)
console.log(`wrote PAGE_SEO for ${Object.keys(result).length} pages (0 problems)`)
