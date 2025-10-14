import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const FAVORITES_KEY = 'pokemon-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const favoriteIds = ref<Set<number>>(new Set())

  // Getters
  const isFavorite = computed(() => {
    return (id: number) => favoriteIds.value.has(id)
  })

  const favoritesCount = computed(() => favoriteIds.value.size)

  const favoritesList = computed(() => Array.from(favoriteIds.value))

  // Actions
  function addFavorite(id: number) {
    favoriteIds.value.add(id)
    saveFavorites()
  }

  function removeFavorite(id: number) {
    favoriteIds.value.delete(id)
    saveFavorites()
  }

  function toggleFavorite(id: number) {
    if (favoriteIds.value.has(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  function clearFavorites() {
    favoriteIds.value.clear()
    saveFavorites()
  }

  // Persistence
  function saveFavorites() {
    const favorites = Array.from(favoriteIds.value)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }

  function loadFavorites() {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      try {
        const favorites = JSON.parse(stored) as number[]
        favoriteIds.value = new Set(favorites)
      } catch (e) {
        console.error('Failed to load favorites from localStorage:', e)
        favoriteIds.value = new Set()
      }
    }
  }

  // Load favorites on store creation
  loadFavorites()

  return {
    // State
    favoriteIds,
    // Getters
    isFavorite,
    favoritesCount,
    favoritesList,
    // Actions
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    loadFavorites,
  }
})
