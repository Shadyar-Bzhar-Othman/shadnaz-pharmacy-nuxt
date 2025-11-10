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
              @click="deleteExpenseFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editExpenseFunc"
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
  { label: t("models.expenses"), icon: "game-icons:expense", to: "settings-expenses" },
  {
    label: t("actions.edit") + " " + t("models.expense"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const store = useExpenseStore();

const { currentExpense, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getExpense, editExpense, deleteExpense } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentExpense.value === null) {
    const id = route.params.id;

    fetchExpense(id as string | number);
  }
});

// Functions
const fetchExpense = (id: string | number) => {
  getExpense(id);
};

// Functions
const editExpenseFunc = async () => {
  const id = route.params.id;

  await editExpense(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-expenses");
  }
};

const deleteExpenseFunc = async () => {
  const id = route.params.id;

  await deleteExpense(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-expenses");
  }
};
</script>
