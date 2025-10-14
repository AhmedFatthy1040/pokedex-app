<template>
  <div class="min-h-screen bg-white pb-20 md:pb-6">
    <AppHeader :title="pokemon ? pokemon.name : 'Loading...'" />
    
    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse">
      <div class="h-80 bg-gray-300"></div>
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div class="h-20 bg-gray-300 rounded mb-4"></div>
        <div class="h-40 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 px-4">
      <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed to Load Pokemon</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button
        @click="loadPokemon"
        class="px-6 py-2 bg-button-primary text-button-text rounded-lg font-medium hover:bg-button-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Pokemon Detail -->
    <div v-else-if="pokemon">
      <!-- Hero Section with Image -->
      <div
        class="relative py-12 px-4"
        :style="{ background: `linear-gradient(180deg, ${getTypeGradient(pokemon.types[0].type)} 0%, ${getTypeGradient(pokemon.types[0].type)}dd 100%)` }"
      >
        <div class="max-w-7xl mx-auto text-center">
          <!-- Pokemon Number -->
          <p class="text-white/80 text-lg font-medium mb-2">
            #{{ String(pokemon.id).padStart(3, '0') }}
          </p>
          
          <!-- Pokemon Name -->
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 capitalize">
            {{ pokemon.name }}
          </h1>

          <!-- Pokemon Image -->
          <div class="relative inline-block">
            <img
              :src="getImageUrl(pokemon.sprites.front_default)"
              :alt="pokemon.name"
              class="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
            />
            
            <!-- Favorite Button -->
            <button
              @click="toggleFavorite"
              class="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all"
              :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            >
              <svg
                class="w-8 h-8 transition-colors"
                :class="isFavorite ? 'text-red-500 fill-current' : 'text-white'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <!-- Type Badges -->
          <div class="flex justify-center gap-2 mt-6">
            <span
              v-for="typeInfo in pokemon.types"
              :key="typeInfo.type"
              :class="getTypeClass(typeInfo.type)"
              class="px-6 py-2 rounded-full text-sm font-semibold text-white uppercase"
            >
              {{ typeInfo.type }}
            </span>
          </div>
        </div>
      </div>

      <!-- Details Section -->
      <div class="max-w-7xl mx-auto px-4 py-6">
        <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-card rounded-2xl p-4 text-center">
            <p class="text-gray-600 text-sm mb-1">Height</p>
            <p class="text-2xl font-bold text-gray-900">{{ (pokemon.height / 10).toFixed(1) }}m</p>
          </div>
          <div class="bg-card rounded-2xl p-4 text-center">
            <p class="text-gray-600 text-sm mb-1">Weight</p>
            <p class="text-2xl font-bold text-gray-900">{{ (pokemon.weight / 10).toFixed(1) }}kg</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Stats</h2>
          <div class="space-y-4">
            <div v-for="statInfo in pokemon.stats" :key="statInfo.stat" class="flex items-center gap-4">
              <div class="w-32 md:w-40">
                <p class="text-sm font-medium text-gray-700 capitalize">
                  {{ formatStatName(statInfo.stat) }}
                </p>
              </div>
              <div class="flex-1">
                <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="getStatColor(statInfo.base_stat)"
                    :style="{ width: `${Math.min((statInfo.base_stat / 255) * 100, 100)}%` }"
                  ></div>
                </div>
              </div>
              <div class="w-12 text-right">
                <p class="text-sm font-bold text-gray-900">{{ statInfo.base_stat }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Abilities -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Abilities</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="abilityInfo in pokemon.abilities"
              :key="abilityInfo.ability"
              class="bg-card rounded-xl p-4"
            >
              <div class="flex items-center justify-between">
                <p class="font-semibold text-gray-900 capitalize">
                  {{ abilityInfo.ability.replace('-', ' ') }}
                </p>
                <span
                  v-if="abilityInfo.is_hidden"
                  class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                >
                  Hidden
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Moves -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Moves</h2>
          <p class="text-gray-600 text-sm mb-4">Showing level-up moves</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            <div
              v-for="moveInfo in levelUpMoves"
              :key="moveInfo.move"
              class="bg-card rounded-xl p-3 flex items-center justify-between"
            >
              <p class="font-medium text-gray-900 capitalize">
                {{ moveInfo.move.replace('-', ' ') }}
              </p>
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Lv. {{ moveInfo.level }}
              </span>
            </div>
          </div>
          <p v-if="levelUpMoves.length === 0" class="text-gray-500 text-center py-8">
            No level-up moves available
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { usePokemonStore, useFavoritesStore } from '@/stores'
import type { Pokemon } from '@/types/pokemon'

const route = useRoute()
const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()

const pokemon = ref<Pokemon | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const isFavorite = computed(() => {
  if (!pokemon.value) return false
  return favoritesStore.isFavorite(pokemon.value.id)
})

const levelUpMoves = computed(() => {
  if (!pokemon.value) return []
  
  return pokemon.value.moves
    .filter(m => m.version_group_details.some(v => v.move_learn_method === 'level-up'))
    .map(m => {
      const levelUpDetails = m.version_group_details.find(v => v.move_learn_method === 'level-up')
      return {
        move: m.move,
        level: levelUpDetails?.level_learned_at || 0
      }
    })
    .sort((a, b) => a.level - b.level)
    .slice(0, 20) // Show first 20 moves
})

const toggleFavorite = () => {
  if (pokemon.value) {
    favoritesStore.toggleFavorite(pokemon.value.id)
  }
}

const loadPokemon = async () => {
  const id = Number(route.params.id)
  if (!id) {
    error.value = 'Invalid Pokemon ID'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const data = await pokemonStore.fetchPokemonDetails(id)
    pokemon.value = data || null
  } catch (e) {
    error.value = 'Failed to load Pokemon details'
    console.error('Error loading pokemon:', e)
  } finally {
    loading.value = false
  }
}

const getImageUrl = (path: string): string => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `http://localhost:3000${path}`
}

const getTypeClass = (type: string): string => {
  const typeClasses: Record<string, string> = {
    water: 'bg-type-water',
    grass: 'bg-type-grass',
    fire: 'bg-type-fire',
    poison: 'bg-type-poison',
    ghost: 'bg-type-ghost',
    normal: 'bg-type-normal',
    electric: 'bg-type-electric',
    ice: 'bg-type-ice',
    fighting: 'bg-type-fighting',
    ground: 'bg-type-ground',
    flying: 'bg-type-flying',
    psychic: 'bg-type-psychic',
    bug: 'bg-type-bug',
    rock: 'bg-type-rock',
    dragon: 'bg-type-dragon',
    dark: 'bg-type-dark',
    steel: 'bg-type-steel',
    fairy: 'bg-type-fairy',
  }
  return typeClasses[type] || 'bg-gray-400'
}

const getTypeGradient = (type: string): string => {
  const typeColors: Record<string, string> = {
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
  }
  return typeColors[type] || '#9B9B9B'
}

const formatStatName = (stat: string): string => {
  const names: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    'speed': 'Speed'
  }
  return names[stat] || stat
}

const getStatColor = (value: number): string => {
  if (value >= 150) return 'bg-green-500'
  if (value >= 100) return 'bg-blue-500'
  if (value >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

onMounted(() => {
  loadPokemon()
})
</script>
