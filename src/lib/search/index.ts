// Static client-side search index over every indexable page on the site.
// Built at compile time from the same data files that drive the routes,
// so the index always matches what's deployed.

import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'
import { glossary } from '@/lib/data/glossary'
import { articles } from '@/lib/blog/articles'
import { COMPARISONS, encodeComparisonSlug } from '@/lib/data/comparisons'
import {
  FEATURED_BOMB_IDS,
  FEATURED_CITY_SLUGS,
  encodeScenarioSlug,
} from '@/lib/data/scenarios'

export type SearchSection =
  | 'page'
  | 'weapon'
  | 'city'
  | 'scenario'
  | 'compare'
  | 'glossary'
  | 'article'

export type SearchEntry = {
  title: string
  description: string
  url: string
  section: SearchSection
}

const basePages: SearchEntry[] = [
  { title: 'Nuclear Blast Simulator',  description: 'Free interactive nuclear blast simulator and nuke map. Click any city to see fireball, blast, thermal, and fallout.', url: '/',             section: 'page' },
  { title: 'About',                    description: 'Educational mission and scientific approach behind the simulator.',                                                       url: '/about',        section: 'page' },
  { title: 'FAQ',                      description: 'Common questions about nuclear weapon effects and the simulator methodology.',                                            url: '/faq',          section: 'page' },
  { title: 'How It Works',             description: 'Step-by-step guide to using the nuclear blast simulator.',                                                                url: '/how-it-works', section: 'page' },
  { title: 'Methodology',              description: 'Scaling-law formulas used to compute fireball, blast, thermal radiation, and fallout zones.',                             url: '/methodology',  section: 'page' },
  { title: 'Weapons Database',         description: 'Browse 44 nuclear weapons by yield class and country.',                                                                   url: '/weapons',      section: 'page' },
  { title: 'City Scenarios',           description: 'Browse city scenarios for major world cities — what if a nuclear bomb hit each city.',                                    url: '/examples',     section: 'page' },
  { title: 'Bomb-on-City Scenarios',   description: 'Browse pre-computed scenarios pairing weapons with cities.',                                                              url: '/scenarios',    section: 'page' },
  { title: 'Weapon Comparisons',       description: 'Browse head-to-head nuclear weapon comparisons.',                                                                         url: '/compare',      section: 'page' },
  { title: 'Nuclear Weapons Glossary', description: 'Defined terms in nuclear weapons effects, physics, doctrine, and arms control.',                                          url: '/glossary',     section: 'page' },
  { title: 'Blog',                     description: 'Long-form articles on nuclear weapon physics, history, doctrine, effects.',                                               url: '/blog',         section: 'page' },
  { title: 'Data Sources',             description: 'Scientific references and primary sources used in calculations.',                                                         url: '/sources',      section: 'page' },
  { title: 'Peace Resources',          description: 'Nuclear disarmament organizations and educational materials.',                                                            url: '/resources',    section: 'page' },
  { title: 'Contact',                  description: 'Contact information for feedback and educational inquiries.',                                                             url: '/contact',      section: 'page' },
  { title: 'Privacy Policy',           description: 'Privacy policy.',                                                                                                          url: '/privacy',      section: 'page' },
  { title: 'Terms of Service',         description: 'Terms of service.',                                                                                                        url: '/terms',        section: 'page' },
]

const weaponPages: SearchEntry[] = bombs
  .filter((b) => b.id !== 'custom')
  .map((b) => ({
    title: b.name,
    description: `${b.country}${b.year ? ` ${b.year}` : ''} · ${b.yield.toLocaleString()} kt · ${b.type} weapon. ${b.description}.`,
    url: `/weapons/${b.id}`,
    section: 'weapon' as const,
  }))

const cityPages: SearchEntry[] = presetLocations.map((c) => ({
  title: `What if a nuclear bomb hit ${c.name}?`,
  description: `${c.name}, ${c.country}. Population ${c.population.toLocaleString()}. ${c.description}`,
  url: `/examples/${c.slug}`,
  section: 'city' as const,
}))

const scenarioPages: SearchEntry[] = (() => {
  const out: SearchEntry[] = []
  for (const bombId of FEATURED_BOMB_IDS) {
    const b = bombs.find((x) => x.id === bombId)
    if (!b) continue
    for (const citySlug of FEATURED_CITY_SLUGS) {
      const c = presetLocations.find((x) => x.slug === citySlug)
      if (!c) continue
      out.push({
        title: `${b.name} on ${c.name}`,
        description: `What if a ${b.yield.toLocaleString()} kt ${b.name} detonated over ${c.name}, ${c.country}? Casualty estimates and blast radii.`,
        url: `/scenarios/${encodeScenarioSlug(bombId, citySlug)}`,
        section: 'scenario' as const,
      })
    }
  }
  return out
})()

const comparisonPages: SearchEntry[] = (() => {
  const out: SearchEntry[] = []
  for (const [a, bId] of COMPARISONS) {
    const ba = bombs.find((x) => x.id === a)
    const bb = bombs.find((x) => x.id === bId)
    if (!ba || !bb) continue
    out.push({
      title: `${ba.name} vs ${bb.name}`,
      description: `Side-by-side comparison: ${ba.yield.toLocaleString()} kt vs ${bb.yield.toLocaleString()} kt. Yields, blast radii, casualties.`,
      url: `/compare/${encodeComparisonSlug(a, bId)}`,
      section: 'compare',
    })
  }
  return out
})()

const glossaryPages: SearchEntry[] = glossary.map((g) => ({
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

export const SEARCH_INDEX: SearchEntry[] = [
  ...basePages,
  ...weaponPages,
  ...cityPages,
  ...scenarioPages,
  ...comparisonPages,
  ...glossaryPages,
  ...articlePages,
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
  if (entry.section === 'scenario') score += 3
  if (entry.section === 'compare') score += 3
  if (entry.section === 'article') score += 2
  if (entry.section === 'glossary') score += 1

  return score
}
