'use client'

import { useEffect, useState } from 'react'
import { Circle, useMap } from 'react-leaflet'
import { useSimulatorStore } from '@/store/simulatorStore'
import L from 'leaflet'

export function LeafletExplosionAnimation() {
  const epicenter = useSimulatorStore(state => state.epicenter)
  const isAnimating = useSimulatorStore(state => state.isAnimating)
  const animationPhase = useSimulatorStore(state => state.animationPhase)
  const map = useMap()
  const [flashElement, setFlashElement] = useState<HTMLDivElement | null>(null)
  
  // Create flash overlay when explosion starts
  useEffect(() => {
    if (isAnimating && animationPhase === 'exploding' && !flashElement) {
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
        animation: singleFlash 0.2s ease-out forwards;
      `
      
      // Add keyframes if not already present
      if (!document.querySelector('#flash-keyframes')) {
        const style = document.createElement('style')
        style.id = 'flash-keyframes'
        style.textContent = `
          @keyframes singleFlash {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `
        document.head.appendChild(style)
      }
      
      document.body.appendChild(flash)
      setFlashElement(flash)
      
      // Remove flash after animation
      setTimeout(() => {
        if (flash.parentNode) {
          flash.parentNode.removeChild(flash)
        }
        setFlashElement(null)
      }, 200)
    }
  }, [isAnimating, animationPhase, flashElement])
  
  // Clean up flash element when animation stops
  useEffect(() => {
    if (!isAnimating && flashElement) {
      if (flashElement.parentNode) {
        flashElement.parentNode.removeChild(flashElement)
      }
      setFlashElement(null)
    }
  }, [isAnimating, flashElement])
  
  if (!epicenter || !isAnimating) return null
  
  return (
    <>
      {/* Central fireball - expands during fireball phase */}
      {animationPhase === 'showing-fireball' && (
        <Circle
          center={[epicenter.lat, epicenter.lng]}
          radius={100} // 100m initial fireball
          pathOptions={{
            color: '#ffff00',
            fillColor: '#ffff00',
            fillOpacity: 0.8,
            weight: 0,
            className: 'explosion-fireball-animation'
          }}
        />
      )}
      
      {/* Expanding shockwave rings */}
      {(animationPhase === 'showing-heavy-blast' || 
        animationPhase === 'showing-moderate-blast' || 
        animationPhase === 'showing-light-blast') && (
        <>
          {/* Primary shockwave */}
          <Circle
            center={[epicenter.lat, epicenter.lng]}
            radius={500} // 500m shockwave
            pathOptions={{
              color: '#ff8800',
              fillColor: 'transparent',
              fillOpacity: 0,
              weight: 8,
              opacity: 0.8,
              className: 'explosion-shockwave-1'
            }}
          />
          
          {/* Secondary shockwave */}
          <Circle
            center={[epicenter.lat, epicenter.lng]}
            radius={800} // 800m secondary wave
            pathOptions={{
              color: '#ff4400',
              fillColor: 'transparent',
              fillOpacity: 0,
              weight: 4,
              opacity: 0.6,
              className: 'explosion-shockwave-2'
            }}
          />
        </>
      )}
      
      <style jsx global>{`
        .explosion-fireball-animation {
          animation: fireballPulse 0.8s ease-out forwards;
        }
        
        .explosion-shockwave-1 {
          animation: shockwaveExpand1 1.2s ease-out forwards;
        }
        
        .explosion-shockwave-2 {
          animation: shockwaveExpand2 1.5s ease-out forwards;
        }
        
        @keyframes fireballPulse {
          0% { 
            stroke-width: 0;
            fill-opacity: 0.9;
          }
          50% { 
            stroke-width: 20;
            fill-opacity: 0.7;
          }
          100% { 
            stroke-width: 0;
            fill-opacity: 0.4;
          }
        }
        
        @keyframes shockwaveExpand1 {
          0% {
            stroke-width: 8;
            stroke-opacity: 0.8;
          }
          100% {
            stroke-width: 2;
            stroke-opacity: 0;
          }
        }
        
        @keyframes shockwaveExpand2 {
          0% {
            stroke-width: 4;
            stroke-opacity: 0.6;
          }
          100% {
            stroke-width: 1;
            stroke-opacity: 0;
          }
        }
      `}</style>
    </>
  )
}