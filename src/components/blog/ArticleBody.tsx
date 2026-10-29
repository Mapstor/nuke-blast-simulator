import type { Block, Section } from '@/lib/blog/types'
import { renderCited } from '@/components/seo/citeText'
import type { Citations } from '@/components/seo/Cite'
import { CONTENT_DIAGRAMS } from '@/components/diagrams/ContentDiagrams'

function RenderBlock({ block, c }: { block: Block; c: Citations }) {
  switch (block.type) {
    case 'p':
      return <p className="mb-4 text-green-300 leading-relaxed">{renderCited(block.text, c)}</p>
    case 'h3':
      return <h3 className="mt-6 mb-3 text-xl font-semibold text-yellow-400">{renderCited(block.text, c)}</h3>
    case 'list':
      return (
        <ul className="mb-4 list-disc list-inside space-y-2 text-green-300">
          {block.items.map((it, i) => (
            <li key={i}>{renderCited(it, c)}</li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote className="my-6 border-l-4 border-yellow-400 bg-yellow-900/10 p-4 text-green-300 italic">
          {renderCited(block.text, c)}
          {block.cite ? <footer className="mt-2 text-sm text-green-300/70 not-italic">— {block.cite}</footer> : null}
        </blockquote>
      )
    case 'svg': {
      const Diagram = CONTENT_DIAGRAMS[block.id]
      if (!Diagram) return null
      return (
        <figure className="my-6">
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
            <Diagram />
          </div>
          {block.caption ? (
            <figcaption className="mt-2 text-sm text-green-300/70 leading-snug">{renderCited(block.caption, c)}</figcaption>
          ) : null}
        </figure>
      )
    }
    case 'table':
      return (
        <figure className="my-6">
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-4 overflow-x-auto">
            <table className="w-full text-green-300 text-sm md:text-base">
              <thead>
                <tr className="border-b border-green-500/30">
                  {block.columns.map((col, i) => (
                    <th key={i} className="text-left py-2 pr-4 text-yellow-400 align-bottom">{renderCited(col, c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-b border-green-500/10 align-top">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 pr-4">{renderCited(cell, c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption ? (
            <figcaption className="mt-2 text-sm text-green-300/70 leading-snug">{renderCited(block.caption, c)}</figcaption>
          ) : null}
        </figure>
      )
  }
}

export function ArticleBody({ sections, cites }: { sections: Section[]; cites: Citations }) {
  return (
    <article className="prose-lg">
      {sections.map((section, i) => (
        <section key={i} className="mb-10">
          {section.heading ? (
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-400">{section.heading}</h2>
          ) : null}
          {section.body.map((block, j) => (
            <RenderBlock key={j} block={block} c={cites} />
          ))}
        </section>
      ))}
    </article>
  )
}
