<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b"
    :class="computeClass"
  >
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="relative z-50 flex items-center group transition-transform duration-300 hover:scale-[1.02] active:scale-95"
      >
        <img
          src="/img/logo.png"
          alt="Excellence Conference Logo"
          class="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300"
        />
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          to="/"
          class="font-sans font-semibold text-sm tracking-widest uppercase transition-colors"
          :class="
            isActive('/')
              ? 'text-theme-primary'
              : 'text-gray-300 hover:text-theme-primary'
          "
          >Home</NuxtLink
        >

        <NuxtLink
          to="/agenda"
          class="font-sans font-semibold text-sm tracking-widest uppercase transition-colors"
          :class="
            isActive('/agenda')
              ? 'text-theme-primary'
              : 'text-gray-300 hover:text-theme-primary'
          "
          >Schedule</NuxtLink
        >

        <NuxtLink
          to="/merch"
          class="font-sans font-semibold text-sm tracking-widest uppercase transition-colors"
          :class="
            isActive('/merch')
              ? 'text-theme-primary'
              : 'text-gray-300 hover:text-theme-primary'
          "
          >Merch</NuxtLink
        >

        <NuxtLink
          to="/about"
          class="font-sans font-semibold text-sm tracking-widest uppercase transition-colors"
          :class="
            isActive('/about')
              ? 'text-theme-primary'
              : 'text-gray-300 hover:text-theme-primary'
          "
          >About</NuxtLink
        >

        <NuxtLink
          to="/dinner"
          class="font-sans font-semibold text-sm tracking-widest uppercase transition-colors"
          :class="
            isActive('/dinner')
              ? 'text-theme-primary'
              : 'text-gray-300 hover:text-theme-primary'
          "
          >Dinner</NuxtLink
        >
      </nav>

      <div class="hidden md:flex items-center gap-4">
        <button
          @click="goToContactPage"
          class="bg-linear-to-r from-theme-primary to-theme-secondary text-black px-6 py-2.5 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
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
        class="absolute top-full left-0 right-0 bg-theme-base/95 backdrop-blur-3xl border-b border-theme-border px-6 pb-6 pt-5 flex flex-col gap-6 md:hidden shadow-2xl"
      >
        <nav class="flex flex-col gap-4">
          <NuxtLink
            @click="closeMobileMenu"
            to="/"
            class="font-display text-xl font-bold uppercase transition-colors"
            :class="
              isActive('/')
                ? 'text-theme-primary'
                : 'text-gray-200 hover:text-theme-primary'
            "
            >Home</NuxtLink
          >

          <NuxtLink
            @click="closeMobileMenu"
            to="/agenda"
            class="font-display text-xl font-bold uppercase transition-colors"
            :class="
              isActive('/agenda')
                ? 'text-theme-primary'
                : 'text-gray-200 hover:text-theme-primary'
            "
            >Schedule</NuxtLink
          >

          <NuxtLink
            @click="closeMobileMenu"
            to="/merch"
            class="font-display text-xl font-bold uppercase transition-colors"
            :class="
              isActive('/merch')
                ? 'text-theme-primary'
                : 'text-gray-200 hover:text-theme-primary'
            "
            >Merch</NuxtLink
          >

          <NuxtLink
            @click="closeMobileMenu"
            to="/about"
            class="font-display text-xl font-bold uppercase transition-colors"
            :class="
              isActive('/about')
                ? 'text-theme-primary'
                : 'text-gray-200 hover:text-theme-primary'
            "
            >About</NuxtLink
          >

          <NuxtLink
            @click="closeMobileMenu"
            to="/dinner"
            class="font-display text-xl font-bold uppercase transition-colors"
            :class="
              isActive('/dinner')
                ? 'text-theme-primary'
                : 'text-gray-200 hover:text-theme-primary'
            "
            >Workers Dinner</NuxtLink
          >
        </nav>

        <div class="pt-6 border-t border-theme-border">
          <button
            class="w-full bg-linear-to-r from-theme-primary to-theme-secondary text-black px-6 py-4 rounded-sm font-sans font-bold uppercase tracking-widest text-sm shadow-lg"
            @click="goToContactPage"
          >
            Contact Us
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
// Auto-imported in Nuxt, but good practice to explicitly define dependencies if needed
const route = useRoute();

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

// The manual route checker
const isActive = (path) => {
  return route.path === path;
};

// WATCHER: Force the mobile menu closed if the route changes (e.g., using browser back button)
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  },
);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
  isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const goToContactPage = () => {
  closeMobileMenu();
  navigateTo("/contact");
};

const computeClass = computed(() => {
  if (isScrolled.value) {
    return "bg-theme-base/80 backdrop-blur-xl border-theme-border py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]";
  } else if (isMobileMenuOpen.value) {
    return "bg-theme-base/95 backdrop-blur-3xl py-6 border-theme-border";
  } else {
    return "bg-transparent border-transparent py-6";
  }
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
