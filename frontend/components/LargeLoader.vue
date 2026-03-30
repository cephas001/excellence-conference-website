<template>
  <Transition
    enter-active-class="transition-opacity duration-500"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="loading"
      class="fixed inset-0 bg-theme-base z-100 flex items-center justify-center transition-colors duration-300"
    >
      <img
        src="/img/logo.png"
        alt="Excellence Conference"
        class="h-16 md:h-20 w-auto object-contain animate-pulse"
      />
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
});
</script>
