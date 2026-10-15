// lib/calculations/blast.ts
//
// Compatibility shim. The real engine lives in ./effects (NBS-003 INTEGRITY).
// All radius numbers come from there; nothing is defined here.
export {
  calculateFireball,
  calculateAirBlast,
  calculateThermalRadiation,
  calculateFallout,
  effectRadiiKm,
  formatRadiusKm,
  fireballRadiusKm,
  interpolateRadiusKm,
  buildClientBlastResults,
  AIR_BURST_ASSUMPTION,
  EFFECTS_FLAGS,
  SCALING_TABLE_KM,
  YIELD_KNOTS_KT,
  EFFECT_LABELS,
} from './effects'
export type { EffectKey, EffectRadiiKm } from './effects'
