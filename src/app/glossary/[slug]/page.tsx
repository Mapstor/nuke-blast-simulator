import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  definedTermSchema,
  breadcrumbSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { findGlossaryEntry, glossary, categoryLabel } from '@/lib/data/glossary'
import { PrevNext, type PrevNextItem } from '@/components/nav/PrevNext'

const CATEGORY_ORDER = ['effects', 'weapons', 'physics', 'doctrine', 'treaty'] as const

const sequencedGlossary = [...glossary].sort((a, b) => {
  const ai = CATEGORY_ORDER.indexOf(a.category)
  const bi = CATEGORY_ORDER.indexOf(b.category)
  if (ai !== bi) return ai - bi
  return a.term.localeCompare(b.term)
})

function termNeighbors(slug: string): { prev: PrevNextItem; next: PrevNextItem } {
  const i = sequencedGlossary.findIndex((g) => g.slug === slug)
  const fmt = (g: typeof sequencedGlossary[number]): PrevNextItem => ({
    label: g.term,
    href: `/glossary/${g.slug}`,
    sublabel: categoryLabel(g.category),
  })
  return {
    prev: i > 0 ? fmt(sequencedGlossary[i - 1]) : null,
    next: i >= 0 && i < sequencedGlossary.length - 1 ? fmt(sequencedGlossary[i + 1]) : null,
  }
}

export function generateStaticParams() {
  return glossary.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = findGlossaryEntry(slug)
  if (!entry) return { title: 'Term Not Found' }

  const title = `${entry.term} — Nuclear Weapons Glossary`
  const description = entry.short

  return {
    title,
    description,
    alternates: { canonical: `/glossary/${entry.slug}` },
    openGraph: { title, description, url: `/glossary/${entry.slug}`, type: 'article' },
  }
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = findGlossaryEntry(slug)
  if (!entry) notFound()

  const related = (entry.related ?? [])
    .map((s) => glossary.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-glossary-${entry.slug}`}
        schema={[
          definedTermSchema({
            url: `/glossary/${entry.slug}`,
            term: entry.term,
            definition: entry.short,
          }),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Glossary', url: '/glossary' },
            { name: entry.term, url: `/glossary/${entry.slug}` },
          ]),
        ]}
      />

      <main className="max-w-3xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/glossary" className="hover:text-green-400">Glossary</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">{entry.term}</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs uppercase tracking-wide text-green-300/70 mb-2">
            {categoryLabel(entry.category)}
          </p>
          <h1 className="text-4xl font-bold mb-3 text-green-400">{entry.term}</h1>
          <p className="text-lg text-yellow-400">{entry.short}</p>
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <p className="text-green-300 text-base leading-relaxed">{entry.long}</p>
        </section>

        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Related terms</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/glossary/${r.slug}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-yellow-400">{r.term}</div>
                  <div className="text-xs text-green-300/70 mt-1">{r.short}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="text-sm text-green-300/70">
          See the full <Link href="/glossary" className="text-yellow-400 hover:underline">Nuclear Weapons Glossary</Link>.
        </section>

        <PrevNext {...termNeighbors(entry.slug)} label="Previous and next term" />
      </main>
    </div>
  )
}
