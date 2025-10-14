<template>
  <div class="min-h-screen bg-favorites-gradient">
    <AppHeader title="Favorites" />
    
    <main class="max-w-7xl mx-auto px-4 py-4">
      <div class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-white mb-2">No Favorites Yet</h2>
        <p class="text-white/80">Start adding Pokemon to your favorites!</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>
