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
              @export="exportSubCategories"
              @add="navigateToAddSubCategory"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="subCategories"
          :searchTerm="searchTerm"
          :filters="filters"
          @search="search"
          @setFilters="setFilters"
        >
          <template #body>
            <TableBase
              tableId="subCategories"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredSubCategories"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditSubCategory"
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
import type { SubCategory } from "~/types/others/sub-category";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  { label: t("models.subCategories"), icon: "iconamoon:category-fill" },
]);

// Hooks
const { navigate } = useLocalizedNavigate();

// Stores
const filterStore = useFilterStore();
const subCategoryStore = useSubCategoryStore();

const { filters, searchTerm, paginationInfo, filteredSubCategories, isEmpty } =
  storeToRefs(subCategoryStore);

const {
  setFilters,
  search,
  exportSubCategories,
  getSubCategories,
  setSubCategory,
} = subCategoryStore;

// Lifecycle Hooks
onActivated(() => {
  fetchSubCategories();

  filterStore.getCategories();
});

// Functions
const fetchSubCategories = (
  page: number = paginationInfo.value.currentPage
) => {
  getSubCategories(page);
};

const navigateToAddSubCategory = () => {
  setSubCategory(null);

  navigate("manage-products-sub-categories-store");
};

const navigateToEditSubCategory = (subCategory: SubCategory) => {
  setSubCategory(subCategory);

  navigate("manage-products-sub-categories-id-edit", { id: subCategory.id });
};

const handlePageUpdate = (page: number) => {
  fetchSubCategories(page);
};

// Table Config
const tableConfig: ComputedRef<TableConfig> = computed(() => ({
  columns: [
    {
      key: "id",
      label: "#",
    },
    {
      key: "category_id",
      label: t("fields.category"),
      formatter(value, rowData) {
        return filterStore.getCategory(value)?.value ?? "-";
      },
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
