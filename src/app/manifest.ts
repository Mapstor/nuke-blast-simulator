import type { MetadataRoute } from 'next'

// NBS-015 (raptive-ready trust frame): a web app manifest so the site is an
// installable PWA with a defined name, theme and icons. Next App Router serves
// this at /manifest.webmanifest and injects the <link rel="manifest"> tag. The
// existing SVG favicons (public/icon.svg, public/favicon.svg) are reused.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nuke Blast Simulator',
    short_name: 'Nuke Blast',
    description:
      'Free interactive nuclear blast simulator: the fireball, blast and thermal-burn radii of any nuclear weapon on any city, from published Glasstone & Dolan scaling laws.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#22c55e',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
