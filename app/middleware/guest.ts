export default defineNuxtRouteMiddleware((to, from) => {
  // Hooks
  const authStore = useAuthStore();

  if (authStore.token && authStore.isLoggedIn) {
    const nuxtApp = useNuxtApp();

    const locale = nuxtApp.$i18n?.locale?.value || "ckb";

    return navigateTo({ name: `dashboard___${locale}` });
  }

  return true;
});
