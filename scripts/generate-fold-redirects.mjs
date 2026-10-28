// NBS-008: generate permanent 308 redirects for the 142 folded URLs, from the
// approved research/redirect-plan.csv (same shape as NBS-004's scenario
// redirects: {source, destination, permanent:true}, no trailing slash, one hop).
//
// NBS-011: redirect-plan.csv sends 7 glossary terms to /nuclear-blast-radius.
// That tool page is now BUILT and carries a matching #<term> section anchor for
// each of the 7, so each term 308s straight to /nuclear-blast-radius#<term> (one
// hop, 308). Until NBS-011 those were parked on /glossary#<term> (page unbuilt).
// The definitions stay on the glossary hub, each linking to its section here.
import { writeFileSync } from 'node:fs'
import { readCsvObjects } from './lib/csv.mjs'

const BLAST_RADIUS_TARGET = '/nuclear-blast-radius'

const rows = readCsvObjects('research/redirect-plan.csv')
let anchored = 0
const rules = rows.map(({ from, to }) => {
  let destination = to
  if (to === BLAST_RADIUS_TARGET) {
    // The term's section anchor on the tool page, e.g. /glossary/fireball
    // -> /nuclear-blast-radius#fireball.
    const term = from.split('/').pop()
    destination = `${BLAST_RADIUS_TARGET}#${term}`
    anchored++
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
  `wrote ${rules.length} fold redirects (compare ${byType.compare}, examples ${byType.examples}, glossary ${byType.glossary}, other ${byType.other}); ${anchored} anchored to ${BLAST_RADIUS_TARGET}#<term>`,
)
