<template>
  <client-only>
    <BasePageWrapper>
      <!-- Header -->
      <template #header>
        <BasePageHeader>
          <template #breadcrumb>
            <BaseBreadcrumb :items="items" />
          </template>

          <template #actions>
            <BasePageTopActionButtons
              @export="exportCities"
              @add="navigateToAddCity"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="cities"
          :searchTerm="searchTerm"
          @search="search"
        >
          <template #body>
            <TableBase
              tableId="cities"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredCities"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditCity"
            />
          </template>
        </TableWrapper>
      </template>

      <!-- Pagination -->
      <template #pagination>
        <BasePagination
          :currentPage="paginationInfo.currentPage"
          :totalPages="paginationInfo.totalPage"
          @update:currentPage="handlePageUpdate"
        />
      </template>
    </BasePageWrapper>
  </client-only>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "dashboard-layout",
  ssr: false,
  middleware: ["auth"],
});

// Cities
import type { City } from "~/types/others/city";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([{ label: t("models.cities"), icon: "solar:city-bold" }]);

// Hooks
const { navigate } = useLocalizedNavigate();

// Stores
const cityStore = useCityStore();

const { searchTerm, paginationInfo, filteredCities, isEmpty } =
  storeToRefs(cityStore);

const { search, exportCities, getCities, setCity } = cityStore;

// Lifecycle Hooks
onActivated(() => {
  fetchCities();
});

// Functions
const fetchCities = (page: number = paginationInfo.value.currentPage) => {
  getCities(page);
};

const navigateToAddCity = () => {
  setCity(null);

  navigate("settings-cities-store");
};

const navigateToEditCity = (city: City) => {
  setCity(city);

  navigate("settings-cities-id-edit", { id: city.id });
};

const handlePageUpdate = (page: number) => {
  fetchCities(page);
};

// Table Config
const tableConfig: ComputedRef<TableConfig> = computed(() => ({
  columns: [
    {
      key: "id",
      label: "#",
    },
    {
      key: "name",
      label: t("fields.name"),
    },
    {
      key: "created_at",
      label: t("fields.createdAt"),
    },
    {
      key: "updated_at",
      label: t("fields.updatedAt"),
    },
  ],
}));
</script>
