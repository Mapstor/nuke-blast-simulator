import type { SchemaObject } from '@/lib/seo/schemas'

// Renders one or more schema.org JSON-LD scripts. Pass a single schema, an
// array, or use an `@graph` wrapper for linked entities.
export function JsonLd({ schema, id }: { schema: SchemaObject | SchemaObject[]; id?: string }) {
  const payload = Array.isArray(schema)
    ? { '@context': 'https://schema.org', '@graph': schema.map(stripContext) }
    : schema
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}

function stripContext(s: SchemaObject): SchemaObject {
  if (!s || typeof s !== 'object') return s
  const { '@context': _ctx, ...rest } = s as Record<string, unknown>
  return rest as SchemaObject
}
