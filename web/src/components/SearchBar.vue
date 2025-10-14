<template>
  <div class="relative">
    <div class="relative">
      <!-- Search Icon -->
      <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Input Field -->
      <input
        id="pokemon-search"
        v-model="searchInput"
        type="text"
        placeholder="Search by name, number, or type"
        class="w-full pl-12 pr-12 py-3.5 bg-card rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary/20 transition-shadow"
        @input="handleInput"
      />

      <!-- Clear Button -->
      <button
        v-if="searchInput"
        @click="clearSearch"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/50 rounded-full transition-colors"
        aria-label="Clear search"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const searchInput = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  searchInput.value = newValue
})

const handleInput = () => {
  emit('update:modelValue', searchInput.value)
  emit('search', searchInput.value)
}

const clearSearch = () => {
  searchInput.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>
