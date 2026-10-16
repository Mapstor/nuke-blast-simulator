// src/lib/seo/contentDates.ts
//
// Page dates come from the committed manifest data/content-dates.json — never
// from build time. Each entry stores a date-independent hash of the page's main
// content plus datePublished and dateModified. scripts/update-content-dates.mjs
// moves dateModified only when the hash changes; tests/content-dates.test.ts
// fails the build if a built page's hash drifts from the manifest.
import rawManifest from '../../../data/content-dates.json'

export type ContentDateEntry = { hash: string; datePublished: string; dateModified: string }

export const CONTENT_DATES = rawManifest as unknown as Record<string, ContentDateEntry>

// Conservative fallbacks for a path not yet in the manifest (e.g. the very
// first build before the script has run). datePublished ~ the 12→400-page
// overhaul; dateModified ~ the NBS-003 integrity pass.
const FALLBACK: { datePublished: string; dateModified: string } = {
  datePublished: '2026-04-30',
  dateModified: '2026-10-15',
}

function normalize(path: string): string {
  if (!path) return '/'
  if (path.startsWith('http')) path = path.replace(/^https?:\/\/[^/]+/, '')
  return path === '' ? '/' : path
}

export function getContentDates(path: string): { datePublished: string; dateModified: string } {
  const e = CONTENT_DATES[normalize(path)]
  return e ? { datePublished: e.datePublished, dateModified: e.dateModified } : FALLBACK
}

export function contentDateModified(path: string): string {
  return CONTENT_DATES[normalize(path)]?.dateModified ?? FALLBACK.dateModified
}
