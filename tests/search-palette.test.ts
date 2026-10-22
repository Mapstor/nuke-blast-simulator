import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// NBS-007 item 1: the search palette overlay must render OUTSIDE the <header>.
// SearchPalette is mounted by MilitaryHeader inside the transform-carrying
// <header>, and a position:fixed overlay there is clipped to the header (the
// same containing-block bug the mobile drawer had). The fix portals the overlay
// to document.body. This also guards the placeholder: it must no longer claim a
// hard-coded "400" page count or mention "scenarios" (the site has ~250 pages
// and no scenarios).
const SRC = readFileSync(
  join(__dirname, '..', 'src', 'components', 'search', 'SearchPalette.tsx'),
  'utf8',
)

const OVERLAY = 'data-testid="search-palette"'

describe('search palette renders outside <header>', () => {
  it('the overlay element exists', () => {
    expect(SRC).toContain(OVERLAY)
  })

  it('portals to document.body (escapes the transformed header containing block)', () => {
    expect(SRC).toMatch(/import\s*\{[^}]*\bcreatePortal\b[^}]*\}\s*from\s*['"]react-dom['"]/)
    expect(SRC).toMatch(/createPortal\([\s\S]*?,\s*document\.body\s*,?\s*\)/)
  })

  it('placeholder has no hard-coded "400" and no "scenarios", and renders the real index size', () => {
    const line = SRC.split('\n').find((l) => l.includes('placeholder=')) ?? ''
    expect(line).not.toBe('')
    expect(line).not.toContain('400')
    expect(line).not.toContain('scenarios')
    expect(line).toContain('SEARCH_INDEX.length')
  })
})
