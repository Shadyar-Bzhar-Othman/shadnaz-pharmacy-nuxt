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
              icon="subway:add"
              width="w-[150px]"
              :text="t('actions.create') "
              :loading="store.loading && store.creating"
              :disabled="store.loading || !isFormCreateFilled"
              @click="createExpenseFunc"
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
const { navigate } = useLocalizedNavigate();

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  {
    label: t("models.expenses"),
    icon: "game-icons:expense",
    to: "settings-expenses",
  },
  {
    label: t("actions.create") + " " + t("models.expense"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const store = useExpenseStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createExpense } = store;

// Functions
const createExpenseFunc = async () => {
  await createExpense();

  if (!Object.keys(errors.value).length) {
    navigate("settings-expenses");
  }
};
</script>
