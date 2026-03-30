<template>
  <div
    class="relative min-h-screen bg-theme-base text-gray-200 font-sans antialiased selection:bg-theme-primary/30 overflow-hidden pt-30 pb-24"
  >
    <ContactBackdrop />

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div v-if="pending" class="flex justify-center items-center py-20">
        <Icon
          name="heroicons:arrow-path"
          class="w-10 h-10 text-theme-primary animate-spin"
        />
      </div>

      <div
        v-else-if="error"
        class="text-center py-20 bg-theme-surface border border-red-900/50 rounded-xl"
      >
        <Icon
          name="heroicons:exclamation-triangle"
          class="w-12 h-12 text-red-500 mx-auto mb-4"
        />
        <p class="text-gray-400 mb-4">
          Unable to load contact details at this time.
        </p>
        <button
          @click="refresh"
          class="px-6 py-2 bg-theme-border hover:bg-gray-700 text-white rounded-md transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>

      <div v-else>
        <AppPageHeader
          plainText="Get"
          styledText="In Touch"
          description=" Have questions about the conference, registration, or partnership? We're here to help you navigate your journey to excellence."
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactCard
            title="Email Us"
            subtitle="Our team is ready to assist you with any inquiries or support you may need."
            titleIcon="heroicons:envelope"
            action="Send Email"
            actionIcon="heroicons:arrow-right"
            @action="sendMail"
          />

          <ContactCard
            title="Call Support"
            subtitle="Mon - Fri, 9am to 5pm WAT."
            titleIcon="heroicons:phone"
            action="Call Now"
            actionIcon="heroicons:arrow-up-right"
            @action="callNumber"
          />

          <ContactCard
            title="Visit Us"
            subtitle="Chapel of Praise, McPherson University, Seriki-Sotayo, Ogun State, Nigeria."
            titleIcon="heroicons:map-pin"
            action="Get Directions"
            actionIcon="heroicons:arrow-top-right-on-square"
            @action="getDirections"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const api = useConferenceData();

// --- Data Fetching ---
const {
  data: eventSettings,
  pending,
  error,
  refresh,
} = await api.getEventSettings();

// Safely extract the contact settings
const contactInfo = computed(() => {
  return eventSettings.value?.contact || {};
});

const sendMail = () => {
  if (!contactInfo.value.email) {
    alert("Email address is not available at the moment.");
    return;
  }
  const email = contactInfo.value.email;
  window.open(`mailto:${email}`);
};

const callNumber = () => {
  if (contactInfo.value.phone) {
    window.location.href = `tel:${contactInfo.value.phone}`;
  }
};

const getDirections = () => {
  if (eventSettings.value?.venue?.mapLink) {
    window.open(eventSettings.value.venue.mapLink, "_blank");
  }
};
</script>
