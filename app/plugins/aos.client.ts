// ~/plugins/aos.client.ts
import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin((nuxtApp) => {
  AOS.init();
});
