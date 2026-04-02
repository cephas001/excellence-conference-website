<template>
  <div
    class="bg-gray-100 p-1.5 rounded-xl flex overflow-x-auto hide-scrollbar shadow-inner border border-gray-200/60"
  >
    <nav class="flex space-x-1 w-full min-w-max" aria-label="Tabs">
      <ReviewNavButton
        buttonText="Review Deck"
        :currentTab="currentTab"
        matchingTab="review"
        :applications="pendingApplications"
        @update:currentTab="updateCurrentTab"
      />

      <ReviewNavButton
        buttonText="Approved"
        :currentTab="currentTab"
        matchingTab="approved"
        :applications="approvedApplications"
        @update:currentTab="updateCurrentTab"
      />

      <ReviewNavButton
        v-if="unsentApplications"
        buttonText="Unsent Mails"
        :currentTab="currentTab"
        matchingTab="unsent"
        :applications="unsentApplications"
        @update:currentTab="updateCurrentTab"
      />

      <ReviewNavButton
        buttonText="Rejected"
        :currentTab="currentTab"
        matchingTab="rejected"
        :applications="rejectedApplications"
        @update:currentTab="updateCurrentTab"
      />
    </nav>
  </div>
</template>

<script setup>
const props = defineProps({
  currentTab: {
    type: String,
    required: true,
  },
  pendingApplications: {
    type: Array,
    required: true,
  },
  approvedApplications: {
    type: Array,
    required: true,
  },
  unsentApplications: {
    type: Array,
  },
  rejectedApplications: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:currentTab"]);

const updateCurrentTab = (tab) => {
  emit("update:currentTab", tab);
};
</script>
