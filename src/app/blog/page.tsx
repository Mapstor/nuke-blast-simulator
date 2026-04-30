import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, itemListSchema, SITE_URL } from '@/lib/seo/schemas'
import { articles, categoryLabel } from '@/lib/blog/articles'

export const metadata: Metadata = {
  title: 'Nuclear Weapons Blog — Physics, History, Effects, Doctrine',
  description: 'Long-form, sourced articles on how nuclear weapons work, the physics of blast effects, the Hiroshima and Tsar Bomba histories, modern arsenals, nuclear winter, and EMP.',
  alternates: { canonical: '/blog' },
}

const sorted = [...articles].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-blog"
        schema={[
          itemListSchema(
            sorted.map((a) => ({
              name: a.title,
              url: `/blog/${a.slug}`,
              description: a.description,
            })),
            'Nuclear Blast Simulator — Editorial Articles',
          ),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Blog', url: '/blog' },
          ]),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Blog</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">Nuclear Blast Simulator Blog</h1>
          <p className="text-lg text-green-300">
            Long-form, sourced editorial on nuclear weapons physics, history, effects, and doctrine. Each
            article is written for general educated audiences, cites authoritative sources, and links
            to relevant simulator pages and glossary entries.
          </p>
        </header>

        <section className="space-y-6">
          {sorted.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="block bg-black/50 border border-green-500/30 rounded-lg p-6 hover:border-green-400 transition"
            >
              <p className="text-xs uppercase tracking-wide text-green-300/70 mb-2">
                {categoryLabel(a.category)} · {a.readingMinutes} min read · {new Date(a.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h2 className="text-2xl font-semibold mb-2 text-yellow-400">{a.title}</h2>
              <p className="text-green-300">{a.description}</p>
            </Link>
          ))}
        </section>

        <section className="mt-10 text-sm text-green-300/70">
          See also: <Link href="/glossary" className="text-yellow-400 hover:underline">glossary</Link> ·{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> ·{' '}
          <Link href="/sources" className="text-yellow-400 hover:underline">sources</Link>.
        </section>
      </main>
    </div>
  )
}
