'use client'

import { useEffect, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
  formatFn?: (n: number) => string
}

export function AnimatedNumber({ value, duration = 1000, formatFn }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const startTime = Date.now()
    const startValue = 0
    const endValue = value
    
    const updateNumber = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for more dramatic effect
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber)
      } else {
        setDisplayValue(endValue)
      }
    }
    
    requestAnimationFrame(updateNumber)
  }, [value, duration])
  
  return <>{formatFn ? formatFn(displayValue) : displayValue.toLocaleString()}</>
}