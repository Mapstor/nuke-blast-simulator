'use client'

import { motion } from 'framer-motion'
import { Circle } from 'react-leaflet'
import { useSimulatorStore } from '@/store/simulatorStore'

export function AnimatedBlast() {
  const epicenter = useSimulatorStore(state => state.epicenter)
  const blastCircles = useSimulatorStore(state => state.blastCircles)

  if (!blastCircles || !epicenter) return null

  return (
    <>
      {/* Animated expanding circles using CSS */}
      <Circle
        center={[epicenter.lat, epicenter.lng]}
        radius={blastCircles.fireball.radius * 1000}
        pathOptions={{ 
          color: '#ff0000', 
          fillColor: '#ff0000', 
          fillOpacity: 0.5,
          className: 'blast-animation-fireball'
        }}
      />
      
      <Circle
        center={[epicenter.lat, epicenter.lng]}
        radius={blastCircles.airBlast.severe.radius * 1000}
        pathOptions={{ 
          color: '#ff3300', 
          fillColor: '#ff3300', 
          fillOpacity: 0.2,
          className: 'blast-animation-severe'
        }}
      />
      
      <Circle
        center={[epicenter.lat, epicenter.lng]}
        radius={blastCircles.airBlast.moderate.radius * 1000}
        pathOptions={{ 
          color: '#ff6600', 
          fillColor: '#ff6600', 
          fillOpacity: 0.15,
          className: 'blast-animation-moderate'
        }}
      />
      
      <Circle
        center={[epicenter.lat, epicenter.lng]}
        radius={blastCircles.airBlast.light.radius * 1000}
        pathOptions={{ 
          color: '#ffcc00', 
          fillColor: '#ffcc00', 
          fillOpacity: 0.1,
          className: 'blast-animation-light'
        }}
      />
    </>
  )
}