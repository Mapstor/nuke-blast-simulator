import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error - plain .mjs helper, no type declarations
import { readCsvObjects } from '../scripts/lib/csv.mjs'
import foldRedirects from '../data/fold-redirects.json'

// NBS-008: every folded URL (research/redirect-plan.csv) must 308 in ONE hop to
// a page that exists (200). We verify the generated rules structurally: a rule
// per row, permanent (=308), and a destination that maps to a built .html page
// and is not itself a redirect source. Run `npm run build` first.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const PLAN = join(__dirname, '..', 'research', 'redirect-plan.csv')

type Rule = { source: string; destination: string; permanent: boolean }

function builtHtml(path: string): string {
  const clean = path.split('#')[0].split('?')[0]
  const rel = clean === '/' ? 'index' : clean.replace(/^\//, '')
  return join(APP, rel + '.html')
}

describe('fold redirects (NBS-008)', () => {
  const rows = readCsvObjects(PLAN) as Array<{ from: string; to: string }>
  const rules = foldRedirects as Rule[]
  const bySource = new Map(rules.map((r) => [r.source, r]))
  const sources = new Set(rules.map((r) => r.source))

  it('one redirect rule per redirect-plan row', () => {
    expect(rows.length).toBe(142)
    expect(rules.length).toBe(rows.length)
  })

  it('every row is a permanent (308) one-hop redirect ending at a built page (200)', () => {
    const problems: string[] = []
    for (const r of rows) {
      const rule = bySource.get(r.from)
      if (!rule) { problems.push(`${r.from}: no redirect rule`); continue }
      if (rule.permanent !== true) problems.push(`${r.from}: not a permanent (308) redirect`)
      const destPath = rule.destination.split('#')[0]
      if (sources.has(destPath)) problems.push(`${r.from} -> ${rule.destination}: destination is itself redirected (multi-hop)`)
      if (!existsSync(builtHtml(rule.destination))) problems.push(`${r.from} -> ${rule.destination}: destination has no built page (would 404)`)
    }
    expect(problems).toEqual([])
  })
})
