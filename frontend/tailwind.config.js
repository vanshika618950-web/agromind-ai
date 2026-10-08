/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: {
          950: '#010904',
          900: '#020e07',
          850: '#04160c',
          800: '#072012',
          750: '#0a2a19',
          700: '#0d3822',
        },
        agro: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        limeAccent: {
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
        },
        neuralCyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        earth: {
          50: '#fcfaf6',
          100: '#f7f3ea',
          200: '#ede4d2',
          300: '#dfd0b3',
          400: '#c5ae82',
          500: '#a68c5b',
          600: '#876e44',
          700: '#6c5637',
          800: '#56442f',
          900: '#463829',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 24, 40, 0.06), 0 2px 6px -2px rgba(16, 24, 40, 0.04)',
        'elevated': '0 12px 32px -4px rgba(16, 24, 40, 0.08), 0 4px 12px -2px rgba(16, 24, 40, 0.04)',
        'glow-green': '0 0 35px -5px rgba(34, 197, 94, 0.35)',
        'glow-emerald': '0 0 40px -8px rgba(16, 185, 129, 0.45)',
        'glow-cyan': '0 0 40px -8px rgba(6, 182, 212, 0.45)',
        'glow-card': '0 8px 32px 0 rgba(16, 185, 129, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
