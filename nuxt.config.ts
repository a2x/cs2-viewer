export default defineNuxtConfig({
  app: {
    baseURL: "/cs2-viewer/",
    buildAssetsDir: "assets",
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "CS2 Viewer",
    },
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/html-validator",
    "@nuxtjs/robots",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-icon",
  ],
  plugins: [{ src: "~/plugins/vue3-code-block.js" }],
});
