'use client'

import { useSimulatorStore } from '@/store/simulatorStore'
import { formatDistance } from '@/lib/utils/format'

export function ResultsPanel() {
  const blastCircles = useSimulatorStore(state => state.blastCircles)
  const animationPhase = useSimulatorStore(state => state.animationPhase)
  const isAnimating = useSimulatorStore(state => state.isAnimating)
  
  if (!blastCircles) {
    return (
      <div className="p-6 text-center text-green-400/50">
        <div className="text-sm">Select a bomb and click on the map to see blast effects</div>
      </div>
    )
  }
  
  // Show immediately when results are available, with animation
  const showResults = blastCircles && (isAnimating || !isAnimating)
  
  return (
    <div className="p-6 space-y-6">
      
      <div className="space-y-4">
        {/* Show all stats immediately with staggered animation */}
        {showResults && (
          <>
            {/* Fireball - Yellow #ffff00 */}
            <div className={`border-l-4 pl-4 bg-black/30 py-2 ${isAnimating ? 'animate-slideIn' : ''}`}
                 style={{ 
                   animationDelay: isAnimating ? '0.4s' : '0s',
                   borderColor: '#ffff00'
                 }}>
              <h4 className="font-semibold text-sm" style={{ color: '#ffff00' }}>Fireball</h4>
              <p className="text-xs" style={{ color: '#ffff00', opacity: 0.8 }}>Complete vaporization</p>
              <p className="text-xs text-red-400 font-semibold">💀 100% fatalities</p>
              <p className="text-xs text-green-400">Radius: {formatDistance(blastCircles.fireball.radius)}</p>
            </div>
        
            {/* Severe blast damage - Red #ff0000 */}
            <div className={`border-l-4 pl-4 bg-black/30 py-2 ${isAnimating ? 'animate-slideIn' : ''}`}
                 style={{ 
                   animationDelay: isAnimating ? '0.6s' : '0s',
                   borderColor: '#ff0000'
                 }}>
              <h4 className="font-semibold text-sm" style={{ color: '#ff0000' }}>Severe Blast Damage</h4>
              <p className="text-xs" style={{ color: '#ff0000', opacity: 0.8 }}>Heavy building collapse</p>
              <p className="text-xs text-orange-400 font-semibold">⚠️ 50-90% fatalities</p>
              <p className="text-xs text-green-400">Radius: {formatDistance(blastCircles.airBlast.severe.radius)}</p>
            </div>
        
            {/* Moderate blast damage - Orange #ff8800 */}
            <div className={`border-l-4 pl-4 bg-black/30 py-2 ${isAnimating ? 'animate-slideIn' : ''}`}
                 style={{ 
                   animationDelay: isAnimating ? '0.8s' : '0s',
                   borderColor: '#ff8800'
                 }}>
              <h4 className="font-semibold text-sm" style={{ color: '#ff8800' }}>Moderate Blast Damage</h4>
              <p className="text-xs" style={{ color: '#ff8800', opacity: 0.8 }}>Buildings damaged, injuries</p>
              <p className="text-xs text-yellow-400 font-semibold">⚠️ 5-50% fatalities</p>
              <p className="text-xs text-green-400">Radius: {formatDistance(blastCircles.airBlast.moderate.radius)}</p>
            </div>
        
            {/* Light blast damage - Gray #808080 */}
            <div className={`border-l-4 pl-4 bg-black/30 py-2 ${isAnimating ? 'animate-slideIn' : ''}`}
                 style={{ 
                   animationDelay: isAnimating ? '1.0s' : '0s',
                   borderColor: '#808080'
                 }}>
              <h4 className="font-semibold text-sm" style={{ color: '#808080' }}>Light Blast Damage</h4>
              <p className="text-xs" style={{ color: '#808080', opacity: 0.8 }}>Windows shattered, injuries</p>
              <p className="text-xs text-gray-400 font-semibold">🩹 0-5% fatalities</p>
              <p className="text-xs text-green-400">Radius: {formatDistance(blastCircles.airBlast.light.radius)}</p>
            </div>
        
            {/* Thermal radiation (3rd degree) - Magenta #ff00ff */}
            <div className={`border-l-4 pl-4 bg-black/30 py-2 ${isAnimating ? 'animate-slideIn' : ''}`}
                 style={{ 
                   animationDelay: isAnimating ? '1.2s' : '0s',
                   borderColor: '#ff00ff'
                 }}>
              <h4 className="font-semibold text-sm" style={{ color: '#ff00ff' }}>3rd Degree Burns</h4>
              <p className="text-xs" style={{ color: '#ff00ff', opacity: 0.8 }}>Severe burns, skin destroyed</p>
              <p className="text-xs text-orange-400 font-semibold">🔥 50-90% fatalities (untreated)</p>
              <p className="text-xs text-green-400">Radius: {formatDistance(blastCircles.thermalRadiation.thirdDegree.radius)}</p>
            </div>
        
            {/* Thermal radiation (2nd degree) - Light Magenta #ff99ff */}
            <div className={`border-l-4 pl-4 bg-black/30 py-2 ${isAnimating ? 'animate-slideIn' : ''}`}
                 style={{ 
                   animationDelay: isAnimating ? '1.4s' : '0s',
                   borderColor: '#ff99ff'
                 }}>
              <h4 className="font-semibold text-sm" style={{ color: '#ff99ff' }}>2nd Degree Burns</h4>
              <p className="text-xs" style={{ color: '#ff99ff', opacity: 0.8 }}>Blistering, pain</p>
              <p className="text-xs text-yellow-400 font-semibold">🔥 0-5% fatalities</p>
              <p className="text-xs text-green-400">Radius: {formatDistance(blastCircles.thermalRadiation.secondDegree.radius)}</p>
            </div>

            {/* Radioactive Fallout */}
            {blastCircles.fallout && (
              <div className={`border-l-4 border-green-500 pl-4 bg-black/30 py-2 ${isAnimating ? 'animate-slideIn' : ''}`}
                   style={{ animationDelay: isAnimating ? '1.6s' : '0s' }}>
                <h4 className="font-semibold text-sm text-green-400">Radioactive Fallout</h4>
                <p className="text-xs text-green-300">Lethal radiation dose</p>
                <p className="text-xs text-orange-400 font-semibold">☢️ 50-90% fatalities (48hr exposure)</p>
                <p className="text-xs text-green-400">Radius: {formatDistance(blastCircles.fallout.radius)}</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="text-xs text-green-400/50 pt-4 border-t border-green-500/30">
        <p>Blast effects shown on map</p>
        <p>Ranges are estimates based on weapon yield</p>
      </div>
    </div>
  )
}