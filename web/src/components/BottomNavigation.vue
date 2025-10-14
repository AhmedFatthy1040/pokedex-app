<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-divider z-50 md:hidden">
    <div class="flex justify-around items-center h-16">
      <RouterLink
        to="/"
        class="flex flex-col items-center justify-center flex-1 h-full text-gray-600"
        :class="{ 'text-active': isActive('/') }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-xs mt-1">Pokédex</span>
      </RouterLink>

      <RouterLink
        to="/favorites"
        class="flex flex-col items-center justify-center flex-1 h-full text-gray-600"
        :class="{ 'text-active': isActive('/favorites') }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="text-xs mt-1">Favorites</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isActive = (path: string) => {
  return computed(() => route.path === path)
}
</script>

<style scoped>
.router-link-active {
  color: #32D74B;
}
</style>
