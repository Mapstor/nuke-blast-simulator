import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { JsonLd } from '@/components/seo/JsonLd'
import { aboutPageSchema, authorPersonSchema, breadcrumbSchema, SITE_URL } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'About - Nuke Blast Simulator',
  description:
    'Who builds Nuke Blast Simulator, the data and methods behind it, and how the site is made. An educational tool for visualizing nuclear weapon effects.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-about"
        schema={[
          aboutPageSchema('/about'),
          authorPersonSchema,
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'About', url: '/about' },
          ]),
        ]}
      />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">About Nuke Blast Simulator</h1>

        <section id="marko-visic" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Author</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <Image
                src="/images/marko-visic.jpeg"
                alt="Marko Visic"
                width={72}
                height={72}
                className="rounded-full border border-green-500/40 object-cover shrink-0"
              />
              <div>
                <p className="font-semibold text-yellow-400 text-lg">Marko Visic</p>
                <p className="text-sm text-green-300/70">Founder &amp; author</p>
              </div>
            </div>
            <p className="text-green-300 mb-3">
              Marko Visic builds and writes Nuke Blast Simulator. He holds a BSc in Physics and an MPharm
              (Master of Pharmacy) from the University of Ljubljana. The physics background covers the
              blast-scaling and thermal-radiation relations the tool uses.
            </p>
            <p className="text-green-300 mb-3">
              Subject focus: nuclear weapon effects, blast scaling laws (Glasstone &amp; Dolan), thermal
              radiation, and nuclear weapon history.
            </p>
            <p className="text-sm text-green-300/80">
              <a
                rel="me"
                href="https://www.linkedin.com/in/marko-visic/"
                className="text-yellow-400 hover:underline"
              >
                LinkedIn: linkedin.com/in/marko-visic
              </a>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Who runs this site</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 text-green-300 space-y-2">
            <p>Nuke Blast Simulator is published by <strong className="text-yellow-400">Moving Data Systems d.o.o.</strong></p>
            <p>Smolnik 62, 2342 Ruše, Slovenia</p>
            <p>
              Contact:{' '}
              <a href="mailto:info@nukeblastsimulator.com" className="text-yellow-400 hover:underline">
                info@nukeblastsimulator.com
              </a>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">How this site is made</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300 mb-3">
              Pages and articles are drafted with AI assistance and then checked by the author. Every figure on
              this site links to the source it comes from — see the{' '}
              <Link href="/sources" className="text-yellow-400 hover:underline">sources page</Link>. The effect
              radii are computed from published scaling laws, documented on the{' '}
              <Link href="/methodology" className="text-yellow-400 hover:underline">methodology page</Link>.
            </p>
            <p className="text-green-300">
              Casualty, fallout, radiation and crater estimates are not shown at present. The earlier model
              produced unverified figures, so those outputs are withheld until a verified population and
              fallout model is in place.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Educational purpose</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300 text-lg">
              Nuke Blast Simulator is an educational tool. It helps people understand the physical scale of
              nuclear weapon effects by visualizing blast, thermal and fireball radii on a map.
            </p>
            <p className="text-green-300">
              The goal is clarity about the numbers, not advocacy. For background on arms-control treaties and
              organizations, see the neutral{' '}
              <Link href="/resources" className="text-yellow-400 hover:underline">peace resources</Link> page.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Scientific approach</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300 mb-3">
              The effect radii come from the scaling laws in <em>The Effects of Nuclear Weapons</em> (Glasstone
              &amp; Dolan, U.S. Department of Defense) and the published effects scaling table. All radii assume
              an <strong className="text-yellow-400">air burst at optimum height</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Fireball radius</li>
              <li>Air-blast overpressure zones (20 psi, 5 psi, 1 psi)</li>
              <li>Thermal radiation burn zones (1st, 2nd and 3rd degree)</li>
            </ul>
            <p className="text-green-300 mt-3">
              Surface-burst radii, fallout plumes, prompt radiation and casualty counts are deliberately not
              shown until each has a verified model. See the{' '}
              <Link href="/methodology" className="text-yellow-400 hover:underline">methodology page</Link> for
              the exact relations.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Historical context</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              Since the atomic bombings of Hiroshima and Nagasaki in 1945, nuclear weapons have shaped world
              security. The weapons database includes devices from the first atomic bombs to modern
              thermonuclear warheads.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Limitations &amp; disclaimers</h2>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-red-400">Important notice</h3>
            <p className="mb-4 text-green-300">
              This simulator provides radius estimates based on idealized conditions. Actual nuclear weapon
              effects vary significantly with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Terrain, buildings, and geographic features</li>
              <li>Weather conditions and atmospheric density</li>
              <li>Burst height and detonation type</li>
              <li>Weapon design variations and delivery method</li>
            </ul>
            <p className="mt-4 text-red-300 font-semibold">
              This tool is for educational purposes only and must never be used for planning or targeting.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Data sources</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300">
              Every figure on the site is cited inline and listed, with its attribution and a link to the
              original, on the <Link href="/sources" className="text-yellow-400 hover:underline">sources page</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
