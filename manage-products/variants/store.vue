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
              :text="t('actions.create') + ' ' + t('models.variant')"
              :loading="store.loading && store.creating"
              :disabled="store.loading || !isFormCreateFilled"
              @click="createVariantFunc"
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
    label: t("models.variants"),
    icon: "mdi:invoice-line-items",
    to: "manage-products-variants",
  },
  {
    label: t("actions.create") + " " + t("models.variant"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const store = useVariantStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createVariant } = store;

// Functions
const createVariantFunc = async () => {
  await createVariant();

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-variants");
  }
};
</script>
