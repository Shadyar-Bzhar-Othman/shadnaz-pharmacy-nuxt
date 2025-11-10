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
              @click="createNotificationFunc"
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
    label: t("actions.create") + " " + t("models.notification"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const store = useNotificationStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createNotification } = store;

// Functions
const createNotificationFunc = async () => {
  await createNotification();

  if (!Object.keys(errors.value).length) {
    navigate("settings-notifications");
  }
};
</script>
