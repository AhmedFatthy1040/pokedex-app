<template>
  <div class="min-h-screen bg-white pb-20 md:pb-6">
    <AppHeader title="Pokédex" :show-filter="true" @filter="toggleSortModal" />
    
    <main class="max-w-7xl mx-auto px-4 py-4">
      <!-- Search Bar -->
      <SearchBar
        v-model="pokemonStore.searchQuery"
        @search="handleSearch"
        class="mb-4"
      />

      <!-- Results Info -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-gray-600 text-sm">
          {{ pokemonStore.filteredPokemons.length }} Pokemon found
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pokemonStore.loading && pokemonStore.pokemons.length === 0" class="space-y-4">
        <div
          v-for="i in 6"
          :key="i"
          class="bg-card rounded-2xl p-4 animate-pulse"
        >
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-gray-300 rounded-xl"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-300 rounded w-16 mb-2"></div>
              <div class="h-6 bg-gray-300 rounded w-32 mb-2"></div>
              <div class="flex gap-2">
                <div class="h-6 bg-gray-300 rounded w-16"></div>
                <div class="h-6 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="pokemonStore.error && pokemonStore.pokemons.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed to Load Pokemon</h3>
        <p class="text-gray-600 mb-4">{{ pokemonStore.error }}</p>
        <button
          @click="pokemonStore.fetchPokemons()"
          class="px-6 py-2 bg-button-primary text-button-text rounded-lg font-medium hover:bg-button-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="pokemonStore.filteredPokemons.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No Pokemon Found</h3>
        <p class="text-gray-600">Try adjusting your search</p>
      </div>
      
      <!-- Pokemon Grid -->
      <div v-else class="space-y-3">
        <PokemonCard
          v-for="pokemon in pokemonStore.filteredPokemons"
          :key="pokemon.id"
          :pokemon="pokemon"
        />
      </div>
    </main>

    <!-- Sort Modal -->
    <SortModal
      v-model:show="showSortModal"
      v-model="pokemonStore.sortBy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import PokemonCard from '@/components/PokemonCard.vue'
import SortModal from '@/components/SortModal.vue'
import { usePokemonStore } from '@/stores'

const pokemonStore = usePokemonStore()
const showSortModal = ref(false)

const toggleSortModal = () => {
  showSortModal.value = !showSortModal.value
}

const handleSearch = (query: string) => {
  // Search is handled reactively through the store's computed filteredPokemons
  // This handler is here for any additional search logic if needed
}

onMounted(() => {
  // Load cached data first for instant display
  pokemonStore.loadFromCache()
  
  // Then fetch fresh data from API
  pokemonStore.fetchPokemons()
})
</script>
