import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { PrevNext, type PrevNextItem } from '@/components/nav/PrevNext'
import { Byline } from '@/components/Byline'
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { effectRadiiKm, formatRadiusKm, EFFECTS_FLAGS } from '@/lib/calculations/effects'
import { Cite, Sources, createCitations, ENGINE_SOURCE_IDS } from '@/components/seo/Cite'
import type { Bomb } from '@/lib/types'

const HIROSHIMA_YIELD_KT = 15

// Linearize the weapons list by yield ascending so prev/next moves through
// the database from smallest to largest.
const sequencedBombs = bombs
  .filter((b) => b.id !== 'custom')
  .slice()
  .sort((a, b) => a.yield - b.yield)

function pageNeighbors(slug: string): { prev: PrevNextItem; next: PrevNextItem } {
  const i = sequencedBombs.findIndex((b) => b.id === slug)
  const fmt = (b: Bomb): PrevNextItem => ({
    label: b.name,
    href: `/weapons/${b.id}`,
    sublabel: `${b.yield >= 1000 ? `${(b.yield / 1000).toFixed(1)} Mt` : `${b.yield} kt`} · ${b.country}`,
  })
  return {
    prev: i > 0 ? fmt(sequencedBombs[i - 1]) : null,
    next: i >= 0 && i < sequencedBombs.length - 1 ? fmt(sequencedBombs[i + 1]) : null,
  }
}

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
  const isNuclear = bomb.type !== 'conventional'
  const showEffects = isNuclear || EFFECTS_FLAGS.CONVENTIONAL_EFFECTS

  const title = showEffects
    ? `${bomb.name} — ${yieldText} ${bomb.type} weapon | Blast Radius & Effects`
    : `${bomb.name} — ${yieldText} conventional weapon | Specifications & History`
  const description = showEffects
    ? `${bomb.name} (${bomb.country}${bomb.year ? `, ${bomb.year}` : ''}, ${yieldText}). ${bomb.description}. ` +
      `See its computed fireball radius, blast overpressure zones, thermal burn radii (air burst), and how it compares to Hiroshima.`
    : `${bomb.name} (${bomb.country}${bomb.year ? `, ${bomb.year}` : ''}, ${yieldText}). ${bomb.description}. ` +
      `Specifications, yield, and historical context for this conventional weapon.`

  return {
    title,
    description,
    alternates: { canonical: `/weapons/${bomb.id}` },
    openGraph: { title, description, url: `/weapons/${bomb.id}`, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
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

  const yieldText = formatYield(bomb.yield)
  const typeText = describeType(bomb.type)
  const comparison = compareToHiroshima(bomb.yield)
  const related = relatedBombs(bomb, 4)
  const isNuclear = bomb.type !== 'conventional'
  // Nuclear scaling laws only apply to nuclear weapons. Conventional weapons
  // keep their spec content but show no effect radii (EFFECTS_FLAGS).
  const showEffects = isNuclear || EFFECTS_FLAGS.CONVENTIONAL_EFFECTS
  const r = showEffects ? effectRadiiKm(bomb.yield) : null
  const cites = createCitations()
  const weaponSourceIds = bomb.sources ?? []

  const faqEntries = [
    ...(r
      ? [
          {
            question: `How big is the ${bomb.name} blast radius?`,
            answer:
              `In an air burst at optimum height, the ${bomb.name} produces a fireball roughly ${formatRadiusKm(r.fireball)} km in radius and a 5 psi moderate-blast zone of about ${formatRadiusKm(r.overpressure5psi)} km — the area in which most residential buildings would collapse. The 1 psi light-damage radius extends to roughly ${formatRadiusKm(r.overpressure1psi)} km, where windows shatter.`,
          },
        ]
      : []),
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
    ...(r
      ? [
          {
            question: `What thermal burn radius does the ${bomb.name} produce?`,
            answer:
              `In an air burst at optimum height, thermal radiation from the ${bomb.name} can cause 3rd-degree burns out to roughly ${formatRadiusKm(r.thermal3rdDegree)} km, 2nd-degree burns to ${formatRadiusKm(r.thermal2ndDegree)} km, and 1st-degree burns to ${formatRadiusKm(r.thermal1stDegree)} km.`,
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
            headline: `${bomb.name} — Yield, ${showEffects ? 'Blast Radius & Nuclear Effects' : 'Specifications & History'}`,
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
          <Byline className="mt-2" />
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Overview</h2>
          <p className="text-green-300 mb-4">{bomb.description}.</p>
          <p className="text-green-300">
            With a yield of <strong className="text-yellow-400">{yieldText}</strong>
            <Cite c={cites} ids={weaponSourceIds.join(';')} />, the {bomb.name} is{' '}
            <strong className="text-yellow-400">{comparison}</strong>. {isNuclear
              ? `As a ${typeText} weapon, it derives its energy from ${
                  bomb.type === 'fission' ? 'nuclear fission of uranium or plutonium' :
                  bomb.type === 'fusion' ? 'fusion-boosted fission reactions' :
                  'a fission explosion that ignites fusion fuel, releasing on average roughly equal energy from fission and fusion'
                }.`
              : `It is a conventional high-explosive weapon that releases its energy through chemical reactions, not nuclear processes.`}
            {' '}<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5" />
          </p>
        </section>

        {r ? (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">{bomb.name} Blast Effects</h2>
            <p className="text-green-300 mb-4">
              The table below shows the calculated radius of each effect zone for an{' '}
              <strong className="text-yellow-400">air burst at optimum height</strong>. Values are scaling
              laws from{' '}
              <Link href="/methodology" className="text-yellow-400 hover:underline">
                The Effects of Nuclear Weapons (Glasstone &amp; Dolan, 1977)
              </Link>{' '}
              and the published effects scaling table<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />.
            </p>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 overflow-x-auto">
              <table className="w-full text-green-300 text-sm md:text-base">
                <thead>
                  <tr className="border-b border-green-500/30">
                    <th className="text-left py-2 text-yellow-400">Effect zone</th>
                    <th className="text-right py-2 text-yellow-400">Radius (air burst)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Fireball radius</td>
                    <td className="text-right">{formatRadiusKm(r.fireball) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Severe blast (20 psi)</td>
                    <td className="text-right">{formatRadiusKm(r.overpressure20psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Moderate blast (5 psi)</td>
                    <td className="text-right">{formatRadiusKm(r.overpressure5psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Light blast (1 psi)</td>
                    <td className="text-right">{formatRadiusKm(r.overpressure1psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">3rd-degree thermal burns</td>
                    <td className="text-right">{formatRadiusKm(r.thermal3rdDegree) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">2nd-degree thermal burns</td>
                    <td className="text-right">{formatRadiusKm(r.thermal2ndDegree) + ' km'}</td>
                  </tr>
                  <tr>
                    <td className="py-2">1st-degree thermal burns</td>
                    <td className="text-right">{formatRadiusKm(r.thermal1stDegree) + ' km'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-green-300/70 mt-3">
              All radii assume an air burst at optimum height and are 1-D ground-distance estimates from the
              detonation point. Real-world effects depend on terrain, weather, and building construction.
              Casualty and fallout estimates are not shown pending a verified population and fallout model.
            </p>
          </section>
        ) : (
          <section className="mb-10 bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r">
            <h2 className="text-xl font-semibold mb-3 text-yellow-400">Effect radii not shown</h2>
            <p className="text-green-300">
              The {bomb.name} is a conventional (non-nuclear) weapon. The nuclear blast and thermal scaling
              laws this site uses do not apply to chemical explosives, so no effect radii are shown. See the{' '}
              <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page.
            </p>
          </section>
        )}

        {isNuclear && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Run the {bomb.name} on a City</h2>
            <p className="text-green-300 mb-4">
              Use the interactive simulator to detonate the {bomb.name} on any city worldwide. Click any
              location on the map to see the fireball, blast, and thermal radii (air burst at optimum height)
              overlaid on real geography.
            </p>
            <Link
              href={`/?bomb=${bomb.id}`}
              className="inline-block bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              🎯 Simulate {bomb.name}
            </Link>
          </section>
        )}

        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Related Weapons</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {related.map((rb) => (
                <Link
                  key={rb.id}
                  href={`/weapons/${rb.id}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-yellow-400">{rb.name}</div>
                  <div className="text-sm text-green-300">
                    {rb.country} · {formatYield(rb.yield)}
                  </div>
                  <div className="text-xs text-green-300/70 mt-1">{rb.description}</div>
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

        <Sources c={cites} extraIds={[...(r ? ENGINE_SOURCE_IDS : []), ...weaponSourceIds]} />

        <section className="text-sm text-green-300/70 mt-6">
          See the full <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons Database</Link>,
          all <Link href="/sources" className="text-yellow-400 hover:underline">data sources</Link>, or the{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">scientific methodology</Link>.
        </section>

        <PrevNext {...pageNeighbors(bomb.id)} label="Previous and next weapon by yield" />
      </main>
    </div>
  )
}
