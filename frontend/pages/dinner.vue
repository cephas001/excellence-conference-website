<template>
  <div
    class="relative min-h-screen bg-gray-950 text-gray-200 font-sans antialiased selection:bg-orange-500/30 overflow-hidden pt-30 pb-24"
  >
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px]"
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
          Unable to load dinner details at this time.
        </p>
        <button
          @click="loadData"
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
          <span
            class="text-white font-sans font-bold text-xs tracking-[0.3em] uppercase mb-2 block"
          >
            Workers Dinner
          </span>
          <h1
            class="font-display font-bold text-5xl md:text-7xl tracking-tighter text-white leading-none mb-4 uppercase"
          >
            The
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-yellow-400"
              >Coronation</span
            >
          </h1>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div
            class="bg-gray-900 border border-gray-800 p-8 flex flex-col justify-between rounded-2xl hover:border-orange-500/30 transition-colors group"
          >
            <Icon
              name="heroicons:calendar-days"
              class="text-orange-500 w-10 h-10 mb-8 opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <div>
              <p
                class="text-xs tracking-widest text-gray-500 font-bold uppercase mb-1"
              >
                Date
              </p>
              <h3
                class="text-2xl md:text-3xl font-display font-bold text-white uppercase"
              >
                {{ eventSettings?.dinner?.date || "TBD" }}
              </h3>
            </div>
          </div>

          <div
            class="bg-gray-900 border border-gray-800 p-8 flex flex-col justify-between rounded-2xl hover:border-orange-500/30 transition-colors group"
          >
            <Icon
              name="heroicons:clock"
              class="text-orange-500 w-10 h-10 mb-8 opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <div>
              <p
                class="text-xs tracking-widest text-gray-500 font-bold uppercase mb-1"
              >
                Time
              </p>
              <h3
                class="text-2xl md:text-3xl font-display font-bold text-white uppercase"
              >
                {{ eventSettings?.dinner?.time || "TBD" }}
              </h3>
            </div>
          </div>

          <div
            class="bg-gray-900 border border-gray-800 p-8 flex flex-col justify-between rounded-2xl hover:border-orange-500/30 transition-colors group"
          >
            <Icon
              name="heroicons:map-pin"
              class="text-orange-500 w-10 h-10 mb-8 opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <div>
              <p
                class="text-xs tracking-widest text-gray-500 font-bold uppercase mb-1"
              >
                Venue
              </p>
              <h3
                class="text-xl md:text-2xl font-display font-bold text-white uppercase leading-tight"
              >
                {{ eventSettings?.dinner?.venueName || "TBD" }}
              </h3>
            </div>
          </div>
        </div>

        <section
          id="payment-section"
          class="mb-24 scroll-mt-24"
          v-if="merchSettings"
        >
          <div
            class="bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12 relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full pointer-events-none"
            ></div>

            <h2
              class="font-display text-3xl md:text-4xl text-white font-bold uppercase mb-8"
            >
              Reserve Your Seat
            </h2>

            <div class="grid md:grid-cols-2 gap-12">
              <div class="space-y-6">
                <p class="text-gray-400">
                  Please make a transfer for your dinner reservation to the
                  account below, and keep your receipt/proof of payment.
                </p>

                <div
                  class="bg-gray-950 p-6 rounded-xl border border-gray-800 space-y-4"
                >
                  <div>
                    <span
                      class="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1"
                      >Bank Name</span
                    >
                    <span class="text-white font-medium text-lg">Opay</span>
                  </div>
                  <div>
                    <span
                      class="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1"
                      >Account Number</span
                    >
                    <div class="flex items-center gap-3">
                      <span class="text-orange-400 font-bold text-2xl font-mono"
                        >7037865052</span
                      >
                      <button
                        class="text-gray-500 hover:text-white transition-colors"
                        title="Copy Account Number"
                      >
                        <Icon
                          name="heroicons:clipboard-document"
                          class="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span
                      class="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1"
                      >Account Name</span
                    >
                    <span class="text-gray-300 font-medium"
                      >Helen Folarin Toluwalashe</span
                    >
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col justify-center space-y-6 border-t md:border-t-0 md:border-l border-gray-800 pt-8 md:pt-0 md:pl-12"
              >
                <div>
                  <h3 class="font-display text-2xl text-white uppercase mb-2">
                    Confirm Your Registration
                  </h3>
                  <p class="text-gray-400 text-sm mb-6">
                    After making your transfer, you must fill out the
                    confirmation form and upload your proof of payment to secure
                    your seat.
                  </p>
                </div>
                <a
                  href="https://forms.gle/K49ckmQmDTz1KKtc8"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-8 py-4 rounded-lg font-sans font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/20 transition-all hover:-translate-y-1"
                >
                  Open Confirmation Form
                  <Icon
                    name="heroicons:arrow-top-right-on-square-20-solid"
                    class="w-5 h-5"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-16 relative">
          <div
            class="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 md:p-12 border-l-4 border-orange-500 shadow-2xl overflow-hidden relative text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div
              class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"
            >
              <Icon name="heroicons:camera-solid" class="w-48 h-48" />
            </div>

            <div class="relative z-10 max-w-2xl">
              <h2
                class="font-display text-3xl md:text-4xl text-white font-bold leading-tight mb-4 uppercase"
              >
                Memories of Grace
              </h2>
              <p class="text-gray-400 text-lg">
                Revisit the moments of laughter, and divine fellowship from our
                previous gatherings.
              </p>
            </div>

            <div class="relative z-10 shrink-0">
              <a
                href="#"
                target="_blank"
                class="inline-flex items-center gap-3 border border-gray-700 bg-gray-950 text-white px-8 py-4 rounded-lg font-sans font-bold uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
              >
                View Past Dinners
                <Icon
                  name="heroicons:arrow-top-right-on-square"
                  class="w-5 h-5"
                />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const api = useConferenceData();

// --- Data Fetching ---
const {
  data: eventSettingsRaw,
  pending: settingsLoading,
  error: settingsError,
  refresh: refreshSettings,
} = await api.getEventSettings();

const {
  data: merchSettings,
  pending: merchLoading,
  error: merchError,
  refresh: refreshMerch,
} = await api.getMerchSettings();

// --- Unified State Management ---
const pending = computed(() => settingsLoading.value || merchLoading.value);
const error = computed(() => settingsError.value || merchError.value);

const loadData = () => {
  refreshSettings();
  refreshMerch();
};

// Safely extract the dinner settings specifically
const eventSettings = computed(() => {
  return eventSettingsRaw.value || {};
});
</script>
