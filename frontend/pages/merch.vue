<template>
  <div
    class="relative min-h-screen bg-gray-950 text-gray-200 font-sans antialiased selection:bg-orange-500/30 overflow-hidden pt-30 pb-24"
  >
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute top-[-10%] right-[-10%] w-150 h-150 bg-orange-500/10 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-5%] left-[-5%] w-125 h-125 bg-yellow-500/5 rounded-full blur-[100px]"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <header class="mb-14 relative">
        <div
          class="absolute -top-10 -left-10 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none"
        ></div>
        <h1
          class="font-display font-bold text-5xl md:text-7xl tracking-tighter text-white leading-none mb-4 uppercase"
        >
          OFFICIAL
          <span
            class="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-yellow-400"
            >Merchandise</span
          >
        </h1>
        <p
          class="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed font-poppins"
        >
          Equip yourself with the official 'Shining the Light' merchandise
          collection.
        </p>
      </header>

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
          Unable to load merchandise items at this time.
        </p>
        <button
          @click="loadMerch"
          class="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>

      <div
        v-else-if="!merch || merch.length === 0"
        class="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-xl"
      >
        <Icon
          name="heroicons:shopping-bag"
          class="w-12 h-12 text-gray-600 mx-auto mb-4"
        />
        <p class="text-gray-500 font-medium tracking-wide">
          Merchandise items will be posted soon. Check back later.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-24"
      >
        <MerchCard
          v-for="item in merch"
          :key="item.id"
          :item="item"
          @select="scrollToPayment"
        />
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
            How to Pre-order
          </h2>

          <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-6">
              <p class="text-gray-400">
                Please make a transfer for the total amount of your desired
                items to the account below, and keep your receipt/proof of
                payment.
              </p>

              <div
                class="bg-gray-950 p-6 rounded-xl border border-gray-800 space-y-4"
              >
                <div>
                  <span
                    class="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1"
                    >Bank Name</span
                  >
                  <span class="text-white font-medium text-lg">{{
                    merchSettings.accountBank
                  }}</span>
                </div>
                <div>
                  <span
                    class="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1"
                    >Account Number</span
                  >
                  <div class="flex items-center gap-3">
                    <span
                      class="text-orange-400 font-bold text-2xl font-mono"
                      >{{ merchSettings.accountNumber }}</span
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
                  <span class="text-gray-300 font-medium">{{
                    merchSettings.accountName
                  }}</span>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col justify-center space-y-6 border-t md:border-t-0 md:border-l border-gray-800 pt-8 md:pt-0 md:pl-12"
            >
              <div>
                <h3 class="font-display text-2xl text-white uppercase mb-2">
                  Confirm Your Order
                </h3>
                <p class="text-gray-400 text-sm mb-6">
                  After making your transfer, you must fill out the pre-order
                  confirmation form and upload your proof of payment to secure
                  your items.
                </p>
              </div>
              <a
                :href="merchSettings.googleFormLink"
                target="_blank"
                class="inline-flex items-center justify-center gap-3 bg-linear-to-r from-orange-500 to-yellow-500 text-black px-8 py-4 rounded-lg font-sans font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/20 transition-all hover:-translate-y-1"
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
          class="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 md:p-12 border-l-4 border-orange-500 shadow-2xl overflow-hidden relative"
        >
          <div class="absolute top-0 right-0 p-8 opacity-5">
            <Icon name="heroicons:sparkles-solid" class="w-48 h-48" />
          </div>
          <blockquote class="relative z-10 max-w-3xl">
            <p
              class="font-display text-3xl md:text-4xl text-white font-bold leading-tight mb-6 uppercase"
            >
              "The light shines in the darkness, and the darkness has not
              overcome it."
            </p>
            <cite
              class="font-sans text-orange-500 not-italic font-bold text-sm tracking-[0.2em]"
              >— JOHN 1:5</cite
            >
          </blockquote>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
// Auto-imported: MerchCard, useConferenceData

const api = useConferenceData();

// --- Data Fetching ---
const {
  data: merch,
  pending: merchLoading,
  error: merchError,
  refresh: refreshMerch,
} = await api.getMerch();

const {
  data: merchSettings,
  pending: settingsLoading,
  error: merchSettingsError,
  refresh: refreshSettings,
} = await api.getMerchSettings();

// --- Unified State Management ---
const pending = computed(() => merchLoading.value || settingsLoading.value);
const error = computed(() => merchError.value || merchSettingsError.value);

const loadMerch = () => {
  refreshMerch();
  refreshSettings();
};

// --- UX Enhancements ---
const scrollToPayment = () => {
  const paymentSection = document.getElementById("payment-section");
  if (paymentSection) {
    paymentSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>
