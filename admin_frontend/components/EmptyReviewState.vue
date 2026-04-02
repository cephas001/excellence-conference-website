<template>
  <div
    class="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
  >
    <div
      class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"
    >
      <svg
        class="h-6 w-6 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    <p class="mt-1 text-sm text-gray-500">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
});
</script>
