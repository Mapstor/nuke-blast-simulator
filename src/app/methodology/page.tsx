import { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { Byline } from '@/components/Byline'
import {
  articleSchema,
  breadcrumbSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import {
  FIREBALL_COEFFICIENT,
  FIREBALL_EXPONENT,
  YIELD_KNOTS_KT,
  SCALING_TABLE_KM,
  EFFECT_LABELS,
  formatRadiusKm,
  type EffectKey,
} from '@/lib/calculations/effects'
import { radiusKm } from '@/lib/calculations/radius'
import { Cite, Sources, createCitations, ENGINE_SOURCE_IDS } from '@/components/seo/Cite'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'

export const metadata: Metadata = seoMetadata('/methodology')

// Column labels for the scaling-table knots.
function knotLabel(kt: number): string {
  return kt >= 1000 ? `${kt / 1000} Mt` : `${kt} kt`
}

const EFFECT_ORDER: EffectKey[] = [
  'overpressure20psi',
  'overpressure5psi',
  'overpressure1psi',
  'thermal3rdDegree',
  'thermal2ndDegree',
  'thermal1stDegree',
]

export default function MethodologyPage() {
  const cites = createCitations()
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-methodology"
        schema={[
          articleSchema({
            url: '/methodology',
            headline: 'Nuke Blast Simulator — Scientific Methodology',
            description:
              'Scaling-law formulas used to calculate nuclear weapon blast and thermal effect radii, from Glasstone & Dolan 1977 and the published effects scaling table.',
          }),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Methodology', url: '/methodology' },
          ]),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1('/methodology')}</h1>
        <Byline className="mb-8" />

        <section className="mb-12">
          <p className="mb-6 text-green-300">
            Every effect radius on this site is computed from published scaling laws for an{' '}
            <strong className="text-yellow-400">air burst at optimum height</strong>. Radius is a function of
            weapon yield in kilotons (W). The two primary sources are{' '}
            <em>The Effects of Nuclear Weapons</em> (Glasstone &amp; Dolan, 3rd ed., 1977) and the published
            effects scaling table. <Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} /> These are the exact
            relations the code runs — the constants below are read directly from the calculation engine.
          </p>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3 text-yellow-400">Fireball radius</h2>
            <code className="block bg-gray-950 border border-green-500/20 text-green-300 p-3 rounded font-mono text-sm">
              Radius (km) = {FIREBALL_COEFFICIENT} × W<sup>{FIREBALL_EXPONENT}</sup>
            </code>
            <p className="mt-3 text-green-300">
              This is the maximum fireball radius of an air burst. Glasstone &amp; Dolan §2.127 gives the
              breakaway radius as roughly 100·W<sup>0.4</sup> feet; the maximum air-burst fireball is about
              twice breakaway, which converts to {FIREBALL_COEFFICIENT}·W<sup>{FIREBALL_EXPONENT}</sup> km.
              (Checks: 15 kt → {(FIREBALL_COEFFICIENT * Math.pow(15, FIREBALL_EXPONENT)).toFixed(2)} km;
              50 Mt → {(FIREBALL_COEFFICIENT * Math.pow(50000, FIREBALL_EXPONENT)).toFixed(1)} km.)
            </p>
          </div>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3 text-yellow-400">Blast &amp; thermal scaling table</h2>
            <p className="text-green-300 mb-4">
              Blast overpressure and thermal burn radii are read from this scaling table (optimum-height air
              bursts) and interpolated for intermediate yields. Radii are in kilometres.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-green-300 text-sm md:text-base">
                <thead>
                  <tr className="border-b border-green-500/30">
                    <th className="text-left py-2 text-yellow-400">Effect</th>
                    {YIELD_KNOTS_KT.map((kt) => (
                      <th key={kt} className="text-right py-2 text-yellow-400">{knotLabel(kt)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EFFECT_ORDER.map((key) => (
                    <tr key={key} className="border-b border-green-500/10">
                      <td className="py-2">{EFFECT_LABELS[key]}</td>
                      {SCALING_TABLE_KM[key].map((v, i) => (
                        <td key={i} className="text-right">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-yellow-400">Interpolation</h2>
            <p className="text-green-300">
              For a yield between two table columns, the radius is interpolated on a log–log scale (log of
              radius is linear in log of yield between the two bracketing points). Beyond the tabulated range
              (1 kt … 20 Mt), the nearest segment&apos;s log–log slope is extended. This reproduces the table
              values exactly at the knots and gives physically reasonable radii in between — for example a
              15 kt weapon&apos;s 5 psi radius of about {formatRadiusKm(radiusKm(15, 'psi5'))} km, a 100 kt
              weapon&apos;s {formatRadiusKm(radiusKm(100, 'psi5'))} km, and a 50 Mt weapon&apos;s{' '}
              {formatRadiusKm(radiusKm(50000, 'psi5'))} km.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">What is not shown</h2>
          <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r text-green-300 space-y-3">
            <p>
              Casualty and fatality counts, fallout plumes, prompt-radiation doses, crater dimensions, and
              surface-burst radii are <strong className="text-yellow-400">not shown</strong>. The site
              previously estimated casualties from a single flat population density summed over overlapping
              damage rings, which double-counted people and produced unreliable numbers.
            </p>
            <p>
              Those outputs stay off until each has a verified model — a gridded population source for
              casualties and a validated fallout model for downwind contamination. No population grid is used
              at present.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <Sources c={cites} />
          <p className="mt-4 text-sm text-green-300/70">
            See the full <Link href="/sources" className="text-yellow-400 hover:underline">data sources</Link> page for
            complete references.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Important disclaimers</h2>
          <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r">
            <p className="text-green-300 mb-3">
              The simulator provides radius estimates for idealized conditions. Actual effects vary with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-green-300">
              <li>Terrain and geographic features</li>
              <li>Weather conditions and atmospheric density</li>
              <li>Building construction standards</li>
              <li>Burst height and detonation type</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
