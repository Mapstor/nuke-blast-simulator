import { MetadataRoute } from 'next'
import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'
import { allScenarioSlugs } from '@/lib/data/scenarios'
import { allComparisonSlugs } from '@/lib/data/comparisons'
import { glossary } from '@/lib/data/glossary'
import { articles } from '@/lib/blog/articles'

const BASE_URL = 'https://nukeblastsimulator.com'

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency']

const staticRoutes: Array<{
  path: string
  priority: number
  changeFrequency: ChangeFreq
}> = [
  { path: '',              priority: 1.0, changeFrequency: 'weekly'  },
  { path: '/weapons',      priority: 0.9, changeFrequency: 'monthly' },
  { path: '/examples',     priority: 0.9, changeFrequency: 'monthly' },
  { path: '/scenarios',    priority: 0.9, changeFrequency: 'monthly' },
  { path: '/compare',      priority: 0.8, changeFrequency: 'monthly' },
  { path: '/glossary',     priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog',         priority: 0.8, changeFrequency: 'weekly'  },
  { path: '/faq',          priority: 0.8, changeFrequency: 'monthly' },
  { path: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/methodology',  priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about',        priority: 0.7, changeFrequency: 'yearly'  },
  { path: '/resources',    priority: 0.6, changeFrequency: 'monthly' },
  { path: '/sources',      priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact',      priority: 0.5, changeFrequency: 'yearly'  },
  { path: '/privacy',      priority: 0.3, changeFrequency: 'yearly'  },
  { path: '/terms',        priority: 0.3, changeFrequency: 'yearly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticEntries = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))

  // Each weapon detail page (/weapons/[slug]) — auto-enumerated from data.
  const weaponEntries: MetadataRoute.Sitemap = bombs
    .filter((b) => b.id !== 'custom')
    .map((b) => ({
      url: `${BASE_URL}/weapons/${b.id}`,
      lastModified,
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.7,
    }))

  // Each city scenario page (/examples/[slug]).
  const cityEntries: MetadataRoute.Sitemap = presetLocations.map((c) => ({
    url: `${BASE_URL}/examples/${c.slug}`,
    lastModified,
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.7,
  }))

  // Each bomb-on-city scenario page (/scenarios/[scenario]).
  const scenarioEntries: MetadataRoute.Sitemap = allScenarioSlugs().map((slug) => ({
    url: `${BASE_URL}/scenarios/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.6,
  }))

  // Each bomb-vs-bomb comparison page (/compare/[slug]).
  const compareEntries: MetadataRoute.Sitemap = allComparisonSlugs().map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.6,
  }))

  // Each glossary term (/glossary/[slug]).
  const glossaryEntries: MetadataRoute.Sitemap = glossary.map((g) => ({
    url: `${BASE_URL}/glossary/${g.slug}`,
    lastModified,
    changeFrequency: 'yearly' as ChangeFreq,
    priority: 0.5,
  }))

  // Each blog article (/blog/[slug]).
  const blogEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.dateModified ?? a.datePublished),
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.7,
  }))

  return [
    ...staticEntries,
    ...weaponEntries,
    ...cityEntries,
    ...scenarioEntries,
    ...compareEntries,
    ...glossaryEntries,
    ...blogEntries,
  ]
}
