import type { Metadata } from 'next'
import Link from 'next/link'
import HomeClient from '@/components/HomeClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { faqPageSchema } from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'

export const metadata: Metadata = {
  title: 'Nuclear Blast Simulator — Interactive Nuke Map & Blast Radius Calculator',
  description:
    'Free interactive nuclear blast simulator. Click any city to see the fireball, blast radius, thermal burn zone, and fallout for Tsar Bomba, Little Boy, Castle Bravo, and 40+ other nuclear weapons. Real scientific data, no signup.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Nuclear Blast Simulator — Interactive Nuke Map',
    description:
      'See the blast radius, casualties, and fallout for any nuclear weapon on any city. Free, instant, scientifically accurate.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuclear Blast Simulator — Interactive Nuke Map',
    description:
      'See the blast radius, casualties, and fallout for any nuclear weapon on any city. Free, instant, scientifically accurate.',
  },
}

const homepageFaq = [
  {
    question: 'What is the Nuclear Blast Simulator?',
    answer:
      'Nuclear Blast Simulator is a free interactive web tool that visualizes the effects of nuclear weapons on any location worldwide. Pick from 45+ historical and modern nuclear weapons (or set a custom yield), click anywhere on the map, and see the fireball, blast overpressure zones, thermal radiation burn radii, and fallout patterns calculated from declassified scientific data.',
  },
  {
    question: 'Is the Nuclear Blast Simulator free to use?',
    answer:
      'Yes. The simulator is completely free, runs entirely in your browser, requires no account or signup, and never transmits your weapon selections or target locations to any server.',
  },
  {
    question: 'How accurate is the nuclear blast simulator?',
    answer:
      'The simulator uses scaling-law formulas from "The Effects of Nuclear Weapons" (Glasstone & Dolan, 1977), the canonical declassified DOD/DOE reference. Results are educational approximations: real-world effects depend on terrain, weather, building construction, and altitude of detonation, which the simulator idealizes.',
  },
  {
    question: 'Which nuclear weapons can I simulate?',
    answer:
      'The database includes Little Boy (Hiroshima, 15 kt), Fat Man (Nagasaki, 21 kt), the Soviet Tsar Bomba (50 Mt — largest test ever), Castle Bravo (15 Mt — largest US test), Ivy Mike (the first hydrogen bomb), modern strategic warheads (W88, W76, B61, B83), and conventional comparison bombs. You can also set any custom yield from 1 to 100,000 kilotons.',
  },
  {
    question: 'What is the difference between an air burst and a surface burst?',
    answer:
      'An air burst detonates above the ground at optimal altitude, maximizing the area affected by blast and thermal radiation but producing minimal fallout. Hiroshima and Nagasaki were both air bursts. A surface burst detonates at ground level, producing roughly 40-50% smaller blast radius but creating massive radioactive fallout, a large crater, and long-term ground contamination.',
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

export default function HomePage() {
  return (
    <main>
      <JsonLd id="ld-home-faq" schema={faqPageSchema(homepageFaq)} />

      <h1 className="sr-only">
        Nuclear Blast Simulator — Interactive Nuke Map &amp; Blast Radius Calculator
      </h1>

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
              one of <strong className="text-yellow-400">45+ historical and modern nuclear weapons</strong> — from
              the 15-kiloton Little Boy that destroyed Hiroshima to the 50-megaton Tsar Bomba, the largest
              nuclear weapon ever tested.
            </p>
            <p className="mb-4">
              The simulator instantly displays color-coded zones for the fireball, severe blast (20 PSI), moderate
              blast (5 PSI), light blast (1 PSI), thermal radiation burn radii, and fallout. Casualty estimates are
              calculated from local population density. All math runs in your browser using scaling-law formulas
              from <em>The Effects of Nuclear Weapons</em> (Glasstone &amp; Dolan, 1977) — the canonical
              declassified U.S. Department of Defense reference.
            </p>
            <p>
              The tool is built as an educational resource to support nuclear-disarmament awareness. It is{' '}
              <strong className="text-yellow-400">free</strong>, requires <strong className="text-yellow-400">no signup</strong>,
              and <strong className="text-yellow-400">never transmits your simulations</strong> to a server.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">How to Use the Nuke Map</h2>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong className="text-yellow-400">Select a weapon</strong> from the dropdown — Tsar Bomba, Little Boy, Castle Bravo, modern warheads, or a custom yield.</li>
              <li><strong className="text-yellow-400">Click anywhere on the map</strong> to choose your detonation point. Pan and zoom freely; the map covers the entire planet.</li>
              <li><strong className="text-yellow-400">Watch the blast zones appear</strong>. Yellow is the fireball, red is severe blast, orange is moderate blast, gray is light blast, magenta and pink are thermal burn radii.</li>
              <li><strong className="text-yellow-400">Read the casualty estimates</strong> in the results panel — they update based on local population density.</li>
            </ol>
            <p>
              <Link href="/how-it-works" className="text-yellow-400 hover:underline">Read the full step-by-step guide →</Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Featured Nuclear Weapons</h2>
            <p className="mb-4">
              The Weapons Database catalogs every major nuclear weapon from 1945 to the present. Click any
              weapon below to see its detailed blast-radius profile, historical context, and a one-click
              simulator preset.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {featuredWeapons.map((b) => (
                <Link
                  key={b.id}
                  href={`/weapons/${b.id}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-yellow-400">{b.name}</div>
                  <div className="text-sm text-green-300/80">
                    {b.country}{b.year ? ` · ${b.year}` : ''} ·{' '}
                    {b.yield >= 1000
                      ? `${(b.yield / 1000).toLocaleString()} Mt`
                      : `${b.yield.toLocaleString()} kt`}
                  </div>
                  <div className="text-xs text-green-300/70 mt-1">{b.description}</div>
                </Link>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/weapons" className="text-yellow-400 hover:underline">
                Browse the full Weapons Database (45+ entries) →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Featured City Scenarios</h2>
            <p className="mb-4">
              See pre-computed nuclear blast scenarios for major world cities — including computed casualty
              estimates from population density data.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {presetLocations.map((c) => (
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

          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Understanding Nuclear Blast Effects</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Fireball</h3>
                <p>
                  At the instant of detonation, a sphere of plasma forms with temperatures exceeding 10 million °C
                  — hotter than the surface of the Sun. Everything inside the fireball is vaporized.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Air Blast (Overpressure)</h3>
                <p>
                  A shock wave radiates outward at supersonic speeds. The 20 PSI zone destroys reinforced concrete;
                  5 PSI collapses most residential buildings; 1 PSI shatters windows out to many kilometers.
                  These radii scale with the cube root of yield.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Thermal Radiation</h3>
                <p>
                  Intense light and infrared radiation cause burns and ignite fires far beyond the blast zone.
                  3rd-degree burns are possible at distances up to several kilometers for strategic-yield weapons.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Fallout</h3>
                <p>
                  Surface bursts produce massive radioactive fallout plumes that drift downwind for hundreds of
                  kilometers. Air bursts produce minimal local fallout — which is why Hiroshima and Nagasaki
                  were both air bursts.
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

        </div>
      </article>
    </main>
  )
}
