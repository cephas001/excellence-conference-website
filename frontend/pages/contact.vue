<template>
  <div
    class="relative min-h-screen bg-gray-950 text-gray-200 font-sans antialiased selection:bg-orange-500/30 overflow-hidden pt-30 pb-24"
  >
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px]"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div v-if="pending" class="flex justify-center items-center py-20">
        <Icon
          name="heroicons:arrow-path"
          class="w-10 h-10 text-orange-500 animate-spin"
        />
      </div>

      <div
        v-else-if="error"
        class="text-center py-20 bg-gray-900 border border-red-900/50 rounded-xl"
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
          class="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>

      <div v-else>
        <header class="mb-14 relative">
          <div
            class="absolute -top-10 -left-10 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none"
          ></div>
          <h1
            class="font-display font-bold text-5xl md:text-7xl tracking-tighter text-white leading-none mb-4 uppercase"
          >
            Get <br />
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-yellow-400 pr-1"
              >In Touch</span
            >
          </h1>
          <p
            class="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed font-poppins"
          >
            Have questions about the conference, registration, or partnership?
            We're here to help you navigate your journey to excellence.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-2xl hover:border-orange-500/30 transition-all duration-500 shadow-xl group flex flex-col h-full relative overflow-hidden"
          >
            <div
              class="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors duration-500"
            ></div>

            <div
              class="w-16 h-16 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-orange-500 group-hover:-translate-y-1 transition-transform duration-500 mb-8 relative z-10 shrink-0"
            >
              <Icon name="heroicons:envelope" class="w-8 h-8" />
            </div>

            <div class="flex-grow flex flex-col relative z-10">
              <h3
                class="text-white font-display font-bold text-2xl mb-3 uppercase tracking-wide"
              >
                Email Us
              </h3>
              <p class="text-gray-500 mb-8 text-sm font-light leading-relaxed">
                Our team responds within 24 hours.
              </p>

              <div class="mt-auto pt-6 border-t border-gray-800/50">
                <button
                  @click="sendMail"
                  class="inline-flex items-center gap-2 text-orange-500 font-semibold text-xs tracking-widest uppercase hover:text-yellow-400 transition-colors group-hover:translate-x-1 duration-300"
                >
                  Send Message
                  <Icon name="heroicons:arrow-right" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-2xl hover:border-orange-500/30 transition-all duration-500 shadow-xl group flex flex-col h-full relative overflow-hidden"
          >
            <div
              class="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors duration-500"
            ></div>

            <div
              class="w-16 h-16 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-orange-500 group-hover:-translate-y-1 transition-transform duration-500 mb-8 relative z-10 shrink-0"
            >
              <Icon name="heroicons:phone" class="w-8 h-8" />
            </div>

            <div class="flex-grow flex flex-col relative z-10">
              <h3
                class="text-white font-display font-bold text-2xl mb-3 uppercase tracking-wide"
              >
                Call Support
              </h3>
              <p class="text-gray-500 mb-8 text-sm font-light leading-relaxed">
                Mon - Fri, 9am to 5pm WAT.
              </p>

              <div class="mt-auto pt-6 border-t border-gray-800/50">
                <a
                  v-if="contactInfo.phone"
                  :href="`tel:${contactInfo.phone}`"
                  class="inline-flex items-center gap-2 text-orange-500 font-semibold text-xs tracking-widest uppercase hover:text-yellow-400 transition-colors group-hover:translate-x-1 duration-300"
                >
                  {{ contactInfo.phone }}
                  <Icon name="heroicons:arrow-up-right" class="w-4 h-4" />
                </a>
                <span
                  v-else
                  class="text-gray-600 font-semibold text-xs tracking-widest uppercase"
                  >Not available</span
                >
              </div>
            </div>
          </div>

          <div
            class="bg-gray-900 border border-gray-800 p-8 md:p-10 rounded-2xl hover:border-orange-500/30 transition-all duration-500 shadow-xl group flex flex-col h-full relative overflow-hidden"
          >
            <div
              class="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors duration-500"
            ></div>

            <div
              class="w-16 h-16 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-orange-500 group-hover:-translate-y-1 transition-transform duration-500 mb-8 relative z-10 shrink-0"
            >
              <Icon name="heroicons:map-pin" class="w-8 h-8" />
            </div>

            <div class="flex-grow flex flex-col relative z-10">
              <h3
                class="text-white font-display font-bold text-2xl mb-3 uppercase tracking-wide"
              >
                Visit Us
              </h3>
              <p class="text-gray-300 font-medium leading-relaxed mb-8 text-sm">
                Chapel of Praise,<br />
                McPherson University,<br />
                Seriki-Sotayo, Ogun State,<br />
                Nigeria.
              </p>

              <div class="mt-auto pt-6 border-t border-gray-800/50">
                <a
                  v-if="eventSettings?.venue?.mapLink"
                  :href="eventSettings.venue.mapLink"
                  target="_blank"
                  class="inline-flex items-center gap-2 text-orange-500 font-semibold text-xs tracking-widest uppercase hover:text-yellow-400 transition-colors group-hover:translate-x-1 duration-300"
                >
                  Get Directions
                  <Icon
                    name="heroicons:arrow-top-right-on-square"
                    class="w-4 h-4"
                  />
                </a>
                <span
                  v-else
                  class="text-gray-600 font-semibold text-xs tracking-widest uppercase"
                  >Map link pending</span
                >
              </div>
            </div>
          </div>
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
</script>
