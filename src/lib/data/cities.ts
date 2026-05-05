// lib/data/cities.ts
//
// Preset locations for example city scenario pages and the on-map quick-jump menu.
// Population is metro-area; density is urban-core persons/km² (used by the
// scenario casualty math). Sources: city statistical bureaus, Demographia
// World Urban Areas, UN World Urbanization Prospects, and major encyclopedic
// references. Density values are deliberately conservative to avoid over-
// stating casualties — we want educational impact, not headline-chasing.

export const DEFAULT_URBAN_DENSITY = 3_500 // per km² — global average urban density

export type PresetLocation = {
  slug: string
  name: string
  country: string
  lat: number
  lng: number
  density: number     // per km², urban core
  population: number  // metro area
  description: string
  region: 'North America' | 'South America' | 'Europe' | 'Asia' | 'Middle East' | 'Africa' | 'Oceania'
}

export const presetLocations: PresetLocation[] = [
  // ── North America ──────────────────────────────────────────────────────
  { slug: 'new-york',       name: 'New York',       country: 'USA',       lat: 40.7128,  lng: -74.0060,  density: 10_000, population: 8_336_817, region: 'North America', description: "The most populous city in the United States and a global financial capital, with a metropolitan area approaching 20 million people." },
  { slug: 'los-angeles',    name: 'Los Angeles',    country: 'USA',       lat: 34.0522,  lng: -118.2437, density: 3_200,  population: 3_898_747, region: 'North America', description: "The second-most populous US city, sprawling across Southern California with a metro area of nearly 13 million." },
  { slug: 'chicago',        name: 'Chicago',        country: 'USA',       lat: 41.8781,  lng: -87.6298,  density: 4_700,  population: 2_697_000, region: 'North America', description: "The third-largest city in the United States, anchoring the Midwest with a metro population of about 9.4 million." },
  { slug: 'houston',        name: 'Houston',        country: 'USA',       lat: 29.7604,  lng: -95.3698,  density: 1_500,  population: 2_320_000, region: 'North America', description: "The largest city in Texas and home to the United States' largest medical center and a major energy industry hub." },
  { slug: 'san-francisco',  name: 'San Francisco',  country: 'USA',       lat: 37.7749,  lng: -122.4194, density: 7_300,  population: 873_000,   region: 'North America', description: "The financial and technology capital of the western United States, on a dense 121 km² peninsula." },
  { slug: 'miami',          name: 'Miami',          country: 'USA',       lat: 25.7617,  lng: -80.1918,  density: 4_500,  population: 442_000,   region: 'North America', description: "A major city in southeastern Florida, with a metropolitan area home to over 6 million people." },
  { slug: 'washington-dc',  name: 'Washington DC',  country: 'USA',       lat: 38.9072,  lng: -77.0369,  density: 4_300,  population: 689_545,   region: 'North America', description: "The capital of the United States, home to the federal government, the Pentagon, and most major U.S. agencies." },
  { slug: 'toronto',        name: 'Toronto',        country: 'Canada',    lat: 43.6532,  lng: -79.3832,  density: 4_500,  population: 2_794_000, region: 'North America', description: "The largest city in Canada and a major financial center, with a metro population of nearly 7 million." },
  { slug: 'vancouver',      name: 'Vancouver',      country: 'Canada',    lat: 49.2827,  lng: -123.1207, density: 5_500,  population: 675_000,   region: 'North America', description: "The largest city in western Canada and a major Pacific port." },
  { slug: 'mexico-city',    name: 'Mexico City',    country: 'Mexico',    lat: 19.4326,  lng: -99.1332,  density: 6_000,  population: 9_209_000, region: 'North America', description: "The capital of Mexico and the largest city in North America by population, with a metro area of over 21 million." },
  { slug: 'philadelphia',   name: 'Philadelphia',   country: 'USA',       lat: 39.9526,  lng: -75.1652,  density: 4_500,  population: 1_584_000, region: 'North America', description: "The sixth-most populous city in the United States and birthplace of the U.S. Constitution." },
  { slug: 'phoenix',        name: 'Phoenix',        country: 'USA',       lat: 33.4484,  lng: -112.0740, density: 1_300,  population: 1_625_000, region: 'North America', description: "The capital of Arizona and fifth-largest city in the United States." },
  { slug: 'boston',         name: 'Boston',         country: 'USA',       lat: 42.3601,  lng: -71.0589,  density: 5_400,  population: 695_000,   region: 'North America', description: "The capital of Massachusetts and the cultural and educational hub of New England." },
  { slug: 'seattle',        name: 'Seattle',        country: 'USA',       lat: 47.6062,  lng: -122.3321, density: 3_400,  population: 750_000,   region: 'North America', description: "The largest city in the Pacific Northwest and a major US technology center." },
  { slug: 'atlanta',        name: 'Atlanta',        country: 'USA',       lat: 33.7490,  lng: -84.3880,  density: 1_400,  population: 500_000,   region: 'North America', description: "The capital of Georgia and the largest city and economic center of the southeastern United States." },
  { slug: 'denver',         name: 'Denver',         country: 'USA',       lat: 39.7392,  lng: -104.9903, density: 1_900,  population: 715_000,   region: 'North America', description: "The capital of Colorado, located on the eastern edge of the Rocky Mountains." },

  // ── South America ──────────────────────────────────────────────────────
  { slug: 'sao-paulo',      name: 'São Paulo',      country: 'Brazil',    lat: -23.5505, lng: -46.6333,  density: 7_400,  population: 12_330_000, region: 'South America', description: "The largest city in the southern hemisphere and Brazil's economic capital, with over 22 million in the metro area." },
  { slug: 'rio-de-janeiro', name: 'Rio de Janeiro', country: 'Brazil',    lat: -22.9068, lng: -43.1729,  density: 5_300,  population: 6_748_000, region: 'South America', description: "Brazil's second-largest city, famed for its coastal geography and host of the 2016 Summer Olympics." },
  { slug: 'buenos-aires',   name: 'Buenos Aires',   country: 'Argentina', lat: -34.6037, lng: -58.3816,  density: 14_500, population: 3_075_000, region: 'South America', description: "The capital of Argentina and second-largest metropolitan area in South America." },
  { slug: 'lima',           name: 'Lima',           country: 'Peru',      lat: -12.0464, lng: -77.0428,  density: 3_300,  population: 9_751_000, region: 'South America', description: "The capital of Peru, home to nearly a third of the country's population." },
  { slug: 'bogota',         name: 'Bogotá',         country: 'Colombia',  lat: 4.7110,   lng: -74.0721,  density: 4_300,  population: 7_412_000, region: 'South America', description: "The capital of Colombia and the largest Spanish-speaking city in South America by population." },
  { slug: 'santiago',       name: 'Santiago',       country: 'Chile',     lat: -33.4489, lng: -70.6693,  density: 8_500,  population: 6_800_000, region: 'South America', description: "The capital and largest city of Chile, set in a valley below the Andes." },
  { slug: 'caracas',        name: 'Caracas',        country: 'Venezuela', lat: 10.4806,  lng: -66.9036,  density: 4_400,  population: 2_080_000, region: 'South America', description: "The capital of Venezuela." },
  { slug: 'quito',          name: 'Quito',          country: 'Ecuador',   lat: -0.1807,  lng: -78.4678,  density: 4_400,  population: 1_822_000, region: 'South America', description: "The capital of Ecuador and the highest-altitude national capital in the world." },
  { slug: 'montevideo',     name: 'Montevideo',     country: 'Uruguay',   lat: -34.9011, lng: -56.1645,  density: 2_700,  population: 1_319_000, region: 'South America', description: "The capital and largest city of Uruguay, on the Río de la Plata." },
  { slug: 'salvador',       name: 'Salvador',       country: 'Brazil',    lat: -12.9777, lng: -38.5016,  density: 3_700,  population: 2_886_000, region: 'South America', description: "The capital of Bahia and Brazil's third-largest city." },

  // ── Europe ─────────────────────────────────────────────────────────────
  { slug: 'london',         name: 'London',         country: 'United Kingdom', lat: 51.5074,  lng: -0.1278,   density: 5_500,  population: 9_002_488, region: 'Europe', description: "The capital of the United Kingdom and most populous city in Western Europe, on the River Thames." },
  { slug: 'paris',          name: 'Paris',          country: 'France',    lat: 48.8566,  lng: 2.3522,    density: 21_000, population: 2_165_423, region: 'Europe', description: "The capital of France and one of the most densely populated major cities in Europe; the Île-de-France region holds over 12 million people." },
  { slug: 'berlin',         name: 'Berlin',         country: 'Germany',   lat: 52.5200,  lng: 13.4050,   density: 4_100,  population: 3_677_000, region: 'Europe', description: "The capital and largest city of Germany." },
  { slug: 'madrid',         name: 'Madrid',         country: 'Spain',     lat: 40.4168,  lng: -3.7038,   density: 5_300,  population: 3_345_000, region: 'Europe', description: "The capital of Spain and one of the largest metropolitan areas in the European Union." },
  { slug: 'rome',           name: 'Rome',           country: 'Italy',     lat: 41.9028,  lng: 12.4964,   density: 2_300,  population: 2_761_000, region: 'Europe', description: "The capital of Italy and historic seat of the Roman Catholic Church." },
  { slug: 'amsterdam',      name: 'Amsterdam',      country: 'Netherlands', lat: 52.3676, lng: 4.9041,   density: 5_200,  population: 873_000,   region: 'Europe', description: "The capital of the Netherlands, a major European financial center built around its historic canal system." },
  { slug: 'vienna',         name: 'Vienna',         country: 'Austria',   lat: 48.2082,  lng: 16.3738,   density: 4_700,  population: 1_931_000, region: 'Europe', description: "The capital of Austria and headquarters of the IAEA, OPEC, and several UN agencies." },
  { slug: 'stockholm',      name: 'Stockholm',      country: 'Sweden',    lat: 59.3293,  lng: 18.0686,   density: 5_200,  population: 975_000,   region: 'Europe', description: "The capital of Sweden, built across 14 islands at the entrance to the Baltic Sea." },
  { slug: 'warsaw',         name: 'Warsaw',         country: 'Poland',    lat: 52.2297,  lng: 21.0122,   density: 3_400,  population: 1_794_000, region: 'Europe', description: "The capital and largest city of Poland." },
  { slug: 'kyiv',           name: 'Kyiv',           country: 'Ukraine',   lat: 50.4501,  lng: 30.5234,   density: 3_400,  population: 2_950_000, region: 'Europe', description: "The capital and largest city of Ukraine, on the Dnipro River." },
  { slug: 'moscow',         name: 'Moscow',         country: 'Russia',    lat: 55.7558,  lng: 37.6173,   density: 4_900,  population: 12_600_000, region: 'Europe', description: "The capital of Russia and the largest city in Europe by population." },
  { slug: 'barcelona',      name: 'Barcelona',      country: 'Spain',     lat: 41.3851,  lng: 2.1734,    density: 16_000, population: 1_620_000, region: 'Europe', description: "The capital of Catalonia and Spain's second-largest city, on the Mediterranean coast." },
  { slug: 'milan',          name: 'Milan',          country: 'Italy',     lat: 45.4642,  lng: 9.1900,    density: 7_700,  population: 1_396_000, region: 'Europe', description: "Italy's financial capital and a global hub of fashion and design." },
  { slug: 'munich',         name: 'Munich',         country: 'Germany',   lat: 48.1351,  lng: 11.5820,   density: 4_800,  population: 1_488_000, region: 'Europe', description: "The capital of Bavaria and Germany's third-largest city." },
  { slug: 'hamburg',        name: 'Hamburg',        country: 'Germany',   lat: 53.5511,  lng: 9.9937,    density: 2_400,  population: 1_899_000, region: 'Europe', description: "Germany's second-largest city and one of the largest seaports in Europe." },
  { slug: 'brussels',       name: 'Brussels',       country: 'Belgium',   lat: 50.8503,  lng: 4.3517,    density: 7_400,  population: 1_220_000, region: 'Europe', description: "The capital of Belgium and the de facto capital of the European Union." },
  { slug: 'budapest',       name: 'Budapest',       country: 'Hungary',   lat: 47.4979,  lng: 19.0402,   density: 3_300,  population: 1_752_000, region: 'Europe', description: "The capital and largest city of Hungary, on the Danube." },
  { slug: 'lisbon',         name: 'Lisbon',         country: 'Portugal',  lat: 38.7223,  lng: -9.1393,   density: 6_500,  population: 545_000,   region: 'Europe', description: "The capital and largest city of Portugal, on the Atlantic coast." },
  { slug: 'copenhagen',     name: 'Copenhagen',     country: 'Denmark',   lat: 55.6761,  lng: 12.5683,   density: 7_400,  population: 660_000,   region: 'Europe', description: "The capital and most populous city of Denmark." },
  { slug: 'dublin',         name: 'Dublin',         country: 'Ireland',   lat: 53.3498,  lng: -6.2603,   density: 4_800,  population: 595_000,   region: 'Europe', description: "The capital and largest city of Ireland." },

  // ── Asia ───────────────────────────────────────────────────────────────
  { slug: 'tokyo',          name: 'Tokyo',          country: 'Japan',     lat: 35.6762,  lng: 139.6503,  density: 6_300,  population: 13_960_000, region: 'Asia', description: "The capital of Japan and the world's largest metropolitan area; Greater Tokyo holds over 37 million people." },
  { slug: 'osaka',          name: 'Osaka',          country: 'Japan',     lat: 34.6937,  lng: 135.5023,  density: 12_000, population: 2_700_000, region: 'Asia', description: "The third-largest city in Japan and economic anchor of the Keihanshin metropolitan region." },
  { slug: 'beijing',        name: 'Beijing',        country: 'China',     lat: 39.9042,  lng: 116.4074,  density: 1_300,  population: 21_500_000, region: 'Asia', description: "The capital of the People's Republic of China and one of the most populous cities in the world." },
  { slug: 'shanghai',       name: 'Shanghai',       country: 'China',     lat: 31.2304,  lng: 121.4737,  density: 3_900,  population: 24_870_000, region: 'Asia', description: "China's largest city by population and one of the world's busiest container ports." },
  { slug: 'hong-kong',      name: 'Hong Kong',      country: 'China',     lat: 22.3193,  lng: 114.1694,  density: 7_100,  population: 7_500_000, region: 'Asia', description: "A special administrative region of China and one of the world's most densely populated territories." },
  { slug: 'mumbai',         name: 'Mumbai',         country: 'India',     lat: 19.0760,  lng: 72.8777,   density: 21_000, population: 12_478_000, region: 'Asia', description: "The largest city in India and one of the most densely populated cities on Earth." },
  { slug: 'delhi',          name: 'Delhi',          country: 'India',     lat: 28.7041,  lng: 77.1025,   density: 11_000, population: 16_787_000, region: 'Asia', description: "The capital of India and second-largest metropolitan area in the world." },
  { slug: 'seoul',          name: 'Seoul',          country: 'South Korea', lat: 37.5665, lng: 126.9780, density: 16_000, population: 9_776_000, region: 'Asia', description: "The capital of South Korea and one of the most densely populated megacities in the world." },
  { slug: 'pyongyang',      name: 'Pyongyang',      country: 'North Korea', lat: 39.0392, lng: 125.7625, density: 4_500,  population: 3_255_000, region: 'Asia', description: "The capital and largest city of North Korea." },
  { slug: 'bangkok',        name: 'Bangkok',        country: 'Thailand',  lat: 13.7563,  lng: 100.5018,  density: 5_300,  population: 10_722_000, region: 'Asia', description: "The capital and largest city of Thailand; the metropolitan region holds nearly 16 million." },
  { slug: 'jakarta',        name: 'Jakarta',        country: 'Indonesia', lat: -6.2088,  lng: 106.8456,  density: 16_000, population: 10_770_000, region: 'Asia', description: "The capital of Indonesia and largest city in Southeast Asia." },
  { slug: 'manila',         name: 'Manila',         country: 'Philippines', lat: 14.5995, lng: 120.9842, density: 46_000, population: 1_847_000, region: 'Asia', description: "The capital of the Philippines and one of the most densely populated cities in the world." },
  { slug: 'singapore',      name: 'Singapore',      country: 'Singapore', lat: 1.3521,   lng: 103.8198,  density: 8_300,  population: 5_900_000, region: 'Asia', description: "An island city-state and major global financial hub at the southern tip of the Malay Peninsula." },
  { slug: 'karachi',        name: 'Karachi',        country: 'Pakistan',  lat: 24.8607,  lng: 67.0011,   density: 24_000, population: 16_094_000, region: 'Asia', description: "The largest city in Pakistan and a major Indian Ocean port." },
  { slug: 'islamabad',      name: 'Islamabad',      country: 'Pakistan',  lat: 33.6844,  lng: 73.0479,   density: 1_900,  population: 1_009_000, region: 'Asia', description: "The capital of Pakistan, a planned city built in the 1960s." },
  { slug: 'kuala-lumpur',   name: 'Kuala Lumpur',   country: 'Malaysia',  lat: 3.1390,   lng: 101.6869,  density: 7_400,  population: 1_780_000, region: 'Asia', description: "The capital and largest city of Malaysia." },
  { slug: 'hanoi',          name: 'Hanoi',          country: 'Vietnam',   lat: 21.0285,  lng: 105.8542,  density: 2_400,  population: 4_600_000, region: 'Asia', description: "The capital of Vietnam, on the Red River in northern Vietnam." },
  { slug: 'ho-chi-minh-city', name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, density: 4_400, population: 9_000_000, region: 'Asia', description: "The largest city in Vietnam and the country's economic and financial hub." },
  { slug: 'lahore',         name: 'Lahore',         country: 'Pakistan',  lat: 31.5497,  lng: 74.3436,   density: 7_000,  population: 13_000_000, region: 'Asia', description: "The second-largest city in Pakistan and capital of Punjab province." },
  { slug: 'dhaka',          name: 'Dhaka',          country: 'Bangladesh', lat: 23.8103, lng: 90.4125,   density: 23_000, population: 9_000_000, region: 'Asia', description: "The capital of Bangladesh and one of the most densely populated cities on Earth." },
  { slug: 'kolkata',        name: 'Kolkata',        country: 'India',     lat: 22.5726,  lng: 88.3639,   density: 24_000, population: 14_850_000, region: 'Asia', description: "The capital of West Bengal and a major cultural and commercial center in eastern India." },
  { slug: 'chennai',        name: 'Chennai',        country: 'India',     lat: 13.0827,  lng: 80.2707,   density: 26_000, population: 11_000_000, region: 'Asia', description: "The capital of Tamil Nadu and a major IT and automotive manufacturing hub." },
  { slug: 'bangalore',      name: 'Bangalore',      country: 'India',     lat: 12.9716,  lng: 77.5946,   density: 11_000, population: 13_000_000, region: 'Asia', description: "The capital of Karnataka, India's technology capital." },
  { slug: 'hyderabad',      name: 'Hyderabad',      country: 'India',     lat: 17.3850,  lng: 78.4867,   density: 18_000, population: 10_000_000, region: 'Asia', description: "The capital of Telangana, a major information-technology and pharmaceutical center." },
  { slug: 'chongqing',      name: 'Chongqing',      country: 'China',     lat: 29.4316,  lng: 106.9123,  density: 380,    population: 31_000_000, region: 'Asia', description: "The largest direct-controlled municipality in China by area; megacity in the southwest." },
  { slug: 'guangzhou',      name: 'Guangzhou',      country: 'China',     lat: 23.1291,  lng: 113.2644,  density: 2_500,  population: 18_700_000, region: 'Asia', description: "A major southern Chinese port and manufacturing hub on the Pearl River." },
  { slug: 'shenzhen',       name: 'Shenzhen',       country: 'China',     lat: 22.5431,  lng: 114.0579,  density: 8_800,  population: 17_600_000, region: 'Asia', description: "A major Chinese technology hub adjacent to Hong Kong." },
  { slug: 'taipei',         name: 'Taipei',         country: 'Taiwan',    lat: 25.0330,  lng: 121.5654,  density: 9_700,  population: 2_600_000, region: 'Asia', description: "The capital of Taiwan." },
  { slug: 'busan',          name: 'Busan',          country: 'South Korea', lat: 35.1796, lng: 129.0756, density: 4_400,  population: 3_400_000, region: 'Asia', description: "South Korea's second-largest city and a major Pacific port." },
  { slug: 'nagoya',         name: 'Nagoya',         country: 'Japan',     lat: 35.1815,  lng: 136.9066,  density: 7_100,  population: 2_295_000, region: 'Asia', description: "Japan's fourth-largest city and a major industrial center." },

  // ── Middle East ────────────────────────────────────────────────────────
  { slug: 'istanbul',       name: 'Istanbul',       country: 'Turkey',    lat: 41.0082,  lng: 28.9784,   density: 2_900,  population: 15_460_000, region: 'Middle East', description: "The largest city in Turkey and Europe's largest metropolitan area, straddling the Bosporus strait." },
  { slug: 'tehran',         name: 'Tehran',         country: 'Iran',      lat: 35.6892,  lng: 51.3890,   density: 11_900, population: 9_259_000, region: 'Middle East', description: "The capital and largest city of Iran." },
  { slug: 'riyadh',         name: 'Riyadh',         country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, density: 4_500,  population: 7_676_000, region: 'Middle East', description: "The capital of Saudi Arabia and the largest city on the Arabian Peninsula." },
  { slug: 'dubai',          name: 'Dubai',          country: 'UAE',       lat: 25.2048,  lng: 55.2708,   density: 950,    population: 3_604_000, region: 'Middle East', description: "The most populous city in the United Arab Emirates and a global trade and tourism hub." },
  { slug: 'tel-aviv',       name: 'Tel Aviv',       country: 'Israel',    lat: 32.0853,  lng: 34.7818,   density: 8_900,  population: 467_000,   region: 'Middle East', description: "The economic and technology capital of Israel and core of the Gush Dan metropolitan area." },
  { slug: 'baghdad',        name: 'Baghdad',        country: 'Iraq',      lat: 33.3152,  lng: 44.3661,   density: 17_800, population: 7_200_000, region: 'Middle East', description: "The capital and largest city of Iraq, on the Tigris River." },
  { slug: 'doha',           name: 'Doha',           country: 'Qatar',     lat: 25.2854,  lng: 51.5310,   density: 1_100,  population: 1_400_000, region: 'Middle East', description: "The capital and largest city of Qatar." },
  { slug: 'abu-dhabi',      name: 'Abu Dhabi',      country: 'UAE',       lat: 24.4539,  lng: 54.3773,   density: 510,    population: 1_500_000, region: 'Middle East', description: "The capital of the United Arab Emirates." },
  { slug: 'kuwait-city',    name: 'Kuwait City',    country: 'Kuwait',    lat: 29.3759,  lng: 47.9774,   density: 4_000,  population: 600_000,   region: 'Middle East', description: "The capital and largest city of Kuwait." },
  { slug: 'amman',          name: 'Amman',          country: 'Jordan',    lat: 31.9454,  lng: 35.9284,   density: 5_400,  population: 4_000_000, region: 'Middle East', description: "The capital of Jordan." },

  // ── Africa ─────────────────────────────────────────────────────────────
  { slug: 'cairo',          name: 'Cairo',          country: 'Egypt',     lat: 30.0444,  lng: 31.2357,   density: 19_000, population: 9_540_000, region: 'Africa', description: "The capital of Egypt and the largest city in the Arab world; the Greater Cairo region holds over 21 million." },
  { slug: 'lagos',          name: 'Lagos',          country: 'Nigeria',   lat: 6.5244,   lng: 3.3792,    density: 13_400, population: 15_388_000, region: 'Africa', description: "The largest city in Nigeria and one of the fastest-growing megacities in the world." },
  { slug: 'johannesburg',   name: 'Johannesburg',   country: 'South Africa', lat: -26.2041, lng: 28.0473, density: 2_400, population: 5_635_000, region: 'Africa', description: "The largest city in South Africa and the country's economic center." },
  { slug: 'nairobi',        name: 'Nairobi',        country: 'Kenya',     lat: -1.2921,  lng: 36.8219,   density: 6_200,  population: 4_734_000, region: 'Africa', description: "The capital of Kenya and the largest city in East Africa." },
  { slug: 'casablanca',     name: 'Casablanca',     country: 'Morocco',   lat: 33.5731,  lng: -7.5898,   density: 11_200, population: 3_700_000, region: 'Africa', description: "The largest city in Morocco and a major Atlantic port." },
  { slug: 'addis-ababa',    name: 'Addis Ababa',    country: 'Ethiopia',  lat: 9.0320,   lng: 38.7469,   density: 5_200,  population: 5_500_000, region: 'Africa', description: "The capital of Ethiopia and headquarters of the African Union." },
  { slug: 'cape-town',      name: 'Cape Town',      country: 'South Africa', lat: -33.9249, lng: 18.4241, density: 1_500, population: 4_600_000, region: 'Africa', description: "The legislative capital of South Africa, on the southern Atlantic coast." },
  { slug: 'accra',          name: 'Accra',          country: 'Ghana',     lat: 5.6037,   lng: -0.1870,   density: 12_000, population: 2_400_000, region: 'Africa', description: "The capital of Ghana on the Gulf of Guinea." },
  { slug: 'algiers',        name: 'Algiers',        country: 'Algeria',   lat: 36.7538,  lng: 3.0588,    density: 5_300,  population: 3_500_000, region: 'Africa', description: "The capital and largest city of Algeria, on the Mediterranean coast." },

  // ── Oceania ────────────────────────────────────────────────────────────
  { slug: 'sydney',         name: 'Sydney',         country: 'Australia', lat: -33.8688, lng: 151.2093,  density: 2_100,  population: 5_312_000, region: 'Oceania', description: "The largest city in Australia and host of the 2000 Summer Olympics." },
  { slug: 'melbourne',      name: 'Melbourne',      country: 'Australia', lat: -37.8136, lng: 144.9631,  density: 2_500,  population: 5_078_000, region: 'Oceania', description: "The second-largest city in Australia and capital of the state of Victoria." },
  { slug: 'auckland',       name: 'Auckland',       country: 'New Zealand', lat: -36.8485, lng: 174.7633, density: 1_300, population: 1_700_000, region: 'Oceania', description: "The largest city in New Zealand." },
  { slug: 'brisbane',       name: 'Brisbane',       country: 'Australia', lat: -27.4698, lng: 153.0251,  density: 1_500,  population: 2_600_000, region: 'Oceania', description: "The capital of Queensland and Australia's third-largest city." },
  { slug: 'perth',          name: 'Perth',          country: 'Australia', lat: -31.9505, lng: 115.8605,  density: 320,    population: 2_100_000, region: 'Oceania', description: "The capital of Western Australia and the most isolated major city in the world." },
]
