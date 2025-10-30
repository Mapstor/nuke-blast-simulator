'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export function MapUpdater({ center, zoom }: { center?: [number, number], zoom?: number }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 12)
    }
  }, [center, zoom, map])

  return null
}