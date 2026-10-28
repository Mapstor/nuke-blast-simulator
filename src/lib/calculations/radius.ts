// src/lib/calculations/radius.ts
//
// NBS-005: the single accessor for a radius quoted in PROSE. Every sentence that
// states a radius computes it through radiusKm() over the engine (effects.ts),
// so prose can never drift from the map. Prose uses 2 significant figures
// (formatRadiusProse); tables use formatRadiusKm from effects.ts.
import {
  fireballRadiusKm,
  interpolateRadiusKm,
  KM_TO_MI,
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

// Miles for PROSE, 2 significant figures, derived from the km value (never
// typed) so imperial can't drift from metric. Mirrors formatRadiusProse.
export function milesProse(km: number): string {
  return formatRadiusProse(km * KM_TO_MI)
}

// Dual-unit PROSE from a km value already computed through the engine:
// "0.96 mi (1.5 km)", imperial primary, metric in parentheses.
export function dualProse(km: number): string {
  return `${milesProse(km)} mi (${formatRadiusProse(km)} km)`
}

// Dual-unit PROSE straight from yield + effect, e.g. radiusDual(15, 'psi5').
export function radiusDual(yieldKt: number, effect: ProseEffect): string {
  return dualProse(radiusKm(yieldKt, effect))
}

// Paren-free dual form, "11 mi or 17 km" — use this inside parentheses so the
// units don't nest into "(11 mi (17 km))".
export function orProse(km: number): string {
  return `${milesProse(km)} mi or ${formatRadiusProse(km)} km`
}
export function radiusOr(yieldKt: number, effect: ProseEffect): string {
  return orProse(radiusKm(yieldKt, effect))
}
