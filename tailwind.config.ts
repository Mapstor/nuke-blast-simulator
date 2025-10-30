import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blast: {
          fireball: '#ff0000',
          severe: '#ff6600',
          moderate: '#ff9900',
          light: '#ffcc00',
          thermal: '#cc00ff',
          fallout: '#00cc66'
        }
      }
    },
  },
  plugins: [],
}

export default config