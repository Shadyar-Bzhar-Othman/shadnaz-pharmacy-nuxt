// Endpoints
import { BRAND_URL } from "~/helpers/endpoints";

// Brands
import type { Brand, BrandForm } from "~/types/others/brand";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useBrandStore = defineStore("brands", () => {
  // States
  const brands = ref<Brand[]>([]);
  const currentBrand = ref<Brand | null>(null);
  const originalBrand = ref<Brand | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: BrandForm = {
    name: "",
  };

  // Pagination
  const form = ref<BrandForm>({ ...defaultForm });

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
    getBrands(1);
  };

  // Computed Properties
  const filteredBrands = computed(() =>
    brands.value.map((brand) => ({
      ...brand,
    }))
  );

  const isEmpty = computed(() => !filteredBrands.value.length);

  const isFormCreateFilled = computed(() => {
    return form.value.name.trim() !== "";
  });

  const isFormEditFilled = computed(() => {
    return form.value.name.trim() !== "";
  });

  const isFormEditChanged = computed(() => {
    if (!currentBrand.value) return false;

    return (
      isFormEditFilled.value &&
      form.value.name.trim() !== originalBrand.value?.name
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.brand")} ${t(action)}`;

    success(`${message}!`);
  }

  function setBrand(brand: Brand | null) {
    if (!brand) {
      resetForm();
    } else {
      currentBrand.value = brand;
      originalBrand.value = brand;

      form.value = {
        name: brand.name,
      };
    }
  }

  // Functions
  async function exportBrands() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${BRAND_URL}/export`, {
        method: "GET",
        responseBrand: "blob",
      })) as unknown;

      downloadBlob(response, "brands.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getBrands(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        brands: Brand[];
        meta: MetaResponse;
      }>(`${BRAND_URL}?page=${page}&search=${searchTerm.value}`);

      brands.value = response.brands;

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

  async function getBrand(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: Brand }>(`${BRAND_URL}/${id}`);

      currentBrand.value = response.data;

      setBrand(currentBrand.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createBrand() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${BRAND_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editBrand(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${BRAND_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteBrand(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${BRAND_URL}/${id}`);

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
    currentBrand.value = null;
    errors.value = {};
  }

  return {
    currentBrand,
    filteredBrands,
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
    setBrand,
    exportBrands,
    getBrands,
    getBrand,
    createBrand,
    editBrand,
    deleteBrand,
    resetForm,
  };
});
