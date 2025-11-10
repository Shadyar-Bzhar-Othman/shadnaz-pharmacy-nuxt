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
              @click="createAdFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormImageField
            v-model="store.form.img_path"
            name="img_path"
            :tname="$t('fields.image')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.title"
            name="title"
            :tname="$t('fields.title')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormSwitch
            v-model="store.form.is_active"
            name="is_active"
            :tname="$t('fields.active')"
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
  { label: t("models.ads"), icon: "academicons:ads-square", to: "settings-ads" },
  {
    label: t("actions.create") + " " + t("models.ad"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const store = useAdStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createAd } = store;

// Functions
const createAdFunc = async () => {
  await createAd();

  if (!Object.keys(errors.value).length) {
    navigate("settings-ads");
  }
};
</script>
