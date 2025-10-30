'use client'

import { useEffect, useState } from 'react'
import { useSimulatorStore } from '@/store/simulatorStore'

export function BombCursor() {
  const selectedBomb = useSimulatorStore(state => state.selectedBomb)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isOverMap, setIsOverMap] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      
      // Check if mouse is over the map area
      const mapElement = document.querySelector('.leaflet-container')
      if (mapElement) {
        const rect = mapElement.getBoundingClientRect()
        const overMap = e.clientX >= rect.left && 
                       e.clientX <= rect.right && 
                       e.clientY >= rect.top && 
                       e.clientY <= rect.bottom
        setIsOverMap(overMap)
      }
    }

    const handleMouseLeave = () => {
      setIsOverMap(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!selectedBomb || !isOverMap) return null

  return (
    <div
      className="bomb-cursor"
      style={{
        position: 'fixed',
        left: mousePos.x,
        top: mousePos.y,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    >
      <svg
        width="40"
        height="50"
        viewBox="0 0 40 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="bomb-icon"
      >
        {/* Bomb body */}
        <ellipse
          cx="20"
          cy="30"
          rx="12"
          ry="18"
          fill="#2c2c2c"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        
        {/* Highlight on bomb */}
        <ellipse
          cx="17"
          cy="25"
          rx="4"
          ry="6"
          fill="#4a4a4a"
          opacity="0.7"
        />
        
        {/* Fins */}
        <path
          d="M8 15 L8 8 L12 8 L12 15"
          fill="#ff4444"
          stroke="#cc0000"
          strokeWidth="0.5"
        />
        <path
          d="M28 15 L28 8 L32 8 L32 15"
          fill="#ff4444"
          stroke="#cc0000"
          strokeWidth="0.5"
        />
        
        {/* Nose cone */}
        <path
          d="M20 48 L14 40 L26 40 Z"
          fill="#1a1a1a"
        />
        
        {/* Warning stripes */}
        <rect x="8" y="28" width="24" height="3" fill="#ffcc00" opacity="0.8" />
        <rect x="8" y="33" width="24" height="3" fill="#ff0000" opacity="0.8" />
        
        {/* Animated glow effect */}
        <ellipse
          cx="20"
          cy="30"
          rx="16"
          ry="22"
          fill="none"
          stroke="#ff0000"
          strokeWidth="1"
          opacity="0.3"
          className="bomb-pulse"
        />
      </svg>
      
      {/* Weapon name label */}
      <div 
        style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#00ff00',
          padding: '2px 8px',
          borderRadius: '3px',
          fontSize: '10px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(0, 255, 0, 0.3)'
        }}
      >
        {selectedBomb.name}
      </div>
      
      {/* Targeting reticle */}
      <div className="targeting-reticle">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          style={{
            position: 'absolute',
            left: '50%',
            top: '100%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <circle
            cx="30"
            cy="30"
            r="28"
            fill="none"
            stroke="#ff0000"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.5"
            className="reticle-spin"
          />
          <line x1="30" y1="5" x2="30" y2="15" stroke="#ff0000" strokeWidth="1" opacity="0.7" />
          <line x1="30" y1="45" x2="30" y2="55" stroke="#ff0000" strokeWidth="1" opacity="0.7" />
          <line x1="5" y1="30" x2="15" y2="30" stroke="#ff0000" strokeWidth="1" opacity="0.7" />
          <line x1="45" y1="30" x2="55" y2="30" stroke="#ff0000" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>
    </div>
  )
}