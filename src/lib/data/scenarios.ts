// Featured bomb × city combinations rendered as static /scenarios pages.
// 10 bombs × 20 cities = 200 scenario pages.

export const FEATURED_BOMB_IDS = [
  'tsar-bomba',
  'little-boy',
  'fat-man',
  'castle-bravo',
  'ivy-mike',
  'trinity',
  'b83',
  'w88',
  'w76',
  'b61',
] as const

export const FEATURED_CITY_SLUGS = [
  'new-york',
  'london',
  'tokyo',
  'moscow',
  'beijing',
  'los-angeles',
  'paris',
  'washington-dc',
  'shanghai',
  'mumbai',
  'delhi',
  'seoul',
  'mexico-city',
  'san-francisco',
  'chicago',
  'berlin',
  'cairo',
  'istanbul',
  'sydney',
  'sao-paulo',
] as const

export type FeaturedBombId = (typeof FEATURED_BOMB_IDS)[number]
export type FeaturedCitySlug = (typeof FEATURED_CITY_SLUGS)[number]

// Helpers to encode/decode the URL-safe scenario slug.
// Every bomb id and city slug is URL-safe (kebab-case, no "-on-" substring),
// so splitting on the first occurrence of "-on-" is unambiguous.
export function encodeScenarioSlug(bombId: string, citySlug: string): string {
  return `${bombId}-on-${citySlug}`
}

export function decodeScenarioSlug(slug: string): { bombId: string; citySlug: string } | null {
  const idx = slug.indexOf('-on-')
  if (idx <= 0 || idx + 4 >= slug.length) return null
  return {
    bombId: slug.slice(0, idx),
    citySlug: slug.slice(idx + 4),
  }
}

export function allScenarioSlugs(): string[] {
  const slugs: string[] = []
  for (const bombId of FEATURED_BOMB_IDS) {
    for (const citySlug of FEATURED_CITY_SLUGS) {
      slugs.push(encodeScenarioSlug(bombId, citySlug))
    }
  }
  return slugs
}
