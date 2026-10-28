import { ImageResponse } from 'next/og'
import { OgFrame, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og'
import { PAGE_SEO } from '@/lib/seo/pageSeo'
import { COUNTRIES, COUNTRY_SLUGS } from '@/lib/data/countries'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Nuclear weapons by country'

export function generateStaticParams() {
  return COUNTRY_SLUGS.map((country) => ({ country }))
}

// NBS-012: per-country share image — the page's H1 (a question) plus the FAS
// total warhead count (Iran shows "None", per FAS and SIPRI).
export default async function Image({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const path = `/nuclear-weapons-by-country/${country}`
  const seo = PAGE_SEO[path]
  const c = COUNTRIES[country]
  const total = c?.rows.find((r) => r.field === 'warheads.fas.total_inventory')?.value
  const title = seo?.h1 || 'Nuclear Weapons by Country'
  const metric =
    country === 'iran'
      ? { label: 'Nuclear weapons', value: 'None' }
      : total
        ? { label: 'Warheads (early 2026)', value: total }
        : undefined
  return new ImageResponse(<OgFrame eyebrow="Nuclear forces" title={title} metric={metric} />, { ...OG_SIZE })
}
