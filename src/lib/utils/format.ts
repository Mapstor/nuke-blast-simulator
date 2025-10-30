// lib/utils/format.ts

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`
  }
  return num.toLocaleString()
}

export function formatDistance(km: number): string {
  // Convert to miles (1 km = 0.621371 miles)
  const miles = km * 0.621371
  
  if (miles < 1) {
    // Show in feet if less than 1 mile (1 mile = 5280 feet)
    const feet = miles * 5280
    const meters = km * 1000
    return `${feet.toFixed(0)} ft (${meters.toFixed(0)} m)`
  }
  
  // Show miles as primary, km as secondary
  return `${miles.toFixed(1)} mi (${km.toFixed(1)} km)`
}

export function formatYield(kilotons: number): string {
  if (kilotons >= 1000) {
    return `${(kilotons / 1000).toFixed(1)} Mt`
  }
  return `${kilotons.toLocaleString()} kt`
}