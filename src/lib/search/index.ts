// Static client-side search index over every indexable page on the site.
// Built at compile time from the same data files that drive the routes,
// so the index always matches what's deployed.

import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'
import { glossary } from '@/lib/data/glossary'
import { articles } from '@/lib/blog/articles'
import { COMPARISONS, encodeComparisonSlug } from '@/lib/data/comparisons'
import { KEPT_CITY_SLUGS, KEPT_GLOSSARY_SLUGS } from '@/lib/data/livePages'
import { COUNTRIES, COUNTRY_SLUGS } from '@/lib/data/countries'
import { PAGE_SEO } from '@/lib/seo/pageSeo'

export type SearchSection =
  | 'page'
  | 'weapon'
  | 'city'
  | 'compare'
  | 'glossary'
  | 'article'

export type SearchEntry = {
  title: string
  description: string
  url: string
  section: SearchSection
}

// NBS-013: structural and hub search entries are DERIVED from PAGE_SEO (the
// generated title/H1/description) so they can never drift from the pages and
// can never reintroduce a stale claim about an effect the tool does not show.
const BASE_PATHS = [
  '/', '/nuclear-blast-radius', '/weapons', '/examples', '/compare', '/glossary', '/blog',
  '/nuclear-weapons-by-country', '/faq', '/how-it-works', '/methodology', '/about',
  '/sources', '/resources', '/contact', '/privacy', '/terms',
]
const basePages: SearchEntry[] = BASE_PATHS.map((p) => {
  const s = PAGE_SEO[p]
  return { title: s?.h1 || s?.title || p, description: s?.description || '', url: p, section: 'page' as const }
})

const weaponPages: SearchEntry[] = bombs
  .filter((b) => b.id !== 'custom')
  .map((b) => ({
    title: b.name,
    description: `${b.country}${b.year ? ` ${b.year}` : ''} · ${b.yield.toLocaleString()} kt · ${b.type} weapon. ${b.description}.`,
    url: `/weapons/${b.id}`,
    section: 'weapon' as const,
  }))

const cityPages: SearchEntry[] = presetLocations
  .filter((c) => KEPT_CITY_SLUGS.includes(c.slug))
  .map((c) => ({
  title: `What if a nuclear bomb hit ${c.name}?`,
  description: `${c.name}, ${c.country}. Population ${c.population.toLocaleString()}. ${c.description}`,
  url: `/examples/${c.slug}`,
  section: 'city' as const,
}))

const comparisonPages: SearchEntry[] = (() => {
  const out: SearchEntry[] = []
  for (const [a, bId] of COMPARISONS) {
    const ba = bombs.find((x) => x.id === a)
    const bb = bombs.find((x) => x.id === bId)
    if (!ba || !bb) continue
    out.push({
      title: `${ba.name} vs ${bb.name}`,
      description: `Side-by-side comparison: ${ba.yield.toLocaleString()} kt vs ${bb.yield.toLocaleString()} kt. Yields, blast and thermal radii.`,
      url: `/compare/${encodeComparisonSlug(a, bId)}`,
      section: 'compare',
    })
  }
  return out
})()

const glossaryPages: SearchEntry[] = glossary
  .filter((g) => KEPT_GLOSSARY_SLUGS.includes(g.slug))
  .map((g) => ({
  title: g.term,
  description: g.short,
  url: `/glossary/${g.slug}`,
  section: 'glossary' as const,
}))

const articlePages: SearchEntry[] = articles.map((a) => ({
  title: a.title,
  description: a.description,
  url: `/blog/${a.slug}`,
  section: 'article' as const,
}))

const countryPages: SearchEntry[] = COUNTRY_SLUGS.map((k) => {
  const c = COUNTRIES[k]
  const total = c.rows.find((r) => r.field === 'warheads.fas.total_inventory')?.value
  return {
    title: `How many nuclear weapons does ${c.article === 'the' ? `the ${c.name}` : c.name} have?`,
    description: total
      ? `${c.name} has about ${total} nuclear warheads (early 2026): warhead count, delivery systems, tests and treaties, cited.`
      : `${c.name}'s nuclear program status in 2026: what the IAEA can and cannot verify, with a dated timeline, cited.`,
    url: `/nuclear-weapons-by-country/${k}`,
    section: 'page' as const,
  }
})

export const SEARCH_INDEX: SearchEntry[] = [
  ...basePages,
  ...weaponPages,
  ...cityPages,
  ...comparisonPages,
  ...glossaryPages,
  ...articlePages,
  ...countryPages,
]

export function search(query: string, limit = 10): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const words = q.split(/\s+/).filter(Boolean)

  return SEARCH_INDEX
    .map((entry) => ({ entry, score: scoreEntry(entry, words, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry)
}

function scoreEntry(entry: SearchEntry, words: string[], rawQuery: string): number {
  const titleLower = entry.title.toLowerCase()
  const descLower = entry.description.toLowerCase()

  let score = 0

  if (titleLower === rawQuery) score += 1000
  if (titleLower.startsWith(rawQuery)) score += 500
  if (titleLower.includes(rawQuery)) score += 200
  if (words.every((w) => titleLower.includes(w))) score += 100
  if (words.every((w) => descLower.includes(w))) score += 30

  // Section weights tip ties toward the things people most often search for.
  if (entry.section === 'page') score += 8
  if (entry.section === 'weapon') score += 5
  if (entry.section === 'city') score += 4
  if (entry.section === 'compare') score += 3
  if (entry.section === 'article') score += 2
  if (entry.section === 'glossary') score += 1

  return score
}
