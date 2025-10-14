<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end justify-center md:items-center"
        @click="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50"></div>

        <!-- Modal Content -->
        <div
          class="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-xl"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Sort By</h3>
            <button
              @click="close"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Sort Options -->
          <div class="space-y-2">
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="selectSort(option.value)"
              class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
              :class="{ 'bg-gray-100': modelValue === option.value }"
            >
              <span class="text-gray-900 font-semibold text-base">{{ option.label }}</span>
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                :class="
                  modelValue === option.value
                    ? 'border-active bg-active'
                    : 'border-divider'
                "
              >
                <div
                  v-if="modelValue === option.value"
                  class="w-2 h-2 bg-white rounded-full"
                ></div>
              </div>
            </button>
          </div>

          <!-- Apply Button -->
          <button
            @click="close"
            class="w-full mt-6 py-3.5 bg-button-primary text-button-text rounded-xl font-semibold hover:bg-button-primary/90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  modelValue: 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'update:modelValue', value: 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'): void
}>()

const sortOptions = [
  { label: 'Number (Lowest First)', value: 'id-asc' as const },
  { label: 'Number (Highest First)', value: 'id-desc' as const },
  { label: 'Name (A-Z)', value: 'name-asc' as const },
  { label: 'Name (Z-A)', value: 'name-desc' as const },
]

const selectSort = (value: typeof props.modelValue) => {
  emit('update:modelValue', value)
}

const close = () => {
  emit('update:show', false)
}
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
