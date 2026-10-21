// Minimal RFC-4180 CSV parser (handles quoted fields, embedded commas,
// doubled quotes, and newlines inside quotes). Shared by the NBS-005 build
// scripts and inspectors.
import { readFileSync } from 'node:fs'

export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQ = false
      } else field += c
    } else {
      if (c === '"') inQ = true
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
      else if (c === '\r') { /* skip */ }
      else field += c
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

// Parse into an array of objects keyed by the header row.
export function readCsvObjects(path) {
  const rows = parseCsv(readFileSync(path, 'utf8'))
  const header = rows[0]
  return rows.slice(1).filter((r) => r.length > 1 || (r.length === 1 && r[0] !== '')).map((r) => {
    const o = {}
    header.forEach((h, i) => { o[h] = r[i] ?? '' })
    return o
  })
}
