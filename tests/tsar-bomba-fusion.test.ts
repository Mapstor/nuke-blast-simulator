import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// NBS-006 defect 4: the generic "roughly equal fission/fusion" energy split is
// misleading for Tsar Bomba (its lead tamper made it ~97% fusion). The weapon
// page must show the corrected figure (facts row 145), cited to the Nuclear
// Weapon Archive. Run `npm run build` before `npm test`.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const TSAR = join(APP, 'weapons', 'tsar-bomba.html')

describe('tsar-bomba fusion energy split', () => {
  it('has a prerendered /weapons/tsar-bomba page (run `next build` first)', () => {
    expect(existsSync(TSAR)).toBe(true)
  })

  it('states that ~97% of the energy came from fusion', () => {
    // Strip HTML comments (React split markers) first, per the
    // removed-strings.test.ts convention, and bind to the full claim rather than
    // the bare numeral — "97%" also appears in fallout contexts elsewhere.
    const html = readFileSync(TSAR, 'utf8').replace(/<!--[\s\S]*?-->/g, '')
    expect(html).toContain('97% of its energy came from fusion')
  })

  it('cites the Nuclear Weapon Archive Tsar Bomba source', () => {
    expect(readFileSync(TSAR, 'utf8')).toContain('Russia/TsarBomba.html')
  })
})
