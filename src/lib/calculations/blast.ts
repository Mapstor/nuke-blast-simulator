// lib/calculations/blast.ts

export function calculateFireball(yieldKt: number, burstType: 'air' | 'surface' = 'air'): number {
  // Fireball radius in km - based on nuclear weapons effects data
  // Surface bursts have smaller fireballs due to ground interaction
  const baseRadius = 0.145 * Math.pow(yieldKt, 0.4)
  return burstType === 'surface' ? baseRadius * 0.8 : baseRadius
}

export function calculateAirBlast(yieldKt: number, burstType: 'air' | 'surface' = 'air') {
  // Air bursts are optimized for maximum blast damage over wide area
  // Surface bursts lose 40-50% of blast energy to crater formation and ground shock
  const multiplier = burstType === 'surface' ? 0.55 : 1.0
  
  return {
    severe: 0.482 * Math.pow(yieldKt, 0.33) * multiplier,   // 20 PSI overpressure - heavy building destruction
    moderate: 1.03 * Math.pow(yieldKt, 0.33) * multiplier,  // 5 PSI overpressure - moderate damage
    light: 2.93 * Math.pow(yieldKt, 0.33) * multiplier     // 1 PSI overpressure - light damage, windows
  }
}

export function calculateThermalRadiation(yieldKt: number, burstType: 'air' | 'surface' = 'air') {
  // Surface bursts have significantly reduced thermal effects 
  // due to ground absorption and shadowing effects
  const multiplier = burstType === 'surface' ? 0.6 : 1.0
  
  return {
    thirdDegree: 0.67 * Math.pow(yieldKt, 0.41) * multiplier,  // 3rd degree burns
    secondDegree: 1.2 * Math.pow(yieldKt, 0.41) * multiplier   // 2nd degree burns
  }
}

export function calculateFallout(yieldKt: number, burstType: 'air' | 'surface' = 'air'): number {
  // MAJOR DIFFERENCE: Surface bursts create massive radioactive fallout
  // Air bursts produce minimal fallout (only from neutron activation of air)
  if (burstType === 'air') {
    // Minimal fallout for air burst - only local neutron activation
    return 0.1 * Math.pow(yieldKt, 0.2)  // Very small radius
  } else {
    // Massive fallout plume for surface burst - can extend hundreds of km downwind
    // This is just the lethal fallout zone near ground zero
    return 12.0 * Math.pow(yieldKt, 0.4)  // Much larger radius
  }
}