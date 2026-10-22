import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { bombs } from '../src/lib/data/bombs'
import { presetLocations } from '../src/lib/data/cities'
import { COMPARISONS, encodeComparisonSlug } from '../src/lib/data/comparisons'
import { KEPT_CITY_SLUGS } from '../src/lib/data/livePages'

// Every page that shows computed radii must cite the two engine sources
// (effects-fireball, effects-blast-thermal). We detect them by their deep-link
// URLs in the rendered Sources list. Run `npm run build` first.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const FIREBALL_URL = 'glasstone-dolan/chapter2'
const BLAST_URL = 'wiki/Effects_of_nuclear_explosions'

function check(rel: string): { exists: boolean; missing: string[] } {
  const f = join(APP, rel + '.html')
  if (!existsSync(f)) return { exists: false, missing: [] }
  const html = readFileSync(f, 'utf8')
  const missing: string[] = []
  if (!html.includes(FIREBALL_URL)) missing.push('effects-fireball')
  if (!html.includes(BLAST_URL)) missing.push('effects-blast-thermal')
  return { exists: true, missing }
}

describe('engine-sources regression gate', () => {
  const nuclear = bombs.filter((b) => b.type !== 'conventional' && b.id !== 'custom')
  const nuclearIds = new Set(nuclear.map((b) => b.id))

  // Exactly the radii pages: home, methodology, each nuclear weapon, each city
  // example, and each comparison where both weapons are nuclear.
  const pages: string[] = [
    'index',
    'methodology',
    ...nuclear.map((b) => `weapons/${b.id}`),
    ...presetLocations.filter((c) => KEPT_CITY_SLUGS.includes(c.slug)).map((c) => `examples/${c.slug}`),
    ...COMPARISONS.filter(([a, b]) => nuclearIds.has(a) && nuclearIds.has(b)).map(
      ([a, b]) => `compare/${encodeComparisonSlug(a, b)}`,
    ),
  ]

  it('has prerendered radii pages to check (run `next build` first)', () => {
    expect(pages.some((p) => existsSync(join(APP, p + '.html')))).toBe(true)
  })

  it('every radii page lists effects-fireball and effects-blast-thermal', () => {
    const problems: string[] = []
    for (const p of pages) {
      const r = check(p)
      if (!r.exists) { problems.push(`${p}: no built HTML`); continue }
      if (r.missing.length) problems.push(`${p}: missing ${r.missing.join(', ')}`)
    }
    expect(problems).toEqual([])
  })

  it('a conventional weapon page shows no engine sources (radii withdrawn)', () => {
    const conv = bombs.find((b) => b.type === 'conventional')
    if (!conv) return
    const r = check(`weapons/${conv.id}`)
    if (r.exists) expect(r.missing).toEqual(['effects-fireball', 'effects-blast-thermal'])
  })
})
