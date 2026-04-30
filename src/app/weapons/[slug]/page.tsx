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
import {
  calculateFireball,
  calculateAirBlast,
  calculateThermalRadiation,
  calculateFallout,
} from '@/lib/calculations/blast'
import type { Bomb } from '@/lib/types'

const HIROSHIMA_YIELD_KT = 15

export function generateStaticParams() {
  return bombs
    .filter((b) => b.id !== 'custom')
    .map((b) => ({ slug: b.id }))
}

function findBomb(slug: string): Bomb | undefined {
  return bombs.find((b) => b.id === slug && b.id !== 'custom')
}

function formatYield(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} megatons`
  if (yieldKt >= 1) return `${yieldKt.toLocaleString()} kilotons`
  return `${(yieldKt * 1000).toLocaleString()} tons TNT`
}

function describeType(t: Bomb['type']): string {
  switch (t) {
    case 'fission': return 'pure fission'
    case 'fusion': return 'fusion-boosted'
    case 'thermonuclear': return 'thermonuclear (hydrogen bomb)'
    case 'conventional': return 'conventional high-explosive'
  }
}

function compareToHiroshima(yieldKt: number): string {
  const ratio = yieldKt / HIROSHIMA_YIELD_KT
  if (ratio < 0.001) return `${(1 / ratio).toFixed(0)}× smaller than the Hiroshima bomb`
  if (ratio < 1) return `${(1 / ratio).toFixed(1)}× smaller than the Hiroshima bomb`
  if (ratio < 1.5) return 'comparable in yield to the Hiroshima bomb'
  return `${ratio.toLocaleString(undefined, { maximumFractionDigits: 0 })}× more powerful than the Hiroshima bomb`
}

function relatedBombs(target: Bomb, n = 4): Bomb[] {
  return bombs
    .filter((b) => b.id !== target.id && b.id !== 'custom')
    .map((b) => ({
      bomb: b,
      score:
        (b.country === target.country ? 1 : 0) +
        (b.type === target.type ? 1 : 0) +
        // closer yields rank higher (log-scale distance)
        1 / (Math.abs(Math.log10(b.yield + 0.001) - Math.log10(target.yield + 0.001)) + 0.5),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.bomb)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const bomb = findBomb(slug)
  if (!bomb) return { title: 'Weapon Not Found' }

  const yieldText = formatYield(bomb.yield)
  const title = `${bomb.name} — ${yieldText} ${bomb.type} weapon | Blast Radius & Effects`
  const description =
    `${bomb.name} (${bomb.country}${bomb.year ? `, ${bomb.year}` : ''}, ${yieldText}). ${bomb.description}. ` +
    `See its computed fireball radius, blast zones, thermal radiation effects, and how it compares to Hiroshima.`

  return {
    title,
    description,
    alternates: { canonical: `/weapons/${bomb.id}` },
    openGraph: {
      title,
      description,
      url: `/weapons/${bomb.id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function WeaponDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const bomb = findBomb(slug)
  if (!bomb) notFound()

  const fireballAir = calculateFireball(bomb.yield, 'air')
  const fireballSurface = calculateFireball(bomb.yield, 'surface')
  const blastAir = calculateAirBlast(bomb.yield, 'air')
  const blastSurface = calculateAirBlast(bomb.yield, 'surface')
  const thermalAir = calculateThermalRadiation(bomb.yield, 'air')
  const thermalSurface = calculateThermalRadiation(bomb.yield, 'surface')
  const falloutSurface = calculateFallout(bomb.yield, 'surface')

  const yieldText = formatYield(bomb.yield)
  const typeText = describeType(bomb.type)
  const comparison = compareToHiroshima(bomb.yield)
  const related = relatedBombs(bomb, 4)
  const isNuclear = bomb.type !== 'conventional'

  const faqEntries = [
    {
      question: `How big is the ${bomb.name} blast radius?`,
      answer:
        `In an air burst, the ${bomb.name} produces a fireball roughly ${fireballAir.toFixed(2)} km in radius and a 5 PSI moderate-blast zone of about ${blastAir.moderate.toFixed(2)} km — the area in which most residential buildings would collapse. The 1 PSI light-damage radius extends to roughly ${blastAir.light.toFixed(2)} km, where windows shatter.`,
    },
    {
      question: `What is the yield of the ${bomb.name}?`,
      answer:
        `The ${bomb.name} has a yield of ${yieldText} of TNT equivalent. That is ${comparison}.`,
    },
    {
      question: `Is the ${bomb.name} bigger than the Hiroshima bomb?`,
      answer:
        `The Hiroshima bomb (Little Boy) had a yield of approximately 15 kilotons. The ${bomb.name} at ${yieldText} is ${comparison}.`,
    },
    ...(isNuclear
      ? [
          {
            question: `What thermal burn radius does the ${bomb.name} produce?`,
            answer:
              `Thermal radiation from the ${bomb.name} can cause 3rd-degree burns out to roughly ${thermalAir.thirdDegree.toFixed(2)} km and 2nd-degree burns out to ${thermalAir.secondDegree.toFixed(2)} km in an air burst. Surface bursts reduce these radii by approximately 40 percent due to ground absorption.`,
          },
        ]
      : []),
  ]

  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Weapons Database', url: '/weapons' },
    { name: bomb.name, url: `/weapons/${bomb.id}` },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-weapon-${bomb.id}`}
        schema={[
          articleSchema({
            url: `/weapons/${bomb.id}`,
            headline: `${bomb.name} — Yield, Blast Radius & Nuclear Effects`,
            description: bomb.description,
          }),
          faqPageSchema(faqEntries),
          breadcrumbSchema(breadcrumbs),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/weapons" className="hover:text-green-400">Weapons Database</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">{bomb.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">{bomb.name}</h1>
          <p className="text-lg text-green-300">
            {bomb.country}{bomb.year ? ` · ${bomb.year}` : ''} · {yieldText} · {typeText}
          </p>
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Overview</h2>
          <p className="text-green-300 mb-4">{bomb.description}.</p>
          <p className="text-green-300">
            With a yield of <strong className="text-yellow-400">{yieldText}</strong>, the {bomb.name} is{' '}
            <strong className="text-yellow-400">{comparison}</strong>. {isNuclear
              ? `As a ${typeText} weapon, it derives its energy from ${
                  bomb.type === 'fission' ? 'nuclear fission of uranium or plutonium' :
                  bomb.type === 'fusion' ? 'fusion-boosted fission reactions' :
                  'a fission primary that ignites a much larger fusion secondary stage'
                }.`
              : `It is a conventional high-explosive weapon that releases its energy through chemical reactions, not nuclear processes.`}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">{bomb.name} Blast Effects</h2>
          <p className="text-green-300 mb-4">
            The table below shows the calculated radius of each effect zone for an{' '}
            <strong className="text-yellow-400">air burst</strong> (optimal altitude, maximum blast spread)
            and a <strong className="text-yellow-400">surface burst</strong> (ground level, with massive
            radioactive fallout). Formulas are scaling laws from{' '}
            <Link href="/methodology" className="text-yellow-400 hover:underline">
              The Effects of Nuclear Weapons (Glasstone &amp; Dolan, 1977)
            </Link>.
          </p>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-green-300 text-sm md:text-base">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left py-2 text-yellow-400">Effect zone</th>
                  <th className="text-right py-2 text-yellow-400">Air burst</th>
                  <th className="text-right py-2 text-yellow-400">Surface burst</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">Fireball radius</td>
                  <td className="text-right">{fireballAir.toFixed(2)} km</td>
                  <td className="text-right">{fireballSurface.toFixed(2)} km</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">Severe blast (20 PSI)</td>
                  <td className="text-right">{blastAir.severe.toFixed(2)} km</td>
                  <td className="text-right">{blastSurface.severe.toFixed(2)} km</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">Moderate blast (5 PSI)</td>
                  <td className="text-right">{blastAir.moderate.toFixed(2)} km</td>
                  <td className="text-right">{blastSurface.moderate.toFixed(2)} km</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">Light blast (1 PSI)</td>
                  <td className="text-right">{blastAir.light.toFixed(2)} km</td>
                  <td className="text-right">{blastSurface.light.toFixed(2)} km</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">3rd-degree thermal burns</td>
                  <td className="text-right">{thermalAir.thirdDegree.toFixed(2)} km</td>
                  <td className="text-right">{thermalSurface.thirdDegree.toFixed(2)} km</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">2nd-degree thermal burns</td>
                  <td className="text-right">{thermalAir.secondDegree.toFixed(2)} km</td>
                  <td className="text-right">{thermalSurface.secondDegree.toFixed(2)} km</td>
                </tr>
                <tr>
                  <td className="py-2">Lethal fallout zone</td>
                  <td className="text-right">minimal</td>
                  <td className="text-right">~{falloutSurface.toFixed(1)} km</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-green-300/70 mt-3">
            All values are 1-D ground-distance estimates from the detonation point. Real-world effects
            depend on terrain, weather, and building construction.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Run the {bomb.name} on a City</h2>
          <p className="text-green-300 mb-4">
            Use the interactive simulator to detonate the {bomb.name} on any city worldwide. Click any
            location on the map to see the fireball, blast, and thermal radii overlaid on real geography
            with population-density-based casualty estimates.
          </p>
          <Link
            href={`/?bomb=${bomb.id}`}
            className="inline-block bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            🎯 Simulate {bomb.name}
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Related Weapons</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/weapons/${r.id}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-yellow-400">{r.name}</div>
                  <div className="text-sm text-green-300">
                    {r.country} · {formatYield(r.yield)}
                  </div>
                  <div className="text-xs text-green-300/70 mt-1">{r.description}</div>
                </Link>
              ))}
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
          Sources: <Link href="/sources" className="text-yellow-400 hover:underline">declassified DOE/DOD records, FAS, SIPRI, Glasstone &amp; Dolan</Link>.
          See the full <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons Database</Link> or learn about
          the <Link href="/methodology" className="text-yellow-400 hover:underline">scientific methodology</Link>.
        </section>
      </main>
    </div>
  )
}
