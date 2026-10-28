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
export function isPipe(value: string): boolean {
  return value.includes('|') && value.includes('=')
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
