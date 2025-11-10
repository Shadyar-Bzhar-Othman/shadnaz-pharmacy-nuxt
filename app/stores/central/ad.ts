// Endpoints
import { AD_URL } from "~/helpers/endpoints";

// Types
import type { Ad, AdForm } from "~/types/others/ad";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";
import type { FilterType } from "@/types/shared/data-table";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useAdStore = defineStore("ads", () => {
  // States
  const ads = ref<Ad[]>([]);
  const currentAd = ref<Ad | null>(null);
  const originalAd = ref<Ad | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: AdForm = {
    title: "",
    img_path: undefined,
    is_active: 0,
  };

  // Pagination
  const form = ref<AdForm>({ ...defaultForm });

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
  const { actives } = useStoreDataUtils(t);
  const { handleError, createFormData } = useStoreUtils();
  const { success } = useToast();

  // Search
  const searchTerm = ref("");

  const search = (value: string) => {
    searchTerm.value = value;
    getAds(1);
  };

  // Filters
  const queryString = ref("");

  const filters = computed<FilterType[]>(() => [
    {
      filterName: t("fields.active"),
      filterKey: "is_active",
      filterOptions: actives.value,
    },
  ]);

  function setFilters(value: string) {
    queryString.value = value;

    getAds(1);
  }

  // Computed Properties
  const filteredAds = computed(() =>
    ads.value.map((ad) => ({
      ...ad,
    }))
  );

  const isEmpty = computed(() => !filteredAds.value.length);

  const isFormCreateFilled = computed(() => {
    return form.value.title.trim() !== "" && form.value.img_path !== undefined;
  });

  const isFormEditFilled = computed(() => {
    return form.value.title.trim() !== "";
  });

  const isFormEditChanged = computed(() => {
    if (!currentAd.value) return false;

    return (
      isFormEditFilled.value &&
      (form.value.title.trim() !== originalAd.value?.title ||
        form.value.is_active != originalAd.value?.is_active ||
        (form.value.img_path && form.value.img_path !== ""))
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.ad")} ${t(action)}`;

    success(`${message}!`);
  }

  function setAd(ad: Ad | null) {
    if (!ad) {
      resetForm();
    } else {
      currentAd.value = ad;
      originalAd.value = ad;

      form.value = {
        title: ad.title,
        img_path: "",
        is_active: ad.is_active,
      };
    }
  }

  // Functions
  async function exportAds() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${AD_URL}/export`, {
        method: "GET",
        responseType: "blob",
      })) as unknown;

      downloadBlob(response, "ads.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getAds(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        ads: Ad[];
        meta: MetaResponse;
      }>(
        `${AD_URL}?page=${page}&search=${searchTerm.value}&${queryString.value}`
      );

      ads.value = response.ads;

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

  async function getAd(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: Ad }>(`${AD_URL}/${id}`);

      currentAd.value = response.data;

      setAd(currentAd.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createAd() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${AD_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editAd(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${AD_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteAd(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${AD_URL}/${id}`);

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
    currentAd.value = null;
    errors.value = {};
  }

  return {
    currentAd,
    filteredAds,
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
    setAd,
    exportAds,
    getAds,
    getAd,
    createAd,
    editAd,
    deleteAd,
    resetForm,
  };
});
