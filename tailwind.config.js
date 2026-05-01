/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'expand-blue': '#3b82f6',
        'expand-purple': '#8b5cf6',
        'expand-green': '#10b981',
        'expand-red': '#ef4444',
      },
    },
  },
  plugins: [],
}