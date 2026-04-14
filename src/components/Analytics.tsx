'use client'

import { useEffect } from 'react'

export default function Analytics() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Create and inject Google Analytics script
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-XDZQYKGTE2'
      document.head.appendChild(script1)
      
      // Create and inject gtag initialization script
      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XDZQYKGTE2');
      `
      document.head.appendChild(script2)
    }
  }, [])

  return null
}