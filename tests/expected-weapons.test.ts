import { describe, it, expect } from 'vitest'
import { join } from 'node:path'
// @ts-expect-error - plain .mjs helper, no type declarations
import { readCsvObjects } from '../scripts/lib/csv.mjs'
import { bombs } from '../src/lib/data/bombs'

// bombs.ts vs the chat-verified weapon table. Never edit
// research/expected-weapons.csv to make this pass — fix the data instead.
const CSV = join(__dirname, '..', 'research', 'expected-weapons.csv')

type Row = {
  id: string; name: string; yield_kt: string; type: string
  country: string; year: string; facts_row: string
}

describe('expected-weapons regression gate', () => {
  const rows = readCsvObjects(CSV) as Row[]
  const byId = new Map(bombs.map((b) => [b.id, b]))

  it('every expected weapon exists with matching yield, type, country and year', () => {
    const problems: string[] = []
    for (const r of rows) {
      const b = byId.get(r.id)
      if (!b) { problems.push(`${r.id}: missing from bombs.ts`); continue }
      const expYield = Number(r.yield_kt)
      const tol = Math.max(1e-9, Math.abs(expYield) * 1e-6)
      if (Math.abs(b.yield - expYield) > tol) problems.push(`${r.id}: yield ${b.yield} != ${r.yield_kt}`)
      if (r.type && b.type !== r.type) problems.push(`${r.id}: type ${b.type} != ${r.type}`)
      if (r.country && b.country !== r.country) problems.push(`${r.id}: country ${b.country} != ${r.country}`)
      if (r.year) {
        if (String(b.year) !== r.year) problems.push(`${r.id}: year ${b.year} != ${r.year}`)
      } else if (b.year !== undefined) {
        problems.push(`${r.id}: year ${b.year} should be absent`)
      }
    }
    expect(problems).toEqual([])
  })

  it('OFAB-5000 was removed (no verified source)', () => {
    expect(bombs.find((b) => b.id === 'ofab-5000')).toBeUndefined()
  })

  it('mark-84 and mk-82 are not dated 1956', () => {
    for (const id of ['mark-84', 'mk-82']) {
      const b = bombs.find((x) => x.id === id)
      expect(b, `${id} present`).toBeDefined()
      expect(b!.year, `${id} year`).not.toBe(1956)
    }
  })

  it('29 nuclear weapons and 14 conventional, with the custom slot excluded', () => {
    const nuclear = bombs.filter((b) => b.type !== 'conventional' && b.id !== 'custom')
    const conventional = bombs.filter((b) => b.type === 'conventional')
    expect(nuclear.length).toBe(29)
    expect(conventional.length).toBe(14)
    expect(bombs.some((b) => b.id === 'custom')).toBe(true)
    expect(rows.some((r) => r.id === 'custom')).toBe(false)
  })
})
