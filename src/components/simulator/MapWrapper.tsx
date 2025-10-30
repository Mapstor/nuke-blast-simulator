'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { NuclearExplosion } from './NuclearExplosion'
import { useSimulatorStore } from '@/store/simulatorStore'

const MapComponent = dynamic(
  () => import('./MapboxMap').then((mod) => mod.MapboxMap),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-900 animate-pulse flex items-center justify-center">
      <div className="text-green-400">Loading interactive map...</div>
    </div>
  }
)

export function MapWrapper({ mapCenter }: { mapCenter?: [number, number] }) {
  const [isMounted, setIsMounted] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [explosion, setExplosion] = useState<{ x: number; y: number } | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const explosionTriggeredRef = useRef(false)
  const isAnimating = useSimulatorStore(state => state.isAnimating)
  const epicenter = useSimulatorStore(state => state.epicenter)

  useEffect(() => {
    setIsMounted(true)
    
    // Add error boundary for map loading
    const handleError = (event: any) => {
      console.error('Map loading error:', event)
      setMapError(true)
    }
    
    window.addEventListener('error', handleError)
    
    return () => {
      setIsMounted(false)
      window.removeEventListener('error', handleError)
    }
  }, [])

  // Listen for explosion trigger from store
  useEffect(() => {
    if (isAnimating && !explosionTriggeredRef.current) {
      explosionTriggeredRef.current = true
      // Note: Explosion animation is now handled by LeafletExplosionAnimation component
      // which uses geographic coordinates instead of screen coordinates
    }
    
    // Reset flag when animation ends
    if (!isAnimating && explosionTriggeredRef.current) {
      explosionTriggeredRef.current = false
    }
  }, [isAnimating])

  if (!isMounted) {
    return <div className="h-full w-full bg-gray-900 animate-pulse flex items-center justify-center">
      <div className="text-green-400">Initializing map...</div>
    </div>
  }
  
  if (mapError) {
    return <div className="h-full w-full bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 mb-2">Map failed to load</div>
        <button 
          onClick={() => { setMapError(false); window.location.reload() }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Reload
        </button>
      </div>
    </div>
  }

  // Debug info for mobile
  if (typeof window !== 'undefined') {
    console.log('MapWrapper mounted, window dimensions:', window.innerWidth, 'x', window.innerHeight)
    console.log('Container element:', mapContainerRef.current)
  }

  return (
    <div 
      ref={mapContainerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ minHeight: '300px' }}
    >
      <div className="absolute inset-0">
        <MapComponent />
      </div>
      {/* Explosion animation is now handled within the Map component using LeafletExplosionAnimation */}
    </div>
  )
}