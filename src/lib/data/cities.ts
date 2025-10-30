// lib/data/cities.ts
// Default density fallback for edge cases

// Default density for unknown areas (global average urban density)  
export const DEFAULT_URBAN_DENSITY = 3_500 // per km²

// Preset locations for examples
export const presetLocations = [
  { name: 'New York', lat: 40.7128, lng: -74.0060, density: 10_000 },
  { name: 'London', lat: 51.5074, lng: -0.1278, density: 5_500 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, density: 6_300 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173, density: 4_900 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, density: 1_300 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, density: 3_200 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, density: 21_000 },
  { name: 'Washington DC', lat: 38.9072, lng: -77.0369, density: 4_300 },
]