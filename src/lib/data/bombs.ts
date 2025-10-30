// lib/data/bombs.ts

import { Bomb } from '@/lib/types'

export const bombs: Bomb[] = [
  {
    id: 'tsar-bomba',
    name: 'Tsar Bomba',
    yield: 50000,
    type: 'thermonuclear',
    country: 'USSR',
    year: 1961,
    description: 'Largest nuclear weapon ever tested'
  },
  {
    id: 'castle-bravo',
    name: 'Castle Bravo',
    yield: 15000,
    type: 'thermonuclear',
    country: 'USA',
    year: 1954,
    description: 'Most powerful US nuclear test'
  },
  {
    id: 'ivy-mike',
    name: 'Ivy Mike',
    yield: 10400,
    type: 'thermonuclear',
    country: 'USA',
    year: 1952,
    description: 'First hydrogen bomb test'
  },
  {
    id: 'b83',
    name: 'B83',
    yield: 1200,
    type: 'thermonuclear',
    country: 'USA',
    year: 1983,
    description: 'Most powerful US weapon in active service'
  },
  {
    id: 'w88',
    name: 'W88',
    yield: 475,
    type: 'thermonuclear',
    country: 'USA',
    year: 1988,
    description: 'Modern SLBM warhead'
  },
  {
    id: 'fat-man',
    name: 'Fat Man',
    yield: 21,
    type: 'fission',
    country: 'USA',
    year: 1945,
    description: 'Nagasaki bomb'
  },
  {
    id: 'little-boy',
    name: 'Little Boy',
    yield: 15,
    type: 'fission',
    country: 'USA',
    year: 1945,
    description: 'Hiroshima bomb'
  },
  {
    id: 'w76',
    name: 'W76',
    yield: 100,
    type: 'thermonuclear',
    country: 'USA',
    year: 1978,
    description: 'Common SLBM warhead'
  },
  {
    id: 'b61',
    name: 'B61',
    yield: 340,
    type: 'thermonuclear',
    country: 'USA',
    year: 1968,
    description: 'Variable yield tactical bomb'
  },
  {
    id: 'custom',
    name: 'Custom Yield',
    yield: 100,
    type: 'thermonuclear',
    country: 'Custom',
    description: 'Set your own yield'
  },
  // Adding 20 more historical and modern nuclear weapons
  {
    id: 'castle-yankee',
    name: 'Castle Yankee',
    yield: 13500,
    type: 'thermonuclear',
    country: 'USA',
    year: 1954,
    description: 'Second Castle series test'
  },
  {
    id: 'soviet-test-219',
    name: 'Soviet Test 219',
    yield: 24200,
    type: 'thermonuclear',
    country: 'USSR',
    year: 1962,
    description: 'Third largest Soviet test'
  },
  {
    id: 'operation-hardtack-poplar',
    name: 'Hardtack Poplar',
    yield: 9300,
    type: 'thermonuclear',
    country: 'USA',
    year: 1958,
    description: 'Hardtack I series test'
  },
  {
    id: 'w87',
    name: 'W87',
    yield: 300,
    type: 'thermonuclear',
    country: 'USA',
    year: 1986,
    description: 'Modern ICBM warhead'
  },
  {
    id: 'b53',
    name: 'B53',
    yield: 9000,
    type: 'thermonuclear',
    country: 'USA',
    year: 1962,
    description: 'Retired high-yield bomb'
  },
  {
    id: 'w80',
    name: 'W80',
    yield: 150,
    type: 'thermonuclear',
    country: 'USA',
    year: 1979,
    description: 'Cruise missile warhead'
  },
  {
    id: 'trinity',
    name: 'Trinity',
    yield: 25,
    type: 'fission',
    country: 'USA',
    year: 1945,
    description: 'First nuclear test'
  },
  {
    id: 'joe-1',
    name: 'Joe-1 (RDS-1)',
    yield: 22,
    type: 'fission',
    country: 'USSR',
    year: 1949,
    description: 'First Soviet nuclear test'
  },
  {
    id: 'hurricane',
    name: 'Hurricane',
    yield: 25,
    type: 'fission',
    country: 'UK',
    year: 1952,
    description: 'First British nuclear test'
  },
  {
    id: 'gerboise-bleue',
    name: 'Gerboise Bleue',
    yield: 70,
    type: 'fission',
    country: 'France',
    year: 1960,
    description: 'First French nuclear test'
  },
  {
    id: '596',
    name: 'Test No. 596',
    yield: 22,
    type: 'fission',
    country: 'China',
    year: 1964,
    description: 'First Chinese nuclear test'
  },
  {
    id: 'smiling-buddha',
    name: 'Smiling Buddha',
    yield: 12,
    type: 'fission',
    country: 'India',
    year: 1974,
    description: 'First Indian nuclear test'
  },
  {
    id: 'chagai-i',
    name: 'Chagai-I',
    yield: 40,
    type: 'fission',
    country: 'Pakistan',
    year: 1998,
    description: 'First Pakistani nuclear test'
  },
  {
    id: 'hwasong-14',
    name: 'Hwasong-14 Warhead',
    yield: 250,
    type: 'thermonuclear',
    country: 'North Korea',
    year: 2017,
    description: 'Estimated ICBM warhead'
  },
  {
    id: 'davy-crockett',
    name: 'Davy Crockett',
    yield: 0.02,
    type: 'fission',
    country: 'USA',
    year: 1961,
    description: 'Smallest US nuclear weapon'
  },
  {
    id: 'w54',
    name: 'W54 SADM',
    yield: 1,
    type: 'fission',
    country: 'USA',
    year: 1961,
    description: 'Special Atomic Demolition Munition'
  },
  {
    id: 'b41',
    name: 'B41',
    yield: 25000,
    type: 'thermonuclear',
    country: 'USA',
    year: 1960,
    description: 'Most powerful US bomb ever deployed'
  },
  {
    id: 'orange-herald',
    name: 'Orange Herald',
    yield: 720,
    type: 'fusion',
    country: 'UK',
    year: 1957,
    description: 'Largest UK nuclear test'
  },
  {
    id: 'canopus',
    name: 'Canopus',
    yield: 2600,
    type: 'thermonuclear',
    country: 'France',
    year: 1968,
    description: 'First French H-bomb test'
  },
  {
    id: 'test-no-6',
    name: 'Test No. 6',
    yield: 3300,
    type: 'thermonuclear',
    country: 'China',
    year: 1967,
    description: 'First Chinese H-bomb test'
  },

  // CONVENTIONAL (NON-NUCLEAR) BOMBS
  // These use TNT equivalent in kilotons
  {
    id: 'foab',
    name: 'FOAB (Father of All Bombs)',
    yield: 0.044, // 44 tons TNT equivalent
    type: 'conventional',
    country: 'Russia',
    year: 2007,
    description: 'Most powerful non-nuclear bomb - Thermobaric'
  },
  {
    id: 'moab',
    name: 'MOAB (Mother of All Bombs)',
    yield: 0.011, // 11 tons TNT equivalent  
    type: 'conventional',
    country: 'USA',
    year: 2003,
    description: 'GBU-43/B Massive Ordnance Air Blast'
  },
  {
    id: 'grand-slam',
    name: 'Grand Slam',
    yield: 0.0095, // 9.5 tons TNT equivalent
    type: 'conventional',
    country: 'UK',
    year: 1945,
    description: 'Largest conventional WWII bomb'
  },
  {
    id: 'tallboy',
    name: 'Tallboy',
    yield: 0.0024, // 2.4 tons TNT equivalent
    type: 'conventional',
    country: 'UK', 
    year: 1944,
    description: 'Deep penetration earthquake bomb'
  },
  {
    id: 'gbu-57',
    name: 'GBU-57 MOP',
    yield: 0.0026, // 2.6 tons TNT equivalent
    type: 'conventional',
    country: 'USA',
    year: 2007,
    description: 'Massive Ordnance Penetrator - bunker buster'
  },
  {
    id: 'fab-5000',
    name: 'FAB-5000',
    yield: 0.003, // 3 tons TNT equivalent
    type: 'conventional',
    country: 'USSR/Russia',
    year: 1943,
    description: 'Largest conventional Soviet bomb'
  },
  {
    id: 'blockbuster',
    name: 'Blockbuster (HC 4000)',
    yield: 0.004, // 4 tons TNT equivalent
    type: 'conventional',
    country: 'UK',
    year: 1941,
    description: 'British "cookie" blast bomb'
  },
  {
    id: 'blu-82',
    name: 'BLU-82 Daisy Cutter',
    yield: 0.0075, // 7.5 tons TNT equivalent
    type: 'conventional',
    country: 'USA',
    year: 1970,
    description: 'Vietnam-era fuel-air explosive'
  },
  {
    id: 'ofab-5000',
    name: 'OFAB-5000',
    yield: 0.0025, // 2.5 tons TNT equivalent
    type: 'conventional',
    country: 'Russia',
    year: 1990,
    description: 'Modern Russian high-explosive bomb'
  },
  {
    id: 'gbu-28',
    name: 'GBU-28 Bunker Buster',
    yield: 0.0003, // 300 kg TNT equivalent
    type: 'conventional',
    country: 'USA',
    year: 1991,
    description: 'Deep penetrating bunker buster'
  },
  {
    id: 'mark-84',
    name: 'Mark 84',
    yield: 0.0009, // 900 kg TNT equivalent
    type: 'conventional',
    country: 'USA',
    year: 1956,
    description: 'Standard 2000 lb general purpose bomb'
  },
  {
    id: 'fab-500',
    name: 'FAB-500',
    yield: 0.0002, // 200 kg TNT equivalent
    type: 'conventional',
    country: 'USSR/Russia',
    year: 1955,
    description: 'Standard 500 kg general purpose bomb'
  },
  {
    id: 'jdam',
    name: 'JDAM (GBU-31)',
    yield: 0.0009, // 900 kg TNT equivalent
    type: 'conventional',
    country: 'USA',
    year: 1997,
    description: 'GPS-guided 2000 lb bomb'
  },
  {
    id: 'mk-82',
    name: 'Mark 82',
    yield: 0.0002, // 200 kg TNT equivalent
    type: 'conventional',
    country: 'USA',
    year: 1956,
    description: 'Standard 500 lb general purpose bomb'
  },
  {
    id: 'halifax-explosion',
    name: 'Halifax Explosion (1917)',
    yield: 0.0029, // 2.9 tons TNT equivalent
    type: 'conventional',
    country: 'Accidental',
    year: 1917,
    description: 'Largest accidental non-nuclear explosion'
  }
]