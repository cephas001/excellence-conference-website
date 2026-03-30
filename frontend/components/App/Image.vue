<template>
  <div class="relative overflow-hidden bg-theme-base" :class="wrapperClass">
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 bg-theme-surface animate-pulse flex items-center justify-center z-10"
    >
      <Icon name="heroicons:photo" class="w-8 h-8 text-gray-800" />
    </div>

    <NuxtImg
      :src="currentSrc"
      :alt="alt"
      :class="[imgClass, { 'opacity-0': !isLoaded }]"
      format="webp"
      loading="lazy"
      @load="handleLoad"
      @error="handleError"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: "",
  },
  alt: {
    type: String,
    default: "Excellence Conference Image",
  },
  // The global fallback image (make sure this file exists in your public folder!)
  fallback: {
    type: String,
    default: "/img/fallback-logo.svg",
  },
  // Classes for the outer container
  wrapperClass: {
    type: String,
    default: "w-full h-full",
  },
  // Classes for the actual img tag
  imgClass: {
    type: String,
    default: "w-full h-full object-cover transition-opacity duration-500",
  },
});

const isLoaded = ref(false);
const hasError = ref(false);

// Reset states if the src prop changes dynamically
watch(
  () => props.src,
  () => {
    isLoaded.value = false;
    hasError.value = false;
  },
);

// Determine what to show. If no src provided, or if error occurred, use fallback.
const currentSrc = computed(() => {
  if (!props.src || hasError.value) return props.fallback;
  return props.src;
});

const handleLoad = () => {
  isLoaded.value = true;
};

const handleError = () => {
  hasError.value = true;
  isLoaded.value = true; // Stop showing the loading skeleton
};
</script>
