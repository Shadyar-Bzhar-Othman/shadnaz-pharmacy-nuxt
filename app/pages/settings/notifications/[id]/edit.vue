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
        <BaseForm class="mb-2">
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

        <BaseCard>
          <div class="w-full flex flex-col justify-start items-start gap-2 p-3">
            <span class="text-sm font-medium">{{
              $t("messages.sentNotifications")
            }}</span>

            <BaseHR />

            <BaseCard
              v-for="(
                notificationSend, index
              ) in currentNotification?.notification_sends"
              :key="notificationSend.id"
            >
              <div
                class="w-full flex flex-col justify-start items-start gap-2 p-3"
              >
                <div class="w-full flex justify-between items-center gap-2">
                  <div class="flex justify-start items-center gap-1.5">
                    <div
                      class="w-5 h-5 rounded-full text-light bg-primary flex justify-center items-center text-xxs"
                    >
                      <span>{{ index + 1 }}</span>
                    </div>
                    <span class="text-sm">
                      {{
                        $t("messages.sentBy", {
                          name: notificationSend.sender?.name,
                          time: notificationSend.sent_at,
                        })
                      }}
                    </span>
                  </div>
                  <span
                    class="text-xs text-light bg-primary rounded-full px-4 py-1"
                  >
                    {{ getNotificationRole(notificationSend.role) }}
                  </span>
                </div>

                <BaseHR />

                <div
                  class="w-full flex flex-col md:flex-row justify-start items-start gap-2"
                >
                  <BaseCard
                    class="w-full flex flex-col justify-start items-start gap-2 p-3"
                  >
                    <span class="text-sm font-medium">
                      {{ $t("models.users") }}
                    </span>

                    <BaseHR />

                    <div class="w-full flex flex-col gap-2">
                      <div
                        v-for="notificationUser in notificationSend.notification_users"
                        :key="notificationUser.id"
                        class="w-full flex justify-between items-center gap-2"
                      >
                        <span class="text-sm">{{
                          notificationUser.user?.name
                        }}</span>

                        <span
                          :class="[
                            notificationUser.is_read == 1
                              ? 'text-success-500 bg-success-200'
                              : 'text-destructive-500 bg-destructive-200',
                            'text-xs rounded-full px-4 py-1',
                          ]"
                        >
                          {{
                            getRead(
                              notificationUser.is_read == 1 ? true : false
                            )
                          }}
                        </span>
                      </div>
                    </div>
                  </BaseCard>

                  <BaseCard>
                    <div
                      class="w-full flex flex-col justify-start items-start gap-2 p-3"
                    >
                      <span class="text-sm font-medium">
                        {{ $t("messages.statistics") }}
                      </span>

                      <BaseHR />

                      <BaseStatusCard
                        :text="$t('messages.totalUsers')"
                        :value="notificationSend.notification_users?.length"
                      />

                      <BaseStatusCard
                        :text="$t('messages.readNotifications')"
                        :value="
                          readNotificationFunc(
                            notificationSend.notification_users ?? []
                          )
                        "
                      />

                      <BaseStatusCard
                        :text="$t('messages.unreadNotifications')"
                        :value="
                          unReadNotificationFunc(
                            notificationSend.notification_users ?? []
                          )
                        "
                      />
                    </div>
                  </BaseCard>
                </div>
              </div>
            </BaseCard>
          </div>
        </BaseCard>
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

// Types
import type { NotificationUser } from "@/types/others/notification";

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
const { getNotificationRole, getRead } = useStoreDataUtils(t);
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

const readNotificationFunc = (notificationUsers: NotificationUser[]) => {
  return notificationUsers.filter(
    (notificationUser) => notificationUser.is_read === 1
  ).length;
};

const unReadNotificationFunc = (notificationUsers: NotificationUser[]) => {
  return notificationUsers.filter(
    (notificationUser) => notificationUser.is_read === 0
  ).length;
};
</script>
