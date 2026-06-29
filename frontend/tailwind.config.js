/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#C9A84C',
          'gold-light': '#E8C96A',
          'gold-dark': '#A08030',
          olive: '#2C2A1E',
          'olive-light': '#3D3A26',
          carbon: '#111010',
          'carbon-light': '#1A1917',
          'carbon-mid': '#252320',
          surface: '#1E1C18',
          'surface-light': '#272420',
          border: '#333128',
          'border-light': '#444138',
          text: '#F5F2E8',
          'text-muted': '#9A9580',
          'text-dim': '#6B6758',
          green: '#7CB84A',
          'green-light': '#A3D470',
          red: '#D45A4A',
          'red-light': '#E87A6A',
          amber: '#D4924A',
          blue: '#4A8CD4',
          purple: '#8A4AD4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #A08030 100%)',
        'gradient-dark': 'linear-gradient(180deg, #111010 0%, #1A1917 100%)',
        'gradient-surface': 'linear-gradient(135deg, #1E1C18 0%, #252320 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201, 168, 76, 0.15)',
        'gold-sm': '0 0 10px rgba(201, 168, 76, 0.1)',
        'surface': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'surface-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-10px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
