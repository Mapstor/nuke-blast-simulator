import { Metadata } from 'next'
import './globals.css'
import './military-theme.css'
import './explosion.css'
import './bomb-cursor.css'
import './blast-animation.css'
import { MilitaryHeader } from '@/components/layout/MilitaryHeader'
import { Footer } from '@/components/layout/Footer'
import Analytics from '@/components/Analytics'
import { ConsentManager } from '@/components/consent/ConsentManager'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
  authorPersonSchema,
} from '@/lib/seo/schemas'

export const metadata: Metadata = {
  metadataBase: new URL('https://nukeblastsimulator.com'),
  // No title template: each page sets its own final <title> (<=60 chars) via
  // seoMetadata(); the brand lives in openGraph.siteName, not the title tag.
  title: 'Nuke Map: Interactive Nuclear Blast Radius Simulator',
  description: 'Interactive nuclear blast simulator. Calculate the fireball, blast radius, and thermal burn zones (air burst) for any location worldwide. Explore effects of Tsar Bomba, Little Boy, and modern nuclear weapons with real scientific data.',
  keywords: ['nuclear blast simulator', 'nuke simulator', 'blast radius calculator', 'atomic bomb simulator', 'nuclear weapon effects', 'tsar bomba simulator', 'nukemap alternative'],
  authors: [{ name: 'Marko Visic', url: 'https://nukeblastsimulator.com/about' }],
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
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚛️</text></svg>" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        <JsonLd
          id="ld-graph-root"
          schema={[organizationSchema, websiteSchema, softwareApplicationSchema, authorPersonSchema]}
        />
      </head>
      <body className="bg-gray-900 min-h-screen flex flex-col">
        <Analytics />
        <ConsentManager />
        <MilitaryHeader />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}