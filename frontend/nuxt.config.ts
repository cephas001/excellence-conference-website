// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/ui", "@pinia/nuxt", "@nuxt/image"],
  runtimeConfig: {
    public: {
      // Nuxt automatically overrides this with NUXT_PUBLIC_API_BASE_URL from your .env or Vercel!
      apiBaseUrl: "http://localhost:5000/api",
    },
  },
});
