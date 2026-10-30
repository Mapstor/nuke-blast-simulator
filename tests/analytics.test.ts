import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pageviewPayload } from '../src/lib/analytics/pageview'

// NBS-016: the GA4 page_view must carry only the pathname. The share URL encodes
// the chosen weapon and the map coordinates in the query string, so a leaked
// query would send a reader's weapon and target location to Google Analytics.
describe('GA4 pageview payload sends the pathname only (NBS-016)', () => {
  it('drops the query string from page_path and page_location', () => {
    const p = pageviewPayload('/weapons/little-boy', 'https://nukeblastsimulator.com', 'Little Boy')
    expect(p.page_path).toBe('/weapons/little-boy')
    expect(p.page_location).toBe('https://nukeblastsimulator.com/weapons/little-boy')
  })

  it('never carries a weapon or coordinates even if a query/href is passed in', () => {
    // Simulates the home map state the share URL encodes.
    const p = pageviewPayload('/?bomb=tsar-bomba&lat=40.7128&lng=-74.0060', 'https://nukeblastsimulator.com', 'Nuke Map')
    for (const v of [p.page_path, p.page_location]) {
      expect(v).not.toContain('?')
      expect(v).not.toContain('bomb=')
      expect(v).not.toContain('lat=')
      expect(v).not.toContain('lng=')
    }
    expect(p.page_path).toBe('/')
  })

  it('the Analytics component sends pageviewPayload and does not read searchParams', () => {
    const src = readFileSync(join(__dirname, '..', 'src', 'components', 'Analytics.tsx'), 'utf8')
    expect(src).toContain('pageviewPayload(')
    expect(src).not.toContain('useSearchParams')
    // The page_view call must not hand-build a URL carrying the query string.
    expect(src).not.toContain('window.location.href')
  })
})
