// Hand-curated bomb-vs-bomb comparison pages. Each entry is the canonical
// order (left, right). Pages render at /compare/[left]-vs-[right]; reverse
// orders will 404 — search engines route users via title.

export type Comparison = readonly [string, string]

// NBS-008: folded to the 5 pairs with measured demand (research/page-map.csv +
// redirect-plan.csv). The other 25 pairs 308 to /compare, where the compare
// tool still renders any two weapons side by side. Edit the page map, not here.
export const COMPARISONS: Comparison[] = [
  ['tsar-bomba', 'castle-bravo'],         // Largest USSR vs largest US test
  ['tsar-bomba', 'little-boy'],           // Largest ever vs Hiroshima
  ['little-boy', 'fat-man'],              // Hiroshima vs Nagasaki
  ['b83', 'tsar-bomba'],                   // Current US vs USSR largest
  ['little-boy', 'moab'],                  // Smallest WW2 nuke vs largest conventional
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
