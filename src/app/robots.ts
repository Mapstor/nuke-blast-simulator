import { MetadataRoute } from 'next'

const SITE_URL = 'https://nukeblastsimulator.com'

// AI search crawlers — explicit allowlist so future WAF rules can't accidentally
// block them. Their citations matter for AI search visibility (ChatGPT,
// Perplexity, Claude, Google AI Overviews, etc.).
const AI_BOTS = [
  'GPTBot',          // OpenAI training crawler
  'OAI-SearchBot',   // ChatGPT live search
  'ChatGPT-User',    // ChatGPT browsing
  'PerplexityBot',   // Perplexity index
  'Perplexity-User', // Perplexity live fetch
  'ClaudeBot',       // Anthropic crawler
  'Claude-Web',      // Claude live fetch
  'anthropic-ai',    // Anthropic legacy UA
  'CCBot',           // Common Crawl (powers many AI training corpora)
  'Google-Extended', // Google AI training opt-in (separate from Googlebot)
  'Applebot-Extended', // Apple AI
  'cohere-ai',       // Cohere
  'Bytespider',      // ByteDance (TikTok / Doubao)
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for all crawlers (Googlebot, Bingbot, etc.)
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      // Explicit allow for each AI search/training bot
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: ['/api/'],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
