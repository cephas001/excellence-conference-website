<template>
  <header
    id="main-header"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-2 animate-fade-in-up transition-[top] header-transition"
    style="animation-delay: 0.1s; opacity: 0"
  >
    <div class="w-10 flex-shrink-0" aria-hidden="true"></div>
    <NuxtLink to="/" class="block flex-shrink-0">
      <img
        src="/assets/logo.png"
        alt="Excellence Conference – Home"
        class="h-12 sm:h-14 md:h-16 w-auto object-contain"
      />
    </NuxtLink>
    <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
      <button
        type="button"
        id="theme-toggle"
        class="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-gray-700/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
        aria-label="Toggle light/dark mode"
      >
        <IconsSun
          id="theme-icon-light"
          class="text-xl hidden"
          aria-hidden="true"
        />
        <IconsMoon id="theme-icon-dark" class="text-xl" aria-hidden="true" />
      </button>
      <NuxtLink
        to="/#contact"
        class="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-gray-700/80 transition-colors"
        aria-label="Contact us"
      >
        <IconsMail class="text-xl" aria-hidden="true" />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup></script>
