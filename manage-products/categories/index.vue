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
              @export="exportCategories"
              @add="navigateToAddCategory"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="categories"
          :searchTerm="searchTerm"
          @search="search"
        >
          <template #body>
            <TableBase
              tableId="categories"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredCategories"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditCategory"
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
import type { Category } from "@/types/tenant/category";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  {
    label: t("models.categories"),
    icon: "ic:baseline-category",
  },
]);

// Hooks
const { navigate } = useLocalizedNavigate();

// Stores
const categoryStore = useCategoryStore();

const { searchTerm, paginationInfo, filteredCategories, isEmpty } =
  storeToRefs(categoryStore);

const { search, exportCategories, getCategories, setCategory } = categoryStore;

// Lifecycle Hooks
onActivated(() => {
  fetchCategories();
});

// Functions
const fetchCategories = (page: number = paginationInfo.value.currentPage) => {
  getCategories(page);
};

const navigateToAddCategory = () => {
  setCategory(null);

  navigate("manage-products-categories-store");
};

const navigateToEditCategory = (category: Category) => {
  setCategory(category);

  navigate("manage-products-categories-id-edit", { id: category.id });
};

const handlePageUpdate = (page: number) => {
  fetchCategories(page);
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
