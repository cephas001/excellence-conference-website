<template>
  <div
    class="bg-gray-100 p-1.5 rounded-xl flex overflow-x-auto hide-scrollbar shadow-inner border border-gray-200/60"
  >
    <nav class="flex space-x-1 w-full min-w-max" aria-label="Tabs">
      <ReviewNavButton
        buttonText="Deck View"
        :currentTab="currentTab"
        matchingTab="review"
        :applications="undeliveredApplications"
        @update:currentTab="updateCurrentTab"
      />

      <ReviewNavButton
        buttonText="Table View"
        :currentTab="currentTab"
        matchingTab="table_review"
        :applications="undeliveredApplications"
        @update:currentTab="updateCurrentTab"
      />

      <ReviewNavButton
        buttonText="Delivered"
        :currentTab="currentTab"
        matchingTab="delivered"
        :applications="deliveredApplications"
        @update:currentTab="updateCurrentTab"
      />

      <ReviewNavButton
        buttonText="Reported"
        :currentTab="currentTab"
        matchingTab="reported"
        :applications="reportedApplications"
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

  deliveredApplications: {
    type: Array,
    required: true,
  },
  undeliveredApplications: {
    type: Array,
    required: true,
  },

  reportedApplications: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:currentTab"]);

const updateCurrentTab = (tab) => {
  emit("update:currentTab", tab);
};
</script>
