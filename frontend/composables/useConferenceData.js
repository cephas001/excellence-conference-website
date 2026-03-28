// composables/useConferenceData.js
export const useConferenceData = () => {
  return {
    getSpeakers: () => useApiFetch("/speakers"),

    getTestimonies: () => useApiFetch("/testimonies"),

    getAgenda: () => useApiFetch("/agenda"),

    getMerch: () => useApiFetch("/merch"),

    getMerchSettings: () => useApiFetch("/merch-settings"),

    // This fetches Venue, Dinner, Announcements, and Contact all at once
    getEventSettings: () => useApiFetch("/event-settings"),

    getFaqs: () => useApiFetch("/faq"),
  };
};
