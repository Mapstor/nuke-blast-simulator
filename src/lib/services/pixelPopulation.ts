// Pixel-based population service using NASA GPWv4 data
// Provides exact population counts for any 1km² area on Earth

import populationPixels from '@/lib/data/populationPixels.json'

export interface PopulationPixel {
  lat: number
  lng: number
  pop: number
}

export interface CasualtyZone {
  name: string
  radius: number
  casualties: number
  survivorsWithInjuries: number
  fatalities: number
  totalPopulation: number
  averageDensity: number
}

class PixelPopulationService {
  private pixels: PopulationPixel[] = []
  private pixelIndex: Map<string, PopulationPixel> = new Map()
  
  constructor() {
    this.loadPixelData()
  }
  
  private loadPixelData() {
    console.log('Loading NASA GPWv4 pixel data...')
    
    // Decompress delta-encoded data
    const compressed = populationPixels as any
    let currentLat = 0
    let currentLng = 0
    
    for (const [deltaLat, deltaLng, pop] of compressed.data) {
      currentLat += deltaLat / 1000
      currentLng += deltaLng / 1000
      
      const pixel: PopulationPixel = {
        lat: Math.round(currentLat * 1000) / 1000,
        lng: Math.round(currentLng * 1000) / 1000,
        pop: pop
      }
      
      this.pixels.push(pixel)
      this.pixelIndex.set(this.getPixelKey(pixel.lat, pixel.lng), pixel)
    }
    
    console.log(`Loaded ${this.pixels.length} population pixels`)
  }
  
  private getPixelKey(lat: number, lng: number): string {
    // Round to pixel resolution (~1km)
    const pixelLat = Math.round(lat * 120) / 120 // ~1km resolution
    const pixelLng = Math.round(lng * 120) / 120
    return `${pixelLat.toFixed(3)},${pixelLng.toFixed(3)}`
  }
  
  // Get population for a specific pixel
  getPixelPopulation(lat: number, lng: number): number {
    const key = this.getPixelKey(lat, lng)
    const pixel = this.pixelIndex.get(key)
    return pixel ? pixel.pop : 0
  }
  
  // Get all pixels within a radius (in km)
  getPixelsInRadius(centerLat: number, centerLng: number, radiusKm: number): PopulationPixel[] {
    const result: PopulationPixel[] = []
    
    // Convert radius to degrees (approximate)
    const radiusDeg = radiusKm / 111
    
    // Search within bounding box
    const minLat = centerLat - radiusDeg
    const maxLat = centerLat + radiusDeg
    const minLng = centerLng - radiusDeg
    const maxLng = centerLng + radiusDeg
    
    for (const pixel of this.pixels) {
      if (pixel.lat >= minLat && pixel.lat <= maxLat &&
          pixel.lng >= minLng && pixel.lng <= maxLng) {
        
        // Calculate actual distance
        const distance = this.calculateDistance(
          centerLat, centerLng, pixel.lat, pixel.lng
        )
        
        if (distance <= radiusKm) {
          result.push({
            ...pixel,
            distance
          } as any)
        }
      }
    }
    
    return result
  }
  
  // Calculate distance between two points in km
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  // Calculate casualties for multiple effect zones
  calculateCasualtiesForZones(
    centerLat: number, 
    centerLng: number, 
    zones: Array<{name: string, radius: number, mortality: number, injury: number}>
  ): CasualtyZone[] {
    const results: CasualtyZone[] = []
    
    for (const zone of zones) {
      const pixels = this.getPixelsInRadius(centerLat, centerLng, zone.radius)
      
      let totalPopulation = 0
      let casualties = 0
      let fatalities = 0
      let survivorsWithInjuries = 0
      
      for (const pixel of pixels) {
        const pixelPop = pixel.pop
        totalPopulation += pixelPop
        
        // Calculate mortality and injury rates based on distance from center
        const distance = (pixel as any).distance
        const distanceFactor = Math.max(0, 1 - (distance / zone.radius))
        
        // Apply distance-adjusted mortality and injury rates
        const adjustedMortality = zone.mortality * distanceFactor
        const adjustedInjury = zone.injury * distanceFactor
        
        const pixelFatalities = Math.round(pixelPop * adjustedMortality)
        const pixelInjuries = Math.round(pixelPop * adjustedInjury)
        const pixelCasualties = pixelFatalities + pixelInjuries
        
        fatalities += pixelFatalities
        survivorsWithInjuries += pixelInjuries
        casualties += pixelCasualties
      }
      
      results.push({
        name: zone.name,
        radius: zone.radius,
        casualties,
        survivorsWithInjuries,
        fatalities,
        totalPopulation,
        averageDensity: totalPopulation > 0 ? Math.round(totalPopulation / (Math.PI * zone.radius * zone.radius)) : 0
      })
    }
    
    return results
  }
  
  // Get population density at a specific point
  getPopulationDensity(lat: number, lng: number): number {
    // Get population in 1km² pixel
    return this.getPixelPopulation(lat, lng)
  }
  
  // Get total population within radius
  getTotalPopulationInRadius(centerLat: number, centerLng: number, radiusKm: number): number {
    const pixels = this.getPixelsInRadius(centerLat, centerLng, radiusKm)
    return pixels.reduce((total, pixel) => total + pixel.pop, 0)
  }
}

// Singleton instance
const pixelPopulationService = new PixelPopulationService()

export { pixelPopulationService }
export default pixelPopulationService