// NBS-004: maintain data/content-dates.json — real, drift-proof page dates.
//
// For every prerendered page it computes a DATE-INDEPENDENT hash of the main
// content (chrome, scripts, styles and <time> elements stripped) and:
//   - datePublished: kept if already in the manifest; otherwise seeded from the
//     first git commit that introduced the page's route/data (blog from the
//     article's own datePublished). Never "today".
//   - dateModified: kept while the hash is unchanged; moved to the commit date
//     (env NBS_DATE, default = HEAD commit date) only when the hash changes.
// On the first run (empty manifest) new entries are seeded with
// dateModified = NBS_SEED (default 2026-10-15, the NBS-003 integrity pass that
// genuinely changed nearly every page).
//
// Run after `next build`. tests/content-dates.test.ts fails the build if any
// page's hash drifts from the manifest, so dates can never silently refresh.

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { contentHash, listContentPages } from './content-hash.mjs'

const ROOT = process.cwd()
const APP_DIR = join(ROOT, '.next', 'server', 'app')
const MANIFEST = join(ROOT, 'data', 'content-dates.json')
const COMMIT_DATE = process.env.NBS_DATE || gitDate('HEAD') || '2026-10-16'
const SEED_MODIFIED = process.env.NBS_SEED || '2026-10-15'

function gitDate(ref) {
  try { return execSync(`git log -1 --format=%cs ${ref}`, { encoding: 'utf8' }).trim() } catch { return '' }
}
const firstCommitCache = new Map()
function gitFirstDate(file) {
  if (firstCommitCache.has(file)) return firstCommitCache.get(file)
  let d = ''
  try {
    const out = execSync(`git log --diff-filter=A --format=%cs -- "${file}"`, { encoding: 'utf8' }).trim()
    const lines = out.split('\n').filter(Boolean)
    d = lines[lines.length - 1] || ''
  } catch { d = '' }
  firstCommitCache.set(file, d)
  return d
}

// Blog article datePublished, parsed line-by-line (slug precedes datePublished).
const blogDates = (() => {
  const map = {}
  try {
    const src = readFileSync(join(ROOT, 'src/lib/blog/articles.ts'), 'utf8')
    let slug = null
    for (const line of src.split('\n')) {
      const s = line.match(/slug:\s*'([^']+)'/)
      if (s) slug = s[1]
      const d = line.match(/datePublished:\s*'([^']+)'/)
      if (d && slug) { map[slug] = d[1]; slug = null }
    }
  } catch {}
  return map
})()

const FALLBACK_PUB = '2026-04-30'

function routeFileFor(path) {
  if (path === '/') return 'src/app/page.tsx'
  const seg = (p) => `src/app${p}/page.tsx`
  if (/^\/weapons\/.+/.test(path)) return 'src/app/weapons/[slug]/page.tsx'
  if (/^\/examples\/.+/.test(path)) return 'src/app/examples/[slug]/page.tsx'
  if (/^\/compare\/.+/.test(path)) return 'src/app/compare/[slug]/page.tsx'
  if (/^\/glossary\/.+/.test(path)) return 'src/app/glossary/[slug]/page.tsx'
  return seg(path)
}

function datePublishedFor(path) {
  const blog = path.match(/^\/blog\/(.+)$/)
  if (blog && blogDates[blog[1]]) return blogDates[blog[1]]
  return gitFirstDate(routeFileFor(path)) || FALLBACK_PUB
}

if (!existsSync(APP_DIR)) {
  console.error('No .next/server/app — run `next build` first.')
  process.exit(1)
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {}
const pages = listContentPages(APP_DIR)
const seen = new Set()
let created = 0, moved = 0, kept = 0

for (const { path, file } of pages) {
  seen.add(path)
  const html = readFileSync(file, 'utf8')
  const hash = contentHash(html)
  const prev = manifest[path]

  const datePublished = prev?.datePublished || datePublishedFor(path)
  let dateModified
  if (!prev) { dateModified = SEED_MODIFIED; created++ }
  else if (prev.hash !== hash) { dateModified = COMMIT_DATE; moved++ }
  else { dateModified = prev.dateModified; kept++ }

  manifest[path] = { hash, datePublished, dateModified }
}

// Prune entries whose page no longer builds (e.g. the retired /scenarios URLs).
let pruned = 0
for (const path of Object.keys(manifest)) {
  if (!seen.has(path)) { delete manifest[path]; pruned++ }
}

const sorted = {}
for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k]
writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n')

console.log(`content-dates: ${Object.keys(sorted).length} pages | created ${created}, moved ${moved}, kept ${kept}, pruned ${pruned}`)
const pubs = Object.values(sorted).map((e) => e.datePublished).sort()
const mods = {}
for (const e of Object.values(sorted)) mods[e.dateModified] = (mods[e.dateModified] || 0) + 1
console.log(`earliest datePublished: ${pubs[0]} | dateModified counts: ${JSON.stringify(mods)}`)
