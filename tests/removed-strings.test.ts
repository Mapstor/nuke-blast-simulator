import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error - plain .mjs helper, no type declarations
import { readCsvObjects } from '../scripts/lib/csv.mjs'

// Scans the prerendered HTML for strings that the NBS-005 fact wave removed.
// Run `npm run build` before `npm test`. Never edit research/removed-strings.csv
// to make this pass — fix the content instead.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const CSV = join(__dirname, '..', 'research', 'removed-strings.csv')

// Collapse built HTML to a lowercased, single-spaced, tag-free blob so a
// forbidden phrase is caught even when React splits it with <!-- --> markers,
// wraps words in tags, or emits HTML entities. The CSV strings are already
// lowercased with ASCII hyphens and "x" for the multiplication sign.
function normalize(s: string): string {
  return s
    .replace(/<!--.*?-->/gs, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&(#39|#x27|rsquo|lsquo|apos);/g, "'")
    .replace(/&(quot|#34);/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&(times|#215);/g, 'x')
    .replace(/&(deg|#176);/g, '°')
    .replace(/&(ndash|#8211|mdash|#8212);/g, '-')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n)))
    .replace(/[×]/g, 'x')
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function pageFile(scope: string): string {
  const rel = scope === '/' ? 'index' : scope.replace(/^\//, '')
  return join(APP, rel + '.html')
}

function walkHtml(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walkHtml(p, out)
    else if (e.endsWith('.html')) out.push(p)
  }
  return out
}

type Row = { row_id: string; verdict: string; scope: string; string: string }

describe('removed-strings regression gate', () => {
  const rows = readCsvObjects(CSV) as Row[]
  const allHtml = walkHtml(APP)
  const cache = new Map<string, string>()
  const normOf = (f: string) => {
    let v = cache.get(f)
    if (v === undefined) { v = normalize(readFileSync(f, 'utf8')); cache.set(f, v) }
    return v
  }

  it('found prerendered HTML to scan (run `next build` first)', () => {
    expect(allHtml.length).toBeGreaterThan(0)
  })

  it('loaded the forbidden-string list', () => {
    expect(rows.length).toBeGreaterThan(100)
  })

  it('no forbidden string survives anywhere in its scope', () => {
    const offenders: string[] = []
    for (const r of rows) {
      const needle = normalize(r.string)
      if (!needle) continue
      if (r.scope === '*') {
        for (const f of allHtml) {
          if (normOf(f).includes(needle)) {
            offenders.push(`row ${r.row_id} "${r.string}" -> ${f.replace(APP, '')}`)
          }
        }
      } else {
        const f = pageFile(r.scope)
        if (!existsSync(f)) {
          offenders.push(`row ${r.row_id}: scoped page ${r.scope} has no built HTML`)
        } else if (normOf(f).includes(needle)) {
          offenders.push(`row ${r.row_id} "${r.string}" -> ${r.scope}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })
})
