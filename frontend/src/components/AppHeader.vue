<template>
  <header class="sticky top-0 z-50 bg-white border-b border-divider">
    <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
      <!-- Back button or Logo -->
      <div class="flex items-center gap-3">
        <button
          v-if="showBackButton"
          @click="goBack"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2">
        <button
          v-if="showFilter"
          @click="$emit('filter')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Filter"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

defineProps<{
  title?: string
  showFilter?: boolean
}>()

defineEmits<{
  filter: []
}>()

const showBackButton = computed(() => {
  return route.name !== 'pokedex' && route.name !== 'favorites'
})

const goBack = () => {
  router.back()
}
</script>
