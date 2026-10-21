/** @type {import('next').NextConfig} */
// NBS-004: the /scenarios routes were consolidated into /examples. Serve a
// permanent 308 for every retired URL (generated from the scenario data by
// scripts/generate-scenario-redirects.mjs).
const scenarioRedirects = require('./data/scenario-redirects.json')
// NBS-005: OFAB-5000 was removed from the weapons data (no source).
const weaponRedirects = require('./data/weapon-redirects.json')

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [...scenarioRedirects, ...weaponRedirects]
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
