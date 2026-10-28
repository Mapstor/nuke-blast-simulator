// NBS-012: read-only helpers over the generated country data. The page template
// queries verified rows through these; no page hard-codes a number.
import { COUNTRIES, COUNTRY_SLUGS, type Country, type CountryRow } from './countries'
import { bombs } from './bombs'

export { COUNTRIES, COUNTRY_SLUGS }
export type { Country, CountryRow }

export function getCountry(key: string): Country | undefined {
  return COUNTRIES[key]
}

/** First verified row with an exact field key. */
export function row(c: Country, field: string): CountryRow | undefined {
  return c.rows.find((r) => r.field === field)
}
/** The value of an exact field, or '' if absent. */
export function val(c: Country, field: string): string {
  return row(c, field)?.value ?? ''
}
/** All verified rows whose field starts with a prefix, in CSV order. */
export function rowsWith(c: Country, prefix: string): CountryRow[] {
  return c.rows.filter((r) => r.field.startsWith(prefix))
}

/** Parse a pipe-delimited "k=v | k=v" delivery value into an object. */
export function cells(value: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of value.split('|')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim()
  }
  return out
}
// A delivery row is STRUCTURED (belongs in the table, including single-cell
// subtotal rows like "warheads=1,794") if it carries any key=value cell; a row
// with no "=" is a prose note. Detecting "=" (not "|") stops a single-cell
// subtotal from leaking as raw "warheads=1,794" text (NBS-013).
export function isStructured(value: string): boolean {
  return value.includes('=')
}

// "beginning of 2026 (FAS page updated 2026-06-09)" -> "beginning of 2026".
export function cleanAsOf(s: string): string {
  return (s || '').split(' (')[0].trim()
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
// Rewrite ISO dates (YYYY-MM-DD) in a display string to "D Month YYYY".
export function humanizeDates(s: string): string {
  return (s || '').replace(/(\d{4})-(\d{2})-(\d{2})/g, (_, y, m, d) =>
    `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`)
}

// Short display name for awkward possessives: "US warheads" not "the United
// States's warheads"; "UK" likewise. Others keep their name.
export function shortName(key: string, name: string): string {
  if (key === 'united-states') return 'US'
  if (key === 'united-kingdom') return 'UK'
  return name
}
// Possessive heading: "US warheads" / "UK warheads" (acronyms, no 's) or
// "Russia's warheads".
export function headingPoss(key: string, name: string, noun: string): string {
  if (key === 'united-states') return `US ${noun}`
  if (key === 'united-kingdom') return `UK ${noun}`
  return `${name}’s ${noun}`
}

// Parse a warhead-count value ("5,420", "1 796", "up to 80", "–", ". .") to an
// integer, or null if not a plain number. Used only for computed comparisons
// (share of the world total, ranking) — the figure itself always traces to a row.
export function toInt(value: string): number | null {
  const m = (value || '').replace(/[\s,]/g, '').match(/^\d+$/)
  return m ? parseInt(m[0], 10) : null
}
// Sum of the nine arsenals' FAS total inventories (= the world total, ~12,187).
export function worldTotalFas(): number {
  let sum = 0
  for (const k of COUNTRY_SLUGS) {
    const n = toInt(COUNTRIES[k].rows.find((r) => r.field === 'warheads.fas.total_inventory')?.value ?? '')
    if (n) sum += n
  }
  return sum
}

// Map a country page to the `country` string used in the weapons database, so a
// warhead yield only links to a weapon page when it is that country's own weapon
// (no misleading cross-country yield coincidences).
const BOMB_COUNTRY: Record<string, string> = {
  'united-states': 'USA', russia: 'USSR', china: 'China', 'united-kingdom': 'UK',
  france: 'France', india: 'India', pakistan: 'Pakistan', 'north-korea': 'North Korea',
}

export function weaponIdForYield(key: string, kt: number): string | undefined {
  const bc = BOMB_COUNTRY[key]
  if (!bc) return undefined
  return bombs.find((b) => b.id !== 'custom' && b.type !== 'conventional' && b.yield === kt && b.country === bc)?.id
}
