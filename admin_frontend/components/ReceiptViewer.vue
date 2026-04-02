<template>
  <div
    class="w-full h-full bg-white border border-gray-200 rounded-xl overflow-hidden relative shadow-inner flex flex-col"
  >
    <div
      class="flex-1 w-full h-full overflow-auto bg-gray-50/50 flex items-center justify-center relative"
    >
      <div
        v-if="receiptUrl && isLoading"
        class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm z-20"
      >
        <IconsLoader />
        <span
          class="mt-3 text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse"
          >Loading Receipt...</span
        >
      </div>

      <img
        v-if="receiptUrl && !isPdfFallback"
        :src="receiptUrl"
        @load="isLoading = false"
        @error="handleImageError"
        class="max-w-none transition-all duration-300 ease-out object-contain"
        :style="{
          width: zoomLevel === 1 ? '100%' : `${100 * zoomLevel}%`,
          height: zoomLevel === 1 ? '100%' : 'auto',
        }"
        alt="Receipt Viewer"
      />

      <iframe
        v-else-if="receiptUrl && isPdfFallback"
        :src="receiptUrl"
        @load="isLoading = false"
        class="w-full h-full border-0"
        title="Receipt Viewer"
      ></iframe>

      <div
        v-if="!receiptUrl"
        class="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-300 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-sm text-gray-500 font-medium">No valid receipt found.</p>
      </div>
    </div>

    <div
      v-if="receiptUrl"
      class="absolute bottom-4 right-4 flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden z-30"
    >
      <button
        @click.prevent="zoomIn"
        class="p-2.5 hover:bg-gray-50 border-b border-gray-200 text-gray-600 hover:text-black transition-colors outline-none cursor-pointer"
        title="Zoom In"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
      <button
        @click.prevent="zoomOut"
        class="p-2.5 hover:bg-gray-50 text-gray-600 hover:text-black transition-colors outline-none cursor-pointer"
        title="Zoom Out"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 12H4"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  receiptUrl: { type: String, default: null },
});

const zoomLevel = ref(1);
const isPdfFallback = ref(false);
const isLoading = ref(true); // NEW: Track loading state

const zoomIn = () => {
  if (zoomLevel.value < 3) zoomLevel.value += 0.25;
};
const zoomOut = () => {
  if (zoomLevel.value > 0.5) zoomLevel.value -= 0.25;
};

// Handle image failure to load PDF fallback
const handleImageError = () => {
  isPdfFallback.value = true;
  // We don't set isLoading to false here, because the iframe will now start loading!
};

// Reset everything when the receipt URL changes (e.g. moving to the next application)
watch(
  () => props.receiptUrl,
  (newUrl) => {
    zoomLevel.value = 1;
    isPdfFallback.value = false;
    isLoading.value = !!newUrl; // Set to true ONLY if there is actually a URL to load
  },
  { immediate: true },
); // immediate ensures it runs on first component mount
</script>
