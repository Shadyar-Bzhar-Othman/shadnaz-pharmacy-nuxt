// Endpoints
import {
  CATEGORY_URL,
  SUB_CATEGORY_URL,
  CITY_URL,
  BRAND_URL,
} from "~/helpers/endpoints";

// Types
import type { Category } from "~/types/others/category";
import type { SubCategory } from "~/types/others/sub-category";
import type { City } from "~/types/others/city";
import type { Brand } from "~/types/others/brand";

interface SelectOption {
  key: number;
  value: string;
}

export const useFilterStore = defineStore("filters", () => {
  // States
  const categories = ref<SelectOption[]>([]);
  const allCategories = ref<SelectOption[]>([]);
  const subCategories = ref<SelectOption[]>([]);
  const allSubCategories = ref<SelectOption[]>([]);
  const cities = ref<SelectOption[]>([]);
  const allCities = ref<SelectOption[]>([]);
  const brands = ref<SelectOption[]>([]);
  const allBrands = ref<SelectOption[]>([]);

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
  async function getCategories() {
    isLoading.value = true;

    try {
      const response = await api.getData<{ categories: Category[] }>(
        `${CATEGORY_URL}?all=true`
      );

      categories.value = response.categories.map((category) => ({
        key: category.id,
        value: category.name,
      }));

      allCategories.value = [
        { key: 0, value: defaultAll.value },
        ...categories.value,
      ];
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  function getCategory(id: number) {
    return categories.value.find((category) => category.key === id);
  }

  async function getSubCategories() {
    isLoading.value = true;

    try {
      const response = await api.getData<{ subCategories: SubCategory[] }>(
        `${SUB_CATEGORY_URL}?all=true`
      );

      subCategories.value = response.subCategories.map((subCategory) => ({
        key: subCategory.id,
        value: subCategory.name,
      }));

      allSubCategories.value = [
        { key: 0, value: defaultAll.value },
        ...subCategories.value,
      ];
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  function getSubCategory(id: number) {
    return subCategories.value.find((subCategory) => subCategory.key === id);
  }

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

  async function getBrands() {
    isLoading.value = true;

    try {
      const response = await api.getData<{ brands: Brand[] }>(
        `${BRAND_URL}?all=true`
      );

      brands.value = response.brands.map((brand) => ({
        key: brand.id,
        value: brand.name,
      }));

      allBrands.value = [{ key: 0, value: defaultAll.value }, ...brands.value];
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  function getBrand(id: number) {
    return brands.value.find((brand) => brand.key === id);
  }

  // Watch for translation changes
  watch(defaultAll, (newVal) => {
    if (allCategories.value.length && allCategories?.value[0]?.key === 0) {
      allCategories.value[0].value = newVal;
    }
    if (
      allSubCategories.value.length &&
      allSubCategories?.value[0]?.key === 0
    ) {
      allSubCategories.value[0].value = newVal;
    }
    if (allCities.value.length && allCities?.value[0]?.key === 0) {
      allCities.value[0].value = newVal;
    }
    if (allBrands.value.length && allBrands?.value[0]?.key === 0) {
      allBrands.value[0].value = newVal;
    }
  });

  return {
    categories,
    allCategories,
    subCategories,
    allSubCategories,
    cities,
    allCities,
    brands,
    allBrands,
    getCategories,
    getCategory,
    getSubCategories,
    getSubCategory,
    getCities,
    getCity,
    getBrands,
    getBrand,
  };
});
