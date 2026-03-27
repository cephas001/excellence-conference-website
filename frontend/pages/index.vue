<template>
  <Transition
    enter-active-class="transition-opacity duration-500"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="loading"
      class="fixed inset-0 bg-white dark:bg-gray-950 z-[100] flex items-center justify-center transition-colors duration-300"
    >
      <img
        src="assets/logo.png"
        alt="Excellence Conference"
        class="h-24 md:h-32 w-auto object-contain animate-pulse"
      />
    </div>
  </Transition>

  <div
    class="relative min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-poppins"
    v-if="!loading"
  >
    <div
      v-if="announcement"
      class="fixed top-0 hidden left-0 right-0 z-[60] bg-orange-600/90 backdrop-blur-md text-white py-2 px-4 text-center text-sm font-medium border-b border-orange-500"
    >
      {{ announcement }}
    </div>

    <section
      class="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-gray-950"
    >
      <div class="absolute inset-0 z-0">
        <TransitionGroup
          enter-active-class="transition-opacity duration-1000 ease-in-out"
          leave-active-class="transition-opacity duration-1000 ease-in-out"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div
            v-for="(slide, index) in slides"
            :key="slide"
            v-show="currentSlide === index"
            class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${slide})` }"
          ></div>
        </TransitionGroup>
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-950/70 to-gray-950 z-10"
      ></div>

      <div
        class="relative z-20 text-center px-4 max-w-5xl mx-auto w-full flex flex-col items-center mt-10"
      >
        <span
          class="px-5 py-1.5 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 sm:mb-8 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
        >
          Excellence Conference 2026
        </span>

        <h1
          class="font-poppins text-6xl sm:text-8xl md:text-9xl text-white uppercase leading-none mb-8 drop-shadow-lg tracking-tighter"
        >
          <span class="block text-gray-100">Shining The</span>
          <span
            class="block bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent pb-2"
          >
            Light
          </span>
        </h1>

        <div class="mb-12 w-full max-w-md">
          <p class="text-gray-300 text-sm font-medium mb-1">
            May 19 – May 24, 2026
          </p>
          <p class="text-gray-500 text-xs mb-4 uppercase tracking-wider">
            All times West Africa Time (WAT)
          </p>

          <div class="grid grid-cols-4 gap-2 sm:gap-4">
            <div
              v-for="(value, unit) in timeLeft"
              :key="unit"
              class="bg-gray-900/80 backdrop-blur-md rounded-xl p-3 border border-gray-700 shadow-xl flex flex-col items-center justify-center"
            >
              <span class="font-display block text-md text-orange-400">{{
                value
              }}</span>
              <span
                class="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mt-1"
                >{{ unit }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            v-for="(_, index) in slides"
            :key="'dot-' + index"
            @click="currentSlide = index"
            class="h-2 rounded-full transition-all duration-300"
            :class="
              currentSlide === index
                ? 'w-8 bg-orange-500'
                : 'w-2 bg-gray-600 hover:bg-gray-400'
            "
            aria-label="Change slide"
          ></button>
        </div>
      </div>
    </section>

    <section
      class="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950 relative border-t border-gray-200 dark:border-gray-900 transition-colors duration-300"
    >
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2
            class="font-display text-4xl sm:text-5xl md:text-6xl text-gray-900 dark:text-white mb-4 tracking-wide"
          >
            Meet Our Speakers
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Visionary leaders guiding us through a week of renewal and revival.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="speaker in speakers"
            :key="speaker.id"
            class="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300"
          >
            <div
              class="aspect-[4/5] bg-gray-200 dark:bg-gray-800 relative overflow-hidden"
            >
              <img
                :src="speaker.image"
                :alt="speaker.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80"
              ></div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-center">
              <h3 class="text-xl font-bold text-white mb-1">
                {{ speaker.name }}
              </h3>
              <p class="text-orange-400 text-sm font-medium">
                {{ speaker.role }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="py-20 px-4 sm:px-6 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2
            class="font-display text-4xl sm:text-5xl md:text-6xl text-gray-900 dark:text-white mb-4 tracking-wide"
          >
            Lives Changed
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Hear from those who attended previous Excellence Conferences.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="testimony in testimonies"
            :key="testimony.id"
            class="bg-gray-50 dark:bg-gray-950 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 relative shadow-sm hover:shadow-md transition-shadow"
          >
            <Icon
              name="heroicons:chat-bubble-left-ellipsis"
              class="w-8 h-8 text-orange-500 mb-6 opacity-80"
            />
            <p
              class="text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed"
            >
              "{{ testimony.quote }}"
            </p>
            <div
              class="flex items-center gap-3 border-t border-gray-200 dark:border-gray-800 pt-6"
            >
              <div
                class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold"
              >
                {{ testimony.name.charAt(0) }}
              </div>
              <div>
                <h4 class="text-gray-900 dark:text-white font-semibold">
                  {{ testimony.name }}
                </h4>
                <p class="text-gray-500 text-xs uppercase">
                  {{ testimony.year }} Attendee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 transition-colors duration-300"
    >
      <div class="max-w-4xl mx-auto text-center">
        <h2
          class="font-display text-4xl sm:text-5xl text-gray-900 dark:text-white mb-12 tracking-wide"
        >
          Venue & Location
        </h2>
        <div
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col items-center"
        >
          <div
            class="w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-6"
          >
            <Icon
              name="heroicons:map-pin-solid"
              class="w-8 h-8 text-orange-500"
            />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ venue.name }}
          </h3>
          <p
            class="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto"
          >
            {{ venue.address }}
          </p>
          <a
            :href="venue.mapsLink"
            target="_blank"
            class="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Get Directions
            <Icon
              name="heroicons:arrow-top-right-on-square-20-solid"
              class="w-5 h-5"
            />
          </a>
        </div>
      </div>
    </section>

    <section
      class="py-20 px-4 sm:px-6 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div class="max-w-3xl mx-auto">
        <h2
          class="font-display text-4xl sm:text-5xl text-gray-900 dark:text-white text-center mb-12 tracking-wide"
        >
          Frequently Asked Questions
        </h2>
        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300"
          >
            <button
              @click="faq.isOpen = !faq.isOpen"
              class="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span class="text-gray-900 dark:text-white font-semibold pr-4">{{
                faq.question
              }}</span>
              <Icon
                name="heroicons:chevron-down"
                class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 flex-shrink-0"
                :class="faq.isOpen ? 'rotate-180 text-orange-500' : ''"
              />
            </button>
            <div
              v-show="faq.isOpen"
              class="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800 pt-4"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-950 dark:to-black text-center border-t border-gray-200 dark:border-gray-900 transition-colors duration-300"
    >
      <div class="max-w-3xl mx-auto">
        <h2
          class="font-display text-5xl sm:text-6xl text-gray-900 dark:text-white mb-6 tracking-wide"
        >
          Ready to be inspired?
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-10">
          Join us for a week of transformation, followed by our special Workers
          Dinner to celebrate the fellowship.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/agenda"
            class="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            View Full Schedule
          </NuxtLink>
          <NuxtLink
            to="/dinner"
            class="bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Workers Dinner Info
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Page States
const loading = ref(true);
const announcement = ref(
  "Welcome to the official portal for the Excellence Conference 2026.",
);

// Slideshow Logic
const currentSlide = ref(0);
const slides = [
  "/img/slide1.jpeg",
  "/img/slide2.jpeg",
  "/img/slide3.jpeg",
  "/img/slide4.jpeg",
];
let slideInterval;

// Countdown Timer Logic
const targetDate = new Date("2026-05-19T00:00:00+01:00").getTime(); // WAT Timezone
const timeLeft = ref({ days: "00", hours: "00", mins: "00", secs: "00" });
let countdownInterval;

const updateTimer = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    timeLeft.value = { days: "00", hours: "00", mins: "00", secs: "00" };
    clearInterval(countdownInterval);
    return;
  }

  timeLeft.value = {
    days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0"),
    hours: String(
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    ).padStart(2, "0"),
    mins: String(
      Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    ).padStart(2, "0"),
    secs: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, "0"),
  };
};

// Dummy Data: Speakers
const speakers = ref([
  {
    id: 1,
    name: "Rev. Dr. A. Johnson",
    role: "Host Minister",
    image: "/img/slide1.jpeg",
  },
  {
    id: 2,
    name: "Pastor Sarah Williams",
    role: "Guest Speaker",
    image: "/img/slide2.jpeg",
  },
  {
    id: 3,
    name: "Evang. Mark David",
    role: "Worship Leader",
    image: "/img/slide3.jpeg",
  },
  {
    id: 4,
    name: "Dr. Emmanuel Peters",
    role: "Guest Speaker",
    image: "/img/slide4.jpeg",
  },
]);

// Dummy Data: Testimonies
const testimonies = ref([
  {
    id: 1,
    quote:
      "The light I received at last year's conference completely transformed my academic and spiritual journey.",
    name: "David O.",
    year: "2025",
  },
  {
    id: 2,
    quote:
      "I came feeling burnt out, but the teachings renewed my strength. I am forever grateful for this gathering.",
    name: "Mary A.",
    year: "2025",
  },
  {
    id: 3,
    quote:
      "The clarity and direction I got during the prophetic sessions gave me a clear path for my final year project.",
    name: "Peter K.",
    year: "2024",
  },
]);

// Dummy Data: Venue
const venue = ref({
  name: "McPherson University Chapel",
  address: "Seriki-Sotayo, Ogun State, Nigeria.",
  mapsLink: "#",
});

// Dummy Data: FAQs
const faqs = ref([
  {
    isOpen: false,
    question: "Do I need to register to attend?",
    answer:
      "Yes, registration is free but mandatory to help us adequately prepare for all attendees.",
  },
  {
    isOpen: false,
    question: "Will feeding and accommodation be provided?",
    answer:
      "Accommodation is available for registered attendees traveling from outside the campus. Feeding details will be communicated via email.",
  },
  {
    isOpen: false,
    question: "Who can attend the Workers Dinner?",
    answer:
      "The Workers Dinner is exclusively for individuals who serve as volunteers, executives, or workers within the chapel units.",
  },
]);

// Lifecycle Hooks
onMounted(() => {
  // Simulate loading state to prevent flash of unstyled content
  setTimeout(() => {
    loading.value = false;
  }, 800);

  // Start Slideshow Interval
  slideInterval = setInterval(() => {
    currentSlide.value =
      currentSlide.value === slides.length - 1 ? 0 : currentSlide.value + 1;
  }, 5000);

  // Start Countdown
  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  clearInterval(slideInterval);
  clearInterval(countdownInterval);
});
</script>
