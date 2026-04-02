<template>
  <div
    class="mb-6 flex justify-center items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
  >
    <div class="flex items-center space-x-2">
      <button
        @click="emits('previous')"
        :disabled="currentIndex === 0"
        class="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <IconsLeftCaret />
      </button>
      <span class="text-xs font-semibold text-gray-600 tracking-wider">
        {{ currentIndex + 1 }} OF {{ applications.length }}
      </span>
      <button
        @click="emits('next')"
        :disabled="currentIndex >= applications.length - 1"
        class="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <IconsRightCaret />
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentIndex: {
    type: Number,
    required: true,
  },
  applications: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(["previous", "next"]);
</script>
