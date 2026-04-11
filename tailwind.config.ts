import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFE600',
          black:  '#0A0A0A',
        },
      },
      fontFamily: {
        condensed: ['var(--font-barlow-condensed)', 'sans-serif'],
        sans:      ['var(--font-barlow)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
