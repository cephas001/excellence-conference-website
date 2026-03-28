// composables/useAdminMutations.js

const jsonRequest = (method, body) => ({
  method,
  body,
});

export const useAdminMutations = () => {
  return {
    // Speakers
    addSpeaker: (payload) =>
      useApiFetch("/speakers", jsonRequest("POST", payload)),
    updateSpeaker: (id, payload) =>
      useApiFetch(`/speakers/${id}`, jsonRequest("PUT", payload)),
    deleteSpeaker: (id) => useApiFetch(`/speakers/${id}`, { method: "DELETE" }),

    // Testimonies
    addTestimony: (payload) =>
      useApiFetch("/testimonies", jsonRequest("POST", payload)),
    updateTestimony: (id, payload) =>
      useApiFetch(`/testimonies/${id}`, jsonRequest("PUT", payload)),
    deleteTestimony: (id) =>
      useApiFetch(`/testimonies/${id}`, { method: "DELETE" }),

    // Agenda days
    addAgendaDay: (payload) =>
      useApiFetch("/agenda", jsonRequest("POST", payload)),
    updateAgendaDay: (id, payload) =>
      useApiFetch(`/agenda/${id}`, jsonRequest("PUT", payload)),
    deleteAgendaDay: (id) => useApiFetch(`/agenda/${id}`, { method: "DELETE" }),

    // Agenda items (embedded in agenda day)
    addAgendaItem: (dayId, payload) =>
      useApiFetch(`/agenda/${dayId}/items`, jsonRequest("POST", payload)),
    updateAgendaItem: (dayId, itemIndex, payload) =>
      useApiFetch(
        `/agenda/${dayId}/items/${itemIndex}`,
        jsonRequest("PUT", payload),
      ),
    deleteAgendaItem: (dayId, itemIndex) =>
      useApiFetch(`/agenda/${dayId}/items/${itemIndex}`, { method: "DELETE" }),

    // Merch items
    addMerchItem: (payload) =>
      useApiFetch("/merch", jsonRequest("POST", payload)),
    updateMerchItem: (id, payload) =>
      useApiFetch(`/merch/${id}`, jsonRequest("PUT", payload)),
    deleteMerchItem: (id) => useApiFetch(`/merch/${id}`, { method: "DELETE" }),

    // Merch settings (fixed doc)
    createMerchSettings: (payload) =>
      useApiFetch("/merch-settings", jsonRequest("POST", payload)),
    updateMerchSettings: (payload) =>
      useApiFetch("/merch-settings", jsonRequest("PUT", payload)),
    deleteMerchSettings: () =>
      useApiFetch("/merch-settings", { method: "DELETE" }),

    // Event settings (fixed docs)
    createDinnerSettings: (payload) =>
      useApiFetch("/event-settings/dinner", jsonRequest("POST", payload)),
    updateDinnerSettings: (payload) =>
      useApiFetch("/event-settings/dinner", jsonRequest("PUT", payload)),
    deleteDinnerSettings: () =>
      useApiFetch("/event-settings/dinner", { method: "DELETE" }),

    createVenueSettings: (payload) =>
      useApiFetch("/event-settings/venue", jsonRequest("POST", payload)),
    updateVenueSettings: (payload) =>
      useApiFetch("/event-settings/venue", jsonRequest("PUT", payload)),
    deleteVenueSettings: () =>
      useApiFetch("/event-settings/venue", { method: "DELETE" }),

    createAnnouncementSettings: (payload) =>
      useApiFetch("/event-settings/announcement", jsonRequest("POST", payload)),
    updateAnnouncementSettings: (payload) =>
      useApiFetch("/event-settings/announcement", jsonRequest("PUT", payload)),
    deleteAnnouncementSettings: () =>
      useApiFetch("/event-settings/announcement", { method: "DELETE" }),

    createContactSettings: (payload) =>
      useApiFetch("/event-settings/contact", jsonRequest("POST", payload)),
    updateContactSettings: (payload) =>
      useApiFetch("/event-settings/contact", jsonRequest("PUT", payload)),
    deleteContactSettings: () =>
      useApiFetch("/event-settings/contact", { method: "DELETE" }),

    // FAQ
    addFaq: (payload) => useApiFetch("/faq", jsonRequest("POST", payload)),
    updateFaq: (id, payload) =>
      useApiFetch(`/faq/${id}`, jsonRequest("PUT", payload)),
    deleteFaq: (id) => useApiFetch(`/faq/${id}`, { method: "DELETE" }),
  };
};
