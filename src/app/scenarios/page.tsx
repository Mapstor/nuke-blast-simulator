import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  breadcrumbSchema,
  itemListSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'
import {
  FEATURED_BOMB_IDS,
  FEATURED_CITY_SLUGS,
  encodeScenarioSlug,
} from '@/lib/data/scenarios'

export const metadata: Metadata = {
  title: 'Nuclear Blast Scenarios — Bomb-on-City Impact Calculations',
  description: 'Browse 200 pre-computed nuclear blast scenarios. See the calculated fireball, blast radius, and casualty estimates for Tsar Bomba, Little Boy, Castle Bravo, and other weapons detonated over major world cities.',
  alternates: { canonical: '/scenarios' },
  openGraph: {
    title: 'Nuclear Blast Scenarios — Bomb-on-City Impact Calculations',
    description: 'Browse 200 pre-computed nuclear blast scenarios with casualty estimates.',
    url: '/scenarios',
    type: 'website',
  },
}

const featuredBombs = FEATURED_BOMB_IDS
  .map((id) => bombs.find((b) => b.id === id))
  .filter((b): b is NonNullable<typeof b> => Boolean(b))

const featuredCities = FEATURED_CITY_SLUGS
  .map((s) => presetLocations.find((c) => c.slug === s))
  .filter((c): c is NonNullable<typeof c> => Boolean(c))

const allItems = featuredBombs.flatMap((b) =>
  featuredCities.map((c) => ({
    name: `${b.name} on ${c.name}`,
    url: `/scenarios/${encodeScenarioSlug(b.id, c.slug)}`,
    description: `${b.yield.toLocaleString()} kt — ${c.country}`,
  })),
)

function formatYield(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  return `${yieldKt.toLocaleString()} kt`
}

export default function ScenariosIndexPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-scenarios"
        schema={[
          itemListSchema(allItems, 'Nuclear Blast Scenarios'),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Scenarios', url: '/scenarios' },
          ]),
        ]}
      />

      <main className="max-w-6xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Scenarios</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">Nuclear Blast Scenarios</h1>
          <p className="text-lg text-green-300">
            {allItems.length} pre-computed bomb-on-city impact calculations. Each scenario page shows the
            fireball, blast zones, thermal radiation, and estimated casualties for a specific weapon over
            a specific city, using local population density and validated scaling-law formulas.
          </p>
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3 text-green-400">How this section is organized</h2>
          <p className="text-green-300 mb-2">
            Each scenario combines one of <strong className="text-yellow-400">{featuredBombs.length} featured nuclear weapons</strong>{' '}
            with one of <strong className="text-yellow-400">{featuredCities.length} major cities</strong>. Below the table,
            you can also browse by weapon (every weapon&apos;s scenarios on every city) or by city
            (every weapon detonated on a single city).
          </p>
          <p className="text-green-300/80 text-sm">
            For a more flexible experience use the <Link href="/" className="text-yellow-400 hover:underline">interactive simulator</Link> —
            you can choose any weapon and any location worldwide and the calculations update live.
          </p>
        </section>

        {featuredBombs.map((bomb) => (
          <section key={bomb.id} className="mb-10">
            <h2 className="text-2xl font-semibold mb-2 text-green-400">
              <Link href={`/weapons/${bomb.id}`} className="hover:underline">
                {bomb.name}
              </Link>{' '}
              <span className="text-base text-green-300/70 font-normal">
                ({formatYield(bomb.yield)} · {bomb.country})
              </span>
            </h2>
            <p className="text-sm text-green-300/80 mb-3">{bomb.description}</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
              {featuredCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/scenarios/${encodeScenarioSlug(bomb.id, c.slug)}`}
                  className="block bg-black/50 border border-green-500/30 rounded p-2 hover:border-green-400 transition text-sm"
                >
                  <span className="font-semibold text-yellow-400">{c.name}</span>{' '}
                  <span className="text-green-300/60 text-xs">· {c.country}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-10 text-sm text-green-300/70">
          See also: <Link href="/weapons" className="text-yellow-400 hover:underline">full Weapons Database</Link>{' '}
          (45+ entries) ·{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> ·{' '}
          <Link href="/sources" className="text-yellow-400 hover:underline">data sources</Link>.
        </section>
      </main>
    </div>
  )
}
