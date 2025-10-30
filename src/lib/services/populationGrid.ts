// Population grid lookup service
// Uses pre-computed population density grid for instant, accurate results worldwide

import populationGrid from '@/lib/data/worldPopulationGrid.json'

export interface PopulationData {
  cityName: string
  population: number
  density: number // people per km²
  country: string
  distance: number // distance from detonation point in km
  isUrban: boolean
}

// Cache for location names
const locationCache = new Map<string, {name: string, country: string}>()

function getCacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`
}

// Get location name from coordinates using Nominatim
async function getLocationInfo(lat: number, lng: number): Promise<{name: string, country: string, isWater: boolean}> {
  const cacheKey = getCacheKey(lat, lng)
  
  // Check cache first
  if (locationCache.has(cacheKey)) {
    const cached = locationCache.get(cacheKey)!
    return { ...cached, isWater: false }
  }
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      {
        headers: {
          'User-Agent': 'NukeBlastSimulator/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch location info')
    }
    
    const data = await response.json()
    
    // Check if it's water
    const isWater = 
      data.type === 'water' || 
      data.type === 'ocean' || 
      data.type === 'sea' ||
      data.class === 'natural' && data.type === 'water' ||
      data.class === 'natural' && data.type === 'coastline' ||
      data.class === 'place' && data.type === 'ocean' ||
      data.class === 'place' && data.type === 'sea' ||
      data.extratags?.natural === 'water' ||
      data.extratags?.place === 'ocean' ||
      (!data.address || Object.keys(data.address).length <= 1)
    
    if (isWater) {
      const result = {
        name: data.name || 'Ocean',
        country: 'International Waters',
        isWater: true
      }
      return result
    }
    
    // Get location name
    let locationName = 'Unknown location'
    if (data.address?.city) {
      locationName = data.address.city
    } else if (data.address?.town) {
      locationName = data.address.town
    } else if (data.address?.village) {
      locationName = data.address.village
    } else if (data.address?.suburb) {
      locationName = data.address.suburb
    } else if (data.address?.neighbourhood) {
      locationName = data.address.neighbourhood
    } else if (data.address?.county) {
      locationName = data.address.county
    } else if (data.address?.state) {
      locationName = data.address.state
    } else if (data.name) {
      locationName = data.name
    }
    
    const country = data.address?.country || 'Unknown'
    
    // Cache the result
    locationCache.set(cacheKey, { name: locationName, country })
    
    return {
      name: locationName,
      country: country,
      isWater: false
    }
  } catch (error) {
    console.error('Error fetching location info:', error)
    return {
      name: 'Unknown location',
      country: 'Unknown',
      isWater: false
    }
  }
}

// Look up population density from pre-computed grid
function getGridDensity(lat: number, lng: number): number {
  // Round to nearest grid cell
  const resolution = populationGrid.resolution
  const gridLat = (Math.round(lat / resolution) * resolution).toFixed(2)
  const gridLng = (Math.round(lng / resolution) * resolution).toFixed(2)
  
  // Look up in grid
  const latBand = populationGrid.data[gridLat]
  if (latBand && latBand[gridLng]) {
    return latBand[gridLng]
  }
  
  // Check nearby cells (interpolation)
  const nearbyOffsets = [
    [-resolution, 0], [resolution, 0],
    [0, -resolution], [0, resolution],
    [-resolution, -resolution], [resolution, resolution],
    [-resolution, resolution], [resolution, -resolution]
  ]
  
  let totalDensity = 0
  let count = 0
  
  for (const [dLat, dLng] of nearbyOffsets) {
    const checkLat = (parseFloat(gridLat) + dLat).toFixed(2)
    const checkLng = (parseFloat(gridLng) + dLng).toFixed(2)
    const checkBand = populationGrid.data[checkLat]
    
    if (checkBand && checkBand[checkLng]) {
      totalDensity += checkBand[checkLng]
      count++
    }
  }
  
  if (count > 0) {
    return Math.round(totalDensity / count)
  }
  
  // Default based on latitude (generally less populated at extremes)
  const absLat = Math.abs(lat)
  if (absLat > 70) return 1  // Arctic/Antarctic
  if (absLat > 60) return 5  // Far north/south
  if (absLat > 50) return 20 // Northern regions
  
  // Check if likely ocean (far from any populated areas)
  const hasNearbyPopulation = nearbyOffsets.some(([dLat, dLng]) => {
    const checkLat = (parseFloat(gridLat) + dLat * 5).toFixed(2)
    const checkLng = (parseFloat(gridLng) + dLng * 5).toFixed(2)
    const checkBand = populationGrid.data[checkLat]
    return checkBand && checkBand[checkLng] && checkBand[checkLng] > 0
  })
  
  if (!hasNearbyPopulation) {
    return 0 // Likely ocean or very remote
  }
  
  return 10 // Default sparse population
}

export async function getPopulationDensity(lat: number, lng: number): Promise<PopulationData> {
  try {
    // Get location information
    const locationInfo = await getLocationInfo(lat, lng)
    
    // If it's water, return 0 immediately
    if (locationInfo.isWater) {
      return {
        cityName: locationInfo.name,
        population: 0,
        density: 0,
        country: locationInfo.country,
        distance: 0,
        isUrban: false
      }
    }
    
    // Get density from grid
    const density = getGridDensity(lat, lng)
    
    // Determine if urban based on density
    const isUrban = density > 1000
    
    const result: PopulationData = {
      cityName: locationInfo.name,
      population: 0, // We don't have total population
      density: density,
      country: locationInfo.country,
      distance: 0,
      isUrban: isUrban
    }
    
    console.log(`Population at ${locationInfo.name}: ${density}/km²`)
    
    return result
    
  } catch (error) {
    console.error('Error in getPopulationDensity:', error)
    
    // Fallback - try grid only
    const density = getGridDensity(lat, lng)
    
    return {
      cityName: 'Location',
      population: 0,
      density: density,
      country: 'Unknown',
      distance: 0,
      isUrban: density > 1000
    }
  }
}

// Get population context string for UI
export function getPopulationContext(data: PopulationData): string {
  if (data.density === 0) {
    return data.cityName
  } else if (data.density > 10000) {
    return `${data.cityName} (Dense urban)`
  } else if (data.density > 5000) {
    return `${data.cityName} (Urban core)`
  } else if (data.density > 1000) {
    return `${data.cityName} (Urban)`
  } else if (data.density > 500) {
    return `${data.cityName} (Suburban)`
  } else if (data.density > 100) {
    return `${data.cityName} (Town)`
  } else if (data.density > 10) {
    return `${data.cityName} (Rural)`
  } else {
    return `${data.cityName} (Remote)`
  }
}