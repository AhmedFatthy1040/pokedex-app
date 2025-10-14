import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Pokemon, PokemonListItem } from '@/types/pokemon'
import { pokemonService } from '@/services/pokemon.service'

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const pokemons = ref<PokemonListItem[]>([])
  const pokemonDetails = ref<Map<number, Pokemon>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const sortBy = ref<'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'>('id-asc')

  // Getters
  const filteredPokemons = computed(() => {
    let result = [...pokemons.value]

    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toString().includes(query) ||
          p.types.some((t) => t.type.name.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'id-asc':
          return a.id - b.id
        case 'id-desc':
          return b.id - a.id
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

    return result
  })

  const getPokemonById = computed(() => {
    return (id: number) => pokemonDetails.value.get(id)
  })

  // Actions
  async function fetchPokemons() {
    loading.value = true
    error.value = null

    try {
      const data = await pokemonService.getPokemons({ sort: sortBy.value })
      pokemons.value = data
      
      // Cache in localStorage for offline access
      localStorage.setItem('pokemons', JSON.stringify(data))
    } catch (e) {
      error.value = 'Failed to fetch Pokemon'
      console.error('Error fetching pokemons:', e)
      
      // Try to load from cache
      const cached = localStorage.getItem('pokemons')
      if (cached) {
        pokemons.value = JSON.parse(cached)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchPokemonDetails(id: number) {
    // Return cached if available
    if (pokemonDetails.value.has(id)) {
      return pokemonDetails.value.get(id)
    }

    loading.value = true
    error.value = null

    try {
      const data = await pokemonService.getPokemonById(id)
      pokemonDetails.value.set(id, data)
      
      // Cache in localStorage
      const cached = JSON.parse(localStorage.getItem('pokemonDetails') || '{}')
      cached[id] = data
      localStorage.setItem('pokemonDetails', JSON.stringify(cached))
      
      return data
    } catch (e) {
      error.value = `Failed to fetch Pokemon #${id}`
      console.error(`Error fetching pokemon ${id}:`, e)
      
      // Try to load from cache
      const cached = JSON.parse(localStorage.getItem('pokemonDetails') || '{}')
      if (cached[id]) {
        const pokemon = cached[id]
        pokemonDetails.value.set(id, pokemon)
        return pokemon
      }
      throw e
    } finally {
      loading.value = false
    }
  }

  async function searchPokemons(query: string) {
    searchQuery.value = query
    
    if (!query) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await pokemonService.searchPokemons(query)
      pokemons.value = data
    } catch (e) {
      error.value = 'Failed to search Pokemon'
      console.error('Error searching pokemons:', e)
    } finally {
      loading.value = false
    }
  }

  function setSortBy(sort: typeof sortBy.value) {
    sortBy.value = sort
  }

  function clearSearch() {
    searchQuery.value = ''
    fetchPokemons()
  }

  // Load cached data on initialization
  function loadFromCache() {
    const cachedPokemons = localStorage.getItem('pokemons')
    if (cachedPokemons) {
      pokemons.value = JSON.parse(cachedPokemons)
    }

    const cachedDetails = localStorage.getItem('pokemonDetails')
    if (cachedDetails) {
      const details = JSON.parse(cachedDetails)
      Object.entries(details).forEach(([id, pokemon]) => {
        pokemonDetails.value.set(Number(id), pokemon as Pokemon)
      })
    }
  }

  return {
    // State
    pokemons,
    pokemonDetails,
    loading,
    error,
    searchQuery,
    sortBy,
    // Getters
    filteredPokemons,
    getPokemonById,
    // Actions
    fetchPokemons,
    fetchPokemonDetails,
    searchPokemons,
    setSortBy,
    clearSearch,
    loadFromCache,
  }
})
