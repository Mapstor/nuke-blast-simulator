import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { effectRadiiKm, formatRadiusDual, formatRadiusMi, KM_TO_MI } from '../src/lib/calculations/effects'
import { radiusKm } from '../src/lib/calculations/radius'
import foldRedirects from '../data/fold-redirects.json'

// NBS-011: the /nuclear-blast-radius tool page. Run `npm run build` first — the
// HTML checks read the prerendered page and sitemap.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const PAGE = join(APP, 'nuclear-blast-radius.html')
const SITEMAP = join(APP, 'sitemap.xml.body')
const BASE = 'https://nukeblastsimulator.com'

// The wedge-table rows and ring columns, mirrored from the page. The page
// renders every cell as formatRadiusDual(effectRadiiKm(kt)[key]); this test
// recomputes each value from the engine and asserts it is in the built HTML, so
// no cell can be a typed literal that drifts from radiusKm().
const ROWS = [1, 10, 15, 21, 100, 300, 455, 1000, 1200, 10000, 15000, 50000]
const RING_KEYS: Array<keyof ReturnType<typeof effectRadiiKm>> = [
  'fireball',
  'overpressure20psi',
  'overpressure5psi',
  'overpressure1psi',
  'thermal3rdDegree',
  'thermal2ndDegree',
  'thermal1stDegree',
]

// The seven glossary terms whose /glossary/<term> URL folds onto this page.
const FOLDED_TERMS = [
  'air-burst', 'fireball', 'overpressure', 'psi',
  'second-degree-burns', 'surface-burst', 'thermal-radiation',
]

describe('miles helpers derive from the engine (never typed)', () => {
  it('KM_TO_MI is the standard conversion', () => {
    expect(KM_TO_MI).toBeCloseTo(0.621371, 6)
  })
  it('formatRadiusMi converts km to miles with matching precision', () => {
    expect(formatRadiusMi(6.2)).toBe((6.2 * KM_TO_MI).toFixed(2)) // under 10 → 2 dp
    expect(formatRadiusMi(64.1)).toBe((64.1 * KM_TO_MI).toFixed(1)) // >= 10 → 1 dp
  })
})

describe('widest-ring crossover (chart scaling must not assume 1st-degree burns)', () => {
  // Below ~140 kt the 1 psi blast ring is WIDER than the 1st-degree-burn ring,
  // so the results bar chart must scale to the true max of all rings, not to
  // thermal1stDegree. These facts pin the crossover (NBS-011 fix).
  it('1 psi is wider than 1st-degree burns at small yields (Little Boy, Fat Man)', () => {
    for (const kt of [1, 15, 21, 100]) {
      const r = effectRadiiKm(kt)
      expect(r.overpressure1psi).toBeGreaterThan(r.thermal1stDegree)
    }
  })
  it('1st-degree burns overtakes 1 psi only at large yields (1 Mt+)', () => {
    for (const kt of [1000, 15000, 50000]) {
      const r = effectRadiiKm(kt)
      expect(r.thermal1stDegree).toBeGreaterThan(r.overpressure1psi)
    }
  })
})

describe('/nuclear-blast-radius page (run `npm run build` first)', () => {
  it('is prerendered to static HTML', () => {
    expect(existsSync(PAGE)).toBe(true)
  })

  const html = existsSync(PAGE) ? readFileSync(PAGE, 'utf8') : ''

  it('every wedge-table value equals radiusKm()/effectRadiiKm() for its yield and ring', () => {
    const missing: string[] = []
    for (const kt of ROWS) {
      const r = effectRadiiKm(kt)
      for (const key of RING_KEYS) {
        const cell = formatRadiusDual(r[key])
        // HTML encodes "(" and ")" literally; no entity escaping needed here.
        if (!html.includes(cell)) missing.push(`${kt} kt ${key} → "${cell}"`)
      }
    }
    expect(missing).toEqual([])
  })

  it('the 5 psi column is present for every yield (prose + table)', () => {
    for (const kt of ROWS) {
      expect(html).toContain(formatRadiusDual(radiusKm(kt, 'psi5')))
    }
  })

  it('shows no casualty or fallout figures (withheld outputs)', () => {
    // No "deaths"/"casualties"/"fatalities" counts and no fallout radius numbers.
    expect(/\bcasualtie?s?\b/i.test(html) && /\d[\d,]*\s*(deaths|fatalities|casualties)/i.test(html)).toBe(false)
  })

  it('has a <title> <=60 chars containing the primary keyword tokens', () => {
    const m = html.match(/<title>([^<]*)<\/title>/i)
    expect(m).toBeTruthy()
    const title = m![1]
    expect(title.length).toBeLessThanOrEqual(60)
    for (const tok of ['nuclear', 'blast', 'radius']) {
      expect(title.toLowerCase()).toContain(tok)
    }
  })

  it('has a meta description <=155 chars', () => {
    const m = html.match(/<meta name="description" content="([^"]*)"/i)
    expect(m).toBeTruthy()
    expect(m![1].length).toBeLessThanOrEqual(155)
  })

  it('JS-off crawlable twin is in the HTML: table, worked example, how-to-read', () => {
    expect(html).toContain('Nuclear blast radius chart: 1 kt to 50 Mt')
    expect(html).toContain('Worked example: a 1-megaton air burst')
    expect(html).toContain('How to read your results')
  })

  it('carries the seven section anchors the folded glossary URLs target', () => {
    for (const term of FOLDED_TERMS) {
      expect(html).toContain(`id="${term}"`)
    }
  })
})

describe('/nuclear-blast-radius is wired into the site', () => {
  it('is in the XML sitemap exactly once', () => {
    const xml = readFileSync(SITEMAP, 'utf8')
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    expect(locs.filter((u) => u === `${BASE}/nuclear-blast-radius`).length).toBe(1)
  })

  it('is in the client search index', () => {
    // The search index imports `@/`-aliased modules, so assert on its source.
    // Structural/hub entries (incl. /nuclear-blast-radius) are derived from
    // PAGE_SEO via BASE_PATHS (NBS-013).
    const src = readFileSync(join(__dirname, '..', 'src', 'lib', 'search', 'index.ts'), 'utf8')
    expect(src).toContain("'/nuclear-blast-radius'")
  })
})

describe('the 7 glossary URLs fold to /nuclear-blast-radius#<term> in one hop', () => {
  const sources = new Set((foldRedirects as Array<{ source: string }>).map((r) => r.source))

  it('each folded term 308s to the matching section anchor, ending at a built page', () => {
    const problems: string[] = []
    for (const term of FOLDED_TERMS) {
      const rule = (foldRedirects as Array<{ source: string; destination: string; permanent: boolean }>)
        .find((r) => r.source === `/glossary/${term}`)
      if (!rule) { problems.push(`${term}: no fold rule`); continue }
      if (rule.permanent !== true) problems.push(`${term}: not permanent (308)`)
      if (rule.destination !== `/nuclear-blast-radius#${term}`) problems.push(`${term}: dest ${rule.destination}`)
      // one hop: the destination page is not itself a redirect source
      if (sources.has(rule.destination.split('#')[0])) problems.push(`${term}: destination is a redirect source (multi-hop)`)
      if (!existsSync(PAGE)) problems.push(`${term}: destination page not built`)
    }
    expect(problems).toEqual([])
  })
})
