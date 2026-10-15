// Schema.org JSON-LD builders for Nuclear Blast Simulator.
// All schemas use stable `@id` URIs so they reference each other as a graph.
// Reference: https://schema.org, https://developers.google.com/search/docs/appearance/structured-data

export const SITE_URL = 'https://nukeblastsimulator.com'
export const SITE_NAME = 'Nuclear Blast Simulator' // product / software name
export const WEBSITE_NAME = 'Nuke Blast Simulator' // brand / WebSite name
export const PUBLISHER_NAME = 'Moving Data Systems d.o.o.'
export const AUTHOR_NAME = 'Marko Visic'
export const AUTHOR_CREDENTIAL = 'BSc Physics'
export const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/marko-visic/'
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const SOFTWARE_ID = `${SITE_URL}/#software`
export const AUTHOR_PERSON_ID = `${SITE_URL}/about#marko-visic`

export type SchemaObject = Record<string, unknown>

// ─────────────────────────────────────────────────────────────────────────
// Foundational entities (Organization, WebSite, SoftwareApplication)
// ─────────────────────────────────────────────────────────────────────────

export const organizationSchema: SchemaObject = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: PUBLISHER_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/icon.svg`,
    width: 512,
    height: 512,
  },
  email: 'info@nukeblastsimulator.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Smolnik 62',
    postalCode: '2342',
    addressLocality: 'Ruše',
    addressCountry: 'SI',
  },
  founder: { '@id': AUTHOR_PERSON_ID },
  brand: { '@type': 'Brand', name: WEBSITE_NAME },
  description:
    'Publisher of the Nuclear Blast Simulator, a free interactive tool that visualizes nuclear weapon effects for educational purposes.',
  knowsAbout: [
    'Nuclear weapons effects',
    'Blast radius calculations',
    'Nuclear physics',
    'Atomic bomb history',
  ],
}

export const websiteSchema: SchemaObject = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: WEBSITE_NAME,
  alternateName: ['Nuclear Blast Simulator', 'NukeBlastSimulator.com'],
  description:
    'Free interactive nuclear blast simulator. Calculate blast radius, casualties, fireball, thermal burn zones, and fallout for any city worldwide using 45+ historical and modern nuclear weapons.',
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/weapons?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const softwareApplicationSchema: SchemaObject = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': SOFTWARE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: 'EducationalApplication',
  applicationSubCategory: 'Simulator',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript and modern browser (Chrome 90+, Safari 14+, Firefox 88+)',
  description:
    'Interactive simulator that calculates the fireball radius, blast overpressure zones, thermal radiation, and fallout patterns for nuclear weapons of any yield, on any location worldwide.',
  inLanguage: 'en-US',
  isAccessibleForFree: true,
  publisher: { '@id': ORG_ID },
  author: { '@id': AUTHOR_PERSON_ID },
  featureList: [
    'Click-to-detonate interactive map',
    '45+ historical and modern nuclear weapons',
    'Air burst and surface burst modes',
    'Fireball, blast, thermal, and fallout zones',
    'Population-density-based casualty estimates',
    'Custom yield (1 to 100,000 kilotons)',
    'Shareable simulation URLs',
    'Mobile and desktop responsive',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
  },
  educationalUse: ['Nuclear disarmament education', 'Physics education', 'History education'],
}

// Author — a real, named human (site owner). Replaces the former collective
// "Editorial" persona (NBS-003). Credentials are the author's actual standing;
// never upgraded to "registered"/"licensed".
export const authorPersonSchema: SchemaObject = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': AUTHOR_PERSON_ID,
  name: AUTHOR_NAME,
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/images/marko-visic.jpeg`,
  jobTitle: 'Founder & author',
  description:
    'Marko Visic builds and writes Nuke Blast Simulator. Content is AI-assisted in drafting and checked against primary sources (Glasstone & Dolan 1977 and the sources page) before publication.',
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Ljubljana' },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'degree',
    name: AUTHOR_CREDENTIAL,
  },
  knowsAbout: [
    'Nuclear weapons effects',
    'Nuclear weapons physics',
    'Blast scaling laws (Glasstone & Dolan)',
    'Nuclear weapon history',
  ],
  worksFor: { '@id': ORG_ID },
  sameAs: [AUTHOR_LINKEDIN],
}

// ─────────────────────────────────────────────────────────────────────────
// Per-page schema builders
// ─────────────────────────────────────────────────────────────────────────

export type BreadcrumbItem = { name: string; url: string }

export function breadcrumbSchema(items: BreadcrumbItem[]): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

export type FaqEntry = { question: string; answer: string }

export function faqPageSchema(entries: FaqEntry[]): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}

export type HowToStep = { name: string; text: string; image?: string }

export function howToSchema(input: {
  name: string
  description: string
  totalTime?: string // ISO 8601 duration, e.g. "PT2M"
  steps: HowToStep[]
}): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: input.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
    })),
  }
}

export function articleSchema(input: {
  url: string
  headline: string
  description: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  imageUrl?: string
}): SchemaObject {
  const url = input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: input.headline,
    description: input.description,
    image: input.imageUrl ?? `${SITE_URL}/og-image.png`,
    datePublished: input.datePublished ?? '2025-10-22',
    dateModified: input.dateModified ?? new Date().toISOString().slice(0, 10),
    // Reference the named author Person by @id for a connected E-E-A-T graph.
    author: { '@id': AUTHOR_PERSON_ID },
    publisher: { '@id': ORG_ID },
  }
}

export function aboutPageSchema(url: string): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    about: { '@id': ORG_ID },
    mainEntity: { '@id': ORG_ID },
  }
}

export function contactPageSchema(url: string): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    mainEntity: { '@id': ORG_ID },
  }
}

export function datasetSchema(input: {
  url: string
  name: string
  description: string
  numberOfItems?: number
  keywords?: string[]
}): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: input.name,
    description: input.description,
    url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`,
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    ...(input.numberOfItems ? { distribution: { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}` } } : {}),
    ...(input.keywords ? { keywords: input.keywords.join(', ') } : {}),
  }
}

export const GLOSSARY_TERM_SET_ID = `${SITE_URL}/glossary#termset`

export function definedTermSetSchema(input: { name: string; description: string; url: string }): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': GLOSSARY_TERM_SET_ID,
    name: input.name,
    description: input.description,
    url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  }
}

export function definedTermSchema(input: {
  url: string
  term: string
  definition: string
}): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: input.term,
    description: input.definition,
    url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`,
    inDefinedTermSet: { '@id': GLOSSARY_TERM_SET_ID },
  }
}

export type ItemListEntry = { name: string; url: string; description?: string }

export function itemListSchema(items: ItemListEntry[], listName?: string): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(listName ? { name: listName } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
      ...(item.description ? { description: item.description } : {}),
    })),
  }
}
