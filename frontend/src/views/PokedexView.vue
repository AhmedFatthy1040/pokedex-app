<template>
  <div class="min-h-screen bg-white">
    <AppHeader title="Pokédex" :show-filter="true" @filter="toggleSortModal" />
    
    <main class="max-w-7xl mx-auto px-4 py-4">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Pokemon List</h2>
      
      <!-- Loading State -->
      <div v-if="pokemonStore.loading" class="text-gray-600">
        Loading Pokemon...
      </div>
      
      <!-- Error State -->
      <div v-else-if="pokemonStore.error" class="text-red-600">
        {{ pokemonStore.error }}
      </div>
      
      <!-- Pokemon Count -->
      <p v-else class="text-gray-600 mb-4">
        {{ pokemonStore.filteredPokemons.length }} Pokemon found
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { usePokemonStore } from '@/stores'

const pokemonStore = usePokemonStore()
const showSortModal = ref(false)

const toggleSortModal = () => {
  showSortModal.value = !showSortModal.value
}

onMounted(() => {
  // Load cached data first for instant display
  pokemonStore.loadFromCache()
  
  // Then fetch fresh data from API
  pokemonStore.fetchPokemons()
})
</script>
