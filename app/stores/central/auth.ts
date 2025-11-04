// Endpoints
import { LOGIN_URL, AUTH_USER_URL, LOGOUT_URL } from "~/helpers/endpoints";

// Types
import type { User } from "~/types/others/user";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // States
    const user = ref<User | null>(null);
    const token = ref<string>("");

    // Hooks
    const { createFormData } = useStoreUtils();

    // Helpers
    function setToken(t: string) {
      token.value = t;

      const cookie = useCookie("auth-token");

      cookie.value = t;
    }

    // Functions
    const login = async (credentials: Record<string, any>) => {
      try {
        const api = useApi();

        const formData = createFormData(credentials);

        const response = await api.postData<{ token: string }>(
          LOGIN_URL,
          formData
        );

        setToken(response.token);

        if (response.token) {
          await getUser();

          const nuxtApp = useNuxtApp();

          const locale = nuxtApp.$i18n?.locale?.value || "ckb";

          return navigateTo({ name: `dashboard___${locale}` });
        }
      } catch (error) {
        throw error;
      }
    };

    const getUser = async () => {
      try {
        const api = useApi();

        const response = await api.getData<{ data: User }>(AUTH_USER_URL);

        user.value = response.data;
      } catch (error) {
        destroyTokenAndRedirectTo();
      }
    };

    const logout = async () => {
      try {
        const api = useApi();

        await api.deleteData(LOGOUT_URL);
      } catch (error) {
        // console.error("Logout error:", error);
      } finally {
        destroyTokenAndRedirectTo();
      }
    };

    async function destroyTokenAndRedirectTo() {
      setToken("");

      user.value = null;

      const cookie = useCookie("auth-token");

      cookie.value = null;

      const nuxtApp = useNuxtApp();

      const locale = nuxtApp.$i18n?.locale?.value || "ckb";

      return navigateTo({ name: `auth-login___${locale}` });
    }

    async function fetchInitialData() {
      const authCookie = useCookie("auth-token");

      if (token.value || authCookie.value) {
        await getUser();
      }
    }

    // Computed
    const isLoggedIn = computed(() => !!user.value);

    return {
      token,
      user,
      isLoggedIn,
      login,
      getUser,
      logout,
      destroyTokenAndRedirectTo,
      fetchInitialData,
    };
  },
  {
    persist: true,
  }
);
