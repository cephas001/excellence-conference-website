<template>
  <div
    class="bg-gray-900 border border-gray-800 p-8 flex flex-col justify-between rounded-2xl hover:border-orange-500/30 transition-colors group"
  >
    <Icon
      :name="icon"
      class="text-orange-500 w-10 h-10 mb-8 opacity-70 group-hover:opacity-100 transition-opacity"
    />
    <div>
      <p class="text-xs tracking-widest text-gray-500 font-bold uppercase mb-1">
        {{ label }}
      </p>
      <h3
        class="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wider"
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
