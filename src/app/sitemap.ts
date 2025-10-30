// app/sitemap.ts

import { MetadataRoute } from 'next'
import { presetLocations } from '@/lib/data/cities'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nukeblastsimulator.com'
  
  // Static pages
  const routes = ['', '/how-it-works', '/methodology'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8
  }))
  
  // Example city pages for SEO
  const cityPages = presetLocations.map(location => ({
    url: `${baseUrl}/examples/${location.name?.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }))
  
  return [...routes, ...cityPages]
}