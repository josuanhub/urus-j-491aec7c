/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          50: '#F0EFFF',
          100: '#E1DEFF',
          200: '#C3BCFF',
          300: '#A59BFF',
          400: '#8879FF',
          500: '#6C63FF',
          600: '#4D42FF',
          700: '#2E21FF',
          800: '#1300FF',
          900: '#0F00CC'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50: '#E6FFF9',
          100: '#CCFFF3',
          200: '#99FFE7',
          300: '#66FFDB',
          400: '#33FFCF',
          500: '#00D4AA',
          600: '#00AA88',
          700: '#007F66',
          800: '#005544',
          900: '#002A22'
        },
        surface: {
          DEFAULT: '#1A1A2E',
          50: '#3A3A6E',
          100: '#343464',
          200: '#2E2E5A',
          300: '#282850',
          400: '#222246',
          500: '#1A1A2E',
          600: '#141424',
          700: '#0E0E1A',
          800: '#080810',
          900: '#020206'
        },
        base: {
          DEFAULT: '#0A0A0F',
          50: '#2A2A3F',
          100: '#242435',
          200: '#1E1E2B',
          300: '#181821',
          400: '#121217',
          500: '#0A0A0F',
          600: '#040407',
          700: '#000000',
          800: '#000000',
          900: '#000000'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-surface': 'linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)'
      },
      boxShadow: {
        'primary-glow': '0 0 20px rgba(108, 99, 255, 0.4)',
        'accent-glow': '0 0 20px rgba(0, 212, 170, 0.4)'
      }
    }
  },
  plugins: []
}