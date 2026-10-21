/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Figtree', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50: '#F5F7FA',
          100: '#EBEEF3',
          200: '#DCE1EA',
          300: '#B9C1D1',
          400: '#8F9BB2',
          500: '#66748F',
          600: '#475674',
          700: '#2B3A57',
          800: '#1B2740',
          900: '#111A2E',
          950: '#0B1220',
        },
        path: {
          50: '#E8FAFD',
          100: '#C9F2F9',
          200: '#97E4F2',
          300: '#5DD0E6',
          400: '#27B6D2',
          500: '#0E9BB8',
          600: '#0A7E99',
          700: '#0C657B',
          800: '#0F5265',
          900: '#104556',
        },
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(14,155,184,0.35)' },
          '50%': { boxShadow: '0 0 0 8px rgba(14,155,184,0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(30px,-20px,0) scale(1.08)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2.4s ease-out infinite',
        drift: 'drift 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
