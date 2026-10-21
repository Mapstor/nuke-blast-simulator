import { describe, it, expect } from 'vitest'
import { join } from 'node:path'
// @ts-expect-error - plain .mjs helper, no type declarations
import { readCsvObjects } from '../scripts/lib/csv.mjs'
import { presetLocations } from '../src/lib/data/cities'

// cities.ts vs the chat-verified city table. Never edit
// research/cities-verified.csv to make this pass — fix the data instead.
const CSV = join(__dirname, '..', 'research', 'cities-verified.csv')

type Row = {
  slug: string; name: string; country: string; population: string
  population_year: string; population_definition: string
  area_km2: string; density_per_km2: string; lat: string; lng: string
}

describe('cities regression gate', () => {
  const rows = readCsvObjects(CSV) as Row[]
  const bySlug = new Map(presetLocations.map((c) => [c.slug, c]))

  it('100 cities in data and in the verified table', () => {
    expect(presetLocations.length).toBe(100)
    expect(rows.length).toBe(100)
  })

  it('every city matches population, year, definition, lat and lng', () => {
    const problems: string[] = []
    for (const r of rows) {
      const c = bySlug.get(r.slug)
      if (!c) { problems.push(`${r.slug}: missing from cities.ts`); continue }
      if (c.population !== Number(r.population)) problems.push(`${r.slug}: population ${c.population} != ${r.population}`)
      if (c.populationYear !== Number(r.population_year)) problems.push(`${r.slug}: year ${c.populationYear} != ${r.population_year}`)
      if (c.populationDefinition !== r.population_definition) problems.push(`${r.slug}: definition "${c.populationDefinition}" != "${r.population_definition}"`)
      if (Math.abs(c.lat - Number(r.lat)) > 1e-4) problems.push(`${r.slug}: lat ${c.lat} != ${r.lat}`)
      if (Math.abs(c.lng - Number(r.lng)) > 1e-4) problems.push(`${r.slug}: lng ${c.lng} != ${r.lng}`)
    }
    expect(problems).toEqual([])
  })
})
