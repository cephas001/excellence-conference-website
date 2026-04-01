<template>
  <div
    class="bg-theme-surface border border-theme-border p-8 flex flex-col justify-between rounded-2xl hover:border-theme-primary/30 transition-colors group"
  >
    <Icon
      :name="icon"
      class="text-theme-primary w-10 h-10 mb-8 opacity-70 group-hover:opacity-100 transition-opacity"
    />
    <div>
      <p class="text-xs tracking-widest text-theme-text-muted font-bold uppercase mb-1">
        {{ label }}
      </p>
      <h3
        class="text-xl md:text-2xl font-display font-bold text-theme-text uppercase tracking-wider"
      >
        {{ mainText }}
      </h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: "heroicons:moon" },
  mainText: { type: String, required: true },
});
</script>
