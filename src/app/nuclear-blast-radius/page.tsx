import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { Byline } from '@/components/Byline'
import {
  articleSchema,
  datasetSchema,
  faqPageSchema,
  breadcrumbSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import {
  effectRadiiKm,
  formatRadiusKm,
  formatRadiusMi,
  formatRadiusDual,
} from '@/lib/calculations/effects'
import { radiusKm, radiusDual, dualProse, radiusOr } from '@/lib/calculations/radius'
import { Cite, Sources, createCitations, ENGINE_SOURCE_IDS } from '@/components/seo/Cite'
import { bombs } from '@/lib/data/bombs'
import { BlastRadiusCalculator } from '@/components/tools/BlastRadiusCalculator'
import {
  HeroRings,
  YieldScaleChart,
  yieldChartLegend,
  WorkedExampleBars,
} from '@/components/tools/BlastRadiusDiagrams'

const PATH = '/nuclear-blast-radius'
export const metadata: Metadata = seoMetadata(PATH)

// Every row is computed from the engine; weapon rows link to their profile.
const TABLE_ROWS: Array<{ kt: number; id?: string; name?: string }> = [
  { kt: 1 },
  { kt: 10 },
  { kt: 15, id: 'little-boy', name: 'Little Boy' },
  { kt: 21, id: 'fat-man', name: 'Fat Man' },
  { kt: 100 },
  { kt: 300, id: 'w87', name: 'W87' },
  { kt: 455, id: 'w88', name: 'W88' },
  { kt: 1000 },
  { kt: 1200, id: 'b83', name: 'B83' },
  { kt: 10000 },
  { kt: 15000, id: 'castle-bravo', name: 'Castle Bravo' },
  { kt: 50000, id: 'tsar-bomba', name: 'Tsar Bomba' },
]

const RING_COLUMNS: Array<{ key: keyof ReturnType<typeof effectRadiiKm>; label: string }> = [
  { key: 'fireball', label: 'Fireball' },
  { key: 'overpressure20psi', label: '20 psi' },
  { key: 'overpressure5psi', label: '5 psi' },
  { key: 'overpressure1psi', label: '1 psi' },
  { key: 'thermal3rdDegree', label: '3rd burns' },
  { key: 'thermal2ndDegree', label: '2nd burns' },
  { key: 'thermal1stDegree', label: '1st burns' },
]

function yieldLabel(kt: number): string {
  return kt >= 1000 ? `${kt / 1000} Mt` : `${kt} kt`
}

// Area of a circle of the given km radius, in square miles (for a callout).
function areaSqMi(km: number): string {
  const mi = km * 0.621371
  return Math.round(Math.PI * mi * mi).toLocaleString()
}
function areaSqKm(km: number): string {
  return Math.round(Math.PI * km * km).toLocaleString()
}

// Current-warhead yields already in the database, for the missile section.
const MISSILE_WARHEADS = ['w76', 'w87', 'w88', 'b61', 'b83']
  .map((id) => bombs.find((b) => b.id === id))
  .filter((b): b is NonNullable<typeof b> => Boolean(b))

// FAQ — demand-ordered from the ledger tertiaries. Answers are self-contained
// and every radius is engine-derived (helpers return strings for the schema).
const FAQ = [
  {
    question: 'What is the blast radius of a nuclear bomb?',
    answer:
      `It depends entirely on the yield. The "blast radius" usually means the 5 psi ring, where most houses collapse. For a 1-megaton air burst that ring is ${radiusDual(1000, 'psi5')}; for the 15-kiloton Hiroshima bomb it is ${radiusDual(15, 'psi5')}; for the 50-megaton Tsar Bomba it is ${radiusDual(50000, 'psi5')}. The full chart on this page lists every yield from 1 kt to 50 Mt.`,
  },
  {
    question: 'How far does a nuke reach?',
    answer:
      `Blast and heat reach much farther than the fireball. A 1-megaton air burst shatters windows (1 psi) out to ${radiusDual(1000, 'psi1')} and causes first-degree burns to ${radiusDual(1000, 'burn1')}. At 50 megatons the heat flash reaches ${radiusDual(50000, 'burn1')}. Radioactive fallout can travel much farther still, but it depends on wind and burst height and is not modeled here.`,
  },
  {
    question: 'How big is a nuclear explosion?',
    answer:
      `The visible fireball is smaller than people expect. A 1-megaton air-burst fireball is about ${radiusDual(1000, 'fireball')} in radius; even the 50-megaton Tsar Bomba fireball is ${radiusDual(50000, 'fireball')}. The destruction comes from the blast wave and heat that spread well beyond the fireball, not from the fireball itself.`,
  },
  {
    question: 'What is the blast radius of a nuke in miles?',
    answer:
      `For a typical 300-kiloton modern warhead, the 5 psi "most homes destroyed" radius is about ${formatRadiusMi(radiusKm(300, 'psi5'))} miles and windows break (1 psi) out to about ${formatRadiusMi(radiusKm(300, 'psi1'))} miles. The chart on this page gives miles and kilometers for every ring and every yield.`,
  },
  {
    question: 'How much damage does a nuke do?',
    answer:
      'Damage is graded by overpressure. At 20 psi even reinforced-concrete buildings fail; at 5 psi most houses collapse; at 1 psi windows shatter and flying glass injures people. Separately, the heat flash burns exposed skin out past the blast zone. This page shows the radius of each of those effects for any yield.',
  },
  {
    question: 'Does a bigger bomb mean a proportionally bigger blast radius?',
    answer:
      `No. Blast radius grows with roughly the cube root of yield, so returns shrink fast. Going from 1 kiloton to 1 megaton is 1,000 times the energy but only about 10 times the 5 psi radius, from ${radiusDual(1, 'psi5')} to ${radiusDual(1000, 'psi5')}. That is why very large weapons spread their energy inefficiently.`,
  },
  {
    question: 'What is the nuclear missile blast radius for modern warheads?',
    answer:
      `Most deployed warheads today are in the 100-to-500-kiloton range, far smaller than Cold War test monsters. A 455-kiloton W88 (a US submarine warhead) has a 5 psi radius of about ${radiusDual(455, 'psi5')} and a 300-kiloton W87 (an ICBM warhead) about ${radiusDual(300, 'psi5')}.`,
  },
]

const breadcrumbs = [
  { name: 'Home', url: SITE_URL },
  { name: 'Blast radius', url: PATH },
]

const TOC = [
  ['what-blast-radius-means', 'What a blast radius means'],
  ['fireball', 'The fireball'],
  ['overpressure', 'Overpressure and psi'],
  ['thermal-radiation', 'Thermal radiation and burns'],
  ['air-burst', 'Air burst vs surface burst'],
  ['scaling', 'How the radius grows with yield'],
  ['how-far', 'How far a nuke reaches'],
  ['missile', 'Nuclear missile blast radius'],
  ['uses', 'Ways to use this'],
  ['faq', 'FAQ'],
  ['methodology', 'Methodology and sources'],
]

export default function NuclearBlastRadiusPage() {
  const cites = createCitations()
  const legend = yieldChartLegend()

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-blast-radius"
        schema={[
          articleSchema({
            url: PATH,
            headline: pageH1(PATH),
            description: metadata.description as string,
          }),
          datasetSchema({
            url: PATH,
            name: 'Nuclear blast effect radii by yield (1 kt to 50 Mt)',
            description:
              'Fireball, 20/5/1 psi blast and 1st/2nd/3rd-degree thermal-burn radii for an air burst at optimum height, computed from Glasstone & Dolan scaling laws, for yields from 1 kiloton to 50 megatons.',
            numberOfItems: TABLE_ROWS.length,
            keywords: ['nuclear blast radius', 'blast radius chart', 'fireball radius', 'overpressure', 'thermal radiation'],
          }),
          faqPageSchema(FAQ),
          breadcrumbSchema(breadcrumbs),
        ]}
      />

      <main className="max-w-4xl mx-auto px-5 py-8 md:p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Blast radius</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1(PATH)}</h1>
          <p className="text-lg text-green-300">
            How big is a nuclear explosion? Enter any yield, or pick a weapon, and get every damage ring in
            miles and kilometers.
          </p>
          <p className="text-sm text-green-300/70 mt-1">
            Computed from the Glasstone &amp; Dolan scaling laws, the same engine as our{' '}
            <Link href="/" className="text-yellow-400 hover:underline">interactive map</Link>. Air burst at optimum
            height; methodology below.
          </p>
          <Byline className="mt-2" />
        </header>

        {/* ── The tool ── */}
        <section aria-label="Blast radius calculator" className="mb-8">
          <BlastRadiusCalculator />
        </section>

        {/* ── Direct answer ── */}
        <section className="mb-8 bg-black/40 border border-green-500/20 rounded-lg p-5">
          <p className="text-green-200">
            A <strong className="text-yellow-400">nuclear blast radius</strong> is how far each effect of the
            explosion reaches from the point of detonation. For the 15-kiloton Little Boy, the 5 psi zone that
            collapses most houses reaches <strong className="text-yellow-400">{radiusDual(15, 'psi5')}</strong>;
            for the 50-megaton Tsar Bomba it reaches <strong className="text-yellow-400">{radiusDual(50000, 'psi5')}</strong>.
            Heat and lighter blast damage reach several times farther.
          </p>
        </section>

        {/* ── TOC ── */}
        <nav aria-label="On this page" className="mb-10 text-sm">
          <h2 className="text-xs uppercase tracking-wider text-green-300/60 mb-2">On this page</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {TOC.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-yellow-400 hover:underline">{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Hero figure ── */}
        <figure className="mb-10">
          <HeroRings />
          <figcaption className="text-sm text-green-300/70 mt-2">
            The seven effect rings of a <strong className="text-green-300">1-megaton air burst</strong>, drawn to
            scale. The fireball is tiny next to the blast and heat rings: the 1 psi window-breaking ring
            ({radiusOr(1000, 'psi1')}) reaches about 18 times farther than the fireball
            ({radiusOr(1000, 'fireball')}). Values from the scaling-law engine.<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
          </figcaption>
        </figure>

        {/* ── What blast radius means ── */}
        <section id="what-blast-radius-means" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">What a blast radius means</h2>
          <p className="text-green-300 mb-3">
            A nuclear explosion does not have one edge. It produces a set of nested effects, each reaching a
            different distance, so a bomb has not one radius but several. The useful way to read &ldquo;blast
            radius&rdquo; is as a <strong className="text-yellow-400">set of rings</strong>: the fireball, three
            levels of blast pressure, and three levels of heat burn.
          </p>
          <p className="text-green-300 mb-3">
            When a single number is quoted, it is almost always the <strong className="text-yellow-400">5 psi
            overpressure radius</strong>, the distance within which most ordinary houses collapse. On this page
            the calculator and the chart below give you all seven rings at once, in miles first and kilometers in
            parentheses, so you never have to guess which one a headline meant.
          </p>
        </section>

        {/* ── Crawlable twin: the wedge table ── */}
        <section id="chart" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Nuclear blast radius chart: 1 kt to 50 Mt</h2>
          <p className="text-green-300 mb-4">
            Every radius here is produced by the same engine as the calculator and the map, for an air burst at
            optimum height. Each number is <Link href="/methodology" className="text-yellow-400 hover:underline">calculated
            from scaling laws</Link>, not measured. Named rows link to the full weapon profile.<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
          </p>

          <div className="overflow-x-auto border border-green-500/30 rounded-lg">
            <table className="w-full text-xs sm:text-sm text-green-300 whitespace-nowrap">
              <caption className="sr-only">
                Nuclear blast effect radii in miles (kilometers) by yield, for an air burst at optimum height.
              </caption>
              <thead>
                <tr className="border-b border-green-500/30 text-yellow-400">
                  <th scope="col" className="text-left p-2 sticky left-0 bg-gray-900">Yield</th>
                  {RING_COLUMNS.map((c) => (
                    <th scope="col" key={c.key} className="text-right p-2">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => {
                  const r = effectRadiiKm(row.kt)
                  return (
                    <tr key={row.kt} className="border-b border-green-500/10">
                      <th scope="row" className="text-left p-2 font-normal sticky left-0 bg-gray-900">
                        <span className="text-green-200 font-semibold">{yieldLabel(row.kt)}</span>
                        {row.id ? (
                          <>
                            {' '}
                            <Link href={`/weapons/${row.id}`} className="text-yellow-400 hover:underline">
                              {row.name}
                            </Link>
                          </>
                        ) : null}
                      </th>
                      {RING_COLUMNS.map((c) => (
                        <td key={c.key} className="text-right p-2 tabular-nums">
                          {formatRadiusDual(r[c.key])}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-green-300/60 mt-2">
            Fireball: Glasstone &amp; Dolan 1977 §2.127. Blast and thermal: the standard scaling-law table (optimum-height
            air bursts). Values in mi (km); swipe sideways on a phone to see every ring.<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
          </p>
        </section>

        {/* ── Stat callout 1 ── */}
        <aside className="mb-10 bg-black/60 border border-yellow-400/40 rounded-lg p-5">
          <p className="text-lg text-green-200">
            A <strong className="text-yellow-400">1-megaton air burst</strong> destroys most homes out to{' '}
            <strong className="text-yellow-400">{radiusDual(1000, 'psi5')}</strong>, a circle of about{' '}
            <strong className="text-yellow-400">{areaSqMi(radiusKm(1000, 'psi5'))} square miles ({areaSqKm(radiusKm(1000, 'psi5'))} km²)</strong>.
          </p>
          <p className="text-xs text-green-300/60 mt-2">
            Source: scaling-law engine (Glasstone &amp; Dolan 1977 and the effects scaling table).<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
          </p>
        </aside>

        {/* ── Worked example ── */}
        <section id="worked-example" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Worked example: a 1-megaton air burst</h2>
          <p className="text-green-300 mb-4">
            Take a <strong className="text-yellow-400">1-megaton</strong> bomb, roughly the size of the B83, the
            largest weapon still in the US stockpile. Detonated as an air burst, it produces these seven rings,
            closest to farthest:
          </p>
          <div className="bg-black/40 border border-green-500/20 rounded-lg p-4 mb-4">
            <WorkedExampleBars yieldKt={1000} />
          </div>
          <p className="text-green-300 mb-3">
            The <strong className="text-yellow-400">fireball</strong> ({radiusOr(1000, 'fireball')}) vaporizes
            anything inside it, but it is the smallest ring. The <strong className="text-yellow-400">20 psi</strong>{' '}
            ring ({radiusOr(1000, 'psi20')}) destroys even heavy concrete buildings; the{' '}
            <strong className="text-yellow-400">5 psi</strong> ring ({radiusOr(1000, 'psi5')}) collapses most houses
            &mdash; this is the number most people mean by &ldquo;blast radius.&rdquo;
          </p>
          <p className="text-green-300">
            Lighter blast reaches much farther: <strong className="text-yellow-400">1 psi</strong>{' '}
            ({radiusOr(1000, 'psi1')}) shatters windows. And the heat flash burns exposed skin to the edge of the
            map: first-degree burns out to {radiusDual(1000, 'burn1')}, farther than the 5 psi blast.
          </p>
        </section>

        {/* ── How to read your results ── */}
        <section id="how-to-read" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">How to read your results</h2>
          <p className="text-green-300 mb-4">Each ring answers a different question. From the center outward:</p>
          <dl className="space-y-3 text-green-300">
            <div><dt className="font-semibold text-yellow-400">Fireball</dt><dd>The sphere of plasma at the detonation point. Anything inside is vaporized. It is the smallest radius and sets the scale for the rest.</dd></div>
            <div><dt className="font-semibold text-yellow-400">20 psi (severe blast)</dt><dd>The pressure that collapses reinforced-concrete buildings. Survival is near zero inside this ring.<Cite c={cites} ids="us-congress-office-of-technology-assessment-via" /></dd></div>
            <div><dt className="font-semibold text-yellow-400">5 psi (moderate blast)</dt><dd>The headline &ldquo;blast radius.&rdquo; Most houses collapse and fires start.</dd></div>
            <div><dt className="font-semibold text-yellow-400">1 psi (light blast)</dt><dd>Windows shatter across a wide area; flying glass is the main injury. It covers by far the largest area of the blast rings.</dd></div>
            <div><dt className="font-semibold text-yellow-400">3rd / 2nd / 1st-degree burns</dt><dd>How far the heat flash can burn exposed skin, from severe (3rd) to sunburn-like (1st). These assume clear weather and a direct line of sight to the fireball.</dd></div>
          </dl>
        </section>

        {/* ── Fireball ── */}
        <section id="fireball" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">The fireball</h2>
          <p className="text-green-300 mb-3">
            The <strong className="text-yellow-400">fireball</strong> is the sphere of superheated gas at the center of
            the explosion. For a split second it reaches tens of millions of degrees, as hot as the center of the
            Sun.<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-3" /> Everything inside it is vaporized.
          </p>
          <p className="text-green-300">
            It is also the smallest ring, and it grows slowly: fireball radius scales with yield to the 0.4 power. A
            15-kiloton bomb makes a {dualProse(radiusKm(15, 'fireball'))} fireball; a 1,000-times-larger 15-megaton bomb
            makes one of only {dualProse(radiusKm(15000, 'fireball'))}. The destruction you picture comes from the blast
            wave and the heat, not from the fireball touching you.
          </p>
        </section>

        {/* ── Overpressure and psi ── */}
        <section id="overpressure" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Overpressure and psi</h2>
          <p className="text-green-300 mb-3">
            <strong className="text-yellow-400">Overpressure</strong> is the pressure of the blast wave above normal
            air pressure, measured in pounds per square inch. It is how blast damage is graded: 20 psi destroys
            reinforced concrete, 5 psi collapses most homes, and 1 psi breaks windows.<Cite c={cites} ids="us-congress-office-of-technology-assessment-via" />
          </p>
          <p id="psi" className="text-green-300 scroll-mt-24">
            <strong className="text-yellow-400">Psi</strong> (pounds per square inch) is just the unit of that
            pressure. A few psi sounds small, but a 5 psi wall of air moving at highway speed is what flattens a
            neighborhood. Overpressure radius grows with roughly the cube root of yield, which is why the rings widen
            so slowly as bombs get bigger.<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2" />
          </p>
        </section>

        {/* ── Thermal radiation and burns ── */}
        <section id="thermal-radiation" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Thermal radiation and burns</h2>
          <p className="text-green-300 mb-3">
            <strong className="text-yellow-400">Thermal radiation</strong> is the flash of light and infrared heat
            that leaves the fireball at the speed of light. Because it travels in straight lines, it burns any
            exposed skin with a clear view of the fireball, often farther than the blast wave reaches.
          </p>
          <p id="second-degree-burns" className="text-green-300 scroll-mt-24">
            Burns are graded by depth. <strong className="text-yellow-400">Second-degree burns</strong> blister the
            skin; third-degree burns destroy it; first-degree burns are like sunburn. For a 1-megaton air burst,
            second-degree burns reach {radiusDual(1000, 'burn2')} and first-degree burns {radiusDual(1000, 'burn1')}.
            These ranges assume clear weather; haze, cloud or terrain shorten them.<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
          </p>
        </section>

        {/* ── Air burst vs surface burst ── */}
        <section id="air-burst" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Air burst vs surface burst</h2>
          <p className="text-green-300 mb-3">
            An <strong className="text-yellow-400">air burst</strong> detonates the weapon above the ground, at the
            height that maximizes the area covered by a chosen blast pressure. Hiroshima and Nagasaki were both air
            bursts. It produces the widest blast and thermal rings and very little local fallout. Every number on
            this page assumes an air burst at optimum height, because that is the case the engine models.
          </p>
          <p id="surface-burst" className="text-green-300 scroll-mt-24">
            A <strong className="text-yellow-400">surface burst</strong> detonates at ground level. For most
            overpressures its blast reaches less far than an optimum-height air burst, but it digs a crater and throws
            up heavy radioactive <Link href="/glossary/fallout" className="text-yellow-400 hover:underline">fallout</Link>{' '}
            that drifts downwind. Surface-burst radii are not shown here: the scaling the site uses is verified for
            air bursts only, and unverified effects are withheld rather than guessed.
          </p>
        </section>

        {/* ── Scaling + supporting chart ── */}
        <section id="scaling" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">How the radius grows with yield</h2>
          <p className="text-green-300 mb-4">
            Blast radius grows with roughly the <strong className="text-yellow-400">cube root of yield</strong>, so
            each extra ton of explosive buys less reach than the last. A 1,000-fold jump in yield (from 1 kiloton
            to 1 megaton) widens the 5 psi ring only about tenfold, from {radiusDual(1, 'psi5')} to{' '}
            {radiusDual(1000, 'psi5')}.<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2" /> The chart shows that
            flattening across the whole database.
          </p>
          <figure className="mb-3">
            <YieldScaleChart />
            <figcaption className="text-sm text-green-300/70 mt-2">
              <span className="block mb-1">5 psi blast radius versus yield. Each colored dot on the chart is a database weapon:</span>
              <span className="flex flex-wrap gap-x-4 gap-y-1">
                {legend.map((m) => (
                  <span key={m.n} className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} aria-hidden="true" /> {m.name} ({m.yieldLabel}): {m.dual}
                  </span>
                ))}
              </span>
            </figcaption>
          </figure>
        </section>

        {/* ── How far a nuke reaches ── */}
        <section id="how-far" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">How far a nuke reaches</h2>
          <p className="text-green-300 mb-3">
            &ldquo;How far does a nuke reach?&rdquo; has three answers, because blast, heat and fallout travel
            differently. <strong className="text-yellow-400">Blast</strong> reaches the 1 psi window-breaking line,
            {' '}{radiusDual(1000, 'psi1')} for a 1-megaton air burst. <strong className="text-yellow-400">Heat</strong>{' '}
            can reach farther: first-degree burns extend to {radiusDual(1000, 'burn1')} at 1 megaton, and to{' '}
            {radiusDual(50000, 'burn1')} for the 50-megaton Tsar Bomba &mdash; past even its 1 psi blast
            ({radiusOr(50000, 'psi1')}).<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
          </p>
          <p className="text-green-300">
            <strong className="text-yellow-400">Fallout</strong> can travel hundreds of miles downwind, far beyond any
            blast or heat ring, but only from a surface burst and only in a pattern set by the wind. Because that
            depends on weather, it is not part of these radii; see the{' '}
            <Link href="/glossary/fallout" className="text-yellow-400 hover:underline">fallout</Link> definition for how
            it behaves.
          </p>
        </section>

        {/* ── Nuclear missile blast radius ── */}
        <section id="missile" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Nuclear missile blast radius</h2>
          <p className="text-green-300 mb-4">
            People searching for a &ldquo;nuclear missile blast radius&rdquo; usually picture a Tsar-Bomba-sized
            blast. Real deployed warheads are far smaller: most sit in the 100-to-500-kiloton range to pack several
            onto one missile. Here is the 5 psi radius for the warheads in the database:<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
          </p>
          <ul className="space-y-1 text-green-300">
            {MISSILE_WARHEADS.map((b) => (
              <li key={b.id}>
                <Link href={`/weapons/${b.id}`} className="text-yellow-400 hover:underline">{b.name}</Link>{' '}
                ({yieldLabel(b.yield)}): 5 psi radius {radiusDual(b.yield, 'psi5')}
              </li>
            ))}
          </ul>
          <p className="text-green-300 mt-3">
            A single <strong className="text-yellow-400">ICBM</strong> often carries several of these on independent
            warheads, so the real question is less about one blast radius than about many at once. See the{' '}
            <Link href="/nuclear-weapons-by-country" className="text-yellow-400 hover:underline">arsenals by country</Link>{' '}
            for how many each nation fields.
          </p>
        </section>

        {/* ── Stat callout 2 ── */}
        <aside className="mb-10 bg-black/60 border border-yellow-400/40 rounded-lg p-5">
          <p className="text-lg text-green-200">
            At the top end, <strong className="text-yellow-400">heat outruns blast</strong>: a 50-megaton air burst
            can cause first-degree burns out to <strong className="text-yellow-400">{radiusDual(50000, 'burn1')}</strong>,
            farther than its 1 psi blast wave ({radiusOr(50000, 'psi1')}).
          </p>
          <p className="text-xs text-green-300/60 mt-2">
            Source: scaling-law engine (Glasstone &amp; Dolan 1977 and the effects scaling table).<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />
          </p>
        </aside>

        {/* ── Use cases ── */}
        <section id="uses" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Ways to use this</h2>
          <div className="space-y-4 text-green-300">
            <div>
              <h3 className="font-semibold text-yellow-400">Picture a historical bomb</h3>
              <p>
                Set 15 kt for <Link href="/weapons/little-boy" className="text-yellow-400 hover:underline">Little Boy</Link> or
                21 kt for <Link href="/weapons/fat-man" className="text-yellow-400 hover:underline">Fat Man</Link> to see
                why those cities were destroyed by weapons smaller than a single modern warhead.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400">Compare old and modern weapons</h3>
              <p>
                Run a 455-kiloton <Link href="/weapons/w88" className="text-yellow-400 hover:underline">W88</Link> next to
                Little Boy, or line any two up on the{' '}
                <Link href="/compare" className="text-yellow-400 hover:underline">comparison tool</Link>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400">Sanity-check a number from the news</h3>
              <p>
                When a report quotes a &ldquo;blast radius,&rdquo; type the yield here to see which ring it matches and
                how far the other effects reach.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400">See it on a real map</h3>
              <p>
                Once you have a yield, open the{' '}
                <Link href="/" className="text-yellow-400 hover:underline">interactive simulator</Link> to overlay the
                rings on any location and judge the scale against streets you know.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((qa) => (
              <details key={qa.question} className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-yellow-400">{qa.question}</summary>
                <p className="mt-3 text-green-300">{qa.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Methodology & sources ── */}
        <section id="methodology" className="mb-6 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Methodology and sources</h2>
          <p className="text-green-300 mb-3">
            Fireball radius uses the Glasstone &amp; Dolan 1977 relation (§2.127); blast and thermal radii come from the
            standard scaling-law table for optimum-height air bursts, interpolated on a log-log scale. Every figure on
            this page, in the calculator, the chart and the diagrams, is produced by that one engine, the same one
            behind the <Link href="/" className="text-yellow-400 hover:underline">map</Link>. Full working:{' '}
            <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link>.
          </p>
          <p className="text-green-300/80 text-sm mb-3">
            <strong className="text-green-300">What is not shown:</strong> casualty counts, fallout, radiation dose and
            surface-burst effects are withheld until each has a verified model. Radii are 1-D ground-distance estimates;
            real effects depend on terrain, weather and construction. Do not use them for emergency planning.
          </p>
          <p className="text-xs text-green-300/60">Data as of 22 October 2026. By Marko Visic, BSc Physics.</p>
        </section>

        <Sources c={cites} extraIds={[...ENGINE_SOURCE_IDS]} />

        {/* ── Related ── */}
        <section className="mt-10 pt-6 border-t border-green-500/30 text-sm text-green-300/80">
          <h2 className="text-lg font-semibold text-green-400 mb-2">Related</h2>
          <p>
            <Link href="/" className="text-yellow-400 hover:underline">Interactive blast map</Link> ·{' '}
            <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons database</Link> ·{' '}
            <Link href="/compare" className="text-yellow-400 hover:underline">Compare two weapons</Link> ·{' '}
            <Link href="/weapons/tsar-bomba" className="text-yellow-400 hover:underline">Tsar Bomba</Link> ·{' '}
            <Link href="/methodology" className="text-yellow-400 hover:underline">Methodology</Link> ·{' '}
            <Link href="/glossary" className="text-yellow-400 hover:underline">Glossary</Link>
          </p>
        </section>
      </main>
    </div>
  )
}
