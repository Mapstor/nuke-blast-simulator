// Hand-curated bomb-vs-bomb comparison pages. Each entry is the canonical
// order (left, right). Pages render at /compare/[left]-vs-[right]; reverse
// orders will 404 — search engines route users via title.

export type Comparison = readonly [string, string]

export const COMPARISONS: Comparison[] = [
  // ── Iconic head-to-heads ───────────────────────────────────────────────
  ['tsar-bomba', 'castle-bravo'],         // Largest USSR vs largest US test
  ['tsar-bomba', 'little-boy'],           // Largest ever vs Hiroshima
  ['tsar-bomba', 'ivy-mike'],             // Largest vs first H-bomb
  ['little-boy', 'fat-man'],              // Hiroshima vs Nagasaki
  ['castle-bravo', 'ivy-mike'],           // First operational H-bomb vs first H-bomb test
  ['castle-bravo', 'little-boy'],         // Largest US test vs Hiroshima

  // ── Modern US strategic arsenal ────────────────────────────────────────
  ['b83', 'w88'],                          // Largest current US vs SLBM warhead
  ['w88', 'w76'],                          // Most-modern SLBM vs most-deployed
  ['b83', 'b53'],                          // Current vs retired US strategic bomb
  ['w87', 'w88'],                          // ICBM vs SLBM
  ['b83', 'tsar-bomba'],                   // Current US vs USSR largest

  // ── Tactical weapons ───────────────────────────────────────────────────
  ['b61', 'w54'],                          // Modern tactical vs early tactical
  ['b61', 'davy-crockett'],                // Variable-yield gravity vs tiniest tactical
  ['w80', 'b61'],                          // Cruise missile warhead vs gravity bomb

  // ── First-test by country ──────────────────────────────────────────────
  ['trinity', 'joe-1'],                    // First US vs first USSR
  ['trinity', 'hurricane'],                // First US vs first UK
  ['trinity', 'gerboise-bleue'],           // First US vs first French
  ['trinity', '596'],                      // First US vs first Chinese
  ['trinity', 'smiling-buddha'],           // First US vs first Indian
  ['trinity', 'chagai-i'],                 // First US vs first Pakistani
  ['trinity', 'hwasong-14'],               // First US vs first North Korean missile

  // ── Yield-class comparisons ────────────────────────────────────────────
  ['fat-man', 'trinity'],                  // ~21 kt vs ~21 kt (same-class)
  ['little-boy', 'w76'],                   // Hiroshima vs modern strategic
  ['fat-man', 'w76'],                      // Nagasaki vs modern strategic

  // ── Hydrogen bomb generations ──────────────────────────────────────────
  ['ivy-mike', 'castle-bravo'],            // First H-bomb vs first deployable H-bomb

  // ── Conventional vs nuclear ────────────────────────────────────────────
  ['little-boy', 'moab'],                  // Smallest WW2 nuke vs largest conventional
  ['little-boy', 'foab'],                  // Smallest nuke vs Father of All Bombs
  ['fat-man', 'moab'],                     // Nagasaki vs MOAB

  // ── Mega-yield Soviet ─────────────────────────────────────────────────
  ['tsar-bomba', 'soviet-test-219'],
  ['castle-bravo', 'castle-yankee'],
]

export function encodeComparisonSlug(a: string, b: string): string {
  return `${a}-vs-${b}`
}

export function decodeComparisonSlug(slug: string): { a: string; b: string } | null {
  const idx = slug.indexOf('-vs-')
  if (idx <= 0 || idx + 4 >= slug.length) return null
  return { a: slug.slice(0, idx), b: slug.slice(idx + 4) }
}

export function allComparisonSlugs(): string[] {
  return COMPARISONS.map(([a, b]) => encodeComparisonSlug(a, b))
}
