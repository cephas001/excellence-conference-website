<template>
  <LargeLoader :loading="loading" />

  <div
    class="relative min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-orange-500 selection:text-black"
    v-if="!loading"
  >
    <section
      class="relative min-h-screen flex items-center overflow-hidden px-6 lg:px-12 pt-10"
    >
      <div class="absolute inset-0 z-0">
        <SlideShow :slides="slides" :currentSlide="currentSlide" />
        <div
          class="absolute inset-0 bg-linear-to-b from-gray-950 via-gray-950/80 to-gray-950"
        ></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto w-full">
        <div class="grid lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 mt-10 lg:mt-0">
            <p
              class="text-orange-500 font-display text-sm md:text-base tracking-[0.15em] mb-4 uppercase font-semibold"
            >
              McPherson University | May 19–24, 2026
            </p>
            <h1
              class="text-5xl md:text-6xl lg:text-7xl font-display leading-[1.1] font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-orange-500 via-orange-400 to-yellow-400 mb-8 uppercase"
            >
              SHINING THE<br />LIGHT
            </h1>

            <Timer :timeLeft="timeLeft" />

            <div class="flex flex-col sm:flex-row gap-4 mt-8">
              <NuxtLink
                to="/agenda"
                class="bg-linear-to-r from-orange-500 to-yellow-500 text-black px-8 py-3.5 rounded-sm font-sans font-semibold text-sm md:text-base tracking-wide uppercase hover:shadow-md hover:shadow-orange-500/20 transition-all text-center"
              >
                View Schedule
              </NuxtLink>
              <NuxtLink
                to="/merch"
                class="border border-gray-700 text-gray-200 px-8 py-3.5 rounded-sm font-sans font-semibold text-sm md:text-base tracking-wide uppercase hover:bg-gray-800 transition-colors text-center"
              >
                Conference Merch
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute -right-20 -top-20 w-37.5 h-37.5 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"
      ></div>
    </section>

    <section class="bg-gray-900 py-16 border-y border-gray-800">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
          <div class="flex flex-col border-l-2 border-orange-500/30 pl-6">
            <span
              class="text-4xl md:text-5xl font-display font-bold text-yellow-400 leading-none"
              >6</span
            >
            <span
              class="text-gray-400 font-sans text-xs md:text-sm tracking-widest uppercase mt-2"
              >Days of Power</span
            >
          </div>
          <div class="flex flex-col border-l-2 border-orange-500/30 pl-6">
            <span
              class="text-4xl md:text-5xl font-display font-bold text-yellow-400 leading-none"
              >10+</span
            >
            <span
              class="text-gray-400 font-sans text-xs md:text-sm tracking-widest uppercase mt-2"
              >Ministers</span
            >
          </div>
          <div class="flex flex-col border-l-2 border-orange-500/30 pl-6">
            <span
              class="text-4xl md:text-5xl font-display font-bold text-yellow-400 leading-none"
              >1</span
            >
            <span
              class="text-gray-400 font-sans text-xs md:text-sm tracking-widest uppercase mt-2"
              >Encounter</span
            >
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="relative">
          <div
            class="absolute -inset-4 bg-orange-500/5 -z-10 translate-x-4 translate-y-4"
          ></div>
          <AppImage
            src="/img/homepage_second_section.jpg"
            :alt="'Worship'"
            imgClass="transition-all duration-700 w-full aspect-4/5 object-cover border border-gray-800"
          />
          <div
            class="absolute bottom-0 right-0 bg-orange-500 p-6 translate-x-8 translate-y-8 hidden lg:block"
          >
            <Icon
              name="heroicons:light-bulb-solid"
              class="text-black w-8 h-8"
            />
          </div>
        </div>
        <div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight leading-tight mb-6 uppercase"
          >
            A CATALYST FOR <span class="text-orange-500">TRANSFORMATION</span>
          </h2>
          <p
            class="text-gray-400 text-base md:text-lg leading-relaxed mb-8 font-light font-poppins"
          >
            In an era of shifting paradigms, Excellence 2026 serves as the
            definitive beacon. "Shining the Light" isn't just a theme; it's a
            call to action for visionary Christian youth to merge spiritual
            depth with global relevance.
          </p>
          <div class="space-y-6">
            <div class="flex gap-4 items-start">
              <Icon
                name="heroicons:fire"
                class="text-yellow-400 w-6 h-6 md:w-8 md:h-8 shrink-0 mt-1"
              />
              <div>
                <h4
                  class="font-display font-bold text-lg md:text-xl uppercase tracking-wide"
                >
                  Spiritual Revival
                </h4>
                <p class="text-gray-400 text-sm md:text-base mt-1 font-poppins">
                  Deep encounters through prophetic ministrations and intense
                  worship sessions.
                </p>
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <Icon
                name="heroicons:academic-cap"
                class="text-yellow-400 w-6 h-6 md:w-8 md:h-8 shrink-0 mt-1"
              />
              <div>
                <h4
                  class="font-display font-bold text-lg md:text-xl uppercase tracking-wide"
                >
                  Academic Excellence
                </h4>
                <p class="text-gray-400 text-sm md:text-base mt-1 font-poppins">
                  Practical wisdom to dominate in your specific field of study
                  and future career.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 bg-gray-900 border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between mb-12 gap-6">
          <div>
            <span
              class="text-orange-500 font-sans font-semibold text-xs tracking-[0.2em] uppercase"
            >
              The Voices
            </span>
            <h2
              class="text-2xl md:text-3xl font-display font-bold uppercase mt-2"
            >
              Meet Our Ministers
            </h2>
          </div>
          <div class="h-px grow bg-gray-800 mx-12 hidden md:block mb-4"></div>
        </div>

        <div
          v-if="!speakers || speakers.length === 0"
          class="flex flex-col items-center justify-center py-16 px-6 border border-dashed border-gray-800 rounded-2xl bg-gray-950/50 text-center"
        >
          <h3 class="text-sm italic font-display text-white uppercase">
            To be Revealed
          </h3>
        </div>

        <div
          v-else
          class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 border border-gray-800"
        >
          <div
            v-for="speaker in speakers"
            :key="speaker.id"
            class="group relative overflow-hidden aspect-3/4 border-r border-b border-gray-800 last:border-r-0 cursor-pointer"
            @click="openModal(speaker)"
          >
            <div
              class="absolute inset-0 bg-gray-950 transition-transform duration-500 group-hover:scale-105"
            >
              <AppImage
                :src="speaker.image"
                :alt="speaker.name"
                imgClass="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-700"
              />
            </div>

            <div
              class="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/40 to-transparent"
            ></div>

            <div class="relative h-full p-6 md:p-8 flex flex-col justify-end">
              <span
                class="text-yellow-400 font-sans font-semibold text-xs mb-1 tracking-widest uppercase"
              >
                {{ speaker.role }}
              </span>
              <h3
                class="text-xl md:text-2xl font-display font-bold uppercase mb-2 group-hover:text-orange-500 transition-colors"
              >
                {{ speaker.name }}
              </h3>
              <div
                class="mt-4 border-t border-gray-700 pt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
              >
                <span
                  class="text-xs text-gray-300 font-semibold tracking-widest uppercase"
                  >More Info</span
                >
                <Icon
                  name="heroicons:arrow-right"
                  class="w-4 h-4 text-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 bg-black border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between mb-12 gap-6">
          <div>
            <span
              class="text-orange-500 font-sans font-semibold text-xs tracking-[0.2em] uppercase"
            >
              Be Inspired
            </span>
            <h2
              class="text-2xl md:text-3xl font-display font-bold uppercase mt-2"
            >
              Testimonies
            </h2>
          </div>
          <div class="h-px grow bg-gray-800 mx-12 hidden md:block mb-4"></div>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="testimony in testimonies"
            :key="testimony.id"
            class="p-8 border border-gray-800 bg-gray-900/30 hover:bg-gray-900/80 transition-colors relative group"
          >
            <Icon
              name="heroicons:chat-bubble-bottom-center-text"
              class="w-8 h-8 text-orange-500/40 mb-6 group-hover:text-orange-500 transition-colors"
            />
            <p
              class="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-4 min-h-20"
            >
              "{{ testimony.testimony }}"
            </p>
            <div
              class="border-t border-gray-800 pt-5 flex items-center justify-between"
            >
              <div>
                <h4
                  class="font-sans font-semibold tracking-wider text-sm md:text-base text-gray-100 uppercase"
                >
                  {{ testimony.name }}
                </h4>
                <span
                  class="text-orange-500 text-[10px] md:text-xs tracking-widest uppercase"
                  >{{ testimony.location }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 bg-gray-950 border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <span
            class="text-orange-500 font-sans font-semibold text-xs tracking-[0.2em] uppercase"
            >Location</span
          >
          <h2
            class="text-2xl md:text-3xl font-display font-bold uppercase mt-2 mb-8"
          >
            The Venue
          </h2>

          <div
            class="border border-gray-800 bg-gray-900 p-8 relative overflow-hidden group rounded-sm"
          >
            <div
              class="absolute -right-8 -top-8 text-gray-800 group-hover:text-gray-700 transition-colors"
            >
              <Icon name="heroicons:map" class="w-40 h-40 opacity-20" />
            </div>
            <div class="relative z-10" v-if="eventSettings?.venue">
              <h3
                class="font-display font-bold text-xl md:text-3xl text-white mb-2"
              >
                {{ eventSettings.venue.venueName }}
              </h3>
              <p class="text-gray-400 text-base md:text-lg mb-6">
                {{ eventSettings.venue.address }}
              </p>
              <LocationButton v-if="eventSettings.venue.mapLink" />
            </div>
          </div>
        </div>

        <div class="pt-15 border-t border-gray-800 md:border-0 md:pt-0">
          <span
            class="text-orange-500 font-sans font-semibold text-xs tracking-[0.2em] uppercase"
            >Details</span
          >
          <h2
            class="text-2xl md:text-3xl font-display font-bold uppercase mt-2 mb-8"
          >
            FAQ
          </h2>

          <div class="border-t border-gray-800">
            <HomeFaq v-for="faq in faqs" :key="faq.id" :faq="faq" />
          </div>
        </div>
      </div>
    </section>
  </div>

  <SpeakerModal
    :is-open="isModalOpen"
    :speaker="activeSpeaker"
    @close="closeModal"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const api = useConferenceData();

// --- Modal State ---
const isModalOpen = ref(false);
const activeSpeaker = ref(null);

const openModal = (speaker) => {
  activeSpeaker.value = speaker;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    activeSpeaker.value = null;
  }, 300);
};

// --- Hero Slider ---
const currentSlide = ref(0);
const slides = [
  "/img/slide1.jpeg",
  "/img/slide2.jpeg",
  "/img/slide3.jpeg",
  "/img/slide4.jpeg",
];
let slideInterval;

// --- Extracted Countdown Logic ---
const { timeLeft } = useCountdown("2026-05-19T00:00:00+01:00");

// --- Data Fetching (Parallelized for Speed) ---
// Using Promise.all fires all 4 requests at the exact same time,
// cutting your fetching time drastically.
const [
  { data: speakers, pending: pendingSpeakers },
  { data: testimonies, pending: pendingTestimonies },
  { data: faqs, pending: pendingFaqs },
  { data: eventSettings, pending: pendingSettings },
] = await Promise.all([
  api.getSpeakers(),
  api.getTestimonies(),
  api.getFaqs(),
  api.getEventSettings(),
]);

// --- Accurate Loading State ---
// This ties the loader strictly to the actual network requests.
// Note: Due to SSR, initial page loads will clear this instantly.
// It will only remain on screen during client-side navigation.
const loading = computed(() => {
  return (
    pendingSpeakers.value ||
    pendingTestimonies.value ||
    pendingFaqs.value ||
    pendingSettings.value
  );
});

// --- Lifecycle Hooks ---
onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value =
      currentSlide.value === slides.length - 1 ? 0 : currentSlide.value + 1;
  }, 5000);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>
