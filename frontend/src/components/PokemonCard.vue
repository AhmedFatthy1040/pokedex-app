<template>
  <router-link
    :to="`/pokemon/${pokemon.id}`"
    class="block bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="flex items-center gap-4">
      <!-- Pokemon Image -->
      <div class="w-20 h-20 flex-shrink-0 bg-white rounded-xl flex items-center justify-center">
        <img
          :src="getImageUrl(pokemon.sprites.front_default)"
          :alt="pokemon.name"
          class="w-16 h-16 object-contain"
          loading="lazy"
        />
      </div>

      <!-- Pokemon Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-gray-500 text-sm font-medium">
            #{{ String(pokemon.id).padStart(3, '0') }}
          </span>
        </div>
        
        <h3 class="text-gray-900 text-lg font-semibold mb-2 capitalize">
          {{ pokemon.name }}
        </h3>

        <!-- Type Badges -->
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="typeInfo in pokemon.types"
            :key="typeInfo.type.name"
            :class="getTypeClass(typeInfo.type.name)"
            class="px-3 py-1 rounded-full text-xs font-medium text-white"
          >
            {{ typeInfo.type.name }}
          </span>
        </div>
      </div>

      <!-- Favorite Button -->
      <button
        @click.prevent="toggleFavorite"
        class="flex-shrink-0 p-2 hover:bg-white/50 rounded-full transition-colors"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        <svg
          class="w-6 h-6 transition-colors"
          :class="isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'"
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
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonListItem } from '@/types/pokemon'
import { useFavoritesStore } from '@/stores'

const props = defineProps<{
  pokemon: PokemonListItem
}>()

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.pokemon.id))

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.pokemon.id)
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
</script>
