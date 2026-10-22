// NBS-010: shared share-image generator for the 36 pages that have no
// file-based OG image of their own (hubs, structural, blog articles, glossary
// standalone, country hub, home). seoMetadata() sets openGraph without images,
// and a page-level openGraph replaces the layout's, so without a file-based
// opengraph-image these pages had no og:image / twitter:image. A file-based
// opengraph-image outranks config images and populates BOTH og:image and
// twitter:image (confirmed on the weapon pages). Same OgFrame look as the
// weapon/city/compare images.
import { ImageResponse } from 'next/og'
import { OgFrame } from './og'
import { PAGE_SEO } from './pageSeo'

export { OG_SIZE, OG_CONTENT_TYPE } from './og'
import { OG_SIZE } from './og'

// Build the share image for a page from its PAGE_SEO entry (its visible H1).
export function ogImageFor(path: string, eyebrow?: string) {
  const seo = PAGE_SEO[path]
  const title = seo?.h1 || seo?.title || 'Nuclear Blast Simulator'
  return new ImageResponse(<OgFrame eyebrow={eyebrow} title={title} />, { ...OG_SIZE })
}
