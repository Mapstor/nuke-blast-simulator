'use client'

import { bombs } from '@/lib/data/bombs'
import { useSimulatorStore } from '@/store/simulatorStore'
import { getCountryFlag } from '@/lib/data/flags'

export function BombSelector() {
  const { selectedBomb, setSelectedBomb, customYield, setCustomYield } = useSimulatorStore()
  
  // Group bombs by type
  const nuclearBombs = bombs.filter(bomb => bomb.type !== 'conventional')
  const conventionalBombs = bombs.filter(bomb => bomb.type === 'conventional')
  
  return (
    <div className="space-y-4">
      <label className="hidden lg:block text-sm font-semibold text-green-400 mb-2">Select Weapon</label>
      <select
        className="w-full p-2 bg-black border border-green-500/50 text-green-400 rounded focus:border-green-400 focus:outline-none"
        onChange={(e) => {
          const bomb = bombs.find(b => b.id === e.target.value)
          if (bomb) setSelectedBomb(bomb)
        }}
        value={selectedBomb?.id || ''}
      >
        <option value="">☢️ Choose a bomb...</option>
        
        <optgroup label="☢️ Nuclear Weapons">
          {nuclearBombs.map(bomb => (
            <option key={bomb.id} value={bomb.id}>
              {getCountryFlag(bomb.country)} {bomb.name} ({bomb.yield.toLocaleString()} kt)
            </option>
          ))}
        </optgroup>
        
        <optgroup label="🔥 Conventional Weapons">
          {conventionalBombs.map(bomb => (
            <option key={bomb.id} value={bomb.id}>
              {getCountryFlag(bomb.country)} {bomb.name} ({bomb.yield < 0.001 ? `${(bomb.yield * 1000).toFixed(0)}t` : `${bomb.yield.toFixed(3)}kt`})
            </option>
          ))}
        </optgroup>
      </select>
      
      {selectedBomb?.id === 'custom' && (
        <div>
          <label className="block text-sm text-green-400 mb-1">Custom Yield (kilotons)</label>
          <input
            type="number"
            min="1"
            max="100000"
            value={customYield}
            onChange={(e) => setCustomYield(Number(e.target.value))}
            className="w-full p-2 bg-black border border-green-500/50 text-green-400 rounded focus:border-green-400 focus:outline-none"
          />
        </div>
      )}
      
      {selectedBomb && (
        <div className="p-3 bg-black/50 border border-green-500/30 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">
              {selectedBomb.type === 'conventional' ? '🔥' : '☢️'}
            </span>
            <span className="text-sm font-medium text-green-400 capitalize">
              {selectedBomb.type === 'conventional' ? 'Conventional Weapon' : 'Nuclear Weapon'}
            </span>
          </div>
          <p className="text-sm text-green-300">{selectedBomb.description}</p>
          <p className="text-xs text-green-400/70 mt-2">
            {getCountryFlag(selectedBomb.country)} {selectedBomb.country} • {selectedBomb.year}
          </p>
        </div>
      )}
    </div>
  )
}