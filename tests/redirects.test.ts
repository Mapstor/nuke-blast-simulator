import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import scenarioRedirects from '../data/scenario-redirects.json'
import weaponRedirects from '../data/weapon-redirects.json'
import foldRedirects from '../data/fold-redirects.json'
import blogRedirects from '../data/blog-redirects.json'

// NBS-010: every redirect in all three config files (scenario, weapon, fold)
// must be a permanent (308) redirect that resolves in ONE hop to a built page
// (200) — the destination must not itself be a redirect source — and no source
// may appear in the sitemap. Run `npm run build` first.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const SITEMAP = join(APP, 'sitemap.xml.body')
const BASE = 'https://nukeblastsimulator.com'

type Rule = { source: string; destination: string; permanent: boolean }
const all = [...scenarioRedirects, ...weaponRedirects, ...foldRedirects, ...blogRedirects] as Rule[]

function builtHtml(path: string): string {
  const clean = path.split('#')[0].split('?')[0]
  const rel = clean === '/' ? 'index' : clean.replace(/^\//, '')
  return join(APP, rel + '.html')
}

describe('all redirects are one-hop 308 -> 200 (NBS-010)', () => {
  const sources = new Set(all.map((r) => r.source))

  it('expected rule counts (251 scenario + 2 weapon + 142 fold + 1 blog = 396)', () => {
    expect(scenarioRedirects.length).toBe(251)
    expect(weaponRedirects.length).toBe(2)
    expect(foldRedirects.length).toBe(142)
    expect(blogRedirects.length).toBe(1)
    expect(all.length).toBe(396)
  })

  it('the north-korea-2017-test rename is a one-hop 308 and the old URL is gone (NBS-016)', () => {
    const rule = all.find((r) => r.source === '/weapons/hwasong-14')
    expect(rule).toBeTruthy()
    expect(rule!.destination).toBe('/weapons/north-korea-2017-test')
    expect(rule!.permanent).toBe(true)
    // destination is a built page and the old URL is not
    expect(existsSync(builtHtml('/weapons/north-korea-2017-test'))).toBe(true)
    expect(existsSync(builtHtml('/weapons/hwasong-14'))).toBe(false)
    // no built page links to the old URL
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const e of require('node:fs').readdirSync(dir)) {
        const p = join(dir, e)
        if (require('node:fs').statSync(p).isDirectory()) walk(p)
        else if (e.endsWith('.html') && readFileSync(p, 'utf8').includes('/weapons/hwasong-14')) offenders.push(p.replace(APP, ''))
      }
    }
    walk(APP)
    expect(offenders).toEqual([])
  })

  it('the nuclear-explosion rename is a one-hop 308 and the old URL is gone (NBS-015)', () => {
    const rule = all.find((r) => r.source === '/blog/four-kill-mechanisms')
    expect(rule).toBeTruthy()
    expect(rule!.destination).toBe('/blog/nuclear-explosion')
    expect(rule!.permanent).toBe(true)
    // destination is a built page and the old URL is not
    expect(existsSync(builtHtml('/blog/nuclear-explosion'))).toBe(true)
    expect(existsSync(builtHtml('/blog/four-kill-mechanisms'))).toBe(false)
    // no built page links to the old URL
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const e of require('node:fs').readdirSync(dir)) {
        const p = join(dir, e)
        if (require('node:fs').statSync(p).isDirectory()) walk(p)
        else if (e.endsWith('.html') && readFileSync(p, 'utf8').includes('/blog/four-kill-mechanisms')) offenders.push(p.replace(APP, ''))
      }
    }
    walk(APP)
    expect(offenders).toEqual([])
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
