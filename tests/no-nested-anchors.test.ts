import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// NBS-006 defect 2: no built HTML page may contain an <a> nested inside another
// <a>. Nested anchors are invalid HTML and throw React hydration error #418 (a
// <Cite> renders an <a>, so a <Cite> inside a card <Link> nests). Run
// `npm run build` before `npm test`.
const APP = join(__dirname, '..', '.next', 'server', 'app')

function walkHtml(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walkHtml(p, out)
    else if (e.endsWith('.html')) out.push(p)
  }
  return out
}

// Count open <a> tags that appear while another <a> is still open. The lookahead
// requires whitespace, '/', or '>' right after the 'a', so <abbr>, <area> and
// <address> are not matched; only real anchors are.
function nestedAnchorCount(rawHtml: string): number {
  // Drop HTML comments so an <a> token inside a React comment marker cannot be
  // miscounted (matches the removed-strings.test.ts normalization approach).
  const html = rawHtml.replace(/<!--[\s\S]*?-->/g, '')
  const tagRe = /<(\/?)a(?=[\s/>])[^>]*>/gi
  let depth = 0
  let nested = 0
  for (const m of html.matchAll(tagRe)) {
    if (m[1] === '/') {
      if (depth > 0) depth--
    } else {
      if (depth > 0) nested++
      depth++
    }
  }
  return nested
}

describe('no nested anchors in built HTML', () => {
  const files = walkHtml(APP)

  it('found prerendered HTML to scan (run `next build` first)', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it('no <a> is nested inside another <a> on any page', () => {
    const offenders: string[] = []
    for (const f of files) {
      const n = nestedAnchorCount(readFileSync(f, 'utf8'))
      if (n > 0) offenders.push(`${f.replace(APP, '')}: ${n} nested anchor(s)`)
    }
    expect(offenders).toEqual([])
  })
})
