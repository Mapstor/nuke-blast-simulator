// NBS-005 server-side citation system. No client JS.
//
// A page creates a per-render collector, drops <Cite c={cites} ids="a;b" />
// inline (renders superscript [n] links), and ends with <Sources c={cites} />
// which prints the numbered list (first-use order) linking each attribution to
// its deep URL. Data-driven pages (blog/glossary) pass their ids via
// <Sources c={cites} extraIds={[...]} /> instead of inline <Cite>.
import { SOURCES } from '@/lib/data/sources'

export type Citations = { order: string[]; map: Map<string, number> }

export function createCitations(): Citations {
  return { order: [], map: new Map() }
}

// NBS-013: pre-register a page's full set of cited source ids, in DOM order,
// BEFORE any section renders. React does not guarantee that sibling server
// components mutate the shared collector in document order, so a late-rendering
// <Cite> could otherwise register a number after <Sources> already printed its
// list — producing a citation that points at no listed source. Pre-registering
// makes every [n] resolve: inline <Cite> calls then only look the id up.
export function createCitationsFrom(ids: string[]): Citations {
  const c = createCitations()
  for (const id of ids) if (id) registerId(c, id)
  return c
}

function registerId(c: Citations, id: string): number {
  const existing = c.map.get(id)
  if (existing) return existing
  c.order.push(id)
  const n = c.order.length
  c.map.set(id, n)
  return n
}

export function Cite({ c, ids }: { c: Citations; ids: string }) {
  const list = ids.split(';').map((s) => s.trim()).filter(Boolean)
  if (!list.length) return null
  const nums = list.map((id) => registerId(c, id))
  return (
    <sup className="ml-0.5 text-[0.7em] font-normal text-yellow-400/90">
      [
      {nums.map((n, i) => (
        <span key={n}>
          <a href={`#source-${n}`} className="hover:underline">{n}</a>
          {i < nums.length - 1 ? ', ' : ''}
        </span>
      ))}
      ]
    </sup>
  )
}

export function Sources({ c, extraIds, className = '' }: { c: Citations; extraIds?: string[]; className?: string }) {
  if (extraIds) for (const id of extraIds) registerId(c, id)
  if (!c.order.length) return null
  return (
    <section
      aria-labelledby="sources-heading"
      className={`mt-12 pt-6 border-t border-green-500/30 text-sm ${className}`}
    >
      <h2 id="sources-heading" className="text-lg font-semibold text-green-400 mb-3">Sources</h2>
      <ol className="space-y-2 text-green-300/80">
        {c.order.map((id, i) => {
          const s = SOURCES[id]
          return (
            <li key={id} id={`source-${i + 1}`} className="scroll-mt-24 leading-snug">
              <span className="text-green-400/60 mr-1">{i + 1}.</span>
              {s ? (
                <a href={s.url} rel="nofollow noopener" className="text-yellow-400 hover:underline">{s.attribution}</a>
              ) : (
                <span className="text-red-400">[unknown source: {id}]</span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

// Engine sources every page that shows computed radii must list.
export const ENGINE_SOURCE_IDS = ['effects-fireball', 'effects-blast-thermal'] as const
