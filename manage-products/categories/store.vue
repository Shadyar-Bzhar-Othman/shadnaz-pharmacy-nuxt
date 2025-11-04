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
              :text="t('actions.create') + ' ' + t('models.category')"
              :loading="store.loading && store.creating"
              :disabled="store.loading || !isFormCreateFilled"
              @click="createCategoryFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormField
            v-model="store.form.name"
            name="name"
            :tname="$t('fields.name')"
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
  layout: "dashboard-tenant-layout",
  ssr: false,
  middleware: ["tenant", "auth"],
});

// Hooks
const { navigate } = useLocalizedNavigate();

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  {
    label: t("models.categories"),
    icon: "ic:baseline-category",
    to: "manage-products-categories",
  },
  {
    label: t("actions.create") + " " + t("models.category"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const store = useCategoryStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createCategory } = store;

// Functions
const createCategoryFunc = async () => {
  await createCategory();

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-categories");
  }
};
</script>
