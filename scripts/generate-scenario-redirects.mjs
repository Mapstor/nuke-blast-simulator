// NBS-004: generate permanent 308 redirects for the retired /scenarios routes.
// Every /scenarios/{bomb}-on-{city} -> /examples/{city}; /scenarios -> /examples.
// Rules are generated from the same data the route used (src/lib/data/scenarios.ts).
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('src/lib/data/scenarios.ts', 'utf8')
function arr(name) {
  const m = src.match(new RegExp(`export const ${name}[^=]*=\\s*\\[([\\s\\S]*?)\\]`))
  if (!m) throw new Error('array not found: ' + name)
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
}
const bombs = arr('FEATURED_BOMB_IDS')
const cities = arr('FEATURED_CITY_SLUGS')

// NBS-010: resolve scenario destinations through the NBS-008 fold map so every
// redirect is ONE hop. Most featured cities were folded (/examples/<city> ->
// /examples); without this the scenario redirect would 308 to a page that then
// 308s again. Fold destinations are never themselves fold sources, so a single
// resolution step is enough.
const foldRules = JSON.parse(readFileSync('data/fold-redirects.json', 'utf8'))
const foldMap = new Map(foldRules.map((r) => [r.source, r.destination]))
const resolve = (dest) => foldMap.get(dest) ?? dest

let folded = 0
const rules = []
for (const bomb of bombs) {
  for (const city of cities) {
    const destination = resolve(`/examples/${city}`)
    if (destination !== `/examples/${city}`) folded++
    rules.push({ source: `/scenarios/${bomb}-on-${city}`, destination, permanent: true })
  }
}
rules.push({ source: '/scenarios', destination: resolve('/examples'), permanent: true })

writeFileSync('data/scenario-redirects.json', JSON.stringify(rules, null, 2) + '\n')
console.log(`wrote ${rules.length} redirect rules (${bombs.length} bombs x ${cities.length} cities + 1 index); ${folded} resolved through the fold map to one hop`)
