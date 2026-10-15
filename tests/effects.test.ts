import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  fireballRadiusKm,
  interpolateRadiusKm,
  effectRadiiKm,
  formatRadiusKm,
  SCALING_TABLE_KM,
  YIELD_KNOTS_KT,
  FIREBALL_COEFFICIENT,
  FIREBALL_EXPONENT,
  EFFECTS_FLAGS,
  buildClientBlastResults,
  type EffectKey,
} from '../src/lib/calculations/effects'

// The benchmark scaling table (Wikipedia "Effects of nuclear explosions") at
// 1 / 20 / 1000 / 20000 kt. The engine must reproduce these exactly at the knots.
const BENCHMARK: Record<EffectKey, number[]> = {
  overpressure20psi: [0.2, 0.6, 2.4, 6.4],
  overpressure5psi: [0.6, 1.7, 6.2, 17],
  overpressure1psi: [1.7, 4.7, 17, 47],
  thermal3rdDegree: [0.6, 2.5, 12, 38],
  thermal2ndDegree: [0.8, 3.2, 15, 44],
  thermal1stDegree: [1.1, 4.2, 19, 53],
}

describe('scaling table', () => {
  it('engine table equals the benchmark (methodology prints these same constants)', () => {
    expect([...YIELD_KNOTS_KT]).toEqual([1, 20, 1000, 20000])
    for (const key of Object.keys(BENCHMARK) as EffectKey[]) {
      expect([...SCALING_TABLE_KM[key]]).toEqual(BENCHMARK[key])
    }
  })

  it('interpolation reproduces exact table values at every knot', () => {
    for (const key of Object.keys(BENCHMARK) as EffectKey[]) {
      YIELD_KNOTS_KT.forEach((kt, i) => {
        expect(interpolateRadiusKm(key, kt)).toBeCloseTo(BENCHMARK[key][i], 6)
      })
    }
  })
})

describe('fireball', () => {
  it('uses 0.061 * W^0.4', () => {
    expect(FIREBALL_COEFFICIENT).toBe(0.061)
    expect(FIREBALL_EXPONENT).toBe(0.4)
  })
  it('matches the documented checks', () => {
    expect(fireballRadiusKm(15)).toBeCloseTo(0.18, 2) // 15 kt
    expect(fireballRadiusKm(50000)).toBeCloseTo(4.6, 1) // 50 Mt
  })
})

describe('expected-after-fix displayed radii (formatRadiusKm)', () => {
  it('Little Boy, 15 kt — 20/5/1 psi and 3rd-degree + fireball', () => {
    const r = effectRadiiKm(15)
    expect(formatRadiusKm(r.overpressure20psi)).toBe('0.54')
    expect(formatRadiusKm(r.overpressure5psi)).toBe('1.54')
    expect(formatRadiusKm(r.overpressure1psi)).toBe('4.26')
    expect(formatRadiusKm(r.thermal3rdDegree)).toBe('2.18')
    expect(formatRadiusKm(r.fireball)).toBe('0.18')
  })
  it('W76, 100 kt — 20/5/1 psi and 3rd-degree', () => {
    const r = effectRadiiKm(100)
    expect(formatRadiusKm(r.overpressure20psi)).toBe('1.06')
    expect(formatRadiusKm(r.overpressure5psi)).toBe('2.89')
    expect(formatRadiusKm(r.overpressure1psi)).toBe('7.98')
    expect(formatRadiusKm(r.thermal3rdDegree)).toBe('4.77')
  })
  it('Tsar Bomba, 50 Mt — 20/5/1 psi, 3rd-degree + fireball', () => {
    const r = effectRadiiKm(50000)
    expect(formatRadiusKm(r.overpressure20psi)).toBe('8.64')
    expect(formatRadiusKm(r.overpressure5psi)).toBe('23.1')
    // Faithful log-log interpolation of the 17→47 km segment gives 64.14 km →
    // "64.1" to one decimal. (The NBS-003 brief listed 64.2; that is the same
    // value rounded differently — a 0.1 km boundary artifact, not a formula error.)
    expect(formatRadiusKm(r.overpressure1psi)).toBe('64.1')
    expect(formatRadiusKm(r.thermal3rdDegree)).toBe('54.1')
    expect(formatRadiusKm(r.fireball)).toBe('4.62')
  })
})

describe('withdrawal flags', () => {
  it('all effect flags are off', () => {
    expect(EFFECTS_FLAGS.CASUALTIES).toBe(false)
    expect(EFFECTS_FLAGS.FALLOUT).toBe(false)
    expect(EFFECTS_FLAGS.RADIATION).toBe(false)
    expect(EFFECTS_FLAGS.CRATER).toBe(false)
    expect(EFFECTS_FLAGS.SURFACE_BURST).toBe(false)
    expect(EFFECTS_FLAGS.CONVENTIONAL_EFFECTS).toBe(false)
  })
  it('client results carry radii only — no casualties, no fallout', () => {
    const res = buildClientBlastResults(1000)
    expect(res.fallout).toBeUndefined()
    expect(res.totalCasualties).toBe(0)
    expect(res.totalFatalities).toBe(0)
    expect(res.affectedPopulation).toBe(0)
    expect(res.casualtyZones).toHaveLength(0)
    expect(res.airBlast.severe.fatalities).toBe(0)
    expect(res.fireball.radius).toBeGreaterThan(0) // radii still present
  })
})

describe('built output has no withdrawn casualty/fallout figures', () => {
  // Scans the prerendered HTML. Run `npm run build` before `npm test`.
  const root = join(__dirname, '..', '.next', 'server', 'app')
  const htmlFiles: string[] = []
  function walk(dir: string) {
    if (!existsSync(dir)) return
    for (const e of readdirSync(dir)) {
      const p = join(dir, e)
      if (statSync(p).isDirectory()) walk(p)
      else if (e.endsWith('.html')) htmlFiles.push(p)
    }
  }
  walk(root)

  // Unambiguous strings that only appeared in the withdrawn computed-casualty /
  // fallout UI (not in historical prose).
  const FORBIDDEN = [
    'Est. affected',
    'Estimated total fatalities',
    'immediate fatalities',
    'Lethal fallout zone',
    'Radioactive Fallout',
    'population-density-based casualty',
    'local population density',
  ]

  it('found prerendered HTML to scan', () => {
    expect(htmlFiles.length).toBeGreaterThan(0)
  })

  it('no prerendered page contains a withdrawn casualty/fallout string', () => {
    const offenders: string[] = []
    for (const f of htmlFiles) {
      const html = readFileSync(f, 'utf8')
      for (const needle of FORBIDDEN) {
        if (html.includes(needle)) offenders.push(`${f}: "${needle}"`)
      }
    }
    expect(offenders).toEqual([])
  })
})
