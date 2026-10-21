// NBS-005: render citation + radius tokens inside data-string prose (blog
// articles, glossary definitions) where JSX can't be written directly.
//   {{c:id1;id2}}      → inline <Cite> superscript, registered in the collector
//   {{r:100:psi5}}     → engine radius text, e.g. "2.9 km" (never hard-coded)
import type { ReactNode } from 'react'
import { Cite, type Citations } from './Cite'
import { radiusKm, formatRadiusProse, type ProseEffect } from '@/lib/calculations/radius'

const TOKEN = /\{\{(c|r):([^}]+)\}\}/g

export function renderCited(text: string, c: Citations): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const kind = m[1]
    const payload = m[2]
    if (kind === 'c') {
      out.push(<Cite key={`c${key++}`} c={c} ids={payload} />)
    } else {
      const [y, eff] = payload.split(':')
      out.push(`${formatRadiusProse(radiusKm(Number(y), eff as ProseEffect))} km`)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
