<template>
  <div class="border-b border-theme-border">
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between py-5 text-left group"
    >
      <span
        class="font-display font-semibold tracking-wide text-md md:text-lg text-theme-text group-hover:text-theme-primary transition-colors pr-6"
      >
        {{ faq.question }}
      </span>
      <Icon
        name="heroicons:plus"
        class="w-5 h-5 text-theme-text-muted transition-transform duration-300 shrink-0"
        :class="isOpen ? 'rotate-45 text-theme-primary' : ''"
      />
    </button>
    <div
      v-show="isOpen"
      class="pb-5 text-theme-text-muted text-sm md:text-base font-light leading-relaxed pr-6 font-poppins"
    >
      {{ faq.answer }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  faq: { type: Object, required: true },
});

const isOpen = ref(false);
</script>
