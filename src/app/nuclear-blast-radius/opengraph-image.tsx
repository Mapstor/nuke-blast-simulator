import { ImageResponse } from 'next/og'
import { OgFrame, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og'
import { radiusKm, milesProse } from '@/lib/calculations/radius'
import { formatRadiusKm } from '@/lib/calculations/effects'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Nuclear Blast Radius Calculator'

// NBS-011: the share image carries the page title plus one engine-derived
// number (the 5 psi radius of a 1-megaton air burst), so it is page-specific
// and data-bearing (svg-spec OG rule). A file-based image populates both
// og:image and twitter:image.
export default function Image() {
  const km = radiusKm(1000, 'psi5')
  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Calculator & chart"
        title="Nuclear Blast Radius"
        subtitle="Every effect ring, 1 kt to 50 Mt"
        metric={{ label: '5 psi · 1 Mt air burst', value: `${milesProse(km)} mi` }}
        metricSecondary={{ label: 'Metric', value: `${formatRadiusKm(km)} km` }}
      />
    ),
    { ...size },
  )
}
