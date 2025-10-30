// NASA SEDAC (Socioeconomic Data and Applications Center) API
// Provides high-resolution gridded population data globally
// GPWv4: Gridded Population of the World Version 4

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

// Get location name from coordinates using Nominatim
async function getLocationInfo(lat: number, lng: number): Promise<{name: string, country: string, type: string}> {
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
    
    // Determine location type and name
    let locationName = 'Unknown location'
    let country = data.address?.country || 'Unknown'
    let locationType = 'land'
    
    // Check if it's water - comprehensive check
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
      (!data.address || Object.keys(data.address).length <= 1) // Only country or nothing
    
    if (isWater) {
      locationName = data.name || 'Ocean'
      country = 'International Waters'
      locationType = 'water'
    }
    // Get most specific location name
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
    } else if (data.address?.hamlet) {
      locationName = data.address.hamlet
    } else if (data.address?.county) {
      locationName = data.address.county
    } else if (data.address?.state) {
      locationName = data.address.state
    } else if (data.name) {
      locationName = data.name
    }
    
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

// NASA SEDAC GPWv4 Population Density API
async function getNASAPopulationDensity(lat: number, lng: number): Promise<number | null> {
  try {
    // NASA SEDAC provides population density data
    // Using their WMS GetFeatureInfo service to query point data
    const baseUrl = 'https://sedac.ciesin.columbia.edu/geoserver/wms'
    
    // GPWv4 2020 population density layer
    const layer = 'gpw-v4:gpw-v4-population-density-rev11_2020'
    
    // Convert lat/lng to Web Mercator for the query
    const x = lng
    const y = lat
    
    // Build GetFeatureInfo request
    const params = new URLSearchParams({
      'SERVICE': 'WMS',
      'VERSION': '1.1.1',
      'REQUEST': 'GetFeatureInfo',
      'LAYERS': layer,
      'QUERY_LAYERS': layer,
      'INFO_FORMAT': 'application/json',
      'X': '50',
      'Y': '50',
      'WIDTH': '101',
      'HEIGHT': '101',
      'SRS': 'EPSG:4326',
      'BBOX': `${x-0.01},${y-0.01},${x+0.01},${y+0.01}`
    })
    
    const response = await fetch(`${baseUrl}?${params}`)
    
    if (!response.ok) {
      console.warn('NASA SEDAC API request failed')
      return null
    }
    
    const data = await response.json()
    
    // Extract population density from response
    if (data.features && data.features.length > 0) {
      const properties = data.features[0].properties
      // The property name varies, but typically includes 'GRAY_INDEX' or similar
      const density = properties.GRAY_INDEX || properties.value || properties.population_density
      
      if (density !== undefined && density !== null) {
        // NASA SEDAC returns persons per km²
        return Math.round(density)
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching NASA SEDAC data:', error)
    
    // Try alternative approach using raster value
    try {
      // Alternative endpoint using direct raster query
      const url = `https://sedac.ciesin.columbia.edu/arcgis/rest/services/sedac/gpw-v4-population-density-rev11/MapServer/identify?` +
        `geometry=${lng},${lat}&geometryType=esriGeometryPoint&sr=4326&layers=all&tolerance=1&` +
        `mapExtent=${lng-0.1},${lat-0.1},${lng+0.1},${lat+0.1}&imageDisplay=100,100,96&returnGeometry=false&f=json`
      
      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          const value = data.results[0].attributes?.['Pixel Value']
          if (value && value > 0) {
            return Math.round(value)
          }
        }
      }
    } catch (altError) {
      console.error('Alternative NASA request also failed:', altError)
    }
    
    return null
  }
}

// Fallback: Use OpenStreetMap data to estimate density
async function estimateFromOSM(lat: number, lng: number, locationInfo: any): Promise<number> {
  try {
    // Query Overpass API for nearby buildings/residential areas
    const overpassUrl = 'https://overpass-api.de/api/interpreter'
    const radius = 1000 // 1km radius
    
    const query = `
      [out:json][timeout:5];
      (
        way["building"](around:${radius},${lat},${lng});
        way["landuse"="residential"](around:${radius},${lat},${lng});
        node["place"~"city|town|village"](around:${radius},${lat},${lng});
      );
      out count;
    `
    
    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`
    })
    
    if (response.ok) {
      const data = await response.json()
      const buildingCount = data.elements?.length || 0
      
      // Estimate density based on building count
      if (buildingCount > 500) return 5000  // Dense urban
      if (buildingCount > 200) return 2000  // Urban
      if (buildingCount > 100) return 1000  // Suburban
      if (buildingCount > 50) return 500    // Town
      if (buildingCount > 10) return 200    // Village
      if (buildingCount > 0) return 50      // Rural with some buildings
      return 10 // Very rural
    }
  } catch (error) {
    console.error('OSM estimation failed:', error)
  }
  
  // Final fallback based on location type
  const name = locationInfo.name.toLowerCase()
  if (name.includes('city') || name.includes('downtown')) return 3000
  if (name.includes('town')) return 1000
  if (name.includes('suburb')) return 1500
  if (name.includes('village')) return 300
  if (name.includes('county')) return 200
  if (name.includes('forest') || name.includes('desert')) return 5
  return 100 // Default rural
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
        distance: 0,
        isUrban: false
      }
      populationCache.set(cacheKey, result)
      return result
    }
    
    // Try to get actual population density from NASA SEDAC
    let density = await getNASAPopulationDensity(lat, lng)
    
    // If NASA fails, try OSM estimation
    if (density === null || density === 0) {
      console.log('NASA SEDAC returned no data, using OSM estimation')
      density = await estimateFromOSM(lat, lng, locationInfo)
    }
    
    // Ensure we have a valid density
    if (density === null || density < 0) {
      density = 100 // Default fallback
    }
    
    // Round density to avoid too many decimal places
    density = Math.round(density)
    
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
    
    // Log for debugging
    console.log(`Population density for ${locationInfo.name}: ${density}/km²`)
    
    populationCache.set(cacheKey, result)
    return result
    
  } catch (error) {
    console.error('Error in getPopulationDensity:', error)
    
    // Final fallback
    const fallback: PopulationData = {
      cityName: 'Unknown location',
      population: 0,
      density: 500, // Conservative estimate
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
    return `${data.cityName} (Town)`
  } else if (data.density > 10) {
    return `${data.cityName} (Rural)`
  } else {
    return `${data.cityName} (Remote)`
  }
}