<template>
  <div class="sm:flex sm:items-center sm:justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-black">{{ titleText }}</h1>
    </div>
    <div class="mt-4 sm:mt-0 flex items-center space-x-3">
      <button
        @click="refresh"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
      >
        <IconsRefresh :loading="loading" class="mr-2 -ml-0.5 h-4 w-4" />
        Refresh
      </button>
      <button
        v-if="showAnalytics"
        @click="goToAnalytics"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/90 cursor-pointer transition-colors"
      >
        <IconsAnalytics />
        Analytics
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  titleText: {
    type: String,
  },
  showAnalytics: {
    type: Boolean,
    default: true,
  },
});

// 1. Register the new event here
const emit = defineEmits(["refresh", "go-analytics"]);

const refresh = () => {
  emit("refresh");
};

// 2. Add the function to emit the event
const goToAnalytics = () => {
  emit("go-analytics");
};
</script>
