'use client'

import { useEffect, useState } from 'react'

interface ExplosionAnimationProps {
  lat: number
  lng: number
  onComplete?: () => void
}

export function ExplosionAnimation({ lat, lng, onComplete }: ExplosionAnimationProps) {
  const [phase, setPhase] = useState<'flash' | 'fireball' | 'complete'>('flash')
  
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    // Flash phase (instant white flash)
    timers.push(setTimeout(() => setPhase('fireball'), 200))
    
    // End animation after fireball and shockwave
    timers.push(setTimeout(() => {
      setPhase('complete')
      onComplete?.()
    }, 2500))
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [onComplete])
  
  if (phase === 'complete') return null
  
  return (
    <div className="explosion-container">
      {/* White flash */}
      {phase === 'flash' && (
        <div className="explosion-flash" />
      )}
      
      {/* Fireball */}
      {phase === 'fireball' && (
        <div className="explosion-fireball" />
      )}
      
      {/* Shockwave ring */}
      {phase === 'fireball' && (
        <div className="explosion-shockwave" />
      )}
    </div>
  )
}