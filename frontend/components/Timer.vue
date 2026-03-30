<template>
  <div class="mb-10 w-full max-w-lg">
    <div class="grid grid-cols-4 gap-3 sm:gap-4">
      <div
        v-for="(value, unit) in timeLeft"
        :key="unit"
        class="bg-theme-surface/50 backdrop-blur-md p-3 border-l-2 border-theme-primary/50 flex flex-col items-start justify-center"
      >
        <span
          class="font-display font-bold block text-2xl md:text-3xl text-theme-secondary leading-none"
          >{{ value }}</span
        >
        <span
          class="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mt-1"
          >{{ unit }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  timeLeft: {
    type: Object,
    required: true,
  },
});
</script>
