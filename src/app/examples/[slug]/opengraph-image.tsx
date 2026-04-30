import { ImageResponse } from 'next/og'
import { OgFrame, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og'
import { presetLocations } from '@/lib/data/cities'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Nuclear blast scenario for a major city'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const city = presetLocations.find((c) => c.slug === slug)
  if (!city) {
    return new ImageResponse(
      <OgFrame title="City Not Found" />,
      { ...size },
    )
  }

  return new ImageResponse(
    (
      <OgFrame
        eyebrow="City scenario"
        title={`What if a nuke hit ${city.name}?`}
        subtitle={`${city.country}`}
        metric={{ label: 'Population', value: city.population.toLocaleString() }}
        metricSecondary={{ label: 'Density', value: `${city.density.toLocaleString()}/km²` }}
      />
    ),
    { ...size },
  )
}
