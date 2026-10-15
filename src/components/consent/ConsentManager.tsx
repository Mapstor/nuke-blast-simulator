'use client'

// NBS-003 interim consent. Google Consent Mode v2: analytics_storage defaults
// to 'denied' for EEA/UK/CH visitors (set in the beforeInteractive consent
// script in Analytics.tsx, using a timezone heuristic so no middleware/geo is
// needed). This component shows a minimal accept/reject banner to those
// visitors and applies their choice. Raptive's CMP replaces this on acceptance.

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'nbs-consent' // 'granted' | 'denied'
export const OPEN_CONSENT_EVENT = 'nbs-open-consent'

function europeTimezone(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    return /^Europe\//.test(tz)
  } catch {
    return true // fail safe: treat as consent-required
  }
}

function applyConsent(granted: boolean) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' })
  }
}

export function ConsentManager() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem(STORAGE_KEY) } catch { /* ignore */ }

    if (stored === 'granted') applyConsent(true)
    else if (stored === 'denied') applyConsent(false)
    else if (europeTimezone()) setOpen(true)
    // Non-EEA with no prior choice: default is 'granted' (set before GA loads);
    // no banner is shown.

    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen)
  }, [])

  const choose = useCallback((granted: boolean) => {
    try { localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied') } catch { /* ignore */ }
    applyConsent(granted)
    setOpen(false)
  }, [])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[2000] border-t border-green-500/40 bg-black/95 backdrop-blur px-4 py-4"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-green-300">
        <p className="flex-1">
          We use Google Analytics to understand overall traffic. Analytics cookies are off until you accept.
          See our{' '}
          <a href="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose(false)}
            className="px-4 py-2 rounded border border-green-500/50 text-green-300 hover:bg-green-500/10 transition"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="px-4 py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-600 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

// Footer control to re-open the consent choice.
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className={className || 'text-green-400 hover:text-green-300 hover:underline transition'}
    >
      Cookie settings
    </button>
  )
}
