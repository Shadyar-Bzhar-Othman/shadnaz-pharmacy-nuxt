// Endpoints
import { CITY_URL } from "~/helpers/endpoints";

// Cities
import type { City, CityForm } from "~/types/others/city";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useCityStore = defineStore("cities", () => {
  // States
  const cities = ref<City[]>([]);
  const currentCity = ref<City | null>(null);
  const originalCity = ref<City | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: CityForm = {
    name: "",
  };

  // Pagination
  const form = ref<CityForm>({ ...defaultForm });

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
    getCities(1);
  };

  // Computed Properties
  const filteredCities = computed(() =>
    cities.value.map((city) => ({
      ...city,
    }))
  );

  const isEmpty = computed(() => !filteredCities.value.length);

  const isFormCreateFilled = computed(() => {
    return form.value.name.trim() !== "";
  });

  const isFormEditFilled = computed(() => {
    return form.value.name.trim() !== "";
  });

  const isFormEditChanged = computed(() => {
    if (!currentCity.value) return false;

    return (
      isFormEditFilled.value &&
      form.value.name.trim() !== originalCity.value?.name
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.city")} ${t(action)}`;

    success(`${message}!`);
  }

  function setCity(city: City | null) {
    if (!city) {
      resetForm();
    } else {
      currentCity.value = city;
      originalCity.value = city;

      form.value = {
        name: city.name,
      };
    }
  }

  // Functions
  async function exportCities() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${CITY_URL}/export`, {
        method: "GET",
        responseCity: "blob",
      })) as unknown;

      downloadBlob(response, "cities.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getCities(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        cities: City[];
        meta: MetaResponse;
      }>(`${CITY_URL}?page=${page}&search=${searchTerm.value}`);

      cities.value = response.cities;

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

  async function getCity(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: City }>(`${CITY_URL}/${id}`);

      currentCity.value = response.data;

      setCity(currentCity.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createCity() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${CITY_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editCity(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${CITY_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteCity(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${CITY_URL}/${id}`);

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
    currentCity.value = null;
    errors.value = {};
  }

  return {
    currentCity,
    filteredCities,
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
    setCity,
    exportCities,
    getCities,
    getCity,
    createCity,
    editCity,
    deleteCity,
    resetForm,
  };
});
