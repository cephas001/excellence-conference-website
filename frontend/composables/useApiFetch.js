// composables/useApiFetch.js

export function useApiFetch(request, options) {
  const config = useRuntimeConfig();

  return useFetch(request, {
    baseURL: config.public.apiBase,

    ...options,

    // Optional: Add global interceptors here later if needed
    onResponseError({ response }) {
      console.error(`[API Error] ${request}:`, response._data);
    },
  });
}
