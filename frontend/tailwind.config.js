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
        background: '#FFFFFF',
        card: '#F7F7F7',
        text: {
          primary: '#1C1C1E',
          secondary: '#6E6E73',
        },
        divider: '#E5E5EA',
        placeholder: '#8E8E93',
        modal: '#F2F2F7',
        // Pokemon Types
        type: {
          water: '#4A90E2',
          grass: '#7ED321',
          fire: '#F5A623',
          poison: '#BD10E0',
          ghost: '#9013FE',
          normal: '#9B9B9B',
          electric: '#F7B731',
          ice: '#74B9FF',
          fighting: '#C03028',
          ground: '#E0C068',
          flying: '#A890F0',
          psychic: '#F85888',
          bug: '#A8B820',
          rock: '#B8A038',
          dragon: '#7038F8',
          dark: '#705848',
          steel: '#B8B8D0',
          fairy: '#EE99AC',
        },
        // Buttons & UI
        button: {
          primary: '#1C1C1E',
          text: '#FFFFFF',
        },
        active: '#32D74B',
      },
      backgroundImage: {
        'team-gradient': 'linear-gradient(180deg, #8A00FF 0%, #6600CC 100%)',
        'favorites-gradient': 'linear-gradient(180deg, #00D4FF 0%, #00FFC6 100%)',
      },
    },
  },
  plugins: [],
}
