'use client'

import { useSimulatorStore } from '@/store/simulatorStore'
import { useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'

export function TestOverlay() {
  const epicenter = useSimulatorStore(state => state.epicenter)
  const mapCenter = useSimulatorStore(state => state.mapCenter)
  const zoom = useSimulatorStore(state => state.zoom)
  const map = useMap()
  const [realTimeMapCenter, setRealTimeMapCenter] = useState({ lat: 0, lng: 0 })
  const [realTimeZoom, setRealTimeZoom] = useState(0)
  
  useEffect(() => {
    const updateRealTimeData = () => {
      const center = map.getCenter()
      setRealTimeMapCenter({ lat: center.lat, lng: center.lng })
      setRealTimeZoom(map.getZoom())
    }
    
    map.on('move', updateRealTimeData)
    map.on('zoom', updateRealTimeData)
    updateRealTimeData() // Initial update
    
    return () => {
      map.off('move', updateRealTimeData)
      map.off('zoom', updateRealTimeData)
    }
  }, [map])
  
  // Calculate distance between epicenter and map center
  const calculateDistance = (point1: {lat: number, lng: number}, point2: {lat: number, lng: number}) => {
    if (!point1 || !point2) return 0
    
    const R = 6371 // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  const distance = epicenter ? calculateDistance(epicenter, realTimeMapCenter) : 0
  
  return (
    <div className="absolute top-4 left-4 z-20 bg-black bg-opacity-80 text-white p-4 rounded-lg font-mono text-sm max-w-md">
      <h3 className="text-lg font-bold mb-3 text-yellow-400">🧪 STATE TEST PANEL</h3>
      
      <div className="space-y-2">
        <div className="border-b border-gray-600 pb-2">
          <h4 className="font-semibold text-green-400">Epicenter (Blast Location)</h4>
          {epicenter ? (
            <div>
              <div>Lat: {epicenter.lat.toFixed(6)}</div>
              <div>Lng: {epicenter.lng.toFixed(6)}</div>
            </div>
          ) : (
            <div className="text-gray-400">No epicenter set</div>
          )}
        </div>
        
        <div className="border-b border-gray-600 pb-2">
          <h4 className="font-semibold text-blue-400">Store Map Center</h4>
          <div>Lat: {mapCenter.lat.toFixed(6)}</div>
          <div>Lng: {mapCenter.lng.toFixed(6)}</div>
        </div>
        
        <div className="border-b border-gray-600 pb-2">
          <h4 className="font-semibold text-purple-400">Real-Time Map Center</h4>
          <div>Lat: {realTimeMapCenter.lat.toFixed(6)}</div>
          <div>Lng: {realTimeMapCenter.lng.toFixed(6)}</div>
        </div>
        
        <div className="border-b border-gray-600 pb-2">
          <h4 className="font-semibold text-orange-400">Zoom Levels</h4>
          <div>Store Zoom: {zoom.toFixed(2)}</div>
          <div>Real-Time Zoom: {realTimeZoom.toFixed(2)}</div>
        </div>
        
        <div>
          <h4 className="font-semibold text-red-400">Distance Analysis</h4>
          <div>Epicenter ↔ Map Center: {distance.toFixed(2)} km</div>
          {distance > 5 && (
            <div className="text-yellow-300 text-xs mt-1">
              ⚠️ Map center has drifted from epicenter
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-600">
        <h4 className="font-semibold text-cyan-400 mb-2">Test Targets</h4>
        <div className="text-xs space-y-1">
          <div>NYC: 40.7128, -74.0060</div>
          <div>London: 51.5074, -0.1278</div>
          <div>Tokyo: 35.6762, 139.6503</div>
        </div>
      </div>
    </div>
  )
}