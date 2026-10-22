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
import { presetLocations, type PresetLocation } from '@/lib/data/cities'
import { bombs } from '@/lib/data/bombs'
import { effectRadiiKm, formatRadiusKm } from '@/lib/calculations/effects'
import { Cite, Sources, createCitations, ENGINE_SOURCE_IDS } from '@/components/seo/Cite'
import { KEPT_CITY_SLUGS } from '@/lib/data/livePages'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'

// The 4 representative weapons we run for each city scenario.
const SCENARIO_BOMB_IDS = ['little-boy', 'w76', 'castle-bravo', 'tsar-bomba'] as const

const REGION_SEQUENCE: PresetLocation['region'][] = [
  'North America', 'Europe', 'Asia', 'Middle East', 'South America', 'Africa', 'Oceania',
]

// Linearize cities by region order then population descending — matches the
// ordering on /examples and gives prev/next a coherent geographic walk.
const sequencedCities = (() => {
  const groups: Record<string, PresetLocation[]> = {}
  for (const c of presetLocations.filter((p) => KEPT_CITY_SLUGS.includes(p.slug))) (groups[c.region] ??= []).push(c)
  for (const k of Object.keys(groups)) groups[k].sort((a, b) => b.population - a.population)
  const out: PresetLocation[] = []
  for (const r of REGION_SEQUENCE) if (groups[r]) out.push(...groups[r])
  return out
})()

function cityNeighbors(slug: string): { prev: PrevNextItem; next: PrevNextItem } {
  const i = sequencedCities.findIndex((c) => c.slug === slug)
  const fmt = (c: PresetLocation): PrevNextItem => ({
    label: c.name,
    href: `/examples/${c.slug}`,
    sublabel: `${c.country} · ${(c.population / 1_000_000).toFixed(1)}M`,
  })
  return {
    prev: i > 0 ? fmt(sequencedCities[i - 1]) : null,
    next: i >= 0 && i < sequencedCities.length - 1 ? fmt(sequencedCities[i + 1]) : null,
  }
}

export function generateStaticParams() {
  return presetLocations
    .filter((c) => KEPT_CITY_SLUGS.includes(c.slug))
    .map((c) => ({ slug: c.slug }))
}

function findCity(slug: string): PresetLocation | undefined {
  return presetLocations.find((c) => c.slug === slug)
}

function formatYield(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  return `${yieldKt.toLocaleString()} kt`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const city = findCity(slug)
  if (!city) return { title: 'City Not Found' }
  return seoMetadata(`/examples/${city.slug}`, 'article')
}

export default async function CityExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const city = findCity(slug)
  if (!city) notFound()

  const cites = createCitations()
  const popText = `${city.population.toLocaleString()} (${city.populationYear}, ${city.populationDefinition})`

  const scenarios = SCENARIO_BOMB_IDS
    .map((id) => bombs.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .map((bomb) => ({ bomb, r: effectRadiiKm(bomb.yield) }))

  const w76Scenario = scenarios.find((s) => s.bomb.id === 'w76')
  const littleBoyScenario = scenarios.find((s) => s.bomb.id === 'little-boy')
  const tsarScenario = scenarios.find((s) => s.bomb.id === 'tsar-bomba')

  const faqEntries = [
    {
      question: `What would happen if a nuclear bomb hit ${city.name}?`,
      answer:
        `${city.name} has a population of about ${city.population.toLocaleString()} (${city.populationYear}, ${city.populationDefinition})${city.density !== undefined ? ` and an urban density around ${city.density.toLocaleString()} per km²` : ''}. ` +
        (littleBoyScenario
          ? `A Hiroshima-yield warhead (15 kt Little Boy), air-burst at optimum height, would produce a 5 psi moderate-blast radius of about ${formatRadiusKm(littleBoyScenario.r.overpressure5psi)} km — the zone in which typical homes and lightly built commercial buildings are destroyed. `
          : '') +
        (w76Scenario
          ? `A modern strategic warhead (W76, ${w76Scenario.bomb.yield} kt) would extend that moderate-damage zone to roughly ${formatRadiusKm(w76Scenario.r.overpressure5psi)} km, with 3rd-degree thermal burns reaching ${formatRadiusKm(w76Scenario.r.thermal3rdDegree)} km. `
          : '') +
        `Run the interactive simulator above to see the exact zones overlaid on the map.`,
    },
    {
      question: `What is the blast radius of a nuclear bomb over ${city.name}?`,
      answer:
        (w76Scenario
          ? `For a 100 kt strategic warhead air-burst over ${city.name}: fireball radius ${formatRadiusKm(w76Scenario.r.fireball)} km, severe blast (20 psi) ${formatRadiusKm(w76Scenario.r.overpressure20psi)} km, moderate blast (5 psi) ${formatRadiusKm(w76Scenario.r.overpressure5psi)} km, light blast (1 psi) ${formatRadiusKm(w76Scenario.r.overpressure1psi)} km, and 3rd-degree thermal burns ${formatRadiusKm(w76Scenario.r.thermal3rdDegree)} km. `
          : '') +
        `All radii assume an air burst at optimum height and scale with weapon yield.`,
    },
    {
      question: `How do different nuclear weapons compare over ${city.name}?`,
      answer:
        (littleBoyScenario && tsarScenario
          ? `The 1 psi light-blast radius — roughly the limit of shattered windows and light injuries — runs about ${formatRadiusKm(littleBoyScenario.r.overpressure1psi)} km for a 15 kt Little Boy versus about ${formatRadiusKm(tsarScenario.r.overpressure1psi)} km for the 50 Mt Tsar Bomba. `
          : '') +
        `Blast radius scales roughly with the cube root of yield, so a 3,000× larger weapon extends the radius only about 14×.`,
    },
    {
      question: `Is ${city.name} a likely nuclear target?`,
      answer:
        `This is an educational simulator and does not assess threat probability. ${city.name} is one of the world's most prominent ${city.region ? `cities in ${city.region}` : 'cities'}, which is why we feature it as a scenario. The purpose of these visualizations is to convey the physical scale of nuclear weapons — not to make any operational claim.`,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-city-${city.slug}`}
        schema={[
          articleSchema({
            url: `/examples/${city.slug}`,
            headline: pageH1(`/examples/${city.slug}`),
            description: `Nuclear blast effect radii for ${city.name}, ${city.country}. Calculated air-burst zones for Little Boy, W76, Castle Bravo, and Tsar Bomba.`,
          }),
          faqPageSchema(faqEntries),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Cities', url: '/examples' },
            { name: city.name, url: `/examples/${city.slug}` },
          ]),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-300">Cities</span>
          <span className="mx-2">/</span>
          <span className="text-green-400">{city.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">
            {pageH1(`/examples/${city.slug}`)}
          </h1>
          <p className="text-lg text-green-300">
            {city.country} · Population {popText}
            <Cite c={cites} ids={city.sourceIds.join(';')} />
            {city.density !== undefined && city.area_km2 !== undefined
              ? <> · Density {city.density.toLocaleString()}/km²</>
              : null}
          </p>
          <Byline className="mt-2" />
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">About {city.name}</h2>
          <p className="text-green-300 mb-4">{city.description}</p>
          <p className="text-green-300">
            Below are four scenario calculations using historical and modern nuclear weapons. Each row shows
            the radius of an effect zone in kilometers for an{' '}
            <strong className="text-yellow-400">air burst at optimum height</strong>
            <Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />. Radii are scaling-law
            estimates — see the{' '}
            <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page for
            the underlying relations. Casualty and fallout estimates are not shown pending a verified
            population and fallout model.
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
                    <th className="text-right py-2 text-yellow-400">Radius (air burst)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Fireball</td>
                    <td className="text-right">{formatRadiusKm(s.r.fireball) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Severe blast (20 psi)</td>
                    <td className="text-right">{formatRadiusKm(s.r.overpressure20psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Moderate blast (5 psi)</td>
                    <td className="text-right">{formatRadiusKm(s.r.overpressure5psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Light blast (1 psi)</td>
                    <td className="text-right">{formatRadiusKm(s.r.overpressure1psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">3rd-degree thermal burns</td>
                    <td className="text-right">{formatRadiusKm(s.r.thermal3rdDegree) + ' km'}</td>
                  </tr>
                  <tr>
                    <td className="py-2">2nd-degree thermal burns</td>
                    <td className="text-right">{formatRadiusKm(s.r.thermal2ndDegree) + ' km'}</td>
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
            These radii assume an idealized air burst at optimum height over the city center. The real extent
            of each effect depends on:
          </p>
          <ul className="list-disc list-inside text-green-300 space-y-1">
            <li>Burst height and whether the detonation is an air or surface burst</li>
            <li>Terrain, building construction, and line of sight</li>
            <li>Weather and atmospheric conditions</li>
            <li>Distance from the detonation point within each zone</li>
          </ul>
          <p className="text-green-300 mt-3">
            Casualty counts, fallout plumes, and radiation doses are not modeled on this page.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Other Cities</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {presetLocations
              .filter((c) => c.slug !== city.slug && KEPT_CITY_SLUGS.includes(c.slug))
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
          · <Link href="/methodology" className="text-yellow-400 hover:underline">Scientific methodology</Link>{' '}
          · <Link href="/sources" className="text-yellow-400 hover:underline">Data sources</Link>.
        </section>

        <Sources c={cites} extraIds={[...ENGINE_SOURCE_IDS, ...city.sourceIds]} />

        <PrevNext {...cityNeighbors(city.slug)} label="Previous and next city" />
      </main>
    </div>
  )
}
