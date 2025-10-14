<template>
  <div class="min-h-screen bg-white">
    <AppHeader title="Pokédex" :show-filter="true" @filter="toggleSortModal" />
    
    <main class="max-w-7xl mx-auto px-4 py-4">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Pokemon List</h2>
      <p class="text-gray-600">Loading Pokemon...</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const showSortModal = ref(false)

const toggleSortModal = () => {
  showSortModal.value = !showSortModal.value
}
</script>
