<template>
  <Transition
    enter-active-class="transition-opacity duration-1000 ease-in-out"
    leave-active-class="transition-opacity duration-1000 ease-in-out"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      :key="currentSlide"
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 dark:opacity-30 mix-blend-overlay dark:mix-blend-luminosity grayscale transition-all duration-700"
      :style="{ backgroundImage: `url(${slides[currentSlide]})` }"
    ></div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
  currentSlide: {
    type: Number,
    required: true,
  },
});
</script>
