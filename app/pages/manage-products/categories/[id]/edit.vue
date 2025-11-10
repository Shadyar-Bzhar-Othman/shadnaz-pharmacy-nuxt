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
              @click="deleteCategoryFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editCategoryFunc"
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
    label: t("models.categories"),
    icon: "ic:round-category",
    to: "manage-products-categories",
  },
  {
    label: t("actions.edit") + " " + t("models.category"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const store = useCategoryStore();

const { currentCategory, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getCategory, editCategory, deleteCategory } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentCategory.value === null) {
    const id = route.params.id;

    fetchCategory(id as string | number);
  }
});

// Functions
const fetchCategory = (id: string | number) => {
  getCategory(id);
};

// Functions
const editCategoryFunc = async () => {
  const id = route.params.id;

  await editCategory(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-categories");
  }
};

const deleteCategoryFunc = async () => {
  const id = route.params.id;

  await deleteCategory(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-categories");
  }
};
</script>
