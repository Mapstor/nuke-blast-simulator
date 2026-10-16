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

const rules = []
for (const bomb of bombs) {
  for (const city of cities) {
    rules.push({ source: `/scenarios/${bomb}-on-${city}`, destination: `/examples/${city}`, permanent: true })
  }
}
rules.push({ source: '/scenarios', destination: '/examples', permanent: true })

writeFileSync('data/scenario-redirects.json', JSON.stringify(rules, null, 2) + '\n')
console.log(`wrote ${rules.length} redirect rules (${bombs.length} bombs x ${cities.length} cities + 1 index)`)
