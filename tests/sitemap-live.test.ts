import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error - plain .mjs helper, no type declarations
import { readCsvObjects } from '../scripts/lib/csv.mjs'

// NBS-008: the built XML sitemap must list exactly the live pages in
// research/page-map.csv — no folded URLs, no missing live pages. Run
// `npm run build` first (reads the prerendered sitemap.xml body).
const BASE = 'https://nukeblastsimulator.com'
const SITEMAP = join(__dirname, '..', '.next', 'server', 'app', 'sitemap.xml.body')
const PAGEMAP = join(__dirname, '..', 'research', 'page-map.csv')

function toPath(loc: string): string {
  const p = loc.replace(BASE, '')
  return p === '' ? '/' : p
}

describe('sitemap equals live pages (NBS-008)', () => {
  const xml = readFileSync(SITEMAP, 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const sitemapPaths = locs.map(toPath)
  const sitemapSet = new Set(sitemapPaths)

  const live = (readCsvObjects(PAGEMAP) as Array<{ slug: string; status: string }>)
    .filter((r) => r.status === 'live')
    .map((r) => (r.slug === 'home' ? '/' : `/${r.slug}`))
  const liveSet = new Set(live)

  it('sitemap has no duplicate URLs', () => {
    expect(sitemapPaths.length).toBe(sitemapSet.size)
  })

  it('sitemap set equals the page-map live set', () => {
    const missing = [...liveSet].filter((p) => !sitemapSet.has(p)).sort()
    const extra = [...sitemapSet].filter((p) => !liveSet.has(p)).sort()
    expect({ missing, extra }).toEqual({ missing: [], extra: [] })
  })
})
