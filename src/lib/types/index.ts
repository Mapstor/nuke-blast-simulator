// lib/types/index.ts
export interface Bomb {
  id: string
  name: string
  yield: number // kilotons (TNT equivalent for conventional bombs)
  type: 'fission' | 'fusion' | 'thermonuclear' | 'conventional'
  country: string
  year?: number
  description: string
}

export interface Location {
  lat: number
  lng: number
  name?: string
  population?: number
  density?: number // per km² - we'll estimate this from OSM data
}

export interface EffectZone {
  radius: number // km
  casualties: number
  fatalities: number
  survivorsWithInjuries: number
  totalPopulation: number
  averageDensity: number
}

export interface BlastResults {
  fireball: {
    radius: number // km
    casualties: number
    fatalities: number
    survivorsWithInjuries: number
    totalPopulation: number
    averageDensity: number
    description: string
  }
  airBlast: {
    severe: EffectZone // 20 PSI
    moderate: EffectZone // 5 PSI  
    light: EffectZone // 1 PSI
  }
  thermalRadiation: {
    thirdDegree: EffectZone
    secondDegree: EffectZone
  }
  fallout?: {
    radius: number
    casualties: number
    fatalities: number
    survivorsWithInjuries: number
    totalPopulation: number
    averageDensity: number
    affectedPopulation: number
  }
  totalCasualties: number
  totalFatalities: number
  totalSurvivorsWithInjuries: number
  affectedPopulation: number
  // Enhanced casualty breakdown by zone
  casualtyZones: Array<{
    name: string
    radius: number
    casualties: number
    fatalities: number
    survivorsWithInjuries: number
    totalPopulation: number
    averageDensity: number
  }>
}