// Endpoints
import { SUB_CATEGORY_URL } from "~/helpers/endpoints";

// Sub Categories
import type { SubCategory, SubCategoryForm } from "~/types/others/sub-category";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";
import type { FilterType } from "@/types/shared/data-table";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useSubCategoryStore = defineStore("subCategories", () => {
  // States
  const subCategories = ref<SubCategory[]>([]);
  const currentSubCategory = ref<SubCategory | null>(null);
  const originalSubCategory = ref<SubCategory | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: SubCategoryForm = {
    category_id: 0,
    name: "",
  };

  // Pagination
  const form = ref<SubCategoryForm>({ ...defaultForm });

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
  const { handleError, createFormData } = useStoreUtils();
  const { success } = useToast();

  // Search
  const searchTerm = ref("");

  const search = (value: string) => {
    searchTerm.value = value;

    getSubCategories(1);
  };

  // Filters
  const queryString = ref("");

  const filters = computed<FilterType[]>(() => [
    {
      filterName: t("fields.category"),
      filterKey: "category_id",
      filterOptions: filterStore.categories,
    },
  ]);

  function setFilters(value: string) {
    queryString.value = value;

    getSubCategories(1);
  }

  // Computed Properties
  const filteredSubCategories = computed(() =>
    subCategories.value.map((subCategory) => ({
      ...subCategory,
    }))
  );

  const isEmpty = computed(() => !filteredSubCategories.value.length);

  const isFormCreateFilled = computed(() => {
    return form.value.category_id !== 0 && form.value.name.trim() !== "";
  });

  const isFormEditFilled = computed(() => {
    return form.value.category_id !== 0 && form.value.name.trim() !== "";
  });

  const isFormEditChanged = computed(() => {
    if (!currentSubCategory.value) return false;

    return (
      isFormEditFilled.value &&
      (form.value.name.trim() !== originalSubCategory.value?.name ||
        form.value.category_id !== originalSubCategory.value?.category_id)
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.subCategory")} ${t(action)}`;

    success(`${message}!`);
  }

  function setSubCategory(subCategory: SubCategory | null) {
    if (!subCategory) {
      resetForm();
    } else {
      currentSubCategory.value = subCategory;
      originalSubCategory.value = subCategory;

      form.value = {
        category_id: subCategory.category_id,
        name: subCategory.name,
      };
    }
  }

  // Functions
  async function exportSubCategories() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${SUB_CATEGORY_URL}/export`, {
        method: "GET",
        responseSubCategory: "blob",
      })) as unknown;

      downloadBlob(response, "subCategories.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getSubCategories(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        subCategories: SubCategory[];
        meta: MetaResponse;
      }>(
        `${SUB_CATEGORY_URL}?page=${page}&search=${searchTerm.value}&${queryString.value}`
      );

      subCategories.value = response.subCategories;

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

  async function getSubCategory(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: SubCategory }>(
        `${SUB_CATEGORY_URL}/${id}`
      );

      currentSubCategory.value = response.data;

      setSubCategory(currentSubCategory.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createSubCategory() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${SUB_CATEGORY_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editSubCategory(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${SUB_CATEGORY_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteSubCategory(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${SUB_CATEGORY_URL}/${id}`);

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
    currentSubCategory.value = null;
    errors.value = {};
  }

  return {
    currentSubCategory,
    filteredSubCategories,
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
    setSubCategory,
    exportSubCategories,
    getSubCategories,
    getSubCategory,
    createSubCategory,
    editSubCategory,
    deleteSubCategory,
    resetForm,
  };
});
