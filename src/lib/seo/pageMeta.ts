// NBS-008: build a Next Metadata object from the generated PAGE_SEO map, so
// every page's title / description / OG / Twitter / canonical come from one
// source (the keyword ledger). The layout sets no title template, so the title
// here is the final <title> — no brand suffix is appended.
import type { Metadata } from 'next'
import { PAGE_SEO } from './pageSeo'

export function seoMetadata(path: string, type: 'website' | 'article' = 'website'): Metadata {
  const s = PAGE_SEO[path]
  if (!s) throw new Error(`seoMetadata: no PAGE_SEO entry for '${path}'`)
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: path },
    openGraph: { title: s.title, description: s.description, url: path, type },
    twitter: { card: 'summary_large_image', title: s.title, description: s.description },
  }
}

// The H1 for a page (used in the page body). Falls back to the title.
export function pageH1(path: string): string {
  return PAGE_SEO[path]?.h1 ?? PAGE_SEO[path]?.title ?? ''
}

// The meta description for a page (used e.g. in Article JSON-LD so the schema
// description matches the page's real description).
export function pageDescription(path: string): string {
  return PAGE_SEO[path]?.description ?? ''
}
