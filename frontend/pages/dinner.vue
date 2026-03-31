<template>
  <div
    class="relative min-h-screen bg-theme-base text-gray-200 font-sans antialiased selection:bg-theme-primary/30 overflow-hidden pt-30 pb-24"
  >
    <DinnerBackdrop />

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
            class="absolute -top-10 -left-10 w-64 h-64 bg-theme-primary/10 blur-[100px] pointer-events-none"
          ></div>
          <span
            class="text-white font-sans font-bold text-xs tracking-[0.3em] uppercase mb-3 block"
          >
            Workers Dinner
          </span>
          <h1
            class="font-display font-bold text-4xl md:text-6xl tracking-tighter text-white leading-none mb-4 uppercase"
          >
            The
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-theme-primary to-theme-secondary"
              >Coronation</span
            >
          </h1>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <DinnerCard
            icon="heroicons:calendar-days"
            label="Date"
            :mainText="eventSettings?.dinner?.date || 'TBD'"
          />

          <DinnerCard
            icon="heroicons:clock"
            label="Time"
            :mainText="eventSettings?.dinner?.time || 'TBD'"
          />

          <DinnerCard
            icon="heroicons:map-pin"
            label="Venue"
            :mainText="eventSettings?.dinner?.venueName || 'TBD'"
          />
        </div>

        <section
          id="payment-section"
          class="mb-24 scroll-mt-24"
          v-if="merchSettings"
        >
          <div
            class="bg-theme-surface border border-theme-border rounded-2xl p-8 md:p-12 relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-theme-primary/5 blur-3xl rounded-full pointer-events-none"
            ></div>

            <h2
              class="font-display text-xl md:text-3xl text-white font-bold uppercase mb-4"
            >
              Reserve Your Seat
            </h2>

            <div class="grid md:grid-cols-2 gap-12">
              <div class="space-y-6">
                <p class="text-gray-400">
                  Please make a transfer to the account below, and keep your
                  receipt/proof of payment.
                </p>

                <AccountDetailsCard :accountDetails="dinnerAccountDetails" />
              </div>

              <div
                class="flex flex-col justify-center space-y-6 border-t md:border-t-0 md:border-l border-theme-border pt-8 md:pt-0 md:pl-12"
              >
                <div>
                  <h3
                    class="font-display text-xl md:text-2xl text-white uppercase mb-4"
                  >
                    Confirm Your Registration
                  </h3>
                  <p class="text-gray-400 text-sm mb-3">
                    After making your transfer, you must fill out the
                    confirmation form and upload your proof of payment to secure
                    your seat.
                  </p>
                </div>
                <a
                  href="https://forms.gle/K49ckmQmDTz1KKtc8"
                  target="_blank"
                  class="inline-flex items-center justify-center gap-3 bg-linear-to-r from-theme-primary to-theme-secondary text-black px-8 py-4 rounded-lg font-sans font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-theme-primary/20 transition-all hover:-translate-y-1"
                >
                  Open
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
            class="bg-theme-surface/50 backdrop-blur-xl rounded-2xl p-8 md:p-12 border-l-4 border-theme-primary shadow-2xl overflow-hidden relative text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div
              class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"
            >
              <Icon name="heroicons:camera-solid" class="w-48 h-48" />
            </div>

            <div class="relative z-10 max-w-2xl">
              <h2
                class="font-display text-2xl md:text-3xl text-white font-bold leading-tight mb-4 uppercase"
              >
                Memories of Love
              </h2>
              <p class="text-gray-400 text-md md:text-lg">
                Revisit the moments of laughter, and divine fellowship from our
                previous gatherings.
              </p>
            </div>

            <div class="relative z-10 shrink-0">
              <a
                href="#"
                target="_blank"
                class="inline-flex items-center gap-3 border border-gray-700 bg-theme-base text-white px-8 py-4 rounded-lg font-sans font-bold uppercase tracking-widest hover:border-theme-primary hover:text-theme-primary transition-all duration-300 text-sm md:text-md"
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

const dinnerAccountDetails = ref({
  accountBank: "Opay",
  accountNumber: "7037865052",
  accountName: "Helen Folarin Toluwalashe",
});

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
