import { describe, it, expect } from 'vitest'
import { SOURCES } from '../src/lib/data/sources'
import { bombs } from '../src/lib/data/bombs'
import { presetLocations } from '../src/lib/data/cities'

const ENGINE_SOURCE_IDS = ['effects-fireball', 'effects-blast-thermal']

describe('citation registry', () => {
  it('has no duplicate source ids', () => {
    const ids = Object.keys(SOURCES)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every engine source id exists', () => {
    for (const id of ENGINE_SOURCE_IDS) expect(SOURCES[id], id).toBeDefined()
  })

  it('every source id referenced by weapon data exists', () => {
    const missing = bombs.flatMap((b) => b.sources ?? []).filter((id) => !SOURCES[id])
    expect([...new Set(missing)]).toEqual([])
  })

  it('every source id referenced by city data exists', () => {
    const missing = presetLocations.flatMap((c) => c.sourceIds).filter((id) => !SOURCES[id])
    expect([...new Set(missing)]).toEqual([])
  })

  it('every source has a url and attribution', () => {
    const bad = Object.entries(SOURCES).filter(([, s]) => !s.url || !s.attribution).map(([id]) => id)
    expect(bad).toEqual([])
  })
})

describe('verified weapon data (facts-verified rows 380–424)', () => {
  const byId = Object.fromEntries(bombs.map((b) => [b.id, b]))
  it('OFAB-5000 is removed', () => { expect(byId['ofab-5000']).toBeUndefined() })
  it('W88 is 455 kt', () => { expect(byId['w88'].yield).toBe(455) })
  it('W76 is the current 90 kt', () => { expect(byId['w76'].yield).toBe(90) })
  it('Halifax Explosion is 2.9 kt and Canada', () => {
    expect(byId['halifax-explosion'].yield).toBe(2.9)
    expect(byId['halifax-explosion'].country).toBe('Canada')
  })
  it('Orange Herald is a fission device', () => { expect(byId['orange-herald'].type).toBe('fission') })
  it('every non-custom weapon has at least one source', () => {
    const noSrc = bombs.filter((b) => b.id !== 'custom' && (b.sources ?? []).length === 0).map((b) => b.id)
    expect(noSrc).toEqual([])
  })
})

describe('verified city data (cities-verified.csv)', () => {
  const byId = Object.fromEntries(presetLocations.map((c) => [c.slug, c]))
  it('New York: 8,584,629 (2025, city proper)', () => {
    const c = byId['new-york']
    expect(c.population).toBe(8584629)
    expect(c.populationYear).toBe(2025)
    expect(c.populationDefinition).toBe('city proper')
  })
  it('Accra: 284,124', () => { expect(byId['accra'].population).toBe(284124) })
  it('density only present where area is known', () => {
    const bad = presetLocations.filter((c) => c.density !== undefined && c.area_km2 === undefined).map((c) => c.slug)
    expect(bad).toEqual([])
  })
  it('every city has source ids', () => {
    expect(presetLocations.filter((c) => c.sourceIds.length === 0).map((c) => c.slug)).toEqual([])
  })
})
