// GeoNames API service for population data
// Free tier allows 30,000 credits/day, 2000 credits/hour
// You need to register at http://www.geonames.org/export/web-services.html

const GEONAMES_USERNAME = 'nukeblastsim' // You should register and get your own username

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
  // Round to 2 decimal places for cache (about 1km precision)
  return `${lat.toFixed(2)},${lng.toFixed(2)}`
}

export async function getPopulationDensity(lat: number, lng: number): Promise<PopulationData> {
  const cacheKey = getCacheKey(lat, lng)
  
  // Check cache first
  if (populationCache.has(cacheKey)) {
    return populationCache.get(cacheKey)!
  }

  try {
    // Find nearby cities using GeoNames findNearbyPlaceName
    const response = await fetch(
      `https://secure.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&radius=50&maxRows=10&cities=cities1000&username=${GEONAMES_USERNAME}`
    )
    
    if (!response.ok) {
      console.warn('GeoNames API returned error, using fallback')
      throw new Error('API request failed')
    }
    
    const data = await response.json()
    
    if (data.geonames && data.geonames.length > 0) {
      // Get the closest city
      const nearestCity = data.geonames[0]
      
      // Calculate distance from detonation point
      const distance = calculateDistance(lat, lng, parseFloat(nearestCity.lat), parseFloat(nearestCity.lng))
      
      // Estimate population density based on city population and distance
      const population = parseInt(nearestCity.population) || 0
      let density: number
      
      if (distance < 1) {
        // Within city center
        if (population > 5000000) {
          density = 10000 // Megacity core (Tokyo, NYC, etc)
        } else if (population > 1000000) {
          density = 5000 // Major city core
        } else if (population > 500000) {
          density = 3000 // Large city
        } else if (population > 100000) {
          density = 2000 // Medium city
        } else {
          density = 1000 // Small city
        }
      } else if (distance < 5) {
        // Near city (likely urban/suburban)
        density = Math.max(500, (population / 1000000) * 2000 / distance)
      } else if (distance < 20) {
        // Suburban/rural transition
        density = Math.max(100, (population / 1000000) * 1000 / distance)
      } else {
        // Rural area
        density = Math.max(10, 100 / distance)
      }
      
      const result: PopulationData = {
        cityName: nearestCity.name,
        population: population,
        density: Math.round(density),
        country: nearestCity.countryName || nearestCity.countryCode,
        distance: distance,
        isUrban: distance < 5 && population > 100000
      }
      
      // Cache the result
      populationCache.set(cacheKey, result)
      
      return result
    } else {
      // No cities found nearby - likely ocean or uninhabited area
      const result: PopulationData = {
        cityName: 'Uninhabited area',
        population: 0,
        density: 0, // Zero density for ocean/desert
        country: 'International waters',
        distance: 999,
        isUrban: false
      }
      
      populationCache.set(cacheKey, result)
      return result
    }
  } catch (error) {
    console.error('Error fetching population data:', error)
    
    // Fallback to default urban density
    const fallback: PopulationData = {
      cityName: 'Unknown location',
      population: 0,
      density: 3000, // Default urban density
      country: 'Unknown',
      distance: 0,
      isUrban: true
    }
    
    return fallback
  }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Get population context string for UI
export function getPopulationContext(data: PopulationData): string {
  if (data.distance < 1) {
    return `${data.cityName} city center`
  } else if (data.distance < 5) {
    return `Near ${data.cityName}`
  } else if (data.distance < 20) {
    return `${Math.round(data.distance)} km from ${data.cityName}`
  } else {
    return data.cityName // Will be "Rural area" or actual distant city name
  }
}