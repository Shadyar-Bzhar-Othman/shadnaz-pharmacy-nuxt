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
              @export="exportBrands"
              @add="navigateToAddBrand"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="brands"
          :searchTerm="searchTerm"
          @search="search"
        >
          <template #body>
            <TableBase
              tableId="brands"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredBrands"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditBrand"
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

// Types
import type { Brand } from "~/types/others/brand";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([{ label: t("models.brands"), icon: "tabler:brand-tinder-filled" }]);

// Hooks
const { navigate } = useLocalizedNavigate();

// Stores
const brandStore = useBrandStore();

const { searchTerm, paginationInfo, filteredBrands, isEmpty } =
  storeToRefs(brandStore);

const { search, exportBrands, getBrands, setBrand } = brandStore;

// Lifecycle Hooks
onActivated(() => {
  fetchBrands();
});

// Functions
const fetchBrands = (page: number = paginationInfo.value.currentPage) => {
  getBrands(page);
};

const navigateToAddBrand = () => {
  setBrand(null);

  navigate("manage-products-brands-store");
};

const navigateToEditBrand = (brand: Brand) => {
  setBrand(brand);

  navigate("manage-products-brands-id-edit", { id: brand.id });
};

const handlePageUpdate = (page: number) => {
  fetchBrands(page);
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
