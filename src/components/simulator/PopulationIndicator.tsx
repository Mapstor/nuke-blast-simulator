'use client'

import { useSimulatorStore } from '@/store/simulatorStore'
import { formatNumber } from '@/lib/utils/format'

export function PopulationIndicator() {
  const { populationData, detonationPoint } = useSimulatorStore()

  if (!detonationPoint || !populationData) return null

  const getDensityLevel = (density: number) => {
    if (density >= 10000) return { level: 'Megacity Core', color: 'text-red-500' }
    if (density >= 5000) return { level: 'Dense Urban', color: 'text-orange-500' }
    if (density >= 2000) return { level: 'Urban', color: 'text-yellow-500' }
    if (density >= 1000) return { level: 'Suburban', color: 'text-green-500' }
    if (density >= 500) return { level: 'Town', color: 'text-blue-500' }
    if (density >= 100) return { level: 'Rural', color: 'text-indigo-500' }
    return { level: 'Remote', color: 'text-gray-500' }
  }

  const densityInfo = getDensityLevel(populationData.density)

  return (
    <div className="absolute top-24 left-4 bg-black/80 border border-blue-400/30 p-3 text-xs rounded z-10">
      <div className="text-blue-400 mb-2 font-semibold">Population Analysis</div>
      
      <div className="space-y-1">
        <div className="text-blue-300">
          <span className="text-blue-400">Location:</span> {populationData.cityName}
        </div>
        
        <div className="text-blue-300">
          <span className="text-blue-400">Country:</span> {populationData.country}
        </div>
        
        <div className="text-blue-300">
          <span className="text-blue-400">Density:</span> {formatNumber(populationData.density)}/km²
        </div>
        
        <div className={`font-semibold ${densityInfo.color}`}>
          {densityInfo.level}
        </div>
        
        {populationData.distance < 50 && (
          <div className="text-blue-300 text-xs mt-2 italic">
            {populationData.distance < 1 
              ? 'City center' 
              : `${populationData.distance.toFixed(1)} km from city center`}
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-blue-400/20">
        <div className="text-xs text-blue-300/70">
          Casualty estimates based on local population density
        </div>
      </div>
    </div>
  )
}