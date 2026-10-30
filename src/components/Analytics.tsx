'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { pageviewPayload } from '@/lib/analytics/pageview'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XDZQYKGTE2'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function PageviewTracker() {
  const pathname = usePathname()

  // NBS-016: send the pathname only, never the query string (which carries the
  // weapon and coordinates). The effect depends on pathname alone, so a query-
  // only change (e.g. switching weapons on the map) is never reported to GA4.
  useEffect(() => {
    if (!pathname || typeof window === 'undefined' || typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', pageviewPayload(pathname, window.location.origin, document.title))
  }, [pathname])

  return null
}

export default function Analytics() {
  return (
    <>
      {/* Consent Mode v2 default — must run before gtag.js. analytics_storage
          starts 'denied' for EEA/UK/CH (Europe/* timezone heuristic) or any
          returning visitor who rejected; 'granted' elsewhere. No ads storage. */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          (function(){
            var tz=''; try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
            var eea=/^Europe\\//.test(tz);
            var stored=null; try{stored=localStorage.getItem('nbs-consent')}catch(e){}
            var analytics = stored ? (stored==='granted'?'granted':'denied') : (eea?'denied':'granted');
            gtag('consent','default',{
              ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
              analytics_storage: analytics
            });
          })();
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
      <PageviewTracker />
    </>
  )
}
