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
              @click="deleteSubCategoryFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editSubCategoryFunc"
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
const route = useRoute();
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
    label: t("actions.edit") + " " + t("models.subCategory"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const filterStore = useFilterStore();
const store = useSubCategoryStore();

const { currentSubCategory, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getSubCategory, editSubCategory, deleteSubCategory } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentSubCategory.value === null) {
    const id = route.params.id;

    fetchSubCategory(id as string | number);
  }

  filterStore.getCategories();
});

// Functions
const fetchSubCategory = (id: string | number) => {
  getSubCategory(id);
};

// Functions
const editSubCategoryFunc = async () => {
  const id = route.params.id;

  await editSubCategory(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-sub-categories");
  }
};

const deleteSubCategoryFunc = async () => {
  const id = route.params.id;

  await deleteSubCategory(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-sub-categories");
  }
};
</script>
