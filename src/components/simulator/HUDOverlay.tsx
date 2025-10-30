'use client'

import { useSimulatorStore } from '@/store/simulatorStore'
import { formatDistance } from '@/lib/utils/format'
import { getCountryFlag } from '@/lib/data/flags'

export function HUDOverlay() {
  const epicenter = useSimulatorStore(state => state.epicenter)
  const selectedBomb = useSimulatorStore(state => state.selectedBomb)
  const blastCircles = useSimulatorStore(state => state.blastCircles)
  const burstType = useSimulatorStore(state => state.burstType)

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Simple crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg width="60" height="60" className="text-green-400 opacity-20">
          <line x1="30" y1="0" x2="30" y2="60" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1" />
          <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
        </svg>
      </div>

      {/* Top left - Coordinates (desktop only) */}
      <div className="hidden lg:block absolute top-4 left-4 bg-black/80 border border-green-400/30 p-3 text-xs rounded">
        <div className="text-green-400 mb-1 font-semibold">Target Location</div>
        {epicenter ? (
          <>
            <div className="text-green-300">Lat: {epicenter.lat.toFixed(4)}°</div>
            <div className="text-green-300">Lng: {epicenter.lng.toFixed(4)}°</div>
          </>
        ) : (
          <div className="text-green-300/50">Click map to select</div>
        )}
      </div>

      {/* Top right - Weapon Status (desktop only) */}
      <div className="hidden lg:block absolute top-4 right-4 bg-black/80 border border-green-400/30 p-3 text-xs rounded">
        <div className="text-green-400 mb-1 font-semibold">Selected Weapon</div>
        {selectedBomb ? (
          <>
            <div className="text-green-300">{getCountryFlag(selectedBomb.country)} {selectedBomb.name}</div>
            <div className="text-green-300">
              Yield: {selectedBomb.yield < 0.001 ? 
                `${(selectedBomb.yield * 1000).toFixed(0)} tons TNT` : 
                `${selectedBomb.yield} kt`}
            </div>
            <div className="text-green-300">
              Type: {selectedBomb.type === 'conventional' ? '🔥 Conventional' : '☢️ Nuclear'}
            </div>
            <div className="text-yellow-300">Burst: {burstType === 'air' ? 'Air' : 'Surface'}</div>
          </>
        ) : (
          <div className="text-green-300/50">No weapon selected</div>
        )}
      </div>

      {/* Mobile info box - right side */}
      <div className="lg:hidden absolute top-4 right-4 space-y-2 max-w-xs">
        {/* Selected weapon info */}
        {selectedBomb && (
          <div className="bg-black/80 border border-green-400/30 px-3 py-2 text-xs rounded">
            <div className="text-right">
              <div className="text-green-400 font-semibold text-sm mb-1">Selected Weapon</div>
              <div className="text-green-300 font-medium">{getCountryFlag(selectedBomb.country)} {selectedBomb.name}</div>
              <div className="text-green-300">
                Yield: {selectedBomb.yield < 0.001 ? 
                  `${(selectedBomb.yield * 1000).toFixed(0)} tons TNT` : 
                  `${selectedBomb.yield} kt`}
              </div>
              <div className="text-green-300">
                Type: {selectedBomb.type === 'conventional' ? '🔥 Conventional' : '☢️ Nuclear'}
              </div>
              <div className="text-yellow-300">Burst: {burstType === 'air' ? 'Air' : 'Surface'}</div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom left - Impact Assessment (desktop only) */}
      {blastCircles && (
        <div className="hidden lg:block absolute bottom-4 left-4 bg-black/80 border border-red-400/30 p-3 text-xs rounded">
          <div className="text-red-400 mb-1 font-semibold">Impact Summary</div>
          <div className="text-yellow-300">Fireball: {formatDistance(blastCircles.fireball.radius)}</div>
          <div className="text-orange-300">Blast zone: {formatDistance(blastCircles.airBlast.moderate.radius)}</div>
          <div className="text-purple-300">Thermal burns: {formatDistance(blastCircles.thermalRadiation.thirdDegree.radius)}</div>
        </div>
      )}

    </div>
  )
}