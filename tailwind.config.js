/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        start: '#10b981',
        end: '#ef4444', 
        wall: '#374151',
        visited: '#a855f7',
        path: '#f59e0b',
        empty: '#f9fafb'
      },
      animation: {
        'visited': 'visited 0.3s ease-out',
        'path': 'path 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        visited: {
          '0%': { transform: 'scale(0.3)', backgroundColor: '#a855f7' },
          '50%': { transform: 'scale(1.2)', backgroundColor: '#c084fc' },
          '100%': { transform: 'scale(1)', backgroundColor: '#a855f7' },
        },
        path: {
          '0%': { transform: 'scale(0.6)', backgroundColor: '#f59e0b' },
          '50%': { transform: 'scale(1.2)', backgroundColor: '#fbbf24' },
          '100%': { transform: 'scale(1)', backgroundColor: '#f59e0b' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
