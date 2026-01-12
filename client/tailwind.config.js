/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bento-cream': '#FFF8F0',
        'bento-wood': '#D4A574',
        'bento-dark-wood': '#A67C52',
        'bento-rice': '#F5F5DC',
        'bento-seaweed': '#2C5F2D',
        'bento-salmon': '#FA8072',
        'bento-orange': '#FF8C42',
        'bento-green': '#7FB069',
      },
    },
  },
  plugins: [],
}
