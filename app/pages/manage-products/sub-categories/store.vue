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
              :text="t('actions.create')"
              :loading="store.loading && store.creating"
              :disabled="store.loading || !isFormCreateFilled"
              @click="createSubCategoryFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormDropdown
            v-model="store.form.category_id"
            name="category_id"
            :tname="$t('fields.category')"
            :options="filterStore.categories"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
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
    label: t("models.subCategories"),
    icon: "iconamoon:category-fill",
    to: "manage-products-sub-categories",
  },
  {
    label: t("actions.create") + " " + t("models.subCategory"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const filterStore = useFilterStore();
const store = useSubCategoryStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createSubCategory } = store;

// Lifecycle Hooks
onActivated(() => {
  filterStore.getCategories();
});

// Functions
const createSubCategoryFunc = async () => {
  await createSubCategory();

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-sub-categories");
  }
};
</script>
