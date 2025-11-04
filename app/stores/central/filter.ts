// Endpoints
import { CITY_URL, TYPE_URL } from "~/helpers/endpoints";

// Types
import type { City } from "~/types/others/city";

interface SelectOption {
  key: number;
  value: string;
}

export const useFilterStore = defineStore("filters", () => {
  // States
  const cities = ref<SelectOption[]>([]);
  const allCities = ref<SelectOption[]>([]);

  const errors = ref<any>({});

  // Locale
  const { t } = useI18n();
  const defaultAll = computed(() => t("values.all"));

  // Hooks
  const api = useApi();

  // Utils
  const { isLoading } = useLoading();
  const { handleError } = useStoreUtils();

  // Functions
  async function getCities() {
    isLoading.value = true;

    try {
      const response = await api.getData<{ cities: City[] }>(
        `${CITY_URL}?all=true`
      );

      cities.value = response.cities.map((city) => ({
        key: city.id,
        value: city.name,
      }));

      allCities.value = [{ key: 0, value: defaultAll.value }, ...cities.value];
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  function getCity(id: number) {
    return cities.value.find((city) => city.key === id);
  }

  // Watch for translation changes
  watch(defaultAll, (newVal) => {
    if (allCities.value.length && allCities?.value[0]?.key === 0) {
      allCities.value[0].value = newVal;
    }
  });

  return {
    cities,
    allCities,
    getCities,
    getCity,
  };
});
