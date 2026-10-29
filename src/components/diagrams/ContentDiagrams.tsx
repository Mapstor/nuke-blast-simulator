// NBS-014/015: server-rendered, inline (crawlable) SVGs for the content pages.
// No client JS. Every number is either a verified fact from
// research/retarget-facts-2026-10-28.csv (cited in each figure's caption) or
// computed from the engine (effects.ts). Text sits in legends/axes, never over
// a stroke, so there are no collisions. The viewBox is 680 wide; in the article
// column (~294px on a 390px phone) a 26px label renders ~11.2px (26 x 294 /
// 680), so the NBS-015 Hiroshima figures size their labels at 26px or more.
import type { ReactElement } from 'react'
import { effectRadiiKm, formatRadiusKm, formatRadiusMi } from '@/lib/calculations/effects'

const W = 680
const C = {
  bg: '#0a1810',
  grid: '#14532d',
  axis: '#86efac',
  title: '#4ade80',
  body: '#d1fae5',
  accent: '#fde047',
  blast: '#f97316',
  thermal: '#d946ef',
  radiation: '#a3e635',
  residual: '#9ca3af',
  claim: '#f0abfc',
} as const
const svgStyle = { width: '100%', height: 'auto', maxWidth: W } as const

// ── 1. What happens, in order — a 1-megaton air-burst timeline ──────────────
// Times/distances from Glasstone & Dolan (DTIC ADA087568): §2.04, §2.05, §1.73,
// §1.26, §2.32, §2.12, §2.15. Numbered dots on a log-time axis; legend below.
const TIMELINE_EVENTS = [
  { t: 1e-6, n: 1, label: 'Fireball forms (under a millionth of a second)' },
  { t: 7e-4, n: 2, label: 'Fireball about 440 ft across (0.7 ms)' },
  { t: 1, n: 3, label: 'Flash of light and heat (speed of light)' },
  { t: 10, n: 4, label: 'Fireball ~5,700 ft; shock front ~3 mi (10 s)' },
  { t: 30, n: 5, label: 'Mushroom cloud top about 3 miles (30 s)' },
  { t: 50, n: 6, label: 'Shock front ~12 mi out, ~1,150 ft/s (50 s)' },
  { t: 60, n: 7, label: 'Cloud top about 5 miles (about 1 minute)' },
  { t: 600, n: 8, label: 'Cloud reaches maximum height (~10 min)' },
]

export function ExplosionTimeline() {
  const padL = 50
  const padR = 30
  const axisY = 150
  const plotW = W - padL - padR
  const lo = Math.log10(1e-6)
  const hi = Math.log10(1000)
  const x = (t: number) => padL + ((Math.log10(t) - lo) / (hi - lo)) * plotW
  const ticks = [
    { t: 1e-6, label: '1 µs' },
    { t: 1e-3, label: '1 ms' },
    { t: 1, label: '1 s' },
    { t: 10, label: '10 s' },
    { t: 60, label: '1 min' },
    { t: 600, label: '10 min' },
  ]
  const rowH = 46
  const legendTop = 212
  const H = legendTop + TIMELINE_EVENTS.length * rowH + 16

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" style={svgStyle}
      aria-label="Timeline of a 1-megaton nuclear air burst on a logarithmic time axis, from the fireball forming in under a millionth of a second to the cloud reaching maximum height at about 10 minutes.">
      <title>What happens in a 1-megaton air burst, second by second</title>
      <rect x="0" y="0" width={W} height={H} fill={C.bg} rx="10" />
      <text x={padL} y="46" fill={C.title} fontSize="30" fontWeight="700" fontFamily="sans-serif">One megaton, second by second</text>
      <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke={C.axis} strokeWidth="2" />
      {ticks.map((tk) => (
        <g key={tk.label}>
          <line x1={x(tk.t)} y1={axisY - 7} x2={x(tk.t)} y2={axisY + 7} stroke={C.axis} strokeWidth="2" />
          <text x={x(tk.t)} y={axisY + 34} textAnchor="middle" fill={C.axis} fontSize="24" fontFamily="sans-serif">{tk.label}</text>
        </g>
      ))}
      {TIMELINE_EVENTS.map((e) => (
        <g key={e.n}>
          <line x1={x(e.t)} y1={axisY - 22} x2={x(e.t)} y2={axisY - 7} stroke={C.accent} strokeWidth="2" />
          <circle cx={x(e.t)} cy={axisY - 37} r="17" fill={C.accent} />
          <text x={x(e.t)} y={axisY - 30} textAnchor="middle" fill="#0a1810" fontSize="22" fontWeight="700" fontFamily="sans-serif">{e.n}</text>
        </g>
      ))}
      {TIMELINE_EVENTS.map((e, i) => {
        const y = legendTop + i * rowH
        return (
          <g key={`l${e.n}`}>
            <circle cx={padL + 15} cy={y} r="16" fill={C.accent} />
            <text x={padL + 15} y={y + 7} textAnchor="middle" fill="#0a1810" fontSize="22" fontWeight="700" fontFamily="sans-serif">{e.n}</text>
            <text x={padL + 42} y={y + 8} fill={C.body} fontSize="24" fontFamily="sans-serif">{e.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── 2. Where the energy goes (fission weapon, air burst) ────────────────────
// Glasstone & Dolan §1.25-1.26: 50% blast, 35% thermal, 5% initial nuclear
// radiation, 10% residual radiation. Exported so the OG metric can derive the
// blast+thermal share instead of hard-coding it.
export const ENERGY = [
  { label: 'Blast', pct: 50, color: C.blast },
  { label: 'Thermal radiation', pct: 35, color: C.thermal },
  { label: 'Initial radiation', pct: 5, color: C.radiation },
  { label: 'Residual radiation', pct: 10, color: C.residual },
]

export function EnergySplitBar() {
  const padL = 40
  const barW = W - padL * 2
  const barY = 70
  const barH = 80
  let acc = 0
  const segs = ENERGY.map((e) => {
    const x = padL + (acc / 100) * barW
    const w = (e.pct / 100) * barW
    acc += e.pct
    return { ...e, x, w }
  })
  const legendTop = barY + barH + 42
  const rowH = 46
  const H = legendTop + ENERGY.length * rowH
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" style={svgStyle}
      aria-label="How the energy of a fission air burst divides: 50 percent blast, 35 percent thermal radiation, 5 percent initial nuclear radiation and 10 percent residual radiation.">
      <title>Where a nuclear explosion&rsquo;s energy goes</title>
      <rect x="0" y="0" width={W} height={H} fill={C.bg} rx="10" />
      <text x={padL} y="46" fill={C.title} fontSize="30" fontWeight="700" fontFamily="sans-serif">Where the energy goes</text>
      {segs.map((s) => (
        <g key={s.label}>
          <rect x={s.x} y={barY} width={s.w} height={barH} fill={s.color} opacity="0.85" />
          {s.pct >= 10 ? (
            <text x={s.x + s.w / 2} y={barY + barH / 2 + 11} textAnchor="middle" fill="#0a1810" fontSize="30" fontWeight="800" fontFamily="sans-serif">{s.pct}%</text>
          ) : null}
        </g>
      ))}
      {ENERGY.map((e, i) => {
        const y = legendTop + i * rowH
        return (
          <g key={`lg${e.label}`}>
            <rect x={padL} y={y - 20} width="28" height="28" fill={e.color} opacity="0.85" rx="4" />
            <text x={padL + 42} y={y} fill={C.body} fontSize="26" fontFamily="sans-serif">{e.label} — {e.pct}%</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── 3. First thermonuclear test by country (yield, log scale) ───────────────
// Horizontal log-scale bars, one per country, ordered by year. Confirmed:
// Ivy Mike (US, 1952, 10.4 Mt), Joe-4 (USSR, 1953, 400 kt, first thermonuclear
// explosion), Grapple X (UK, 1957, 1.8 Mt), Test No. 6 (China, 1967, 3.3 Mt),
// Canopus (France, 1968, 2.6 Mt). Claimed/disputed: India 1998 (~43 kt) and
// North Korea 2017 (~250 kt), drawn hollow/dashed.
const HBOMB_TESTS = [
  { country: 'US', year: 1952, kt: 10400, claim: false },
  { country: 'USSR', year: 1953, kt: 400, claim: false },
  { country: 'UK', year: 1957, kt: 1800, claim: false },
  { country: 'China', year: 1967, kt: 3300, claim: false },
  { country: 'France', year: 1968, kt: 2600, claim: false },
  { country: 'India', year: 1998, kt: 43, claim: true },
  { country: 'N. Korea', year: 2017, kt: 250, claim: true },
]
function ktLabel(kt: number): string {
  return kt >= 1000 ? `${kt / 1000} Mt` : `${kt} kt`
}

export function HBombTestTimeline() {
  const padL = 150
  const padR = 90
  const padT = 70
  const rowH = 46
  const plotW = W - padL - padR
  const kLo = Math.log10(10)
  const kHi = Math.log10(100000)
  const x = (kt: number) => padL + ((Math.log10(kt) - kLo) / (kHi - kLo)) * plotW
  const H = padT + HBOMB_TESTS.length * rowH + 64
  const axisY = padT + HBOMB_TESTS.length * rowH + 6
  const xTicks = [
    { kt: 10, label: '10 kt' },
    { kt: 100, label: '100 kt' },
    { kt: 1000, label: '1 Mt' },
    { kt: 10000, label: '10 Mt' },
    { kt: 100000, label: '100 Mt' },
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" style={svgStyle}
      aria-label="Each country's first thermonuclear test, yield on a logarithmic scale, ordered by year from the United States in 1952 to North Korea's claimed test in 2017.">
      <title>First thermonuclear test by country, yield on a log scale</title>
      <rect x="0" y="0" width={W} height={H} fill={C.bg} rx="10" />
      <text x="24" y="44" fill={C.title} fontSize="30" fontWeight="700" fontFamily="sans-serif">First thermonuclear test by country</text>
      {xTicks.map((t) => (
        <line key={t.label} x1={x(t.kt)} y1={padT - 8} x2={x(t.kt)} y2={axisY} stroke={C.grid} strokeWidth="1" />
      ))}
      {HBOMB_TESTS.map((p, i) => {
        const y = padT + i * rowH
        const barColor = p.claim ? C.claim : C.accent
        return (
          <g key={p.country}>
            <text x={24} y={y + 26} fill={C.body} fontSize="24" fontFamily="sans-serif">{p.country} · {p.year}</text>
            <rect x={padL} y={y + 10} width={Math.max(2, x(p.kt) - padL)} height="22" rx="3"
              fill={p.claim ? 'none' : barColor} stroke={barColor} strokeWidth="3" strokeDasharray={p.claim ? '5 3' : undefined} />
            <text x={x(p.kt) + 10} y={y + 28} fill={C.axis} fontSize="24" fontFamily="sans-serif">{ktLabel(p.kt)}{p.claim ? '*' : ''}</text>
          </g>
        )
      })}
      <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke={C.axis} strokeWidth="2" />
      {xTicks.map((t) => (
        <text key={t.label} x={x(t.kt)} y={axisY + 30} textAnchor="middle" fill={C.axis} fontSize="22" fontFamily="sans-serif">{t.label}</text>
      ))}
      <text x={24} y={H - 12} fill={C.claim} fontSize="22" fontFamily="sans-serif">* claimed / disputed (India 1998, North Korea 2017)</text>
    </svg>
  )
}

// ── 4. Ring comparison for three hydrogen-bomb tests (engine) ───────────────
// Moderate-blast (5 psi) radius drawn to scale for Ivy Mike (10.4 Mt), Castle
// Bravo (15 Mt) and Tsar Bomba (50 Mt). Radii from effects.ts.
const HBOMB_RINGS = [
  { name: 'Ivy Mike', kt: 10400, color: '#4ade80' },
  { name: 'Castle Bravo', kt: 15000, color: C.blast },
  { name: 'Tsar Bomba', kt: 50000, color: C.thermal },
].map((b) => ({ ...b, km: effectRadiiKm(b.kt).overpressure5psi })).sort((a, b) => b.km - a.km)

export function HBombRingComparison() {
  const cx = 210
  const cy = 250
  const maxR = 170
  const max = HBOMB_RINGS[0].km
  const scale = maxR / max
  const legendX = 420
  const legendTop = 150
  const rowH = 86
  const H = 470
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" style={svgStyle}
      aria-label="Moderate-blast (5 psi) radius drawn to scale for three hydrogen-bomb tests: Ivy Mike, Castle Bravo and Tsar Bomba, with each radius in miles and kilometers.">
      <title>5 psi blast radius of three hydrogen-bomb tests, to scale</title>
      <rect x="0" y="0" width={W} height={H} fill={C.bg} rx="10" />
      <text x="28" y="46" fill={C.title} fontSize="28" fontWeight="700" fontFamily="sans-serif">5 psi blast radius, to scale</text>
      {HBOMB_RINGS.map((rg) => (
        <circle key={rg.name} cx={cx} cy={cy} r={rg.km * scale} fill="none" stroke={rg.color} strokeWidth="3" opacity="0.9" />
      ))}
      <circle cx={cx} cy={cy} r="3" fill={C.body} />
      {HBOMB_RINGS.map((rg, i) => {
        const y = legendTop + i * rowH
        return (
          <g key={`lg${rg.name}`}>
            <rect x={legendX} y={y - 20} width="28" height="28" fill="none" stroke={rg.color} strokeWidth="3" rx="14" />
            <text x={legendX + 42} y={y} fill={C.body} fontSize="26" fontWeight="700" fontFamily="sans-serif">{rg.name}</text>
            <text x={legendX + 42} y={y + 30} fill={C.axis} fontSize="22" fontFamily="sans-serif">{ktLabel(rg.kt)} · {formatRadiusMi(rg.km)} mi ({formatRadiusKm(rg.km)} km)</text>
          </g>
        )
      })}
    </svg>
  )
}

// Registry so a Section block can reference a diagram by id.
// ── 5. Hiroshima & Nagasaki death-toll estimates (hero) ─────────────────────
// Each city's end-of-1945 estimate and the RERF 2-4-month range, from verified
// rows. No images of people, injuries or destruction — figures only.
const DEATH_TOLLS = [
  { city: 'Hiroshima', end1945: 140000, end1945Label: 'about 140,000 (±10,000)', lo: 90000, hi: 166000, rerfLabel: '90,000–166,000' },
  { city: 'Nagasaki', end1945: 73884, end1945Label: '73,884', lo: 60000, hi: 80000, rerfLabel: '60,000–80,000' },
]

export function HiroshimaDeathTolls() {
  // The numeric value sits in a left-anchored label ABOVE each bar, so no text
  // can run past the 680-wide viewBox; the bar below it is the to-scale visual.
  const padL = 28
  const padR = 30
  const padT = 58
  const axisMax = 180000
  const plotW = W - padL - padR
  const xpos = (n: number) => padL + (n / axisMax) * plotW
  const barH = 18
  const ticks = [0, 50000, 100000, 150000]
  let y = padT
  const groups = DEATH_TOLLS.map((d) => {
    const name = y; y += 40
    const endLabel = y; const endBar = y + 10; y += 10 + barH + 22
    const rerfLabel = y; const rerfBar = y + 10; y += 10 + barH + 30
    return { d, name, endLabel, endBar, rerfLabel, rerfBar }
  })
  const axisY = y - 30 + 10
  const H = axisY + 52
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" style={svgStyle}
      aria-label="Death-toll estimates for Hiroshima and Nagasaki: each city's count by the end of 1945 and the Radiation Effects Research Foundation's estimate of deaths within two to four months.">
      <title>Hiroshima and Nagasaki death-toll estimates by source</title>
      <rect x="0" y="0" width={W} height={H} fill={C.bg} rx="10" />
      <text x={padL} y="40" fill={C.title} fontSize="28" fontWeight="700" fontFamily="sans-serif">Deaths by city and source</text>
      {ticks.map((t) => (
        <line key={t} x1={xpos(t)} y1={padT + 8} x2={xpos(t)} y2={axisY} stroke={C.grid} strokeWidth="1" />
      ))}
      {groups.map(({ d, name, endLabel, endBar, rerfLabel, rerfBar }) => (
        <g key={d.city}>
          <text x={padL} y={name + 26} fill={C.body} fontSize="26" fontWeight="700" fontFamily="sans-serif">{d.city}</text>
          <text x={padL} y={endLabel + 24} fill={C.axis} fontSize="26" fontFamily="sans-serif">By end of 1945: {d.end1945Label}</text>
          <rect x={padL} y={endBar} width={Math.max(2, xpos(d.end1945) - padL)} height={barH} rx="3" fill={C.accent} opacity="0.9" />
          <text x={padL} y={rerfLabel + 24} fill={C.axis} fontSize="26" fontFamily="sans-serif">RERF, 2–4 months: {d.rerfLabel}</text>
          <rect x={xpos(d.lo)} y={rerfBar} width={Math.max(2, xpos(d.hi) - xpos(d.lo))} height={barH} rx="3" fill="none" stroke={C.thermal} strokeWidth="3" />
        </g>
      ))}
      <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke={C.axis} strokeWidth="2" />
      {ticks.map((t) => (
        <text key={`t${t}`} x={xpos(t)} y={axisY + 34} textAnchor="middle" fill={C.axis} fontSize="26" fontFamily="sans-serif">{t / 1000}k</text>
      ))}
    </svg>
  )
}

// ── 6. From the Potsdam Declaration to the bombings (supporting) ─────────────
const HN_TIMELINE = [
  { day: 0, n: 1, label: '26 July 1945 — Potsdam Declaration' },
  { day: 11, n: 2, label: '6 August 1945, 8:15 a.m. — Hiroshima' },
  { day: 14, n: 3, label: '9 August 1945, 11:02 a.m. — Nagasaki' },
]

export function HiroshimaTimeline() {
  const padL = 46
  const padR = 40
  const axisY = 120
  const plotW = W - padL - padR
  const maxDay = 15
  const xpos = (day: number) => padL + (day / maxDay) * plotW
  const ticks = [{ d: 0, l: '26 Jul' }, { d: 5, l: '31 Jul' }, { d: 10, l: '5 Aug' }, { d: 14, l: '9 Aug' }]
  const rowH = 44
  const legendTop = 178
  const H = legendTop + HN_TIMELINE.length * rowH + 8
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" style={svgStyle}
      aria-label="Timeline from the Potsdam Declaration on 26 July 1945 to the atomic bombing of Nagasaki on 9 August 1945.">
      <title>From the Potsdam Declaration to the bombings, July–August 1945</title>
      <rect x="0" y="0" width={W} height={H} fill={C.bg} rx="10" />
      <text x={padL} y="46" fill={C.title} fontSize="28" fontWeight="700" fontFamily="sans-serif">July–August 1945</text>
      <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke={C.axis} strokeWidth="2" />
      {ticks.map((t) => (
        <g key={t.l}>
          <line x1={xpos(t.d)} y1={axisY - 7} x2={xpos(t.d)} y2={axisY + 7} stroke={C.axis} strokeWidth="2" />
          <text x={xpos(t.d)} y={axisY + 34} textAnchor="middle" fill={C.axis} fontSize="26" fontFamily="sans-serif">{t.l}</text>
        </g>
      ))}
      {HN_TIMELINE.map((e) => (
        <g key={e.n}>
          <line x1={xpos(e.day)} y1={axisY - 24} x2={xpos(e.day)} y2={axisY - 7} stroke={C.accent} strokeWidth="2" />
          <circle cx={xpos(e.day)} cy={axisY - 40} r="19" fill={C.accent} />
          <text x={xpos(e.day)} y={axisY - 31} textAnchor="middle" fill="#0a1810" fontSize="26" fontWeight="700" fontFamily="sans-serif">{e.n}</text>
        </g>
      ))}
      {HN_TIMELINE.map((e, i) => {
        const y = legendTop + i * rowH
        return (
          <g key={`l${e.n}`}>
            <circle cx={padL + 17} cy={y} r="18" fill={C.accent} />
            <text x={padL + 17} y={y + 8} textAnchor="middle" fill="#0a1810" fontSize="26" fontWeight="700" fontFamily="sans-serif">{e.n}</text>
            <text x={padL + 46} y={y + 9} fill={C.body} fontSize="26" fontFamily="sans-serif">{e.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

export const CONTENT_DIAGRAMS: Record<string, () => ReactElement> = {
  'explosion-timeline': ExplosionTimeline,
  'energy-split': EnergySplitBar,
  'hbomb-test-timeline': HBombTestTimeline,
  'hbomb-ring-comparison': HBombRingComparison,
  'hiroshima-death-tolls': HiroshimaDeathTolls,
  'hiroshima-timeline': HiroshimaTimeline,
}
