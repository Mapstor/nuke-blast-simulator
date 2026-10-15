'use client'

import { useSimulatorStore } from '@/store/simulatorStore'
import { formatDistance } from '@/lib/utils/format'

// NBS-003 INTEGRITY: radii only (air burst at optimum height). Casualty,
// fatality and fallout outputs are withdrawn until verified (EFFECTS_FLAGS).
export function ResultsPanel() {
  const blastCircles = useSimulatorStore(state => state.blastCircles)
  const isAnimating = useSimulatorStore(state => state.isAnimating)

  if (!blastCircles) {
    return (
      <div className="p-6 text-center text-green-400/50">
        <div className="text-sm">Select a bomb and click on the map to see blast effects</div>
      </div>
    )
  }

  const zones: Array<{ name: string; detail: string; color: string; radius: number }> = [
    { name: 'Fireball', detail: 'Complete vaporization', color: '#ffff00', radius: blastCircles.fireball.radius },
    { name: 'Severe blast (20 psi)', detail: 'Heavy building collapse', color: '#ff0000', radius: blastCircles.airBlast.severe.radius },
    { name: 'Moderate blast (5 psi)', detail: 'Most buildings damaged', color: '#ff8800', radius: blastCircles.airBlast.moderate.radius },
    { name: 'Light blast (1 psi)', detail: 'Windows shattered', color: '#808080', radius: blastCircles.airBlast.light.radius },
    { name: '3rd-degree burns', detail: 'Thermal radiation', color: '#ff00ff', radius: blastCircles.thermalRadiation.thirdDegree.radius },
    { name: '2nd-degree burns', detail: 'Thermal radiation', color: '#ff99ff', radius: blastCircles.thermalRadiation.secondDegree.radius },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {zones.map((z, i) => (
          <div
            key={z.name}
            className={`border-l-4 pl-4 bg-black/30 py-2 ${isAnimating ? 'animate-slideIn' : ''}`}
            style={{ animationDelay: isAnimating ? `${0.4 + i * 0.2}s` : '0s', borderColor: z.color }}
          >
            <h4 className="font-semibold text-sm" style={{ color: z.color }}>{z.name}</h4>
            <p className="text-xs" style={{ color: z.color, opacity: 0.8 }}>{z.detail}</p>
            <p className="text-xs text-green-400">Radius: {formatDistance(z.radius)}</p>
          </div>
        ))}
      </div>

      <div className="text-xs text-green-400/50 pt-4 border-t border-green-500/30 space-y-1">
        <p>Blast effects shown on map · air burst at optimum height</p>
        <p>Radii are scaling-law estimates from weapon yield. See the methodology page.</p>
      </div>
    </div>
  )
}
