// lib/calculations/casualties.ts
import { calculateFireball, calculateAirBlast, calculateThermalRadiation, calculateFallout } from './blast'

export interface CasualtyZone {
  name: string
  radius: number
  casualties: number
  survivorsWithInjuries: number
  fatalities: number
  totalPopulation: number
  averageDensity: number
}

// Legacy function for backwards compatibility
export function calculateCasualties(
  radius: number, // km
  centerLat: number,
  centerLng: number,
  density: number, // per km²
  mortalityRate: number // 0-1
): number {
  const area = Math.PI * Math.pow(radius, 2)
  return Math.round(area * density * mortalityRate)
}

// Simple density-based casualty calculation
export function calculateDensityBasedCasualties(
  density: number, // people per km²
  effectZones: Array<{
    name: string
    radius: number
    mortalityRate: number
    injuryRate: number
  }>
): CasualtyZone[] {
  return effectZones.map(zone => {
    const area = Math.PI * Math.pow(zone.radius, 2)
    const totalPopulation = Math.round(area * density)
    const fatalities = Math.round(totalPopulation * zone.mortalityRate)
    const survivorsWithInjuries = Math.round(totalPopulation * zone.injuryRate)
    const casualties = fatalities + survivorsWithInjuries
    
    return {
      name: zone.name,
      radius: zone.radius,
      casualties,
      survivorsWithInjuries,
      fatalities,
      totalPopulation,
      averageDensity: density
    }
  })
}

// Comprehensive casualty calculation for conventional bombs
export function calculateConventionalCasualties(
  centerLat: number,
  centerLng: number,
  yield_kt: number,
  density: number = 10000 // people per km²
) {
  // Conventional bombs have different blast patterns - more focused, less thermal/radiation
  const blastRadius = 0.8 * Math.pow(yield_kt, 0.33) // Smaller than nuclear
  const severeRadius = 0.3 * Math.pow(yield_kt, 0.33) // Close-in destruction
  const fragmentationRadius = 1.2 * Math.pow(yield_kt, 0.33) // Fragmentation zone
  
  const zones = [
    {
      name: 'Direct blast',
      radius: severeRadius,
      mortalityRate: 0.95,
      injuryRate: 0.05
    },
    {
      name: 'Severe blast damage',
      radius: blastRadius,
      mortalityRate: 0.60,
      injuryRate: 0.35
    },
    {
      name: 'Fragmentation zone',
      radius: fragmentationRadius,
      mortalityRate: 0.15,
      injuryRate: 0.50
    }
  ]
  
  return calculateDensityBasedCasualties(density, zones)
}

// Comprehensive casualty calculation for nuclear detonation
export function calculateNuclearCasualties(
  centerLat: number,
  centerLng: number,
  yield_kt: number,
  burstType: 'air' | 'surface' = 'air',
  density: number = 10000 // people per km²
) {
  // Use proper blast calculations that account for burst type
  const fireballRadius = calculateFireball(yield_kt, burstType)
  const airBlast = calculateAirBlast(yield_kt, burstType)
  const thermal = calculateThermalRadiation(yield_kt, burstType)
  const falloutRadius = calculateFallout(yield_kt, burstType)
  
  // Define effect zones with realistic mortality/injury rates
  const zones = [
    {
      name: 'Fireball',
      radius: fireballRadius,
      mortalityRate: 1.0,
      injuryRate: 0.0
    },
    {
      name: 'Severe blast damage',
      radius: airBlast.severe, 
      mortalityRate: 0.98,
      injuryRate: 0.02
    },
    {
      name: 'Moderate blast damage',
      radius: airBlast.moderate,
      mortalityRate: 0.50,
      injuryRate: 0.40
    },
    {
      name: 'Light blast damage', 
      radius: airBlast.light,
      mortalityRate: 0.05,
      injuryRate: 0.45
    },
    {
      name: '3rd degree burns',
      radius: thermal.thirdDegree,
      mortalityRate: 0.95,
      injuryRate: 0.05
    },
    {
      name: '2nd degree burns',
      radius: thermal.secondDegree,
      mortalityRate: 0.20,
      injuryRate: 0.70
    }
  ]
  
  // Add significant fallout zone for surface bursts (or minimal for air bursts)
  if (falloutRadius > 0.1) { // Only add if meaningful
    zones.push({
      name: 'Fallout (lethal)',
      radius: falloutRadius,
      mortalityRate: burstType === 'surface' ? 0.50 : 0.10, // Much higher mortality for surface burst
      injuryRate: burstType === 'surface' ? 0.40 : 0.20
    })
  }
  
  return calculateDensityBasedCasualties(density, zones)
}

// Main blast results calculation for the app
export function calculateBlastResults(yield_kt: number, burstType: 'air' | 'surface' = 'air') {
  const fireballRadius = calculateFireball(yield_kt, burstType)
  const airBlast = calculateAirBlast(yield_kt, burstType)
  const thermal = calculateThermalRadiation(yield_kt, burstType)
  const falloutRadius = calculateFallout(yield_kt, burstType)
  
  // Return structure that matches BlastResults interface
  return {
    fireball: {
      radius: fireballRadius,
      casualties: 0,
      fatalities: 0,
      survivorsWithInjuries: 0,
      totalPopulation: 0,
      averageDensity: 0,
      description: burstType === 'air' ? 'Complete vaporization zone' : 'Ground zero destruction'
    },
    airBlast: {
      severe: {
        radius: airBlast.severe,
        casualties: 0,
        fatalities: 0,
        survivorsWithInjuries: 0,
        totalPopulation: 0,
        averageDensity: 0
      },
      moderate: {
        radius: airBlast.moderate,
        casualties: 0,
        fatalities: 0,
        survivorsWithInjuries: 0,
        totalPopulation: 0,
        averageDensity: 0
      },
      light: {
        radius: airBlast.light,
        casualties: 0,
        fatalities: 0,
        survivorsWithInjuries: 0,
        totalPopulation: 0,
        averageDensity: 0
      }
    },
    thermalRadiation: {
      thirdDegree: {
        radius: thermal.thirdDegree,
        casualties: 0,
        fatalities: 0,
        survivorsWithInjuries: 0,
        totalPopulation: 0,
        averageDensity: 0
      },
      secondDegree: {
        radius: thermal.secondDegree,
        casualties: 0,
        fatalities: 0,
        survivorsWithInjuries: 0,
        totalPopulation: 0,
        averageDensity: 0
      }
    },
    fallout: falloutRadius > 0.1 ? {
      radius: falloutRadius,
      casualties: 0,
      fatalities: 0,
      survivorsWithInjuries: 0,
      totalPopulation: 0,
      averageDensity: 0,
      affectedPopulation: 0
    } : undefined,
    totalCasualties: 0,
    totalFatalities: 0,
    totalSurvivorsWithInjuries: 0,
    affectedPopulation: 0,
    casualtyZones: []
  }
}

// Mortality rates by blast type (legacy)
export const MORTALITY_RATES = {
  fireball: 1.0,
  severe: 0.98,
  moderate: 0.50,
  light: 0.05,
  thermal3rd: 0.95,
  thermal2nd: 0.20,
  fallout: 0.30
}