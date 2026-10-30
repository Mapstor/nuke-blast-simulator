import { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import {
  datasetSchema,
  itemListSchema,
  breadcrumbSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { shortSpec } from '@/lib/data/weaponSpec'
import { Cite, Sources, createCitationsFrom } from '@/components/seo/Cite'
import { COUNTRIES, COUNTRY_SLUGS, row, val } from '@/lib/data/countryView'
import type { Bomb } from '@/lib/types'

const NUCLEAR_WEAPON_COUNT = bombs.filter((b) => b.type !== 'conventional' && b.id !== 'custom').length

export const metadata: Metadata = seoMetadata('/weapons')

const indexedBombs = bombs.filter((b) => b.id !== 'custom')

const weaponItems = indexedBombs.map((b) => ({
  name: `${b.name} (${b.country}, ${shortSpec(b)})`,
  url: `/weapons/${b.id}`,
  description: b.description,
}))

// ── Browse grid: nuclear weapons by yield band; conventional and accidental
// explosions grouped on their own (NBS-016: neutral bands, not role labels, and
// Halifax is not a nuclear weapon). ──────────────────────────────────────────
type YieldGroup = { heading: string; test: (b: Bomb) => boolean; bombs: Bomb[] }

const nuclearBand = (min: number, max: number) => (b: Bomb) =>
  b.type !== 'conventional' && b.yield >= min && b.yield < max

const yieldGroups: YieldGroup[] = [
  { heading: '≥ 5 Mt', test: nuclearBand(5000, Infinity), bombs: [] },
  { heading: '1–5 Mt', test: nuclearBand(1000, 5000), bombs: [] },
  { heading: '300 kt – 1 Mt', test: nuclearBand(300, 1000), bombs: [] },
  { heading: '50–300 kt', test: nuclearBand(50, 300), bombs: [] },
  { heading: '1–50 kt', test: nuclearBand(1, 50), bombs: [] },
  { heading: 'Under 1 kt', test: nuclearBand(0, 1), bombs: [] },
  { heading: 'Conventional and accidental explosions', test: (b) => b.type === 'conventional', bombs: [] },
]

for (const b of indexedBombs) {
  const g = yieldGroups.find((gg) => gg.test(b))
  if (g) g.bombs.push(b)
}
for (const g of yieldGroups) g.bombs.sort((a, c) => c.yield - a.yield)

// ── Country summary: FAS early-2026 totals read from the SAME data the country
// pages use (src/lib/data/countries.ts), each linked and cited. Iran is a status
// page (no arsenal) and is excluded, as on the by-country hub. ────────────────
const ARSENAL_SLUGS = COUNTRY_SLUGS.filter((s) => s !== 'iran')
const FLAG: Record<string, string> = {
  'united-states': '🇺🇸', russia: '🇷🇺', china: '🇨🇳', 'united-kingdom': '🇬🇧',
  france: '🇫🇷', india: '🇮🇳', pakistan: '🇵🇰', 'north-korea': '🇰🇵', israel: '🇮🇱',
}
const countrySummary = ARSENAL_SLUGS.map((slug) => {
  const c = COUNTRIES[slug]
  const total = val(c, 'warheads.fas.total_inventory')
  const stockpile = val(c, 'warheads.fas.military_stockpile')
  return {
    slug,
    name: c.name,
    flag: FLAG[slug] ?? '',
    total,
    stockpile: stockpile && stockpile !== total ? stockpile : '',
    sourceId: row(c, 'warheads.fas.total_inventory')?.sourceId ?? 'federation-of-american-scientists-status-of-worl',
  }
})
// Hub totals are literally the country-page totals (same source of truth);
// tests/weapons-hub.test.ts asserts the built HTML matches.
const FAS_CITE = 'federation-of-american-scientists-status-of-worl'

// ── Nuclear testing tally: one consistent accounting from the Arms Control
// Association "Nuclear Testing Tally" fact sheet (NBS-016). ───────────────────
const TEST_TALLY_CITE = 'arms-control-association-the-nuclear-testing-tally'
const testTally: { flag: string; country: string; value: string; note?: string }[] = [
  { flag: '🇺🇸', country: 'United States', value: '1,030', note: '1,054 including 24 joint US-UK tests' },
  { flag: '🇷🇺', country: 'Soviet Union / Russia', value: '715' },
  { flag: '🇫🇷', country: 'France', value: '210' },
  { flag: '🇬🇧', country: 'United Kingdom', value: '45' },
  { flag: '🇨🇳', country: 'China', value: '45' },
  { flag: '🇮🇳', country: 'India', value: '3', note: '6 devices; simultaneous explosions counted as one test' },
  { flag: '🇵🇰', country: 'Pakistan', value: '2', note: 'up to 6 devices claimed; same-day explosions counted as one test' },
  { flag: '🇰🇵', country: 'North Korea', value: '6' },
]
const TEST_TOTAL = '2,056'
const TEST_ATMOSPHERIC = '528'
const TEST_UNDERGROUND = '1,528'

// ── Historical weapons by era. Every row carries its source id. ───────────────
type EraRow = { weapon: string; country: string; year: string; yieldText: string; col5: string; col6: string; cite: string }

const firstGen: EraRow[] = [
  { weapon: 'Little Boy', country: '🇺🇸 United States', year: '1945', yieldText: '15 kt', col5: 'Gun-type uranium', col6: 'Hiroshima, August 6, 1945', cite: 'us-doe-nnsa-nevada-field-office-united-states-nu;national-museum-of-the-us-air-force-little-boy-a' },
  { weapon: 'Fat Man', country: '🇺🇸 United States', year: '1945', yieldText: '21 kt', col5: 'Implosion plutonium', col6: 'Nagasaki, August 9, 1945', cite: 'us-doe-nnsa-nevada-field-office-united-states-nu;national-museum-of-the-us-air-force-fat-man-atom' },
  { weapon: 'Trinity Test', country: '🇺🇸 United States', year: '1945', yieldText: '25 kt', col5: 'Implosion plutonium', col6: 'First nuclear test, New Mexico (24.8 ±2 kt, LANL 2021; official 21 kt)', cite: 'los-alamos-national-laboratory-revising-trinity' },
  { weapon: 'Joe-1', country: '🇷🇺 Soviet Union', year: '1949', yieldText: '22 kt', col5: 'Implosion plutonium', col6: 'First Soviet nuclear test (Western codename Joe-1)', cite: 'nuclear-weapon-archive-soviet-atmospheric-tests;atomic-archive-the-soviet-atomic-bomb' },
]
const thermoEra: EraRow[] = [
  { weapon: 'Ivy Mike', country: '🇺🇸 United States', year: '1952', yieldText: '10.4 Mt', col5: 'H-bomb test', col6: 'First full-scale hydrogen bomb test', cite: 'us-doe-nnsa-nevada-field-office-united-states-nu;atomic-archive-mike-device-is-tested' },
  { weapon: 'Castle Bravo', country: '🇺🇸 United States', year: '1954', yieldText: '15 Mt', col5: 'H-bomb test', col6: 'Largest US nuclear test', cite: 'us-doe-nnsa-nevada-field-office-united-states-nu' },
  { weapon: 'Joe-4', country: '🇷🇺 Soviet Union', year: '1953', yieldText: '400 kt', col5: 'Thermonuclear test', col6: 'First Soviet thermonuclear test', cite: 'nuclear-weapon-archive-soviet-atmospheric-tests' },
  { weapon: 'RDS-37', country: '🇷🇺 Soviet Union', year: '1955', yieldText: '1.6 Mt', col5: 'H-bomb test', col6: 'First Soviet two-stage (radiation-implosion) H-bomb', cite: 'nuclear-weapon-archive-soviet-atmospheric-tests' },
  { weapon: 'Tsar Bomba', country: '🇷🇺 Soviet Union', year: '1961', yieldText: '50 Mt', col5: 'H-bomb test', col6: 'Largest nuclear weapon ever tested', cite: 'nuclear-weapon-archive-soviet-atmospheric-tests' },
  { weapon: 'W53', country: '🇺🇸 United States', year: '1962', yieldText: '9 Mt', col5: 'ICBM warhead', col6: 'Titan II missile warhead', cite: 'nuclear-weapon-archive-complete-list-of-all-u-s' },
]
const modernEra: EraRow[] = [
  { weapon: 'W76-1', country: '🇺🇸 United States', year: '2008', yieldText: '90 kt', col5: 'SLBM (Trident)', col6: 'Active', cite: 'nuclear-weapon-archive-complete-list-of-all-u-s;bulletin-of-the-atomic-scientists-fas-united-sta' },
  { weapon: 'W87', country: '🇺🇸 United States', year: '1986', yieldText: '300 kt', col5: 'ICBM (Minuteman III)', col6: 'Active', cite: 'nuclear-weapon-archive-complete-list-of-all-u-s;bulletin-of-the-atomic-scientists-fas-united-sta' },
  { weapon: 'B61 (Mod 12)', country: '🇺🇸 United States', year: '2021', yieldText: '0.3–50 kt', col5: 'Gravity bomb', col6: 'First production unit Nov 2021', cite: 'us-doe-nnsa-b61-12-life-extension-program-fact-s;nuclear-weapon-archive-complete-list-of-all-u-s' },
  { weapon: 'R-36M2 (SS-18)', country: '🇷🇺 Russia', year: '1988', yieldText: 'up to 10 warheads (MIRV)', col5: 'Heavy ICBM', col6: 'Being replaced', cite: 'bulletin-of-the-atomic-scientists-russian-nuclea;bulletin-of-the-atomic-scientists-fas-russian-nu' },
  { weapon: 'RS-28 Sarmat', country: '🇷🇺 Russia', year: 'first flight test 2022', yieldText: '10 × ~500 kt (MIRV, est.)', col5: 'Heavy ICBM', col6: 'Not yet on combat duty (Mar 2026)', cite: 'bulletin-of-the-atomic-scientists-russian-nuclea;bulletin-of-the-atomic-scientists-fas-russian-nu' },
]

// Every citation id that renders anywhere on the page, pre-registered in DOM
// order so no [n] can point past the Sources list (D-36).
const ALL_CITE_IDS = [
  FAS_CITE,
  'us-doe-nnsa-u-s-nuclear-weapons-stockpile-transparency',
  ...countrySummary.map((c) => c.sourceId),
  TEST_TALLY_CITE,
  ...firstGen.flatMap((r) => r.cite.split(';')),
  ...thermoEra.flatMap((r) => r.cite.split(';')),
  ...modernEra.flatMap((r) => r.cite.split(';')),
  'federation-of-american-scientists-bulletin-of-th-2',
  'bulletin-of-the-atomic-scientists-fas-russian-nu',
  'bulletin-of-the-atomic-scientists-chinese-nuclea',
  'us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5',
  'arms-control-association-the-status-of-the-comp',
]

function EraTable({ title, head5, head6, rows, cites }: {
  title: string
  head5: string
  head6: string
  rows: EraRow[]
  cites: ReturnType<typeof createCitationsFrom>
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-yellow-400">{title}</h3>
      <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-green-500/30">
                <th className="text-left py-2 text-green-400">Weapon</th>
                <th className="text-left py-2 text-green-400">Country</th>
                <th className="text-left py-2 text-green-400">Year</th>
                <th className="text-left py-2 text-green-400">Yield</th>
                <th className="text-left py-2 text-green-400">{head5}</th>
                <th className="text-left py-2 text-green-400">{head6}</th>
              </tr>
            </thead>
            <tbody className="text-green-300">
              {rows.map((r) => (
                <tr key={r.weapon} className="border-b border-green-500/20">
                  <td className="py-2 font-semibold">{r.weapon}</td>
                  <td>{r.country}</td>
                  <td>{r.year}</td>
                  <td className="text-yellow-400">{r.yieldText}</td>
                  <td>{r.col5}</td>
                  <td>{r.col6}<Cite c={cites} ids={r.cite} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function WeaponsPage() {
  const cites = createCitationsFrom(ALL_CITE_IDS)
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-weapons"
        schema={[
          datasetSchema({
            url: '/weapons',
            name: 'Nuclear Weapons Database',
            description:
              `Catalog of ${NUCLEAR_WEAPON_COUNT} historical and modern nuclear weapons with yields, countries of origin, year first deployed or tested, and weapon type. Each entry cites its source.`,
            numberOfItems: weaponItems.length,
            keywords: [
              'nuclear weapons', 'Tsar Bomba', 'Castle Bravo', 'Little Boy', 'Fat Man',
              'B83', 'W88', 'thermonuclear', 'kiloton', 'megaton', 'Hiroshima', 'Nagasaki', 'nuclear arsenal',
            ],
          }),
          itemListSchema(weaponItems, 'Nuclear Weapons'),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Weapons Database', url: '/weapons' },
          ]),
        ]}
      />
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">{pageH1('/weapons')}</h1>

        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Historical Educational Data</h2>
          <p className="text-red-300 text-lg">
            This database contains historical information about nuclear weapons for educational purposes only.
            Data is compiled from declassified and published sources, each cited below.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Browse All {indexedBombs.length} Weapons</h2>
          <p className="text-green-300 mb-6">
            Click any weapon for its detailed profile and sources. Nuclear entries include a computed
            blast-radius profile and a one-click simulator preset; conventional bombs and historical explosions
            are reference pages (they are not in the simulator). Browse below by yield band.
          </p>

          {yieldGroups.map((group) => {
            if (group.bombs.length === 0) return null
            return (
              <div key={group.heading} className="mb-8">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  {group.heading} <span className="text-xs text-green-300/70 font-normal">({group.bombs.length})</span>
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.bombs.map((b) => (
                    <Link
                      key={b.id}
                      href={`/weapons/${b.id}`}
                      className="block bg-black/50 border border-green-500/30 rounded-lg p-3 hover:border-green-400 transition"
                    >
                      <div className="font-semibold text-yellow-400 text-sm">{b.name}</div>
                      <div className="text-xs text-green-300 mt-0.5">{shortSpec(b)}</div>
                      <div className="text-[11px] text-green-300/70 mt-0.5">
                        {b.country}{b.year ? ` · ${b.year}` : ''}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}

          <p className="text-sm text-green-300/70 mt-4">
            Want to compare two weapons head-to-head? See{' '}
            <Link href="/compare" className="text-yellow-400 hover:underline">all comparison pages</Link>{' '}
            (Tsar Bomba vs Castle Bravo, Little Boy vs Fat Man, etc.). Want to drop a specific weapon
            on a specific city? Open the{' '}
            <Link href="/examples" className="text-yellow-400 hover:underline">cities</Link> or run it on the{' '}
            <Link href="/" className="text-yellow-400 hover:underline">interactive map</Link>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Nuclear Arsenals by Country</h2>
          <p className="text-green-300 mb-4">
            Total warhead inventories at the beginning of 2026, from the Federation of American Scientists.
            <Cite c={cites} ids={FAS_CITE} /> Each figure matches that country&apos;s own page — follow a link
            for its delivery systems, test history and sources.
          </p>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {countrySummary.map((c) => (
                <Link
                  key={c.slug}
                  href={`/nuclear-weapons-by-country/${c.slug}`}
                  className="block border border-green-500/20 rounded p-4 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-green-400">{c.flag} {c.name}</div>
                  <div className="text-sm text-green-300 mt-1">
                    <span className="text-yellow-400 font-semibold">{c.total}</span> warheads
                    {c.stockpile ? <span className="text-green-300/70"> ({c.stockpile} stockpiled)</span> : null}
                  </div>
                </Link>
              ))}
            </div>
            <p className="text-sm text-green-300/70 mt-4">
              The US stockpile peaked at 31,255 warheads at the end of fiscal year 1967 and stood at 3,748 as of
              September 2023.<Cite c={cites} ids="us-doe-nnsa-u-s-nuclear-weapons-stockpile-transparency" /> See all{' '}
              <Link href="/nuclear-weapons-by-country" className="text-yellow-400 hover:underline">nuclear weapons by country</Link>.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Historical Weapons by Era</h2>
          <EraTable title="First Generation Nuclear Weapons (1945–1955)" head5="Type" head6="Historical use" rows={firstGen} cites={cites} />
          <EraTable title="Thermonuclear Era (1950s–1960s)" head5="Type" head6="Notes" rows={thermoEra} cites={cites} />
          <EraTable title="Modern Era (1970s–Present)" head5="Delivery" head6="Status" rows={modernEra} cites={cites} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Yield Scale</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-gray-500 rounded shrink-0"></div>
                <span className="text-gray-300">Conventional bombs: about 0.1–44 t of explosive (0.0001–0.044 kt)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-4 bg-orange-500 rounded shrink-0"></div>
                <span className="text-orange-300">
                  Strategic warheads: about 100–800 kt, a few exceeding 1 Mt
                  <Cite c={cites} ids="federation-of-american-scientists-bulletin-of-th-2;bulletin-of-the-atomic-scientists-fas-russian-nu;bulletin-of-the-atomic-scientists-chinese-nuclea" />
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-4 bg-red-500 rounded shrink-0"></div>
                <span className="text-red-300">Thermonuclear weapons: from under 100 kt to 50 Mt (largest test)</span>
              </div>
            </div>
            <p className="mt-4 text-green-300 text-sm">
              1 kiloton (kt) = 1,000 tons of TNT equivalent; 1 megaton (Mt) = 1,000,000 tons of TNT equivalent.
              <Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5" />
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Nuclear Testing History</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                Nuclear tests by country<Cite c={cites} ids={TEST_TALLY_CITE} />
              </h3>
              <div className="space-y-2 text-green-300">
                {testTally.map((t) => (
                  <div key={t.country}>
                    <div className="flex justify-between">
                      <span>{t.flag} {t.country}:</span>
                      <span className="font-semibold">{t.value}</span>
                    </div>
                    {t.note ? <div className="text-xs text-green-300/60">{t.note}</div> : null}
                  </div>
                ))}
                <div className="border-t border-green-500/30 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-red-400">
                    <span>Total:</span>
                    <span>{TEST_TOTAL}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Testing timeline</h3>
              <div className="space-y-3 text-green-300">
                <div>
                  <div className="font-semibold text-blue-400">Atmospheric era (1945–1980)</div>
                  <div className="text-sm">{TEST_ATMOSPHERIC} atmospheric tests<Cite c={cites} ids={TEST_TALLY_CITE} /></div>
                </div>
                <div>
                  <div className="font-semibold text-green-400">Underground era (1957–2017)</div>
                  <div className="text-sm">{TEST_UNDERGROUND} underground tests<Cite c={cites} ids={TEST_TALLY_CITE} /></div>
                </div>
                <div>
                  <div className="font-semibold text-orange-400">CTBT era (1996–present)</div>
                  <div className="text-sm">
                    The Comprehensive Nuclear-Test-Ban Treaty opened for signature in 1996 but is not in force.
                    Only India, Pakistan (1998) and North Korea (2006–2017) have tested since.
                    <Cite c={cites} ids="arms-control-association-the-status-of-the-comp;arms-control-association-the-nuclear-testing-tally" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Data sources</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-2 text-green-300">
              Every figure on this page is cited to the source listed below; browse the full{' '}
              <Link href="/sources" className="text-yellow-400 hover:underline">data sources</Link> page for the
              complete reference list behind the weapons, arsenals and effect calculations.
            </p>
            <div className="mt-4 bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-300">
                Note: yield and warhead estimates for classified weapons vary between sources. These figures
                are the best available unclassified estimates, cited, for educational use.
              </p>
            </div>
          </div>
        </section>

        <Sources c={cites} />
      </main>
    </div>
  )
}
