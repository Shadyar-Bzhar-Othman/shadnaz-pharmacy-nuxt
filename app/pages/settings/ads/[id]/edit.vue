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
              @click="deleteAdFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editAdFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormImageField
            v-model="store.form.img_path"
            :old="currentAd?.img_path"
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
const route = useRoute();
const { navigate } = useLocalizedNavigate();

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  { label: t("models.ads"), icon: "academicons:ads-square", to: "settings-ads" },
  {
    label: t("actions.edit") + " " + t("models.ad"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const store = useAdStore();

const { currentAd, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getAd, editAd, deleteAd } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentAd.value === null) {
    const id = route.params.id;

    fetchAd(id as string | number);
  }
});

// Functions
const fetchAd = (id: string | number) => {
  getAd(id);
};

// Functions
const editAdFunc = async () => {
  const id = route.params.id;

  await editAd(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-ads");
  }
};

const deleteAdFunc = async () => {
  const id = route.params.id;

  await deleteAd(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-ads");
  }
};
</script>
