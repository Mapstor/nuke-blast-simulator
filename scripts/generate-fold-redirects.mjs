// NBS-008: generate permanent 308 redirects for the 142 folded URLs, from the
// approved research/redirect-plan.csv (same shape as NBS-004's scenario
// redirects: {source, destination, permanent:true}, no trailing slash, one hop).
//
// Override: redirect-plan.csv sends 7 glossary terms to /nuclear-blast-radius,
// an approved page that is not built yet. Until it ships we must never 308 to a
// 404, so those point at /glossary#<term> (the term lives on the glossary hub
// with that id anchor). DEVLOG §5 tracks the move to /nuclear-blast-radius.
import { writeFileSync } from 'node:fs'
import { readCsvObjects } from './lib/csv.mjs'

const UNBUILT_TARGET = '/nuclear-blast-radius'

const rows = readCsvObjects('research/redirect-plan.csv')
let overridden = 0
const rules = rows.map(({ from, to }) => {
  let destination = to
  if (to === UNBUILT_TARGET) {
    const term = from.split('/').pop()
    destination = `/glossary#${term}`
    overridden++
  }
  return { source: from, destination, permanent: true }
})

writeFileSync('data/fold-redirects.json', JSON.stringify(rules, null, 2) + '\n')

const byType = { compare: 0, examples: 0, glossary: 0, other: 0 }
for (const r of rules) {
  if (r.source.startsWith('/compare/')) byType.compare++
  else if (r.source.startsWith('/examples/')) byType.examples++
  else if (r.source.startsWith('/glossary/')) byType.glossary++
  else byType.other++
}
console.log(
  `wrote ${rules.length} fold redirects (compare ${byType.compare}, examples ${byType.examples}, glossary ${byType.glossary}, other ${byType.other}); ${overridden} retargeted from ${UNBUILT_TARGET} to /glossary#<term>`,
)
