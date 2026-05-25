import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0d1b4b',
        blue: {
          DEFAULT: '#1a237e',
          mid: '#283593',
          600: '#1e40af',
          700: '#1d3d8f',
          800: '#1a237e',
          900: '#0d1b4b',
        },
        orange: {
          DEFAULT: '#ff6f00',
          light: '#ff9800',
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        saffron: '#ff9800',
        cream: '#fffde7',
        gold: '#f9a825',
      },
      fontFamily: {
        yatra: ['"Yatra One"', 'cursive'],
        hindi: ['"Tiro Devanagari Hindi"', 'serif'],
        display: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-sm': '20px 20px',
        'dot-md': '30px 30px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(13,27,75,0.12)',
        'card-hover': '0 8px 40px rgba(13,27,75,0.2)',
        'orange': '0 4px 20px rgba(255,111,0,0.3)',
        'orange-lg': '0 8px 32px rgba(255,111,0,0.4)',
        'navy': '0 4px 20px rgba(13,27,75,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
