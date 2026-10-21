import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// NBS-006 defect 1: the mobile menu drawer must render OUTSIDE the <header>. The
// header always carries a transform (hide-on-scroll translate-y), which becomes
// the containing block for its position:fixed children and clipped the old
// in-header drawer to a few pixels. The fix portals the drawer to document.body,
// so its markup must not live inside the <header> element.
const SRC = readFileSync(
  join(__dirname, '..', 'src', 'components', 'layout', 'MilitaryHeader.tsx'),
  'utf8',
)

// The drawer root carries this attribute; the header's menu button only
// references the bare id via aria-controls, so this marker is unambiguous.
const DRAWER = 'data-testid="mobile-menu-drawer"'

describe('mobile drawer renders outside <header>', () => {
  it('the drawer element exists', () => {
    expect(SRC).toContain(DRAWER)
  })

  it('the drawer is not rendered inside the <header> element', () => {
    const start = SRC.indexOf('<header')
    const end = SRC.indexOf('</header>')
    expect(start).toBeGreaterThanOrEqual(0)
    expect(end).toBeGreaterThan(start)
    const headerBlock = SRC.slice(start, end + '</header>'.length)
    expect(headerBlock).not.toContain(DRAWER)
  })

  it('portals the drawer with createPortal from react-dom', () => {
    expect(SRC).toMatch(/import\s*\{[^}]*\bcreatePortal\b[^}]*\}\s*from\s*['"]react-dom['"]/)
    expect(SRC).toMatch(/createPortal\s*\(/)
  })

  it('portals to document.body (escapes the transformed header containing block)', () => {
    // The essence of the fix is the portal TARGET. A regression that portaled
    // the drawer back into a transformed node (e.g. headerRef.current) would
    // still pass every check above, yet re-introduce the clipping bug.
    expect(SRC).toMatch(/createPortal\([\s\S]*?,\s*document\.body\s*,?\s*\)/)
  })
})
