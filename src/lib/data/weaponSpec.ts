// NBS-016 (audit-a): one place to format a weapon's "how much" figure.
//
// The 2026-10-29 citation audit found that conventional pages stated their
// explosive FILL weight as if it were a TNT yield ("Tallboy: 2.4 tons TNT").
// A fill weight is not a TNT equivalent, so these helpers present each
// conventional bomb by its `measure`:
//   - 'fill'          → "2.4 t (Torpex) explosive fill" (no published TNT equivalent)
//   - 'tnt-equivalent'→ "11 t of TNT equivalent" / Halifax "2.9 kt TNT equivalent"
//   - 'claimed-tnt'   → "claimed 44 t TNT (unverified)"
// Nuclear weapons keep their kiloton/megaton yield. Shared by the weapon page,
// the compare page, the /weapons hub and the home page so the figure can't drift.
import type { Bomb } from '@/lib/types'

export const HIROSHIMA_YIELD_KT = 15

// Nuclear yield in prose: "50 megatons", "15 kilotons", "1 kiloton" (singular at 1).
export function formatYield(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} megatons`
  if (yieldKt >= 1) return `${yieldKt.toLocaleString()} ${yieldKt === 1 ? 'kiloton' : 'kilotons'}`
  return `${(yieldKt * 1000).toLocaleString()} tons TNT`
}

// Tonnes of explosive for a conventional bomb (yield is the weight in kt-equivalent).
function tonnes(b: Bomb): number {
  return b.yield * 1000
}
// "2.4 t", "0.43 t", "0.09 t" below 10 t; "11 t", "44 t" at/above.
function fmtTons(t: number): string {
  return t >= 10 ? `${Math.round(t).toLocaleString()} t` : `${Number(t.toFixed(2))} t`
}

// The conventional spec phrase for a header line or card.
export function conventionalSpec(b: Bomb): string {
  if (b.measure === 'claimed-tnt') return `claimed ${fmtTons(tonnes(b))} TNT (unverified)`
  if (b.measure === 'tnt-equivalent') {
    return b.yield >= 1 ? `${b.yield} kt TNT equivalent` : `${fmtTons(tonnes(b))} of TNT equivalent`
  }
  return `${fmtTons(tonnes(b))}${b.filler ? ` (${b.filler})` : ''} explosive fill`
}

// Header / detail spec: a nuclear yield, or the conventional spec.
export function specLine(b: Bomb): string {
  return b.type === 'conventional' ? conventionalSpec(b) : formatYield(b.yield)
}

// The quantity clause for the weapon-page Overview ("With {…}, the {name} is …").
// Conventional fill bombs state the fill, never a TNT yield; TNT-equivalent and
// claimed figures are labelled as such.
export function overviewQuantity(b: Bomb): string {
  if (b.type !== 'conventional') return `a yield of ${formatYield(b.yield)}`
  if (b.measure === 'claimed-tnt') return `a claimed ${fmtTons(tonnes(b))} of TNT equivalent (analysts question the figure)`
  if (b.measure === 'tnt-equivalent') return b.yield >= 1 ? `about ${b.yield} kt of TNT equivalent` : `about ${fmtTons(tonnes(b))} of TNT equivalent`
  return `about ${fmtTons(tonnes(b))}${b.filler ? ` (${b.filler})` : ''} of explosive fill (no published TNT equivalent)`
}

// Compact spec for cards, tables and nav sublabels.
//   nuclear       → "50 Mt", "15 kt"
//   fill          → "2.4 t fill"
//   tnt-equivalent→ "11 t TNT" / Halifax "2.9 kt"
export function shortSpec(b: Bomb): string {
  if (b.type === 'conventional') {
    if (b.measure === 'fill') return `${fmtTons(tonnes(b))} fill`
    if (b.yield >= 1) return b.yield >= 1000 ? `${(b.yield / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt` : `${b.yield} kt`
    return `${fmtTons(tonnes(b))} TNT`
  }
  if (b.yield >= 1000) return `${(b.yield / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  return `${b.yield.toLocaleString()} kt`
}

// Hiroshima multiple, formatted to one decimal below 10× and whole at/above
// (never "1×"). ratio = weapon yield / 15 kt.
export function hiroshimaMultiple(ratio: number): string {
  if (ratio >= 1) {
    const whole = ratio.toLocaleString(undefined, { maximumFractionDigits: ratio < 10 ? 1 : 0 })
    return `${whole}× more powerful`
  }
  const inv = 1 / ratio
  const whole = inv.toLocaleString(undefined, { maximumFractionDigits: inv < 10 ? 1 : 0 })
  return `${whole}× smaller`
}
