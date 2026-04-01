<template>
  <header class="mb-14 relative p-1">
    <div
      class="absolute -top-10 -left-10 w-64 h-64 bg-theme-primary/10 blur-[100px] pointer-events-none"
    ></div>
    <h1
      class="font-display font-bold text-4xl md:text-6xl tracking-tighter text-theme-text leading-none mb-4 uppercase"
    >
      {{ plainText }}
      <span
        class="text-transparent bg-clip-text bg-linear-to-r from-theme-primary to-theme-secondary"
        >{{ styledText }}</span
      >
    </h1>
    <p
      class="text-theme-text-muted text-base md:text-lg max-w-2xl leading-relaxed font-poppins"
    >
      {{ description }}
    </p>
  </header>
</template>

<script setup>
const props = defineProps({
  styledText: {
    type: String,
    required: true,
  },
  plainText: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});
</script>
