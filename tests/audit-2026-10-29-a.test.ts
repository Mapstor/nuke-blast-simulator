import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { bombs } from '../src/lib/data/bombs'
import { COUNTRIES, COUNTRY_SLUGS, val } from '../src/lib/data/countryView'

// NBS-016 (audit-a) invariants over the built HTML. Run `npm run build` first.
const APP = join(__dirname, '..', '.next', 'server', 'app')

function pageFile(path: string): string {
  return join(APP, (path === '/' ? 'index' : path.replace(/^\//, '')) + '.html')
}
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&times;/g, '×')
    .replace(/\s+/g, ' ')
}
function allHtml(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) allHtml(p, out)
    else if (e.endsWith('.html')) out.push(p)
  }
  return out
}

describe('weapons hub totals equal the country-page totals (NBS-016)', () => {
  const hub = existsSync(pageFile('/weapons')) ? visibleText(readFileSync(pageFile('/weapons'), 'utf8')) : ''
  const arsenals = COUNTRY_SLUGS.filter((s) => s !== 'iran')

  it('built the hub and country pages', () => {
    expect(hub.length).toBeGreaterThan(0)
    expect(arsenals.length).toBe(9)
  })

  it('each arsenal country FAS total appears on the hub AND its country page', () => {
    const problems: string[] = []
    for (const slug of arsenals) {
      const total = val(COUNTRIES[slug], 'warheads.fas.total_inventory')
      expect(total, `${slug} total`).toBeTruthy()
      const needle = `${total} warheads`
      if (!hub.includes(needle)) problems.push(`hub missing "${needle}" for ${slug}`)
      const cf = pageFile(`/nuclear-weapons-by-country/${slug}`)
      if (!existsSync(cf)) { problems.push(`no built page for ${slug}`); continue }
      const country = visibleText(readFileSync(cf, 'utf8'))
      if (!country.includes(total)) problems.push(`${slug} page missing its own total "${total}"`)
    }
    expect(problems).toEqual([])
  })
})

describe('conventional pages show fill, not a TNT yield (NBS-016)', () => {
  const conv = bombs.filter((b) => b.type === 'conventional')

  it('every conventional weapon page is built', () => {
    for (const b of conv) expect(existsSync(pageFile(`/weapons/${b.id}`)), b.id).toBe(true)
  })

  it('no conventional page renders the old "tons TNT" fill-as-yield phrasing', () => {
    const offenders: string[] = []
    for (const b of conv) {
      const text = visibleText(readFileSync(pageFile(`/weapons/${b.id}`), 'utf8'))
      if (/tons TNT/.test(text)) offenders.push(b.id)
    }
    expect(offenders).toEqual([])
  })

  it('fill bombs label the fill as "explosive fill"', () => {
    const offenders: string[] = []
    for (const b of conv.filter((x) => x.measure === 'fill')) {
      const text = visibleText(readFileSync(pageFile(`/weapons/${b.id}`), 'utf8'))
      if (!/explosive fill/.test(text)) offenders.push(b.id)
    }
    expect(offenders).toEqual([])
  })

  it('bombs with a TNT equivalent (MOAB, Grand Slam, FOAB, Halifax) cite it', () => {
    const offenders: string[] = []
    for (const b of conv.filter((x) => x.measure !== 'fill')) {
      const html = readFileSync(pageFile(`/weapons/${b.id}`), 'utf8')
      const text = visibleText(html)
      if (!/TNT equivalent/.test(text)) offenders.push(`${b.id}: no TNT-equivalent label`)
      if (!html.includes('href="#source-')) offenders.push(`${b.id}: TNT equivalent stated with no citation`)
    }
    expect(offenders).toEqual([])
  })
})

describe('Hiroshima multiples formatted to one decimal below 10×, never circular (NBS-016)', () => {
  const files = allHtml(APP)

  it('no page says a weapon "is 1× …" the Hiroshima bomb', () => {
    const offenders: string[] = []
    for (const f of files) {
      const text = visibleText(readFileSync(f, 'utf8'))
      if (/\b1× (?:more powerful|smaller) than the Hiroshima/.test(text)) offenders.push(f.replace(APP, ''))
    }
    expect(offenders).toEqual([])
  })

  it('Trinity reads 1.7×, not 2×, more powerful than Hiroshima', () => {
    const text = visibleText(readFileSync(pageFile('/weapons/trinity'), 'utf8'))
    expect(text).toContain('1.7× more powerful than the Hiroshima bomb')
    expect(text).not.toContain('2× more powerful than the Hiroshima bomb')
  })

  it('Little Boy vs Fat Man: Fat Man 1.4×, Little Boy is the Hiroshima bomb', () => {
    const f = pageFile('/compare/little-boy-vs-fat-man')
    expect(existsSync(f)).toBe(true)
    const text = visibleText(readFileSync(f, 'utf8'))
    expect(text).toContain('1.4× more powerful than the Hiroshima bomb')
    expect(text).toContain('Little Boy is the Hiroshima bomb')
  })
})
