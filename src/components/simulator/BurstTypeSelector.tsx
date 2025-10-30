'use client'

import { useSimulatorStore } from '@/store/simulatorStore'

export function BurstTypeSelector() {
  const { burstType, setBurstType } = useSimulatorStore()
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-green-400">Detonation Type</label>
      
      <div className="space-y-2">
        <label className="flex items-start p-3 bg-black/50 border border-green-500/30 rounded cursor-pointer hover:bg-green-500/10 transition">
          <input
            type="radio"
            name="burstType"
            value="air"
            checked={burstType === 'air'}
            onChange={() => setBurstType('air')}
            className="mt-1 mr-3 text-green-400"
          />
          <div className="flex-1">
            <div className="font-semibold text-green-400">Air Burst</div>
            <div className="text-xs text-green-300/70 mt-1">
              Detonates above ground, maximizing blast damage over wider area with minimal fallout
            </div>
          </div>
        </label>
        
        <label className="flex items-start p-3 bg-black/50 border border-green-500/30 rounded cursor-pointer hover:bg-green-500/10 transition">
          <input
            type="radio"
            name="burstType"
            value="surface"
            checked={burstType === 'surface'}
            onChange={() => setBurstType('surface')}
            className="mt-1 mr-3 text-green-400"
          />
          <div className="flex-1">
            <div className="font-semibold text-green-400">Surface Burst</div>
            <div className="text-xs text-green-300/70 mt-1">
              Detonates at ground level, creating massive radioactive fallout but smaller blast radius
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}