/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          yellow: '#FFC107',
          'yellow-dark': '#FFA000',
          'yellow-light': '#FFD54F',
          blue: '#1E88E5',
          'blue-dark': '#1565C0',
          'blue-light': '#42A5F5',
        },
        accent: {
          purple: '#6C5CE7',
          teal: '#00CEC9',
        },
        surface: {
          darkest: '#0D0D0F',
          DEFAULT: '#1A1A1F',
          card: '#1E1E24',
          hover: '#2A2A32',
          border: '#2A2A32',
        },
        brand: {
          spotify: '#1DB954',
          youtube: '#FF0000',
          instagram: '#E4405F',
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
};
