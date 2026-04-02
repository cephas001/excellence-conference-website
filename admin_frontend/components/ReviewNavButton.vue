<template>
  <button
    @click="updateCurrentTab(matchingTab)"
    :class="[
      currentTab === matchingTab
        ? 'bg-white text-black shadow-sm ring-1 ring-black/5'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50',
      'whitespace-nowrap py-2.5 px-4 rounded-lg font-medium text-sm flex items-center transition-all duration-200 outline-none flex-1 justify-center',
    ]"
  >
    {{ buttonText }}
    <span
      v-if="applications"
      :class="[
        currentTab === matchingTab
          ? 'bg-black text-white'
          : 'bg-gray-200 text-gray-600',
        'ml-2 py-0.5 px-2.5 rounded-full text-xs font-bold transition-colors',
      ]"
    >
      {{ applications.length }}
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  buttonText: {
    type: String,
    required: true,
  },
  currentTab: {
    type: String,
    required: true,
  },
  applications: {
    type: Array,
    required: false,
  },
  matchingTab: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:currentTab"]);

const updateCurrentTab = (tab) => {
  emit("update:currentTab", tab);
};
</script>
