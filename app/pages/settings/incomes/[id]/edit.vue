<template>
  <client-only>
    <BasePageFormWrapper>
      <!-- Header -->
      <template #header>
        <BasePageHeader>
          <template #breadcrumb>
            <BaseBreadcrumb :items="items" />
          </template>

          <template #actions>
            <ButtonBase
              icon="ic:round-delete"
              width="sm:w-[150px]"
              :text="t('actions.delete')"
              :loading="store.loading && store.deleting"
              :disabled="store.loading"
              :canOnlyIcon="true"
              bg="bg-destructive-500 hover:bg-destructive-400 disabled:bg-destructive-300"
              @click="deleteIncomeFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editIncomeFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormField
            v-model="store.form.amount"
            type="number"
            name="amount"
            :tname="$t('fields.amount')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormTextArea
            v-model="store.form.description"
            name="description"
            :tname="$t('fields.description')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
        </BaseForm>
      </template>
    </BasePageFormWrapper>
  </client-only>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "dashboard-layout",
  ssr: false,
  middleware: ["auth"],
});

// Hooks
const route = useRoute();
const { navigate } = useLocalizedNavigate();

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  { label: t("models.incomes"), icon: "healthicons:low-income-level", to: "settings-incomes" },
  {
    label: t("actions.edit") + " " + t("models.income"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const store = useIncomeStore();

const { currentIncome, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getIncome, editIncome, deleteIncome } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentIncome.value === null) {
    const id = route.params.id;

    fetchIncome(id as string | number);
  }
});

// Functions
const fetchIncome = (id: string | number) => {
  getIncome(id);
};

// Functions
const editIncomeFunc = async () => {
  const id = route.params.id;

  await editIncome(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-incomes");
  }
};

const deleteIncomeFunc = async () => {
  const id = route.params.id;

  await deleteIncome(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-incomes");
  }
};
</script>
