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
              @export="exportTypes"
              @add="navigateToAddType"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper tableId="types" :searchTerm="searchTerm" @search="search">
          <template #body>
            <TableBase
              tableId="types"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredTypes"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditType"
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
import type { Type } from "~/types/others/type";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  { label: t("models.types"), icon: "tabler:category-filled" },
]);

// Hooks
const { navigate } = useLocalizedNavigate();
const { getActive } = useStoreDataUtils(t);

// Stores
const typeStore = useTypeStore();

const { searchTerm, paginationInfo, filteredTypes, isEmpty } =
  storeToRefs(typeStore);

const { search, exportTypes, getTypes, setType } = typeStore;

// Lifecycle Hooks
onActivated(() => {
  fetchTypes();
});

// Functions
const fetchTypes = (page: number = paginationInfo.value.currentPage) => {
  getTypes(page);
};

const navigateToAddType = () => {
  setType(null);

  navigate("settings-types-store");
};

const navigateToEditType = (type: Type) => {
  setType(type);

  navigate("settings-types-id-edit", { id: type.id });
};

const handlePageUpdate = (page: number) => {
  fetchTypes(page);
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
