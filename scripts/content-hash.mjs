// Shared, date-independent content hashing for the content-date manifest.
// Imported by both scripts/update-content-dates.mjs and the drift test so the
// two can never disagree on how a page's content is hashed.
import { createHash } from 'node:crypto'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Hash of a page's main content, with chrome/scripts/styles and <time>
// elements removed so dates do NOT affect the hash.
export function contentHash(html) {
  let main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html
  main = main
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<time[\s\S]*?<\/time>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return createHash('sha256').update(main).digest('hex').slice(0, 16)
}

// Map a .next/server/app relative html file (no extension) to a URL path.
export function fileToPath(relNoExt) {
  if (relNoExt === 'index') return '/'
  if (relNoExt.endsWith('/index')) return '/' + relNoExt.slice(0, -'/index'.length)
  return '/' + relNoExt
}

// List prerendered content pages as { path, file } (skips _not-found etc.).
export function listContentPages(appDir) {
  const out = []
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e)
      if (statSync(p).isDirectory()) walk(p)
      else if (e.endsWith('.html')) {
        const rel = p.slice(appDir.length + 1)
        const relNoExt = rel.slice(0, -'.html'.length)
        if (relNoExt.split('/').some((s) => s.startsWith('_'))) continue
        out.push({ path: fileToPath(relNoExt), file: p })
      }
    }
  }
  walk(appDir)
  return out
}
