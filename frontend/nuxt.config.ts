export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },

  // 1. Add the module here
  modules: [
    "@nuxt/icon",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxt/image",
    "@vite-pwa/nuxt",
  ],

  // 2. Add the PWA configuration block
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Excellence Conference 2026",
      short_name: "EC 2026", // This is what shows under the app icon on the home screen
      theme_color: "#030712", // Your theme-base color
      background_color: "#030712",
      display: "standalone", // This hides the browser URL bar when opened as an app!
      orientation: "portrait",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable", // Good for Android adaptive icons
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true, // Triggers the browser's native install prompt
    },
    devOptions: {
      enabled: true, // Let's you test the PWA features locally
      type: "module",
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:5000/api",
    },
  },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      meta: [
        { name: "theme-color", content: "#030712" },
        { name: "color-scheme", content: "dark" },
      ],
    },
  },

  routeRules: {
    // Tell Nuxt to proxy all requests from /api to your backend
    "/api-proxy/**": {
      proxy: "https://ec-review-system-backend.onrender.com/api/**",
    },
  },
});
