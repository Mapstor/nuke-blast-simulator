import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, itemListSchema, SITE_URL } from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { COMPARISONS, encodeComparisonSlug } from '@/lib/data/comparisons'

export const metadata: Metadata = {
  title: 'Nuclear Weapon Comparisons — Side-by-Side Yield, Blast Radius, Effects',
  description: 'Browse 30 head-to-head nuclear weapon comparisons. Tsar Bomba vs Castle Bravo, Little Boy vs Fat Man, modern strategic vs Hiroshima — yields, blast radii, casualties, and historical context.',
  alternates: { canonical: '/compare' },
}

function formatYield(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  if (yieldKt >= 1) return `${yieldKt.toLocaleString()} kt`
  return `${(yieldKt * 1000).toLocaleString()} tons TNT`
}

export default function CompareIndexPage() {
  const items = COMPARISONS
    .map(([x, y]) => {
      const a = bombs.find((b) => b.id === x)
      const b = bombs.find((b) => b.id === y)
      if (!a || !b) return null
      return { a, b, slug: encodeComparisonSlug(x, y) }
    })
    .filter((i): i is NonNullable<typeof i> => Boolean(i))

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-compare-index"
        schema={[
          itemListSchema(
            items.map((i) => ({
              name: `${i.a.name} vs ${i.b.name}`,
              url: `/compare/${i.slug}`,
              description: `${formatYield(i.a.yield)} vs ${formatYield(i.b.yield)}`,
            })),
            'Nuclear Weapon Comparisons',
          ),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Compare', url: '/compare' },
          ]),
        ]}
      />

      <main className="max-w-6xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Compare</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">Nuclear Weapon Comparisons</h1>
          <p className="text-lg text-green-300">
            {items.length} head-to-head comparisons between historical and modern nuclear weapons. Each
            page shows yields side-by-side, blast and thermal radii, casualty estimates at a reference
            urban density, and a clear answer to &quot;which weapon is bigger?&quot;.
          </p>
        </header>

        <section className="mb-10 grid sm:grid-cols-2 gap-4">
          {items.map((i) => (
            <Link
              key={i.slug}
              href={`/compare/${i.slug}`}
              className="block bg-black/50 border border-green-500/30 rounded-lg p-5 hover:border-green-400 transition"
            >
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span className="font-semibold text-yellow-400">{i.a.name}</span>
                <span className="text-green-300/60 text-sm">vs</span>
                <span className="font-semibold text-yellow-400">{i.b.name}</span>
              </div>
              <div className="text-sm text-green-300/80">
                {formatYield(i.a.yield)} ({i.a.country}) vs {formatYield(i.b.yield)} ({i.b.country})
              </div>
            </Link>
          ))}
        </section>

        <section className="text-sm text-green-300/70">
          See also: <Link href="/weapons" className="text-yellow-400 hover:underline">full Weapons Database</Link>{' '}
          (45+ entries) ·{' '}
          <Link href="/scenarios" className="text-yellow-400 hover:underline">scenarios on cities</Link> ·{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link>.
        </section>
      </main>
    </div>
  )
}
