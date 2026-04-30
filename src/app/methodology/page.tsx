import { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  articleSchema,
  howToSchema,
  breadcrumbSchema,
  SITE_URL,
} from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Methodology - How We Calculate Nuclear Blast Effects',
  description: 'Learn about the scientific formulas and data sources used to calculate nuclear blast effects, casualties, and damage zones in our simulator.',
  alternates: { canonical: '/methodology' }
}

const calculationSteps = [
  {
    name: 'Compute the fireball radius',
    text: 'Fireball radius (km) = 0.28 × Yield_kt^0.33. Within this radius, temperatures exceed 10 million°C and everything is vaporized.',
  },
  {
    name: 'Compute the air blast zones',
    text: 'Severe (20 PSI) = 0.28 × Yield_kt^0.33 km. Moderate (5 PSI) = 1.03 × Yield_kt^0.33 km. Light (1 PSI) = 2.93 × Yield_kt^0.33 km. The 5 PSI radius is the canonical "city-killing" boundary for residential buildings.',
  },
  {
    name: 'Compute thermal radiation zones',
    text: '3rd degree burns = 0.67 × Yield_kt^0.41 km. 2nd degree burns = 1.2 × Yield_kt^0.41 km. Thermal radius scales with a higher exponent (0.41 vs 0.33) because thermal energy propagates more efficiently than blast pressure.',
  },
  {
    name: 'Apply mortality rates per zone',
    text: 'Fireball 100%, 20 PSI 98%, 5 PSI 50%, 1 PSI 5%, 3rd degree burn 95%, 2nd degree burn 20%, fallout 30%. These rates are derived from Glasstone & Dolan and post-Hiroshima/Nagasaki epidemiological data.',
  },
  {
    name: 'Multiply by local population density',
    text: 'Casualties per zone = π × radius² × density × mortality_rate. Density is sampled from a precomputed global population grid for the detonation point and surrounding area.',
  },
]

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-methodology"
        schema={[
          articleSchema({
            url: '/methodology',
            headline: 'Nuclear Blast Simulator — Scientific Methodology',
            description:
              'Scaling-law formulas and mortality assumptions used to calculate nuclear weapon effects, derived from Glasstone & Dolan and declassified test data.',
          }),
          howToSchema({
            name: 'How nuclear blast effects are calculated',
            description:
              'Scaling-law procedure used by Nuclear Blast Simulator to compute fireball, air blast, thermal radiation, and casualties from yield and population density.',
            steps: calculationSteps,
          }),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Methodology', url: '/methodology' },
          ]),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Scientific Methodology</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Blast Effect Calculations</h2>
          <p className="mb-6 text-green-300">
            The simulator uses scientifically validated scaling-law formulas derived from nuclear weapons
            testing data and the seminal work <em>The Effects of Nuclear Weapons</em> by Glasstone & Dolan
            (3rd edition, 1977). All formulas express radius as a function of weapon yield in kilotons.
          </p>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Fireball Radius</h3>
            <code className="block bg-gray-950 border border-green-500/20 text-green-300 p-3 rounded font-mono text-sm">
              Radius (km) = 0.28 × Yield<sup>0.33</sup>
            </code>
            <p className="mt-3 text-green-300">
              The fireball vaporizes everything within this radius. Temperatures exceed 10 million°C —
              hotter than the surface of the Sun.
            </p>
          </div>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Air Blast Zones</h3>
            <ul className="space-y-2 text-green-300">
              <li>
                <span className="font-semibold text-red-400">20 PSI (Severe):</span>{' '}
                <span className="text-green-300">0.28 × Yield<sup>0.33</sup> km — reinforced concrete buildings destroyed.</span>
              </li>
              <li>
                <span className="font-semibold text-orange-400">5 PSI (Moderate):</span>{' '}
                <span className="text-green-300">1.03 × Yield<sup>0.33</sup> km — most residential buildings collapse.</span>
              </li>
              <li>
                <span className="font-semibold text-gray-300">1 PSI (Light):</span>{' '}
                <span className="text-green-300">2.93 × Yield<sup>0.33</sup> km — windows shatter, debris injuries.</span>
              </li>
            </ul>
          </div>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Thermal Radiation</h3>
            <ul className="space-y-2 text-green-300">
              <li>
                <span className="font-semibold text-pink-400">3rd Degree Burns:</span>{' '}
                <span className="text-green-300">0.67 × Yield<sup>0.41</sup> km — severe burns requiring immediate medical care.</span>
              </li>
              <li>
                <span className="font-semibold text-pink-300">2nd Degree Burns:</span>{' '}
                <span className="text-green-300">1.2 × Yield<sup>0.41</sup> km — painful burns, potential scarring.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Casualty Estimates</h2>
          <p className="mb-4 text-green-300">
            Casualties are calculated by combining each zone&apos;s area, the local population density at
            the detonation point, and an empirically-derived mortality rate per zone:
          </p>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <table className="w-full text-green-300">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left py-2 text-yellow-400">Zone</th>
                  <th className="text-right py-2 text-yellow-400">Mortality Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-500/10"><td className="py-2">Fireball</td><td className="text-right">100%</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">20 PSI overpressure</td><td className="text-right">98%</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">5 PSI overpressure</td><td className="text-right">50%</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">1 PSI overpressure</td><td className="text-right">5%</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">3rd-degree thermal burns</td><td className="text-right">95%</td></tr>
                <tr className="border-b border-green-500/10"><td className="py-2">2nd-degree thermal burns</td><td className="text-right">20%</td></tr>
                <tr><td className="py-2">Fallout (24–48h)</td><td className="text-right">30%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Data Sources</h2>
          <ul className="bg-black/50 border border-green-500/30 rounded-lg p-6 list-disc list-inside space-y-2 text-green-300">
            <li>Glasstone, S., &amp; Dolan, P. J. (1977). <em>The Effects of Nuclear Weapons</em> (3rd ed.).</li>
            <li>Federation of American Scientists — Nuclear Weapons Effects Calculator.</li>
            <li>NUKEMAP by Alex Wellerstein — validation data.</li>
            <li>Defense Threat Reduction Agency publications.</li>
            <li>Oak Ridge National Laboratory — Nuclear Weapons FAQ.</li>
          </ul>
          <p className="mt-4 text-sm text-green-300/70">
            See the full <Link href="/sources" className="text-yellow-400 hover:underline">data sources</Link> page for
            complete references and citation links.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Important Disclaimers</h2>
          <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r">
            <p className="text-green-300 mb-3">
              The simulator provides estimates based on idealized conditions. Actual effects would vary based on:
            </p>
            <ul className="list-disc list-inside space-y-1 text-green-300">
              <li>Terrain and geographic features</li>
              <li>Weather conditions and atmospheric density</li>
              <li>Building construction standards</li>
              <li>Time of day (population distribution)</li>
              <li>Altitude of detonation (air burst vs. surface burst)</li>
              <li>Emergency response capabilities</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
