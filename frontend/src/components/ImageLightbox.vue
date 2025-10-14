<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        @click="close"
      >
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
          aria-label="Close lightbox"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image Container -->
        <div
          class="relative max-w-7xl max-h-screen p-8"
          @click.stop
        >
          <div
            ref="imageContainer"
            class="relative overflow-hidden cursor-move"
            @mousedown="startDrag"
            @mousemove="drag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @wheel="handleWheel"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <img
              :src="imageSrc"
              :alt="imageAlt"
              class="max-w-full max-h-[80vh] object-contain transition-transform duration-200 select-none"
              :style="{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`
              }"
              draggable="false"
            />
          </div>

          <!-- Zoom Controls -->
          <div class="flex items-center justify-center gap-4 mt-6">
            <button
              @click="zoomOut"
              class="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
              :disabled="scale <= 1"
              :class="{ 'opacity-50 cursor-not-allowed': scale <= 1 }"
              aria-label="Zoom out"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            <span class="text-white font-medium min-w-16 text-center">
              {{ Math.round(scale * 100) }}%
            </span>

            <button
              @click="zoomIn"
              class="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
              :disabled="scale >= 4"
              :class="{ 'opacity-50 cursor-not-allowed': scale >= 4 }"
              aria-label="Zoom in"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>

            <button
              @click="resetZoom"
              class="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm text-white text-sm font-medium"
              aria-label="Reset zoom"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  imageSrc: string
  imageAlt?: string
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const imageContainer = ref<HTMLElement | null>(null)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const lastTranslateX = ref(0)
const lastTranslateY = ref(0)

// Touch state
const touchDistance = ref(0)
const lastTouchDistance = ref(0)

const close = () => {
  emit('update:show', false)
  resetZoom()
}

const zoomIn = () => {
  if (scale.value < 4) {
    scale.value = Math.min(scale.value + 0.5, 4)
  }
}

const zoomOut = () => {
  if (scale.value > 1) {
    scale.value = Math.max(scale.value - 0.5, 1)
    if (scale.value === 1) {
      translateX.value = 0
      translateY.value = 0
      lastTranslateX.value = 0
      lastTranslateY.value = 0
    }
  }
}

const resetZoom = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  lastTranslateX.value = 0
  lastTranslateY.value = 0
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  
  if (e.deltaY < 0) {
    // Scroll up - zoom in
    zoomIn()
  } else {
    // Scroll down - zoom out
    zoomOut()
  }
}

const startDrag = (e: MouseEvent) => {
  if (scale.value <= 1) return
  
  isDragging.value = true
  dragStartX.value = e.clientX - lastTranslateX.value
  dragStartY.value = e.clientY - lastTranslateY.value
}

const drag = (e: MouseEvent) => {
  if (!isDragging.value || scale.value <= 1) return
  
  translateX.value = e.clientX - dragStartX.value
  translateY.value = e.clientY - dragStartY.value
}

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    lastTranslateX.value = translateX.value
    lastTranslateY.value = translateY.value
  }
}

// Touch handlers for pinch-to-zoom
const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    // Pinch start
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    )
    touchDistance.value = distance
    lastTouchDistance.value = distance
  } else if (e.touches.length === 1 && scale.value > 1) {
    // Pan start
    isDragging.value = true
    dragStartX.value = e.touches[0].clientX - lastTranslateX.value
    dragStartY.value = e.touches[0].clientY - lastTranslateY.value
  }
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  
  if (e.touches.length === 2) {
    // Pinch zoom
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    )
    
    const delta = distance - lastTouchDistance.value
    const scaleDelta = delta * 0.01
    
    scale.value = Math.max(1, Math.min(4, scale.value + scaleDelta))
    lastTouchDistance.value = distance
    
    if (scale.value === 1) {
      translateX.value = 0
      translateY.value = 0
      lastTranslateX.value = 0
      lastTranslateY.value = 0
    }
  } else if (e.touches.length === 1 && isDragging.value && scale.value > 1) {
    // Pan
    translateX.value = e.touches[0].clientX - dragStartX.value
    translateY.value = e.touches[0].clientY - dragStartY.value
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
  lastTranslateX.value = translateX.value
  lastTranslateY.value = translateY.value
}

// Reset zoom when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetZoom()
  }
})

// Prevent body scroll when lightbox is open
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
