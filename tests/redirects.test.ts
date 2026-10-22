import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import scenarioRedirects from '../data/scenario-redirects.json'
import weaponRedirects from '../data/weapon-redirects.json'
import foldRedirects from '../data/fold-redirects.json'

// NBS-010: every redirect in all three config files (scenario, weapon, fold)
// must be a permanent (308) redirect that resolves in ONE hop to a built page
// (200) — the destination must not itself be a redirect source — and no source
// may appear in the sitemap. Run `npm run build` first.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const SITEMAP = join(APP, 'sitemap.xml.body')
const BASE = 'https://nukeblastsimulator.com'

type Rule = { source: string; destination: string; permanent: boolean }
const all = [...scenarioRedirects, ...weaponRedirects, ...foldRedirects] as Rule[]

function builtHtml(path: string): string {
  const clean = path.split('#')[0].split('?')[0]
  const rel = clean === '/' ? 'index' : clean.replace(/^\//, '')
  return join(APP, rel + '.html')
}

describe('all redirects are one-hop 308 -> 200 (NBS-010)', () => {
  const sources = new Set(all.map((r) => r.source))

  it('expected rule counts (251 scenario + 1 weapon + 142 fold = 394)', () => {
    expect(scenarioRedirects.length).toBe(251)
    expect(weaponRedirects.length).toBe(1)
    expect(foldRedirects.length).toBe(142)
    expect(all.length).toBe(394)
  })

  it('no source is duplicated across the three files', () => {
    expect(sources.size).toBe(all.length)
  })

  it('every rule is permanent (308), one hop, ending at a built page (200)', () => {
    const problems: string[] = []
    for (const r of all) {
      if (r.permanent !== true) problems.push(`${r.source}: not a permanent (308) redirect`)
      const destPath = r.destination.split('#')[0]
      if (sources.has(destPath)) problems.push(`${r.source} -> ${r.destination}: destination is itself a redirect source (multi-hop)`)
      if (!existsSync(builtHtml(r.destination))) problems.push(`${r.source} -> ${r.destination}: destination has no built page (would 404)`)
    }
    expect(problems).toEqual([])
  })

  it('no redirect source appears in the sitemap', () => {
    const xml = readFileSync(SITEMAP, 'utf8')
    const locs = new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE, '') || '/'),
    )
    const leaked = [...sources].filter((s) => locs.has(s))
    expect(leaked).toEqual([])
  })
})
