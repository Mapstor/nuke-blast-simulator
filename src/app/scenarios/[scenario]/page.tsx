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
import {
  FEATURED_BOMB_IDS,
  FEATURED_CITY_SLUGS,
  allScenarioSlugs,
  decodeScenarioSlug,
  encodeScenarioSlug,
} from '@/lib/data/scenarios'
import {
  calculateFireball,
  calculateAirBlast,
  calculateThermalRadiation,
  calculateFallout,
} from '@/lib/calculations/blast'

const HIROSHIMA_YIELD_KT = 15

export function generateStaticParams() {
  return allScenarioSlugs().map((scenario) => ({ scenario }))
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

function fatalitiesIn(radiusKm: number, density: number, mortality: number): number {
  const area = Math.PI * radiusKm * radiusKm
  return Math.round(area * density * mortality)
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

  const title = `${bomb.name} on ${city.name}: Blast Radius, Casualties & Effects`
  const description = `What if a ${formatYield(bomb.yield)} ${bomb.name} detonated over ${city.name}, ${city.country}? See the calculated fireball, blast zones, thermal radiation, and estimated casualties using ${city.name}'s population density of ${city.density.toLocaleString()}/km².`

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

  // Calculate effects for both burst types
  const fireballAir = calculateFireball(bomb.yield, 'air')
  const fireballSurface = calculateFireball(bomb.yield, 'surface')
  const blastAir = calculateAirBlast(bomb.yield, 'air')
  const blastSurface = calculateAirBlast(bomb.yield, 'surface')
  const thermalAir = calculateThermalRadiation(bomb.yield, 'air')
  const thermalSurface = calculateThermalRadiation(bomb.yield, 'surface')
  const falloutSurface = calculateFallout(bomb.yield, 'surface')

  // Casualty estimates (air burst, since that's the optimization target for max blast)
  const fireballDeaths = fatalitiesIn(fireballAir, city.density, 1.0)
  const severeDeaths = Math.max(0, fatalitiesIn(blastAir.severe, city.density, 0.98) - fireballDeaths)
  const moderateDeaths = Math.max(
    0,
    fatalitiesIn(blastAir.moderate, city.density, 0.5) - fatalitiesIn(blastAir.severe, city.density, 0.5),
  )
  const lightInjured = Math.max(
    0,
    fatalitiesIn(blastAir.light, city.density, 0.05) - fatalitiesIn(blastAir.moderate, city.density, 0.05),
  )
  const totalAffected = fatalitiesIn(blastAir.light, city.density, 1.0)
  const fatalitiesTotal = fireballDeaths + severeDeaths + moderateDeaths

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
        `In an air burst over ${city.name}, the ${bomb.name} (${yieldText}) would produce a fireball about ${fireballAir.toFixed(2)} km in radius. ` +
        `The 5 PSI moderate-blast zone — where most residential buildings collapse — would extend to ${blastAir.moderate.toFixed(2)} km. ` +
        `Light blast damage and shattered windows would reach ${blastAir.light.toFixed(2)} km. ` +
        `Given ${city.name}'s urban density (~${city.density.toLocaleString()}/km²), this scenario yields an estimated ${fatalitiesTotal.toLocaleString()} immediate fatalities and about ${lightInjured.toLocaleString()} additional injured.`,
    },
    {
      question: `How many people would die in ${city.name} from a ${bomb.name} strike?`,
      answer:
        `An air burst of the ${bomb.name} over ${city.name} could cause an estimated ${fatalitiesTotal.toLocaleString()} immediate fatalities and ${lightInjured.toLocaleString()} additional injuries. ` +
        `The fireball alone (radius ${fireballAir.toFixed(2)} km) would kill approximately ${fireballDeaths.toLocaleString()} people; the severe-blast zone (20 PSI, radius ${blastAir.severe.toFixed(2)} km) would add ${severeDeaths.toLocaleString()}; the moderate-blast zone (5 PSI, radius ${blastAir.moderate.toFixed(2)} km) would add ${moderateDeaths.toLocaleString()} more. ` +
        `Real numbers depend heavily on time of day, sheltering, weather, and altitude of detonation.`,
    },
    {
      question: `What is the blast radius of the ${bomb.name} on ${city.name}?`,
      answer:
        `For an air burst over ${city.name}: fireball ${fireballAir.toFixed(2)} km, severe blast (20 PSI) ${blastAir.severe.toFixed(2)} km, moderate blast (5 PSI) ${blastAir.moderate.toFixed(2)} km, light blast (1 PSI) ${blastAir.light.toFixed(2)} km. Thermal radiation causes 3rd-degree burns out to ${thermalAir.thirdDegree.toFixed(2)} km. ` +
        `A surface burst would shrink the blast radii by roughly 40 percent but generate massive radioactive fallout extending ~${falloutSurface.toFixed(0)} km from ground zero.`,
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
            headline: `${bomb.name} on ${city.name}: Blast Radius, Casualties & Effects`,
            description: `Detailed nuclear blast scenario for ${bomb.name} (${yieldText}) detonated over ${city.name}, ${city.country}. Calculated effects, casualties, and comparison context.`,
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
            This page calculates what would happen if the <strong className="text-yellow-400">{bomb.name}</strong>{' '}
            ({bomb.country}{bomb.year ? `, ${bomb.year}` : ''}) detonated over <strong className="text-yellow-400">{city.name}</strong>{' '}
            ({city.country}). {bomb.description}.
          </p>
          <p className="text-green-300 mb-4">
            {city.description} With an urban-core density of about{' '}
            <strong className="text-yellow-400">{city.density.toLocaleString()} people per km²</strong>, even a
            relatively small detonation over the city center would affect a large population.
          </p>
          <p className="text-green-300">
            The {bomb.name} delivers <strong className="text-yellow-400">{yieldText}</strong> of explosive yield —{' '}
            <strong className="text-yellow-400">{comparison}</strong>. The tables below show calculated effect
            radii for an air burst (optimized for blast spread) and a surface burst (which produces
            massive fallout).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">
            Air-burst effects ({bomb.name} over {city.name})
          </h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-green-300 text-sm md:text-base">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left py-2 text-yellow-400">Effect zone</th>
                  <th className="text-right py-2 text-yellow-400">Radius</th>
                  <th className="text-right py-2 text-yellow-400">Est. affected</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">Fireball (vaporization, 100% fatal)</td>
                  <td className="text-right">{fireballAir.toFixed(2)} km</td>
                  <td className="text-right">~{fireballDeaths.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">Severe blast (20 PSI, ~98% fatal)</td>
                  <td className="text-right">{blastAir.severe.toFixed(2)} km</td>
                  <td className="text-right">~{severeDeaths.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">Moderate blast (5 PSI, ~50% fatal)</td>
                  <td className="text-right">{blastAir.moderate.toFixed(2)} km</td>
                  <td className="text-right">~{moderateDeaths.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">Light blast (1 PSI, glass injuries)</td>
                  <td className="text-right">{blastAir.light.toFixed(2)} km</td>
                  <td className="text-right">~{lightInjured.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-green-500/10">
                  <td className="py-2">3rd-degree thermal burns</td>
                  <td className="text-right">{thermalAir.thirdDegree.toFixed(2)} km</td>
                  <td className="text-right text-green-300/70">—</td>
                </tr>
                <tr>
                  <td className="py-2">2nd-degree thermal burns</td>
                  <td className="text-right">{thermalAir.secondDegree.toFixed(2)} km</td>
                  <td className="text-right text-green-300/70">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-green-300/70 mt-3">
            Estimated total fatalities: <strong className="text-red-400">~{fatalitiesTotal.toLocaleString()}</strong>{' '}
            · Estimated total affected (inside 1 PSI light-blast radius):{' '}
            <strong className="text-yellow-400">~{totalAffected.toLocaleString()}</strong>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Surface-burst effects (with fallout)</h2>
          <p className="text-green-300 mb-4">
            A surface burst trades blast spread for radioactive fallout — much smaller blast radii but a
            large lethal fallout plume drifting downwind. This is what would happen if the {bomb.name} struck
            ground level rather than detonating optimally above {city.name}.
          </p>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-green-300 text-sm md:text-base">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left py-2 text-yellow-400">Effect zone</th>
                  <th className="text-right py-2 text-yellow-400">Radius (surface burst)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-500/10"><td className="py-2">Fireball</td><td className="text-right">{fireballSurface.toFixed(2)} km</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Severe blast (20 PSI)</td><td className="text-right">{blastSurface.severe.toFixed(2)} km</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Moderate blast (5 PSI)</td><td className="text-right">{blastSurface.moderate.toFixed(2)} km</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">Light blast (1 PSI)</td><td className="text-right">{blastSurface.light.toFixed(2)} km</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">3rd-degree thermal burns</td><td className="text-right">{thermalSurface.thirdDegree.toFixed(2)} km</td></tr>
                <tr><td className="py-2">Lethal fallout zone</td><td className="text-right">~{falloutSurface.toFixed(1)} km</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Run this scenario in the simulator</h2>
          <p className="text-green-300 mb-4">
            See the actual blast zones overlaid on a map of {city.name} with population-density-based
            casualty estimates updated in real time as you move the detonation point.
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
          Casualty math uses {city.name}&apos;s urban-core density and the scaling laws on the{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page.
          See <Link href={`/weapons/${bomb.id}`} className="text-yellow-400 hover:underline">{bomb.name} weapon details</Link>,
          the <Link href={`/examples/${city.slug}`} className="text-yellow-400 hover:underline">{city.name} scenario overview</Link>,
          or browse <Link href="/scenarios" className="text-yellow-400 hover:underline">all scenarios</Link>.
        </section>
      </main>
    </div>
  )
}
