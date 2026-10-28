import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error - plain .mjs helper, no type declarations
import { readCsvObjects } from '../scripts/lib/csv.mjs'
import { COUNTRIES, COUNTRY_SLUGS } from '../src/lib/data/countries'
import { radiusDual } from '../src/lib/calculations/radius'

// NBS-012: the 10 country pages. Run `npm run build` first for the HTML checks.
const APP = join(__dirname, '..', '.next', 'server', 'app', 'nuclear-weapons-by-country')
const BASE = 'https://nukeblastsimulator.com'

const facts = readCsvObjects(join(__dirname, '..', 'research', 'country-facts.csv')) as Array<{
  country: string; field: string; value: string; status: string
}>
const verified = new Set(facts.filter((r) => r.status.trim() === 'verified').map((r) => `${r.country}|${r.field}|${r.value}`))
const nonVerified = new Set(facts.filter((r) => r.status.trim() !== 'verified').map((r) => `${r.country}|${r.field}|${r.value}`))

function html(key: string): string {
  const f = join(APP, `${key}.html`)
  return existsSync(f) ? readFileSync(f, 'utf8') : ''
}

describe('country data is verified-only (no candidate/gap value renders)', () => {
  it('every emitted row maps to a VERIFIED country-facts row', () => {
    const bad: string[] = []
    for (const k of COUNTRY_SLUGS) {
      for (const r of COUNTRIES[k].rows) {
        const key = `${k}|${r.field}|${r.value}`
        if (!verified.has(key)) bad.push(key)
        if (nonVerified.has(key)) bad.push(`CANDIDATE/GAP LEAKED: ${key}`)
      }
    }
    expect(bad).toEqual([])
  })
  it('known candidate values never appear in the generated data', () => {
    const blob = JSON.stringify(COUNTRIES)
    for (const forbidden of ['RDS-1', '12,321', '50 atmospheric + 160 underground']) {
      expect(blob).not.toContain(forbidden)
    }
  })
})

describe('extracted warhead yields are clean single kt (engine-ready)', () => {
  it('US warhead yields and NK test-yield fallback are as expected', () => {
    expect(COUNTRIES['united-states'].warheadYieldsKt).toEqual([8, 90, 300, 335, 400, 455])
    expect(COUNTRIES['north-korea'].warheadYieldsKt).toEqual([])
    expect(COUNTRIES['north-korea'].testYieldsKt).toContain(250)
    expect(COUNTRIES['israel'].warheadYieldsKt).toEqual([])
    expect(COUNTRIES['pakistan'].warheadYieldsKt).toEqual([])
  })
})

describe('country pages (run `npm run build` first)', () => {
  it('all 10 prerendered', () => {
    for (const k of COUNTRY_SLUGS) expect(existsSync(join(APP, `${k}.html`))).toBe(true)
  })

  it('every blast radius shown equals radiusDual()/radiusKm() for its yield', () => {
    const missing: string[] = []
    for (const k of COUNTRY_SLUGS) {
      const c = COUNTRIES[k]
      const yields = c.warheadYieldsKt.length ? c.warheadYieldsKt : c.testYieldsKt
      const h = html(k)
      if (!h) continue
      for (const kt of yields) {
        for (const eff of ['psi5', 'burn3'] as const) {
          const s = radiusDual(kt, eff)
          if (!h.includes(s)) missing.push(`${k} ${kt}kt ${eff} -> "${s}"`)
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('no title, H1, meta description or OG title/description contains "attack" or "strike"', () => {
    const offenders: string[] = []
    const re = /attack|strike/i
    for (const k of COUNTRY_SLUGS) {
      const h = html(k)
      if (!h) continue
      const grab = (rx: RegExp) => (h.match(rx)?.[1] ?? '')
      const fields = {
        title: grab(/<title>([^<]*)<\/title>/i),
        h1: grab(/<h1[^>]*>([^<]*)<\/h1>/i),
        meta: grab(/<meta name="description" content="([^"]*)"/i),
        ogt: grab(/<meta property="og:title" content="([^"]*)"/i),
        ogd: grab(/<meta property="og:description" content="([^"]*)"/i),
      }
      for (const [name, v] of Object.entries(fields)) if (re.test(v)) offenders.push(`${k}.${name}: ${v}`)
    }
    expect(offenders).toEqual([])
  })
})

describe('the 10 country pages are wired into sitemap and search', () => {
  it('each is in the built XML sitemap', () => {
    const xml = readFileSync(join(__dirname, '..', '.next', 'server', 'app', 'sitemap.xml.body'), 'utf8')
    const missing = COUNTRY_SLUGS.filter((k) => !xml.includes(`${BASE}/nuclear-weapons-by-country/${k}`))
    expect(missing).toEqual([])
  })
  it('the search index wires in the country pages', () => {
    const src = readFileSync(join(__dirname, '..', 'src', 'lib', 'search', 'index.ts'), 'utf8')
    expect(src).toContain('countryPages')
    expect(src).toContain('nuclear-weapons-by-country/${k}')
  })
})

describe('country titles and metas (from pageSeo)', () => {
  it('10 titles <=60 and unique; 10 metas <=155 and unique', () => {
    const seo = readFileSync(join(__dirname, '..', 'src', 'lib', 'seo', 'pageSeo.ts'), 'utf8')
    const titles = new Set<string>()
    const metas = new Set<string>()
    for (const k of COUNTRY_SLUGS) {
      const path = `/nuclear-weapons-by-country/${k}`
      const m = seo.match(new RegExp(`'${path}': \\{ title: '((?:[^'\\\\]|\\\\.)*)', h1: '(?:[^'\\\\]|\\\\.)*', description: '((?:[^'\\\\]|\\\\.)*)' \\}`))
      expect(m, `pageSeo entry for ${path}`).toBeTruthy()
      const title = m![1].replace(/\\'/g, "'")
      const meta = m![2].replace(/\\'/g, "'")
      expect(title.length, `${path} title`).toBeLessThanOrEqual(60)
      expect(meta.length, `${path} meta`).toBeLessThanOrEqual(155)
      titles.add(title)
      metas.add(meta)
    }
    expect(titles.size).toBe(COUNTRY_SLUGS.length)
    expect(metas.size).toBe(COUNTRY_SLUGS.length)
  })
})
