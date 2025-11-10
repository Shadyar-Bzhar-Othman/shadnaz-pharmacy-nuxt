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
              @click="deleteNotificationFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editNotificationFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormField
            v-model="store.form.title"
            name="title"
            :tname="$t('fields.title')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormTextArea
            v-model="store.form.message"
            name="message"
            :tname="$t('fields.message')"
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
    label: t("models.notifications"),
    icon: "mingcute:notification-fill",
    to: "settings-notifications",
  },
  {
    label: t("actions.edit") + " " + t("models.notification"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const store = useNotificationStore();

const { currentNotification, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getNotification, editNotification, deleteNotification } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentNotification.value === null) {
    const id = route.params.id;

    fetchNotification(id as string | number);
  }
});

// Functions
const fetchNotification = (id: string | number) => {
  getNotification(id);
};

// Functions
const editNotificationFunc = async () => {
  const id = route.params.id;

  await editNotification(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-notifications");
  }
};

const deleteNotificationFunc = async () => {
  const id = route.params.id;

  await deleteNotification(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("settings-notifications");
  }
};
</script>
