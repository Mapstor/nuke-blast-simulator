'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Primary desktop nav: 7 highest-intent destinations.
// Other links live in the mobile drawer + the global footer's sitemap section.
const PRIMARY_NAV: Array<{ href: string; label: string }> = [
  { href: '/',          label: 'Simulator'  },
  { href: '/weapons',   label: 'Weapons'    },
  { href: '/examples',  label: 'Cities'     },
  { href: '/scenarios', label: 'Scenarios'  },
  { href: '/compare',   label: 'Compare'    },
  { href: '/glossary',  label: 'Glossary'   },
  { href: '/blog',      label: 'Blog'       },
]

const MOBILE_GROUPS: Array<{ heading: string; items: Array<{ href: string; label: string }> }> = [
  {
    heading: 'Tools',
    items: [
      { href: '/',          label: '🎯 Simulator' },
      { href: '/weapons',   label: '💣 Weapons Database' },
      { href: '/examples',  label: '🏙️ City Scenarios' },
      { href: '/scenarios', label: '☢️ Bomb-on-City Scenarios' },
      { href: '/compare',   label: '⚖️ Weapon Comparisons' },
    ],
  },
  {
    heading: 'Learn',
    items: [
      { href: '/blog',          label: '📰 Blog' },
      { href: '/glossary',      label: '📖 Glossary' },
      { href: '/how-it-works',  label: 'ℹ️ How It Works' },
      { href: '/methodology',   label: '🔬 Methodology' },
      { href: '/faq',           label: '❓ FAQ' },
    ],
  },
  {
    heading: 'About',
    items: [
      { href: '/about',     label: '📖 About' },
      { href: '/resources', label: '🕊️ Peace Resources' },
      { href: '/sources',   label: '📚 Data Sources' },
      { href: '/contact',   label: '📧 Contact' },
    ],
  },
]

export function MilitaryHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <header className="bg-gradient-to-b from-gray-900 to-black border-b-2 border-green-500/30 relative overflow-hidden">
      <div className="relative z-10 p-2 md:p-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Logo / title */}
            <Link href="/" aria-label="Nuke Blast Simulator — home" className="flex flex-col shrink-0 hover:opacity-80 transition">
              <p className="text-base md:text-xl lg:text-2xl font-bold text-green-400 terminal-font leading-tight">
                Nuke Blast Simulator
              </p>
              <p className="hidden md:block text-green-300 text-[10px] md:text-xs leading-tight">
                Interactive nuclear blast effects calculator
              </p>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-auto">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm text-green-400 hover:bg-green-400/10 hover:text-green-300 rounded transition whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-green-400 hover:bg-green-400/10 rounded transition shrink-0"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black border-b border-green-500/30 max-h-[calc(100vh-72px)] overflow-y-auto">
          <div className="px-4 py-3 space-y-5">
            {MOBILE_GROUPS.map((group) => (
              <div key={group.heading}>
                <p className="text-[11px] uppercase tracking-wider text-green-300/70 mb-2 px-3">
                  {group.heading}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
