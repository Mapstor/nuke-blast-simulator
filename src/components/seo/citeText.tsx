// NBS-005: render citation + radius tokens inside data-string prose (blog
// articles, glossary definitions) where JSX can't be written directly.
//   {{c:id1;id2}}      → inline <Cite> superscript, registered in the collector
//   {{r:100:psi5}}     → engine radius text, e.g. "2.9 km" (never hard-coded)
import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Block } from '@/lib/blog/types'
import { Cite, type Citations } from './Cite'
import { radiusKm, formatRadiusProse, type ProseEffect } from '@/lib/calculations/radius'

// {{c:ids}} citation, {{r:y:eff}} engine radius, or a markdown link [text](href)
// (NBS-014, used in data-table cells so a country name links to its page).
const TOKEN = /\{\{(c|r):([^}]+)\}\}|\[([^\]]+)\]\(([^)]+)\)/g

// NBS-013: collect the citation ids ({{c:a;b}}) from a text, in order, so a
// page can pre-register them before render (see createCitationsFrom) and no
// citation can point at a source that is not in the Sources list.
export function collectCiteTokens(text: string): string[] {
  const ids: string[] = []
  for (const m of text.matchAll(/\{\{c:([^}]+)\}\}/g)) {
    for (const id of m[1].split(';')) { const t = id.trim(); if (t) ids.push(t) }
  }
  return ids
}

// NBS-014: collect every cited id from a Section[] body in DOM order, so a page
// (blog article or an upgraded glossary page) can pre-register them before
// render — no citation can point past the Sources list.
export function collectSectionCiteIds(sections: { heading?: string; body: Block[] }[]): string[] {
  const ids: string[] = []
  for (const s of sections) {
    for (const b of s.body) {
      if (b.type === 'p' || b.type === 'h3' || b.type === 'quote') ids.push(...collectCiteTokens(b.text))
      else if (b.type === 'list') for (const it of b.items) ids.push(...collectCiteTokens(it))
      else if (b.type === 'svg') { if (b.caption) ids.push(...collectCiteTokens(b.caption)) }
      else if (b.type === 'table') {
        for (const col of b.columns) ids.push(...collectCiteTokens(col))
        for (const row of b.rows) for (const cell of row) ids.push(...collectCiteTokens(cell))
        if (b.caption) ids.push(...collectCiteTokens(b.caption))
      }
    }
  }
  return ids
}

// NBS-014: resolve a FAQ answer to plain text for the FAQPage schema —
// {{r:y:eff}} becomes the engine radius ("X km"), {{c:ids}} citation markers are
// dropped, and [label](href) links collapse to their label. The schema must
// carry no markup or tokens.
export function faqSchemaText(text: string): string {
  return text
    .replace(/\{\{c:[^}]+\}\}/g, '')
    .replace(/\{\{r:([^}]+)\}\}/g, (_m, p: string) => {
      const [y, eff] = p.split(':')
      return `${formatRadiusProse(radiusKm(Number(y), eff as ProseEffect))} km`
    })
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function renderCited(text: string, c: Citations): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const kind = m[1]
    if (kind === 'c') {
      out.push(<Cite key={`c${key++}`} c={c} ids={m[2]} />)
    } else if (kind === 'r') {
      const [y, eff] = m[2].split(':')
      out.push(`${formatRadiusProse(radiusKm(Number(y), eff as ProseEffect))} km`)
    } else {
      // markdown link [text](href)
      const label = m[3]
      const href = m[4]
      out.push(
        href.startsWith('http') ? (
          <a key={`a${key++}`} href={href} rel="nofollow noopener" className="text-yellow-400 hover:underline">{label}</a>
        ) : (
          <Link key={`a${key++}`} href={href} className="text-yellow-400 hover:underline">{label}</Link>
        ),
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
