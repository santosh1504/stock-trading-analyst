/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030712',
          900: '#0a0e1a',
          800: '#0d1117',
          700: '#111827',
          600: '#1a2233',
          500: '#1e2d45',
        },
        cyan: {
          glow: '#00d4ff',
          soft: '#67e8f9',
        },
        green: {
          glow: '#00ff88',
          soft: '#4ade80',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'radial-navy': 'radial-gradient(ellipse at center, #0d1f3c 0%, #030712 70%)',
        'gradient-cyan': 'linear-gradient(135deg, #00d4ff, #0066cc)',
        'gradient-green': 'linear-gradient(135deg, #00ff88, #00b4d8)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.35), 0 0 40px rgba(0, 212, 255, 0.15)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.35), 0 0 40px rgba(0, 255, 136, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
