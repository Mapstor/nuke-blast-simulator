import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { PrevNext, type PrevNextItem } from '@/components/nav/PrevNext'
import {
  COMPARISONS,
  decodeComparisonSlug,
  allComparisonSlugs,
  encodeComparisonSlug,
} from '@/lib/data/comparisons'
import {
  calculateFireball,
  calculateAirBlast,
  calculateThermalRadiation,
} from '@/lib/calculations/blast'
import type { Bomb } from '@/lib/types'

const HIROSHIMA_YIELD_KT = 15
const REFERENCE_DENSITY = 8000 // representative dense urban density per km²

export function generateStaticParams() {
  return allComparisonSlugs().map((slug) => ({ slug }))
}

const compareSequence = COMPARISONS.map(([a, b]) => encodeComparisonSlug(a, b))

function compareNeighbors(slug: string): { prev: PrevNextItem; next: PrevNextItem } {
  const i = compareSequence.indexOf(slug)
  function fmt(s: string): PrevNextItem {
    const d = decodeComparisonSlug(s)
    if (!d) return null
    const ba = bombs.find((x) => x.id === d.a)
    const bb = bombs.find((x) => x.id === d.b)
    if (!ba || !bb) return null
    return { label: `${ba.name} vs ${bb.name}`, href: `/compare/${s}` }
  }
  return {
    prev: i > 0 ? fmt(compareSequence[i - 1]) : null,
    next: i >= 0 && i < compareSequence.length - 1 ? fmt(compareSequence[i + 1]) : null,
  }
}

function loadComparison(slug: string): { a: Bomb; b: Bomb } | null {
  const decoded = decodeComparisonSlug(slug)
  if (!decoded) return null
  const a = bombs.find((x) => x.id === decoded.a)
  const b = bombs.find((x) => x.id === decoded.b)
  if (!a || !b) return null
  return { a, b }
}

function formatYield(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  if (yieldKt >= 1) return `${yieldKt.toLocaleString()} kt`
  return `${(yieldKt * 1000).toLocaleString()} tons TNT`
}

function describeType(t: Bomb['type']): string {
  switch (t) {
    case 'fission': return 'pure fission'
    case 'fusion': return 'fusion-boosted'
    case 'thermonuclear': return 'thermonuclear'
    case 'conventional': return 'conventional'
  }
}

function fatalitiesIn(radiusKm: number, density: number, mortality: number): number {
  const area = Math.PI * radiusKm * radiusKm
  return Math.round(area * density * mortality)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = loadComparison(slug)
  if (!data) return { title: 'Comparison Not Found' }
  const { a, b } = data

  const title = `${a.name} vs ${b.name}: Nuclear Weapon Comparison`
  const description = `Side-by-side comparison of the ${a.name} (${formatYield(a.yield)}) and ${b.name} (${formatYield(b.yield)}). Yields, blast radii, thermal effects, historical context, and which weapon is more powerful.`

  return {
    title,
    description,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: { title, description, url: `/compare/${slug}`, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = loadComparison(slug)
  if (!data) notFound()
  const { a, b } = data

  const ratio = a.yield / b.yield
  const moreP = ratio >= 1 ? a : b
  const lessP = ratio >= 1 ? b : a
  const factor = ratio >= 1 ? ratio : 1 / ratio

  const aFB = calculateFireball(a.yield, 'air')
  const bFB = calculateFireball(b.yield, 'air')
  const aBL = calculateAirBlast(a.yield, 'air')
  const bBL = calculateAirBlast(b.yield, 'air')
  const aTH = calculateThermalRadiation(a.yield, 'air')
  const bTH = calculateThermalRadiation(b.yield, 'air')

  // Casualty comparison at a reference urban density
  const aDeaths =
    fatalitiesIn(aFB, REFERENCE_DENSITY, 1.0) +
    Math.max(0, fatalitiesIn(aBL.severe, REFERENCE_DENSITY, 0.98) - fatalitiesIn(aFB, REFERENCE_DENSITY, 1.0)) +
    Math.max(0, fatalitiesIn(aBL.moderate, REFERENCE_DENSITY, 0.5) - fatalitiesIn(aBL.severe, REFERENCE_DENSITY, 0.5))
  const bDeaths =
    fatalitiesIn(bFB, REFERENCE_DENSITY, 1.0) +
    Math.max(0, fatalitiesIn(bBL.severe, REFERENCE_DENSITY, 0.98) - fatalitiesIn(bFB, REFERENCE_DENSITY, 1.0)) +
    Math.max(0, fatalitiesIn(bBL.moderate, REFERENCE_DENSITY, 0.5) - fatalitiesIn(bBL.severe, REFERENCE_DENSITY, 0.5))

  const hiroshimaA = a.yield / HIROSHIMA_YIELD_KT
  const hiroshimaB = b.yield / HIROSHIMA_YIELD_KT

  const otherComparisons = COMPARISONS
    .filter(([x, y]) => `${x}-vs-${y}` !== slug)
    .filter(([x, y]) => x === a.id || y === a.id || x === b.id || y === b.id)
    .slice(0, 6)

  const faqEntries = [
    {
      question: `Is the ${a.name} bigger than the ${b.name}?`,
      answer:
        ratio >= 1
          ? `Yes. The ${a.name} (${formatYield(a.yield)}) is ${factor.toLocaleString(undefined, { maximumFractionDigits: 1 })}× more powerful than the ${b.name} (${formatYield(b.yield)}).`
          : `No. The ${b.name} (${formatYield(b.yield)}) is ${factor.toLocaleString(undefined, { maximumFractionDigits: 1 })}× more powerful than the ${a.name} (${formatYield(a.yield)}).`,
    },
    {
      question: `What is the blast radius of the ${a.name} compared to the ${b.name}?`,
      answer:
        `For an air burst, the ${a.name} produces a 5 PSI moderate-blast radius of ${aBL.moderate.toFixed(2)} km, versus ${bBL.moderate.toFixed(2)} km for the ${b.name}. ` +
        `Severe blast (20 PSI): ${aBL.severe.toFixed(2)} km vs ${bBL.severe.toFixed(2)} km. ` +
        `3rd-degree thermal burns: ${aTH.thirdDegree.toFixed(2)} km vs ${bTH.thirdDegree.toFixed(2)} km.`,
    },
    {
      question: `How many people would die from a ${a.name} compared to a ${b.name}?`,
      answer:
        `Detonated over a typical dense city center (${REFERENCE_DENSITY.toLocaleString()} people/km²), the ${a.name} would cause an estimated ${aDeaths.toLocaleString()} immediate fatalities. ` +
        `The ${b.name} would cause an estimated ${bDeaths.toLocaleString()}. ` +
        `Real numbers depend on time of day, sheltering, weather, and altitude of detonation.`,
    },
    {
      question: `How do the ${a.name} and ${b.name} compare to the Hiroshima bomb?`,
      answer:
        `The ${a.name} is ${
          hiroshimaA >= 1
            ? `${hiroshimaA.toLocaleString(undefined, { maximumFractionDigits: 0 })}× more powerful`
            : `${(1 / hiroshimaA).toFixed(1)}× smaller`
        } than the Hiroshima bomb (Little Boy, 15 kt). The ${b.name} is ${
          hiroshimaB >= 1
            ? `${hiroshimaB.toLocaleString(undefined, { maximumFractionDigits: 0 })}× more powerful`
            : `${(1 / hiroshimaB).toFixed(1)}× smaller`
        } than the Hiroshima bomb.`,
    },
  ]

  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Compare', url: '/compare' },
    { name: `${a.name} vs ${b.name}`, url: `/compare/${slug}` },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-compare-${slug}`}
        schema={[
          articleSchema({
            url: `/compare/${slug}`,
            headline: `${a.name} vs ${b.name}: Nuclear Weapon Comparison`,
            description: `Side-by-side comparison of the ${a.name} and the ${b.name} — yields, blast radii, thermal effects, and historical context.`,
          }),
          faqPageSchema(faqEntries),
          breadcrumbSchema(breadcrumbs),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/compare" className="hover:text-green-400">Compare</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">{a.name} vs {b.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">
            {a.name} vs {b.name}
          </h1>
          <p className="text-lg text-green-300">Nuclear weapon side-by-side comparison</p>
        </header>

        <section className="mb-10 grid md:grid-cols-2 gap-4">
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-yellow-400">{a.name}</h2>
            <p className="text-sm text-green-300/80 mb-2">
              {a.country}{a.year ? ` · ${a.year}` : ''} · {describeType(a.type)}
            </p>
            <p className="text-3xl font-bold text-red-400 mb-2">{formatYield(a.yield)}</p>
            <p className="text-sm text-green-300">{a.description}.</p>
          </div>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-yellow-400">{b.name}</h2>
            <p className="text-sm text-green-300/80 mb-2">
              {b.country}{b.year ? ` · ${b.year}` : ''} · {describeType(b.type)}
            </p>
            <p className="text-3xl font-bold text-red-400 mb-2">{formatYield(b.yield)}</p>
            <p className="text-sm text-green-300">{b.description}.</p>
          </div>
        </section>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3 text-green-400">Verdict</h2>
          <p className="text-green-300">
            The <strong className="text-yellow-400">{moreP.name}</strong> is{' '}
            <strong className="text-red-400">
              {factor.toLocaleString(undefined, { maximumFractionDigits: factor < 10 ? 1 : 0 })}× more powerful
            </strong>{' '}
            than the <strong className="text-yellow-400">{lessP.name}</strong> by yield. {moreP.name === a.name
              ? `Both weapons are described in detail below, with side-by-side blast and thermal radii, casualty estimates at a reference urban density, and historical context.`
              : `Both weapons are described in detail below, with side-by-side blast and thermal radii, casualty estimates at a reference urban density, and historical context.`}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Blast & thermal effects (air burst)</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-green-300 text-sm md:text-base">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left py-2 text-yellow-400">Effect zone</th>
                  <th className="text-right py-2 text-yellow-400">{a.name}</th>
                  <th className="text-right py-2 text-yellow-400">{b.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-500/10"><td className="py-2">Yield</td><td className="text-right">{formatYield(a.yield)}</td><td className="text-right">{formatYield(b.yield)}</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Fireball radius</td><td className="text-right">{aFB.toFixed(2)} km</td><td className="text-right">{bFB.toFixed(2)} km</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Severe blast (20 PSI)</td><td className="text-right">{aBL.severe.toFixed(2)} km</td><td className="text-right">{bBL.severe.toFixed(2)} km</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Moderate blast (5 PSI)</td><td className="text-right">{aBL.moderate.toFixed(2)} km</td><td className="text-right">{bBL.moderate.toFixed(2)} km</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Light blast (1 PSI)</td><td className="text-right">{aBL.light.toFixed(2)} km</td><td className="text-right">{bBL.light.toFixed(2)} km</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">3rd-degree thermal burns</td><td className="text-right">{aTH.thirdDegree.toFixed(2)} km</td><td className="text-right">{bTH.thirdDegree.toFixed(2)} km</td></tr>
                <tr><td className="py-2">2nd-degree thermal burns</td><td className="text-right">{aTH.secondDegree.toFixed(2)} km</td><td className="text-right">{bTH.secondDegree.toFixed(2)} km</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Casualty estimate (dense urban target)</h2>
          <p className="text-green-300 mb-4">
            Estimated immediate fatalities if each weapon air-bursts over a city center with a population
            density of about {REFERENCE_DENSITY.toLocaleString()} per km² (representative of dense urban
            cores like Manhattan or central Paris):
          </p>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-sm text-green-300/70">{a.name}</div>
                <div className="text-3xl font-bold text-red-400">~{aDeaths.toLocaleString()}</div>
                <div className="text-xs text-green-300/70 mt-1">immediate fatalities</div>
              </div>
              <div>
                <div className="text-sm text-green-300/70">{b.name}</div>
                <div className="text-3xl font-bold text-red-400">~{bDeaths.toLocaleString()}</div>
                <div className="text-xs text-green-300/70 mt-1">immediate fatalities</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-green-300/70 mt-3">
            Real casualties depend strongly on time of day, sheltering, weather, and altitude of detonation.
            See the <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page
            for the underlying formulas.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Hiroshima reference</h2>
          <p className="text-green-300">
            The Hiroshima bomb (Little Boy) had a yield of approximately 15 kilotons. The {a.name} is{' '}
            <strong className="text-yellow-400">
              {hiroshimaA >= 1
                ? `${hiroshimaA.toLocaleString(undefined, { maximumFractionDigits: 0 })}× more powerful`
                : `${(1 / hiroshimaA).toFixed(1)}× smaller`}
            </strong>{' '}
            than the Hiroshima bomb. The {b.name} is{' '}
            <strong className="text-yellow-400">
              {hiroshimaB >= 1
                ? `${hiroshimaB.toLocaleString(undefined, { maximumFractionDigits: 0 })}× more powerful`
                : `${(1 / hiroshimaB).toFixed(1)}× smaller`}
            </strong>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Run them on the simulator</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={`/?bomb=${a.id}`} className="inline-block bg-green-500 text-black px-5 py-3 rounded font-semibold hover:bg-green-600 transition">
              🎯 Simulate {a.name}
            </Link>
            <Link href={`/?bomb=${b.id}`} className="inline-block bg-green-500 text-black px-5 py-3 rounded font-semibold hover:bg-green-600 transition">
              🎯 Simulate {b.name}
            </Link>
          </div>
        </section>

        {otherComparisons.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Related comparisons</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherComparisons.map(([x, y]) => {
                const xb = bombs.find((bm) => bm.id === x)
                const yb = bombs.find((bm) => bm.id === y)
                if (!xb || !yb) return null
                return (
                  <Link
                    key={`${x}-vs-${y}`}
                    href={`/compare/${x}-vs-${y}`}
                    className="block bg-black/50 border border-green-500/30 rounded-lg p-3 hover:border-green-400 transition"
                  >
                    <div className="font-semibold text-yellow-400 text-sm">{xb.name} vs {yb.name}</div>
                    <div className="text-xs text-green-300/70">
                      {formatYield(xb.yield)} vs {formatYield(yb.yield)}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">FAQ</h2>
          <div className="space-y-3">
            {faqEntries.map((qa) => (
              <details key={qa.question} className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-yellow-400">{qa.question}</summary>
                <p className="mt-3 text-green-300">{qa.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="text-sm text-green-300/70">
          See <Link href={`/weapons/${a.id}`} className="text-yellow-400 hover:underline">{a.name} details</Link>,{' '}
          <Link href={`/weapons/${b.id}`} className="text-yellow-400 hover:underline">{b.name} details</Link>, or
          browse <Link href="/compare" className="text-yellow-400 hover:underline">all comparisons</Link>.
        </section>

        <PrevNext {...compareNeighbors(slug)} label="Previous and next comparison" />
      </main>
    </div>
  )
}
