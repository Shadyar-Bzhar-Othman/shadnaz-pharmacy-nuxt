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
  layout: "dashboard-layout",
  ssr: false,
  middleware: ["auth"],
});

// Imports
import { formatIraqiDinar } from "@/helpers/functions";

// Types
import type { Product } from "~/types/others/product";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([{ label: t("models.products"), icon: "ant-design:product-filled" }]);

// Hooks
const { navigate } = useLocalizedNavigate();
const { getActive } = useStoreDataUtils(t);

// Stores
const filterStore = useFilterStore();
const productStore = useProductStore();

const { filters, searchTerm, paginationInfo, filteredProducts, isEmpty } =
  storeToRefs(productStore);

const { search, setFilters, exportProducts, getProducts, setProduct } =
  productStore;

// Lifecycle Hooks
onActivated(() => {
  fetchProducts();

  filterStore.getSubCategories();
  filterStore.getBrands();
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
      key: "img_path",
      label: t("fields.image"),
      isImage: true,
    },
    {
      key: "sub_category_id",
      label: t("fields.subCategory"),
      formatter(value, rowData) {
        return filterStore.getSubCategory(value)?.value ?? "-";
      },
    },
    {
      key: "brand_id",
      label: t("fields.brand"),
      formatter(value, rowData) {
        return filterStore.getBrand(value)?.value ?? "-";
      },
    },
    {
      key: "name_en",
      label: t("fields.nameEn"),
    },
    {
      key: "name_ar",
      label: t("fields.nameAr"),
    },
    {
      key: "name_ckb",
      label: t("fields.nameCkb"),
    },
    {
      key: "description_en",
      label: t("fields.descriptionEn"),
    },
    {
      key: "description_ar",
      label: t("fields.descriptionAr"),
    },
    {
      key: "description_ckb",
      label: t("fields.descriptionCkb"),
    },
    {
      key: "stock",
      label: t("fields.stock"),
    },
    {
      key: "original_price",
      label: t("fields.originalPrice"),
      formatter(value, rowData) {
        return `${formatIraqiDinar(value)} ${t("iqd")}`;
      },
    },
    {
      key: "price",
      label: t("fields.price"),
      formatter(value, rowData) {
        return `${formatIraqiDinar(value)} ${t("iqd")}`;
      },
    },
    {
      key: "discounted_price",
      label: t("fields.discountedPrice"),
      formatter(value, rowData) {
        return `${formatIraqiDinar(value)} ${t("iqd")}`;
      },
    },
    {
      key: "is_active",
      label: t("fields.active"),
      formatter(value, rowData) {
        return getActive(value == 1 ? true : false);
      },
      style: (value, rowData) => {
        if (value == 0) {
          return "max-w-24 text-destructive-500 bg-destructive-200 rounded-full py-1";
        } else {
          return "max-w-24 text-success-500 bg-success-200 rounded-full py-1";
        }
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
