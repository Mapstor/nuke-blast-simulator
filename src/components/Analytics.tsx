'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XDZQYKGTE2'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || typeof window === 'undefined' || typeof window.gtag !== 'function') return
    const query = searchParams?.toString()
    const url = pathname + (query ? `?${query}` : '')
    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

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
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  )
}
