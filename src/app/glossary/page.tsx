import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  breadcrumbSchema,
  definedTermSetSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { glossary, categoryLabel, type GlossaryCategory } from '@/lib/data/glossary'

export const metadata: Metadata = {
  title: 'Nuclear Weapons Glossary — 50 Defined Terms (Yield, Fallout, MIRV, MAD)',
  description: 'A clear, sourced glossary of nuclear weapons terminology — yield, fireball, overpressure, fallout, MIRV, ICBM, MAD, NPT and more. Each term has a one-sentence answer plus a deeper explanation.',
  alternates: { canonical: '/glossary' },
}

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
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-glossary"
        schema={[
          definedTermSetSchema({
            name: 'Nuclear Weapons Glossary',
            description: 'A sourced glossary of nuclear weapons effects, physics, doctrine, and arms-control terminology.',
            url: '/glossary',
          }),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Glossary', url: '/glossary' },
          ]),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Glossary</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">Nuclear Weapons Glossary</h1>
          <p className="text-lg text-green-300">
            {glossary.length} defined terms covering nuclear weapon effects, physics, doctrine, and arms
            control. Each term has a one-sentence answer suitable for citation, plus a deeper explanation.
          </p>
        </header>

        {categoryOrder.map((cat) => {
          const entries = groupedByCategory.get(cat)
          if (!entries || entries.length === 0) return null
          return (
            <section key={cat} id={cat} className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">{categoryLabel(cat)}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {entries.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/glossary/${e.slug}`}
                    className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                  >
                    <div className="font-semibold text-yellow-400">{e.term}</div>
                    <div className="text-xs text-green-300/70 mt-1">{e.short}</div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <section className="text-sm text-green-300/70">
          See also: <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> ·{' '}
          <Link href="/sources" className="text-yellow-400 hover:underline">sources</Link> ·{' '}
          <Link href="/weapons" className="text-yellow-400 hover:underline">weapons database</Link>.
        </section>
      </main>
    </div>
  )
}
