// Simple population density estimation based on major cities
// No external API required - works offline

export interface PopulationData {
  cityName: string
  population: number
  density: number // people per km²
  country: string
  distance: number // distance from detonation point in km
  isUrban: boolean
}

// Major world cities with population data
const MAJOR_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, population: 37400000, density: 15000 },
  { name: 'New York City', country: 'USA', lat: 40.7128, lng: -74.0060, population: 8336000, density: 11000 },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, population: 3990000, density: 3200 },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, population: 2716000, density: 4600 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, population: 9000000, density: 5700 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, population: 2161000, density: 21000 },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, population: 12500000, density: 4900 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, population: 21540000, density: 12000 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, population: 26320000, density: 16000 },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, population: 20400000, density: 32000 },
  { name: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025, population: 31000000, density: 20000 },
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, population: 22400000, density: 8000 },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, population: 21900000, density: 6000 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, population: 20900000, density: 19000 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, population: 9700000, density: 16000 },
  { name: 'Washington DC', country: 'USA', lat: 38.9072, lng: -77.0369, population: 700000, density: 4300 },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, population: 873000, density: 7200 },
  { name: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589, population: 690000, density: 5500 },
  { name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, population: 470000, density: 5000 },
  { name: 'Phoenix', country: 'USA', lat: 33.4484, lng: -112.0740, population: 1680000, density: 1200 },
  { name: 'Houston', country: 'USA', lat: 29.7604, lng: -95.3698, population: 2320000, density: 1400 },
  { name: 'Philadelphia', country: 'USA', lat: 39.9526, lng: -75.1652, population: 1580000, density: 4500 },
  { name: 'Las Vegas', country: 'USA', lat: 36.1699, lng: -115.1398, population: 650000, density: 1800 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, population: 3800000, density: 4200 },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, population: 3300000, density: 5400 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, population: 2900000, density: 2200 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, population: 5300000, density: 2100 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, population: 5700000, density: 8300 },
  { name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, population: 7500000, density: 7100 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, population: 3300000, density: 1800 },
  { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, population: 460000, density: 8500 },
  { name: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.3890, population: 9000000, density: 11800 },
  { name: 'Baghdad', country: 'Iraq', lat: 33.3152, lng: 44.3661, population: 7200000, density: 6800 },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, population: 7600000, density: 4000 },
  { name: 'Pyongyang', country: 'North Korea', lat: 39.0392, lng: 125.7625, population: 2900000, density: 4600 },
  { name: 'Kiev', country: 'Ukraine', lat: 50.4501, lng: 30.5234, population: 3000000, density: 3600 },
  { name: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122, population: 1800000, density: 3400 },
]

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

// Check if point is over water (simple heuristic based on major water bodies)
function isOverWater(lat: number, lng: number): boolean {
  // Pacific Ocean
  if (lng > 140 || lng < -120) {
    if (lat < 60 && lat > -60) {
      // Check if not near Asian or American coasts
      const distToAsia = Math.min(
        ...MAJOR_CITIES.filter(c => c.lng > 100 && c.lng < 180)
          .map(c => calculateDistance(lat, lng, c.lat, c.lng))
      )
      const distToAmerica = Math.min(
        ...MAJOR_CITIES.filter(c => c.lng < -70 && c.lng > -130)
          .map(c => calculateDistance(lat, lng, c.lat, c.lng))
      )
      if (distToAsia > 500 && distToAmerica > 500) return true
    }
  }
  
  // Atlantic Ocean
  if (lng > -80 && lng < 20) {
    if (lat < 70 && lat > -50) {
      const nearestCity = Math.min(
        ...MAJOR_CITIES.map(c => calculateDistance(lat, lng, c.lat, c.lng))
      )
      if (nearestCity > 400) return true
    }
  }
  
  // Indian Ocean
  if (lng > 40 && lng < 100) {
    if (lat < 10 && lat > -40) {
      const nearestCity = Math.min(
        ...MAJOR_CITIES.map(c => calculateDistance(lat, lng, c.lat, c.lng))
      )
      if (nearestCity > 500) return true
    }
  }
  
  return false
}

export function getPopulationDensity(lat: number, lng: number): PopulationData {
  // Check if over water first
  if (isOverWater(lat, lng)) {
    return {
      cityName: 'Ocean',
      population: 0,
      density: 0,
      country: 'International Waters',
      distance: 9999,
      isUrban: false
    }
  }
  
  // Find nearest city
  let nearestCity = MAJOR_CITIES[0]
  let minDistance = calculateDistance(lat, lng, nearestCity.lat, nearestCity.lng)
  
  for (const city of MAJOR_CITIES) {
    const distance = calculateDistance(lat, lng, city.lat, city.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearestCity = city
    }
  }
  
  // Calculate density based on distance from nearest city
  let density: number
  let cityName: string
  
  if (minDistance < 10) {
    // Within city core
    density = nearestCity.density
    cityName = nearestCity.name
  } else if (minDistance < 30) {
    // Suburbs
    density = Math.round(nearestCity.density * 0.3)
    cityName = `${nearestCity.name} suburbs`
  } else if (minDistance < 60) {
    // Metropolitan area
    density = Math.round(nearestCity.density * 0.1)
    cityName = `${Math.round(minDistance)} km from ${nearestCity.name}`
  } else if (minDistance < 150) {
    // Rural near city
    density = 100
    cityName = `Rural (${Math.round(minDistance)} km from ${nearestCity.name})`
  } else {
    // Remote rural
    density = 10
    cityName = 'Remote area'
  }
  
  return {
    cityName,
    population: nearestCity.population,
    density,
    country: minDistance < 150 ? nearestCity.country : 'Rural',
    distance: minDistance,
    isUrban: minDistance < 30
  }
}

// Get population context string for UI
export function getPopulationContext(data: PopulationData): string {
  return data.cityName
}