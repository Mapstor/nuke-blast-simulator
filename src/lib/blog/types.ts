export type Block =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  // NBS-014: an inline, server-rendered diagram referenced by id (see
  // CONTENT_DIAGRAMS). caption is rendered below and may carry {{c:ids}}.
  | { type: 'svg'; id: string; caption?: string }
  // NBS-014: a cited data table (header row + body rows); cells may carry
  // {{c:ids}} / {{r:y:eff}} tokens and inline markdown links [text](href).
  | { type: 'table'; columns: string[]; rows: string[][]; caption?: string }

export type Section = {
  heading?: string
  body: Block[]
}

// NBS-014: a question-form keyword with a self-contained, cited answer. The
// answer is plain text (used verbatim in the FAQPage schema); sourceIds render
// as a trailing citation in the visible FAQ.
export type FaqItem = {
  question: string
  answer: string
  sourceIds?: string[]
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
  faq?: FaqItem[] // NBS-014 FAQPage block
  sourceIds?: string[] // NBS-005 citation source ids (research/sources.csv)
}
