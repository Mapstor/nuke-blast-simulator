// src/lib/calculations/radius.ts
//
// NBS-005: the single accessor for a radius quoted in PROSE. Every sentence that
// states a radius computes it through radiusKm() over the engine (effects.ts),
// so prose can never drift from the map. Prose uses 2 significant figures
// (formatRadiusProse); tables use formatRadiusKm from effects.ts.
import {
  fireballRadiusKm,
  interpolateRadiusKm,
  type EffectKey,
} from './effects'

export type ProseEffect = 'fireball' | 'psi20' | 'psi5' | 'psi1' | 'burn3' | 'burn2' | 'burn1'

const KEY: Record<Exclude<ProseEffect, 'fireball'>, EffectKey> = {
  psi20: 'overpressure20psi',
  psi5: 'overpressure5psi',
  psi1: 'overpressure1psi',
  burn3: 'thermal3rdDegree',
  burn2: 'thermal2ndDegree',
  burn1: 'thermal1stDegree',
}

export function radiusKm(yieldKt: number, effect: ProseEffect): number {
  if (effect === 'fireball') return fireballRadiusKm(yieldKt)
  return interpolateRadiusKm(KEY[effect], yieldKt)
}

// 2 significant figures, e.g. 2.89 → "2.9", 4.78 → "4.8", 0.967 → "0.97", 12 → "12".
export function formatRadiusProse(km: number): string {
  if (km <= 0) return '0'
  const p = km.toPrecision(2)
  // toPrecision can give "12.0" style; strip a trailing ".0" and scientific form.
  return String(Number(p))
}

// Convenience: "2.9 km" straight from yield + effect.
export function radiusText(yieldKt: number, effect: ProseEffect): string {
  return `${formatRadiusProse(radiusKm(yieldKt, effect))} km`
}
