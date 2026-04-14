import { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import './military-theme.css'
import './explosion.css'
import './bomb-cursor.css'
import './blast-animation.css'
import { MilitaryHeader } from '@/components/layout/MilitaryHeader'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://nukeblastsimulator.com'),
  title: {
    default: 'Nuclear Blast Simulator - Interactive Nuke Map | NukeBlastSimulator.com',
    template: '%s | NukeBlastSimulator.com'
  },
  description: 'Interactive nuclear blast simulator. Calculate blast radius, casualties, and fallout zones for any location worldwide. Explore effects of Tsar Bomba, Little Boy, and modern nuclear weapons with real scientific data.',
  keywords: ['nuclear blast simulator', 'nuke simulator', 'blast radius calculator', 'atomic bomb simulator', 'nuclear weapon effects', 'tsar bomba simulator', 'nukemap alternative'],
  authors: [{ name: 'NukeBlastSimulator.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nukeblastsimulator.com',
    siteName: 'NukeBlastSimulator.com',
    title: 'Nuclear Blast Simulator - Interactive Nuke Map',
    description: 'Interactive nuclear blast simulator with real scientific data. Calculate blast effects for any location.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NukeBlastSimulator.com - Nuclear Blast Effects Map'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuclear Blast Simulator - Interactive Nuke Map',
    description: 'Interactive nuclear blast simulator with real scientific data',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'ADD_AFTER_GSC_SETUP'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚛️</text></svg>" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Nuclear Blast Simulator",
              "url": "https://nukeblastsimulator.com",
              "description": "Interactive nuclear blast simulator. Calculate blast radius, casualties, and fallout zones for any location worldwide with real scientific data.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "author": {
                "@type": "Organization",
                "name": "NukeBlastSimulator.com",
                "email": "info@nukeblastsimulator.com"
              },
              "keywords": "nuclear blast simulator, blast radius calculator, atomic bomb simulator, nuclear weapon effects, educational tool",
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "educationalUse": "Nuclear disarmament education and awareness",
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student"
              }
            })
          }}
        />
      </head>
      <body className="bg-gray-900 min-h-screen">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <MilitaryHeader />
        {children}
      </body>
    </html>
  )
}