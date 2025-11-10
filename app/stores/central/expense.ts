// Endpoints
import { EXPENSE_URL } from "~/helpers/endpoints";

// Expenses
import type { Expense, ExpenseForm } from "~/types/others/expense";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useExpenseStore = defineStore("expenses", () => {
  // States
  const expenses = ref<Expense[]>([]);
  const currentExpense = ref<Expense | null>(null);
  const originalExpense = ref<Expense | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: ExpenseForm = {
    amount: 0,
    description: "",
  };

  // Pagination
  const form = ref<ExpenseForm>({ ...defaultForm });

  const paginationInfo = ref<MetaInfo>({
    currentPage: 1,
    perPage: 12,
    totalPage: 1,
    total: 0,
  });

  // Hooks
  const api = useApi();
  const { t } = useI18n();
  const { isLoading } = useLoading();
  const loading = ref(false);
  const errors = ref<any>({});

  // Utils
  const { handleError, createFormData } = useStoreUtils();
  const { success } = useToast();

  // Search
  const searchTerm = ref("");

  const search = (value: string) => {
    searchTerm.value = value;
    getExpenses(1);
  };

  // Computed Properties
  const filteredExpenses = computed(() =>
    expenses.value.map((expense) => ({
      ...expense,
    }))
  );

  const isEmpty = computed(() => !filteredExpenses.value.length);

  const isFormCreateFilled = computed(() => {
    return form.value.amount > 0 && form.value.description.trim() !== "";
  });

  const isFormEditFilled = computed(() => {
    return form.value.amount > 0 && form.value.description.trim() !== "";
  });

  const isFormEditChanged = computed(() => {
    if (!currentExpense.value) return false;

    return (
      isFormEditFilled.value &&
      (form.value.amount !== originalExpense.value?.amount ||
        form.value.description.trim() !== originalExpense.value?.description)
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.expense")} ${t(action)}`;

    success(`${message}!`);
  }

  function setExpense(expense: Expense | null) {
    if (!expense) {
      resetForm();
    } else {
      currentExpense.value = expense;
      originalExpense.value = expense;

      form.value = {
        amount: expense.amount,
        description: expense.description,
      };
    }
  }

  // Functions
  async function exportExpenses() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${EXPENSE_URL}/export`, {
        method: "GET",
        responseExpense: "blob",
      })) as unknown;

      downloadBlob(response, "expenses.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getExpenses(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        expenses: Expense[];
        meta: MetaResponse;
      }>(`${EXPENSE_URL}?page=${page}&search=${searchTerm.value}`);

      expenses.value = response.expenses;

      paginationInfo.value.currentPage = response.meta.current_page;
      paginationInfo.value.totalPage = response.meta.last_page;
      paginationInfo.value.perPage = response.meta.per_page;
      paginationInfo.value.total = response.meta.total;
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getExpense(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: Expense }>(
        `${EXPENSE_URL}/${id}`
      );

      currentExpense.value = response.data;

      setExpense(currentExpense.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createExpense() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${EXPENSE_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editExpense(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${EXPENSE_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteExpense(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${EXPENSE_URL}/${id}`);

      notifySuccess("actions.deleted");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      deleting.value = false;
    }
  }

  function resetForm() {
    form.value = { ...defaultForm };
    currentExpense.value = null;
    errors.value = {};
  }

  return {
    currentExpense,
    filteredExpenses,
    searchTerm,
    paginationInfo,
    form,
    loading,
    errors,
    creating,
    editing,
    deleting,
    isEmpty,
    isFormCreateFilled,
    isFormEditFilled,
    isFormEditChanged,
    search,
    setExpense,
    exportExpenses,
    getExpenses,
    getExpense,
    createExpense,
    editExpense,
    deleteExpense,
    resetForm,
  };
});
