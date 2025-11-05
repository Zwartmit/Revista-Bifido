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
        // Colores de las mascotas
        punkibri: {
          primary: '#4CAF50',
          secondary: '#81C784',
          dark: '#388E3C',
        },
        mordaz: {
          primary: '#FF6B6B',
          secondary: '#FF8E8E',
          dark: '#D32F2F',
        },
        malandra: {
          primary: '#9C27B0',
          secondary: '#BA68C8',
          dark: '#7B1FA2',
        },
        anika: {
          primary: '#00BCD4',
          secondary: '#4DD0E1',
          dark: '#0097A7',
        },
        incendia: {
          primary: '#FF9800',
          secondary: '#FFB74D',
          dark: '#F57C00',
        },
        bifido: {
          black: '#1a1a1a',
          gray: '#2a2a2a',
          lightgray: '#e0e0e0',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
