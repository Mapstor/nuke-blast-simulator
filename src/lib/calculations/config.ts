// src/lib/calculations/config.ts
//
// NBS-003 INTEGRITY — output withdrawal flags.
// Owner decision 2026-10-15: every effect that is not yet verified against a
// primary source stays OFF until chat verifies it. When a flag is false, the
// corresponding figure is hidden from the tool, every page, FAQ answers, meta
// descriptions, JSON-LD and OG images. The calculation code is retained but
// not rendered. Flip a flag to true only after its model has been verified and
// logged in DEVLOG.
export const EFFECTS_FLAGS = {
  // Population-based casualty / fatality / injured / "affected people" counts.
  // Withdrawn: the model summed overlapping concentric zones (double-count) and
  // used a single flat city density. Off until a verified population model.
  CASUALTIES: false,
  // Radioactive fallout plume / lethal fallout radius. Off until a verified
  // fallout model.
  FALLOUT: false,
  // Prompt / initial nuclear radiation dose rings. Never implemented; off.
  RADIATION: false,
  // Crater radius / depth. Never implemented; off.
  CRATER: false,
  // Surface-burst radii. The engine ships optimum-height air-burst scaling only;
  // surface scaling is unverified. Off — air burst at optimum height is assumed.
  SURFACE_BURST: false,
  // Blast/thermal radii for non-nuclear (conventional) weapons. Nuclear scaling
  // laws do not apply to chemical explosives. Off — conventional weapons keep
  // their spec content but show no effect radii.
  CONVENTIONAL_EFFECTS: false,
} as const

export type EffectsFlags = typeof EFFECTS_FLAGS
