// composables/useAdminMutations.js
import { useRuntimeConfig } from "#app";

const jsonRequest = (method, body) => ({
  method,
  body,
});

export const useAdminMutations = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  return {
    // Speakers
    addSpeaker: (payload) =>
      $fetch(`${apiBase}/speakers`, jsonRequest("POST", payload)),
    updateSpeaker: (id, payload) =>
      $fetch(`${apiBase}/speakers/${id}`, jsonRequest("PUT", payload)),
    deleteSpeaker: (id) =>
      $fetch(`${apiBase}/speakers/${id}`, { method: "DELETE" }),

    // Testimonies
    addTestimony: (payload) =>
      $fetch(`${apiBase}/testimonies`, jsonRequest("POST", payload)),
    updateTestimony: (id, payload) =>
      $fetch(`${apiBase}/testimonies/${id}`, jsonRequest("PUT", payload)),
    deleteTestimony: (id) =>
      $fetch(`${apiBase}/testimonies/${id}`, { method: "DELETE" }),

    // Agenda days
    addAgendaDay: (payload) =>
      $fetch(`${apiBase}/agenda`, jsonRequest("POST", payload)),
    updateAgendaDay: (id, payload) =>
      $fetch(`${apiBase}/agenda/${id}`, jsonRequest("PUT", payload)),
    deleteAgendaDay: (id) =>
      $fetch(`${apiBase}/agenda/${id}`, { method: "DELETE" }),

    // Agenda items (embedded in agenda day)
    addAgendaItem: (dayId, payload) =>
      $fetch(`${apiBase}/agenda/${dayId}/items`, jsonRequest("POST", payload)),
    updateAgendaItem: (dayId, itemIndex, payload) =>
      $fetch(
        `${apiBase}/agenda/${dayId}/items/${itemIndex}`,
        jsonRequest("PUT", payload),
      ),
    deleteAgendaItem: (dayId, itemIndex) =>
      $fetch(`${apiBase}/agenda/${dayId}/items/${itemIndex}`, {
        method: "DELETE",
      }),

    // Merch items
    addMerchItem: (payload) =>
      $fetch(`${apiBase}/merch`, jsonRequest("POST", payload)),
    updateMerchItem: (id, payload) =>
      $fetch(`${apiBase}/merch/${id}`, jsonRequest("PUT", payload)),
    deleteMerchItem: (id) =>
      $fetch(`${apiBase}/merch/${id}`, { method: "DELETE" }),

    // Merch settings (fixed doc)
    createMerchSettings: (payload) =>
      $fetch(`${apiBase}/merch-settings`, jsonRequest("POST", payload)),
    updateMerchSettings: (payload) =>
      $fetch(`${apiBase}/merch-settings`, jsonRequest("PUT", payload)),
    deleteMerchSettings: () =>
      $fetch(`${apiBase}/merch-settings`, { method: "DELETE" }),

    // Event settings (fixed docs)
    createDinnerSettings: (payload) =>
      $fetch(`${apiBase}/event-settings/dinner`, jsonRequest("POST", payload)),
    updateDinnerSettings: (payload) =>
      $fetch(`${apiBase}/event-settings/dinner`, jsonRequest("PUT", payload)),
    deleteDinnerSettings: () =>
      $fetch(`${apiBase}/event-settings/dinner`, { method: "DELETE" }),

    createVenueSettings: (payload) =>
      $fetch(`${apiBase}/event-settings/venue`, jsonRequest("POST", payload)),
    updateVenueSettings: (payload) =>
      $fetch(`${apiBase}/event-settings/venue`, jsonRequest("PUT", payload)),
    deleteVenueSettings: () =>
      $fetch(`${apiBase}/event-settings/venue`, { method: "DELETE" }),

    createAnnouncementSettings: (payload) =>
      $fetch(
        `${apiBase}/event-settings/announcement`,
        jsonRequest("POST", payload),
      ),
    updateAnnouncementSettings: (payload) =>
      $fetch(
        `${apiBase}/event-settings/announcement`,
        jsonRequest("PUT", payload),
      ),
    deleteAnnouncementSettings: () =>
      $fetch(`${apiBase}/event-settings/announcement`, { method: "DELETE" }),

    createContactSettings: (payload) =>
      $fetch(`${apiBase}/event-settings/contact`, jsonRequest("POST", payload)),
    updateContactSettings: (payload) =>
      $fetch(`${apiBase}/event-settings/contact`, jsonRequest("PUT", payload)),
    deleteContactSettings: () =>
      $fetch(`${apiBase}/event-settings/contact`, { method: "DELETE" }),

    // FAQ
    addFaq: (payload) => $fetch(`${apiBase}/faq`, jsonRequest("POST", payload)),
    updateFaq: (id, payload) =>
      $fetch(`${apiBase}/faq/${id}`, jsonRequest("PUT", payload)),
    deleteFaq: (id) => $fetch(`${apiBase}/faq/${id}`, { method: "DELETE" }),
  };
};
