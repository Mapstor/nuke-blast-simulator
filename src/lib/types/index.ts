// lib/types/index.ts
export interface Bomb {
  id: string
  name: string
  yield: number // kilotons. For conventional bombs this is the explosive weight
  // expressed in kt-equivalent (weight_t / 1000) and `measure` says how to show it.
  type: 'fission' | 'fusion' | 'thermonuclear' | 'conventional'
  country: string
  year?: number
  description: string
  sources?: string[] // NBS-005 citation source ids (research/sources.csv)
  // NBS-016: conventional-bomb presentation. The citation audit found that most
  // conventional pages stated their explosive FILL weight as if it were a TNT
  // yield. `measure` distinguishes a bare fill weight (no published TNT
  // equivalent) from a source-stated TNT equivalent (or a claimed one). `filler`
  // names the explosive where a source gives it. `kind` marks the Halifax
  // Explosion as an accidental historical explosion, not a weapon.
  measure?: 'fill' | 'tnt-equivalent' | 'claimed-tnt'
  filler?: string
  kind?: 'weapon' | 'historical-explosion'
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