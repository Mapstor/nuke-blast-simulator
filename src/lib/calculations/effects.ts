// src/lib/calculations/effects.ts
//
// THE single effects engine. Every consumer (home tool, weapon/city/scenario/
// compare pages, FAQ text, meta descriptions, JSON-LD, OG images) imports its
// radii from here. No radius coefficient or scaling table lives anywhere else.
//
// Physics (NBS-003 INTEGRITY, 2026-10-15):
//  - Fireball: maximum fireball radius of an AIR BURST. Glasstone & Dolan 1977
//    §2.127 gives breakaway at ~100·W^0.4 ft; the maximum air-burst fireball is
//    ~2× breakaway → R(km) = 0.061·W^0.4  (W in kilotons).
//    Checks: 15 kt → 0.18 km; 50 Mt → 4.6 km.
//  - Blast (20/5/1 psi) and thermal (1st/2nd/3rd-degree burns): log–log
//    interpolation through the scaling-law table for optimum-height air bursts
//    from Wikipedia, "Effects of nuclear explosions". Beyond the table ends
//    (1 kt … 20 Mt) the nearest segment's log–log slope is extended.
//
// All radii are kilometres, as a function of yield in kilotons, and assume an
// AIR BURST AT OPTIMUM HEIGHT. Surface-burst, fallout, radiation, crater and
// casualty outputs are withdrawn behind EFFECTS_FLAGS (see ./config).
//
// Sources:
//   https://atomicarchive.com/resources/documents/effects/glasstone-dolan/chapter2.html
//   https://en.wikipedia.org/wiki/Effects_of_nuclear_explosions

import type { BlastResults } from '@/lib/types'
import { EFFECTS_FLAGS } from './config'

export { EFFECTS_FLAGS }

export const AIR_BURST_ASSUMPTION = 'air burst at optimum height'

// Glasstone & Dolan §2.127 air-burst maximum fireball: R(km) = 0.061·W^0.4.
export const FIREBALL_COEFFICIENT = 0.061
export const FIREBALL_EXPONENT = 0.4

export function fireballRadiusKm(yieldKt: number): number {
  return FIREBALL_COEFFICIENT * Math.pow(yieldKt, FIREBALL_EXPONENT)
}

// Scaling-law table — optimum-height air bursts (Wikipedia, "Effects of
// nuclear explosions"). Radii in km at 1 kt / 20 kt / 1 Mt / 20 Mt.
export const YIELD_KNOTS_KT = [1, 20, 1000, 20000] as const

export const SCALING_TABLE_KM = {
  overpressure20psi: [0.2, 0.6, 2.4, 6.4],
  overpressure5psi: [0.6, 1.7, 6.2, 17],
  overpressure1psi: [1.7, 4.7, 17, 47],
  thermal3rdDegree: [0.6, 2.5, 12, 38],
  thermal2ndDegree: [0.8, 3.2, 15, 44],
  thermal1stDegree: [1.1, 4.2, 19, 53],
} as const

export type EffectKey = keyof typeof SCALING_TABLE_KM

// Human-readable labels + the overpressure/burn each row represents.
export const EFFECT_LABELS: Record<EffectKey, string> = {
  overpressure20psi: 'Severe blast (20 psi)',
  overpressure5psi: 'Moderate blast (5 psi)',
  overpressure1psi: 'Light blast (1 psi)',
  thermal3rdDegree: '3rd-degree thermal burns',
  thermal2ndDegree: '2nd-degree thermal burns',
  thermal1stDegree: '1st-degree thermal burns',
}

// Log–log interpolation through the table, extending the end segment's slope
// beyond the tabulated range.
export function interpolateRadiusKm(key: EffectKey, yieldKt: number): number {
  const ys = SCALING_TABLE_KM[key]
  const lx = YIELD_KNOTS_KT.map((x) => Math.log(x))
  const ly = ys.map((y) => Math.log(y))
  const lw = Math.log(yieldKt)

  let i = 0
  if (lw <= lx[0]) i = 0
  else if (lw >= lx[lx.length - 1]) i = lx.length - 2
  else {
    while (i < lx.length - 2 && lw > lx[i + 1]) i++
  }
  const t = (lw - lx[i]) / (lx[i + 1] - lx[i])
  return Math.exp(ly[i] + t * (ly[i + 1] - ly[i]))
}

// Display helper — the single place radii are formatted for pages. Two decimals
// under 10 km, one decimal at or above, so e.g. 0.54 km, 8.64 km, 23.1 km.
export function formatRadiusKm(km: number): string {
  return km >= 10 ? km.toFixed(1) : km.toFixed(2)
}

export interface EffectRadiiKm {
  fireball: number
  overpressure20psi: number
  overpressure5psi: number
  overpressure1psi: number
  thermal3rdDegree: number
  thermal2ndDegree: number
  thermal1stDegree: number
}

// Every displayed radius for a weapon of the given yield (air burst, optimum
// height). This is the one function content pages should call.
export function effectRadiiKm(yieldKt: number): EffectRadiiKm {
  return {
    fireball: fireballRadiusKm(yieldKt),
    overpressure20psi: interpolateRadiusKm('overpressure20psi', yieldKt),
    overpressure5psi: interpolateRadiusKm('overpressure5psi', yieldKt),
    overpressure1psi: interpolateRadiusKm('overpressure1psi', yieldKt),
    thermal3rdDegree: interpolateRadiusKm('thermal3rdDegree', yieldKt),
    thermal2ndDegree: interpolateRadiusKm('thermal2ndDegree', yieldKt),
    thermal1stDegree: interpolateRadiusKm('thermal1stDegree', yieldKt),
  }
}

// ── Legacy-shaped helpers (kept so existing call sites read naturally) ──────
// All air-burst; the optional burst argument is accepted but IGNORED — surface
// burst is withdrawn (EFFECTS_FLAGS.SURFACE_BURST). This keeps a single source
// of truth for the numbers while not silently emitting unverified surface radii.

// The optional `_burst` argument is accepted for backward compatibility with
// retained (disabled) call sites, but IGNORED: the engine only ships verified
// optimum-height air-burst scaling. Surface burst is withdrawn.
type Burst = 'air' | 'surface'

export function calculateFireball(yieldKt: number, _burst?: Burst): number {
  return fireballRadiusKm(yieldKt)
}

export function calculateAirBlast(
  yieldKt: number,
  _burst?: Burst,
): { severe: number; moderate: number; light: number } {
  return {
    severe: interpolateRadiusKm('overpressure20psi', yieldKt),
    moderate: interpolateRadiusKm('overpressure5psi', yieldKt),
    light: interpolateRadiusKm('overpressure1psi', yieldKt),
  }
}

export function calculateThermalRadiation(
  yieldKt: number,
  _burst?: Burst,
): { thirdDegree: number; secondDegree: number; firstDegree: number } {
  return {
    thirdDegree: interpolateRadiusKm('thermal3rdDegree', yieldKt),
    secondDegree: interpolateRadiusKm('thermal2ndDegree', yieldKt),
    firstDegree: interpolateRadiusKm('thermal1stDegree', yieldKt),
  }
}

// Fallout is withdrawn (EFFECTS_FLAGS.FALLOUT). Retained as a 0-returning stub
// so the disabled legacy casualty code keeps compiling; never rendered.
export function calculateFallout(_yieldKt: number, _burst?: Burst): number {
  return 0
}

// Results object for the interactive map tool (ResultsPanel). Radii only —
// casualties are zeroed and fallout is omitted while the flags are off.
export function buildClientBlastResults(yieldKt: number): BlastResults {
  const fireball = fireballRadiusKm(yieldKt)
  const blast = calculateAirBlast(yieldKt)
  const thermal = calculateThermalRadiation(yieldKt)

  const zeroedZone = (radius: number) => ({
    radius,
    casualties: 0,
    fatalities: 0,
    survivorsWithInjuries: 0,
    totalPopulation: 0,
    averageDensity: 0,
  })

  return {
    fireball: {
      radius: fireball,
      casualties: 0,
      fatalities: 0,
      survivorsWithInjuries: 0,
      totalPopulation: 0,
      averageDensity: 0,
      description: 'Complete vaporization zone',
    },
    airBlast: {
      severe: zeroedZone(blast.severe),
      moderate: zeroedZone(blast.moderate),
      light: zeroedZone(blast.light),
    },
    thermalRadiation: {
      thirdDegree: zeroedZone(thermal.thirdDegree),
      secondDegree: zeroedZone(thermal.secondDegree),
    },
    // FALLOUT withdrawn — omitted so the map/tool renders no fallout ring.
    fallout: undefined,
    totalCasualties: 0,
    totalFatalities: 0,
    totalSurvivorsWithInjuries: 0,
    affectedPopulation: 0,
    casualtyZones: [],
  }
}
