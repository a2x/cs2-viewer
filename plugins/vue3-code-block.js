import { defineNuxtPlugin } from "#app";

import CodeBlock from "vue3-code-block";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("CodeBlock", CodeBlock);
});
