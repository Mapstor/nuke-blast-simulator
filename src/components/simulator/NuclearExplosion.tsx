'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface NuclearExplosionProps {
  x: number
  y: number
  onComplete?: () => void
}

export function NuclearExplosion({ x, y, onComplete }: NuclearExplosionProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Complete animation after 2.5s
    const completeTimer = setTimeout(() => {
      onComplete?.()
    }, 2500)
    
    return () => {
      clearTimeout(completeTimer)
    }
  }, [onComplete])
  
  if (!mounted) return null
  
  return createPortal(
    <>
      {/* Full screen white flash - single quick flash */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: 9999,
          background: 'white',
          animation: 'singleFlash 0.2s ease-out forwards'
        }}
      />
      
      {/* Explosion at click location */}
      <div 
        className="fixed pointer-events-none"
        style={{ 
          left: `${x}px`, 
          top: `${y}px`,
          zIndex: 9998,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Central fireball core */}
        <div 
          className="absolute"
          style={{
            width: '30px',
            height: '30px',
            background: 'radial-gradient(circle, #ffffff 0%, #ffff00 10%, #ff8800 30%, #ff4400 50%, #ff0000 70%, transparent 100%)',
            borderRadius: '50%',
            animation: 'centralBlast 1.5s ease-out forwards',
            filter: 'blur(1px)',
            boxShadow: '0 0 60px #ffff00, 0 0 120px #ff8800, 0 0 180px #ff0000',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
          }}
        />
        
        {/* Multiple expanding fire rings for shockwave */}
        <div 
          className="absolute"
          style={{
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, transparent 30%, rgba(255, 200, 0, 0.8) 40%, rgba(255, 100, 0, 0.6) 50%, rgba(255, 0, 0, 0.4) 60%, transparent 70%)',
            borderRadius: '50%',
            animation: 'fireRing1 2.5s ease-out forwards',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
          }}
        />
        
        <div 
          className="absolute"
          style={{
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, transparent 40%, rgba(255, 150, 0, 0.6) 50%, rgba(255, 50, 0, 0.4) 60%, transparent 70%)',
            borderRadius: '50%',
            animation: 'fireRing2 2.5s ease-out forwards',
            animationDelay: '0.2s',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
          }}
        />
        
        {/* Fiery shockwave */}
        <div 
          className="absolute"
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid transparent',
            borderRadius: '50%',
            background: 'radial-gradient(circle, transparent 45%, rgba(255, 100, 0, 0.9) 50%, rgba(255, 200, 0, 0.7) 55%, rgba(255, 50, 0, 0.5) 60%, transparent 65%)',
            animation: 'shockwaveExpand 2s ease-out forwards',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
            filter: 'blur(1px)'
          }}
        />
        
        
        {/* Debris and sparks */}
        <div 
          className="absolute"
          style={{
            width: '100px',
            height: '100px',
            background: `radial-gradient(2px 2px at 20% 30%, rgba(255, 200, 0, 0.9), transparent),
                        radial-gradient(2px 2px at 60% 70%, rgba(255, 100, 0, 0.9), transparent),
                        radial-gradient(1px 1px at 90% 10%, rgba(255, 255, 0, 0.9), transparent),
                        radial-gradient(2px 2px at 15% 80%, rgba(255, 50, 0, 0.9), transparent),
                        radial-gradient(1px 1px at 80% 50%, rgba(255, 150, 0, 0.9), transparent)`,
            backgroundSize: '30px 30px',
            animation: 'debrisExpand 2.5s ease-out forwards',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes singleFlash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes centralBlast {
          0% {
            width: 30px;
            height: 30px;
            opacity: 1;
          }
          50% {
            width: 100px;
            height: 100px;
            opacity: 0.8;
          }
          100% {
            width: 60px;
            height: 60px;
            opacity: 0.4;
          }
        }
        
        @keyframes fireRing1 {
          0% {
            width: 40px;
            height: 40px;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            width: 600px;
            height: 600px;
            opacity: 0;
          }
        }
        
        @keyframes fireRing2 {
          0% {
            width: 40px;
            height: 40px;
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            width: 500px;
            height: 500px;
            opacity: 0;
          }
        }
        
        @keyframes shockwaveExpand {
          0% {
            width: 60px;
            height: 60px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            width: 700px;
            height: 700px;
            opacity: 0;
          }
        }
        
        @keyframes debrisExpand {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        
      `}</style>
    </>,
    document.body
  )
}