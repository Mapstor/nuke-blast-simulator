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
import { presetLocations } from '@/lib/data/cities'
import { PrevNext, type PrevNextItem } from '@/components/nav/PrevNext'
import {
  FEATURED_BOMB_IDS,
  FEATURED_CITY_SLUGS,
  allScenarioSlugs,
  decodeScenarioSlug,
  encodeScenarioSlug,
} from '@/lib/data/scenarios'
import { effectRadiiKm, formatRadiusKm } from '@/lib/calculations/effects'

const HIROSHIMA_YIELD_KT = 15

export function generateStaticParams() {
  return allScenarioSlugs().map((scenario) => ({ scenario }))
}

// Linear sequence: for each featured bomb, all featured cities in order.
const scenarioSequence = allScenarioSlugs()

function scenarioNeighbors(slug: string): { prev: PrevNextItem; next: PrevNextItem } {
  const i = scenarioSequence.indexOf(slug)
  function fmt(s: string): PrevNextItem {
    const decoded = decodeScenarioSlug(s)
    if (!decoded) return null
    const b = bombs.find((x) => x.id === decoded.bombId)
    const c = presetLocations.find((x) => x.slug === decoded.citySlug)
    if (!b || !c) return null
    return {
      label: `${b.name} on ${c.name}`,
      href: `/scenarios/${s}`,
      sublabel: `${b.yield >= 1000 ? `${(b.yield / 1000).toFixed(1)} Mt` : `${b.yield} kt`} · ${c.country}`,
    }
  }
  return {
    prev: i > 0 ? fmt(scenarioSequence[i - 1]) : null,
    next: i >= 0 && i < scenarioSequence.length - 1 ? fmt(scenarioSequence[i + 1]) : null,
  }
}

function loadScenario(slug: string) {
  const decoded = decodeScenarioSlug(slug)
  if (!decoded) return null
  const bomb = bombs.find((b) => b.id === decoded.bombId)
  const city = presetLocations.find((c) => c.slug === decoded.citySlug)
  if (!bomb || !city) return null
  return { bomb, city }
}

function formatYield(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  return `${yieldKt.toLocaleString()} kt`
}

function compareToHiroshima(yieldKt: number): string {
  const r = yieldKt / HIROSHIMA_YIELD_KT
  if (r < 0.5) return `${(1 / r).toFixed(1)}× smaller than the Hiroshima bomb`
  if (r < 1.5) return 'comparable in yield to the Hiroshima bomb'
  return `${r.toLocaleString(undefined, { maximumFractionDigits: 0 })}× more powerful than the Hiroshima bomb`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scenario: string }>
}): Promise<Metadata> {
  const { scenario } = await params
  const data = loadScenario(scenario)
  if (!data) return { title: 'Scenario Not Found' }
  const { bomb, city } = data

  const title = `${bomb.name} on ${city.name}: Blast Radius & Effects`
  const description = `What if a ${formatYield(bomb.yield)} ${bomb.name} air-burst over ${city.name}, ${city.country}? See the calculated fireball, blast overpressure, and thermal burn radii (air burst at optimum height).`

  return {
    title,
    description,
    alternates: { canonical: `/scenarios/${scenario}` },
    openGraph: { title, description, url: `/scenarios/${scenario}`, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ scenario: string }>
}) {
  const { scenario } = await params
  const data = loadScenario(scenario)
  if (!data) notFound()
  const { bomb, city } = data

  // Effect radii — air burst at optimum height (the engine's only mode).
  const r = effectRadiiKm(bomb.yield)

  const yieldText = formatYield(bomb.yield)
  const comparison = compareToHiroshima(bomb.yield)

  // Cross-links: same bomb on other featured cities, same city with other featured bombs
  const otherCitiesForBomb = FEATURED_CITY_SLUGS
    .filter((s) => s !== city.slug)
    .map((s) => presetLocations.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 6)

  const otherBombsForCity = FEATURED_BOMB_IDS
    .filter((id) => id !== bomb.id)
    .map((id) => bombs.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .slice(0, 6)

  const faqEntries = [
    {
      question: `What would happen if the ${bomb.name} detonated over ${city.name}?`,
      answer:
        `In an air burst at optimum height over ${city.name}, the ${bomb.name} (${yieldText}) would produce a fireball about ${formatRadiusKm(r.fireball)} km in radius. ` +
        `The 5 psi moderate-blast zone — where most residential buildings collapse — would extend to ${formatRadiusKm(r.overpressure5psi)} km. ` +
        `Light blast damage and shattered windows would reach ${formatRadiusKm(r.overpressure1psi)} km, and 3rd-degree thermal burns ${formatRadiusKm(r.thermal3rdDegree)} km.`,
    },
    {
      question: `What is the blast radius of the ${bomb.name} on ${city.name}?`,
      answer:
        `For an air burst at optimum height over ${city.name}: fireball ${formatRadiusKm(r.fireball)} km, severe blast (20 psi) ${formatRadiusKm(r.overpressure20psi)} km, moderate blast (5 psi) ${formatRadiusKm(r.overpressure5psi)} km, light blast (1 psi) ${formatRadiusKm(r.overpressure1psi)} km. Thermal radiation causes 3rd-degree burns out to ${formatRadiusKm(r.thermal3rdDegree)} km.`,
    },
    {
      question: `Is the ${bomb.name} bigger than the bomb that hit Hiroshima?`,
      answer: `The Hiroshima bomb (Little Boy) had a yield of about 15 kilotons. The ${bomb.name} at ${yieldText} is ${comparison}.`,
    },
  ]

  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Scenarios', url: '/scenarios' },
    { name: `${bomb.name} on ${city.name}`, url: `/scenarios/${scenario}` },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-scenario-${scenario}`}
        schema={[
          articleSchema({
            url: `/scenarios/${scenario}`,
            headline: `${bomb.name} on ${city.name}: Blast Radius & Effects`,
            description: `Nuclear blast scenario for ${bomb.name} (${yieldText}) air-burst over ${city.name}, ${city.country}. Calculated effect radii and comparison context.`,
          }),
          faqPageSchema(faqEntries),
          breadcrumbSchema(breadcrumbs),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/scenarios" className="hover:text-green-400">Scenarios</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">{bomb.name} on {city.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">
            {bomb.name} on {city.name}
          </h1>
          <p className="text-lg text-green-300">
            {yieldText} {bomb.type} weapon · {city.country} · Population {city.population.toLocaleString()} · Density {city.density.toLocaleString()}/km²
          </p>
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">About this scenario</h2>
          <p className="text-green-300 mb-4">
            This page calculates the effect radii if the <strong className="text-yellow-400">{bomb.name}</strong>{' '}
            ({bomb.country}{bomb.year ? `, ${bomb.year}` : ''}) air-burst over <strong className="text-yellow-400">{city.name}</strong>{' '}
            ({city.country}). {bomb.description}.
          </p>
          <p className="text-green-300 mb-4">
            {city.description}
          </p>
          <p className="text-green-300">
            The {bomb.name} delivers <strong className="text-yellow-400">{yieldText}</strong> of explosive yield —{' '}
            <strong className="text-yellow-400">{comparison}</strong>. The table below shows calculated effect
            radii for an <strong className="text-yellow-400">air burst at optimum height</strong>. Casualty and
            fallout estimates are not shown pending a verified population and fallout model.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">
            Air-burst effect radii ({bomb.name} over {city.name})
          </h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-green-300 text-sm md:text-base">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left py-2 text-yellow-400">Effect zone</th>
                  <th className="text-right py-2 text-yellow-400">Radius (air burst)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-500/10"><td className="py-2">Fireball</td><td className="text-right">{formatRadiusKm(r.fireball) + ' km'}</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Severe blast (20 psi)</td><td className="text-right">{formatRadiusKm(r.overpressure20psi) + ' km'}</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Moderate blast (5 psi)</td><td className="text-right">{formatRadiusKm(r.overpressure5psi) + ' km'}</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Light blast (1 psi)</td><td className="text-right">{formatRadiusKm(r.overpressure1psi) + ' km'}</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">3rd-degree thermal burns</td><td className="text-right">{formatRadiusKm(r.thermal3rdDegree) + ' km'}</td></tr>
                <tr><td className="py-2">2nd-degree thermal burns</td><td className="text-right">{formatRadiusKm(r.thermal2ndDegree) + ' km'}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-green-300/70 mt-3">
            All radii assume an air burst at optimum height. Surface-burst, fallout, radiation and casualty
            outputs are withdrawn until verified against a primary-source model.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Run this scenario in the simulator</h2>
          <p className="text-green-300 mb-4">
            See the blast zones overlaid on a map of {city.name}, updated in real time as you move the
            detonation point.
          </p>
          <Link
            href={`/?bomb=${bomb.id}&lat=${city.lat}&lng=${city.lng}`}
            className="inline-block bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            🎯 Open this scenario on the map
          </Link>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">{bomb.name} on other cities</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {otherCitiesForBomb.map((c) => (
              <Link
                key={c.slug}
                href={`/scenarios/${encodeScenarioSlug(bomb.id, c.slug)}`}
                className="block bg-black/50 border border-green-500/30 rounded-lg p-3 hover:border-green-400 transition"
              >
                <div className="font-semibold text-yellow-400">{c.name}</div>
                <div className="text-xs text-green-300/70">{c.country}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Other weapons on {city.name}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {otherBombsForCity.map((b) => (
              <Link
                key={b.id}
                href={`/scenarios/${encodeScenarioSlug(b.id, city.slug)}`}
                className="block bg-black/50 border border-green-500/30 rounded-lg p-3 hover:border-green-400 transition"
              >
                <div className="font-semibold text-yellow-400">{b.name}</div>
                <div className="text-xs text-green-300/70">{formatYield(b.yield)} · {b.country}</div>
              </Link>
            ))}
          </div>
        </section>

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
          Radii use the scaling laws on the{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page.
          See <Link href={`/weapons/${bomb.id}`} className="text-yellow-400 hover:underline">{bomb.name} weapon details</Link>,
          the <Link href={`/examples/${city.slug}`} className="text-yellow-400 hover:underline">{city.name} scenario overview</Link>,
          or browse <Link href="/scenarios" className="text-yellow-400 hover:underline">all scenarios</Link>.
        </section>

        <PrevNext {...scenarioNeighbors(scenario)} label="Previous and next scenario" />
      </main>
    </div>
  )
}
