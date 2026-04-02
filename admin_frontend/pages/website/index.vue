<template>
  <div
    class="max-w-6xl mx-auto pb-24 md:pb-0 relative font-montserrat pt-4 sm:pt-8"
  >
    <header
      class="flex md:flex-row md:items-center md:justify-between flex-col items-start gap-4 mb-6 pb-6 border-b border-gray-200"
    >
      <div>
        <h1
          class="text-xl font-bold text-gray-900 uppercase tracking-tight mb-1"
        >
          Website Content
        </h1>
        <p class="text-sm font-medium text-gray-500">
          Make changes to the live Excellence Conference website.
        </p>
      </div>

      <button
        @click="goToClientSite"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shadow-sm text-sm font-semibold text-white bg-black hover:bg-black/90 cursor-pointer transition-colors w-max"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        View Changes
      </button>
    </header>

    <div class="mb-8 overflow-x-auto hide-scrollbar">
      <div class="flex bg-gray-100 p-1 rounded-xl w-max">
        <button
          @click="updateActivePanel('speakers')"
          :class="
            activePanel === 'speakers'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          Speakers
        </button>
        <button
          @click="updateActivePanel('testimonies')"
          :class="
            activePanel === 'testimonies'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          Testimonies
        </button>
        <button
          @click="updateActivePanel('merch')"
          :class="
            activePanel === 'merch'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          Merchandise
        </button>
        <button
          @click="updateActivePanel('settings')"
          :class="
            activePanel === 'settings'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
        >
          Settings
        </button>
      </div>
    </div>

    <main class="relative">
      <WebsitePanelSpeakers
        v-if="activePanel === 'speakers'"
        class="animate-fade-in"
      />
      <WebsitePanelTestimonies
        v-if="activePanel === 'testimonies'"
        class="animate-fade-in"
      />
      <WebsitePanelMerch
        v-if="activePanel === 'merch'"
        class="animate-fade-in"
      />
      <WebsitePanelSettings
        v-if="activePanel === 'settings'"
        class="animate-fade-in"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isAuthenticated = ref(false);
const isLoading = ref(false);
const loginError = ref("");
const activePanel = ref("speakers");

const handleLogout = () => {
  isAuthenticated.value = false;
  loginError.value = "";
  activePanel.value = "speakers"; // Reset to default panel
};

const updateActivePanel = (panel) => {
  activePanel.value = panel;
};

// MAKE DYNAMIC LATER
const goToClientSite = () => {
  window.open("https://excellence-conference-website.vercel.app", "_blank");
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
