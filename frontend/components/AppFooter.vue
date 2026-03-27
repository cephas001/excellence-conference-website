<template>
  <div>
    <!-- Bottom Navigation -->
    <nav
      id="bottom-nav"
      class="fixed bottom-4 sm:bottom-6 left-1/2 bg-gray-800/95 backdrop-blur-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-center gap-4 sm:gap-6 md:gap-8 z-50 border border-gray-700 -translate-x-1/2 bottom-nav-safe"
    >
      <NuxtLink
        to="/"
        class="flex flex-col items-center gap-1 text-accent-orange"
      >
        <IconsHome class="text-xl" />
        <span class="text-xs font-medium">Home</span>
      </NuxtLink>
      <NuxtLink
        to="/#agenda"
        class="flex flex-col items-center gap-1 text-gray-400 hover:text-accent-orange transition-colors"
      >
        <IconsCalendar class="text-xl" />
        <span class="text-xs font-medium">Agenda</span>
      </NuxtLink>
      <NuxtLink
        to="/#merch"
        class="flex flex-col items-center gap-1 text-gray-400 hover:text-accent-orange transition-colors"
      >
        <IconsShirt class="text-xl" />
        <span class="text-xs font-medium">Merch</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <footer class="bg-gray-900 border-t border-gray-800 py-6 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto text-center w-full">
        <p class="text-gray-400 text-sm">
          © 2026 Excellence Conference. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup></script>
