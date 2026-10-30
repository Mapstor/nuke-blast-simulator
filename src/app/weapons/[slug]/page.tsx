import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { PrevNext, type PrevNextItem } from '@/components/nav/PrevNext'
import { Byline } from '@/components/Byline'
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { bombs } from '@/lib/data/bombs'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import { effectRadiiKm, formatRadiusKm, EFFECTS_FLAGS } from '@/lib/calculations/effects'
import { Cite, Sources, createCitations, ENGINE_SOURCE_IDS } from '@/components/seo/Cite'
import { renderCited, faqSchemaText } from '@/components/seo/citeText'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { WEAPON_EXTRAS } from '@/lib/data/weaponExtras'
import {
  specLine,
  shortSpec,
  formatYield,
  overviewQuantity,
  hiroshimaMultiple,
  HIROSHIMA_YIELD_KT,
} from '@/lib/data/weaponSpec'
import type { Bomb } from '@/lib/types'

// Linearize the weapons list by yield ascending so prev/next moves through
// the database from smallest to largest.
const sequencedBombs = bombs
  .filter((b) => b.id !== 'custom')
  .slice()
  .sort((a, b) => a.yield - b.yield)

function pageNeighbors(slug: string): { prev: PrevNextItem; next: PrevNextItem } {
  const i = sequencedBombs.findIndex((b) => b.id === slug)
  const fmt = (b: Bomb): PrevNextItem => ({
    label: b.name,
    href: `/weapons/${b.id}`,
    sublabel: `${shortSpec(b)} · ${b.country}`,
  })
  return {
    prev: i > 0 ? fmt(sequencedBombs[i - 1]) : null,
    next: i >= 0 && i < sequencedBombs.length - 1 ? fmt(sequencedBombs[i + 1]) : null,
  }
}

export function generateStaticParams() {
  return bombs
    .filter((b) => b.id !== 'custom')
    .map((b) => ({ slug: b.id }))
}

function findBomb(slug: string): Bomb | undefined {
  return bombs.find((b) => b.id === slug && b.id !== 'custom')
}

function describeType(t: Bomb['type']): string {
  switch (t) {
    case 'fission': return 'pure fission'
    case 'fusion': return 'fusion-boosted'
    case 'thermonuclear': return 'thermonuclear (hydrogen bomb)'
    case 'conventional': return 'conventional high-explosive'
  }
}

// Hiroshima comparison in prose. One decimal below 10×, whole at/above, never
// "1×"; "comparable" only in the 1.0–1.5× band (NBS-016 rounding fix).
function compareToHiroshima(yieldKt: number): string {
  const ratio = yieldKt / HIROSHIMA_YIELD_KT
  if (ratio >= 1 && ratio < 1.5) return 'comparable in yield to the Hiroshima bomb'
  return `${hiroshimaMultiple(ratio)} than the Hiroshima bomb`
}

function relatedBombs(target: Bomb, n = 4): Bomb[] {
  return bombs
    .filter((b) => b.id !== target.id && b.id !== 'custom')
    .map((b) => ({
      bomb: b,
      score:
        (b.country === target.country ? 1 : 0) +
        (b.type === target.type ? 1 : 0) +
        // closer yields rank higher (log-scale distance)
        1 / (Math.abs(Math.log10(b.yield + 0.001) - Math.log10(target.yield + 0.001)) + 0.5),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.bomb)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const bomb = findBomb(slug)
  if (!bomb) return { title: 'Weapon Not Found' }

  return seoMetadata(`/weapons/${bomb.id}`, 'article')
}

export default async function WeaponDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const bomb = findBomb(slug)
  if (!bomb) notFound()

  const related = relatedBombs(bomb, 4)
  const isNuclear = bomb.type !== 'conventional'
  // Nuclear scaling laws only apply to nuclear weapons. Conventional weapons
  // keep their spec content but show no effect radii (EFFECTS_FLAGS).
  const showEffects = isNuclear || EFFECTS_FLAGS.CONVENTIONAL_EFFECTS
  const r = showEffects ? effectRadiiKm(bomb.yield) : null
  const cites = createCitations()
  const weaponSourceIds = bomb.sources ?? []

  // NBS-016 (audit-a) per-weapon framing:
  const isHalifax = bomb.id === 'halifax-explosion'    // accidental explosion, not a weapon
  const isChagai = bomb.id === 'chagai-i'              // 40 kt is only Pakistan's claim; seismic ~9 kt
  const isNK2017 = bomb.id === 'north-korea-2017-test' // H-bomb is NK's claim; seismic can't confirm it
  const isTsarBomba = bomb.id === 'tsar-bomba'
  const isFillBomb = bomb.type === 'conventional' && bomb.measure === 'fill'
  // NBS-014: Little Boy and Fat Man ARE the Hiroshima/Nagasaki bombs, so the
  // generic "comparable to the Hiroshima bomb" phrasing is circular.
  const isReferenceBomb = bomb.id === 'little-boy' || bomb.id === 'fat-man'

  const typeText =
    isHalifax ? 'historical explosion' :
    isNK2017 ? 'claimed thermonuclear (unconfirmed)' :
    isChagai ? 'fission (claimed boosted)' :
    bomb.id === 'orange-herald' ? 'boosted fission' :
    describeType(bomb.type)

  // Header "how much" figure. Chagai's 40 kt is only a claim; conventional bombs
  // show their fill or TNT equivalent via specLine(); nuclear bombs their yield.
  const headerSpec = isChagai ? 'claimed up to 40 kt (seismic estimates about 9 kt)' : specLine(bomb)
  const yieldText = formatYield(bomb.yield) // nuclear FAQ prose

  // Hiroshima comparison is meaningful only where a real yield / TNT equivalent
  // exists; a fill weight is not a yield, and Chagai / NK / Halifax are reframed.
  const comparison =
    bomb.id === 'little-boy' ? 'the atomic bomb dropped on Hiroshima' :
    bomb.id === 'fat-man' ? 'the atomic bomb dropped on Nagasaki, larger than the 15-kiloton Hiroshima bomb' :
    compareToHiroshima(bomb.yield)
  const overviewQty =
    isChagai ? 'a claimed yield of up to 40 kt (seismic estimates about 9 kt)' :
    isNK2017 ? 'an estimated yield of about 250 kilotons' :
    overviewQuantity(bomb)

  // The generic "roughly equal fission/fusion" energy split is misleading on
  // Tsar Bomba (lead tamper, ~97% fusion). The NK 2017 test cites NORSAR for the
  // "seismic can't tell" note instead of the Glasstone & Dolan energy section.
  const thermonuclearEnergy = isTsarBomba
    ? 'a fission explosion that ignites fusion fuel. About 97% of its energy came from fusion, making it one of the cleanest nuclear explosions relative to its yield'
    : 'a fission explosion that ignites fusion fuel, releasing on average roughly equal energy from fission and fusion'
  const energyPhrase =
    bomb.type === 'fission' ? 'nuclear fission of uranium or plutonium' :
    bomb.type === 'fusion' ? 'fusion-boosted fission reactions' :
    thermonuclearEnergy
  const energySourceId = isTsarBomba
    ? 'nuclear-weapon-archive-the-soviet-weapons-progra'
    : isNK2017
    ? 'norsar-summing-up-the-nuclear-test-in-north-kore'
    // Chagai: the "boosted" claim is the Pakistan archive's, not Glasstone & Dolan's.
    : isChagai
    ? 'us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5;nuclear-weapon-archive-pakistan-s-nuclear-weapon'
    : 'us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5'

  // NBS-014: the T1 weapons carry long-form sections + question-form FAQ. Extras
  // FAQ lead; the generic radius/quantity FAQ follows. The Hiroshima 15 kt claim
  // is cited to DOE/NV-209 (NBS-016). Fill bombs ask about explosive fill, not a
  // TNT yield; Chagai and Halifax get bespoke answers.
  const extra = WEAPON_EXTRAS[bomb.id]
  const HIROSHIMA_CITE = ['us-doe-nnsa-nevada-field-office-united-states-nu']
  const quantityFaq: { question: string; answer: string; sourceIds?: string[] }[] =
    isReferenceBomb ? [] :
    isHalifax ? [{
      question: 'What was the Halifax Explosion?',
      answer: "The Halifax Explosion was an accidental detonation of the munitions ship SS Mont-Blanc's cargo in Halifax, Nova Scotia, on 6 December 1917 — roughly 2.9 kt of TNT equivalent, the largest man-made explosion before the atomic bomb. It was not a weapon.",
      sourceIds: weaponSourceIds,
    }] :
    isChagai ? [{
      question: 'What is the yield of the Chagai-I?',
      answer: 'Pakistan claimed a yield of up to 40 kt. Independent seismic estimates put it near 9 kt (roughly 5 to 20 kt), below the 15 kt Hiroshima bomb.',
      sourceIds: weaponSourceIds,
    }, {
      question: 'Is the Chagai-I bigger than the Hiroshima bomb?',
      answer: "Only by Pakistan's claim of up to 40 kt. Seismic estimates of about 9 kt make it smaller than the 15 kt Hiroshima bomb.",
      sourceIds: [...HIROSHIMA_CITE, ...weaponSourceIds],
    }] :
    isFillBomb ? [{
      question: `What is the explosive fill of the ${bomb.name}?`,
      answer: `The ${bomb.name} holds ${overviewQuantity(bomb)}.`,
      sourceIds: weaponSourceIds,
    }] :
    [{
      question: `What is the yield of the ${bomb.name}?`,
      answer: isNuclear
        ? `The ${bomb.name} has a yield of ${yieldText} of TNT equivalent. That is ${comparison}.`
        : `The ${bomb.name} is rated at ${overviewQuantity(bomb)}. That is ${comparison}.`,
    }, {
      question: `Is the ${bomb.name} bigger than the Hiroshima bomb?`,
      answer: `The Hiroshima bomb (Little Boy) had a yield of approximately 15 kilotons. The ${bomb.name} at ${isNuclear ? yieldText : shortSpec(bomb)} is ${comparison}.`,
      sourceIds: HIROSHIMA_CITE,
    }]

  const faqEntries: { question: string; answer: string; sourceIds?: string[] }[] = [
    ...(extra?.faq ?? []),
    ...(r
      ? [
          {
            question: `How big is the ${bomb.name} blast radius?`,
            answer:
              `In an air burst at optimum height, the ${bomb.name} produces a fireball roughly ${formatRadiusKm(r.fireball)} km in radius and a 5 psi moderate-blast zone of about ${formatRadiusKm(r.overpressure5psi)} km — the area in which most residential buildings would collapse. The 1 psi light-damage radius extends to roughly ${formatRadiusKm(r.overpressure1psi)} km, where windows shatter.`,
          },
        ]
      : []),
    ...quantityFaq,
    ...(r
      ? [
          {
            question: `What thermal burn radius does the ${bomb.name} produce?`,
            answer:
              `In an air burst at optimum height, thermal radiation from the ${bomb.name} can cause 3rd-degree burns out to roughly ${formatRadiusKm(r.thermal3rdDegree)} km, 2nd-degree burns to ${formatRadiusKm(r.thermal2ndDegree)} km, and 1st-degree burns to ${formatRadiusKm(r.thermal1stDegree)} km.`,
          },
        ]
      : []),
  ]

  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Weapons Database', url: '/weapons' },
    { name: bomb.name, url: `/weapons/${bomb.id}` },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-weapon-${bomb.id}`}
        schema={[
          articleSchema({
            url: `/weapons/${bomb.id}`,
            headline: pageH1(`/weapons/${bomb.id}`),
            description: bomb.description,
          }),
          faqPageSchema(faqEntries.map((q) => ({ question: q.question, answer: faqSchemaText(q.answer) }))),
          breadcrumbSchema(breadcrumbs),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/weapons" className="hover:text-green-400">Weapons Database</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">{bomb.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1(`/weapons/${bomb.id}`)}</h1>
          <p className="text-lg text-green-300">
            {bomb.country}{bomb.year ? ` · ${bomb.year}` : ''} · {headerSpec} · {typeText}
          </p>
          <Byline className="mt-2" />
        </header>

        <section className="mb-10 bg-black/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Overview</h2>
          <p className="text-green-300 mb-4">{bomb.description}.</p>
          <p className="text-green-300">
            With <strong className="text-yellow-400">{overviewQty}</strong>
            <Cite c={cites} ids={weaponSourceIds.join(';')} />,{' '}
            {isHalifax ? (
              <>the Halifax Explosion was an accidental detonation of the munitions ship SS Mont-Blanc&apos;s cargo (about 2.3 million kg of high explosives) in 1917, not a weapon.</>
            ) : isChagai ? (
              <>the Chagai-I derives its energy from nuclear fission of uranium; Pakistan says the devices were boosted.{' '}<Cite c={cites} ids={energySourceId} /></>
            ) : isNK2017 ? (
              <>North Korea said the device was a hydrogen bomb, but the seismic signal cannot tell a fission bomb from a thermonuclear one.{' '}<Cite c={cites} ids={energySourceId} /></>
            ) : isFillBomb ? (
              <>the {bomb.name} is a conventional high-explosive weapon that releases its energy through chemical reactions, not nuclear processes.{' '}<Cite c={cites} ids={energySourceId} /></>
            ) : (
              <>the {bomb.name} is <strong className="text-yellow-400">{comparison}</strong>.{' '}
                {isNuclear
                  ? `As a ${typeText} weapon, it derives its energy from ${energyPhrase}.`
                  : 'It is a conventional high-explosive weapon that releases its energy through chemical reactions, not nuclear processes.'}
                {' '}<Cite c={cites} ids={energySourceId} /></>
            )}
          </p>
          {isNK2017 ? (
            <p className="text-green-300 mt-4">
              For the country&apos;s wider program, see the{' '}
              <Link href="/nuclear-weapons-by-country/north-korea" className="text-yellow-400 hover:underline">North Korea nuclear arsenal</Link> page.
            </p>
          ) : null}
        </section>

        {r ? (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">{bomb.name} Blast Effects</h2>
            <p className="text-green-300 mb-4">
              The table below shows the calculated radius of each effect zone for an{' '}
              <strong className="text-yellow-400">air burst at optimum height</strong>. Values are scaling
              laws from{' '}
              <Link href="/methodology" className="text-yellow-400 hover:underline">
                The Effects of Nuclear Weapons (Glasstone &amp; Dolan, 1977)
              </Link>{' '}
              and the published effects scaling table<Cite c={cites} ids={ENGINE_SOURCE_IDS.join(';')} />.
            </p>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 overflow-x-auto">
              <table className="w-full text-green-300 text-sm md:text-base">
                <thead>
                  <tr className="border-b border-green-500/30">
                    <th className="text-left py-2 text-yellow-400">Effect zone</th>
                    <th className="text-right py-2 text-yellow-400">Radius (air burst)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Fireball radius</td>
                    <td className="text-right">{formatRadiusKm(r.fireball) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Severe blast (20 psi)</td>
                    <td className="text-right">{formatRadiusKm(r.overpressure20psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Moderate blast (5 psi)</td>
                    <td className="text-right">{formatRadiusKm(r.overpressure5psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">Light blast (1 psi)</td>
                    <td className="text-right">{formatRadiusKm(r.overpressure1psi) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">3rd-degree thermal burns</td>
                    <td className="text-right">{formatRadiusKm(r.thermal3rdDegree) + ' km'}</td>
                  </tr>
                  <tr className="border-b border-green-500/10">
                    <td className="py-2">2nd-degree thermal burns</td>
                    <td className="text-right">{formatRadiusKm(r.thermal2ndDegree) + ' km'}</td>
                  </tr>
                  <tr>
                    <td className="py-2">1st-degree thermal burns</td>
                    <td className="text-right">{formatRadiusKm(r.thermal1stDegree) + ' km'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-green-300/70 mt-3">
              All radii assume an air burst at optimum height and are 1-D ground-distance estimates from the
              detonation point. Real-world effects depend on terrain, weather, and building construction.
              Casualty and fallout estimates are not shown pending a verified population and fallout model.
            </p>
            <p className="text-sm mt-3">
              <Link href={`/nuclear-blast-radius?kt=${bomb.yield}`} className="text-yellow-400 hover:underline">
                Compare every yield on the blast radius chart &rarr;
              </Link>
            </p>
          </section>
        ) : (
          <section className="mb-10 bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r">
            <h2 className="text-xl font-semibold mb-3 text-yellow-400">Effect radii not shown</h2>
            <p className="text-green-300">
              {isHalifax
                ? 'The Halifax Explosion (1917) was an accidental munitions-ship explosion, not a weapon.'
                : `The ${bomb.name} is a conventional (non-nuclear) weapon.`}{' '}
              The nuclear blast and thermal scaling laws this site uses do not apply to chemical explosives, so
              no effect radii are shown. See the{' '}
              <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page.
            </p>
          </section>
        )}

        {extra ? <ArticleBody sections={extra.sections} cites={cites} /> : null}

        {isNuclear && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Run the {bomb.name} on a City</h2>
            <p className="text-green-300 mb-4">
              Use the interactive simulator to detonate the {bomb.name} on any city worldwide. Click any
              location on the map to see the fireball, blast, and thermal radii (air burst at optimum height)
              overlaid on real geography.
            </p>
            <Link
              href={`/?bomb=${bomb.id}`}
              className="inline-block bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              🎯 Simulate {bomb.name}
            </Link>
          </section>
        )}

        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Related Weapons</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {related.map((rb) => (
                <Link
                  key={rb.id}
                  href={`/weapons/${rb.id}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-yellow-400">{rb.name}</div>
                  <div className="text-sm text-green-300">
                    {rb.country} · {shortSpec(rb)}
                  </div>
                  <div className="text-xs text-green-300/70 mt-1">{rb.description}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">FAQ</h2>
          <div className="space-y-3">
            {faqEntries.map((qa) => (
              <details key={qa.question} className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-yellow-400">{qa.question}</summary>
                <p className="mt-3 text-green-300">
                  {renderCited(qa.answer, cites)}
                  {qa.sourceIds?.length ? <Cite c={cites} ids={qa.sourceIds.join(';')} /> : null}
                </p>
              </details>
            ))}
          </div>
        </section>

        <Sources c={cites} extraIds={[...(r ? ENGINE_SOURCE_IDS : []), ...weaponSourceIds, ...(extra?.sourceIds ?? [])]} />

        <section className="text-sm text-green-300/70 mt-6">
          See the full <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons Database</Link>,
          all <Link href="/sources" className="text-yellow-400 hover:underline">data sources</Link>, or the{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">scientific methodology</Link>.
        </section>

        <PrevNext {...pageNeighbors(bomb.id)} label="Previous and next weapon by yield" />
      </main>
    </div>
  )
}
