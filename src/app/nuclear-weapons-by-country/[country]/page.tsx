import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { Byline } from '@/components/Byline'
import { articleSchema, breadcrumbSchema, faqPageSchema, datasetSchema, SITE_URL } from '@/lib/seo/schemas'
import { seoMetadata, pageH1, pageDescription } from '@/lib/seo/pageMeta'
import { Cite, Sources, createCitations, type Citations } from '@/components/seo/Cite'
import {
  COUNTRIES, COUNTRY_SLUGS, getCountry, row, val, rowsWith, cells, isPipe, weaponIdForYield,
  type Country, type CountryRow,
} from '@/lib/data/countryView'
import { radiusKm, radiusDual } from '@/lib/calculations/radius'

export function generateStaticParams() {
  return COUNTRY_SLUGS.map((country) => ({ country }))
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  if (!getCountry(country)) return { title: 'Country Not Found' }
  return seoMetadata(`/nuclear-weapons-by-country/${country}`, 'article')
}

const FAS_SRC = 'federation-of-american-scientists-status-of-worl'
const SIPRI_SRC = 'sipri-sipri-yearbook-2026-ch-8-world-nuclear-for'

function subj(c: Country): string {
  return c.article === 'the' ? `the ${c.name}` : c.name
}
function Subj(c: Country): string {
  return c.article === 'the' ? `The ${c.name}` : c.name
}

// ── Warhead tables (FAS + SIPRI; verified rows verbatim, retired ≠ reserve) ──
const FAS_ROWS: Array<[string, string]> = [
  ['warheads.fas.deployed_strategic', 'Deployed (strategic)'],
  ['warheads.fas.deployed_nonstrategic', 'Deployed (nonstrategic)'],
  ['warheads.fas.reserve_nondeployed', 'Reserve / nondeployed'],
  ['warheads.fas.military_stockpile', 'Military stockpile'],
  ['warheads.fas.retired_awaiting_dismantlement', 'Retired, awaiting dismantlement'],
  ['warheads.fas.total_inventory', 'Total inventory'],
]
const SIPRI_ROWS: Array<[string, string]> = [
  ['warheads.sipri.deployed', 'Deployed'],
  ['warheads.sipri.stored', 'Stored (nondeployed)'],
  ['warheads.sipri.military_stockpile', 'Military stockpile'],
  ['warheads.sipri.retired_awaiting_dismantlement', 'Retired, awaiting dismantlement'],
  ['warheads.sipri.total_inventory', 'Total inventory'],
]

function WarheadTable({ c, src, srcId, pairs, asOf }: { c: Country; src: string; srcId: string; pairs: Array<[string, string]>; asOf: string }) {
  const present = pairs.filter(([f]) => val(c, f) !== '')
  if (!present.length) return null
  return (
    <div className="bg-black/40 border border-green-500/20 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-yellow-400 mb-2">{src} <span className="font-normal text-green-300/60">({asOf})</span></h3>
      <table className="w-full text-sm text-green-300">
        <tbody>
          {present.map(([f, label]) => (
            <tr key={f} className="border-b border-green-500/10 last:border-0">
              <th scope="row" className="text-left py-1 font-normal">{label}</th>
              <td className="text-right py-1 tabular-nums text-green-200">{val(c, f)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Delivery systems table + notes ──
const CELL_COLS: Array<[string, string]> = [
  ['designation', 'System'],
  ['category', 'Type'],
  ['launchers', 'Launchers'],
  ['warheads_per_launcher', 'Per launcher'],
  ['range', 'Range'],
  ['warhead_yield', 'Warhead × yield'],
  ['weapons', 'Weapons'],
  ['year', 'Year'],
  ['warheads', 'Warheads'],
]

function DeliverySection({ c, cites }: { c: Country; cites: Citations }) {
  const all = rowsWith(c, 'delivery.')
  const tableRows = all.filter((r) => isPipe(r.value))
  const notes = all.filter((r) => !isPipe(r.value))
  if (!tableRows.length && !notes.length) return null
  const src = tableRows[0] ?? notes[0]
  const asOf = src?.asOf ?? ''
  // Columns present across this country's pipe rows, in preferred order.
  const cols = CELL_COLS.filter(([key]) => tableRows.some((r) => cells(r.value)[key]))
  return (
    <section id="delivery" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">How {subj(c)} delivers them</h2>
      <p className="text-green-300 mb-3 text-sm">
        Delivery systems from the latest Nuclear Notebook / SIPRI table{asOf ? ` (${asOf})` : ''}. A &ldquo;?&rdquo; or a dash is the source&rsquo;s own mark of an uncertain or unstated figure.<Cite c={cites} ids={src?.sourceId ?? ''} />
      </p>
      {tableRows.length > 0 && (
        <div className="overflow-x-auto border border-green-500/30 rounded-lg mb-3">
          <table className="w-full text-xs sm:text-sm text-green-300 whitespace-nowrap">
            <thead>
              <tr className="border-b border-green-500/30 text-yellow-400">
                {cols.map(([key, label]) => (
                  <th key={key} scope="col" className={`p-2 ${key === 'warheads' || key === 'launchers' ? 'text-right' : 'text-left'}`}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => {
                const cl = cells(r.value)
                const isSub = r.field.endsWith('.subtotal') || r.field.includes('.table.')
                return (
                  <tr key={r.field} className={`border-b border-green-500/10 ${isSub ? 'font-semibold text-green-200' : ''}`}>
                    {cols.map(([key], i) => (
                      <td key={key} className={`p-2 ${key === 'warheads' || key === 'launchers' ? 'text-right tabular-nums' : ''}`}>
                        {cl[key] ?? (i === 0 && isSub ? 'Subtotal' : '')}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {notes.length > 0 && (
        <ul className="space-y-1 text-sm text-green-300/90 list-disc list-inside">
          {notes.map((r) => (
            <li key={r.field}>{r.value}<Cite c={cites} ids={r.sourceId} /></li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ── Blast radius of the country's warheads ──
function BlastRadiusSection({ c, cites }: { c: Country; cites: Citations }) {
  const useTests = c.warheadYieldsKt.length === 0
  const yields = useTests ? c.testYieldsKt : c.warheadYieldsKt
  if (!yields.length) return null
  return (
    <section id="blast-radius" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">Blast radius of {c.article === 'the' ? `the ${c.name}’s` : `${c.name}’s`} warheads</h2>
      <p className="text-green-300 mb-3 text-sm">
        For each {useTests ? 'tested yield' : 'distinct warhead yield'} in {subj(c)}&rsquo;s arsenal, the air-burst 5 psi (most homes destroyed) and 3rd-degree-burn radii, <Link href="/methodology" className="text-yellow-400 hover:underline">calculated</Link> by the same engine as the <Link href="/nuclear-blast-radius" className="text-yellow-400 hover:underline">blast radius calculator</Link>.<Cite c={cites} ids="effects-fireball;effects-blast-thermal" />
      </p>
      <div className="overflow-x-auto border border-green-500/30 rounded-lg">
        <table className="w-full text-xs sm:text-sm text-green-300 whitespace-nowrap">
          <thead>
            <tr className="border-b border-green-500/30 text-yellow-400">
              <th scope="col" className="text-left p-2">Yield</th>
              <th scope="col" className="text-right p-2">5 psi radius</th>
              <th scope="col" className="text-right p-2">3rd-degree burns</th>
              <th scope="col" className="text-left p-2">Links</th>
            </tr>
          </thead>
          <tbody>
            {yields.map((kt) => {
              const wid = weaponIdForYield(c.key, kt)
              const label = kt >= 1000 ? `${kt / 1000} Mt` : `${kt} kt`
              return (
                <tr key={kt} className="border-b border-green-500/10">
                  <td className="p-2 text-green-200 font-semibold">{label}</td>
                  <td className="p-2 text-right">{radiusDual(kt, 'psi5')}</td>
                  <td className="p-2 text-right">{radiusDual(kt, 'burn3')}</td>
                  <td className="p-2">
                    <Link href={`/nuclear-blast-radius?kt=${kt}`} className="text-yellow-400 hover:underline">chart</Link>
                    {wid ? <> · <Link href={`/weapons/${wid}`} className="text-yellow-400 hover:underline">weapon</Link></> : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {useTests && <p className="text-xs text-green-300/60 mt-2">Based on {subj(c)}&rsquo;s verified test yields; no per-warhead yield is published.</p>}
    </section>
  )
}

// ── Test history ──
function humanize(field: string): string {
  const s = field.replace(/^tests\./, '').replace(/[._-]+/g, ' ').trim()
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function TestSection({ c, cites, disclosure }: { c: Country; cites: Citations; disclosure?: string }) {
  const tests = rowsWith(c, 'tests.')
  if (!tests.length && !disclosure) return null
  return (
    <section id="tests" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">{subj(c) === c.name ? `${c.name}’s` : `The ${c.name}’s`} nuclear tests</h2>
      <dl className="space-y-2 text-sm">
        {tests.map((r) => (
          <div key={r.field} className="sm:flex sm:gap-3">
            <dt className="text-green-300/70 sm:w-56 sm:shrink-0">{humanize(r.field)}</dt>
            <dd className="text-green-200">{r.value}<Cite c={cites} ids={r.sourceId} /></dd>
          </div>
        ))}
      </dl>
      {disclosure && <p className="text-xs text-green-300/70 mt-3">{disclosure}</p>}
    </section>
  )
}

// ── Treaty status ──
function TreatySection({ c, cites }: { c: Country; cites: Citations }) {
  const treaties = rowsWith(c, 'treaty.')
  if (!treaties.length) return null
  return (
    <section id="treaties" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">Treaty status</h2>
      <dl className="space-y-2 text-sm">
        {treaties.map((r) => (
          <div key={r.field} className="sm:flex sm:gap-3">
            <dt className="text-green-300/70 sm:w-40 sm:shrink-0">{humanize(r.field).replace(/^Treaty /, '').replace(/npt/i, 'NPT').replace(/ctbt/i, 'CTBT') || r.field}</dt>
            <dd className="text-green-200">{r.value}<Cite c={cites} ids={r.sourceId} /></dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// ── Leftover verified rows as notes ──
function NotesSection({ c, cites }: { c: Country; cites: Citations }) {
  const known = ['warheads.', 'delivery.', 'tests.', 'treaty.', 'status.', 'iaea.', 'june2025.', 'cooperation.', 'snapback.', 'war2026.', 'mou_']
  const extra = c.rows.filter((r) => !known.some((p) => r.field.startsWith(p)))
  if (!extra.length) return null
  return (
    <section id="notes" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">Notes</h2>
      <ul className="space-y-1 text-sm text-green-300/90 list-disc list-inside">
        {extra.map((r) => (
          <li key={r.field}>{r.value}<Cite c={cites} ids={r.sourceId} /></li>
        ))}
      </ul>
    </section>
  )
}

// ── Per-country disclosures (gaps the sourcing report says to state plainly) ──
const DISCLOSURES: Record<string, string> = {
  china: 'China has not published an official total number of tests, and secondary compilations differ, so this page does not assert a single total.',
  india: 'No fetched source states an all-time total for India; the dated test events above are listed instead.',
  'north-korea': "FAS does not estimate North Korea's launcher counts or a per-system warhead split; those figures are a source-level gap.",
  pakistan: "Pakistan's per-system warhead allocation is published only as a table image and is not reproduced here; the systems and their ranges are listed above.",
  israel: 'Israel neither confirms nor denies its arsenal; the delivery figures are SIPRI’s January 2024 data, the latest available.',
  'united-kingdom': 'The name of the last UK test was not captured from a fetched primary source.',
}

// ── FAQ (built from verified rows; answers self-contained) ──
function buildFaq(c: Country): Array<{ question: string; answer: string; sourceId: string }> {
  const out: Array<{ question: string; answer: string; sourceId: string }> = []
  const total = val(c, 'warheads.fas.total_inventory')
  const sipriTotal = val(c, 'warheads.sipri.total_inventory')
  if (total) {
    const agree = sipriTotal.replace(/\s/g, '') === total.replace(/[\s,]/g, '') ? ' SIPRI’s January 2026 count is the same.' : ` SIPRI’s January 2026 count is ${sipriTotal}.`
    out.push({
      question: `How many nuclear weapons does ${subj(c)} have?`,
      answer: `${Subj(c)} has an estimated ${total} nuclear warheads as of early 2026, according to the Federation of American Scientists.${agree}`,
      sourceId: FAS_SRC,
    })
  }
  const first = row(c, 'tests.first') || row(c, 'tests.first.name_date') || row(c, 'tests.first.date_site') || row(c, 'tests.first.date') || row(c, 'tests.first.ctbto')
  if (first) {
    out.push({
      question: `When did ${subj(c)} first test a nuclear weapon?`,
      answer: `${Subj(c)}’s first nuclear test is recorded as ${first.value}.`,
      sourceId: first.sourceId,
    })
  }
  const nptMain = row(c, 'treaty.npt')
  const nptAcc = row(c, 'treaty.npt.accession')
  const nptWithdrawal = row(c, 'treaty.npt.withdrawal')
  if (nptMain) {
    out.push({
      question: `Is ${subj(c)} part of the Non-Proliferation Treaty?`,
      answer: `On the Non-Proliferation Treaty, ${subj(c)} is: ${nptMain.value}.`,
      sourceId: nptMain.sourceId,
    })
  } else if (nptAcc) {
    const w = nptWithdrawal ? ` It later announced its withdrawal (${nptWithdrawal.value}).` : ''
    out.push({
      question: `Is ${subj(c)} part of the Non-Proliferation Treaty?`,
      answer: `${Subj(c)} acceded to the Non-Proliferation Treaty on ${nptAcc.value}.${w}`,
      sourceId: nptWithdrawal?.sourceId ?? nptAcc.sourceId,
    })
  }
  return out
}

// ── Iran status page ──
const IRAN_TIMELINE = [
  'june2025.israel_operation', 'june2025.us_strikes', 'june2025.sites_hit', 'june2025.offsite_radiation',
  'cooperation.law_2025-07-02', 'snapback.e3_notification', 'cooperation.cairo_2025-09-09',
  'snapback.unsc_vote', 'snapback.effective', 'snapback.iran_position', 'cooperation.cairo_terminated',
  'war2026.start', 'war2026.natanz', 'war2026.bushehr', 'war2026.khondab', 'war2026.ceasefire',
  'iaea.inspections_2026', 'mou_2026-06', 'iaea.board_resolution_2026-09',
]
const IRAN_IAEA = [
  'iaea.stockpile.total_enriched', 'iaea.stockpile.up_to_60pct', 'iaea.stockpile.up_to_60pct_verified',
  'iaea.stockpile.up_to_20pct', 'iaea.stockpile.up_to_5pct', 'iaea.stockpile.current_whereabouts',
  'iaea.continuity_of_knowledge', 'iaea.safeguards_unable', 'iaea.dg_concern',
  'iaea.access.affected_facilities', 'iaea.ifep',
]

function IranPage({ c, cites, path }: { c: Country; cites: Citations; path: string }) {
  const kg60 = val(c, 'iaea.stockpile.up_to_60pct')
  const iranFaq = [
    { question: 'Does Iran have nuclear weapons?', answer: `No. As of early 2026, neither the Federation of American Scientists nor SIPRI counts Iran among the world’s nuclear-armed states.`, sourceId: row(c, 'status.not_among_nuclear_armed.fas')?.sourceId ?? FAS_SRC },
    { question: 'How much enriched uranium does Iran have?', answer: `The IAEA’s most recent estimate, as of 13 June 2025, was ${kg60} kg of uranium enriched up to 60% U-235. The Agency says it cannot confirm the stockpile’s current size, composition or location.`, sourceId: row(c, 'iaea.stockpile.up_to_60pct')?.sourceId ?? '' },
    { question: 'Is Iran in the Non-Proliferation Treaty?', answer: `Yes. On the NPT, Iran is: ${val(c, 'treaty.npt')}. On the CTBT: ${val(c, 'treaty.ctbt')}.`, sourceId: row(c, 'treaty.npt')?.sourceId ?? '' },
    { question: 'Can the IAEA verify what Iran is doing now?', answer: `Not fully. The IAEA reports that its continuity of knowledge was ${val(c, 'iaea.continuity_of_knowledge')}, and that it is ${val(c, 'iaea.safeguards_unable')}.`, sourceId: row(c, 'iaea.continuity_of_knowledge')?.sourceId ?? '' },
  ]
  const statusRows = rowsWith(c, 'status.')
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-country-iran"
        schema={[
          articleSchema({ url: path, headline: pageH1(path), description: pageDescription(path) }),
          faqPageSchema(iranFaq.map((q) => ({ question: q.question, answer: q.answer }))),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Nuclear weapons by country', url: '/nuclear-weapons-by-country' },
            { name: 'Iran', url: path },
          ]),
        ]}
      />
      <main className="max-w-3xl mx-auto px-5 py-8 md:p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link><span className="mx-2">/</span>
          <Link href="/nuclear-weapons-by-country" className="hover:text-green-400">Nuclear weapons by country</Link><span className="mx-2">/</span>
          <span className="text-green-400">Iran</span>
        </nav>
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1(path)}</h1>
          <p className="text-lg text-green-300">Where Iran&rsquo;s nuclear program stands in 2026: what the IAEA can verify, what it cannot, and a dated record of the events that got here. Every figure is attributed.</p>
          <Byline className="mt-2" />
        </header>

        <section className="mb-8 bg-black/40 border border-green-500/20 rounded-lg p-5">
          <p className="text-green-200">
            <strong className="text-yellow-400">No.</strong> As of early 2026, neither FAS nor SIPRI counts Iran among the world&rsquo;s nuclear-armed states.<Cite c={cites} ids={FAS_SRC + ';' + SIPRI_SRC} /> The IAEA&rsquo;s last stockpile estimate, from <strong className="text-yellow-400">13 June 2025</strong>, was <strong className="text-yellow-400">{kg60} kg</strong> of uranium enriched up to 60%; since the June 2025 attacks the Agency says it cannot state the stockpile&rsquo;s current size, composition or location.<Cite c={cites} ids={row(c, 'iaea.stockpile.up_to_60pct')?.sourceId ?? ''} />
          </p>
        </section>

        <section id="status" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">What the assessments say</h2>
          <ul className="space-y-1 text-sm text-green-300/90 list-disc list-inside">
            {statusRows.map((r) => (<li key={r.field}>{r.value}<Cite c={cites} ids={r.sourceId} /></li>))}
          </ul>
        </section>

        <section id="iaea" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">What the IAEA knows and doesn&rsquo;t</h2>
          <dl className="space-y-2 text-sm">
            {IRAN_IAEA.map((f) => { const r = row(c, f); if (!r) return null; return (
              <div key={f} className="sm:flex sm:gap-3">
                <dt className="text-green-300/70 sm:w-56 sm:shrink-0">{f.replace(/^iaea\./, '').replace(/[._]/g, ' ')}</dt>
                <dd className="text-green-200">{r.value}{r.unit && !/text/.test(r.unit) ? ` ${r.unit}` : ''}<Cite c={cites} ids={r.sourceId} /></dd>
              </div>) })}
          </dl>
        </section>

        <section id="timeline" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Timeline, June 2025 to 2026</h2>
          <ol className="space-y-2 text-sm border-l border-green-500/30 pl-4">
            {IRAN_TIMELINE.map((f) => { const r = row(c, f); if (!r) return null; return (
              <li key={f} className="text-green-200">{r.value}<Cite c={cites} ids={r.sourceId} /></li>) })}
          </ol>
        </section>

        <TreatySection c={c} cites={cites} />

        <section id="faq" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Frequently asked questions</h2>
          <div className="space-y-3">
            {iranFaq.map((qa) => (
              <details key={qa.question} className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-yellow-400">{qa.question}</summary>
                <p className="mt-3 text-green-300">{qa.answer}<Cite c={cites} ids={qa.sourceId} /></p>
              </details>
            ))}
          </div>
        </section>

        <MethodologyBlock />
        <Sources c={cites} />
        <SiblingNav currentKey="iran" />
      </main>
    </div>
  )
}

function MethodologyBlock() {
  return (
    <section id="methodology" className="mb-6 mt-4">
      <p className="text-green-300/80 text-sm mb-2">
        Every figure on this page comes from a verified primary source, cited inline and listed below. Warhead counts are the Federation of American Scientists&rsquo; Status of World Nuclear Forces and SIPRI&rsquo;s Yearbook; delivery systems come from the Nuclear Notebook; blast radii are <Link href="/methodology" className="text-yellow-400 hover:underline">calculated</Link> from Glasstone &amp; Dolan scaling laws. Candidate and unverified figures are withheld.
      </p>
      <p className="text-xs text-green-300/60">Data as of 22 October 2026. By Marko Visic, BSc Physics.</p>
    </section>
  )
}

function SiblingNav({ currentKey }: { currentKey: string }) {
  return (
    <section className="mt-10 pt-6 border-t border-green-500/30 text-sm">
      <h2 className="text-lg font-semibold text-green-400 mb-2">Other nuclear powers</h2>
      <p className="text-green-300/80">
        {COUNTRY_SLUGS.filter((k) => k !== currentKey).map((k, i) => (
          <span key={k}>
            {i > 0 ? ' · ' : ''}
            <Link href={`/nuclear-weapons-by-country/${k}`} className="text-yellow-400 hover:underline">{COUNTRIES[k].name}</Link>
          </span>
        ))}
      </p>
      <p className="mt-3 text-green-300/80">
        Back to <Link href="/nuclear-weapons-by-country" className="text-yellow-400 hover:underline">all nuclear weapons by country</Link>.
      </p>
    </section>
  )
}

// ── Arsenal page (the nine possessors) ──
function directAnswer(c: Country): { text: string; ids: string } {
  const total = val(c, 'warheads.fas.total_inventory')
  const dep = val(c, 'warheads.fas.deployed_strategic')
  const depNon = val(c, 'warheads.fas.deployed_nonstrategic')
  const stock = val(c, 'warheads.fas.military_stockpile')
  const retired = val(c, 'warheads.fas.retired_awaiting_dismantlement')
  const reserve = val(c, 'warheads.fas.reserve_nondeployed')
  const sipriTotal = val(c, 'warheads.sipri.total_inventory')
  const sipriDep = val(c, 'warheads.sipri.deployed')
  const parts: string[] = [`${Subj(c)} has an estimated ${total} nuclear warheads as of early 2026 (FAS).`]
  if (dep && dep !== '0') {
    let s = `${dep} are deployed on strategic launchers`
    if (depNon && depNon !== '0') s += `, about ${depNon} more are deployed with allied or tactical aircraft`
    s += `, and ${stock} are in the military stockpile.`
    parts.push(s)
    if (retired && !/^[–.\s]*$/.test(retired)) {
      // "up to 80" reads wrong after "A further"; render it as "Up to 80 more …".
      parts.push(/^up to /i.test(retired)
        ? `Up to ${retired.replace(/^up to /i, '')} more are retired and awaiting dismantlement.`
        : `A further ${retired} are retired and awaiting dismantlement.`)
    }
  } else {
    parts.push(`FAS lists none as deployed and ${reserve || stock} held in reserve.`)
    if (sipriDep && !/^[–.\s]*$/.test(sipriDep)) parts.push(`SIPRI counts ${sipriDep} as deployed within the same total.`)
  }
  const same = sipriTotal.replace(/\s/g, '') === total.replace(/[\s,]/g, '')
  if (same && !(dep === '0' && sipriDep && !/^[–.\s]*$/.test(sipriDep))) parts.push('SIPRI’s January 2026 count matches.')
  else if (!same) parts.push(`SIPRI’s January 2026 total is ${sipriTotal}.`)
  return { text: parts.join(' '), ids: `${FAS_SRC};${SIPRI_SRC}` }
}

function ArsenalPage({ c, cites, path }: { c: Country; cites: Citations; path: string }) {
  const da = directAnswer(c)
  const fasAsOf = row(c, 'warheads.fas.total_inventory')?.asOf ?? 'early 2026'
  const sipriAsOf = row(c, 'warheads.sipri.total_inventory')?.asOf ?? 'January 2026'
  const faq = buildFaq(c)
  const total = val(c, 'warheads.fas.total_inventory')
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-country-${c.key}`}
        schema={[
          articleSchema({ url: path, headline: pageH1(path), description: pageDescription(path) }),
          datasetSchema({
            url: path,
            name: `${c.name} nuclear forces (early 2026)`,
            description: `Warhead counts (FAS and SIPRI), delivery systems and nuclear-test history for ${subj(c)}, early 2026.`,
            keywords: [`${c.name} nuclear weapons`, 'warheads', 'delivery systems'],
          }),
          faqPageSchema(faq.map((q) => ({ question: q.question, answer: q.answer }))),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Nuclear weapons by country', url: '/nuclear-weapons-by-country' },
            { name: c.name, url: path },
          ]),
        ]}
      />
      <main className="max-w-3xl mx-auto px-5 py-8 md:p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link><span className="mx-2">/</span>
          <Link href="/nuclear-weapons-by-country" className="hover:text-green-400">Nuclear weapons by country</Link><span className="mx-2">/</span>
          <span className="text-green-400">{c.name}</span>
        </nav>
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-3 text-green-400">{pageH1(path)}</h1>
          <p className="text-lg text-green-300">
            How many nuclear warheads {subj(c)} holds, what carries them, and its test and treaty record, as of early 2026. Two independent counts (FAS and SIPRI) are shown side by side, every figure cited.
          </p>
          <Byline className="mt-2" />
        </header>

        <section className="mb-8 bg-black/40 border border-green-500/20 rounded-lg p-5">
          <p className="text-green-200">{da.text}<Cite c={cites} ids={da.ids} /></p>
        </section>

        <section id="warheads" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Warhead count</h2>
          <p className="text-green-300 mb-3 text-sm">
            FAS and SIPRI are compiled by the same analysts and agree on the totals; they split the categories slightly differently. <strong className="text-green-200">Retired</strong> warheads are awaiting dismantlement and are not part of the reserve.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <WarheadTable c={c} src="FAS" srcId={FAS_SRC} pairs={FAS_ROWS} asOf={fasAsOf} />
            <WarheadTable c={c} src="SIPRI" srcId={SIPRI_SRC} pairs={SIPRI_ROWS} asOf={sipriAsOf} />
          </div>
          <p className="text-xs text-green-300/60 mt-2">
            Terms: <em>deployed</em> = on missiles or at bomber bases; <em>reserve / stored</em> = non-deployed but in the stockpile; <em>military stockpile</em> = deployed + reserve; <em>retired</em> = withdrawn, awaiting dismantlement; <em>total inventory</em> = stockpile + retired.<Cite c={cites} ids={`${FAS_SRC};${SIPRI_SRC}`} />
          </p>
        </section>

        <DeliverySection c={c} cites={cites} />
        <BlastRadiusSection c={c} cites={cites} />
        <TestSection c={c} cites={cites} disclosure={DISCLOSURES[c.key]} />
        <TreatySection c={c} cites={cites} />
        <NotesSection c={c} cites={cites} />

        <section id="faq" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Frequently asked questions</h2>
          <div className="space-y-3">
            {faq.map((qa) => (
              <details key={qa.question} className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-yellow-400">{qa.question}</summary>
                <p className="mt-3 text-green-300">{qa.answer}<Cite c={cites} ids={qa.sourceId} /></p>
              </details>
            ))}
          </div>
        </section>

        <MethodologyBlock />
        <Sources c={cites} extraIds={[FAS_SRC, SIPRI_SRC]} />
        <SiblingNav currentKey={c.key} />
      </main>
    </div>
  )
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const c = getCountry(country)
  if (!c) notFound()
  const cites = createCitations()
  const path = `/nuclear-weapons-by-country/${country}`
  return c.key === 'iran' ? <IranPage c={c} cites={cites} path={path} /> : <ArsenalPage c={c} cites={cites} path={path} />
}
