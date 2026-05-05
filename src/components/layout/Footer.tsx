'use client'

import Link from 'next/link'

const FOOTER_GROUPS: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
  {
    heading: 'Tools',
    links: [
      { href: '/',          label: 'Simulator' },
      { href: '/weapons',   label: 'Weapons Database' },
      { href: '/examples',  label: 'City Scenarios' },
      { href: '/scenarios', label: 'Bomb-on-City Scenarios' },
      { href: '/compare',   label: 'Weapon Comparisons' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { href: '/blog',          label: 'Blog' },
      { href: '/glossary',      label: 'Glossary' },
      { href: '/how-it-works',  label: 'How It Works' },
      { href: '/methodology',   label: 'Methodology' },
      { href: '/faq',           label: 'FAQ' },
    ],
  },
  {
    heading: 'About',
    links: [
      { href: '/about',     label: 'About' },
      { href: '/resources', label: 'Peace Resources' },
      { href: '/sources',   label: 'Data Sources' },
      { href: '/contact',   label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/terms',   label: 'Terms of Service' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 border-t border-green-500/30 px-4 py-8 text-sm text-gray-300" style={{ marginTop: '40px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Sitemap grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="text-xs uppercase tracking-wider text-green-300/70 mb-3">{group.heading}</p>
              <ul className="space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-green-400 hover:text-green-300 hover:underline transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-400 pt-6 border-t border-green-500/20 space-y-2">
          <p>
            ⚠️ <strong className="text-yellow-400">EDUCATIONAL PURPOSE ONLY</strong> — this simulator is designed for
            educational awareness about nuclear weapons effects. Not intended for planning actual attacks.
          </p>
          <p>
            Data based on declassified research and published scientific studies (Glasstone &amp; Dolan, FAS, SIPRI, NTI). Created
            to promote understanding of nuclear weapons consequences and support nuclear disarmament education.
          </p>
          <p className="text-gray-500 mt-3">
            © {year} NukeBlastSimulator.com · 400+ pages · Free to use for educational and research purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
