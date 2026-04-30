import { ImageResponse } from 'next/og'
import { OgFrame, OG_SIZE, OG_CONTENT_TYPE, formatYieldShort } from '@/lib/seo/og'
import { bombs } from '@/lib/data/bombs'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Nuclear Blast Simulator weapon profile'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const bomb = bombs.find((b) => b.id === slug)
  if (!bomb) {
    return new ImageResponse(
      <OgFrame title="Weapon Not Found" subtitle="See the full Weapons Database" />,
      { ...size },
    )
  }

  return new ImageResponse(
    (
      <OgFrame
        eyebrow="Weapon profile"
        title={bomb.name}
        subtitle={`${bomb.country}${bomb.year ? ` · ${bomb.year}` : ''} · ${bomb.type}`}
        metric={{ label: 'Yield', value: formatYieldShort(bomb.yield) }}
      />
    ),
    { ...size },
  )
}
