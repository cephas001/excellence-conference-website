<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b"
    :class="
      isScrolled
        ? 'bg-gray-950/80 backdrop-blur-xl border-gray-800 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
        : 'bg-transparent border-transparent py-6'
    "
  >
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 group relative z-50">
        <div
          class="w-10 h-10 rounded-sm bg-linear-to-br from-orange-500 to-yellow-500 p-px"
        >
          <div
            class="w-full h-full bg-gray-950 flex items-center justify-center rounded-[3px] group-hover:bg-transparent transition-colors duration-300"
          >
            <Icon
              name="heroicons:sparkles-solid"
              class="w-6 h-6 text-orange-500 group-hover:text-black transition-colors duration-300"
            />
          </div>
        </div>
        <span
          class="font-display font-bold text-xl tracking-widest text-white uppercase"
        >
          EC <span class="text-orange-500">2026</span>
        </span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          to="/"
          class="font-sans font-semibold text-sm tracking-widest text-gray-300 hover:text-orange-500 uppercase transition-colors"
          active-class="text-orange-500"
          >Home</NuxtLink
        >
        <NuxtLink
          to="/agenda"
          class="font-sans font-semibold text-sm tracking-widest text-gray-300 hover:text-orange-500 uppercase transition-colors"
          active-class="text-orange-500"
          >Schedule</NuxtLink
        >
        <NuxtLink
          to="/merch"
          class="font-sans font-semibold text-sm tracking-widest text-gray-300 hover:text-orange-500 uppercase transition-colors"
          active-class="text-orange-500"
          >Merch</NuxtLink
        >
        <NuxtLink
          to="/dinner"
          class="font-sans font-semibold text-sm tracking-widest text-gray-300 hover:text-orange-500 uppercase transition-colors"
          active-class="text-orange-500"
          >Dinner</NuxtLink
        >
      </nav>

      <div class="hidden md:flex items-center gap-4">
        <button
          class="bg-linear-to-r from-orange-500 to-yellow-500 text-black px-6 py-2.5 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
        >
          Contact Us
        </button>
      </div>

      <button
        @click="toggleMobileMenu"
        class="md:hidden relative z-50 p-2 text-gray-300 hover:text-white focus:outline-none"
      >
        <Icon
          :name="isMobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
          class="w-7 h-7 transition-transform duration-300"
        />
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="absolute top-full left-0 right-0 bg-gray-950/95 backdrop-blur-3xl border-b border-gray-800 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
      >
        <nav class="flex flex-col gap-4">
          <NuxtLink
            @click="closeMobileMenu"
            to="/"
            class="font-display text-2xl font-bold text-gray-200 hover:text-orange-500 uppercase transition-colors"
            active-class="text-orange-500"
            >Home</NuxtLink
          >
          <NuxtLink
            @click="closeMobileMenu"
            to="/agenda"
            class="font-display text-2xl font-bold text-gray-200 hover:text-orange-500 uppercase transition-colors"
            active-class="text-orange-500"
            >Schedule</NuxtLink
          >
          <NuxtLink
            @click="closeMobileMenu"
            to="/merch"
            class="font-display text-2xl font-bold text-gray-200 hover:text-orange-500 uppercase transition-colors"
            active-class="text-orange-500"
            >Merch</NuxtLink
          >
          <NuxtLink
            @click="closeMobileMenu"
            to="/dinner"
            class="font-display text-2xl font-bold text-gray-200 hover:text-orange-500 uppercase transition-colors"
            active-class="text-orange-500"
            >Workers Dinner</NuxtLink
          >
        </nav>
        <div class="pt-6 border-t border-gray-800">
          <button
            class="w-full bg-linear-to-r from-orange-500 to-yellow-500 text-black px-6 py-4 rounded-sm font-sans font-bold uppercase tracking-widest text-sm shadow-lg"
          >
            Contact Us
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
