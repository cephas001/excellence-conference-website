<template>
  <transition name="slide-up">
    <div
      v-if="$pwa?.showInstallPrompt && showDelayedBanner"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-theme-surface border border-theme-primary p-4 rounded-sm shadow-2xl shadow-theme-primary/10 z-50 flex items-center justify-between"
    >
      <div>
        <h4
          class="font-display font-bold text-theme-text uppercase text-sm tracking-wide"
        >
          Install EC '26
        </h4>
        <p class="text-xs text-theme-text-muted font-sans mt-1">
          Add to home screen for offline access.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="dismissBanner"
          class="text-theme-text-muted hover:text-theme-text transition-colors text-xs uppercase font-semibold tracking-wider"
        >
          Later
        </button>

        <button
          @click="$pwa.install()"
          class="bg-theme-primary text-black px-4 py-2 rounded-sm font-sans font-semibold text-xs tracking-wide uppercase hover:shadow-md transition-all"
        >
          Install
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";

const { $pwa } = useNuxtApp();

// State to control the delayed visibility
const showDelayedBanner = ref(false);

// Function to handle the "Later" button
const dismissBanner = () => {
  showDelayedBanner.value = false;
  $pwa.cancelInstall();
};

onMounted(() => {
  // Wait 8 seconds before setting the flag to true.
  // You can adjust 8000 (8 seconds) to whatever feels right!
  setTimeout(() => {
    showDelayedBanner.value = true;
  }, 8000);
});
</script>

<style scoped>
/* The CSS animation that makes the banner slide up from the bottom */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(150%);
  opacity: 0;
}
</style>
