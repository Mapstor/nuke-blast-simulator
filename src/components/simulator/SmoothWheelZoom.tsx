'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export function SmoothWheelZoom() {
  const map = useMap()
  
  useEffect(() => {
    // Disable default scroll wheel zoom
    map.scrollWheelZoom.disable()
    
    let targetZoom = map.getZoom()
    let currentZoom = targetZoom
    let animationFrame: number | null = null
    
    const smoothZoom = () => {
      const diff = targetZoom - currentZoom
      
      if (Math.abs(diff) > 0.01) {
        // Smooth interpolation
        currentZoom += diff * 0.15 // Adjust this value for smoothness (0.1 = smoother, 0.3 = faster)
        map.setZoom(currentZoom, { animate: false })
        animationFrame = requestAnimationFrame(smoothZoom)
      } else {
        currentZoom = targetZoom
        map.setZoom(currentZoom, { animate: false })
      }
    }
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Calculate zoom delta based on wheel delta
      const delta = e.deltaY > 0 ? -0.2 : 0.2 // Smaller increments for smoother zoom
      
      // Update target zoom
      const newZoom = targetZoom + delta
      const minZoom = map.getMinZoom()
      const maxZoom = map.getMaxZoom()
      
      targetZoom = Math.max(minZoom, Math.min(maxZoom, newZoom))
      
      // Start smooth zoom animation if not already running
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(smoothZoom)
      }
    }
    
    // Add wheel event listener to map container
    const mapContainer = map.getContainer()
    mapContainer.addEventListener('wheel', handleWheel, { passive: false })
    
    // Cleanup
    return () => {
      mapContainer.removeEventListener('wheel', handleWheel)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      map.scrollWheelZoom.enable()
    }
  }, [map])
  
  return null
}