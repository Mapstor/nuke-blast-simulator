import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, itemListSchema, SITE_URL } from '@/lib/seo/schemas'
import { presetLocations, type PresetLocation } from '@/lib/data/cities'

export const metadata: Metadata = {
  title: 'Nuclear Blast City Scenarios — 52 Cities Worldwide',
  description: 'Pre-computed nuclear blast scenarios for 52 major world cities. See casualty estimates and blast effects for Hiroshima-class and modern strategic warheads detonated over New York, London, Tokyo, Moscow, Beijing, and 47 more.',
  alternates: { canonical: '/examples' },
}

const REGION_ORDER: PresetLocation['region'][] = [
  'North America',
  'Europe',
  'Asia',
  'Middle East',
  'South America',
  'Africa',
  'Oceania',
]

const groupedByRegion: Record<string, PresetLocation[]> = (() => {
  const map: Record<string, PresetLocation[]> = {}
  for (const c of presetLocations) {
    if (!map[c.region]) map[c.region] = []
    map[c.region].push(c)
  }
  for (const k of Object.keys(map)) {
    map[k].sort((a, b) => b.population - a.population)
  }
  return map
})()

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return n.toString()
}

export default function ExamplesIndexPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-examples"
        schema={[
          itemListSchema(
            presetLocations.map((c) => ({
              name: `What if a nuclear bomb hit ${c.name}?`,
              url: `/examples/${c.slug}`,
              description: `${c.country} · ${c.population.toLocaleString()} people · ${c.density.toLocaleString()}/km²`,
            })),
            'Nuclear Blast City Scenarios',
          ),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'City Scenarios', url: '/examples' },
          ]),
        ]}
      />

      <main className="max-w-6xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">City Scenarios</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">Nuclear Blast City Scenarios</h1>
          <p className="text-lg text-green-300">
            {presetLocations.length} pre-computed scenarios for major world cities. Each page calculates the
            fireball, blast zones, thermal radiation, and population impact for four representative weapons
            (Little Boy 15 kt, W76 100 kt, Castle Bravo 15 Mt, Tsar Bomba 50 Mt) detonated over the city.
          </p>
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3 text-green-400">How this section is organized</h2>
          <p className="text-green-300 mb-2">
            Cities are grouped by region and sorted by metropolitan population. Click any city to see its
            full scenario page, or use the <Link href="/" className="text-yellow-400 hover:underline">interactive simulator</Link> to
            place any weapon over any location worldwide.
          </p>
          <p className="text-green-300/80 text-sm">
            For per-bomb-per-city pages (e.g.{' '}
            <Link href="/scenarios/tsar-bomba-on-new-york" className="text-yellow-400 hover:underline">
              Tsar Bomba on New York
            </Link>
            ), see the <Link href="/scenarios" className="text-yellow-400 hover:underline">scenarios catalog</Link>.
          </p>
        </section>

        {REGION_ORDER.map((region) => {
          const cities = groupedByRegion[region]
          if (!cities || cities.length === 0) return null
          return (
            <section key={region} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">{region}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {cities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/examples/${c.slug}`}
                    className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                  >
                    <div className="font-semibold text-yellow-400">{c.name}</div>
                    <div className="text-xs text-green-300/70 mt-1">
                      {c.country} · {formatPopulation(c.population)} people · {c.density.toLocaleString()}/km²
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <section className="text-sm text-green-300/70">
          See also: <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons Database</Link> ·{' '}
          <Link href="/scenarios" className="text-yellow-400 hover:underline">Bomb-on-city scenarios</Link> ·{' '}
          <Link href="/compare" className="text-yellow-400 hover:underline">Weapon comparisons</Link> ·{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">Methodology</Link>.
        </section>
      </main>
    </div>
  )
}
