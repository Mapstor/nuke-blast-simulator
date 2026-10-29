import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// NBS-014 RETARGET. Run `npm run build` first — these read the prerendered HTML.
const APP = join(__dirname, '..', '.next', 'server', 'app')
const read = (p: string) => (existsSync(join(APP, p)) ? readFileSync(join(APP, p), 'utf8') : '')

// Every verified value from the chat-sourced fact set, joined for substring
// checks. A figure that is not in this string is not a verified fact.
const FACTS_CSV = readFileSync(join(__dirname, '..', 'research', 'retarget-facts-2026-10-28.csv'), 'utf8')
const verifiedValues = FACTS_CSV.split('\n')
  .filter((l) => /","verified","/.test(l) || l.includes('","verified",'))
  .join(' | ')

describe('every number added from retarget-facts resolves to a verified row', () => {
  // (built page, text rendered on it, substring of the verified fact value).
  // The figure must appear on the page AND trace to a verified row.
  const CASES: Array<{ page: string; rendered: string; fact: string }> = [
    // Hiroshima / Nagasaki
    { page: 'blog/hiroshima-nagasaki-80-years-of-data.html', rendered: '140,000', fact: '140,000' },
    { page: 'blog/hiroshima-nagasaki-80-years-of-data.html', rendered: '73,884', fact: '73,884' },
    { page: 'blog/hiroshima-nagasaki-80-years-of-data.html', rendered: '91,105', fact: '91,105' },
    { page: 'blog/hiroshima-nagasaki-80-years-of-data.html', rendered: '86.66', fact: '86.66' },
    { page: 'blog/hiroshima-nagasaki-80-years-of-data.html', rendered: '90,000', fact: '90,000-166,000' },
    // Nuclear explosion (four-kill)
    { page: 'blog/nuclear-explosion.html', rendered: '440 feet', fact: '440 ft' },
    { page: 'blog/nuclear-explosion.html', rendered: '5,700 feet', fact: '5,700 ft' },
    { page: 'blog/nuclear-explosion.html', rendered: '1,150 feet', fact: '1,150 ft' },
    { page: 'blog/nuclear-explosion.html', rendered: '400 km', fact: '400 km' },
    // Tsar Bomba article
    { page: 'blog/tsar-bomba-largest-test-ever.html', rendered: 'about 45 km', fact: 'about 45 km' },
    { page: 'blog/tsar-bomba-largest-test-ever.html', rendered: '10,500 m', fact: '10,500 m' },
    { page: 'blog/tsar-bomba-largest-test-ever.html', rendered: '1,000 km', fact: '1,000 km' },
    // Hydrogen bomb
    { page: 'glossary/hydrogen-bomb.html', rendered: '10.4 Mt', fact: '10.4 Mt' },
    { page: 'glossary/hydrogen-bomb.html', rendered: '400 kt', fact: '400 kt' },
    { page: 'glossary/hydrogen-bomb.html', rendered: '3.3 Mt', fact: '3.3 Mt' },
    { page: 'glossary/hydrogen-bomb.html', rendered: '2.6 Mt', fact: '2.6 Mt' },
    { page: 'glossary/hydrogen-bomb.html', rendered: 'about 43 kt', fact: 'about 43 KT' },
    // Weapon pages
    { page: 'weapons/little-boy.html', rendered: '8,900 lb', fact: '8,900 lb' },
    { page: 'weapons/fat-man.html', rendered: '10,300 lb', fact: '10,300 lb' },
    { page: 'weapons/fat-man.html', rendered: '11:02', fact: '11:02' },
    { page: 'weapons/tsar-bomba.html', rendered: '24.5', fact: '24.5-27.5' },
  ]

  it('each curated figure is rendered on its page', () => {
    const missing = CASES.filter((c) => !read(c.page).includes(c.rendered))
      .map((c) => `${c.page}: "${c.rendered}"`)
    expect(missing).toEqual([])
  })

  it('each curated figure traces to a verified fact value', () => {
    const unbacked = CASES.filter((c) => !verifiedValues.includes(c.fact))
      .map((c) => `"${c.fact}" (for "${c.rendered}")`)
    expect(unbacked).toEqual([])
  })
})

describe('four-kill page is retargeted to "nuclear explosion" with no "kill"', () => {
  const html = read('blog/nuclear-explosion.html')
  const grab = (re: RegExp) => (html.match(re)?.[1] ?? '')
  const title = grab(/<title>([^<]*)<\/title>/i)
  const h1 = grab(/<h1[^>]*>([^<]*)<\/h1>/i)
  const metaDesc = grab(/<meta name="description" content="([^"]*)"/i)
  const ogTitle = grab(/<meta property="og:title" content="([^"]*)"/i)
  const ogDesc = grab(/<meta property="og:description" content="([^"]*)"/i)

  it('the page built', () => {
    expect(html.length).toBeGreaterThan(0)
  })
  it('title, H1, meta description and OG text contain no "kill"', () => {
    for (const [name, v] of Object.entries({ title, h1, metaDesc, ogTitle, ogDesc })) {
      expect(`${name}: ${v}`.toLowerCase()).not.toMatch(/\bkill/)
    }
  })
  it('title and H1 carry the "nuclear explosion" primary', () => {
    expect(title.toLowerCase()).toContain('nuclear explosion')
    expect(h1.toLowerCase()).toContain('nuclear explosion')
  })
})

describe('Hiroshima article title carries the new primary keyword', () => {
  const html = read('blog/hiroshima-nagasaki-80-years-of-data.html')
  const title = (html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '').toLowerCase()
  it('contains every non-stopword token of "how many people died in hiroshima"', () => {
    for (const tok of ['many', 'people', 'died', 'hiroshima']) {
      expect(title).toContain(tok)
    }
  })
})
