/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#0f0f23',
        'game-panel': '#1a1a2e',
        'game-accent': '#16213e',
        'game-green': '#00ff88',
        'game-red': '#ff4757',
        'game-gold': '#ffd700',
      }
    },
  },
  plugins: [],
}
