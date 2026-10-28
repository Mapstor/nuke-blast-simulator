// NBS-011: the two purpose-built SVGs for /nuclear-blast-radius (svg-spec.md).
// Both are server-rendered and inline (crawlable), and every number in them is
// computed from the engine (effects.ts / radius.ts), never typed — an SVG is a
// claim, sourced like any other.
//
//   HeroRings       — labeled concentric damage rings for one named yield
//                     (a 1-megaton air burst), drawn to scale, with a legend.
//   YieldScaleChart — the 5 psi blast radius against yield on a log yield axis,
//                     with the database weapons marked, showing how slowly the
//                     radius grows as yield climbs (the page's wedge, visualized).
//
// Palette matches the map/results rings. All text sits in spaced legends/axes,
// never over strokes, so there are no label collisions at any width.

import {
  effectRadiiKm,
  formatRadiusKm,
  formatRadiusMi,
  formatRadiusDual,
} from '@/lib/calculations/effects'
import { radiusKm } from '@/lib/calculations/radius'

const RING_COLORS = {
  fireball: '#fde047',
  overpressure20psi: '#ef4444',
  overpressure5psi: '#f97316',
  overpressure1psi: '#9ca3af',
  thermal3rdDegree: '#d946ef',
  thermal2ndDegree: '#f0abfc',
  thermal1stDegree: '#fbcfe8',
} as const

// ── Hero: concentric rings for a 1-megaton air burst ────────────────────────

export function HeroRings() {
  const yieldKt = 1000
  const r = effectRadiiKm(yieldKt)
  const rings = [
    { name: 'Fireball', color: RING_COLORS.fireball, km: r.fireball },
    { name: 'Severe blast 20 psi', color: RING_COLORS.overpressure20psi, km: r.overpressure20psi },
    { name: 'Moderate blast 5 psi', color: RING_COLORS.overpressure5psi, km: r.overpressure5psi },
    { name: '3rd-degree burns', color: RING_COLORS.thermal3rdDegree, km: r.thermal3rdDegree },
    { name: '2nd-degree burns', color: RING_COLORS.thermal2ndDegree, km: r.thermal2ndDegree },
    { name: 'Light blast 1 psi', color: RING_COLORS.overpressure1psi, km: r.overpressure1psi },
    { name: '1st-degree burns', color: RING_COLORS.thermal1stDegree, km: r.thermal1stDegree },
  ].sort((a, b) => a.km - b.km)

  const max = rings[rings.length - 1].km
  const cx = 240
  const cy = 235
  const maxR = 205
  const scale = maxR / max

  const legendTop = 480
  const rowH = 44

  return (
    <svg
      viewBox="0 0 480 800"
      width="480"
      height="800"
      role="img"
      aria-label="Concentric nuclear blast effect rings for a 1-megaton air burst, drawn to scale, with a legend of each ring's radius in miles and kilometers."
      style={{ width: '100%', height: 'auto', maxWidth: 480 }}
    >
      <title>Blast effect rings for a 1-megaton air burst</title>
      {/* backdrop */}
      <rect x="0" y="0" width="480" height="800" fill="#0a1810" rx="10" />
      {/* rings, outermost first so inner rings paint on top */}
      {rings
        .slice()
        .reverse()
        .map((ring) => (
          <circle
            key={ring.name}
            cx={cx}
            cy={cy}
            r={ring.km * scale}
            fill={ring.name === 'Fireball' ? ring.color : 'none'}
            stroke={ring.color}
            strokeWidth={2.5}
            opacity={0.95}
          />
        ))}
      {/* ground zero */}
      <circle cx={cx} cy={cy} r={3} fill="#fde047" />
      {/* outer ring label (above everything, on background) */}
      <text x={cx} y={cy - maxR - 10} textAnchor="middle" fill="#86efac" fontSize="18" fontFamily="sans-serif">
        Outer ring: 1st-degree burns, {formatRadiusMi(max)} mi
      </text>

      {/* legend */}
      <text x="22" y={legendTop - 18} fill="#4ade80" fontSize="20" fontWeight="700" fontFamily="sans-serif">
        1-megaton air burst
      </text>
      {rings.map((ring, i) => {
        const y = legendTop + i * rowH
        return (
          <g key={ring.name}>
            <rect x="22" y={y - 13} width="26" height="16" rx="2" fill={ring.color} />
            <text x="58" y={y} fill="#d1fae5" fontSize="18" fontFamily="sans-serif">
              {ring.name}
            </text>
            <text x="458" y={y} textAnchor="end" fill="#86efac" fontSize="18" fontFamily="sans-serif">
              {formatRadiusDual(ring.km)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Supporting: 5 psi radius vs yield (log yield axis) ──────────────────────

const WEAPON_MARKS = [
  { name: 'Little Boy', kt: 15 },
  { name: 'Fat Man', kt: 21 },
  { name: 'W87', kt: 300 },
  { name: 'W88', kt: 455 },
  { name: 'B83', kt: 1200 },
  { name: 'Castle Bravo', kt: 15000 },
  { name: 'Tsar Bomba', kt: 50000 },
] as const

export function YieldScaleChart() {
  const padL = 64
  const padR = 40
  const padT = 28
  const padB = 72
  const W = 900
  const H = 460
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const xMaxLog = Math.log10(50000)
  const yMax = 25

  const x = (kt: number) => padL + (Math.log10(kt) / xMaxLog) * plotW
  const y = (km: number) => padT + plotH - (km / yMax) * plotH

  // smooth curve: sample yields 1 → 50000 on a log grid
  const samples: string[] = []
  const steps = 60
  for (let i = 0; i <= steps; i++) {
    const kt = Math.pow(10, (i / steps) * xMaxLog)
    samples.push(`${x(kt).toFixed(1)},${y(radiusKm(kt, 'psi5')).toFixed(1)}`)
  }

  const xTicks = [
    { kt: 1, label: '1 kt' },
    { kt: 10, label: '10 kt' },
    { kt: 100, label: '100 kt' },
    { kt: 1000, label: '1 Mt' },
    { kt: 10000, label: '10 Mt' },
    { kt: 50000, label: '50 Mt' },
  ]
  const yTicks = [0, 5, 10, 15, 20, 25]

  const marks = WEAPON_MARKS.map((w, i) => ({
    ...w,
    n: i + 1,
    km: radiusKm(w.kt, 'psi5'),
    cx: x(w.kt),
    cy: y(radiusKm(w.kt, 'psi5')),
  }))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-label="Line chart of the 5 psi blast radius against weapon yield on a logarithmic yield axis, with seven database weapons marked from Little Boy to Tsar Bomba."
      style={{ width: '100%', height: 'auto' }}
    >
      <title>5 psi blast radius versus yield</title>
      <rect x="0" y="0" width={W} height={H} fill="#0a1810" rx="10" />

      {/* y gridlines + labels */}
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line x1={padL} y1={y(t)} x2={W - padR} y2={y(t)} stroke="#166534" strokeWidth="1" opacity="0.4" />
          <text x={padL - 10} y={y(t) + 5} textAnchor="end" fill="#86efac" fontSize="16" fontFamily="sans-serif">
            {t}
          </text>
        </g>
      ))}
      {/* x axis + labels */}
      <line x1={padL} y1={y(0)} x2={W - padR} y2={y(0)} stroke="#22c55e" strokeWidth="1.5" />
      {xTicks.map((t) => (
        <g key={`x${t.kt}`}>
          <line x1={x(t.kt)} y1={y(0)} x2={x(t.kt)} y2={y(0) + 6} stroke="#22c55e" strokeWidth="1.5" />
          <text x={x(t.kt)} y={y(0) + 26} textAnchor="middle" fill="#86efac" fontSize="16" fontFamily="sans-serif">
            {t.label}
          </text>
        </g>
      ))}
      {/* axis titles */}
      <text x={padL + plotW / 2} y={H - 14} textAnchor="middle" fill="#4ade80" fontSize="17" fontFamily="sans-serif">
        Weapon yield (log scale)
      </text>
      <text
        x={18}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#4ade80"
        fontSize="17"
        fontFamily="sans-serif"
        transform={`rotate(-90 18 ${padT + plotH / 2})`}
      >
        5 psi radius (km)
      </text>

      {/* curve */}
      <polyline points={samples.join(' ')} fill="none" stroke="#f97316" strokeWidth="3" />

      {/* weapon marks: numbered badges keyed to the HTML legend below */}
      {marks.map((m) => (
        <g key={m.name}>
          <circle cx={m.cx} cy={m.cy} r={11} fill="#0a1810" stroke="#fde047" strokeWidth="2" />
          <text x={m.cx} y={m.cy + 5} textAnchor="middle" fill="#fde047" fontSize="14" fontWeight="700" fontFamily="sans-serif">
            {m.n}
          </text>
        </g>
      ))}
    </svg>
  )
}

// The HTML legend for the yield chart — rendered beside/below the SVG so the
// weapon names stay legible on phones (they map to the numbered badges).
export function yieldChartLegend() {
  return WEAPON_MARKS.map((w, i) => ({
    n: i + 1,
    name: w.name,
    kt: w.kt,
    yieldLabel: w.kt >= 1000 ? `${w.kt / 1000} Mt` : `${w.kt} kt`,
    dual: formatRadiusDual(radiusKm(w.kt, 'psi5')),
  }))
}

// A static horizontal-bar chart of all seven rings for one worked yield — the
// crawlable-twin chart (data chart, not one of the two required SVGs). Plain
// HTML so it is legible and never overflows on phones.
export function WorkedExampleBars({ yieldKt }: { yieldKt: number }) {
  const r = effectRadiiKm(yieldKt)
  const rows = [
    { name: 'Fireball', color: RING_COLORS.fireball, km: r.fireball },
    { name: 'Severe blast · 20 psi', color: RING_COLORS.overpressure20psi, km: r.overpressure20psi },
    { name: 'Moderate blast · 5 psi', color: RING_COLORS.overpressure5psi, km: r.overpressure5psi },
    { name: 'Light blast · 1 psi', color: RING_COLORS.overpressure1psi, km: r.overpressure1psi },
    { name: '3rd-degree burns', color: RING_COLORS.thermal3rdDegree, km: r.thermal3rdDegree },
    { name: '2nd-degree burns', color: RING_COLORS.thermal2ndDegree, km: r.thermal2ndDegree },
    { name: '1st-degree burns', color: RING_COLORS.thermal1stDegree, km: r.thermal1stDegree },
  ]
  const max = Math.max(...rows.map((x) => x.km))
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.name} className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="w-32 sm:w-40 shrink-0 text-green-300/80">{row.name}</span>
          <span className="flex-1 min-w-0 bg-black/40 rounded h-4 overflow-hidden">
            <span className="block h-4 rounded" style={{ width: `${Math.max(2, (row.km / max) * 100)}%`, backgroundColor: row.color }} />
          </span>
          <span className="w-28 sm:w-36 shrink-0 text-right text-green-300 tabular-nums">{formatRadiusMi(row.km)} mi ({formatRadiusKm(row.km)} km)</span>
        </div>
      ))}
    </div>
  )
}
