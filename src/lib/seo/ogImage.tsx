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
import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'
import { glossary } from '@/lib/data/glossary'
import { worldTotalFas } from '@/lib/data/countryView'
import { ENERGY } from '@/components/diagrams/ContentDiagrams'

export { OG_SIZE, OG_CONTENT_TYPE } from './og'
import { OG_SIZE } from './og'

// NBS-013: hubs, the by-country hub and the headline article carry a real data
// point on their share image (content-page: title + one real number), computed
// from the data/engine — not every page has one, so pages absent here stay
// title-only.
const nuclearCount = bombs.filter((b) => b.type !== 'conventional' && b.id !== 'custom').length
const tsarMt = (bombs.find((b) => b.id === 'tsar-bomba')?.yield ?? 50000) / 1000
const ivyMikeMt = (bombs.find((b) => b.id === 'ivy-mike')?.yield ?? 10400) / 1000
// Blast + thermal share of a fission air burst, summed from the energy-split
// data (not a typed literal) so it can't drift from the diagram.
const blastThermalPct = ENERGY.filter((e) => e.label === 'Blast' || e.label === 'Thermal radiation').reduce((s, e) => s + e.pct, 0)
function ogMetric(path: string): { label: string; value: string } | undefined {
  switch (path) {
    case '/': return { label: 'Nuclear weapons', value: String(nuclearCount) }
    case '/weapons': return { label: 'Nuclear weapons', value: String(nuclearCount) }
    case '/examples': return { label: 'World cities', value: String(presetLocations.length) }
    case '/glossary': return { label: 'Defined terms', value: String(glossary.length) }
    case '/nuclear-weapons-by-country': return { label: 'Warheads worldwide, early 2026', value: `~${worldTotalFas().toLocaleString()}` }
    case '/blog/tsar-bomba-largest-test-ever': return { label: 'Yield', value: `${tsarMt} Mt` }
    // NBS-014: one real data point on the retargeted article/standalone pages.
    case '/glossary/hydrogen-bomb': return { label: 'First H-bomb test (Ivy Mike)', value: `${ivyMikeMt} Mt` }
    case '/blog/nuclear-explosion': return { label: 'Energy as blast and heat', value: `${blastThermalPct}%` }
    default: return undefined
  }
}

// Build the share image for a page from its PAGE_SEO entry (its visible H1),
// plus one real data point where the page has a headline figure.
export function ogImageFor(path: string, eyebrow?: string) {
  const seo = PAGE_SEO[path]
  const title = seo?.h1 || seo?.title || 'Nuke Blast Simulator'
  return new ImageResponse(<OgFrame eyebrow={eyebrow} title={title} metric={ogMetric(path)} />, { ...OG_SIZE })
}
