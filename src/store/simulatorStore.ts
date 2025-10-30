// store/simulatorStore.ts

import { create } from 'zustand'
import { Bomb, BlastResults } from '@/lib/types'

interface SimulatorState {
  // Weapon selection
  selectedBomb: Bomb | null
  customYield: number
  burstType: 'air' | 'surface'
  
  // Blast location (user-selected epicenter - ONLY updates on map click)
  epicenter: { lat: number; lng: number } | null
  
  // Map view state (independent of epicenter)
  mapCenter: { lat: number; lng: number }
  zoom: number
  
  // Calculated blast effects (derived from epicenter + weapon)
  blastCircles: BlastResults | null
  
  // Animation state
  animationPhase: 'idle' | 'exploding' | 'showing-fireball' | 'showing-heavy-blast' | 'showing-moderate-blast' | 'showing-light-blast' | 'showing-thermal' | 'showing-fallout' | 'complete'
  isAnimating: boolean
  
  // Weapon actions
  setSelectedBomb: (bomb: Bomb) => void
  setCustomYield: (yieldKt: number) => void
  setBurstType: (burstType: 'air' | 'surface') => void
  
  // Blast location actions (ONLY updates epicenter on user click)
  setEpicenter: (point: { lat: number; lng: number }) => void
  
  // Map view actions (independent of epicenter)
  setMapCenter: (center: { lat: number; lng: number }) => void
  setZoom: (zoom: number) => void
  
  // Blast calculation actions (derived state)
  calculateBlastEffects: () => void
  
  // Animation actions
  setAnimationPhase: (phase: SimulatorState['animationPhase']) => void
  setIsAnimating: (isAnimating: boolean) => void
  startExplosionSequence: () => void
  
  reset: () => void
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  // Weapon selection
  selectedBomb: null,
  customYield: 100,
  burstType: 'air',
  
  // Blast location (user-selected epicenter)
  epicenter: null,
  
  // Map view state (independent)
  mapCenter: { lat: 39.8283, lng: -98.5795 }, // Default center on geographic center of USA
  zoom: 3.5,
  
  // Calculated blast effects
  blastCircles: null,
  
  // Animation state
  animationPhase: 'idle',
  isAnimating: false,
  
  // Weapon actions
  setSelectedBomb: (bomb) => {
    set({ selectedBomb: bomb })
    // Recalculate blast effects when weapon changes
    setTimeout(() => get().calculateBlastEffects(), 0)
  },
  setCustomYield: (yieldKt) => {
    set({ customYield: yieldKt })
    // Recalculate blast effects when yield changes
    setTimeout(() => get().calculateBlastEffects(), 0)
  },
  setBurstType: (burstType) => {
    set({ burstType: burstType })
    // Recalculate blast effects when burst type changes
    setTimeout(() => get().calculateBlastEffects(), 0)
  },
  
  // Blast location actions (ONLY updates epicenter on user click)
  setEpicenter: (point) => {
    set({ epicenter: point })
    // Recalculate blast effects when epicenter changes
    setTimeout(() => get().calculateBlastEffects(), 0)
  },
  
  // Map view actions (independent of epicenter)
  setMapCenter: (center) => set({ mapCenter: center }),
  setZoom: (zoom) => set({ zoom: zoom }),
  
  // Blast calculation (derived state)
  calculateBlastEffects: () => {
    const state = get()
    const { epicenter, selectedBomb, customYield, burstType } = state
    
    if (!epicenter || !selectedBomb) {
      set({ blastCircles: null })
      return
    }
    
    // Import calculation functions
    const { calculateBlastResults } = require('@/lib/calculations/casualties')
    
    try {
      const results = calculateBlastResults(selectedBomb.yield || customYield, burstType)
      set({ blastCircles: results })
    } catch (error) {
      console.error('Error calculating blast effects:', error)
      set({ blastCircles: null })
    }
  },
  
  // Animation actions
  setAnimationPhase: (phase) => set({ animationPhase: phase }),
  setIsAnimating: (isAnimating) => set({ isAnimating: isAnimating }),
  
  startExplosionSequence: () => {
    const phases: SimulatorState['animationPhase'][] = [
      'exploding',
      'showing-fireball',
      'showing-heavy-blast',
      'showing-moderate-blast', 
      'showing-light-blast',
      'showing-thermal',
      'showing-fallout',
      'complete'
    ]
    
    set({ isAnimating: true, animationPhase: 'exploding' })
    
    // Progress through phases with delays - faster timing
    phases.forEach((phase, index) => {
      setTimeout(() => {
        const state = get()
        if (state.isAnimating) {
          set({ animationPhase: phase })
          if (phase === 'complete') {
            set({ isAnimating: false })
          }
        }
      }, index * 400) // 400ms between each phase (3.2s total)
    })
  },
  
  reset: () => set({
    selectedBomb: null,
    epicenter: null,
    customYield: 100,
    burstType: 'air',
    mapCenter: { lat: 39.8283, lng: -98.5795 },
    zoom: 3.5,
    blastCircles: null,
    animationPhase: 'idle',
    isAnimating: false
  })
}))