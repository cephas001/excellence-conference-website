// plugins/api-interceptor.js
import { defineNuxtPlugin, useCookie } from "#app";
import { useErrorModal } from "~/composables/useErrorModal";

export default defineNuxtPlugin((nuxtApp) => {
  const customFetch = $fetch.create({
    onRequest({ request, options }) {
      // Safely grab the token (Works in Vue components)
      const token = useCookie("ec_token").value;

      if (token) {
        // The bulletproof way to modify headers in Nuxt/ofetch
        // We wrap existing headers in a native Headers object, then use .set()
        const headers = new Headers(options.headers || {});
        headers.set("authorization", `Bearer ${token}`);

        // Reassign the properly formatted headers back to the options
        options.headers = headers;
      }
    },

    onResponseError({ response }) {
      const status = response.status;
      const data = response._data;

      if (status === 403 || status === 401) {
        const { triggerError } = useErrorModal();
        const backendMessage =
          data?.error || "You do not have the required permissions.";
        triggerError(
          backendMessage,
          status === 401 ? "Session Expired" : "Access Denied",
        );

        // NEW: Tag the response so local catch blocks know to ignore it!
        response._handledGlobally = true;
      }
    },
  });

  globalThis.$fetch = customFetch;
});
