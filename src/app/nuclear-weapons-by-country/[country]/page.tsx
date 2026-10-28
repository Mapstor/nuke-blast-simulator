import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { Byline } from '@/components/Byline'
import { articleSchema, breadcrumbSchema, faqPageSchema, datasetSchema, SITE_URL } from '@/lib/seo/schemas'
import { seoMetadata, pageH1, pageDescription } from '@/lib/seo/pageMeta'
import { Cite, Sources, createCitationsFrom, type Citations } from '@/components/seo/Cite'
import {
  COUNTRIES, COUNTRY_SLUGS, getCountry, row, val, rowsWith, cells, isStructured,
  cleanAsOf, humanizeDates, shortName, headingPoss, toInt, worldTotalFas, weaponIdForYield,
  type Country, type CountryRow,
} from '@/lib/data/countryView'
import { radiusDual } from '@/lib/calculations/radius'

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
const ENGINE_IDS = ['effects-fireball', 'effects-blast-thermal']

function subj(c: Country): string {
  return c.article === 'the' ? `the ${c.name}` : c.name
}
function Subj(c: Country): string {
  return c.article === 'the' ? `The ${c.name}` : c.name
}
function short(c: Country): string {
  return shortName(c.key, c.name)
}
// Possessive subject that avoids the awkward "the United States's": the US/UK
// use their acronym ("The US's warheads"); others keep their name.
function possSubj(c: Country): string {
  if (c.key === 'united-states') return 'The US'
  if (c.key === 'united-kingdom') return 'The UK'
  return Subj(c)
}
function possSubjLower(c: Country): string {
  if (c.key === 'united-states') return 'the US'
  if (c.key === 'united-kingdom') return 'the UK'
  return subj(c)
}
// Share of the world total as a readable phrase; a sub-1% share reads "less
// than 1%", never the self-contradictory "about 0%" (North Korea).
function sharePhrase(ctx: Ctx): string {
  if (ctx.sharePct === null) return ''
  return ctx.sharePct < 1 ? 'less than 1%' : `about ${ctx.sharePct}%`
}
function uniq(ids: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) if (id && !seen.has(id)) { seen.add(id); out.push(id) }
  return out
}

// ── Computed context (share of the world total, ranking, last-test year) ──────
type Ctx = { total: number | null; worldTotal: number; sharePct: number | null; rank: number | null; lastTestYear: number | null; onlyThisCentury: boolean }

function lastTestYear(c: Country): number | null {
  let max: number | null = null
  for (const r of rowsWith(c, 'tests.last')) {
    for (const m of r.value.matchAll(/\b(19|20)\d{2}\b/g)) {
      const y = parseInt(m[0], 10)
      if (max === null || y > max) max = y
    }
  }
  return max
}
function buildCtx(c: Country): Ctx {
  const worldTotal = worldTotalFas()
  const total = toInt(val(c, 'warheads.fas.total_inventory'))
  const totals = COUNTRY_SLUGS
    .map((k) => ({ k, n: toInt(COUNTRIES[k].rows.find((r) => r.field === 'warheads.fas.total_inventory')?.value ?? '') ?? 0 }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
  const rank = totals.findIndex((x) => x.k === c.key)
  const ly = lastTestYear(c)
  const centuryTesters = COUNTRY_SLUGS.filter((k) => {
    const y = lastTestYear(COUNTRIES[k])
    return y !== null && y >= 2001
  })
  return {
    total,
    worldTotal,
    sharePct: total && worldTotal ? Math.round((total / worldTotal) * 100) : null,
    rank: rank >= 0 ? rank + 1 : null,
    lastTestYear: ly,
    onlyThisCentury: centuryTesters.length === 1 && centuryTesters[0] === c.key,
  }
}

// ── Country-specific intro, computed from verified rows (fix #4) ─────────────
function buildIntro(c: Country, ctx: Ctx): string {
  const total = val(c, 'warheads.fas.total_inventory')
  const share = ctx.sharePct !== null ? `${sharePhrase(ctx)} of the world's roughly ${ctx.worldTotal.toLocaleString()} warheads` : null
  const us = val(COUNTRIES['united-states'], 'warheads.fas.total_inventory')
  const ru = val(COUNTRIES['russia'], 'warheads.fas.total_inventory')
  switch (c.key) {
    case 'russia':
      return `Russia holds the world's largest nuclear arsenal, an estimated ${total} warheads — ${share} and more than any other country. It and the United States (about ${us}) together account for most of the warheads on Earth.`
    case 'united-states':
      return `The United States has the world's second-largest nuclear arsenal, an estimated ${total} warheads (${share}), and remains the only country ever to have used a nuclear weapon in war. Only Russia, with about ${ru}, holds more.`
    case 'china': {
      const proj = val(c, 'warheads.projection_2030')
      return `China has an estimated ${total} warheads and is expanding faster than any other nuclear power: ${proj || 'the US Defense Department projects roughly 1,000 operational warheads by 2030'}. That is still far below the United States (about ${us}) and Russia (about ${ru}).`
    }
    case 'united-kingdom': {
      const cap = val(c, 'warheads.stockpile_cap')
      return `The United Kingdom keeps a submarine-only deterrent of about ${total} warheads — one of the smallest arsenals among the five NPT nuclear-weapon states${cap ? `, with a stated plan to raise its ceiling to ${cap}` : ''}.`
    }
    case 'france':
      return `France fields about ${total} nuclear warheads across submarines and aircraft. With the United Kingdom, it holds one of the smallest arsenals of the five NPT nuclear-weapon states, and it is the only one with both a sea- and air-based force on constant readiness.`
    case 'india':
      return `India has an estimated ${total} nuclear warheads. It first tested a nuclear device in 1974 and again in 1998; with Pakistan across the border, it is one of two rivals that have never joined the Non-Proliferation Treaty.`
    case 'pakistan': {
      const india = toInt(val(COUNTRIES['india'], 'warheads.fas.total_inventory'))
      const cmp = india && ctx.total ? (ctx.total < india ? 'slightly fewer than India across the border' : 'comparable to India across the border') : 'comparable to India'
      return `Pakistan has an estimated ${total} nuclear warheads, ${cmp}. Both countries tested in May 1998 and neither has joined the Non-Proliferation Treaty.`
    }
    case 'north-korea': {
      const yr = ctx.lastTestYear
      return `North Korea has an estimated ${total} assembled nuclear warheads${ctx.onlyThisCentury ? ' and is the only country to have tested a nuclear weapon this century' : ''}${yr ? `; its most recent test, in ${yr}, was its largest` : ''}.`
    }
    case 'israel':
      return `Israel is estimated to hold about ${total} nuclear warheads but has never confirmed a nuclear test or officially acknowledged its arsenal — a decades-long policy of deliberate ambiguity.`
    default:
      return `${Subj(c)} has an estimated ${total} nuclear warheads as of early 2026.`
  }
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
const WARHEAD_FIELDS = new Set([...FAS_ROWS, ...SIPRI_ROWS].map(([f]) => f))

function WarheadTable({ c, src, pairs, asOf }: { c: Country; src: string; pairs: Array<[string, string]>; asOf: string }) {
  const present = pairs.filter(([f]) => val(c, f) !== '')
  if (!present.length) return null
  return (
    <div className="bg-black/40 border border-green-500/20 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-yellow-400 mb-2">{src} <span className="font-normal text-green-300/60">· {cleanAsOf(asOf)}</span></h3>
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

// ── Warhead context paragraph — headline numbers in proportion (fix #5) ──────
function WarheadContext({ c, ctx, cites }: { c: Country; ctx: Ctx; cites: Citations }) {
  const total = val(c, 'warheads.fas.total_inventory')
  const dep = val(c, 'warheads.fas.deployed_strategic')
  const stock = val(c, 'warheads.fas.military_stockpile')
  const retired = val(c, 'warheads.fas.retired_awaiting_dismantlement')
  const parts: string[] = []
  if (ctx.sharePct !== null) parts.push(`${possSubj(c)}'s ${total} warheads are ${sharePhrase(ctx)} of the world's roughly ${ctx.worldTotal.toLocaleString()}.`)
  if (dep && dep !== '0' && stock) parts.push(`Of the stockpile of ${stock}, ${dep} sit deployed on launchers and the rest are held in reserve.`)
  else if (stock) parts.push(`FAS lists none of the ${stock}-warhead stockpile as deployed; they are held in reserve.`)
  if (retired && !/^[–.\s]*$/.test(retired)) parts.push(`A separate ${retired} are retired and awaiting dismantlement — counted in the total inventory but not in the usable stockpile.`)
  if (!parts.length) return null
  return (
    <p className="text-green-300 text-sm mt-3">{parts.join(' ')}<Cite c={cites} ids={`${FAS_SRC};${SIPRI_SRC}`} /></p>
  )
}

// ── Delivery systems — adaptive columns, responsive grid (fix #6) ────────────
function cleanCategory(cat: string): string {
  return cat.replace(/\s*\([^)]*\)/g, '').trim()
}
function DeliverySection({ c, cites }: { c: Country; cites: Citations }) {
  const all = rowsWith(c, 'delivery.')
  const tableRows = all.filter((r) => isStructured(r.value))
  const notes = all.filter((r) => !isStructured(r.value))
  if (!tableRows.length && !notes.length) return null
  const srcRow = tableRows[0] ?? notes[0]
  const asOf = cleanAsOf(srcRow?.asOf ?? '')
  const hasYield = tableRows.some((r) => cells(r.value)['warhead_yield'])
  const hasRange = tableRows.some((r) => cells(r.value)['range'])
  // System · Launchers · (Yield|Range) · Warheads — only the fourth varies.
  const fourth = hasYield ? { key: 'warhead_yield', label: 'Yield' } : hasRange ? { key: 'range', label: 'Range' } : null
  const cols = [
    { key: 'designation', label: 'System' },
    { key: 'launchers', label: 'Launchers' },
    ...(fourth ? [fourth] : []),
    { key: 'warheads', label: 'Warheads' },
  ]
  const gridCls = cols.length === 4
    ? 'sm:grid-cols-[1.7fr_0.8fr_1.4fr_0.9fr]'
    : 'sm:grid-cols-[2fr_1fr_1fr]'
  return (
    <section id="delivery" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">How {subj(c)} delivers them</h2>
      <p className="text-green-300 mb-3 text-sm">
        Delivery systems from the latest Nuclear Notebook{asOf ? ` (${asOf})` : ''}. A &ldquo;?&rdquo; or a dash is the source&rsquo;s own mark of an unstated figure.<Cite c={cites} ids={srcRow?.sourceId ?? ''} />
      </p>
      {tableRows.length > 0 && (
        <div className="border border-green-500/30 rounded-lg overflow-hidden text-sm">
          <div className={`hidden sm:grid ${gridCls} gap-2 px-3 py-2 border-b border-green-500/30 text-yellow-400 font-semibold`}>
            {cols.map((col) => (
              <div key={col.key} className={col.key === 'warheads' || col.key === 'launchers' ? 'text-right' : ''}>{col.label}</div>
            ))}
          </div>
          {tableRows.map((r) => {
            const cl = cells(r.value)
            const isSub = r.field.endsWith('.subtotal') || r.field.includes('.table.')
            return (
              <div key={r.field} className={`grid grid-cols-1 ${gridCls} gap-x-2 gap-y-0.5 px-3 py-2 border-b border-green-500/10 last:border-0 ${isSub ? 'font-semibold text-green-200 bg-black/30' : 'text-green-300'}`}>
                {cols.map((col) => {
                  const v = cl[col.key] ?? (col.key === 'designation' && isSub ? 'Subtotal' : '')
                  if (v === '') return <div key={col.key} className="hidden sm:block" />
                  const alignRight = col.key === 'warheads' || col.key === 'launchers'
                  return (
                    <div key={col.key} className={alignRight ? 'sm:text-right' : ''}>
                      <span className="sm:hidden text-green-300/50">{col.label}: </span>
                      {col.key === 'designation' && cl['category'] && !isSub
                        ? <span>{v} <span className="text-green-300/50">· {cleanCategory(cl['category'])}</span></span>
                        : v}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
      {notes.length > 0 && (
        <ul className="space-y-1 text-sm text-green-300/90 list-disc list-inside mt-3">
          {notes.map((r) => (
            <li key={r.field}>{humanizeDates(r.value)}<Cite c={cites} ids={r.sourceId} /></li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ── Blast radius of the country's warheads ──
function blastYields(c: Country): { yields: number[]; useTests: boolean } {
  const useTests = c.warheadYieldsKt.length === 0
  return { yields: useTests ? c.testYieldsKt : c.warheadYieldsKt, useTests }
}
function BlastRadiusSection({ c, cites }: { c: Country; cites: Citations }) {
  const { yields, useTests } = blastYields(c)
  if (!yields.length) return null
  return (
    <section id="blast-radius" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">Blast radius of {headingPoss(c.key, c.name, 'warheads')}</h2>
      <p className="text-green-300 mb-3 text-sm">
        For each {useTests ? 'tested yield' : 'distinct warhead yield'} {short(c)} fields, the air-burst 5 psi radius (where most homes are destroyed) and the 3rd-degree-burn radius, <Link href="/methodology" className="text-yellow-400 hover:underline">calculated</Link> by the same engine as the <Link href="/nuclear-blast-radius" className="text-yellow-400 hover:underline">blast radius calculator</Link>.<Cite c={cites} ids={ENGINE_IDS.join(';')} />
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
      {useTests && <p className="text-xs text-green-300/60 mt-2">Based on {short(c)}&rsquo;s verified test yields; no per-warhead yield is published.</p>}
    </section>
  )
}

// ── Test history ──
function humanizeField(field: string): string {
  const s = field.replace(/^tests\./, '').replace(/[._-]+/g, ' ').trim()
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function TestSection({ c, cites, disclosure }: { c: Country; cites: Citations; disclosure?: string }) {
  const tests = rowsWith(c, 'tests.')
  if (!tests.length && !disclosure) return null
  return (
    <section id="tests" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">{headingPoss(c.key, c.name, 'nuclear tests')}</h2>
      <dl className="space-y-2 text-sm">
        {tests.map((r) => (
          <div key={r.field} className="sm:flex sm:gap-3">
            <dt className="text-green-300/70 sm:w-56 sm:shrink-0">{humanizeField(r.field)}</dt>
            <dd className="text-green-200">{humanizeDates(r.value)}<Cite c={cites} ids={r.sourceId} /></dd>
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
            <dt className="text-green-300/70 sm:w-40 sm:shrink-0">{humanizeField(r.field).replace(/^Treaty /, '').replace(/\bnpt\b/i, 'NPT').replace(/\bctbt\b/i, 'CTBT')}</dt>
            <dd className="text-green-200">{humanizeDates(r.value)}<Cite c={cites} ids={r.sourceId} /></dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// ── Leftover verified rows as notes (warhead rows not in the two tables, etc.) ──
function notesRows(c: Country): CountryRow[] {
  return c.rows.filter((r) =>
    !WARHEAD_FIELDS.has(r.field) &&
    !/^(delivery|tests|treaty|status|iaea|june2025|cooperation|snapback|war2026|mou_)/.test(r.field))
}
function NotesSection({ c, cites }: { c: Country; cites: Citations }) {
  const extra = notesRows(c)
  if (!extra.length) return null
  return (
    <section id="notes" className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3 text-green-400">Also worth knowing</h2>
      <ul className="space-y-1 text-sm text-green-300/90 list-disc list-inside">
        {extra.map((r) => (
          <li key={r.field}>{humanizeDates(r.value)}<Cite c={cites} ids={r.sourceId} /></li>
        ))}
      </ul>
    </section>
  )
}

const DISCLOSURES: Record<string, string> = {
  china: 'China has not published an official total number of tests, and secondary compilations differ, so this page does not assert a single total.',
  india: 'No fetched source states an all-time total for India; the dated test events above are listed instead.',
  'north-korea': "FAS does not estimate North Korea's launcher counts or a per-system warhead split; those figures are a source-level gap.",
  pakistan: "Pakistan's per-system warhead allocation is published only as a table image and is not reproduced here; the systems and their ranges are listed above.",
  israel: 'Israel neither confirms nor denies its arsenal; the delivery figures are SIPRI’s January 2024 data, the latest available.',
  'united-kingdom': 'The name of the last UK test was not captured from a fetched primary source.',
}

// ── FAQ (4–6 questions, 40–80-word cited answers, computed from rows; fix #5) ──
type Faq = { question: string; answer: string; sourceId: string }
function buildFaq(c: Country, ctx: Ctx): Faq[] {
  const out: Faq[] = []
  const total = val(c, 'warheads.fas.total_inventory')
  const stock = val(c, 'warheads.fas.military_stockpile')
  const sipriTotal = val(c, 'warheads.sipri.total_inventory')
  const agree = sipriTotal.replace(/\s/g, '') === total.replace(/[\s,]/g, '')
  const us = val(COUNTRIES['united-states'], 'warheads.fas.total_inventory')
  const ru = val(COUNTRIES['russia'], 'warheads.fas.total_inventory')
  if (total) {
    out.push({
      question: `How many nuclear weapons does ${subj(c)} have?`,
      answer: `The Federation of American Scientists estimates ${subj(c)} has about ${total} nuclear warheads as of early 2026${stock ? `, of which roughly ${stock} are in the usable military stockpile` : ''}. ${agree ? 'SIPRI’s independent January 2026 count is the same.' : `SIPRI’s January 2026 count is ${sipriTotal}.`} Exact numbers are secret; both estimates are expert assessments.`,
      sourceId: FAS_SRC,
    })
  }
  if (ctx.sharePct !== null && c.key !== 'united-states' && c.key !== 'russia') {
    out.push({
      question: `How does ${possSubjLower(c)}'s arsenal compare to the US and Russia?`,
      answer: `${possSubj(c)}'s ${total} warheads are ${sharePhrase(ctx)} of the world's roughly ${ctx.worldTotal.toLocaleString()}. That is a small fraction of the United States' ${us} and Russia's ${ru}, which between them hold most of the planet's nuclear weapons. ${subj(c) === c.name ? c.name : 'It'} ranks number ${ctx.rank} of the nine nuclear-armed states by total inventory.`,
      sourceId: FAS_SRC,
    })
  }
  const first = row(c, 'tests.first') || row(c, 'tests.first.name_date') || row(c, 'tests.first.date_site') || row(c, 'tests.first.date') || row(c, 'tests.first.ctbto')
  const last = row(c, 'tests.last') || row(c, 'tests.last.date') || row(c, 'tests.last.date_site')
  if (first) {
    out.push({
      question: `When did ${subj(c)} test nuclear weapons?`,
      answer: `${possSubj(c)}'s first nuclear test is recorded as ${humanizeDates(first.value)}.${last ? ` Its most recent recorded test was ${humanizeDates(last.value)}.` : ''} The dates and yields come from official and high-authority test records; the full history, with sites and yields where available, is in the test-history section above.`,
      sourceId: first.sourceId,
    })
  }
  // Delivery summary FAQ
  const sysNames = rowsWith(c, 'delivery.').filter((r) => isStructured(r.value) && !r.field.endsWith('.subtotal') && !r.field.includes('.table.')).map((r) => cells(r.value)['designation']).filter(Boolean)
  const dRow = rowsWith(c, 'delivery.')[0]
  if (sysNames.length && dRow) {
    out.push({
      question: `What can carry ${possSubjLower(c)}'s nuclear weapons?`,
      answer: `As of the latest Nuclear Notebook, ${subj(c)} can deliver nuclear weapons with systems including ${sysNames.slice(0, 4).join(', ')}, among others. Full launcher and warhead counts for each system are in the delivery table above.`,
      sourceId: dRow.sourceId,
    })
  }
  const nptMain = row(c, 'treaty.npt')
  const nptAcc = row(c, 'treaty.npt.accession')
  const nptWithdrawal = row(c, 'treaty.npt.withdrawal')
  const ctbt = row(c, 'treaty.ctbt') || row(c, 'treaty.ctbt.signed') || row(c, 'treaty.ctbt.signature')
  if (nptMain || nptAcc) {
    const nptText = nptMain
      ? `On the Non-Proliferation Treaty, ${subj(c)} is: ${humanizeDates(nptMain.value)}.`
      : `${Subj(c)} acceded to the Non-Proliferation Treaty on ${humanizeDates(nptAcc!.value)}.${nptWithdrawal ? ` It later announced its withdrawal (${humanizeDates(nptWithdrawal.value)}).` : ''}`
    out.push({
      question: `Is ${subj(c)} in the Non-Proliferation Treaty?`,
      answer: `${nptText}${ctbt ? ` On the Comprehensive Nuclear-Test-Ban Treaty: ${humanizeDates(ctbt.value)}.` : ''} The NPT is the central treaty against the spread of nuclear weapons, and the CTBT bans nuclear-test explosions; these statuses are drawn from the treaty databases.`,
      sourceId: (nptMain ?? nptWithdrawal ?? nptAcc)!.sourceId,
    })
  }
  return out
}

// ── Iran status page ────────────────────────────────────────────────────────
const IRAN_STOCKPILE: Array<[string, string]> = [
  ['iaea.stockpile.total_enriched', 'Total enriched uranium'],
  ['iaea.stockpile.up_to_60pct', 'Enriched up to 60% U-235'],
  ['iaea.stockpile.up_to_60pct_verified', 'of which IAEA-verified'],
  ['iaea.stockpile.up_to_20pct', 'Enriched up to 20% U-235'],
  ['iaea.stockpile.up_to_5pct', 'Enriched up to 5% U-235'],
]
// Timeline entries presented as full, dated sentences (the facts and dates come
// from the verified rows; abbreviations are spelled out).
function iranTimeline(c: Country): Array<{ date: string; text: string; sourceId: string }> {
  const g = (f: string) => row(c, f)
  const items: Array<{ date: string; text: string; sourceId: string }> = []
  const push = (f: string, date: string, text: string) => { const r = g(f); if (r) items.push({ date, text, sourceId: r.sourceId }) }
  push('june2025.israel_operation', '13 June 2025', 'Israel began a military operation that struck several Iranian nuclear facilities.')
  push('june2025.us_strikes', '22 June 2025', 'The United States struck three nuclear facilities — Fordow, Natanz and Esfahan.')
  push('june2025.fordow', '22 June 2025', 'The IAEA reported Fordow was directly hit; damage inside the enrichment halls could not be determined.')
  push('cooperation.law_2025-07-02', '2 July 2025', 'Iran signed into force a law suspending cooperation with the IAEA.')
  push('snapback.e3_notification', '28 August 2025', 'France, Germany and the United Kingdom (the E3) notified the UN Security Council to trigger the "snapback" of sanctions.')
  push('cooperation.cairo_2025-09-09', '9 September 2025', 'The IAEA and Iran reached an understanding on resuming inspections (the "Cairo agreement").')
  push('snapback.unsc_vote', '26 September 2025', 'A Security Council draft to extend sanctions relief was rejected (9 against, 4 in favour, 2 abstentions).')
  push('snapback.effective', '27 September 2025', 'The snapback measures were set to re-enter into effect.')
  push('cooperation.cairo_terminated', '20 November 2025', 'Iran notified the IAEA that the Cairo understanding was no longer valid.')
  push('war2026.start', '28 February 2026', 'The United States and Israel launched further attacks, including on some nuclear-facility sites.')
  push('war2026.natanz', 'March 2026', 'Satellite imagery showed the entrance buildings of the Natanz Fuel Enrichment Plant (FEP) damaged.')
  push('war2026.khondab', '27 March 2026', 'The Khondab heavy-water production plant was attacked (the IAEA does not classify it as a nuclear facility).')
  push('war2026.ceasefire', '8 April 2026', 'A conditional ceasefire was declared.')
  push('iaea.inspections_2026', '1–3 June 2026', 'The IAEA carried out one inspection and a design-information verification (DIV) at the Bushehr nuclear power plant (NPP).')
  push('iaea.board_resolution_2026-09', '9 September 2026', 'The IAEA Board of Governors adopted resolution GOV/2026/61 on Iran.')
  return items
}

function IranPage({ c, path }: { c: Country; path: string }) {
  const kg60 = val(c, 'iaea.stockpile.up_to_60pct')
  const timeline = iranTimeline(c)
  const statusRows = rowsWith(c, 'status.')
  const iaeaNow = ['iaea.continuity_of_knowledge', 'iaea.safeguards_unable', 'iaea.dg_concern', 'iaea.access.affected_facilities', 'iaea.ifep']
    .map((f) => row(c, f)).filter((r): r is CountryRow => Boolean(r))
  const npt = row(c, 'treaty.npt')
  const ctbt = row(c, 'treaty.ctbt')
  const HEU_SRC = 'nrc-glossary-highly-enriched-uranium'
  const NTI_SRC = 'nti-a-little-enrichment-goes-a-long-way'

  const faq: Faq[] = [
    { question: 'Does Iran have nuclear weapons?', answer: `No. As of early 2026, neither the Federation of American Scientists nor SIPRI counts Iran among the world's nine nuclear-armed states, and the US intelligence community's 2025 assessment was that Iran was not building a weapon. Iran has enriched uranium but is not assessed to possess a nuclear weapon.`, sourceId: row(c, 'status.not_among_nuclear_armed.fas')?.sourceId ?? FAS_SRC },
    { question: 'How much enriched uranium does Iran have?', answer: `The IAEA's most recent estimate, as of 13 June 2025, was ${kg60} kg of uranium enriched up to 60% U-235, within a larger stockpile of less-enriched material. Since the June 2025 attacks the Agency says it cannot confirm the stockpile's current size, composition or location.`, sourceId: row(c, 'iaea.stockpile.up_to_60pct')?.sourceId ?? '' },
    { question: 'What does 60% enriched uranium mean?', answer: `Uranium enriched to 20% or more U-235 is called highly enriched uranium (HEU); weapons-grade uranium is usually described as about 90% U-235. Iran's 60% material is highly enriched and far above the 3–5% used in power reactors, but it is still below the level typically used in weapons.`, sourceId: HEU_SRC },
    { question: 'Can the IAEA verify what Iran is doing now?', answer: `Not fully. Since the June 2025 attacks the Agency has, for more than a year, lost continuity of knowledge of Iran's nuclear material, and it reports that it can no longer discharge its Non-Proliferation-Treaty safeguards responsibilities in Iran. Its Director General has called the situation a serious proliferation concern.`, sourceId: row(c, 'iaea.continuity_of_knowledge')?.sourceId ?? '' },
    { question: 'What happened to Iran\'s nuclear sites in 2025 and 2026?', answer: `In June 2025, Israeli and then US strikes hit facilities including Fordow, Natanz and Esfahan. Further US–Israel attacks began on 28 February 2026, and a conditional ceasefire was declared on 8 April 2026. The IAEA has limited access to the affected sites.`, sourceId: row(c, 'june2025.us_strikes')?.sourceId ?? '' },
    { question: 'Is Iran in the Non-Proliferation Treaty?', answer: `Yes. On the Non-Proliferation Treaty, Iran is: ${npt ? humanizeDates(npt.value) : 'a party'}. On the Comprehensive Nuclear-Test-Ban Treaty: ${ctbt ? humanizeDates(ctbt.value) : 'signed, not ratified'}. As an NPT party, Iran accepts IAEA safeguards on its declared nuclear material; the dispute is over the IAEA's recent inability to verify that material, not over Iran's treaty membership.`, sourceId: npt?.sourceId ?? '' },
  ]

  // Pre-register every cited id in DOM order (fix #1).
  const ids = uniq([
    FAS_SRC, SIPRI_SRC,
    row(c, 'iaea.stockpile.up_to_60pct')?.sourceId ?? '',
    HEU_SRC, NTI_SRC,
    ...IRAN_STOCKPILE.map(([f]) => row(c, f)?.sourceId ?? ''),
    ...statusRows.map((r) => r.sourceId),
    ...iaeaNow.map((r) => r.sourceId),
    ...timeline.map((t) => t.sourceId),
    ...rowsWith(c, 'treaty.').map((r) => r.sourceId),
    ...faq.map((q) => q.sourceId),
    ...c.rows.map((r) => r.sourceId),
  ])
  const cites = createCitationsFrom(ids)

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-country-iran"
        schema={[
          articleSchema({ url: path, headline: pageH1(path), description: pageDescription(path) }),
          faqPageSchema(faq.map((q) => ({ question: q.question, answer: q.answer }))),
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
          <p className="text-lg text-green-300">Where Iran&rsquo;s nuclear program stands in 2026: what the IAEA can verify, what it cannot, and a dated record of how it got here. Every figure is attributed.</p>
          <Byline className="mt-2" />
        </header>

        <section className="mb-8 bg-black/40 border border-green-500/20 rounded-lg p-5">
          <p className="text-green-200">
            <strong className="text-yellow-400">No.</strong> As of early 2026, neither the Federation of American Scientists nor SIPRI counts Iran among the world&rsquo;s nine nuclear-armed states.<Cite c={cites} ids={`${FAS_SRC};${SIPRI_SRC}`} /> The International Atomic Energy Agency&rsquo;s last stockpile estimate, from <strong className="text-yellow-400">13 June 2025</strong>, was <strong className="text-yellow-400">{kg60} kg</strong> of uranium enriched up to 60% U-235. Since the attacks that began that day, the Agency says it can no longer confirm the stockpile&rsquo;s current size, composition or location.<Cite c={cites} ids={row(c, 'iaea.stockpile.up_to_60pct')?.sourceId ?? ''} />
          </p>
        </section>

        <section id="status" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Does Iran have nuclear weapons?</h2>
          <p className="text-green-300 mb-3">
            Every major open assessment places Iran outside the group of nuclear-armed states. It is a party to the Non-Proliferation Treaty and has long enriched uranium under IAEA safeguards, but it is not assessed to possess a weapon.
          </p>
          <p className="text-green-300">
            FAS and SIPRI both place Iran outside their lists of the world&rsquo;s nine nuclear-armed states.<Cite c={cites} ids={[row(c, 'status.not_among_nuclear_armed.fas')?.sourceId, row(c, 'status.not_among_nuclear_armed.sipri')?.sourceId].filter(Boolean).join(';')} /> The US intelligence community&rsquo;s 2025 public assessment, as quoted by the Congressional Research Service, was that &ldquo;Iran is not building a nuclear weapon,&rdquo;<Cite c={cites} ids={row(c, 'status.us_intelligence_2025')?.sourceId ?? ''} /> though CRS describes the current status of the program as unclear.<Cite c={cites} ids={row(c, 'status.crs_oct2026')?.sourceId ?? ''} />
          </p>
        </section>

        <section id="stockpile" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Iran&rsquo;s enriched-uranium stockpile</h2>
          <p className="text-green-300 mb-3 text-sm">
            These are the IAEA&rsquo;s figures <strong className="text-green-200">as of 13 June 2025</strong>, the last date it could take measurements. The Agency reports it <em>cannot currently verify</em> them.<Cite c={cites} ids={row(c, 'iaea.stockpile.up_to_60pct')?.sourceId ?? ''} />
          </p>
          <div className="bg-black/40 border border-green-500/20 rounded-lg p-4 mb-3">
            <table className="w-full text-sm text-green-300">
              <tbody>
                {IRAN_STOCKPILE.map(([f, label]) => { const r = row(c, f); if (!r) return null; return (
                  <tr key={f} className="border-b border-green-500/10 last:border-0">
                    <th scope="row" className="text-left py-1 font-normal">{label}</th>
                    <td className="text-right py-1 tabular-nums text-green-200">{r.value} kg</td>
                  </tr>) })}
              </tbody>
            </table>
          </div>
          <p className="text-green-300 text-sm">
            Uranium enriched to <strong className="text-green-200">20% or more</strong> U-235 is called <strong className="text-yellow-400">highly enriched uranium (HEU)</strong>.<Cite c={cites} ids={HEU_SRC} /> Weapons-grade uranium is usually described as about <strong className="text-yellow-400">90%</strong> U-235, while power reactors use 3–5%.<Cite c={cites} ids={NTI_SRC} /> Iran&rsquo;s 60% material is therefore highly enriched and well above reactor grade, but below the level typically used in weapons.
          </p>
        </section>

        <section id="iaea" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">What the IAEA can and can&rsquo;t verify now</h2>
          <p className="text-green-300 mb-3">
            The strikes and Iran&rsquo;s 2025 cooperation-suspension law left the IAEA unable to keep full track of the program. For more than a year the Agency has lost continuity of knowledge of Iran&rsquo;s nuclear material,<Cite c={cites} ids={row(c, 'iaea.continuity_of_knowledge')?.sourceId ?? ''} /> and it reports that it can no longer discharge its Non-Proliferation-Treaty safeguards responsibilities in Iran<Cite c={cites} ids={row(c, 'iaea.safeguards_unable')?.sourceId ?? ''} /> — a situation its Director General calls a serious proliferation concern.<Cite c={cites} ids={row(c, 'iaea.dg_concern')?.sourceId ?? ''} />
          </p>
          <p className="text-green-300">
            It has had no access to the facilities hit in the June 2025 attacks,<Cite c={cites} ids={row(c, 'iaea.access.affected_facilities')?.sourceId ?? ''} /> and a fourth declared enrichment facility at Isfahan was never accessed, its location unknown to the Agency.<Cite c={cites} ids={row(c, 'iaea.ifep')?.sourceId ?? ''} />
          </p>
        </section>

        <section id="timeline" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Timeline: June 2025 to 2026</h2>
          <ol className="space-y-3 text-sm border-l border-green-500/30 pl-4">
            {timeline.map((t, i) => (
              <li key={i} className="text-green-200">
                <strong className="text-yellow-400">{t.date}.</strong> {t.text}<Cite c={cites} ids={t.sourceId} />
              </li>
            ))}
          </ol>
        </section>

        <TreatySection c={c} cites={cites} />

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

        <section id="methodology" className="mb-6 mt-4">
          <p className="text-green-300/80 text-sm mb-2">
            This page uses only verified figures, cited inline and listed below: IAEA Director-General reports (GOV/2026/50, GOV/2026/33 and the Board resolution, via Iran Watch copies), the Federation of American Scientists and SIPRI for Iran&rsquo;s status, and US Congressional Research Service and UK House of Commons Library briefings for the 2025–2026 events. It carries no delivery systems or blast radii, because Iran is not assessed to have nuclear weapons.
          </p>
          <p className="text-xs text-green-300/60">Data as of 22 October 2026. Reviewed quarterly and after major events. By Marko Visic, BSc Physics.</p>
        </section>

        <Sources c={cites} />
        <SiblingNav currentKey="iran" />
      </main>
    </div>
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

// ── Arsenal page ─────────────────────────────────────────────────────────────
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

function ArsenalPage({ c, path }: { c: Country; path: string }) {
  const ctx = buildCtx(c)
  const da = directAnswer(c)
  const fasAsOf = row(c, 'warheads.fas.total_inventory')?.asOf ?? 'early 2026'
  const sipriAsOf = row(c, 'warheads.sipri.total_inventory')?.asOf ?? 'January 2026'
  const faq = buildFaq(c, ctx)
  const { yields } = blastYields(c)

  // Pre-register every cited id in DOM order (fix #1).
  const ids = uniq([
    FAS_SRC, SIPRI_SRC,
    ...rowsWith(c, 'delivery.').map((r) => r.sourceId),
    ...(yields.length ? ENGINE_IDS : []),
    ...rowsWith(c, 'tests.').map((r) => r.sourceId),
    ...rowsWith(c, 'treaty.').map((r) => r.sourceId),
    ...notesRows(c).map((r) => r.sourceId),
    ...faq.map((q) => q.sourceId),
    ...c.rows.map((r) => r.sourceId),
  ])
  const cites = createCitationsFrom(ids)

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
          <p className="text-lg text-green-300">{buildIntro(c, ctx)}</p>
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
            <WarheadTable c={c} src="FAS" pairs={FAS_ROWS} asOf={fasAsOf} />
            <WarheadTable c={c} src="SIPRI" pairs={SIPRI_ROWS} asOf={sipriAsOf} />
          </div>
          <WarheadContext c={c} ctx={ctx} cites={cites} />
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

        <section id="methodology" className="mb-6 mt-4">
          <p className="text-green-300/80 text-sm mb-2">
            Every figure on this page comes from a verified primary source, cited inline and listed below. Warhead counts are the Federation of American Scientists&rsquo; Status of World Nuclear Forces and SIPRI&rsquo;s Yearbook; delivery systems come from the Nuclear Notebook; blast radii are <Link href="/methodology" className="text-yellow-400 hover:underline">calculated</Link> from Glasstone &amp; Dolan scaling laws. Candidate and unverified figures are withheld.
          </p>
          <p className="text-xs text-green-300/60">Data as of 22 October 2026. By Marko Visic, BSc Physics.</p>
        </section>

        <Sources c={cites} />
        <SiblingNav currentKey={c.key} />
      </main>
    </div>
  )
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const c = getCountry(country)
  if (!c) notFound()
  const path = `/nuclear-weapons-by-country/${country}`
  return c.key === 'iran' ? <IranPage c={c} path={path} /> : <ArsenalPage c={c} path={path} />
}
