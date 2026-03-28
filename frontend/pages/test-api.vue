<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-10 font-sans">
    <div class="max-w-4xl mx-auto space-y-8">
      <header class="border-b border-gray-800 pb-6">
        <h1
          class="text-3xl font-bold text-orange-500 uppercase tracking-widest"
        >
          API Connection Test
        </h1>
        <p class="text-gray-400 mt-2">
          Make sure your Express server is running on port 5000.
        </p>
      </header>

      <section class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white uppercase">
            1. Speakers Endpoint
          </h2>
          <span
            v-if="speakersLoading"
            class="text-yellow-500 text-sm animate-pulse"
            >Fetching...</span
          >
          <span v-else-if="speakersError" class="text-red-500 text-sm"
            >Failed</span
          >
          <span v-else class="text-green-500 text-sm">Success</span>
        </div>

        <div
          v-if="speakersError"
          class="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-md text-sm"
        >
          {{ speakersError.message || "Could not connect to backend." }}
        </div>

        <pre
          v-else
          class="bg-gray-950 p-4 rounded-md overflow-x-auto text-xs text-green-400 border border-gray-800"
          >{{
            speakers || "No data returned (Array might be empty in Firestore)"
          }}
        </pre>
      </section>

      <section class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white uppercase">
            2. Event Settings Endpoint
          </h2>
          <span
            v-if="settingsLoading"
            class="text-yellow-500 text-sm animate-pulse"
            >Fetching...</span
          >
          <span v-else-if="settingsError" class="text-red-500 text-sm"
            >Failed</span
          >
          <span v-else class="text-green-500 text-sm">Success</span>
        </div>

        <div
          v-if="settingsError"
          class="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-md text-sm"
        >
          {{ settingsError.message || "Could not connect to backend." }}
        </div>

        <pre
          v-else
          class="bg-gray-950 p-4 rounded-md overflow-x-auto text-xs text-blue-400 border border-gray-800"
          >{{ eventSettings || "No data returned" }}
        </pre>
      </section>
    </div>
  </div>
</template>

<script setup>
// Disable the default layout so the Navbar/Footer don't get in the way of our raw test
definePageMeta({
  layout: false,
});

const api = useConferenceData();

// Fetch data concurrently
const {
  data: speakers,
  pending: speakersLoading,
  error: speakersError,
} = await api.getSpeakers();
const {
  data: eventSettings,
  pending: settingsLoading,
  error: settingsError,
} = await api.getEventSettings();
const {
  data: testimonies,
  pending: testimoniesLoading,
  error: testimoniesError,
} = await api.getTestimonies();
const {
  data: agenda,
  pending: agendaLoading,
  error: agendaError,
} = await api.getAgenda();
const {
  data: merch,
  pending: merchLoading,
  error: merchError,
} = await api.getMerch();
const {
  data: merchSettings,
  pending: merchSettingsLoading,
  error: merchSettingsError,
} = await api.getMerchSettings();
const {
  data: faqs,
  pending: faqsLoading,
  error: faqsError,
} = await api.getFaqs();

// Log results to console for debugging
console.log("Speakers:", speakers.value);
console.log("Event Settings:", eventSettings.value);
console.log("Testimonies:", testimonies.value);
console.log("Agenda:", agenda.value);
console.log("Merch:", merch.value);
console.log("Merch Settings:", merchSettings.value);
console.log("FAQs:", faqs.value);
</script>
