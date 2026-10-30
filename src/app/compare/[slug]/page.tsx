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
import { Byline } from '@/components/Byline'
import {
  COMPARISONS,
  decodeComparisonSlug,
  allComparisonSlugs,
  encodeComparisonSlug,
} from '@/lib/data/comparisons'
import { effectRadiiKm, formatRadiusKm, EFFECTS_FLAGS, type EffectRadiiKm } from '@/lib/calculations/effects'
import { Cite, Sources, createCitations, ENGINE_SOURCE_IDS } from '@/components/seo/Cite'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import { specLine, shortSpec, hiroshimaMultiple, HIROSHIMA_YIELD_KT } from '@/lib/data/weaponSpec'
import type { Bomb } from '@/lib/types'

// One decimal below 10×, whole at/above (NBS-016 rounding rule).
function fmtMultiple(x: number): string {
  return x.toLocaleString(undefined, { maximumFractionDigits: x < 10 ? 1 : 0 })
}

// Hiroshima comparison phrase; "the Hiroshima bomb" for Little Boy itself
// (never the circular "1×").
function hiroshimaPhrase(b: Bomb): string {
  if (b.id === 'little-boy') return 'the Hiroshima bomb'
  return `${hiroshimaMultiple(b.yield / HIROSHIMA_YIELD_KT)} than the Hiroshima bomb`
}

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

function describeType(t: Bomb['type']): string {
  switch (t) {
    case 'fission': return 'pure fission'
    case 'fusion': return 'fusion-boosted'
    case 'thermonuclear': return 'thermonuclear'
    case 'conventional': return 'conventional'
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = loadComparison(slug)
  if (!data) return { title: 'Comparison Not Found' }
  return seoMetadata(`/compare/${slug}`, 'article')
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

  // Effect radii apply only when BOTH weapons are nuclear. If either is a
  // conventional weapon, the radii table is withdrawn (EFFECTS_FLAGS).
  const bothNuclear = a.type !== 'conventional' && b.type !== 'conventional'
  const showEffects = bothNuclear || EFFECTS_FLAGS.CONVENTIONAL_EFFECTS
  const rA: EffectRadiiKm | null = showEffects ? effectRadiiKm(a.yield) : null
  const rB: EffectRadiiKm | null = showEffects ? effectRadiiKm(b.yield) : null

  const cites = createCitations()

  const otherComparisons = COMPARISONS
    .filter(([x, y]) => `${x}-vs-${y}` !== slug)
    .filter(([x, y]) => x === a.id || y === a.id || x === b.id || y === b.id)
    .slice(0, 6)

  const faqEntries = [
    {
      question: `Is the ${a.name} bigger than the ${b.name}?`,
      answer:
        ratio >= 1
          ? `Yes. The ${a.name} (${specLine(a)}) is ${fmtMultiple(factor)}× more powerful than the ${b.name} (${specLine(b)}) by yield.`
          : `No. The ${b.name} (${specLine(b)}) is ${fmtMultiple(factor)}× more powerful than the ${a.name} (${specLine(a)}) by yield.`,
    },
    ...(rA && rB
      ? [
          {
            question: `What is the blast radius of the ${a.name} compared to the ${b.name}?`,
            answer:
              `For an air burst at optimum height, the ${a.name} produces a 5 psi moderate-blast radius of ${formatRadiusKm(rA.overpressure5psi)} km, versus ${formatRadiusKm(rB.overpressure5psi)} km for the ${b.name}. ` +
              `Severe blast (20 psi): ${formatRadiusKm(rA.overpressure20psi)} km vs ${formatRadiusKm(rB.overpressure20psi)} km. ` +
              `3rd-degree thermal burns: ${formatRadiusKm(rA.thermal3rdDegree)} km vs ${formatRadiusKm(rB.thermal3rdDegree)} km.`,
          },
        ]
      : []),
    {
      question: `How do the ${a.name} and ${b.name} compare to the Hiroshima bomb?`,
      answer:
        `The Hiroshima bomb (Little Boy) was about 15 kt. The ${a.name} is ${hiroshimaPhrase(a)}. The ${b.name} is ${hiroshimaPhrase(b)}.`,
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
            headline: pageH1(`/compare/${slug}`),
            description: `Side-by-side comparison of the ${a.name} and the ${b.name} — yields, blast and thermal radii (air burst), and historical context.`,
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
            {pageH1(`/compare/${slug}`)}
          </h1>
          <p className="text-lg text-green-300">Nuclear weapon side-by-side comparison</p>
          <Byline className="mt-2" />
        </header>

        <section className="mb-10 grid md:grid-cols-2 gap-4">
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-yellow-400">{a.name}</h2>
            <p className="text-sm text-green-300/80 mb-2">
              {a.country}{a.year ? ` · ${a.year}` : ''} · {describeType(a.type)}
            </p>
            <p className="text-3xl font-bold text-red-400 mb-2">{specLine(a)}</p>
            <p className="text-sm text-green-300">{a.description}. <Cite c={cites} ids={(a.sources ?? []).join(';')} /></p>
          </div>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-yellow-400">{b.name}</h2>
            <p className="text-sm text-green-300/80 mb-2">
              {b.country}{b.year ? ` · ${b.year}` : ''} · {describeType(b.type)}
            </p>
            <p className="text-3xl font-bold text-red-400 mb-2">{specLine(b)}</p>
            <p className="text-sm text-green-300">{b.description}. <Cite c={cites} ids={(b.sources ?? []).join(';')} /></p>
          </div>
        </section>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3 text-green-400">Verdict</h2>
          <p className="text-green-300">
            The <strong className="text-yellow-400">{moreP.name}</strong> is{' '}
            <strong className="text-red-400">
              {fmtMultiple(factor)}× more powerful
            </strong>{' '}
            than the <strong className="text-yellow-400">{lessP.name}</strong> by yield. Both weapons are
            detailed below{showEffects ? ', with side-by-side blast and thermal radii for an air burst' : ''}.
          </p>
        </section>

        {rA && rB ? (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Blast &amp; thermal radii (air burst)</h2>
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
                  <tr className="border-b border-green-500/10"><td className="py-2">Yield</td><td className="text-right">{specLine(a)}</td><td className="text-right">{specLine(b)}</td></tr>
                  <tr className="border-b border-green-500/10"><td className="py-2">Fireball radius</td><td className="text-right">{formatRadiusKm(rA.fireball) + ' km'}</td><td className="text-right">{formatRadiusKm(rB.fireball) + ' km'}</td></tr>
                  <tr className="border-b border-green-500/10"><td className="py-2">Severe blast (20 psi)</td><td className="text-right">{formatRadiusKm(rA.overpressure20psi) + ' km'}</td><td className="text-right">{formatRadiusKm(rB.overpressure20psi) + ' km'}</td></tr>
                  <tr className="border-b border-green-500/10"><td className="py-2">Moderate blast (5 psi)</td><td className="text-right">{formatRadiusKm(rA.overpressure5psi) + ' km'}</td><td className="text-right">{formatRadiusKm(rB.overpressure5psi) + ' km'}</td></tr>
                  <tr className="border-b border-green-500/10"><td className="py-2">Light blast (1 psi)</td><td className="text-right">{formatRadiusKm(rA.overpressure1psi) + ' km'}</td><td className="text-right">{formatRadiusKm(rB.overpressure1psi) + ' km'}</td></tr>
                  <tr className="border-b border-green-500/10"><td className="py-2">3rd-degree thermal burns</td><td className="text-right">{formatRadiusKm(rA.thermal3rdDegree) + ' km'}</td><td className="text-right">{formatRadiusKm(rB.thermal3rdDegree) + ' km'}</td></tr>
                  <tr><td className="py-2">2nd-degree thermal burns</td><td className="text-right">{formatRadiusKm(rA.thermal2ndDegree) + ' km'}</td><td className="text-right">{formatRadiusKm(rB.thermal2ndDegree) + ' km'}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-green-300/70 mt-3">
              Air burst at optimum height, computed by the site&apos;s effects engine. <Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} /> Casualty and fallout estimates are withdrawn pending a verified model.
            </p>
          </section>
        ) : (
          <section className="mb-10 bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r">
            <h2 className="text-xl font-semibold mb-3 text-yellow-400">Effect-radius comparison unavailable</h2>
            <p className="text-green-300">
              One of these is a conventional (non-nuclear) weapon, so a blast-radius comparison would mix two
              incompatible physical models. This page compares yields and historical context only. See the{' '}
              <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page.
            </p>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Hiroshima reference</h2>
          <p className="text-green-300">
            The Hiroshima bomb (Little Boy) had a yield of approximately 15 kilotons. <Cite c={cites} ids="us-doe-nnsa-nevada-field-office-united-states-nu" /> The {a.name} is{' '}
            <strong className="text-yellow-400">{hiroshimaPhrase(a)}</strong>. The {b.name} is{' '}
            <strong className="text-yellow-400">{hiroshimaPhrase(b)}</strong>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Run them on the simulator</h2>
          <div className="flex flex-wrap gap-3">
            {a.type !== 'conventional' && (
              <Link href={`/?bomb=${a.id}`} className="inline-block bg-green-500 text-black px-5 py-3 rounded font-semibold hover:bg-green-600 transition">
                🎯 Simulate {a.name}
              </Link>
            )}
            {b.type !== 'conventional' && (
              <Link href={`/?bomb=${b.id}`} className="inline-block bg-green-500 text-black px-5 py-3 rounded font-semibold hover:bg-green-600 transition">
                🎯 Simulate {b.name}
              </Link>
            )}
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
                      {shortSpec(xb)} vs {shortSpec(yb)}
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

        <Sources c={cites} />

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
