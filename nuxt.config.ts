// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000/api",
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || "1.0.0",
    },
  },
  app: {
    head: {
      title: "Shadnaz Pharmacy",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
      ],
    },
  },
  css: [
    "~/assets/css/main.css",
    "~/assets/css/fonts.css",
    "~/assets/css/tailwind.css",
  ],
  i18n: {
    defaultLocale: "ckb",
    strategy: "prefix",
    customRoutes: "config",
    locales: [
      { code: "ckb", name: "کوردی", file: "ckb.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "ar", name: "العربية", file: "ar.json" },
    ],
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-mapbox",
    "nuxt-marquee",
    "nuxt-aos",
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  mapbox: {
    accessToken: process.env.NUXT_MAPBOX_KEY || "",
  },
  imports: {
    dirs: ["stores/**"],
  },
  aos: {
    duration: 1000,
    once: true,
    mirror: true,
  },
});
