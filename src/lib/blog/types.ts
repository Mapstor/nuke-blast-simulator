export type Block =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }

export type Section = {
  heading?: string
  body: Block[]
}

export type Article = {
  slug: string
  title: string
  description: string
  datePublished: string // ISO date
  dateModified?: string
  author: string
  category: 'physics' | 'history' | 'doctrine' | 'effects'
  readingMinutes: number
  body: Section[]
}
