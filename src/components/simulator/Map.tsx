'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMapEvents, useMap } from 'react-leaflet'
import { useSimulatorStore } from '@/store/simulatorStore'
import { MapControls } from './MapControls'
import { TestOverlay } from './TestOverlay'
import { LeafletExplosionAnimation } from './LeafletExplosionAnimation'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom nuke icon for marker
const createNukeIcon = () => {
  if (typeof window === 'undefined') return null
  
  const nukeHtml = `
    <div style="
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 0, 0, 0.9);
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
      animation: nukePulse 2s infinite;
    ">
      <span style="font-size: 18px;">☢️</span>
    </div>
    <style>
      @keyframes nukePulse {
        0% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.8); transform: scale(1); }
        50% { box-shadow: 0 0 30px rgba(255, 0, 0, 1); transform: scale(1.1); }
        100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.8); transform: scale(1); }
      }
    </style>
  `
  
  return L.divIcon({
    html: nukeHtml,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    className: 'nuke-marker'
  })
}

function MapClickHandler() {
  const setEpicenter = useSimulatorStore(state => state.setEpicenter)
  const setMapCenter = useSimulatorStore(state => state.setMapCenter)
  const setZoom = useSimulatorStore(state => state.setZoom)
  const startExplosionSequence = useSimulatorStore(state => state.startExplosionSequence)
  const selectedBomb = useSimulatorStore(state => state.selectedBomb)
  const map = useMap()
  
  const handleMapClick = useCallback((e: any) => {
    // Set the epicenter with precise coordinates IMMEDIATELY
    const coords = {
      lat: Number(e.latlng.lat.toFixed(6)),
      lng: Number(e.latlng.lng.toFixed(6))
    }
    
    // Set epicenter FIRST - this preserves exact click coordinates
    setEpicenter(coords)
    
    // Update map center to track where user clicked
    setMapCenter(coords)
    
    // Then handle zoom and explosion if bomb is selected
    if (selectedBomb) {
      // Estimate the largest radius for zoom calculation
      const yield_kt = selectedBomb.yield
      const estimatedMaxRadius = Math.sqrt(yield_kt) * 3.5 // Rough estimate for outer damage zone
      const paddedRadius = estimatedMaxRadius * 1.25
      
      // Create bounds centered on the epicenter
      const bounds = L.latLngBounds([
        [coords.lat - (paddedRadius / 111), coords.lng - (paddedRadius / (111 * Math.cos(coords.lat * Math.PI / 180)))],
        [coords.lat + (paddedRadius / 111), coords.lng + (paddedRadius / (111 * Math.cos(coords.lat * Math.PI / 180)))]
      ])
      
      // Zoom to center the epicenter and show blast area
      map.flyToBounds(bounds, {
        duration: 0.8,
        padding: [50, 50],
        maxZoom: 14 // Don't zoom in too much
      })
      
      // Start explosion after zoom begins
      setTimeout(() => {
        startExplosionSequence()
      }, 400) // Wait for zoom to start
    }
  }, [setEpicenter, setMapCenter, selectedBomb, startExplosionSequence, map])
  
  useMapEvents({
    click: handleMapClick
  })
  
  return null
}

// Component to handle smart centering on zoom events
function ZoomCenterHandler() {
  const epicenter = useSimulatorStore(state => state.epicenter)
  const setMapCenter = useSimulatorStore(state => state.setMapCenter)
  const setZoom = useSimulatorStore(state => state.setZoom)
  const map = useMap()
  
  const handleZoomEnd = useCallback(() => {
    // Update zoom state
    setZoom(map.getZoom())
    
    // Only recenter if we have an epicenter and the map center is close to it
    if (epicenter) {
      const currentCenter = map.getCenter()
      const epicenterLatLng = L.latLng(epicenter.lat, epicenter.lng)
      const distance = currentCenter.distanceTo(epicenterLatLng)
      
      // If map center is within 5km of epicenter, keep it centered
      // This respects user panning - if they've panned far away, don't force center
      if (distance < 5000) {
        map.panTo([epicenter.lat, epicenter.lng], {
          animate: true,
          duration: 0.2
        })
        setMapCenter({ lat: epicenter.lat, lng: epicenter.lng })
      } else {
        // Update map center to current view
        setMapCenter({ lat: currentCenter.lat, lng: currentCenter.lng })
      }
    }
  }, [epicenter, setMapCenter, setZoom, map])
  
  const handleMoveEnd = useCallback(() => {
    // Update map center when user pans
    const currentCenter = map.getCenter()
    setMapCenter({ lat: currentCenter.lat, lng: currentCenter.lng })
  }, [setMapCenter, map])
  
  useMapEvents({
    zoomend: handleZoomEnd,
    moveend: handleMoveEnd
  })
  
  return null
}

// Component to handle zoom when detonation happens via button
function DetonationZoomHandler() {
  const epicenter = useSimulatorStore(state => state.epicenter)
  const selectedBomb = useSimulatorStore(state => state.selectedBomb)
  const isAnimating = useSimulatorStore(state => state.isAnimating)
  const setMapCenter = useSimulatorStore(state => state.setMapCenter)
  const map = useMap()
  const [hasZoomed, setHasZoomed] = useState(false)
  
  useEffect(() => {
    // Zoom when animation starts (detonation via button)
    if (isAnimating && epicenter && selectedBomb && !hasZoomed) {
      // Calculate expected blast radius
      const yield_kt = selectedBomb.yield
      const estimatedMaxRadius = Math.sqrt(yield_kt) * 3.5
      const paddedRadius = estimatedMaxRadius * 1.25
      
      // Create bounds centered on the epicenter
      const bounds = L.latLngBounds([
        [epicenter.lat - (paddedRadius / 111), epicenter.lng - (paddedRadius / (111 * Math.cos(epicenter.lat * Math.PI / 180)))],
        [epicenter.lat + (paddedRadius / 111), epicenter.lng + (paddedRadius / (111 * Math.cos(epicenter.lat * Math.PI / 180)))]
      ])
      
      // Zoom to show blast area
      map.flyToBounds(bounds, {
        duration: 0.8,
        padding: [50, 50],
        maxZoom: 14
      })
      
      // Update map center to epicenter
      setMapCenter({ lat: epicenter.lat, lng: epicenter.lng })
      setHasZoomed(true)
    }
    
    // Reset zoom flag when animation ends
    if (!isAnimating) {
      setHasZoomed(false)
    }
  }, [isAnimating, epicenter, selectedBomb, setMapCenter, map, hasZoomed])
  
  return null
}

export function Map() {
  const epicenter = useSimulatorStore(state => state.epicenter)
  const blastCircles = useSimulatorStore(state => state.blastCircles)
  const comparisonMode = useSimulatorStore(state => state.comparisonMode)
  const comparisonResults = useSimulatorStore(state => state.comparisonResults)
  const [mapKey, setMapKey] = useState(0)
  
  useEffect(() => {
    // Force a new map instance on mount to avoid container issues
    setMapKey(prev => prev + 1)
  }, [])
  
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        key={`map-${mapKey}`}
        center={[45.0, -30.0]}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={true}
        zoomSnap={0}
        zoomDelta={1}
        wheelPxPerZoomLevel={60}
        zoomAnimation={true}
        zoomAnimationThreshold={4}
        fadeAnimation={true}
        markerZoomAnimation={true}
        doubleClickZoom={true}
        touchZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapClickHandler />
        <ZoomCenterHandler />
        <DetonationZoomHandler />
        <MapControls />
        <TestOverlay />
        <LeafletExplosionAnimation />
        
        {epicenter && (
          <>
            <Marker 
              position={[epicenter.lat, epicenter.lng]}
              key={`marker-${epicenter.lat}-${epicenter.lng}`}
              icon={createNukeIcon()}
            />
            
            {/* Test circle - exactly 5km radius for verification */}
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={5000} // Exactly 5000 meters = 5km
              pathOptions={{ 
                color: '#00ff00', 
                fillColor: 'transparent', 
                weight: 2,
                dashArray: '10, 5'
              }}
              key={`test-5km-${epicenter.lat}-${epicenter.lng}`}
            />
          </>
        )}
        
        {blastCircles && epicenter && (
          <>
            {/* 2nd Degree Burns - Outermost circle */}
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={blastCircles.thermalRadiation.secondDegree.radius * 1000}
              pathOptions={{ 
                color: '#ff99ff', 
                fillColor: '#ff99ff', 
                fillOpacity: 0.15,
                weight: 3
              }}
              key={`thermal2nd-${epicenter.lat}-${epicenter.lng}-${blastCircles.thermalRadiation.secondDegree.radius}`}
            />
            
            {/* Light Blast Damage - Windows broken */}
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={blastCircles.airBlast.light.radius * 1000}
              pathOptions={{ 
                color: '#808080', 
                fillColor: '#808080', 
                fillOpacity: 0.2,
                weight: 3
              }}
              key={`light-${epicenter.lat}-${epicenter.lng}-${blastCircles.airBlast.light.radius}`}
            />
            
            {/* 3rd Degree Burns - Severe thermal burns */}
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={blastCircles.thermalRadiation.thirdDegree.radius * 1000}
              pathOptions={{ 
                color: '#ff00ff', 
                fillColor: '#ff00ff', 
                fillOpacity: 0.25,
                weight: 3
              }}
              key={`thermal3rd-${epicenter.lat}-${epicenter.lng}-${blastCircles.thermalRadiation.thirdDegree.radius}`}
            />
            
            {/* Moderate Blast Damage - Buildings damaged */}
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={blastCircles.airBlast.moderate.radius * 1000}
              pathOptions={{ 
                color: '#ff8800', 
                fillColor: '#ff8800', 
                fillOpacity: 0.3,
                weight: 3
              }}
              key={`moderate-${epicenter.lat}-${epicenter.lng}-${blastCircles.airBlast.moderate.radius}`}
            />
            
            {/* Severe Blast Damage - Heavy building destruction */}
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={blastCircles.airBlast.severe.radius * 1000}
              pathOptions={{ 
                color: '#ff0000', 
                fillColor: '#ff0000', 
                fillOpacity: 0.35,
                weight: 3
              }}
              key={`severe-${epicenter.lat}-${epicenter.lng}-${blastCircles.airBlast.severe.radius}`}
            />
            
            {/* Fireball - Complete vaporization zone - Innermost */}
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={blastCircles.fireball.radius * 1000}
              pathOptions={{ 
                color: '#ffff00', 
                fillColor: '#ffff00', 
                fillOpacity: 0.5,
                weight: 3
              }}
              key={`fireball-${epicenter.lat}-${epicenter.lng}-${blastCircles.fireball.radius}`}
            />
          </>
        )}
        
        {/* Comparison circles */}
        {comparisonMode && comparisonResults && epicenter && (
          <>
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={comparisonResults.fireball.radius * 1000}
              pathOptions={{ color: '#00ff00', fillColor: '#00ff00', fillOpacity: 0.6, weight: 3, dashArray: '8, 4' }}
            />
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={comparisonResults.airBlast.moderate.radius * 1000}
              pathOptions={{ color: '#00cc00', fillColor: '#00cc00', fillOpacity: 0.4, weight: 3, dashArray: '8, 4' }}
            />
            <Circle
              center={[epicenter.lat, epicenter.lng]}
              radius={comparisonResults.airBlast.light.radius * 1000}
              pathOptions={{ color: '#009900', fillColor: '#009900', fillOpacity: 0.3, weight: 3, dashArray: '8, 4' }}
            />
          </>
        )}
      </MapContainer>
    </div>
  )
}