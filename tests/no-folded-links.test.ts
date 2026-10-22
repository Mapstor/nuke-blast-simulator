import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error - plain .mjs helper, no type declarations
import { readCsvObjects } from '../scripts/lib/csv.mjs'

// NBS-008: no built page may contain an internal link to a folded URL (every
// such URL now 308-redirects). The folded set is the `from` column of
// research/redirect-plan.csv. Run `npm run build` first.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const PLAN = join(__dirname, '..', 'research', 'redirect-plan.csv')

function walkHtml(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walkHtml(p, out)
    else if (e.endsWith('.html')) out.push(p)
  }
  return out
}

describe('no built page links to a folded URL (NBS-008)', () => {
  const folded = new Set((readCsvObjects(PLAN) as Array<{ from: string }>).map((r) => r.from))
  const files = walkHtml(APP)

  it('found prerendered HTML to scan (run `next build` first)', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it('no internal href points at a folded URL', () => {
    const offenders = new Set<string>()
    for (const f of files) {
      const html = readFileSync(f, 'utf8')
      for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
        const href = (m[1].split('#')[0].split('?')[0].replace(/\/$/, '')) || '/'
        if (folded.has(href)) offenders.add(`${f.replace(APP, '')} -> ${href}`)
      }
    }
    expect([...offenders].sort()).toEqual([])
  })
})
