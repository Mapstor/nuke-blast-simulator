'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function MilitaryHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
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
          {/* Main header */}
          <div className="flex items-center justify-between">
            {/* Left spacer for balance */}
            <div className="flex-1 hidden md:block"></div>
            
            {/* Centered title */}
            <div className="flex flex-col items-center text-center">
              <Link href="/" className="hover:opacity-80 transition">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-green-400 terminal-font">
                  Nuke Blast Simulator
                </h1>
                <p className="hidden md:block text-green-300 text-xs md:text-sm">Interactive nuclear blast effects calculator</p>
              </Link>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 flex justify-end items-center gap-1">
              <div className="hidden md:flex items-center gap-2">
                <Link href="/" className="px-4 py-2 text-sm text-green-400 hover:bg-green-400/10 rounded transition">
                  Simulator
                </Link>
                <Link href="/about" className="px-4 py-2 text-sm text-green-400 hover:bg-green-400/10 rounded transition">
                  About
                </Link>
                <Link href="/weapons" className="px-4 py-2 text-sm text-green-400 hover:bg-green-400/10 rounded transition">
                  Weapons DB
                </Link>
                <Link href="/faq" className="px-4 py-2 text-sm text-green-400 hover:bg-green-400/10 rounded transition">
                  FAQ
                </Link>
                <Link href="/resources" className="px-4 py-2 text-sm text-green-400 hover:bg-green-400/10 rounded transition">
                  Resources
                </Link>
                <Link href="/methodology" className="px-4 py-2 text-sm text-green-400 hover:bg-green-400/10 rounded transition">
                  Methodology
                </Link>
                <Link href="/how-it-works" className="px-4 py-2 text-sm text-green-400 hover:bg-green-400/10 rounded transition">
                  How It Works
                </Link>
              </div>
              {/* Mobile hamburger menu */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-green-400 hover:bg-green-400/10 rounded transition"
                  aria-label="Toggle menu"
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
            </nav>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-green-500/30">
          <div className="px-4 py-2 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🎯 Simulator
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              📖 About
            </Link>
            <Link 
              href="/weapons" 
              className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              💣 Weapons DB
            </Link>
            <Link 
              href="/faq" 
              className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ❓ FAQ
            </Link>
            <Link 
              href="/resources" 
              className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🕊️ Peace Resources
            </Link>
            <Link 
              href="/methodology" 
              className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🔬 Methodology
            </Link>
            <Link 
              href="/how-it-works" 
              className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ℹ️ How It Works
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 text-green-400 hover:bg-green-400/10 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              📧 Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}