import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error — plain ESM helper shared with the update script (no types)
import { contentHash, listContentPages } from '../scripts/content-hash.mjs'

const ROOT = join(__dirname, '..')
const APP_DIR = join(ROOT, '.next', 'server', 'app')
const MANIFEST = join(ROOT, 'data', 'content-dates.json')

type Entry = { hash: string; datePublished: string; dateModified: string }

describe('content-date manifest', () => {
  const manifest: Record<string, Entry> = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  const pages: Array<{ path: string; file: string }> = existsSync(APP_DIR) ? listContentPages(APP_DIR) : []

  it('has prerendered content pages to check (run `next build` first)', () => {
    expect(pages.length).toBeGreaterThan(0)
  })

  it('every built page is in the manifest with a matching content hash (no drift)', () => {
    const problems: string[] = []
    for (const { path, file } of pages) {
      const entry = manifest[path]
      if (!entry) { problems.push(`${path}: missing from manifest`); continue }
      const hash = contentHash(readFileSync(file, 'utf8'))
      if (hash !== entry.hash) problems.push(`${path}: hash ${hash} != manifest ${entry.hash}`)
    }
    expect(problems).toEqual([])
  })

  it('has no stale manifest entries (every entry maps to a built page)', () => {
    const built = new Set(pages.map((p) => p.path))
    const stale = Object.keys(manifest).filter((p) => !built.has(p))
    expect(stale).toEqual([])
  })

  it('all dates are valid and dateModified >= datePublished', () => {
    const bad: string[] = []
    const iso = /^\d{4}-\d{2}-\d{2}$/
    for (const [path, e] of Object.entries(manifest)) {
      if (!iso.test(e.datePublished) || !iso.test(e.dateModified)) bad.push(`${path}: bad date format`)
      else if (e.dateModified < e.datePublished) bad.push(`${path}: modified ${e.dateModified} < published ${e.datePublished}`)
    }
    expect(bad).toEqual([])
  })
})
