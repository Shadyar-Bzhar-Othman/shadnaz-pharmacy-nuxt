<template>
  <MdoBaseModal
    :headerTxt="modalType + ' ' + t('models.notification')"
    :buttonTxt="t('actions.send')"
    :loading="store.loading && (store.creating || store.editing)"
    :isForm="true"
    @confirm="handleConfirm"
    @close="emits('cancel')"
  >
    <FormDropdown
      v-model="store.sendForm.role"
      name="role"
      :tname="$t('fields.role')"
      :options="notificationRoles"
      :required="true"
      :disabled="store.loading"
      :errors="store.errors"
    />
  </MdoBaseModal>
</template>

<script setup>
// Locale
const { t } = useI18n();

// Stores
const { notificationRoles } = useStoreDataUtils(t);
const store = useNotificationStore();

// Emits
const emits = defineEmits(["confirm", "cancel"]);

// Computed Properties
const modalType = computed(() => t("actions.send"));

// Functions
const handleConfirm = async () => {
  store.sendNotification();

  if (!Object.keys(store.errors).length) {
    emits("confirm");
  }
};
</script>
