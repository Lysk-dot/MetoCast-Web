/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          primary: '#FFC107',
          dark: '#FFA000',
          light: '#FFD54F',
        },
        blue: {
          primary: '#1E88E5',
          dark: '#1565C0',
          light: '#42A5F5',
        },
        purple: '#6C5CE7',
        teal: '#00CEC9',
        spotify: '#1DB954',
        youtube: '#FF0000',
        instagram: '#E4405F',
        surface: {
          dark: '#0D0D0F',
          DEFAULT: '#1A1A1F',
          card: '#1E1E24',
          hover: '#2A2A32',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
