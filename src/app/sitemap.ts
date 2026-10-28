import { MetadataRoute } from 'next'
import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'
import { allComparisonSlugs } from '@/lib/data/comparisons'
import { glossary } from '@/lib/data/glossary'
import { articles } from '@/lib/blog/articles'
import { KEPT_CITY_SLUGS, KEPT_GLOSSARY_SLUGS } from '@/lib/data/livePages'
import { COUNTRY_SLUGS } from '@/lib/data/countries'
import { contentDateModified } from '@/lib/seo/contentDates'

const BASE_URL = 'https://nukeblastsimulator.com'

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency']

// lastmod comes from the committed content-date manifest, not build time.
function lm(path: string): Date {
  return new Date(contentDateModified(path))
}

const staticRoutes: Array<{
  path: string
  priority: number
  changeFrequency: ChangeFreq
}> = [
  { path: '/',             priority: 1.0, changeFrequency: 'weekly'  },
  { path: '/nuclear-blast-radius', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/weapons',      priority: 0.9, changeFrequency: 'monthly' },
  { path: '/examples',     priority: 0.9, changeFrequency: 'monthly' },
  { path: '/compare',      priority: 0.8, changeFrequency: 'monthly' },
  { path: '/glossary',     priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog',         priority: 0.8, changeFrequency: 'weekly'  },
  { path: '/nuclear-weapons-by-country', priority: 0.8, changeFrequency: 'monthly' },
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
  const staticEntries = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path === '/' ? '' : path}`,
    lastModified: lm(path),
    changeFrequency,
    priority,
  }))

  const weaponEntries: MetadataRoute.Sitemap = bombs
    .filter((b) => b.id !== 'custom')
    .map((b) => ({
      url: `${BASE_URL}/weapons/${b.id}`,
      lastModified: lm(`/weapons/${b.id}`),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.7,
    }))

  const cityEntries: MetadataRoute.Sitemap = presetLocations
    .filter((c) => KEPT_CITY_SLUGS.includes(c.slug))
    .map((c) => ({
    url: `${BASE_URL}/examples/${c.slug}`,
    lastModified: lm(`/examples/${c.slug}`),
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.7,
  }))

  const compareEntries: MetadataRoute.Sitemap = allComparisonSlugs().map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: lm(`/compare/${slug}`),
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.6,
  }))

  const glossaryEntries: MetadataRoute.Sitemap = glossary
    .filter((g) => KEPT_GLOSSARY_SLUGS.includes(g.slug))
    .map((g) => ({
    url: `${BASE_URL}/glossary/${g.slug}`,
    lastModified: lm(`/glossary/${g.slug}`),
    changeFrequency: 'yearly' as ChangeFreq,
    priority: 0.5,
  }))

  const blogEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: lm(`/blog/${a.slug}`),
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.7,
  }))

  // NBS-012: the 10 country pages under the by-country hub.
  const countryEntries: MetadataRoute.Sitemap = COUNTRY_SLUGS.map((k) => ({
    url: `${BASE_URL}/nuclear-weapons-by-country/${k}`,
    lastModified: lm(`/nuclear-weapons-by-country/${k}`),
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.7,
  }))

  return [
    ...staticEntries,
    ...weaponEntries,
    ...cityEntries,
    ...compareEntries,
    ...glossaryEntries,
    ...blogEntries,
    ...countryEntries,
  ]
}
