<template>
  <div
    class="relative min-h-screen bg-theme-base text-theme-text font-sans antialiased selection:bg-theme-primary/30 overflow-hidden pt-30 pb-24"
  >
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute top-[-10%] right-[-10%] w-150 h-150 bg-theme-primary/10 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-5%] left-[-5%] w-125 h-125 bg-theme-secondary/5 rounded-full blur-[100px]"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <AppPageHeader
        plainText="OFFICIAL"
        styledText="Merchandise"
        description="Equip yourself with the official 'Shining the Light' merchandise
          collection."
      />

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
        <p class="text-theme-text-muted mb-4">
          Unable to load merchandise items at this time.
        </p>
        <button
          @click="loadMerch"
          class="px-6 py-2 bg-theme-border hover:bg-gray-700 text-theme-text rounded-md transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>

      <div
        v-else-if="!merch || merch.length === 0"
        class="text-center py-20 bg-theme-surface/50 border border-theme-border rounded-xl"
      >
        <Icon
          name="heroicons:shopping-bag"
          class="w-12 h-12 text-gray-600 mx-auto mb-4"
        />
        <p class="text-theme-text-muted font-medium tracking-wide">
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
          class="bg-theme-surface border border-theme-border rounded-2xl p-8 md:p-12 relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-theme-primary/5 blur-3xl rounded-full pointer-events-none"
          ></div>

          <h2
            class="font-display text-xl md:text-3xl text-theme-text font-bold uppercase mb-8"
          >
            How to Pre-order
          </h2>

          <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-6">
              <p class="text-theme-text-muted">
                Please make a transfer for the total amount of your desired
                items to the account below, and keep your receipt/proof of
                payment.
              </p>

              <AccountDetailsCard :accountDetails="merchSettings" />
            </div>

            <div
              class="flex flex-col justify-center space-y-6 border-t md:border-t-0 md:border-l border-theme-border pt-8 md:pt-0 md:pl-12"
            >
              <div>
                <h3
                  class="font-display text-xl md:text-2xl text-theme-text uppercase mb-4"
                >
                  Confirm Your Order
                </h3>
                <p class="text-theme-text-muted text-sm mb-3">
                  After making your transfer, you must fill out the pre-order
                  confirmation form and upload your proof of payment to secure
                  your items.
                </p>
              </div>
              <a
                :href="merchSettings.googleFormLink"
                target="_blank"
                class="inline-flex items-center justify-center gap-3 bg-linear-to-r from-theme-primary to-theme-secondary text-black px-8 py-4 rounded-lg font-sans font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-theme-primary/20 transition-all hover:-translate-y-1 text-sm md:text-md"
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

      <section class="mt-14 relative">
        <div
          class="bg-theme-surface/50 backdrop-blur-xl rounded-2xl p-8 md:p-12 border-l-4 border-theme-primary shadow-2xl overflow-hidden relative"
        >
          <div class="absolute top-0 right-0 p-8 opacity-5">
            <Icon name="heroicons:sparkles-solid" class="w-48 h-48" />
          </div>
          <blockquote class="relative z-10 max-w-3xl">
            <p
              class="font-display text-2xl md:text-3xl text-theme-text font-bold leading-tight mb-6 uppercase"
            >
              "The light shines in the darkness, and the darkness has not
              overcome it."
            </p>
            <cite
              class="font-sans text-theme-primary not-italic font-bold text-sm tracking-[0.2em]"
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
