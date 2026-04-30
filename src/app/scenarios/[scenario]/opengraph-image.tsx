import { ImageResponse } from 'next/og'
import { OgFrame, OG_SIZE, OG_CONTENT_TYPE, formatYieldShort } from '@/lib/seo/og'
import { bombs } from '@/lib/data/bombs'
import { presetLocations } from '@/lib/data/cities'
import { decodeScenarioSlug } from '@/lib/data/scenarios'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Nuclear blast scenario'

export default async function Image({ params }: { params: Promise<{ scenario: string }> }) {
  const { scenario } = await params
  const decoded = decodeScenarioSlug(scenario)
  const bomb = decoded ? bombs.find((b) => b.id === decoded.bombId) : null
  const city = decoded ? presetLocations.find((c) => c.slug === decoded.citySlug) : null

  if (!bomb || !city) {
    return new ImageResponse(
      <OgFrame title="Scenario Not Found" />,
      { ...size },
    )
  }

  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Scenario"
        title={`${bomb.name} on ${city.name}`}
        subtitle={`${city.country} · ${city.population.toLocaleString()} people`}
        metric={{ label: bomb.name, value: formatYieldShort(bomb.yield) }}
        metricSecondary={{ label: `${city.name} density`, value: `${city.density.toLocaleString()}/km²` }}
      />
    ),
    { ...size },
  )
}
