// plugins/api.client.ts
import type { FetchOptions } from "ofetch";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Hooks
  const authStore = useAuthStore();

  // Global fetch options
  const defaultOptions: FetchOptions = {
    baseURL: config.public.baseUrl,
    headers: {
      Accept: "application/json, image/*",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  };

  // Create custom $fetch instance
  const $api = $fetch.create({
    ...defaultOptions,
    onRequest({ request, options }) {
      const storeToken = authStore.token;

      const token = storeToken || useCookie("auth-token").value;

      const userLocale = useCookie("user-locale");

      // Use top-level composables
      if (token) {
        if (options.headers instanceof Headers) {
          options.headers.set("Authorization", `Bearer ${token}`);
        } else {
          const headers: Record<string, string> = {
            ...(options.headers && typeof options.headers === "object"
              ? (options.headers as Record<string, string>)
              : {}),
            Authorization: `Bearer ${token}`,
            "X-Language": userLocale.value || "ckb",
          };
          options.headers = headers as any;
        }
      }

      if (options.headers instanceof Headers) {
        options.headers.set("X-Language", userLocale.value || "ckb");
      } else {
        const headers: Record<string, string> = {
          ...(options.headers && typeof options.headers === "object"
            ? (options.headers as Record<string, string>)
            : {}),
          "X-Language": userLocale.value || "ckb",
        };
        options.headers = headers as any;
      }

      // FormData handling
      if (options.body instanceof FormData) {
        if (options.headers instanceof Headers) {
          options.headers.delete("Content-Type");
        } else {
          const headers = options.headers as Record<string, string>;

          delete headers["Content-Type"];
        }
      }
    },
    async onResponseError({ request, response }) {
      // Use top-level authStore
      switch (response.status) {
        case 401:
          await authStore.destroyTokenAndRedirectTo();

          break;
        case 403:
          await authStore.destroyTokenAndRedirectTo();

          showError({
            statusCode: 403,
            statusMessage:
              "Forbidden - " +
              (response.statusText ? `: ${response.statusText}` : ""),
          });
          break;
        case 500:
          showError({
            statusCode: 500,
            statusMessage:
              "Internal Server Error - " +
              (response.statusText ? `: ${response.statusText}` : ""),
          });
          break;
        case 418:
          showError({
            statusCode: 418,
            statusMessage:
              "Store Does Not Exist - " +
              (response.statusText ? `: ${response.statusText}` : ""),
          });
          break;
        case 417:
          showError({
            statusCode: 417,
            statusMessage:
              "Precondition Failed - " +
              (response.statusText ? `: ${response.statusText}` : ""),
          });
          break;
        case 404:
          showError({
            statusCode: 404,
            statusMessage:
              "Resource Not Found - " +
              (response.statusText ? `: ${response.statusText}` : ""),
          });
          break;
      }
    },
  });

  // Provide the custom $api instance
  return {
    provide: {
      api: $api,
    },
  };
});
