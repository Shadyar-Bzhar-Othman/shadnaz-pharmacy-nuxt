// Endpoints
import { INCOME_URL } from "~/helpers/endpoints";

// Incomes
import type { Income, IncomeForm } from "~/types/others/income";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useIncomeStore = defineStore("incomes", () => {
  // States
  const incomes = ref<Income[]>([]);
  const currentIncome = ref<Income | null>(null);
  const originalIncome = ref<Income | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: IncomeForm = {
    amount: 0,
    description: "",
  };

  // Pagination
  const form = ref<IncomeForm>({ ...defaultForm });

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
    getIncomes(1);
  };

  // Computed Properties
  const filteredIncomes = computed(() =>
    incomes.value.map((income) => ({
      ...income,
    }))
  );

  const isEmpty = computed(() => !filteredIncomes.value.length);

  const isFormCreateFilled = computed(() => {
    return form.value.amount > 0 && form.value.description.trim() !== "";
  });

  const isFormEditFilled = computed(() => {
    return form.value.amount > 0 && form.value.description.trim() !== "";
  });

  const isFormEditChanged = computed(() => {
    if (!currentIncome.value) return false;

    return (
      isFormEditFilled.value &&
      (form.value.amount != originalIncome.value?.amount ||
        form.value.description.trim() !== originalIncome.value?.description)
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.income")} ${t(action)}`;

    success(`${message}!`);
  }

  function setIncome(income: Income | null) {
    if (!income) {
      resetForm();
    } else {
      currentIncome.value = income;
      originalIncome.value = income;

      form.value = {
        amount: income.amount,
        description: income.description,
      };
    }
  }

  // Functions
  async function exportIncomes() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${INCOME_URL}/export`, {
        method: "GET",
        responseIncome: "blob",
      })) as unknown;

      downloadBlob(response, "incomes.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getIncomes(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        incomes: Income[];
        meta: MetaResponse;
      }>(`${INCOME_URL}?page=${page}&search=${searchTerm.value}`);

      incomes.value = response.incomes;

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

  async function getIncome(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: Income }>(
        `${INCOME_URL}/${id}`
      );

      currentIncome.value = response.data;

      setIncome(currentIncome.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createIncome() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${INCOME_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editIncome(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${INCOME_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteIncome(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${INCOME_URL}/${id}`);

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
    currentIncome.value = null;
    errors.value = {};
  }

  return {
    currentIncome,
    filteredIncomes,
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
    setIncome,
    exportIncomes,
    getIncomes,
    getIncome,
    createIncome,
    editIncome,
    deleteIncome,
    resetForm,
  };
});
