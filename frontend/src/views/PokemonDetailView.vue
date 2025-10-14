<template>
  <div class="min-h-screen">
    <AppHeader title="Pokemon Detail" />
    
    <main class="max-w-7xl mx-auto px-4 py-4">
      <p class="text-gray-600">Pokemon ID: {{ route.params.id }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
</script>
