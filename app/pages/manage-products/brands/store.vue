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
              @click="createBrandFunc"
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
    label: t("actions.create") + " " + t("models.brand"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const store = useBrandStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createBrand } = store;

// Functions
const createBrandFunc = async () => {
  await createBrand();

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-brands");
  }
};
</script>
