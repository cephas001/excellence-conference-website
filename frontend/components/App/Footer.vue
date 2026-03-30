<template>
  <footer
    class="bg-black py-16 px-6 border-t border-gray-900 relative overflow-hidden"
  >
    <div
      class="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div class="md:col-span-2">
          <h2
            class="font-display font-bold text-3xl text-white tracking-tight uppercase mb-4"
          >
            EC'<span class="text-orange-500">26</span>
          </h2>
          <p class="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
            Shining the Light. A premier gathering at McPherson University
            Chapel of Praise.
          </p>
          <div class="flex gap-4">
            <a
              href="#"
              class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-black transition-colors"
            >
              <Icon name="bi:twitter-x" class="w-4 h-4" />
            </a>
            <a
              href="#"
              class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-black transition-colors"
            >
              <Icon name="bi:instagram" class="w-4 h-4" />
            </a>
            <a
              href="#"
              class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-black transition-colors"
            >
              <Icon name="bi:youtube" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4
            class="font-sans font-bold text-white uppercase tracking-widest text-xs mb-6"
          >
            Quick Links
          </h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/agenda"
                class="text-gray-500 hover:text-orange-500 text-sm transition-colors"
                >Schedule & Agenda</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/merch"
                class="text-gray-500 hover:text-orange-500 text-sm transition-colors"
                >Official Merchandise</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/dinner"
                class="text-gray-500 hover:text-orange-500 text-sm transition-colors"
                >Workers Dinner</NuxtLink
              >
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="font-sans font-bold text-white uppercase tracking-widest text-xs mb-6"
          >
            Contact
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start gap-3 text-gray-500 text-sm">
              <Icon
                name="heroicons:map-pin"
                class="w-5 h-5 text-gray-600 shrink-0"
              />
              <span>McPherson University,<br />Seriki-Sotayo, Ogun State.</span>
            </li>
            <li class="flex items-center gap-3 text-gray-500 text-sm mt-2">
              <Icon
                name="heroicons:envelope"
                class="w-5 h-5 text-gray-600 shrink-0"
              />
              <span
                >{{
                  eventSettings?.contact.email ||
                  "mcucopexcellenceconference@gmail.com"
                }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <p class="text-gray-600 text-xs font-medium tracking-wider uppercase">
          © 2026 McPherson University Chapel. All rights reserved.
        </p>
        <div class="flex gap-6 text-xs font-medium text-gray-600">
          <a href="#" class="hover:text-gray-300 transition-colors"
            >Privacy Policy</a
          >
          <a href="#" class="hover:text-gray-300 transition-colors"
            >Terms of Service</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const api = useConferenceData();

const {
  data: eventSettings,
  pending: settingsLoading,
  error: settingsError,
} = await api.getEventSettings();
</script>
