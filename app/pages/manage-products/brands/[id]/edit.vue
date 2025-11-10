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
              @click="deleteBrandFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editBrandFunc"
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
    label: t("models.brands"),
    icon: "tabler:brand-tinder-filled",
    to: "manage-products-brands",
  },
  {
    label: t("actions.edit") + " " + t("models.brand"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const store = useBrandStore();

const { currentBrand, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getBrand, editBrand, deleteBrand } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentBrand.value === null) {
    const id = route.params.id;

    fetchBrand(id as string | number);
  }
});

// Functions
const fetchBrand = (id: string | number) => {
  getBrand(id);
};

// Functions
const editBrandFunc = async () => {
  const id = route.params.id;

  await editBrand(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-brands");
  }
};

const deleteBrandFunc = async () => {
  const id = route.params.id;

  await deleteBrand(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-brands");
  }
};
</script>
