// Script to generate a compressed population density grid
// Based on NASA GPWv4 and other sources
// This creates a lightweight grid for the entire world

const fs = require('fs');
const path = require('path');

// Grid resolution in degrees (0.1° ≈ 11km at equator)
const RESOLUTION = 0.1;

// Create population density grid
// Using known population densities from various sources
function generatePopulationGrid() {
  const grid = {};
  
  // Major cities and their surrounding areas (density in people/km²)
  const majorCities = [
    // USA Cities
    { lat: 40.7128, lng: -74.0060, density: 27000, radius: 0.1, name: 'New York Manhattan' },
    { lat: 40.7128, lng: -74.0060, density: 11000, radius: 0.3, name: 'New York City' },
    { lat: 40.7128, lng: -74.0060, density: 5000, radius: 0.5, name: 'New York Metro' },
    { lat: 34.0522, lng: -118.2437, density: 8000, radius: 0.2, name: 'Los Angeles' },
    { lat: 34.0522, lng: -118.2437, density: 3200, radius: 0.5, name: 'LA Metro' },
    { lat: 41.8781, lng: -87.6298, density: 12000, radius: 0.15, name: 'Chicago Downtown' },
    { lat: 41.8781, lng: -87.6298, density: 4600, radius: 0.4, name: 'Chicago' },
    { lat: 29.7604, lng: -95.3698, density: 3500, radius: 0.3, name: 'Houston' },
    { lat: 33.4484, lng: -112.0740, density: 3100, radius: 0.3, name: 'Phoenix' },
    { lat: 39.9526, lng: -75.1652, density: 11500, radius: 0.1, name: 'Philadelphia Downtown' },
    { lat: 39.9526, lng: -75.1652, density: 4500, radius: 0.3, name: 'Philadelphia' },
    { lat: 29.4241, lng: -98.4936, density: 3000, radius: 0.25, name: 'San Antonio' },
    { lat: 32.7157, lng: -117.1611, density: 4300, radius: 0.2, name: 'San Diego' },
    { lat: 32.7767, lng: -96.7970, density: 3800, radius: 0.25, name: 'Dallas' },
    { lat: 37.3382, lng: -121.8863, density: 5500, radius: 0.15, name: 'San Jose' },
    { lat: 30.2672, lng: -97.7431, density: 3100, radius: 0.2, name: 'Austin' },
    { lat: 32.7355, lng: -97.1082, density: 2400, radius: 0.2, name: 'Fort Worth' },
    { lat: 39.7392, lng: -104.9903, density: 4000, radius: 0.2, name: 'Denver' },
    { lat: 38.9072, lng: -77.0369, density: 11000, radius: 0.1, name: 'Washington DC' },
    { lat: 42.3601, lng: -71.0589, density: 13500, radius: 0.1, name: 'Boston' },
    { lat: 36.1699, lng: -115.1398, density: 4500, radius: 0.15, name: 'Las Vegas' },
    { lat: 47.6062, lng: -122.3321, density: 8400, radius: 0.15, name: 'Seattle' },
    { lat: 37.7749, lng: -122.4194, density: 18000, radius: 0.1, name: 'San Francisco' },
    { lat: 42.3314, lng: -83.0458, density: 5000, radius: 0.2, name: 'Detroit' },
    { lat: 25.7617, lng: -80.1918, density: 12000, radius: 0.1, name: 'Miami' },
    { lat: 33.7490, lng: -84.3880, density: 3500, radius: 0.2, name: 'Atlanta' },
    
    // European Cities
    { lat: 51.5074, lng: -0.1278, density: 5700, radius: 0.3, name: 'London' },
    { lat: 48.8566, lng: 2.3522, density: 21000, radius: 0.15, name: 'Paris' },
    { lat: 52.5200, lng: 13.4050, density: 4200, radius: 0.25, name: 'Berlin' },
    { lat: 40.4168, lng: -3.7038, density: 5400, radius: 0.2, name: 'Madrid' },
    { lat: 41.9028, lng: 12.4964, density: 2200, radius: 0.25, name: 'Rome' },
    { lat: 59.9139, lng: 10.7522, density: 4600, radius: 0.15, name: 'Oslo' },
    { lat: 59.3293, lng: 18.0686, density: 5000, radius: 0.15, name: 'Stockholm' },
    { lat: 55.6761, lng: 12.5683, density: 4400, radius: 0.15, name: 'Copenhagen' },
    { lat: 52.3676, lng: 4.9041, density: 5000, radius: 0.15, name: 'Amsterdam' },
    { lat: 50.8503, lng: 4.3517, density: 7400, radius: 0.1, name: 'Brussels' },
    
    // Asian Cities
    { lat: 35.6762, lng: 139.6503, density: 15000, radius: 0.3, name: 'Tokyo' },
    { lat: 39.9042, lng: 116.4074, density: 12000, radius: 0.25, name: 'Beijing' },
    { lat: 31.2304, lng: 121.4737, density: 16000, radius: 0.2, name: 'Shanghai' },
    { lat: 22.3193, lng: 114.1694, density: 25000, radius: 0.1, name: 'Hong Kong' },
    { lat: 1.3521, lng: 103.8198, density: 8300, radius: 0.15, name: 'Singapore' },
    { lat: 37.5665, lng: 126.9780, density: 16000, radius: 0.2, name: 'Seoul' },
    { lat: 28.7041, lng: 77.1025, density: 20000, radius: 0.2, name: 'Delhi' },
    { lat: 19.0760, lng: 72.8777, density: 32000, radius: 0.15, name: 'Mumbai' },
    { lat: 13.0827, lng: 80.2707, density: 26000, radius: 0.1, name: 'Chennai' },
    { lat: 12.9716, lng: 77.5946, density: 12000, radius: 0.15, name: 'Bangalore' },
    
    // Other Major Cities
    { lat: -33.8688, lng: 151.2093, density: 2100, radius: 0.3, name: 'Sydney' },
    { lat: -37.8136, lng: 144.9631, density: 1600, radius: 0.3, name: 'Melbourne' },
    { lat: 43.6532, lng: -79.3832, density: 4300, radius: 0.2, name: 'Toronto' },
    { lat: 45.5017, lng: -73.5673, density: 4700, radius: 0.15, name: 'Montreal' },
    { lat: 49.2827, lng: -123.1207, density: 5500, radius: 0.15, name: 'Vancouver' },
    { lat: 45.4215, lng: -75.6972, density: 3300, radius: 0.15, name: 'Ottawa' },
    { lat: 51.0447, lng: -114.0719, density: 2600, radius: 0.15, name: 'Calgary' },
    { lat: 53.5461, lng: -113.4938, density: 1400, radius: 0.15, name: 'Edmonton' },
    { lat: 49.8951, lng: -97.1384, density: 1600, radius: 0.1, name: 'Winnipeg' },
    { lat: 46.8139, lng: -71.2080, density: 2200, radius: 0.1, name: 'Quebec City' },
    { lat: 19.4326, lng: -99.1332, density: 6000, radius: 0.25, name: 'Mexico City' },
    { lat: -23.5505, lng: -46.6333, density: 8000, radius: 0.25, name: 'São Paulo' },
    { lat: -34.6037, lng: -58.3816, density: 15000, radius: 0.15, name: 'Buenos Aires' },
    { lat: 30.0444, lng: 31.2357, density: 19000, radius: 0.15, name: 'Cairo' },
    { lat: -26.2041, lng: 28.0473, density: 3000, radius: 0.2, name: 'Johannesburg' },
    { lat: 55.7558, lng: 37.6173, density: 4900, radius: 0.25, name: 'Moscow' },
    { lat: 25.2048, lng: 55.2708, density: 1800, radius: 0.2, name: 'Dubai' },
  ];
  
  // Add cities to grid with gradient falloff
  majorCities.forEach(city => {
    // Add core density
    addToGrid(grid, city.lat, city.lng, city.density);
    
    // Add surrounding areas with falloff
    for (let dlat = -city.radius * 3; dlat <= city.radius * 3; dlat += RESOLUTION) {
      for (let dlng = -city.radius * 3; dlng <= city.radius * 3; dlng += RESOLUTION) {
        const distance = Math.sqrt(dlat * dlat + dlng * dlng);
        if (distance <= city.radius * 3) {
          const lat = city.lat + dlat;
          const lng = city.lng + dlng;
          
          // Calculate density with distance falloff
          let density;
          if (distance <= city.radius) {
            density = city.density; // Core area
          } else if (distance <= city.radius * 2) {
            // Suburban area - exponential decay
            const factor = 1 - (distance - city.radius) / city.radius;
            density = Math.round(city.density * 0.3 * factor + city.density * 0.1);
          } else {
            // Rural fringe
            const factor = 1 - (distance - city.radius * 2) / city.radius;
            density = Math.round(city.density * 0.05 * factor + 50);
          }
          
          if (density > 10) {
            addToGrid(grid, lat, lng, density);
          }
        }
      }
    }
  });
  
  // Add country-wide base populations (rural/suburban defaults)
  const countryDefaults = [
    // USA - varied by state
    { minLat: 24, maxLat: 49, minLng: -125, maxLng: -66, density: 35 }, // USA average
    { minLat: 40, maxLat: 45, minLng: -80, maxLng: -70, density: 100 }, // Northeast corridor
    { minLat: 25, maxLat: 35, minLng: -90, maxLng: -75, density: 80 }, // Southeast
    { minLat: 36, maxLat: 42, minLng: -109, maxLng: -102, density: 10 }, // Mountain states
    { minLat: 31, maxLat: 37, minLng: -104, maxLng: -94, density: 20 }, // Great Plains
    
    // Europe
    { minLat: 48, maxLat: 52, minLng: -1, maxLng: 5, density: 200 }, // Benelux
    { minLat: 47, maxLat: 55, minLng: 5, maxLng: 15, density: 150 }, // Germany
    { minLat: 43, maxLat: 47, minLng: -1, maxLng: 8, density: 110 }, // France
    { minLat: 50, maxLat: 60, minLng: -10, maxLng: 2, density: 130 }, // UK/Ireland
    { minLat: 36, maxLat: 43, minLng: 6, maxLng: 18, density: 120 }, // Italy
    { minLat: 36, maxLat: 44, minLng: -10, maxLng: 4, density: 90 }, // Spain/Portugal
    
    // Asia
    { minLat: 20, maxLat: 40, minLng: 100, maxLng: 120, density: 140 }, // Eastern China
    { minLat: 8, maxLat: 35, minLng: 68, maxLng: 88, density: 380 }, // India
    { minLat: 30, maxLat: 45, minLng: 125, maxLng: 145, density: 340 }, // Japan
    { minLat: 33, maxLat: 43, minLng: 124, maxLng: 131, density: 480 }, // South Korea
    
    // Other regions
    { minLat: -10, maxLat: -45, minLng: 110, maxLng: 155, density: 3 }, // Australia
    { minLat: 45, maxLat: 70, minLng: -140, maxLng: -50, density: 4 }, // Canada
    { minLat: 15, maxLat: 33, minLng: -118, maxLng: -86, density: 60 }, // Mexico
    { minLat: -35, maxLat: 10, minLng: -80, maxLng: -35, density: 25 }, // South America
    { minLat: -35, maxLat: 37, minLng: -20, maxLng: 52, density: 45 }, // Africa
    { minLat: 40, maxLat: 75, minLng: 30, maxLng: 180, density: 8 }, // Russia
  ];
  
  // Apply country defaults (only where not already set by cities)
  countryDefaults.forEach(region => {
    for (let lat = region.minLat; lat <= region.maxLat; lat += RESOLUTION * 5) {
      for (let lng = region.minLng; lng <= region.maxLng; lng += RESOLUTION * 5) {
        const key = `${lat.toFixed(1)},${lng.toFixed(1)}`;
        if (!grid[key]) {
          grid[key] = Math.round(region.density * (0.5 + Math.random() * 0.5)); // Add variation
        }
      }
    }
  });
  
  return grid;
}

function addToGrid(grid, lat, lng, density) {
  const key = `${(Math.round(lat / RESOLUTION) * RESOLUTION).toFixed(1)},${(Math.round(lng / RESOLUTION) * RESOLUTION).toFixed(1)}`;
  if (!grid[key] || grid[key] < density) {
    grid[key] = Math.round(density);
  }
}

// Generate and save the grid
const grid = generatePopulationGrid();

// Convert to more compact format
const compactGrid = {
  resolution: RESOLUTION,
  data: {}
};

// Group by latitude bands for better compression
for (const key of Object.keys(grid)) {
  const [lat, lng] = key.split(',').map(Number);
  const latBand = lat.toFixed(1);
  if (!compactGrid.data[latBand]) {
    compactGrid.data[latBand] = {};
  }
  compactGrid.data[latBand][lng.toFixed(1)] = grid[key];
}

// Save to file
const outputPath = path.join(__dirname, '../src/lib/data/populationGrid.json');
fs.writeFileSync(outputPath, JSON.stringify(compactGrid));

console.log(`Population grid generated with ${Object.keys(grid).length} cells`);
console.log(`Saved to ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);