import type { Block, Section } from '@/lib/blog/types'

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p className="mb-4 text-green-300 leading-relaxed">{block.text}</p>
    case 'h3':
      return <h3 className="mt-6 mb-3 text-xl font-semibold text-yellow-400">{block.text}</h3>
    case 'list':
      return (
        <ul className="mb-4 list-disc list-inside space-y-2 text-green-300">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote className="my-6 border-l-4 border-yellow-400 bg-yellow-900/10 p-4 text-green-300 italic">
          {block.text}
          {block.cite ? <footer className="mt-2 text-sm text-green-300/70 not-italic">— {block.cite}</footer> : null}
        </blockquote>
      )
  }
}

export function ArticleBody({ sections }: { sections: Section[] }) {
  return (
    <article className="prose-lg">
      {sections.map((section, i) => (
        <section key={i} className="mb-10">
          {section.heading ? (
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-400">{section.heading}</h2>
          ) : null}
          {section.body.map((block, j) => (
            <RenderBlock key={j} block={block} />
          ))}
        </section>
      ))}
    </article>
  )
}
