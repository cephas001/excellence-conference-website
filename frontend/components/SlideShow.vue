<template>
  <TransitionGroup
    enter-active-class="transition-opacity duration-1000 ease-in-out"
    leave-active-class="transition-opacity duration-1000 ease-in-out"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-for="(slide, index) in slides"
      :key="slide"
      v-show="currentSlide === index"
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 grayscale mix-blend-luminosity"
      :style="{ backgroundImage: `url(${slide})` }"
    ></div>
  </TransitionGroup>
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
