import { ogImageFor, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/ogImage'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Nuke Blast Simulator'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return ogImageFor(`/glossary/${slug}`, 'Glossary')
}
