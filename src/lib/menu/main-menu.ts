// Main-menu data, derived from the actual content data files so the menu
// stays in sync as bombs/cities/articles grow.

import { bombs } from '@/lib/data/bombs'
import { presetLocations, type PresetLocation } from '@/lib/data/cities'
import { COMPARISONS, encodeComparisonSlug } from '@/lib/data/comparisons'
import { encodeScenarioSlug, FEATURED_BOMB_IDS } from '@/lib/data/scenarios'
import { glossary } from '@/lib/data/glossary'
import { articles } from '@/lib/blog/articles'

export type MenuItem = {
  label: string
  href: string
  meta?: string
  description?: string
}

export type MenuColumn = {
  heading: string
  items: MenuItem[]
}

export type MenuPanel = {
  id: string
  label: string
  href?: string // direct link if no dropdown
  columns?: [MenuColumn, MenuColumn, MenuColumn]
  panelFooter?: { label: string; href: string }
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function shortYield(y: number): string {
  if (y >= 1000) return `${(y / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  if (y >= 1) return `${y.toLocaleString()} kt`
  return `${(y * 1000).toLocaleString()} t`
}

const indexedBombs = bombs.filter((b) => b.id !== 'custom')

function bombItem(id: string): MenuItem | null {
  const b = bombs.find((x) => x.id === id)
  if (!b) return null
  return {
    label: b.name,
    href: `/weapons/${b.id}`,
    meta: shortYield(b.yield),
  }
}

function cityItem(slug: string): MenuItem | null {
  const c = presetLocations.find((x) => x.slug === slug)
  if (!c) return null
  return { label: c.name, href: `/examples/${c.slug}`, meta: c.country }
}

function scenarioItem(bombId: string, citySlug: string): MenuItem | null {
  const b = bombs.find((x) => x.id === bombId)
  const c = presetLocations.find((x) => x.slug === citySlug)
  if (!b || !c) return null
  return {
    label: `${b.name} on ${c.name}`,
    href: `/scenarios/${encodeScenarioSlug(bombId, citySlug)}`,
    meta: shortYield(b.yield),
  }
}

function compareItem(a: string, b: string): MenuItem | null {
  const ba = bombs.find((x) => x.id === a)
  const bb = bombs.find((x) => x.id === b)
  if (!ba || !bb) return null
  return {
    label: `${ba.name} vs ${bb.name}`,
    href: `/compare/${encodeComparisonSlug(a, b)}`,
    meta: `${shortYield(ba.yield)} vs ${shortYield(bb.yield)}`,
  }
}

function compact(items: Array<MenuItem | null>): MenuItem[] {
  return items.filter((x): x is MenuItem => Boolean(x))
}

// Counts for badges
const TOTAL_WEAPONS = indexedBombs.length
const TOTAL_CITIES = presetLocations.length
const TOTAL_SCENARIOS = FEATURED_BOMB_IDS.length * 20 // 10 × 20 = 200
const TOTAL_COMPARISONS = COMPARISONS.length
const TOTAL_GLOSSARY = glossary.length
const TOTAL_ARTICLES = articles.length

// Region counts for cities
const cityRegionCounts: Record<PresetLocation['region'], number> = {
  'North America': 0,
  Europe: 0,
  Asia: 0,
  'Middle East': 0,
  'South America': 0,
  Africa: 0,
  Oceania: 0,
}
for (const c of presetLocations) cityRegionCounts[c.region]++

// Glossary category counts
const glossaryCategoryCounts = {
  effects: 0,
  weapons: 0,
  physics: 0,
  doctrine: 0,
  treaty: 0,
} as Record<string, number>
for (const g of glossary) glossaryCategoryCounts[g.category]++

const latestArticles = [...articles]
  .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
  .slice(0, 5)

// ─────────────────────────────────────────────────────────────────────────
// Panel definitions
// ─────────────────────────────────────────────────────────────────────────

const weaponsPanel: MenuPanel = {
  id: 'weapons',
  label: 'Weapons',
  panelFooter: { label: `Browse all ${TOTAL_WEAPONS} weapons →`, href: '/weapons' },
  columns: [
    {
      heading: 'Iconic & historic',
      items: compact([
        bombItem('tsar-bomba'),
        bombItem('castle-bravo'),
        bombItem('ivy-mike'),
        bombItem('little-boy'),
        bombItem('fat-man'),
        bombItem('trinity'),
      ]),
    },
    {
      heading: 'Modern arsenal',
      items: compact([
        bombItem('b83'),
        bombItem('w88'),
        bombItem('w87'),
        bombItem('w76'),
        bombItem('b61'),
        bombItem('w80'),
      ]),
    },
    {
      heading: 'Browse',
      items: [
        { label: `All ${TOTAL_WEAPONS} weapons`, href: '/weapons' },
        { label: 'Compare weapons', href: '/compare' },
        { label: 'Run on map', href: '/' },
        { label: 'Methodology', href: '/methodology' },
      ],
    },
  ],
}

const citiesPanel: MenuPanel = {
  id: 'cities',
  label: 'Cities',
  panelFooter: { label: `Browse all ${TOTAL_CITIES} cities →`, href: '/examples' },
  columns: [
    {
      heading: 'Featured cities',
      items: compact([
        cityItem('new-york'),
        cityItem('london'),
        cityItem('tokyo'),
        cityItem('moscow'),
        cityItem('beijing'),
        cityItem('paris'),
        cityItem('washington-dc'),
      ]),
    },
    {
      heading: 'By region',
      items: [
        { label: 'North America', href: '/examples#north-america', meta: `${cityRegionCounts['North America']}` },
        { label: 'Europe',         href: '/examples#europe',         meta: `${cityRegionCounts.Europe}`         },
        { label: 'Asia',           href: '/examples#asia',           meta: `${cityRegionCounts.Asia}`           },
        { label: 'Middle East',    href: '/examples#middle-east',    meta: `${cityRegionCounts['Middle East']}` },
        { label: 'South America',  href: '/examples#south-america',  meta: `${cityRegionCounts['South America']}` },
        { label: 'Africa',         href: '/examples#africa',         meta: `${cityRegionCounts.Africa}`         },
        { label: 'Oceania',        href: '/examples#oceania',        meta: `${cityRegionCounts.Oceania}`        },
      ],
    },
    {
      heading: 'Browse',
      items: [
        { label: `All ${TOTAL_CITIES} cities`, href: '/examples' },
        { label: `${TOTAL_SCENARIOS} bomb-on-city scenarios`, href: '/scenarios' },
        { label: 'Run on map', href: '/' },
      ],
    },
  ],
}

const scenariosPanel: MenuPanel = {
  id: 'scenarios',
  label: 'Scenarios',
  panelFooter: { label: `Browse all ${TOTAL_SCENARIOS} scenarios →`, href: '/scenarios' },
  columns: [
    {
      heading: 'Featured scenarios',
      items: compact([
        scenarioItem('tsar-bomba', 'new-york'),
        scenarioItem('little-boy', 'tokyo'),
        scenarioItem('castle-bravo', 'london'),
        scenarioItem('b83', 'moscow'),
        scenarioItem('w88', 'beijing'),
        scenarioItem('tsar-bomba', 'washington-dc'),
      ]),
    },
    {
      heading: 'By weapon',
      items: compact(
        FEATURED_BOMB_IDS.slice(0, 8).map((id) => {
          const b = bombs.find((x) => x.id === id)
          if (!b) return null
          return { label: `${b.name} scenarios`, href: `/scenarios#${b.id}`, meta: '20' }
        }),
      ),
    },
    {
      heading: 'Browse',
      items: [
        { label: `All ${TOTAL_SCENARIOS} scenarios`, href: '/scenarios' },
        { label: 'City scenarios', href: '/examples' },
        { label: 'Weapons database', href: '/weapons' },
        { label: 'Run any scenario on map', href: '/' },
      ],
    },
  ],
}

const comparePanel: MenuPanel = {
  id: 'compare',
  label: 'Compare',
  panelFooter: { label: `Browse all ${TOTAL_COMPARISONS} comparisons →`, href: '/compare' },
  columns: [
    {
      heading: 'Iconic head-to-heads',
      items: compact([
        compareItem('tsar-bomba', 'castle-bravo'),
        compareItem('little-boy', 'fat-man'),
        compareItem('tsar-bomba', 'little-boy'),
        compareItem('castle-bravo', 'little-boy'),
        compareItem('ivy-mike', 'castle-bravo'),
        compareItem('tsar-bomba', 'ivy-mike'),
      ]),
    },
    {
      heading: 'First tests by country',
      items: compact([
        compareItem('trinity', 'joe-1'),
        compareItem('trinity', 'hurricane'),
        compareItem('trinity', 'gerboise-bleue'),
        compareItem('trinity', '596'),
        compareItem('trinity', 'smiling-buddha'),
        compareItem('trinity', 'chagai-i'),
      ]),
    },
    {
      heading: 'Browse',
      items: [
        { label: `All ${TOTAL_COMPARISONS} comparisons`, href: '/compare' },
        { label: 'Modern strategic warheads', href: '/compare#b83-vs-w88' },
        { label: 'Conventional vs nuclear', href: '/compare#little-boy-vs-moab' },
        { label: 'Weapons database', href: '/weapons' },
      ],
    },
  ],
}

const learnPanel: MenuPanel = {
  id: 'learn',
  label: 'Learn',
  panelFooter: { label: `Browse all ${TOTAL_ARTICLES} articles →`, href: '/blog' },
  columns: [
    {
      heading: 'Latest articles',
      items: latestArticles.slice(0, 5).map((a) => ({
        label: a.title,
        href: `/blog/${a.slug}`,
        meta: `${a.readingMinutes} min`,
      })),
    },
    {
      heading: 'Glossary by category',
      items: [
        { label: 'Effects',  href: '/glossary#effects',  meta: `${glossaryCategoryCounts.effects}`  },
        { label: 'Weapons',  href: '/glossary#weapons',  meta: `${glossaryCategoryCounts.weapons}`  },
        { label: 'Physics',  href: '/glossary#physics',  meta: `${glossaryCategoryCounts.physics}`  },
        { label: 'Doctrine', href: '/glossary#doctrine', meta: `${glossaryCategoryCounts.doctrine}` },
        { label: 'Treaty',   href: '/glossary#treaty',   meta: `${glossaryCategoryCounts.treaty}`   },
        { label: `All ${TOTAL_GLOSSARY} terms`, href: '/glossary' },
      ],
    },
    {
      heading: 'Reference',
      items: [
        { label: 'How It Works',   href: '/how-it-works' },
        { label: 'Methodology',    href: '/methodology'  },
        { label: 'FAQ',            href: '/faq'          },
        { label: 'Data sources',   href: '/sources'      },
        { label: 'About',          href: '/about'        },
        { label: 'Peace resources', href: '/resources'   },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────
// Final menu
// ─────────────────────────────────────────────────────────────────────────

export const MAIN_MENU: MenuPanel[] = [
  weaponsPanel,
  citiesPanel,
  scenariosPanel,
  comparePanel,
  learnPanel,
]

export const SIMULATOR_HREF = '/'
