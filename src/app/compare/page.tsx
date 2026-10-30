import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, itemListSchema, SITE_URL } from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { shortSpec } from '@/lib/data/weaponSpec'
import { COMPARISONS, encodeComparisonSlug } from '@/lib/data/comparisons'
import { Cite, Sources, createCitationsFrom } from '@/components/seo/Cite'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import type { Bomb } from '@/lib/types'

const PATH = '/compare'
export const metadata: Metadata = seoMetadata(PATH)

// NBS-016: the table figure is measure-aware (shortSpec) so a conventional
// bomb's explosive fill is never printed as a TNT yield; Chagai-I's 40 kt is
// shown as the claim it is, matching /weapons/chagai-i.
function yieldCell(b: Bomb): string {
  if (b.id === 'chagai-i') return '40 kt (claimed; ~9 kt seismic)'
  return shortSpec(b)
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

  // Every weapon by yield (descending). The compare tool pages cover the five
  // featured pairs; for any other weapon, open its page from here.
  const allWeapons = bombs.filter((b) => b.id !== 'custom').slice().sort((a, b) => b.yield - a.yield)

  // Pre-register every cited id (each weapon's sources) so all table [n] resolve
  // before <Sources> prints (D-36).
  const cites = createCitationsFrom(allWeapons.flatMap((b) => b.sources ?? []))

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-compare-index"
        schema={[
          itemListSchema(
            items.map((i) => ({
              name: `${i.a.name} vs ${i.b.name}`,
              url: `/compare/${i.slug}`,
              description: `${shortSpec(i.a)} vs ${shortSpec(i.b)}`,
            })),
            'Nuclear Weapon Comparisons',
          ),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Compare', url: PATH },
          ]),
        ]}
      />

      <main className="max-w-5xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Compare</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1(PATH)}</h1>
          <p className="text-lg text-green-300">
            Nuclear bombs side by side. Five featured head-to-head comparisons — with blast and thermal radii for
            an air burst — plus every weapon in the database ranked by yield.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Featured comparisons</h2>
          <div className="grid sm:grid-cols-2 gap-4">
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
                  {shortSpec(i.a)} ({i.a.country}) vs {shortSpec(i.b)} ({i.b.country})
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Every weapon by yield</h2>
          <p className="text-green-300 mb-4">
            All {allWeapons.length} weapons and tests in the database, largest yield first. Open any weapon for
            its profile, sources and — for nuclear weapons — its blast radii. Conventional entries show their
            explosive fill or TNT equivalent, not a nuclear yield.
          </p>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-4 overflow-x-auto">
            <table className="w-full text-green-300 text-sm">
              <thead>
                <tr className="border-b border-green-500/30 text-left">
                  <th className="py-2 pr-4 text-yellow-400">Weapon</th>
                  <th className="py-2 pr-4 text-yellow-400 text-right">Yield / fill</th>
                  <th className="py-2 pr-4 text-yellow-400">Country</th>
                  <th className="py-2 text-yellow-400">Year</th>
                </tr>
              </thead>
              <tbody>
                {allWeapons.map((b) => (
                  <tr key={b.id} className="border-b border-green-500/10">
                    <td className="py-2 pr-4">
                      <Link href={`/weapons/${b.id}`} className="text-yellow-400 hover:underline">{b.name}</Link>
                    </td>
                    <td className="py-2 pr-4 text-right">
                      {yieldCell(b)}{(b.sources ?? []).length ? <Cite c={cites} ids={(b.sources ?? []).join(';')} /> : null}
                    </td>
                    <td className="py-2 pr-4">{b.country}</td>
                    <td className="py-2">{b.year ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Sources c={cites} />

        <section className="text-sm text-green-300/70 mt-8">
          See also: <Link href="/weapons" className="text-yellow-400 hover:underline">full Weapons Database</Link> ·{' '}
          <Link href="/nuclear-blast-radius" className="text-yellow-400 hover:underline">blast radius calculator</Link> ·{' '}
          <Link href="/examples" className="text-yellow-400 hover:underline">cities</Link> ·{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link>.
        </section>
      </main>
    </div>
  )
}
