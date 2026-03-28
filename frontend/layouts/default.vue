<template>
  <div class="relative min-h-screen flex flex-col overflow-x-hidden">
    <div class="sticky top-0 z-60 w-full flex flex-col">
      <div
        v-if="false"
        class="bg-orange-600/90 backdrop-blur-md text-white py-2 px-4 text-center text-sm font-medium border-b border-orange-500"
      >
        {{ eventSettings.current.message }}
      </div>

      <AppNavbar />
    </div>

    <main class="grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
const api = useConferenceData();
const { data: eventSettings } = await api.getEventSettings();
</script>
