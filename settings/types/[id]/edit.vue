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
              :text="t('actions.delete') + ' ' + t('models.type')"
              :loading="store.loading && store.deleting"
              :disabled="store.loading"
              :canOnlyIcon="true"
              bg="bg-destructive-500 hover:bg-destructive-400 disabled:bg-destructive-300"
              @click="deleteTypeFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit') + ' ' + t('models.type')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editTypeFunc"
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
const route = useRoute();
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  {
    label: t("models.types"),
    icon: "tabler:category-filled",
    to: "settings-types",
  },
  {
    label: t("actions.edit") + " " + t("models.type"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const store = useTypeStore();

const { currentType, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getType, editType, deleteType } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentType.value === null) {
    const id = route.params.id;

    fetchType(id as string | number);
  }
});

// Functions
const fetchType = (id: string | number) => {
  getType(id);
};

// Functions
const editTypeFunc = async () => {
  const id = route.params.id;

  await editType(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-types");
  }
};

const deleteTypeFunc = async () => {
  const id = route.params.id;

  await deleteType(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-types");
  }
};
</script>
