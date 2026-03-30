<template>
  <a
    :href="eventSettings.venue.mapLink"
    target="_blank"
    class="inline-flex items-center gap-2 border-b-2 border-theme-primary text-theme-primary pb-1 font-sans font-semibold text-xs tracking-widest uppercase hover:text-theme-secondary hover:border-theme-secondary transition-colors mb-4"
  >
    Open in Maps
    <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
  </a>
</template>

<script setup>
const api = useConferenceData();
const { data: eventSettings } = await api.getEventSettings();
</script>
