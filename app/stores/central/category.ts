// Endpoints
import { CATEGORY_URL } from "~/helpers/endpoints";

// Categories
import type { Category, CategoryForm } from "~/types/others/category";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useCategoryStore = defineStore("categories", () => {
  // States
  const categories = ref<Category[]>([]);
  const currentCategory = ref<Category | null>(null);
  const originalCategory = ref<Category | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: CategoryForm = {
    name: "",
  };

  // Pagination
  const form = ref<CategoryForm>({ ...defaultForm });

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
  const { handleError, createFormData } = useStoreUtils();
  const { success } = useToast();

  // Search
  const searchTerm = ref("");

  const search = (value: string) => {
    searchTerm.value = value;
    getCategories(1);
  };

  // Computed Properties
  const filteredCategories = computed(() =>
    categories.value.map((category) => ({
      ...category,
    }))
  );

  const isEmpty = computed(() => !filteredCategories.value.length);

  const isFormCreateFilled = computed(() => {
    return form.value.name.trim() !== "";
  });

  const isFormEditFilled = computed(() => {
    return form.value.name.trim() !== "";
  });

  const isFormEditChanged = computed(() => {
    if (!currentCategory.value) return false;

    return (
      isFormEditFilled.value &&
      (form.value.name.trim() !== originalCategory.value?.name)
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.category")} ${t(action)}`;

    success(`${message}!`);
  }

  function setCategory(category: Category | null) {
    if (!category) {
      resetForm();
    } else {
      currentCategory.value = category;
      originalCategory.value = category;

      form.value = {
        name: category.name,
      };
    }
  }

  // Functions
  async function exportCategories() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${CATEGORY_URL}/export`, {
        method: "GET",
        responseCategory: "blob",
      })) as unknown;

      downloadBlob(response, "categories.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getCategories(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        categories: Category[];
        meta: MetaResponse;
      }>(`${CATEGORY_URL}?page=${page}&search=${searchTerm.value}`);

      categories.value = response.categories;

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

  async function getCategory(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: Category }>(
        `${CATEGORY_URL}/${id}`
      );

      currentCategory.value = response.data;

      setCategory(currentCategory.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createCategory() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${CATEGORY_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editCategory(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${CATEGORY_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteCategory(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${CATEGORY_URL}/${id}`);

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
    currentCategory.value = null;
    errors.value = {};
  }

  return {
    currentCategory,
    filteredCategories,
    searchTerm,
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
    setCategory,
    exportCategories,
    getCategories,
    getCategory,
    createCategory,
    editCategory,
    deleteCategory,
    resetForm,
  };
});
