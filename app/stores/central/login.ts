// Types
import type { LoginForm } from "~/types/others/auth";

export const useLoginStore = defineStore("login", () => {
  // Form
  const form = ref<LoginForm>({
    email: "",
    password: "",
  });

  const loading = ref(false);
  const errors = ref<any>({});

  // Hooks
  const { handleError } = useStoreUtils();
  const authStore = useAuthStore();

  // Computed Properties
  const isFormFilled = computed(() => {
    return form.value.email.trim() !== "" && form.value.password.trim() !== "";
  });

  // Functions
  const handleSubmit = async () => {
    loading.value = true;
    errors.value = {};

    const credentials = {
      email: form.value.email,
      password: form.value.password,
    };

    try {
      await authStore.login(credentials);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;

      form.value.password = "";
    }
  };

  // Return
  return {
    form,
    loading,
    errors,
    isFormFilled,
    handleSubmit,
  };
});
