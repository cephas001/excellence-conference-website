<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-full bg-theme-surface border border-theme-border text-theme-text-muted hover:text-theme-primary transition-all duration-300 flex items-center justify-center"
    :title="`Switch to ${isDark ? 'Light' : 'Dark'} Mode`"
  >
    <Icon
      :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
      class="w-5 h-5 transition-transform duration-500"
      :class="isDark ? 'rotate-0' : '-rotate-90'"
    />
  </button>
</template>

<script setup>
import { computed } from "vue";

const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

const emit = defineEmits(["colorModeChanged"]);

const toggleTheme = () => {
  // This automatically updates the HTML class and saves to localStorage
  colorMode.preference = isDark.value ? "light" : "dark";
  emit("colorModeChanged");
};
</script>
