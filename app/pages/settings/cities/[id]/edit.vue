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
              @click="deleteCityFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editCityFunc"
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
  { label: t("models.cities"), icon: "solar:city-bold", to: "settings-cities" },
  {
    label: t("actions.edit") + " " + t("models.city"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const store = useCityStore();

const { currentCity, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getCity, editCity, deleteCity } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentCity.value === null) {
    const id = route.params.id;

    fetchCity(id as string | number);
  }
});

// Functions
const fetchCity = (id: string | number) => {
  getCity(id);
};

// Functions
const editCityFunc = async () => {
  const id = route.params.id;

  await editCity(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-cities");
  }
};

const deleteCityFunc = async () => {
  const id = route.params.id;

  await deleteCity(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-cities");
  }
};
</script>
