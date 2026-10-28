import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// NBS-013: sitewide invariants over the built HTML of EVERY page. Run
// `npm run build` first. These guard the defects chat found in production:
// broken citations, raw key=value leaks, and the competitor's name used as ours.
const APP = join(__dirname, '..', '.next', 'server', 'app')

function allHtml(dir: string): string[] {
  const out: string[] = []
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) out.push(...allHtml(p))
    else if (e.endsWith('.html')) out.push(p)
  }
  return out
}
function rel(p: string): string {
  return p.slice(APP.length + 1)
}
// Visible text: drop <script>/<style> blocks and all tags, decode a few entities.
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

const FILES = allHtml(APP)

describe('sitewide built-HTML invariants (run `npm run build` first)', () => {
  it('has built HTML to scan', () => {
    expect(FILES.length).toBeGreaterThan(100)
  })

  it('every citation [n] resolves to a listed source on the same page', () => {
    const problems: string[] = []
    for (const f of FILES) {
      const html = readFileSync(f, 'utf8')
      const cited = new Set([...html.matchAll(/href="#source-(\d+)"/g)].map((m) => Number(m[1])))
      if (!cited.size) continue
      const listed = new Set([...html.matchAll(/id="source-(\d+)"/g)].map((m) => Number(m[1])))
      const dangling = [...cited].filter((n) => !listed.has(n)).sort((a, b) => a - b)
      if (dangling.length) problems.push(`${rel(f)}: cites ${dangling.join(',')} with ${listed.size} listed`)
    }
    expect(problems).toEqual([])
  })

  it('no page leaks raw key=value text (e.g. "warheads=1,794")', () => {
    const problems: string[] = []
    for (const f of FILES) {
      const text = visibleText(readFileSync(f, 'utf8'))
      const m = text.match(/\b[a-z_]+=\d/)
      if (m) problems.push(`${rel(f)}: "${m[0]}"`)
    }
    expect(problems).toEqual([])
  })

  it('never uses "Nuclear Blast Simulator" as the site name (that is the competitor)', () => {
    // The site is "Nuke Blast Simulator". The capitalized proper noun must not
    // appear anywhere in the output (markup, visible text or JSON-LD).
    const offenders = FILES.filter((f) => readFileSync(f, 'utf8').includes('Nuclear Blast Simulator')).map(rel)
    expect(offenders).toEqual([])
  })
})

describe('search structural entries derive from PAGE_SEO (no drift, no fallout)', () => {
  const src = readFileSync(join(__dirname, '..', 'src', 'lib', 'search', 'index.ts'), 'utf8')
  it('base pages are mapped from PAGE_SEO', () => {
    expect(src).toContain('BASE_PATHS')
    expect(src).toContain('PAGE_SEO[p]')
  })
  it('the hand-written fallout claim is gone from the base entries', () => {
    // The old / and /methodology entries claimed the tool shows fallout.
    const base = src.slice(0, src.indexOf('const weaponPages'))
    expect(base.toLowerCase()).not.toContain('fallout')
  })
})
