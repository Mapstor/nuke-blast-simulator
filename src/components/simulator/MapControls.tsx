'use client'

import { useCallback } from 'react'
import { useMap } from 'react-leaflet'
import { useSimulatorStore } from '@/store/simulatorStore'

export function MapControls() {
  const map = useMap()
  const epicenter = useSimulatorStore(state => state.epicenter)
  const setMapCenter = useSimulatorStore(state => state.setMapCenter)
  const setZoom = useSimulatorStore(state => state.setZoom)
  const reset = useSimulatorStore(state => state.reset)

  const handleZoomIn = useCallback(() => {
    if (epicenter) {
      // Zoom in while keeping epicenter centered
      const currentZoom = map.getZoom()
      const newZoom = currentZoom + 1
      map.setView([epicenter.lat, epicenter.lng], newZoom, {
        animate: true,
        duration: 0.25
      })
      setZoom(newZoom)
      setMapCenter({ lat: epicenter.lat, lng: epicenter.lng })
    } else {
      // No epicenter - use default zoom behavior
      const currentZoom = map.getZoom()
      const newZoom = currentZoom + 1
      map.setView(map.getCenter(), newZoom, {
        animate: true,
        duration: 0.25
      })
      setZoom(newZoom)
    }
  }, [epicenter, map, setZoom, setMapCenter])

  const handleZoomOut = useCallback(() => {
    if (epicenter) {
      // Zoom out while keeping epicenter centered
      const currentZoom = map.getZoom()
      const newZoom = currentZoom - 1
      map.setView([epicenter.lat, epicenter.lng], newZoom, {
        animate: true,
        duration: 0.25
      })
      setZoom(newZoom)
      setMapCenter({ lat: epicenter.lat, lng: epicenter.lng })
    } else {
      // No epicenter - use default zoom behavior
      const currentZoom = map.getZoom()
      const newZoom = currentZoom - 1
      map.setView(map.getCenter(), newZoom, {
        animate: true,
        duration: 0.25
      })
      setZoom(newZoom)
    }
  }, [epicenter, map, setZoom, setMapCenter])

  const handleCenter = useCallback(() => {
    if (epicenter) {
      map.setView([epicenter.lat, epicenter.lng], 12)
      setZoom(12)
      setMapCenter({ lat: epicenter.lat, lng: epicenter.lng })
    }
  }, [epicenter, map, setZoom, setMapCenter])

  const handleReset = () => {
    reset()
    map.setView([40.7128, -74.0060], 10)
  }

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="bg-white p-2 rounded shadow hover:bg-gray-100"
        title="Zoom in"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        onClick={handleZoomOut}
        className="bg-white p-2 rounded shadow hover:bg-gray-100"
        title="Zoom out"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      {epicenter && (
        <button
          onClick={handleCenter}
          className="bg-white p-2 rounded shadow hover:bg-gray-100"
          title="Center on blast"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10h4a1 1 0 011 1v4m-5-5l5 5m0 0v-4m0 4h-4M9 14H5a1 1 0 01-1-1V9m5 5l-5-5m0 0v4m0-4h4" />
          </svg>
        </button>
      )}
      <button
        onClick={handleReset}
        className="bg-red-500 text-white p-2 rounded shadow hover:bg-red-600"
        title="Reset all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}