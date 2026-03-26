'use client'

import { useState, useEffect } from 'react'
import { BombSelector } from '@/components/simulator/BombSelector'
import { BurstTypeSelector } from '@/components/simulator/BurstTypeSelector'
import { ResultsPanel } from '@/components/simulator/ResultsPanel'
import { SimulatorCore } from '@/components/simulator/SimulatorCore'
import { MapWrapper } from '@/components/simulator/MapWrapper'
import { ShareButton } from '@/components/simulator/ShareButton'
import { HUDOverlay } from '@/components/simulator/HUDOverlay'
import { BombCursor } from '@/components/simulator/BombCursor'
import { PopulationIndicator } from '@/components/simulator/PopulationIndicator'
import { Footer } from '@/components/layout/Footer'
import { useSimulatorStore } from '@/store/simulatorStore'
import { bombs } from '@/lib/data/bombs'

export default function Home() {
  const { selectedBomb, setSelectedBomb, setEpicenter } = useSimulatorStore()
  
  useEffect(() => {
    // Check for shared parameters in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const bombId = params.get('bomb')
      const lat = params.get('lat')
      const lng = params.get('lng')
      
      if (bombId && lat && lng) {
        const bomb = bombs.find(b => b.id === bombId)
        if (bomb) {
          setSelectedBomb(bomb)
          setEpicenter({ 
            lat: parseFloat(lat), 
            lng: parseFloat(lng) 
          })
        }
      }
    }
  }, [setSelectedBomb, setEpicenter])
  
  return (
    <main className={`min-h-screen flex flex-col bg-black ${selectedBomb ? 'has-weapon-selected' : ''}`}>
      <SimulatorCore />
      <BombCursor />
      
      {/* Mobile Layout - Fullscreen map with floating controls */}
      <div className="lg:hidden flex-1 relative">
        {/* Fullscreen Map */}
        <div className="absolute inset-0">
          <MapWrapper />
          <HUDOverlay />
          <PopulationIndicator />
        </div>
        
        {/* Floating Bomb Selector */}
        <div className="absolute top-4 left-4 right-4 z-50">
          <div className="bg-black/90 backdrop-blur border border-green-500/30 rounded-lg p-3">
            <BombSelector />
          </div>
        </div>
        
        {/* Floating Results Panel - Bottom */}
        <div className="absolute bottom-14 left-4 right-4 z-50 max-h-48 overflow-y-auto">
          <div className="bg-black/90 backdrop-blur border border-green-500/30 rounded-lg">
            <ResultsPanel />
            <div className="p-3 border-t border-green-500/30">
              <ShareButton />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden relative">
        {/* Left Panel - Controls (desktop only) */}
        <aside className="w-96 bg-gray-900 border-r border-green-500/30 p-6 overflow-y-auto space-y-6">
          <BombSelector />
          
          <div className="border-t border-green-500/30 pt-6">
            <BurstTypeSelector />
          </div>
          
          <div className="p-4 bg-black border border-green-500/30 rounded">
            <p className="text-sm text-green-400">
              📍 Click anywhere on the map to simulate detonation
            </p>
          </div>
        </aside>
        
        {/* Center - Map */}
        <div className="flex-1 relative bg-gray-800">
          <MapWrapper />
          <HUDOverlay />
          <PopulationIndicator />
        </div>
        
        {/* Right Panel - Results (desktop only) */}
        <aside className="w-96 bg-gray-900 border-l border-green-500/30 overflow-y-auto">
          <ResultsPanel />
          <div className="p-6 pt-0">
            <ShareButton />
          </div>
        </aside>
      </div>
      
      <Footer />
    </main>
  )
}