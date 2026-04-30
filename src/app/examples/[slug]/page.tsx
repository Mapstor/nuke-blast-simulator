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
import { presetLocations, type PresetLocation } from '@/lib/data/cities'
import { bombs } from '@/lib/data/bombs'
import {
  calculateFireball,
  calculateAirBlast,
  calculateThermalRadiation,
} from '@/lib/calculations/blast'

// The 4 representative weapons we run for each city scenario.
const SCENARIO_BOMB_IDS = ['little-boy', 'w76', 'castle-bravo', 'tsar-bomba'] as const

export function generateStaticParams() {
  return presetLocations.map((c) => ({ slug: c.slug }))
}

function findCity(slug: string): PresetLocation | undefined {
  return presetLocations.find((c) => c.slug === slug)
}

function formatYield(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  return `${yieldKt.toLocaleString()} kt`
}

function estimateFatalities(radiusKm: number, density: number, mortality: number): number {
  const area = Math.PI * radiusKm * radiusKm
  return Math.round(area * density * mortality)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const city = findCity(slug)
  if (!city) return { title: 'City Not Found' }

  const title = `What if a Nuclear Bomb Hit ${city.name}? Blast Radius & Casualties`
  const description = `Detailed nuclear blast simulation for ${city.name}, ${city.country}. See blast radii, thermal burn zones, and population impact for Little Boy, W76, Castle Bravo, and Tsar Bomba detonated over ${city.name}.`

  return {
    title,
    description,
    alternates: { canonical: `/examples/${city.slug}` },
    openGraph: {
      title,
      description,
      url: `/examples/${city.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function CityExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const city = findCity(slug)
  if (!city) notFound()

  const scenarios = SCENARIO_BOMB_IDS
    .map((id) => bombs.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .map((bomb) => {
      const fireball = calculateFireball(bomb.yield, 'air')
      const blast = calculateAirBlast(bomb.yield, 'air')
      const thermal = calculateThermalRadiation(bomb.yield, 'air')

      const fireballDeaths = estimateFatalities(fireball, city.density, 1.0)
      const severeDeaths = estimateFatalities(blast.severe, city.density, 0.98) - fireballDeaths
      const moderateDeaths = estimateFatalities(blast.moderate, city.density, 0.5) - estimateFatalities(blast.severe, city.density, 0.5)
      const lightInjured = estimateFatalities(blast.light, city.density, 0.05) - estimateFatalities(blast.moderate, city.density, 0.05)
      const totalAffected = estimateFatalities(blast.light, city.density, 1.0)

      return {
        bomb,
        fireball,
        blast,
        thermal,
        fireballDeaths: Math.max(0, fireballDeaths),
        severeDeaths: Math.max(0, severeDeaths),
        moderateDeaths: Math.max(0, moderateDeaths),
        lightInjured: Math.max(0, lightInjured),
        totalAffected,
      }
    })

  const tsarScenario = scenarios.find((s) => s.bomb.id === 'tsar-bomba')
  const w76Scenario = scenarios.find((s) => s.bomb.id === 'w76')
  const littleBoyScenario = scenarios.find((s) => s.bomb.id === 'little-boy')

  const faqEntries = [
    {
      question: `What would happen if a nuclear bomb hit ${city.name}?`,
      answer:
        `${city.name} has approximately ${city.population.toLocaleString()} people and an urban density around ${city.density.toLocaleString()} per km². ` +
        (littleBoyScenario
          ? `A Hiroshima-yield warhead (15 kt Little Boy) detonated over ${city.name} would produce a moderate blast radius of about ${littleBoyScenario.blast.moderate.toFixed(1)} km, with an estimated ${(littleBoyScenario.fireballDeaths + littleBoyScenario.severeDeaths).toLocaleString()} immediate fatalities in the severe-blast zone. `
          : '') +
        (w76Scenario
          ? `A modern strategic warhead (W76, 100 kt) would extend the moderate-damage zone to roughly ${w76Scenario.blast.moderate.toFixed(1)} km with thermal burns reaching ${w76Scenario.thermal.thirdDegree.toFixed(1)} km. `
          : '') +
        `Run the interactive simulator above to see the exact zones overlaid on the map.`,
    },
    {
      question: `How many people would die in ${city.name} from a nuclear strike?`,
      answer:
        (w76Scenario
          ? `A 100 kt W76 strategic warhead air-burst over ${city.name} could cause an estimated ${(w76Scenario.fireballDeaths + w76Scenario.severeDeaths + w76Scenario.moderateDeaths).toLocaleString()} immediate fatalities and around ${w76Scenario.lightInjured.toLocaleString()} additional injured. `
          : '') +
        (tsarScenario
          ? `For comparison, a 50 Mt Tsar Bomba — the largest weapon ever tested — would put roughly ${tsarScenario.totalAffected.toLocaleString()} people inside the 1 PSI light-blast zone alone. `
          : '') +
        `Real casualties depend strongly on time of day, sheltering, weather, and altitude of detonation.`,
    },
    {
      question: `What is the blast radius of a nuclear bomb over ${city.name}?`,
      answer:
        (w76Scenario
          ? `For a 100 kt strategic warhead over ${city.name}: fireball radius ${w76Scenario.fireball.toFixed(2)} km, severe blast (20 PSI) ${w76Scenario.blast.severe.toFixed(2)} km, moderate blast (5 PSI) ${w76Scenario.blast.moderate.toFixed(2)} km, light blast (1 PSI) ${w76Scenario.blast.light.toFixed(2)} km, third-degree thermal burns ${w76Scenario.thermal.thirdDegree.toFixed(2)} km. `
          : '') +
        `Larger yields scale these radii roughly as the cube root of yield for blast and the 0.41 power for thermal effects.`,
    },
    {
      question: `Is ${city.name} a likely nuclear target?`,
      answer:
        `This is an educational simulator and does not assess threat probability. ${city.name} is one of the world's most prominent ${city.region ? `cities in ${city.region}` : 'cities'}, which is why we feature it as a scenario. The purpose of these visualizations is to convey the humanitarian scale of nuclear weapons — not to make any operational claim.`,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-city-${city.slug}`}
        schema={[
          articleSchema({
            url: `/examples/${city.slug}`,
            headline: `What if a Nuclear Bomb Hit ${city.name}? Blast Radius & Casualty Estimates`,
            description: `Nuclear blast scenario for ${city.name}, ${city.country}. Calculated effects for Little Boy, W76, Castle Bravo, and Tsar Bomba.`,
          }),
          faqPageSchema(faqEntries),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Example Scenarios', url: '/examples' },
            { name: city.name, url: `/examples/${city.slug}` },
          ]),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-300">Examples</span>
          <span className="mx-2">/</span>
          <span className="text-green-400">{city.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">
            What if a Nuclear Bomb Hit {city.name}?
          </h1>
          <p className="text-lg text-green-300">
            {city.country} · Population {city.population.toLocaleString()} · Density {city.density.toLocaleString()}/km²
          </p>
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">About {city.name}</h2>
          <p className="text-green-300 mb-4">{city.description}</p>
          <p className="text-green-300">
            Below are four scenario calculations using historical and modern nuclear weapons. Each row
            shows the radius of an effect zone in kilometers and a rough order-of-magnitude estimate of
            people inside that zone, derived from the city&apos;s urban population density. Numbers are
            educational approximations — see the{' '}
            <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page
            for the underlying formulas.
          </p>
        </section>

        {scenarios.map((s) => (
          <section key={s.bomb.id} className="mb-10">
            <h2 className="text-2xl font-semibold mb-2 text-green-400">
              {s.bomb.name} on {city.name} ({formatYield(s.bomb.yield)})
            </h2>
            <p className="text-sm text-green-300/70 mb-4">
              {s.bomb.country}{s.bomb.year ? ` · ${s.bomb.year}` : ''} · {s.bomb.description}
            </p>

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
                    <td className="text-right">{s.fireball.toFixed(2)} km</td>
                    <td className="text-right">~{s.fireballDeaths.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Severe blast (20 PSI, ~98% fatal)</td>
                    <td className="text-right">{s.blast.severe.toFixed(2)} km</td>
                    <td className="text-right">~{s.severeDeaths.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Moderate blast (5 PSI, ~50% fatal)</td>
                    <td className="text-right">{s.blast.moderate.toFixed(2)} km</td>
                    <td className="text-right">~{s.moderateDeaths.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Light blast (1 PSI, glass injuries)</td>
                    <td className="text-right">{s.blast.light.toFixed(2)} km</td>
                    <td className="text-right">~{s.lightInjured.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2">3rd-degree thermal burns</td>
                    <td className="text-right">{s.thermal.thirdDegree.toFixed(2)} km</td>
                    <td className="text-right text-green-300/70">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/?bomb=${s.bomb.id}&lat=${city.lat}&lng=${city.lng}`}
                className="inline-block bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-600 transition text-sm"
              >
                🎯 Run on Map
              </Link>
              <Link
                href={`/weapons/${s.bomb.id}`}
                className="inline-block border border-green-500/50 text-green-400 px-4 py-2 rounded font-semibold hover:bg-green-500/10 transition text-sm"
              >
                More on {s.bomb.name}
              </Link>
            </div>
          </section>
        ))}

        <section className="mb-10 bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r">
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">Limitations</h2>
          <p className="text-green-300 mb-2">
            These estimates assume an idealized air burst over the city center, uniform population density,
            and no advance warning or sheltering. Real-world casualties would depend on:
          </p>
          <ul className="list-disc list-inside text-green-300 space-y-1">
            <li>Time of day (population is concentrated downtown during business hours)</li>
            <li>Sheltering and basements (subway systems can reduce casualties significantly)</li>
            <li>Building construction (reinforced steel/concrete vs. wood-frame)</li>
            <li>Weather and atmospheric conditions</li>
            <li>Detonation altitude (air burst vs. surface burst)</li>
            <li>Subsequent fallout and infrastructure collapse</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Other City Scenarios</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {presetLocations
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/examples/${c.slug}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-3 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-yellow-400">{c.name}</div>
                  <div className="text-xs text-green-300/70">
                    {c.country} · {(c.population / 1_000_000).toFixed(1)}M people
                  </div>
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
          See also: full <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons Database</Link>{' '}
          (45+ entries) · <Link href="/methodology" className="text-yellow-400 hover:underline">Scientific methodology</Link>{' '}
          · <Link href="/sources" className="text-yellow-400 hover:underline">Data sources</Link>.
        </section>
      </main>
    </div>
  )
}
