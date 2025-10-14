<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNavigation from './components/BottomNavigation.vue'
</script>

<template>
  <div class="min-h-screen bg-white pb-16 md:pb-0">
    <RouterView />
    <BottomNavigation />
  </div>
</template>

