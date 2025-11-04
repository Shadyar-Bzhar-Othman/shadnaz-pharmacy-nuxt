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
              @export="exportProducts"
              @add="navigateToAddProduct"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="products"
          :searchTerm="searchTerm"
          :filters="filters"
          @search="search"
          @setFilters="setFilters"
        >
          <template #body>
            <TableBase
              tableId="products"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredProducts"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditProduct"
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
import type { Product } from "@/types/tenant/product";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  {
    label: t("models.products"),
    icon: "ant-design:product-filled",
  },
]);

// Hooks
const { navigate } = useLocalizedNavigate();
const { getActive } = useStoreDataUtils(t);

// Stores
const filterStore = useTenantFilterStore();
const productStore = useProductStore();

const { filters, searchTerm, paginationInfo, filteredProducts, isEmpty } =
  storeToRefs(productStore);

const { search, setFilters, exportProducts, getProducts, setProduct } =
  productStore;

// Lifecycle Hooks
onActivated(() => {
  fetchProducts();

  filterStore.getCategories();
});

// Functions
const fetchProducts = (page: number = paginationInfo.value.currentPage) => {
  getProducts(page);
};

const navigateToAddProduct = () => {
  setProduct(null);

  navigate("manage-products-products-store");
};

const navigateToEditProduct = (product: Product) => {
  setProduct(product);

  navigate("manage-products-products-id-edit", { id: product.id });
};

const handlePageUpdate = (page: number) => {
  fetchProducts(page);
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
      key: "description",
      label: t("fields.description"),
    },
    {
      key: "original_price",
      label: t("fields.originalPrice"),
    },
    {
      key: "price",
      label: t("fields.price"),
    },
    {
      key: "stock",
      label: t("fields.stock"),
    },
    {
      key: "is_active",
      label: t("fields.active"),
      formatter(value, rowData) {
        return getActive(value == 1 ? true : false);
      },
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
