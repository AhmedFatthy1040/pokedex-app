<template>
  <div class="min-h-screen bg-favorites-gradient pb-20 md:pb-6">
    <AppHeader title="Favorites" />
    
    <main class="max-w-7xl mx-auto px-4 py-4">
      <!-- Empty State -->
      <div v-if="favoritesStore.favoritesCount === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-white mb-2">No Favorites Yet</h2>
        <p class="text-white/80 mb-6">Start adding Pokemon to your favorites!</p>
        <router-link
          to="/"
          class="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-medium transition-colors"
        >
          Browse Pokemon
        </router-link>
      </div>
      
      <!-- Favorites List -->
      <div v-else>
        <!-- Header with Count and Clear Button -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">
            {{ favoritesStore.favoritesCount }} Favorite{{ favoritesStore.favoritesCount !== 1 ? 's' : '' }}
          </h2>
          <button
            v-if="favoritesStore.favoritesCount > 0"
            @click="showClearConfirm = true"
            class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        <!-- Pokemon Cards -->
        <div class="space-y-3">
          <div
            v-for="pokemon in favoritePokemon"
            :key="pokemon.id"
            class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:bg-white/15 transition-colors"
          >
            <div class="flex items-center gap-4">
              <!-- Pokemon Image -->
              <router-link
                :to="`/pokemon/${pokemon.id}`"
                class="w-20 h-20 flex-shrink-0 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <img
                  :src="getImageUrl(pokemon.sprites.front_default)"
                  :alt="pokemon.name"
                  class="w-16 h-16 object-contain"
                  loading="lazy"
                />
              </router-link>

              <!-- Pokemon Info -->
              <router-link
                :to="`/pokemon/${pokemon.id}`"
                class="flex-1 min-w-0"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-white/80 text-sm font-medium">
                    #{{ String(pokemon.id).padStart(3, '0') }}
                  </span>
                </div>
                
                <h3 class="text-white text-lg font-semibold mb-2 capitalize">
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
              </router-link>

              <!-- Remove Button -->
              <button
                @click="removeFavorite(pokemon.id)"
                class="flex-shrink-0 p-2 hover:bg-red-500/20 rounded-full transition-colors group"
                aria-label="Remove from favorites"
              >
                <svg
                  class="w-6 h-6 text-white/60 group-hover:text-red-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Clear Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showClearConfirm"
          class="fixed inset-0 z-50 flex items-end justify-center md:items-center"
          @click="showClearConfirm = false"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50"></div>

          <!-- Modal Content -->
          <div
            class="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-xl"
            @click.stop
          >
            <h3 class="text-xl font-bold text-gray-900 mb-4">Clear All Favorites?</h3>
            <p class="text-gray-600 mb-6">
              This will remove all {{ favoritesStore.favoritesCount }} Pokemon from your favorites.
              This action cannot be undone.
            </p>

            <div class="flex gap-3">
              <button
                @click="showClearConfirm = false"
                class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                @click="clearAllFavorites"
                class="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useFavoritesStore, usePokemonStore } from '@/stores'
import type { PokemonListItem } from '@/types/pokemon'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const pokemonStore = usePokemonStore()
const showClearConfirm = ref(false)

const favoritePokemon = computed<PokemonListItem[]>(() => {
  return pokemonStore.pokemons.filter(p => 
    favoritesStore.isFavorite(p.id)
  )
})

const removeFavorite = (id: number) => {
  favoritesStore.removeFavorite(id)
}

const clearAllFavorites = () => {
  favoritesStore.clearFavorites()
  showClearConfirm.value = false
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

onMounted(() => {
  // Load Pokemon data if not already loaded
  pokemonStore.loadFromCache()
  if (pokemonStore.pokemons.length === 0) {
    pokemonStore.fetchPokemons()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: translateY(100%);
}

.modal-leave-to .relative {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .modal-enter-from .relative,
  .modal-leave-to .relative {
    transform: scale(0.9);
  }
}
</style>
