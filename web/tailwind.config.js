/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base UI
        'card': '#F7F7F7',
        'divider': '#E5E5EA',
        'placeholder': '#8E8E93',
        'modal': '#F2F2F7',
        'active': '#32D74B',
        'text-primary': '#1C1C1E',
        'text-secondary': '#6E6E73',
        'button-primary': '#1C1C1E',
        'button-text': '#FFFFFF',
        // Pokemon Types
        'type-water': '#4A90E2',
        'type-grass': '#7ED321',
        'type-fire': '#F5A623',
        'type-poison': '#BD10E0',
        'type-ghost': '#9013FE',
        'type-normal': '#9B9B9B',
        'type-electric': '#F7B731',
        'type-ice': '#74B9FF',
        'type-fighting': '#C03028',
        'type-ground': '#E0C068',
        'type-flying': '#A890F0',
        'type-psychic': '#F85888',
        'type-bug': '#A8B820',
        'type-rock': '#B8A038',
        'type-dragon': '#7038F8',
        'type-dark': '#705848',
        'type-steel': '#B8B8D0',
        'type-fairy': '#EE99AC',
      },
      backgroundImage: {
        'team-gradient': 'linear-gradient(180deg, #8A00FF 0%, #6600CC 100%)',
        'favorites-gradient': 'linear-gradient(180deg, #00D4FF 0%, #00FFC6 100%)',
      },
    },
  },
  plugins: [],
}
