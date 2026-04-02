// composables/useConferenceData.js
import { useRuntimeConfig } from "#app";

export const useConferenceData = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  return {
    getSpeakers: () => $fetch(`${apiBase}/speakers`),

    getTestimonies: () => $fetch(`${apiBase}/testimonies`),

    getAgenda: () => $fetch(`${apiBase}/agenda`),

    getMerch: () => $fetch(`${apiBase}/merch`),

    getMerchSettings: () => $fetch(`${apiBase}/merch-settings`),

    // This fetches Venue, Dinner, Announcements, and Contact all at once
    getEventSettings: () => $fetch(`${apiBase}/event-settings`),

    getFaqs: () => $fetch(`${apiBase}/faq`),
  };
};
