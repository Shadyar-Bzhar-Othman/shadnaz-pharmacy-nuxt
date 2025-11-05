// Endpoints
import { USER_URL } from "~/helpers/endpoints";

// Types
import type { User, UserForm } from "~/types/others/user";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";
import type { FilterType } from "@/types/shared/data-table";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useUserStore = defineStore("users", () => {
  // States
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const originalUser = ref<User | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: UserForm = {
    city_id: 0,
    name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    img_path: undefined,
    is_active: 0,
    active_lang: "",
    role: 0,
  };

  // Pagination
  const form = ref<UserForm>({ ...defaultForm });

  const paginationInfo = ref<MetaInfo>({
    currentPage: 1,
    perPage: 12,
    totalPage: 1,
    total: 0,
  });

  // Hooks
  const api = useApi();
  const { t } = useI18n();
  const { isLoading } = useLoading();
  const loading = ref(false);
  const errors = ref<any>({});

  // Utils
  const filterStore = useFilterStore();
  const { actives, langs, roles } = useStoreDataUtils(t);
  const { handleError, createFormData } = useStoreUtils();
  const { success } = useToast();

  // Search
  const searchTerm = ref("");

  const search = (value: string) => {
    searchTerm.value = value;
    getUsers(1);
  };

  // Filters
  const queryString = ref("");

  const filters = computed<FilterType[]>(() => [
    {
      filterName: t("fields.city"),
      filterKey: "city_id",
      filterOptions: filterStore.cities,
    },
    {
      filterName: t("fields.role"),
      filterKey: "role",
      filterOptions: roles.value,
    },
    {
      filterName: t("fields.activeLang"),
      filterKey: "active_lang",
      filterOptions: langs.value,
    },
    {
      filterName: t("fields.active"),
      filterKey: "is_active",
      filterOptions: actives.value,
    },
  ]);

  function setFilters(value: string) {
    queryString.value = value;

    getUsers(1);
  }

  // Computed Properties
  const filteredUsers = computed(() =>
    users.value.map((user) => ({
      ...user,
    }))
  );

  const isEmpty = computed(() => !filteredUsers.value.length);

  const isFormCreateFilled = computed(() => {
    return (
      form.value.city_id !== 0 &&
      form.value.name.trim() !== "" &&
      form.value.username.trim() !== "" &&
      form.value.email.trim() !== "" &&
      form.value.phone_number.trim() !== "" &&
      form.value.password?.trim() !== "" &&
      form.value.active_lang.trim() !== "" &&
      form.value.role !== 0
    );
  });

  const isFormEditFilled = computed(() => {
    return (
      form.value.city_id !== 0 &&
      form.value.name.trim() !== "" &&
      form.value.username.trim() !== "" &&
      form.value.email.trim() !== "" &&
      form.value.phone_number.trim() !== "" &&
      form.value.active_lang.trim() !== "" &&
      form.value.role !== 0
    );
  });

  const isFormEditChanged = computed(() => {
    if (!currentUser.value) return false;

    return (
      (isFormEditFilled.value &&
        form.value.name.trim() !== originalUser.value?.name) ||
      form.value.city_id !== originalUser.value?.city_id ||
      form.value.username.trim() !== originalUser.value?.username ||
      form.value.email.trim() !== originalUser.value?.email ||
      form.value.phone_number.trim() !==
        (originalUser.value?.phone_number || "") ||
      form.value.is_active != originalUser.value?.is_active ||
      form.value.active_lang !== originalUser.value?.active_lang ||
      (form.value.img_path && form.value.img_path !== "") ||
      (form.value.password && form.value.password.trim() !== "") ||
      form.value.active_lang !== originalUser.value?.active_lang ||
      form.value.role !== originalUser.value?.role
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.user")} ${t(action)}`;

    success(`${message}!`);
  }

  function setUser(user: User | null) {
    if (!user) {
      resetForm();
    } else {
      currentUser.value = user;
      originalUser.value = user;

      form.value = {
        city_id: user.city_id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        password: "",
        img_path: "",
        is_active: user.is_active,
        active_lang: user.active_lang,
        role: user.role,
      };
    }
  }

  // Functions
  async function exportUsers() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${USER_URL}/export`, {
        method: "GET",
        responseType: "blob",
      })) as unknown;

      downloadBlob(response, "users.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getUsers(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        users: User[];
        meta: MetaResponse;
      }>(
        `${USER_URL}?page=${page}&search=${searchTerm.value}&${queryString.value}`
      );

      users.value = response.users;

      paginationInfo.value.currentPage = response.meta.current_page;
      paginationInfo.value.totalPage = response.meta.last_page;
      paginationInfo.value.perPage = response.meta.per_page;
      paginationInfo.value.total = response.meta.total;
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getUser(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: User }>(`${USER_URL}/${id}`);

      currentUser.value = response.data;

      setUser(currentUser.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createUser() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${USER_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editUser(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${USER_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteUser(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${USER_URL}/${id}`);

      notifySuccess("actions.deleted");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      deleting.value = false;
    }
  }

  function resetForm() {
    form.value = { ...defaultForm };
    currentUser.value = null;
    errors.value = {};
  }

  return {
    currentUser,
    filteredUsers,
    searchTerm,
    filters,
    paginationInfo,
    form,
    loading,
    errors,
    creating,
    editing,
    deleting,
    isEmpty,
    isFormCreateFilled,
    isFormEditFilled,
    isFormEditChanged,
    search,
    setFilters,
    setUser,
    exportUsers,
    getUsers,
    getUser,
    createUser,
    editUser,
    deleteUser,
    resetForm,
  };
});
