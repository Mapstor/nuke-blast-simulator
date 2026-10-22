import { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import { breadcrumbSchema, SITE_URL } from '@/lib/seo/schemas'
import { SOURCES } from '@/lib/data/sources'
import { ENGINE_SOURCE_IDS } from '@/components/seo/Cite'
import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'

export const metadata: Metadata = seoMetadata('/sources')

// The sources actually cited somewhere on the site (generated, not hand-listed).
const uniq = (xs: string[]) => [...new Set(xs)].filter((id) => SOURCES[id])
const engineIds = uniq([...ENGINE_SOURCE_IDS])
const weaponIds = uniq(bombs.flatMap((b) => b.sources ?? [])).filter((id) => !engineIds.includes(id))
const cityIds = uniq(presetLocations.flatMap((c) => c.sourceIds)).filter(
  (id) => !engineIds.includes(id) && !weaponIds.includes(id),
)

const GROUPS: Array<{ heading: string; note: string; ids: string[] }> = [
  { heading: 'Effects physics (the calculation engine)', note: 'Every page that shows a blast, fireball or thermal radius cites these.', ids: engineIds },
  { heading: 'Weapons and tests', note: 'Per-weapon yields, types, countries and years.', ids: weaponIds.sort() },
  { heading: 'Cities', note: 'City population, area and coordinates (unit and year shown on each city page).', ids: cityIds.sort() },
]

export default function SourcesPage() {
  const total = engineIds.length + weaponIds.length + cityIds.length
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-sources"
        schema={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Sources', url: '/sources' },
        ])}
      />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1('/sources')}</h1>
        <p className="text-green-300 mb-8">
          Every figure on this site links to the source it comes from. This page lists the {total} sources
          currently cited, each with its full attribution and a link to the original. It is generated from the
          citation registry — there is no hand-maintained reading list.
        </p>

        {GROUPS.map((g) =>
          g.ids.length === 0 ? null : (
            <section key={g.heading} className="mb-10">
              <h2 className="text-2xl font-semibold mb-2 text-green-400">{g.heading}</h2>
              <p className="text-sm text-green-300/70 mb-4">{g.note}</p>
              <ul className="space-y-2 text-sm text-green-300/90">
                {g.ids.map((id) => {
                  const s = SOURCES[id]
                  return (
                    <li key={id} className="leading-snug">
                      <a href={s.url} rel="nofollow noopener" className="text-yellow-400 hover:underline">
                        {s.attribution}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </section>
          ),
        )}

        <section className="text-sm text-green-300/70">
          See the <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> for how
          the effect radii are computed, or the{' '}
          <Link href="/resources" className="text-yellow-400 hover:underline">peace resources</Link> page.
        </section>
      </main>
    </div>
  )
}
