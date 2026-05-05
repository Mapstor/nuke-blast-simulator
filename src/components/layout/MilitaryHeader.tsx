'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MAIN_MENU, SIMULATOR_HREF, type MenuItem, type MenuPanel } from '@/lib/menu/main-menu'

const HOVER_CLOSE_DELAY_MS = 150

export function MilitaryHeader() {
  // Desktop dropdown state — id of the currently open panel, or null.
  const [openId, setOpenId] = useState<string | null>(null)
  // Mobile drawer + accordion state.
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null)

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  // ESC closes any open menu.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenId(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Click outside the header closes the desktop dropdown.
  useEffect(() => {
    if (!openId) return
    function onClick(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) setOpenId(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [openId])

  // Body scroll lock while mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileOpen])

  function openWithIntent(id: string) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setOpenId(id)
  }
  function scheduleClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setOpenId(null), HOVER_CLOSE_DELAY_MS)
  }
  function toggleClick(id: string) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setOpenId((prev) => (prev === id ? null : id))
  }

  const openPanel = openId ? MAIN_MENU.find((p) => p.id === openId) : null

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-gradient-to-b from-gray-900 to-black border-b border-green-500/30"
    >
      {/* ── Desktop top bar ──────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-between gap-4 px-6 py-3 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Nuke Blast Simulator — home"
          className="flex flex-col shrink-0 hover:opacity-80 transition"
        >
          <span className="text-xl xl:text-2xl font-bold text-green-400 terminal-font leading-tight">
            Nuke Blast Simulator
          </span>
          <span className="text-green-300 text-[11px] leading-tight">
            Interactive nuclear blast effects calculator
          </span>
        </Link>

        {/* Mega menu trigger row */}
        <nav aria-label="Primary" className="flex items-center gap-1">
          {MAIN_MENU.map((panel) => {
            const isOpen = openId === panel.id
            return (
              <button
                key={panel.id}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={`mega-${panel.id}`}
                onMouseEnter={() => openWithIntent(panel.id)}
                onMouseLeave={scheduleClose}
                onClick={() => toggleClick(panel.id)}
                onFocus={() => openWithIntent(panel.id)}
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded transition whitespace-nowrap ${
                  isOpen
                    ? 'text-green-300 bg-green-400/10'
                    : 'text-green-400 hover:bg-green-400/10 hover:text-green-300'
                }`}
              >
                {panel.label}
                <Chevron open={isOpen} />
              </button>
            )
          })}
        </nav>

        {/* CTA */}
        <Link
          href={SIMULATOR_HREF}
          className="shrink-0 inline-flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-400 transition"
        >
          🎯 Open Simulator
        </Link>
      </div>

      {/* ── Desktop dropdown panel ───────────────────────────────────── */}
      {openPanel && openPanel.columns ? (
        <div
          id={`mega-${openPanel.id}`}
          role="region"
          aria-label={`${openPanel.label} menu`}
          onMouseEnter={() => openWithIntent(openPanel.id)}
          onMouseLeave={scheduleClose}
          className="hidden lg:block absolute top-full left-0 right-0 bg-gradient-to-b from-gray-950 to-black border-b border-green-500/30 shadow-xl"
        >
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="grid grid-cols-3 gap-8">
              {openPanel.columns.map((col, i) => (
                <DropdownColumn key={i} heading={col.heading} items={col.items} onItemClick={() => setOpenId(null)} />
              ))}
            </div>
            {openPanel.panelFooter ? (
              <div className="mt-6 pt-4 border-t border-green-500/20">
                <Link
                  href={openPanel.panelFooter.href}
                  onClick={() => setOpenId(null)}
                  className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition"
                >
                  {openPanel.panelFooter.label}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ── Mobile top bar ───────────────────────────────────────────── */}
      <div className="lg:hidden flex items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          aria-label="Nuke Blast Simulator — home"
          className="flex flex-col shrink-0 hover:opacity-80 transition"
        >
          <span className="text-base font-bold text-green-400 terminal-font leading-tight">
            Nuke Blast Simulator
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={SIMULATOR_HREF}
            className="bg-green-500 text-black px-3 py-1.5 rounded text-xs font-semibold hover:bg-green-400 transition"
          >
            🎯 Open
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="p-2 text-green-400 hover:bg-green-400/10 rounded transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile drawer (accordion) ────────────────────────────────── */}
      {mobileOpen ? (
        <div className="lg:hidden fixed inset-0 top-[57px] z-40 bg-black flex flex-col">
          <div className="flex-1 overflow-y-auto pb-20 px-4 py-3">
            {MAIN_MENU.map((panel) => {
              const expanded = mobileExpandedId === panel.id
              return (
                <div key={panel.id} className="border-b border-green-500/20">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() =>
                      setMobileExpandedId((prev) => (prev === panel.id ? null : panel.id))
                    }
                    className="w-full flex items-center justify-between py-3 text-left text-green-400 hover:text-green-300"
                  >
                    <span className="text-base font-semibold">{panel.label}</span>
                    <Chevron open={expanded} />
                  </button>
                  {expanded && panel.columns ? (
                    <div className="pb-4 space-y-5">
                      {panel.columns.map((col, i) => (
                        <div key={i}>
                          <p className="text-[11px] uppercase tracking-wider text-green-300/70 mb-2">
                            {col.heading}
                          </p>
                          <ul className="space-y-1">
                            {col.items.map((item) => (
                              <li key={item.href + item.label}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center justify-between py-1.5 px-2 rounded text-sm text-green-300 hover:bg-green-400/10 hover:text-green-200 transition"
                                >
                                  <span>{item.label}</span>
                                  {item.meta ? (
                                    <span className="text-[11px] text-green-300/60 ml-2 shrink-0">{item.meta}</span>
                                  ) : null}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {panel.panelFooter ? (
                        <Link
                          href={panel.panelFooter.href}
                          onClick={() => setMobileOpen(false)}
                          className="inline-block mt-2 text-sm text-yellow-400 hover:underline"
                        >
                          {panel.panelFooter.label}
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          {/* Sticky bottom CTA */}
          <div className="border-t border-green-500/30 bg-black px-4 py-3">
            <Link
              href={SIMULATOR_HREF}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center bg-green-500 text-black px-4 py-3 rounded-md font-semibold hover:bg-green-400 transition"
            >
              🎯 Open Simulator
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DropdownColumn({
  heading,
  items,
  onItemClick,
}: {
  heading: string
  items: MenuItem[]
  onItemClick?: () => void
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-green-300/70 mb-3">{heading}</p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              onClick={onItemClick}
              className="group flex items-center justify-between py-1.5 px-2 -mx-2 rounded text-sm text-green-300 hover:bg-green-400/10 hover:text-green-200 transition"
            >
              <span className="truncate">{item.label}</span>
              {item.meta ? (
                <span className="text-[11px] text-green-300/60 ml-3 shrink-0 group-hover:text-green-300/80">
                  {item.meta}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
