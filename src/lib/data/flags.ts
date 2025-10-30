// lib/data/flags.ts
// Country code to flag emoji mapping

export const countryFlags: { [key: string]: string } = {
  'USA': '🇺🇸',
  'USSR': '🇷🇺', // Using Russian flag for USSR
  'Russia': '🇷🇺',
  'USSR/Russia': '🇷🇺',
  'UK': '🇬🇧',
  'France': '🇫🇷',
  'China': '🇨🇳',
  'India': '🇮🇳',
  'Pakistan': '🇵🇰',
  'North Korea': '🇰🇵',
  'Israel': '🇮🇱',
  'South Africa': '🇿🇦',
  'Custom': '⚙️',
  'Accidental': '💥'
}

export function getCountryFlag(country: string): string {
  return countryFlags[country] || '🏳️'
}