import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error - plain .mjs helper, no type declarations
import { readCsvObjects } from '../scripts/lib/csv.mjs'

// NBS-008: titles and meta descriptions on the live pages, checked on the
// actual built HTML. Title <=60 and unique; description <=155 and unique; and
// every non-structural page's title contains all non-stopword tokens of its
// primary keyword. Run `npm run build` first.
const APP = join(__dirname, '..', '.next', 'server', 'app')

const STRUCTURAL = new Set(['about', 'methodology', 'sources', 'blog', 'contact', 'faq', 'glossary',
  'how-it-works', 'privacy', 'resources', 'terms'])
const STOP = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'and', 'or', 'vs',
  'with', 'is', 'are', 'was', 'how', 'do', 'does', 'did', 'what', 'from', 'it', 'its', 'i', 'if', 'would'])

function pageFile(path: string): string {
  return join(APP, (path === '/' ? 'index' : path.replace(/^\//, '')) + '.html')
}
function decode(s: string): string {
  return s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&(mdash|#8212);/g, '—').replace(/&(ndash|#8211);/g, '–')
}
function titleOf(html: string): string | null {
  const m = html.match(/<title>([^<]*)<\/title>/i)
  return m ? decode(m[1]) : null
}
function descOf(html: string): string | null {
  const m = html.match(/<meta name="description" content="([^"]*)"/i)
  return m ? decode(m[1]) : null
}
function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean)
}

describe('titles and meta descriptions (NBS-008)', () => {
  const led = readCsvObjects(join(__dirname, '..', 'research', 'keyword-ledger.csv'))
  const primaryBySlug: Record<string, string> = {}
  for (const r of led) if (r.role === 'primary') primaryBySlug[r.page_slug] = r.keyword

  const pages = (readCsvObjects(join(__dirname, '..', 'research', 'page-map.csv')) as Array<{ slug: string; status: string }>)
    .filter((r) => r.status === 'live')
    .map((r) => ({ slug: r.slug, path: r.slug === 'home' ? '/' : `/${r.slug}`, primary: primaryBySlug[r.slug] }))
    .filter((p) => existsSync(pageFile(p.path)))

  it('scans the full live page set', () => {
    expect(pages.length).toBeGreaterThan(100)
  })

  it('every live page has a <title> and meta description', () => {
    const missing = pages.filter((p) => {
      const h = readFileSync(pageFile(p.path), 'utf8')
      return !titleOf(h) || !descOf(h)
    })
    expect(missing.map((p) => p.path)).toEqual([])
  })

  it('titles <=60 chars and unique; descriptions <=155 chars and unique', () => {
    const titles = new Map<string, string>(), descs = new Map<string, string>()
    const problems: string[] = []
    for (const p of pages) {
      const h = readFileSync(pageFile(p.path), 'utf8')
      const t = titleOf(h)!, d = descOf(h)!
      if (t.length > 60) problems.push(`${p.path}: title ${t.length}>60 "${t}"`)
      if (d.length > 155) problems.push(`${p.path}: description ${d.length}>155`)
      if (titles.has(t)) problems.push(`duplicate title "${t}" (${titles.get(t)} & ${p.path})`); else titles.set(t, p.path)
      if (descs.has(d)) problems.push(`duplicate description (${descs.get(d)} & ${p.path})`); else descs.set(d, p.path)
    }
    expect(problems).toEqual([])
  })

  it('every non-structural title contains all non-stopword tokens of its primary keyword', () => {
    const problems: string[] = []
    for (const p of pages) {
      if (STRUCTURAL.has(p.slug) || !p.primary) continue
      const h = readFileSync(pageFile(p.path), 'utf8')
      const titleTokens = new Set(tokens(titleOf(h)!))
      const missing = tokens(p.primary).filter((t) => !STOP.has(t) && !titleTokens.has(t))
      if (missing.length) problems.push(`${p.path}: title missing [${missing}] from primary "${p.primary}"`)
    }
    expect(problems).toEqual([])
  })
})
