import { ogImageFor, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/ogImage'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Nuke Blast Simulator'

export default function Image() {
  return ogImageFor('/examples', 'Cities')
}
