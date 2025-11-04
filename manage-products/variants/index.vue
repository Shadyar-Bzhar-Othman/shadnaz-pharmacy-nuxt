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
              @export="exportVariants"
              @add="navigateToAddVariant"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="variants"
          :searchTerm="searchTerm"
          @search="search"
        >
          <template #body>
            <TableBase
              tableId="variants"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredVariants"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditVariant"
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
  layout: "dashboard-tenant-layout",
  ssr: false,
  middleware: ["tenant", "auth"],
});

// Types
import type { Variant } from "@/types/tenant/variant";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  {
    label: t("models.variants"),
    icon: "mdi:invoice-line-items",
  },
]);

// Hooks
const { navigate } = useLocalizedNavigate();

// Stores
const variantStore = useVariantStore();

const { searchTerm, paginationInfo, filteredVariants, isEmpty } =
  storeToRefs(variantStore);

const { search, exportVariants, getVariants, setVariant } = variantStore;

// Lifecycle Hooks
onActivated(() => {
  fetchVariants();
});

// Functions
const fetchVariants = (page: number = paginationInfo.value.currentPage) => {
  getVariants(page);
};

const navigateToAddVariant = () => {
  setVariant(null);

  navigate("manage-products-variants-store");
};

const navigateToEditVariant = (variant: Variant) => {
  setVariant(variant);

  navigate("manage-products-variants-id-edit", { id: variant.id });
};

const handlePageUpdate = (page: number) => {
  fetchVariants(page);
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
