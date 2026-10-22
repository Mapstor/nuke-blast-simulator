import type { Metadata } from 'next'
import Link from 'next/link'
import HomeClient from '@/components/HomeClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { faqPageSchema } from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'
import { COMPARISONS, encodeComparisonSlug } from '@/lib/data/comparisons'
import { articles } from '@/lib/blog/articles'
import { glossary } from '@/lib/data/glossary'
import { Cite, Sources, createCitations, ENGINE_SOURCE_IDS } from '@/components/seo/Cite'
import { radiusText } from '@/lib/calculations/radius'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import { KEPT_CITY_SLUGS, KEPT_GLOSSARY_SLUGS } from '@/lib/data/livePages'

// Count of nuclear weapons in the simulator picker (the BombSelector excludes
// conventional bombs; the custom-yield slot is typed thermonuclear so is
// excluded explicitly). Rendered from data so prose can never drift.
const nuclearWeaponCount = bombs.filter((b) => b.type !== 'conventional' && b.id !== 'custom').length

export const metadata: Metadata = seoMetadata('/')

const homepageFaq = [
  {
    question: 'What is the Nuclear Blast Simulator?',
    answer:
      'Nuke Blast Simulator is a free interactive web tool that visualizes the effects of nuclear weapons on any location worldwide. Pick from the database of historical and modern nuclear weapons (or set a custom yield), click anywhere on the map, and see the fireball, blast overpressure zones, and thermal radiation burn radii, computed from published scaling laws for an air burst at optimum height.',
  },
  {
    question: 'Is the Nuclear Blast Simulator free to use?',
    answer:
      'Yes. The simulator is completely free, runs entirely in your browser, requires no account or signup, and never transmits your weapon selections or target locations to any server.',
  },
  {
    question: 'How accurate is the nuclear blast simulator?',
    answer:
      'The radii come from the scaling laws in "The Effects of Nuclear Weapons" (Glasstone & Dolan, 1977) and the standard scaling-law table derived from it. Results are educational approximations: real effects depend on terrain, weather, building construction and burst height, which the simulator idealizes.',
  },
  {
    question: 'Which nuclear weapons can I simulate?',
    answer:
      'The database includes Little Boy (Hiroshima, 15 kt), Fat Man (Nagasaki, 21 kt), the Soviet Tsar Bomba (50 Mt — largest test ever), Castle Bravo (15 Mt — largest US test), Ivy Mike (the first hydrogen bomb), modern strategic warheads (W88, W76, B61, B83), and conventional comparison bombs. You can also set any custom yield from 1 to 100,000 kilotons.',
  },
  {
    question: 'What is the difference between an air burst and a surface burst?',
    answer:
      'An air burst detonates above the ground at optimal altitude, maximizing the area affected by blast and thermal radiation while producing little local fallout. Hiroshima and Nagasaki were both air bursts. A surface burst detonates at ground level; for most overpressures its blast reaches less far than an air burst at the optimum height, and it produces heavy local fallout.',
  },
  {
    question: 'Can I share my nuclear blast simulation?',
    answer:
      'Yes. After running a simulation, the share button copies a URL that re-creates the same scenario when opened. It encodes the weapon, latitude, and longitude — useful for educators, journalists, and researchers.',
  },
]

const featuredWeapons = ['tsar-bomba', 'castle-bravo', 'little-boy', 'fat-man', 'b83', 'w88']
  .map((id) => bombs.find((b) => b.id === id))
  .filter((b): b is NonNullable<typeof b> => Boolean(b))

const featuredCities = presetLocations.filter((c) => KEPT_CITY_SLUGS.includes(c.slug)).slice(0, 8)

const featuredComparisons = COMPARISONS.slice(0, 6)
  .map(([a, b]) => {
    const ba = bombs.find((bb) => bb.id === a)
    const bb = bombs.find((bbb) => bbb.id === b)
    if (!ba || !bb) return null
    return { a: ba, b: bb, slug: encodeComparisonSlug(a, b) }
  })
  .filter((x): x is NonNullable<typeof x> => Boolean(x))

const latestArticles = [...articles]
  .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
  .slice(0, 4)

const featuredGlossaryTerms = glossary.filter((g) => KEPT_GLOSSARY_SLUGS.includes(g.slug)).slice(0, 6)

function shortYield(y: number): string {
  if (y >= 1000) return `${(y / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  return `${y.toLocaleString()} kt`
}

export default function HomePage() {
  const cites = createCitations()
  return (
    <main>
      <JsonLd id="ld-home-faq" schema={faqPageSchema(homepageFaq)} />

      <h1 className="sr-only">{pageH1('/')}</h1>

      <HomeClient />

      {/* Server-rendered SEO content section. Indexed by every crawler without
          requiring JavaScript execution. */}
      <article className="bg-gray-900 text-green-300 px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">What is the Nuclear Blast Simulator?</h2>
            <p className="text-lg mb-4">
              Nuclear Blast Simulator is a free, interactive online tool that lets you visualize the effects of
              nuclear weapons on any city or location worldwide. Click anywhere on the map above to detonate
              one of <strong className="text-yellow-400">{nuclearWeaponCount} historical and modern nuclear weapons</strong> — from
              the 15-kiloton Little Boy that destroyed Hiroshima to the 50-megaton Tsar Bomba, the largest
              nuclear weapon ever tested.
            </p>
            <p className="mb-4">
              The simulator instantly displays color-coded zones for the fireball, severe blast (20 psi), moderate
              blast (5 psi), light blast (1 psi), and thermal radiation burn radii — all for an air burst at
              optimum height, using scaling-law formulas from <em>The Effects of Nuclear Weapons</em>
              (Glasstone &amp; Dolan, 1977) and the published effects scaling table. <Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} /> Casualty and fallout figures
              are not shown pending a verified model.
            </p>
            <p>
              The tool is an educational resource for understanding the physical scale of nuclear weapon effects.
              It is <strong className="text-yellow-400">free</strong>, requires{' '}
              <strong className="text-yellow-400">no signup</strong>, and{' '}
              <strong className="text-yellow-400">never stores your simulations</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">How to Use the Nuke Map</h2>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong className="text-yellow-400">Select a weapon</strong> from the dropdown — Tsar Bomba, Little Boy, Castle Bravo, modern warheads, or a custom yield.</li>
              <li><strong className="text-yellow-400">Click anywhere on the map</strong> to choose your detonation point. Pan and zoom freely; the map covers the entire planet.</li>
              <li><strong className="text-yellow-400">Watch the blast zones appear</strong>. Yellow is the fireball, red is severe blast, orange is moderate blast, gray is light blast, magenta and pink are thermal burn radii.</li>
              <li><strong className="text-yellow-400">Read the effect radii</strong> in the results panel — each zone&apos;s radius for an air burst at optimum height.</li>
            </ol>
            <p>
              <Link href="/how-it-works" className="text-yellow-400 hover:underline">Read the full step-by-step guide →</Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Featured Nuclear Weapons</h2>
            <p className="mb-4">
              The Weapons Database covers {nuclearWeaponCount} historical and current nuclear weapons and tests. Click any
              weapon below to see its detailed blast-radius profile, historical context, and a one-click
              simulator preset.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {featuredWeapons.map((b) => (
                // Card is a <div>, not a <Link>, so the citation can sit in a
                // non-link footer row. A <Cite> renders an <a>, and an <a> inside
                // the card's <Link> is invalid HTML (hydration error #418).
                <div
                  key={b.id}
                  className="flex flex-col bg-black/50 border border-green-500/30 rounded-lg p-4 transition hover:border-green-400"
                >
                  <Link href={`/weapons/${b.id}`} className="block">
                    <div className="font-semibold text-yellow-400">{b.name}</div>
                    <div className="text-sm text-green-300/80">
                      {b.country}{b.year ? ` · ${b.year}` : ''} ·{' '}
                      {b.yield >= 1000
                        ? `${(b.yield / 1000).toLocaleString()} Mt`
                        : `${b.yield.toLocaleString()} kt`}
                    </div>
                    <div className="text-xs text-green-300/70 mt-1">{b.description}</div>
                  </Link>
                  {(b.sources ?? []).length > 0 ? (
                    <p className="mt-auto pt-2 text-xs text-green-300/70">
                      Source <Cite c={cites} ids={(b.sources ?? []).join(';')} />
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/weapons" className="text-yellow-400 hover:underline">
                Browse the full Weapons Database ({nuclearWeaponCount} nuclear weapons) →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Featured Cities</h2>
            <p className="mb-4">
              Pre-computed nuclear blast effect radii for major world cities.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {featuredCities.map((c) => (
                // Card is a <div> wrapping the <Link> so the population citation
                // (a <Cite>, which renders an <a>) sits outside the card link.
                <div
                  key={c.slug}
                  className="flex flex-col bg-black/50 border border-green-500/30 rounded-lg p-3 transition hover:border-green-400"
                >
                  <Link href={`/examples/${c.slug}`} className="block">
                    <div className="font-semibold text-yellow-400">{c.name}</div>
                    <div className="text-xs text-green-300/70">
                      {c.country} · {(c.population / 1_000_000).toFixed(1)}M people
                    </div>
                  </Link>
                  {(c.sourceIds ?? []).length > 0 ? (
                    <p className="mt-auto pt-2 text-xs text-green-300/70">
                      Population source <Cite c={cites} ids={(c.sourceIds ?? []).join(';')} />
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/examples" className="text-yellow-400 hover:underline">
                Browse all {presetLocations.length} cities →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Weapon Comparisons</h2>
            <p className="mb-4">
              Head-to-head comparisons of nuclear weapons, side-by-side. Yields, blast and thermal radii,
              and which is bigger.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {featuredComparisons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-3 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-yellow-400 text-sm">
                    {c.a.name} vs {c.b.name}
                  </div>
                  <div className="text-xs text-green-300/70 mt-1">
                    {shortYield(c.a.yield)} vs {shortYield(c.b.yield)}
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/compare" className="text-yellow-400 hover:underline">
                Browse all weapon comparisons →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">From the Blog</h2>
            <p className="mb-4">
              Long-form articles on nuclear weapon physics, history, doctrine, and effects.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {latestArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                >
                  <div className="text-xs uppercase tracking-wider text-green-300/70 mb-1">
                    {a.readingMinutes} min read
                  </div>
                  <div className="font-semibold text-yellow-400">{a.title}</div>
                  <div className="text-xs text-green-300/80 mt-1">{a.description}</div>
                </Link>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/blog" className="text-yellow-400 hover:underline">
                Read all articles →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Glossary</h2>
            <p className="mb-4">
              {glossary.length} defined terms covering nuclear weapon effects, physics, doctrine, and arms
              control. Each term has a one-sentence answer and an expanded explanation.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {featuredGlossaryTerms.map((g) => (
                <Link
                  key={g.slug}
                  href={`/glossary/${g.slug}`}
                  className="block bg-black/50 border border-green-500/30 rounded p-3 hover:border-green-400 transition text-sm"
                >
                  <div className="font-semibold text-yellow-400">{g.term}</div>
                  <div className="text-xs text-green-300/70 mt-0.5 line-clamp-2">{g.short}</div>
                </Link>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/glossary" className="text-yellow-400 hover:underline">
                Browse the full glossary →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Understanding Nuclear Blast Effects</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Fireball</h3>
                <p>
                  A sphere of extremely hot gas forms. At the first instant it reaches tens of millions of
                  degrees, similar to the center of the Sun. <Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-3" />
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Air Blast (Overpressure)</h3>
                <p>
                  A shock wave radiates outward at supersonic speeds. The 20 PSI zone destroys reinforced concrete;
                  5 PSI collapses most residential buildings; 1 PSI shatters windows out to many kilometers.
                  These radii scale with the cube root of yield. <Cite c={cites} ids="us-congress-office-of-technology-assessment-via" />
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Thermal Radiation</h3>
                <p>
                  Intense light and infrared radiation cause burns and ignite fires far beyond the blast zone.
                  3rd-degree burns reach out to about {radiusText(100, 'burn3')} from a 100 kt air burst and
                  about {radiusText(1000, 'burn3')} from 1 Mt. <Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Fallout</h3>
                <p>
                  Surface bursts can spread heavy radioactive fallout hundreds of kilometers downwind; fallout
                  from the Castle Bravo test contaminated an area more than 530 km long. Hiroshima and Nagasaki
                  were air bursts, and fallout injuries there were essentially absent. <Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e" />
                </p>
              </div>
            </div>
            <p className="mt-4">
              <Link href="/methodology" className="text-yellow-400 hover:underline">
                Read the full scientific methodology →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {homepageFaq.map((qa) => (
                <details key={qa.question} className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer text-yellow-400">{qa.question}</summary>
                  <p className="mt-3">{qa.answer}</p>
                </details>
              ))}
              <p className="text-sm text-green-300/70 mt-4">
                See the full <Link href="/faq" className="text-yellow-400 hover:underline">FAQ</Link> for more
                in-depth questions about nuclear weapon effects.
              </p>
            </div>
          </section>

          <section className="text-center pt-8 border-t border-green-500/30">
            <h2 className="text-2xl font-bold mb-3 text-green-400">Ready to Simulate?</h2>
            <p className="text-green-300/80 mb-4">
              Scroll back to the top — pick a weapon, click a city, see the impact.
            </p>
            <a
              href="#"
              className="inline-block bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              🎯 Back to the Simulator
            </a>
          </section>

          <Sources c={cites} />

        </div>
      </article>
    </main>
  )
}
