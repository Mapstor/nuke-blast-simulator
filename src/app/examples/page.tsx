import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, itemListSchema, SITE_URL } from '@/lib/seo/schemas'
import { presetLocations, type PresetLocation } from '@/lib/data/cities'
import { KEPT_CITY_SLUGS } from '@/lib/data/livePages'
import { Cite, Sources, createCitations } from '@/components/seo/Cite'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'

const PATH = '/examples'
export const metadata: Metadata = seoMetadata(PATH)

const kept = new Set(KEPT_CITY_SLUGS)
// A city with its own page links there; every other city links to the simulator
// preset at its verified coordinates (NBS-008 fold: 79 city pages -> /examples).
function cityHref(c: PresetLocation): string {
  return kept.has(c.slug) ? `/examples/${c.slug}` : `/?lat=${c.lat}&lng=${c.lng}`
}

const REGION_ORDER: PresetLocation['region'][] = [
  'North America', 'Europe', 'Asia', 'Middle East', 'South America', 'Africa', 'Oceania',
]
const groupedByRegion: Record<string, PresetLocation[]> = (() => {
  const map: Record<string, PresetLocation[]> = {}
  for (const c of presetLocations) (map[c.region] ??= []).push(c)
  for (const k of Object.keys(map)) map[k].sort((a, b) => b.population - a.population)
  return map
})()

export default function ExamplesIndexPage() {
  const cites = createCitations()
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-examples"
        schema={[
          itemListSchema(
            presetLocations
              .filter((c) => kept.has(c.slug))
              .map((c) => ({
                name: `What if a nuclear bomb hit ${c.name}?`,
                url: `/examples/${c.slug}`,
                description: `${c.country} · ${c.population.toLocaleString()} people (${c.populationYear})`,
              })),
            'Nuclear Blast Maps by City',
          ),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Cities', url: PATH },
          ]),
        ]}
      />

      <main className="max-w-6xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Cities</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1(PATH)}</h1>
          <p className="text-lg text-green-300">
            Every city&apos;s population and nuclear blast radius in one index. {KEPT_CITY_SLUGS.length} cities
            have a full page with the fireball, blast and thermal-burn radii for Little Boy, W76,
            Castle Bravo and Tsar Bomba; the rest open directly in the{' '}
            <Link href="/" className="text-yellow-400 hover:underline">interactive simulator</Link> at the
            city&apos;s coordinates.
          </p>
        </header>

        {REGION_ORDER.map((region) => {
          const cities = groupedByRegion[region]
          if (!cities || cities.length === 0) return null
          return (
            <section key={region} id={region.toLowerCase().replace(/\s+/g, '-')} className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">{region}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {cities.map((c) => (
                  // Card is a <div> so the population citation (a <Cite> renders
                  // an <a>) sits in a non-link footer, never inside the card link.
                  <div key={c.slug} className="flex flex-col bg-black/50 border border-green-500/30 rounded-lg p-4 transition hover:border-green-400">
                    <Link href={cityHref(c)} className="block">
                      <div className="font-semibold text-yellow-400">{c.name}</div>
                      <div className="text-xs text-green-300/70 mt-1">
                        {c.country} · {c.population.toLocaleString()} ({c.populationYear}, {c.populationDefinition})
                      </div>
                    </Link>
                    {(c.sourceIds ?? []).length > 0 ? (
                      <p className="mt-auto pt-2 text-xs text-green-300/60">
                        Population source <Cite c={cites} ids={(c.sourceIds ?? []).join(';')} />
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        <Sources c={cites} />

        <section className="mt-10 text-sm text-green-300/70">
          See also: <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons Database</Link> ·{' '}
          <Link href="/compare" className="text-yellow-400 hover:underline">Weapon comparisons</Link> ·{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">Methodology</Link>.
        </section>
      </main>
    </div>
  )
}
