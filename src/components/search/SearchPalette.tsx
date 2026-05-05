'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { search, type SearchEntry } from '@/lib/search'

const SECTION_LABEL: Record<SearchEntry['section'], string> = {
  page: 'Page',
  weapon: 'Weapon',
  city: 'City',
  scenario: 'Scenario',
  compare: 'Compare',
  glossary: 'Glossary',
  article: 'Article',
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const results = useMemo(() => search(query, 12), [query])

  // Auto-focus input when opened.
  useEffect(() => {
    if (open) {
      // Wait one frame so the element is mounted and focusable.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Reset state when closed.
  useEffect(() => {
    if (!open) {
      setQuery('')
      setHighlight(0)
    }
  }, [open])

  // Reset highlight when query changes.
  useEffect(() => {
    setHighlight(0)
  }, [query])

  // Body scroll lock while open.
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Keyboard nav inside the palette.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlight((h) => Math.min(h + 1, Math.max(results.length - 1, 0)))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlight((h) => Math.max(h - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const target = results[highlight]
        if (target) {
          onClose()
          router.push(target.url)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, highlight, onClose, router])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="bg-gray-900 border border-green-500/40 rounded-lg w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-green-500/30">
          <svg className="w-5 h-5 text-green-300/60 ml-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 400 pages — weapons, cities, scenarios, articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent px-4 py-4 text-green-300 placeholder-green-300/40 outline-none text-base"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-4 text-green-300/60 hover:text-green-300 text-xs"
            aria-label="Close search"
          >
            ESC
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!query && (
            <div className="px-5 py-8 text-center text-green-300/60 text-sm">
              Search anywhere on the site. Try &quot;tsar bomba&quot;, &quot;new york&quot;, &quot;fallout&quot;, or &quot;Hiroshima&quot;.
            </div>
          )}
          {query && results.length === 0 && (
            <div className="px-5 py-8 text-center text-green-300/70 text-sm">
              No results for &quot;{query}&quot;.
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={r.url}
              type="button"
              onClick={() => {
                onClose()
                router.push(r.url)
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`block w-full text-left px-5 py-3 border-b border-green-500/10 transition ${
                i === highlight ? 'bg-green-400/10' : 'hover:bg-green-400/5'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className={`font-semibold truncate ${i === highlight ? 'text-yellow-300' : 'text-yellow-400'}`}>
                  {r.title}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-green-300/60 shrink-0">
                  {SECTION_LABEL[r.section]}
                </span>
              </div>
              <div className="text-xs text-green-300/80 line-clamp-2 mt-0.5">{r.description}</div>
              <div className="text-[10px] text-green-300/50 mt-0.5 truncate">{r.url}</div>
            </button>
          ))}
        </div>

        <div className="px-5 py-2 border-t border-green-500/20 text-[11px] text-green-300/60 flex justify-between">
          <span>↑↓ navigate · ↵ select · ESC close</span>
          <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  )
}
