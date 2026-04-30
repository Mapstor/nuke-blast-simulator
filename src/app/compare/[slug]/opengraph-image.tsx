import { ImageResponse } from 'next/og'
import { OgFrame, OG_SIZE, OG_CONTENT_TYPE, formatYieldShort } from '@/lib/seo/og'
import { bombs } from '@/lib/data/bombs'
import { decodeComparisonSlug } from '@/lib/data/comparisons'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Nuclear weapon comparison'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decoded = decodeComparisonSlug(slug)
  const a = decoded ? bombs.find((b) => b.id === decoded.a) : null
  const b = decoded ? bombs.find((bm) => bm.id === decoded.b) : null

  if (!a || !b) {
    return new ImageResponse(
      <OgFrame title="Comparison Not Found" />,
      { ...size },
    )
  }

  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Comparison"
        title={`${a.name} vs ${b.name}`}
        subtitle="Yield, blast radius, casualties — side by side"
        metric={{ label: a.name, value: formatYieldShort(a.yield) }}
        metricSecondary={{ label: b.name, value: formatYieldShort(b.yield) }}
      />
    ),
    { ...size },
  )
}
