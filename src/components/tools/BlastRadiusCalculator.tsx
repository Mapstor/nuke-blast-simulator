'use client'

// NBS-011: the yield calculator for /nuclear-blast-radius. Button-gated results
// (content-page tool-pages.md): the reader enters a yield (or picks a weapon),
// hits Calculate, and only then do the effect rings render. Every radius comes
// from effectRadiiKm() — the same engine as the map — and is shown in miles
// (km). Air burst at optimum height only; no casualty or fallout output
// (EFFECTS_FLAGS / owner decision). An optional ?kt= query parameter prefills
// the yield so weapon and country pages can deep-link in; the canonical stays
// /nuclear-blast-radius.

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { bombs } from '@/lib/data/bombs'
import {
  effectRadiiKm,
  formatRadiusKm,
  formatRadiusMi,
  formatRadiusDual,
  type EffectRadiiKm,
} from '@/lib/calculations/effects'

type Unit = 'kt' | 'Mt'

// The picker lists only nuclear weapons — nuclear scaling laws do not apply to
// chemical explosives (BombSelector follows the same rule).
const PICKER = bombs
  .filter((b) => b.type !== 'conventional' && b.id !== 'custom')
  .slice()
  .sort((a, b) => a.yield - b.yield)

const MIN_KT = 1
const MAX_KT = 100000

type Ring = {
  key: keyof EffectRadiiKm
  name: string
  color: string
  blurb: (r: EffectRadiiKm) => string
}

// Each ring explained in plain English and compared with the others — the
// number-context pattern (content-page): meaning + relation, never a bare value.
const RINGS: Ring[] = [
  {
    key: 'fireball',
    name: 'Fireball',
    color: '#fde047',
    blurb: () =>
      'The ball of plasma at the center, hot enough to vaporize almost anything inside it. It is the smallest ring and sets the scale for everything else.',
  },
  {
    key: 'overpressure20psi',
    name: 'Severe blast · 20 psi',
    color: '#ef4444',
    blurb: (r) =>
      `Even reinforced-concrete buildings fail here. The zone is roughly ${ratio(r.overpressure20psi, r.fireball)}× the fireball.`,
  },
  {
    key: 'overpressure5psi',
    name: 'Moderate blast · 5 psi',
    color: '#f97316',
    blurb: (r) =>
      `Most houses collapse at 5 psi, the headline "blast radius" number. It reaches about ${ratio(r.overpressure5psi, r.overpressure20psi)}× as far as the 20 psi ring.`,
  },
  {
    key: 'overpressure1psi',
    name: 'Light blast · 1 psi',
    color: '#9ca3af',
    blurb: (r) =>
      `Windows shatter and flying glass injures people out to here, about ${ratio(r.overpressure1psi, r.overpressure5psi)}× the 5 psi radius, so it covers a far larger area.`,
  },
  {
    key: 'thermal3rdDegree',
    name: '3rd-degree burns',
    color: '#d946ef',
    blurb: () =>
      'The heat flash causes third-degree burns to exposed skin this far out; line of sight to the fireball matters more than the blast.',
  },
  {
    key: 'thermal2ndDegree',
    name: '2nd-degree burns',
    color: '#f0abfc',
    blurb: () => 'Second-degree (blistering) burns reach a little farther than third-degree.',
  },
  {
    key: 'thermal1stDegree',
    name: '1st-degree burns',
    color: '#fbcfe8',
    blurb: (r) =>
      `First-degree (sunburn-like) burns are the outermost thermal ring, about ${ratio(r.thermal1stDegree, r.overpressure5psi)}× the 5 psi radius. At the largest yields this heat ring reaches even farther than the 1 psi blast.`,
  },
]

function ratio(a: number, b: number): string {
  const x = a / b
  return x >= 10 ? x.toFixed(0) : x.toFixed(1)
}

function parseKtFromParam(): number | null {
  if (typeof window === 'undefined') return null
  const raw = new URLSearchParams(window.location.search).get('kt')
  if (!raw) return null
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.min(MAX_KT, Math.max(MIN_KT, n))
}

export function BlastRadiusCalculator() {
  const [amount, setAmount] = useState('1')
  const [unit, setUnit] = useState<Unit>('Mt')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ yieldKt: number; r: EffectRadiiKm } | null>(null)

  // Prefill from ?kt= on mount (deep link from weapon / country pages). Prefill
  // only — the reader still clicks Calculate (button-gated results).
  useEffect(() => {
    const kt = parseKtFromParam()
    if (kt == null) return
    if (kt >= 1000 && kt % 1000 === 0) {
      setUnit('Mt')
      setAmount(String(kt / 1000))
    } else {
      setUnit('kt')
      setAmount(String(kt))
    }
  }, [])

  const previewKt = useMemo(() => {
    const n = Number(amount)
    if (!Number.isFinite(n)) return null
    return unit === 'Mt' ? n * 1000 : n
  }, [amount, unit])

  function onCalculate() {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a yield greater than zero.')
      setResult(null)
      return
    }
    const kt = unit === 'Mt' ? n * 1000 : n
    if (kt < MIN_KT) {
      setError(`The smallest yield this chart covers is ${MIN_KT} kt.`)
      setResult(null)
      return
    }
    if (kt > MAX_KT) {
      setError(`Yields above ${(MAX_KT / 1000).toLocaleString()} Mt are off the scaling chart.`)
      setResult(null)
      return
    }
    setError(null)
    setResult({ yieldKt: kt, r: effectRadiiKm(kt) })
  }

  function onPickWeapon(id: string) {
    const b = bombs.find((x) => x.id === id)
    if (!b) return
    if (b.yield >= 1000 && b.yield % 1000 === 0) {
      setUnit('Mt')
      setAmount(String(b.yield / 1000))
    } else {
      setUnit('kt')
      setAmount(String(b.yield))
    }
    setError(null)
  }

  // A weapon in the database whose yield exactly matches the result, for the
  // "see the full weapon page" next step.
  const matchedWeapon = result ? bombs.find((b) => b.id !== 'custom' && b.yield === result.yieldKt) : undefined
  // Scale bars to whichever ring is actually widest for THIS yield — not always
  // 1st-degree burns: below ~140 kt the 1 psi blast ring is wider than the heat
  // rings, so hard-coding thermal1stDegree would overflow the 1 psi bar.
  const maxRadius = result ? Math.max(...RINGS.map((ring) => result.r[ring.key])) : 1

  return (
    <div className="bg-black/50 border border-green-500/40 rounded-lg p-5 md:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor="nbr-yield" className="block text-sm font-semibold text-green-400 mb-1">
            Weapon yield
          </label>
          <div className="flex gap-2">
            <input
              id="nbr-yield"
              type="number"
              inputMode="decimal"
              min={unit === 'Mt' ? 0.001 : 1}
              max={unit === 'Mt' ? 100 : 100000}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full min-w-0 p-2 bg-black border border-green-500/50 text-green-300 rounded focus:border-green-400 focus:outline-none"
              aria-describedby="nbr-yield-help"
            />
            <label htmlFor="nbr-unit" className="sr-only">Yield unit</label>
            <select
              id="nbr-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="p-2 bg-black border border-green-500/50 text-green-300 rounded focus:border-green-400 focus:outline-none"
            >
              <option value="kt">kt</option>
              <option value="Mt">Mt</option>
            </select>
          </div>
          <p id="nbr-yield-help" className="text-xs text-green-300/60 mt-1">
            1 kt to 100,000 kt (100 Mt).{previewKt ? ` That is ${previewKt.toLocaleString()} kilotons of TNT.` : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={onCalculate}
          className="bg-green-500 text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-green-600 transition whitespace-nowrap"
        >
          Calculate radius
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="nbr-weapon" className="block text-sm font-semibold text-green-400 mb-1">
          Or pick a weapon to set the yield
        </label>
        <select
          id="nbr-weapon"
          defaultValue=""
          onChange={(e) => onPickWeapon(e.target.value)}
          className="w-full p-2 bg-black border border-green-500/50 text-green-300 rounded focus:border-green-400 focus:outline-none"
        >
          <option value="">Choose a nuclear weapon…</option>
          {PICKER.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.yield >= 1000 ? `${b.yield / 1000} Mt` : `${b.yield} kt`})
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      {!result && !error ? (
        <p className="mt-5 text-sm text-green-300/60">
          Enter a yield and press <strong className="text-green-300">Calculate radius</strong> to see all seven
          effect rings in miles and kilometers. (Prefilled with {amount} {unit}.)
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 border-t border-green-500/30 pt-5">
          <p className="text-sm text-green-300/70">
            Air burst at optimum height ·{' '}
            <span className="text-green-300">
              {result.yieldKt >= 1000 ? `${(result.yieldKt / 1000).toLocaleString()} Mt` : `${result.yieldKt.toLocaleString()} kt`}
            </span>
            {matchedWeapon ? ` · matches ${matchedWeapon.name}` : ''}
          </p>

          <div className="mt-2 mb-5">
            <div className="text-xs uppercase tracking-wider text-green-300/60">5 psi blast radius (most homes destroyed)</div>
            <div className="text-4xl font-bold text-yellow-400 leading-tight">
              {formatRadiusMi(result.r.overpressure5psi)} mi
            </div>
            <div className="text-lg text-green-300">({formatRadiusKm(result.r.overpressure5psi)} km) from ground zero</div>
          </div>

          {/* Chart: each ring's radius as a bar, scaled to the widest ring. */}
          <div className="space-y-2" aria-hidden="true">
            {RINGS.map((ring) => {
              const km = result.r[ring.key]
              const pct = Math.max(2, (km / maxRadius) * 100)
              return (
                <div key={ring.key} className="flex items-center gap-2 text-xs">
                  <span className="w-28 shrink-0 text-green-300/80">{ring.name}</span>
                  <span className="flex-1 min-w-0 bg-black/40 rounded h-4 overflow-hidden">
                    <span className="block h-4 rounded" style={{ width: `${pct}%`, backgroundColor: ring.color }} />
                  </span>
                  <span className="w-24 shrink-0 text-right text-green-300 tabular-nums">{formatRadiusMi(km)} mi</span>
                </div>
              )
            })}
            <p className="text-xs text-green-300/50 pt-1">Bars scaled to the widest ring at this yield.</p>
          </div>

          <dl className="mt-5 space-y-3">
            {RINGS.map((ring) => (
              <div key={ring.key} className="border-l-2 pl-3" style={{ borderColor: ring.color }}>
                <dt className="text-sm font-semibold" style={{ color: ring.color }}>
                  {ring.name}: {formatRadiusDual(result.r[ring.key])}
                </dt>
                <dd className="text-sm text-green-300/80">{ring.blurb(result.r)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 text-xs text-green-300/60 space-y-1">
            <p>
              <strong className="text-green-300/80">Assumptions:</strong> an air burst detonated at the optimum
              height for that yield — the only mode the engine models. Radii are scaling-law estimates; thermal-burn
              ranges assume clear weather and line of sight.
            </p>
            <p>No casualty or fallout figures are shown pending a verified model.</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {matchedWeapon ? (
              <Link href={`/weapons/${matchedWeapon.id}`} className="text-yellow-400 hover:underline">
                Full {matchedWeapon.name} profile →
              </Link>
            ) : null}
            <Link href="/" className="text-yellow-400 hover:underline">
              Map this yield on a city →
            </Link>
            <Link href="/methodology" className="text-yellow-400 hover:underline">
              How these numbers are computed →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
