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
              @export="exportAds"
              @add="navigateToAddAd"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="ads"
          :searchTerm="searchTerm"
          :filters="filters"
          @search="search"
          @setFilters="setFilters"
        >
          <template #body>
            <TableBase
              tableId="ads"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredAds"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditAd"
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
import type { Ad } from "~/types/others/ad";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([{ label: t("models.ads"), icon: "academicons:ads-square" }]);

// Hooks
const { navigate } = useLocalizedNavigate();
const { getActive } = useStoreDataUtils(t);

// Stores
const adStore = useAdStore();

const { filters, searchTerm, paginationInfo, filteredAds, isEmpty } =
  storeToRefs(adStore);

const { search, setFilters, exportAds, getAds, setAd } = adStore;

// Lifecycle Hooks
onActivated(() => {
  fetchAds();
});

// Functions
const fetchAds = (page: number = paginationInfo.value.currentPage) => {
  getAds(page);
};

const navigateToAddAd = () => {
  setAd(null);

  navigate("settings-ads-store");
};

const navigateToEditAd = (ad: Ad) => {
  setAd(ad);

  navigate("settings-ads-id-edit", { id: ad.id });
};

const handlePageUpdate = (page: number) => {
  fetchAds(page);
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
      key: "title",
      label: t("fields.title"),
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
