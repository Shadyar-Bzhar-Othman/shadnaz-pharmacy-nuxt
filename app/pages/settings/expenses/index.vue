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
              @export="exportExpenses"
              @add="navigateToAddExpense"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="expenses"
          :searchTerm="searchTerm"
          @search="search"
        >
          <template #body>
            <TableBase
              tableId="expenses"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredExpenses"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditExpense"
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
import type { Expense } from "~/types/others/expense";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([{ label: t("models.expenses"), icon: "game-icons:expense" }]);

// Hooks
const { navigate } = useLocalizedNavigate();

// Stores
const expenseStore = useExpenseStore();

const { searchTerm, paginationInfo, filteredExpenses, isEmpty } =
  storeToRefs(expenseStore);

const { search, exportExpenses, getExpenses, setExpense } = expenseStore;

// Lifecycle Hooks
onActivated(() => {
  fetchExpenses();
});

// Functions
const fetchExpenses = (page: number = paginationInfo.value.currentPage) => {
  getExpenses(page);
};

const navigateToAddExpense = () => {
  setExpense(null);

  navigate("settings-expenses-store");
};

const navigateToEditExpense = (expense: Expense) => {
  setExpense(expense);

  navigate("settings-expenses-id-edit", { id: expense.id });
};

const handlePageUpdate = (page: number) => {
  fetchExpenses(page);
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
