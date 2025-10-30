'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Map, { Source, Layer, Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox'
import mapboxgl from 'mapbox-gl'
import { useSimulatorStore } from '@/store/simulatorStore'
import 'mapbox-gl/dist/mapbox-gl.css'

// Ensure Mapbox token is set
if (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
} else {
  console.error('Mapbox token missing!')
}

export function MapboxMap() {
  const mapRef = useRef<any>(null)
  const [viewState, setViewState] = useState({
    longitude: -98.5795,  // Center of USA (Kansas)
    latitude: 39.8283,    // Center of USA (Kansas)
    zoom: 3.5,            // Zoom level to show entire continental USA
    bearing: 0,
    pitch: 0
  })
  
  const epicenter = useSimulatorStore(state => state.epicenter)
  const blastCircles = useSimulatorStore(state => state.blastCircles)
  const setEpicenter = useSimulatorStore(state => state.setEpicenter)
  const setMapCenter = useSimulatorStore(state => state.setMapCenter)
  const setZoom = useSimulatorStore(state => state.setZoom)
  const selectedBomb = useSimulatorStore(state => state.selectedBomb)
  const startExplosionSequence = useSimulatorStore(state => state.startExplosionSequence)
  const isAnimating = useSimulatorStore(state => state.isAnimating)
  const animationPhase = useSimulatorStore(state => state.animationPhase)
  
  // Handle map clicks
  const handleClick = useCallback((event: any) => {
    const coords = {
      lat: Number(event.lngLat.lat.toFixed(6)),
      lng: Number(event.lngLat.lng.toFixed(6))
    }
    
    // Set epicenter
    setEpicenter(coords)
    setMapCenter(coords)
    
    // Zoom to show blast if bomb is selected
    if (selectedBomb) {
      const yield_kt = selectedBomb.yield
      const estimatedMaxRadius = Math.sqrt(yield_kt) * 3.5
      
      // Calculate appropriate zoom level based on blast radius
      // Mapbox zoom levels: higher number = more zoomed in
      let targetZoom = 14
      if (estimatedMaxRadius > 50) targetZoom = 10
      else if (estimatedMaxRadius > 20) targetZoom = 11
      else if (estimatedMaxRadius > 10) targetZoom = 12
      else if (estimatedMaxRadius > 5) targetZoom = 13
      
      // Animate to epicenter with appropriate zoom
      mapRef.current?.flyTo({
        center: [coords.lng, coords.lat],
        zoom: targetZoom,
        duration: 1500,
        essential: true
      })
      
      // Start explosion after fly animation begins
      setTimeout(() => {
        startExplosionSequence()
      }, 400)
    }
  }, [selectedBomb, setEpicenter, setMapCenter, startExplosionSequence])
  
  // Create circle data for blast effects
  const createCircleGeoJSON = (center: { lat: number; lng: number }, radiusKm: number) => {
    const points = 64
    const distanceX = radiusKm / (111.32 * Math.cos(center.lat * Math.PI / 180))
    const distanceY = radiusKm / 110.574
    
    const coords = []
    for (let i = 0; i <= points; i++) {
      const theta = (i / points) * Math.PI * 2
      coords.push([
        center.lng + distanceX * Math.cos(theta),
        center.lat + distanceY * Math.sin(theta)
      ])
    }
    
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coords]
      },
      properties: {}
    }
  }
  
  // Flash effect and mushroom cloud for explosion
  useEffect(() => {
    if (isAnimating && epicenter) {
      // White flash
      const flash = document.createElement('div')
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: white;
        z-index: 9999;
        pointer-events: none;
        animation: flashFade 0.3s ease-out forwards;
      `
      
      if (!document.querySelector('#flash-style')) {
        const style = document.createElement('style')
        style.id = 'flash-style'
        style.textContent = `
          @keyframes flashFade {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `
        document.head.appendChild(style)
      }
      
      document.body.appendChild(flash)
      
      // Remove flash after animation
      setTimeout(() => {
        flash.remove()
      }, 300)
    }
  }, [isAnimating, epicenter])
  
  // Add custom cursor styles
  useEffect(() => {
    if (!document.querySelector('#bomb-cursor-style')) {
      const style = document.createElement('style')
      style.id = 'bomb-cursor-style'
      style.textContent = `
        .mapboxgl-canvas-container.mapboxgl-interactive {
          cursor: ${selectedBomb ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="16" y="24" font-size="24" text-anchor="middle" fill="red">💣</text></svg>') 16 16, crosshair` : 'grab'} !important;
        }
        .mapboxgl-canvas-container.mapboxgl-interactive:active {
          cursor: ${selectedBomb ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="16" y="24" font-size="24" text-anchor="middle" fill="red">💣</text></svg>') 16 16, crosshair` : 'grabbing'} !important;
        }
      `
      document.head.appendChild(style)
    }
    
    return () => {
      const style = document.querySelector('#bomb-cursor-style')
      if (style) {
        style.textContent = `
          .mapboxgl-canvas-container.mapboxgl-interactive {
            cursor: ${selectedBomb ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="16" y="24" font-size="24" text-anchor="middle" fill="red">💣</text></svg>') 16 16, crosshair` : 'grab'} !important;
          }
          .mapboxgl-canvas-container.mapboxgl-interactive:active {
            cursor: ${selectedBomb ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="16" y="24" font-size="24" text-anchor="middle" fill="red">💣</text></svg>') 16 16, crosshair` : 'grabbing'} !important;
          }
        `
      }
    }
  }, [selectedBomb])
  
  // Determine opacity based on animation phase
  const getCircleOpacity = (circleType: string) => {
    if (!isAnimating) {
      // Show all circles when not animating
      switch(circleType) {
        case 'fireball': return 0.6
        case 'severe': return 0.5
        case 'moderate': return 0.4
        case 'light': return 0.3
        case 'thermal3rd': return 0.4
        case 'thermal2nd': return 0.3
        default: return 0
      }
    }
    
    // During animation, show based on phase
    switch(animationPhase) {
      case 'showing-fireball':
        return circleType === 'fireball' ? 0.6 : 0
      case 'showing-heavy-blast':
        return circleType === 'fireball' ? 0.6 : 
               circleType === 'severe' ? 0.5 : 0
      case 'showing-moderate-blast':
        return circleType === 'fireball' ? 0.6 : 
               circleType === 'severe' ? 0.5 :
               circleType === 'moderate' ? 0.4 : 0
      case 'showing-light-blast':
        return circleType === 'fireball' ? 0.6 : 
               circleType === 'severe' ? 0.5 :
               circleType === 'moderate' ? 0.4 :
               circleType === 'light' ? 0.3 : 0
      case 'showing-thermal':
      case 'showing-fallout':
      case 'complete':
        switch(circleType) {
          case 'fireball': return 0.6
          case 'severe': return 0.5
          case 'moderate': return 0.4
          case 'light': return 0.3
          case 'thermal3rd': return 0.4
          case 'thermal2nd': return 0.3
          default: return 0
        }
      default:
        return 0
    }
  }
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '300px' }}>
      <Map
      ref={mapRef}
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onClick={handleClick}
      mapStyle="mapbox://styles/mapbox/standard"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      style={{ width: '100%', height: '100%' }}
      cursor={selectedBomb ? 'crosshair' : 'grab'}
      reuseMaps
      maxZoom={20}
      minZoom={2}
      scrollZoom={{
        speed: 1.5,
        smooth: true
      }}
      touchZoomRotate={{
        enableRotate: false
      }}
      touchAction="pan-y"
      dragRotate={false}
      keyboard={true}
      doubleClickZoom={true}
    >
      {/* Navigation Controls */}
      <NavigationControl 
        position="top-right"
        visualizePitch={false}
        showCompass={false}
      />
      
      {/* Epicenter Marker */}
      {epicenter && (
        <Marker
          longitude={epicenter.lng}
          latitude={epicenter.lat}
          anchor="center"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs">☢️</span>
            </div>
          </div>
        </Marker>
      )}
      
      {/* Blast Circles - Render from LARGEST to SMALLEST for proper layering */}
      {epicenter && blastCircles && (
        <>
          {/* 2nd Degree Burns (Largest thermal) - Light Pink #ff99ff */}
          <Source
            type="geojson"
            data={createCircleGeoJSON(epicenter, blastCircles.thermalRadiation.secondDegree.radius)}
          >
            <Layer
              type="fill"
              paint={{
                'fill-color': '#ff99ff',
                'fill-opacity': getCircleOpacity('thermal2nd')
              }}
            />
            <Layer
              type="line"
              paint={{
                'line-color': '#ff99ff',
                'line-width': 2,
                'line-opacity': getCircleOpacity('thermal2nd') > 0 ? 0.8 : 0
              }}
            />
          </Source>
          
          {/* 3rd Degree Burns - Magenta #ff00ff */}
          <Source
            type="geojson"
            data={createCircleGeoJSON(epicenter, blastCircles.thermalRadiation.thirdDegree.radius)}
          >
            <Layer
              type="fill"
              paint={{
                'fill-color': '#ff00ff',
                'fill-opacity': getCircleOpacity('thermal3rd')
              }}
            />
            <Layer
              type="line"
              paint={{
                'line-color': '#ff00ff',
                'line-width': 2,
                'line-opacity': getCircleOpacity('thermal3rd') > 0 ? 0.8 : 0
              }}
            />
          </Source>
          
          {/* Light Blast - Gray #808080 */}
          <Source
            type="geojson"
            data={createCircleGeoJSON(epicenter, blastCircles.airBlast.light.radius)}
          >
            <Layer
              type="fill"
              paint={{
                'fill-color': '#808080',
                'fill-opacity': getCircleOpacity('light')
              }}
            />
            <Layer
              type="line"
              paint={{
                'line-color': '#808080',
                'line-width': 2,
                'line-opacity': getCircleOpacity('light') > 0 ? 0.8 : 0
              }}
            />
          </Source>
          
          {/* Moderate Blast - Orange #ff8800 */}
          <Source
            type="geojson"
            data={createCircleGeoJSON(epicenter, blastCircles.airBlast.moderate.radius)}
          >
            <Layer
              type="fill"
              paint={{
                'fill-color': '#ff8800',
                'fill-opacity': getCircleOpacity('moderate')
              }}
            />
            <Layer
              type="line"
              paint={{
                'line-color': '#ff8800',
                'line-width': 2,
                'line-opacity': getCircleOpacity('moderate') > 0 ? 0.8 : 0
              }}
            />
          </Source>
          
          {/* Severe Blast - Red #ff0000 */}
          <Source
            type="geojson"
            data={createCircleGeoJSON(epicenter, blastCircles.airBlast.severe.radius)}
          >
            <Layer
              type="fill"
              paint={{
                'fill-color': '#ff0000',
                'fill-opacity': getCircleOpacity('severe')
              }}
            />
            <Layer
              type="line"
              paint={{
                'line-color': '#ff0000',
                'line-width': 2,
                'line-opacity': getCircleOpacity('severe') > 0 ? 0.8 : 0
              }}
            />
          </Source>
          
          {/* Fireball (Smallest) - Yellow #ffff00 */}
          <Source
            type="geojson"
            data={createCircleGeoJSON(epicenter, blastCircles.fireball.radius)}
          >
            <Layer
              type="fill"
              paint={{
                'fill-color': '#ffff00',
                'fill-opacity': getCircleOpacity('fireball')
              }}
            />
            <Layer
              type="line"
              paint={{
                'line-color': '#ffff00',
                'line-width': 3,
                'line-opacity': getCircleOpacity('fireball') > 0 ? 1 : 0
              }}
            />
          </Source>
        </>
      )}
    </Map>
    </div>
  )
}