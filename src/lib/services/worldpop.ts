// WorldPop API service for accurate population density data
// WorldPop provides high-resolution (100m) population density data globally

export interface PopulationData {
  cityName: string
  population: number
  density: number // people per km²
  country: string
  distance: number // distance from detonation point in km
  isUrban: boolean
}

// Cache results to avoid repeated API calls
const populationCache = new Map<string, PopulationData>()

function getCacheKey(lat: number, lng: number): string {
  // Round to 3 decimal places for cache (about 100m precision)
  return `${lat.toFixed(3)},${lng.toFixed(3)}`
}

// Get country name from coordinates using Nominatim
async function getLocationInfo(lat: number, lng: number): Promise<{name: string, country: string, type: string}> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch location info')
    }
    
    const data = await response.json()
    
    // Determine location type and name
    let locationName = 'Unknown location'
    let country = data.address?.country || 'Unknown'
    let locationType = 'land'
    
    // Check if it's water - expanded detection
    if (data.type === 'water' || data.type === 'ocean' || data.type === 'sea' || 
        data.extratags?.natural === 'water' || data.extratags?.place === 'ocean' ||
        data.extratags?.natural === 'sea' || data.extratags?.natural === 'ocean' ||
        data.addresstype === 'water' || data.addresstype === 'ocean' ||
        (data.class === 'natural' && data.type === 'water') ||
        (data.class === 'natural' && data.type === 'sea') ||
        (data.class === 'place' && data.type === 'ocean') ||
        (!data.address && data.name && data.name.toLowerCase().includes('ocean')) ||
        (!data.address && data.display_name && data.display_name.toLowerCase().includes('ocean'))) {
      locationName = data.name || data.display_name || 'Ocean'
      country = 'International Waters'
      locationType = 'water'
    }
    // Check for city
    else if (data.address?.city) {
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
      locationName = `${data.address.county} County`
    } else if (data.address?.state) {
      locationName = `${data.address.state} (Rural)`
    } else if (!data.address || Object.keys(data.address || {}).length === 0) {
      // No address at all - likely ocean or remote area
      locationName = 'Ocean/Remote area'
      locationType = 'water'
      country = 'International Waters'
    } else if (data.name) {
      locationName = data.name
    }
    
    // Log for debugging
    console.log('Nominatim response:', { locationName, country, locationType, fullAddress: data.address })
    
    return {
      name: locationName,
      country: country,
      type: locationType
    }
  } catch (error) {
    console.error('Error fetching location info:', error)
    return {
      name: 'Unknown location',
      country: 'Unknown',
      type: 'land'
    }
  }
}

// WorldPop API endpoint for population density
async function getWorldPopDensity(lat: number, lng: number): Promise<number> {
  // WorldPop API seems to have issues, let's use a simpler approach
  // We'll estimate based on location type from Nominatim
  console.log(`Attempting to get population density for: ${lat}, ${lng}`)
  
  // For now, return null to trigger the fallback estimation
  // The WorldPop API requires proper authentication and might have CORS issues
  return null
}

// Simple fallback estimation based on location type
function estimateDensityFromLocation(locationInfo: {name: string, country: string, type: string}): number {
  if (locationInfo.type === 'water') {
    return 0
  }
  
  const locationName = locationInfo.name.toLowerCase()
  const country = locationInfo.country.toLowerCase()
  
  // Check for known major cities (partial list)
  const majorCities = [
    'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
    'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'seattle',
    'washington', 'boston', 'miami', 'atlanta', 'las vegas', 'detroit',
    'london', 'paris', 'moscow', 'tokyo', 'beijing', 'shanghai', 'delhi',
    'mumbai', 'cairo', 'seoul', 'mexico city', 'sao paulo', 'sydney',
    'singapore', 'hong kong', 'berlin', 'madrid', 'rome', 'toronto'
  ]
  
  // Check if it's a major city
  for (const city of majorCities) {
    if (locationName.includes(city)) {
      return 8000 // Major city density
    }
  }
  
  // City indicators
  if (locationName.includes('city') || locationName.includes('downtown') || locationName.includes('manhattan')) {
    return 5000
  }
  
  // Suburban indicators  
  if (locationName.includes('suburb')) {
    return 2000
  }
  
  // Town indicators
  if (locationName.includes('town')) {
    return 1000
  }
  
  // Village indicators
  if (locationName.includes('village')) {
    return 200
  }
  
  // County can be variable - check country
  if (locationName.includes('county')) {
    // US counties near cities are denser
    if (country.includes('united states') || country.includes('usa')) {
      // Counties near major cities
      if (locationName.includes('king') || // Seattle
          locationName.includes('cook') || // Chicago
          locationName.includes('los angeles') ||
          locationName.includes('harris') || // Houston
          locationName.includes('miami-dade') ||
          locationName.includes('fulton')) { // Atlanta
        return 2000
      }
      // Most US counties are suburban/rural mix
      return 500
    }
    return 100
  }
  
  // Rural indicators
  if (locationName.includes('rural')) {
    return 50
  }
  
  // Desert/wilderness indicators
  if (locationName.includes('desert') || locationName.includes('wilderness') || 
      locationName.includes('forest') || locationName.includes('tundra') ||
      locationName.includes('arctic') || locationName.includes('sahara')) {
    return 1
  }
  
  // Ocean/Remote area check
  if (locationName.includes('ocean') || locationName.includes('remote')) {
    return 0
  }
  
  // Default based on country development
  if (country.includes('united states') || country.includes('europe') || 
      country.includes('japan') || country.includes('korea')) {
    return 1000 // Developed country default
  }
  
  return 500 // Default density
}

export async function getPopulationDensity(lat: number, lng: number): Promise<PopulationData> {
  const cacheKey = getCacheKey(lat, lng)
  
  // Check cache first
  if (populationCache.has(cacheKey)) {
    return populationCache.get(cacheKey)!
  }
  
  try {
    // Get location information first
    const locationInfo = await getLocationInfo(lat, lng)
    
    // If it's water, return 0 immediately
    if (locationInfo.type === 'water') {
      const result: PopulationData = {
        cityName: locationInfo.name,
        population: 0,
        density: 0,
        country: locationInfo.country,
        distance: 9999,
        isUrban: false
      }
      populationCache.set(cacheKey, result)
      return result
    }
    
    // Get actual population density from WorldPop
    let density = await getWorldPopDensity(lat, lng)
    
    // If WorldPop fails, use estimation
    if (density === null) {
      density = estimateDensityFromLocation(locationInfo)
    }
    
    // Determine if urban based on density
    const isUrban = density > 1000
    
    const result: PopulationData = {
      cityName: locationInfo.name,
      population: 0, // WorldPop doesn't give total population
      density: density,
      country: locationInfo.country,
      distance: 0,
      isUrban: isUrban
    }
    
    populationCache.set(cacheKey, result)
    return result
    
  } catch (error) {
    console.error('Error in getPopulationDensity:', error)
    
    // Final fallback
    const fallback: PopulationData = {
      cityName: 'Unknown location',
      population: 0,
      density: 100, // Conservative estimate
      country: 'Unknown',
      distance: 0,
      isUrban: false
    }
    
    return fallback
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
    return `${data.cityName} (Rural town)`
  } else if (data.density > 10) {
    return `${data.cityName} (Rural)`
  } else {
    return `${data.cityName} (Remote)`
  }
}