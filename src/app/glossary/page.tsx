import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, definedTermSetSchema, SITE_URL } from '@/lib/seo/schemas'
import { glossary, categoryLabel, type GlossaryCategory } from '@/lib/data/glossary'
import { KEPT_GLOSSARY_SLUGS } from '@/lib/data/livePages'
import { renderCited } from '@/components/seo/citeText'
import { Sources, createCitations } from '@/components/seo/Cite'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'

const PATH = '/glossary'
export const metadata: Metadata = seoMetadata(PATH)

// NBS-008: the glossary is now one page holding every term as a cited definition
// with an id anchor (so /glossary#<term> resolves). The 13 terms with measured
// demand also keep their own /glossary/<slug> page and link to it from here.
const standalone = new Set(KEPT_GLOSSARY_SLUGS)

const groupedByCategory = (() => {
  const map = new Map<GlossaryCategory, typeof glossary>()
  for (const e of glossary) {
    const arr = map.get(e.category) ?? []
    arr.push(e)
    map.set(e.category, arr)
  }
  for (const [, arr] of map) arr.sort((a, b) => a.term.localeCompare(b.term))
  return map
})()
const categoryOrder: GlossaryCategory[] = ['effects', 'weapons', 'physics', 'doctrine', 'treaty']

export default function GlossaryIndexPage() {
  const cites = createCitations()
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-glossary"
        schema={[
          definedTermSetSchema({
            name: 'Nuclear Weapons Glossary',
            description: 'A sourced glossary of nuclear weapons effects, physics, doctrine, and arms-control terminology.',
            url: PATH,
          }),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Glossary', url: PATH },
          ]),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Glossary</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1(PATH)}</h1>
          <p className="text-lg text-green-300">
            {glossary.length} defined terms covering nuclear weapon effects, physics, doctrine and arms
            control. Each term has a cited definition you can link to directly.
          </p>
          <nav aria-label="Glossary categories" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {categoryOrder.filter((c) => groupedByCategory.get(c)?.length).map((cat) => (
              <a key={cat} href={`#${cat}`} className="text-yellow-400 hover:underline">{categoryLabel(cat)}</a>
            ))}
          </nav>
        </header>

        {categoryOrder.map((cat) => {
          const entries = groupedByCategory.get(cat)
          if (!entries || entries.length === 0) return null
          return (
            <section key={cat} id={cat} className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">{categoryLabel(cat)}</h2>
              <dl className="space-y-5">
                {entries.map((e) => (
                  <div key={e.slug} id={e.slug} className="scroll-mt-24 border-b border-green-500/10 pb-4">
                    <dt className="font-semibold text-yellow-400">
                      {standalone.has(e.slug) ? (
                        <Link href={`/glossary/${e.slug}`} className="hover:underline">{e.term}</Link>
                      ) : (
                        e.term
                      )}
                    </dt>
                    <dd className="text-sm text-green-300/90 mt-1 leading-relaxed">
                      {renderCited(e.long, cites)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )
        })}

        <Sources c={cites} />

        <section className="mt-10 text-sm text-green-300/70">
          See also: <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> ·{' '}
          <Link href="/sources" className="text-yellow-400 hover:underline">sources</Link> ·{' '}
          <Link href="/weapons" className="text-yellow-400 hover:underline">weapons database</Link>.
        </section>
      </main>
    </div>
  )
}
