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
              @export="exportIncomes"
              @add="navigateToAddIncome"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="incomes"
          :searchTerm="searchTerm"
          @search="search"
        >
          <template #body>
            <TableBase
              tableId="incomes"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredIncomes"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditIncome"
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
import type { Income } from "~/types/others/income";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([{ label: t("models.incomes"), icon: "healthicons:low-income-level" }]);

// Hooks
const { navigate } = useLocalizedNavigate();

// Stores
const incomeStore = useIncomeStore();

const { searchTerm, paginationInfo, filteredIncomes, isEmpty } =
  storeToRefs(incomeStore);

const { search, exportIncomes, getIncomes, setIncome } = incomeStore;

// Lifecycle Hooks
onActivated(() => {
  fetchIncomes();
});

// Functions
const fetchIncomes = (page: number = paginationInfo.value.currentPage) => {
  getIncomes(page);
};

const navigateToAddIncome = () => {
  setIncome(null);

  navigate("settings-incomes-store");
};

const navigateToEditIncome = (income: Income) => {
  setIncome(income);

  navigate("settings-incomes-id-edit", { id: income.id });
};

const handlePageUpdate = (page: number) => {
  fetchIncomes(page);
};

// Table Config
const tableConfig: ComputedRef<TableConfig> = computed(() => ({
  columns: [
    {
      key: "id",
      label: "#",
    },
    {
      key: "amount",
      label: t("fields.amount"),
      formatter(value, rowData) {
        return `${formatIraqiDinar(value)} ${t("iqd")}`;
      },
    },
    {
      key: "description",
      label: t("fields.description"),
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
