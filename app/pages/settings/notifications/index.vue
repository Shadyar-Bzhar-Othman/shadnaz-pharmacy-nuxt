<template>
  <client-only>
    <BasePageWrapper>
      <!-- Header -->
      <template #header>
        <BasePageHeader>
          <template #breadcrumb>
            <BaseBreadcrumb :items="items" />
          </template>

          <template #actions>
            <BasePageTopActionButtons
              @export="exportNotifications"
              @add="navigateToAddNotification"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="notifications"
          :noTable="true"
          :hasLocaleValueSwitcher="true"
          :searchTerm="searchTerm"
          @search="search"
        >
          <template #body>
            <div
              v-if="!isEmpty"
              class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2"
            >
              <BaseCard
                v-for="notification in filteredNotifications"
                :key="notification.id"
                class="flex flex-col justify-start items-start gap-1 p-3"
              >
                <span>{{ notification.title }}</span>
                <span class="text-text-secondary text-sm">
                  {{ notification.message }}
                </span>

                <BaseHR />

                <div class="w-full flex justify-center items-center gap-2">
                  <ButtonBase
                    icon="mingcute:send-plane-fill"
                    :text="$t('actions.send')"
                    class="w-full"
                    @click=""
                  />

                  <ButtonSquare
                    icon="carbon:view-filled"
                    @click="navigateToEditNotification(notification)"
                  />
                </div>
              </BaseCard>
            </div>

            <BaseEmptyState v-else />
          </template>
        </TableWrapper>
      </template>

      <!-- Pagination -->
      <template #pagination>
        <BasePagination
          :currentPage="paginationInfo.currentPage"
          :totalPages="paginationInfo.totalPage"
          @update:currentPage="handlePageUpdate"
        />
      </template>
    </BasePageWrapper>
  </client-only>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "dashboard-layout",
  ssr: false,
  middleware: ["auth"],
});

// Imports
import { formatIraqiDinar } from "@/helpers/functions";

// Types
import type { Notification } from "~/types/others/notification";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  { label: t("models.notifications"), icon: "mingcute:notification-fill" },
]);

// Hooks
const { navigate } = useLocalizedNavigate();

// Stores
const notificationStore = useNotificationStore();

const { searchTerm, paginationInfo, filteredNotifications, isEmpty } =
  storeToRefs(notificationStore);

const { search, exportNotifications, getNotifications, setNotification } =
  notificationStore;

// Lifecycle Hooks
onActivated(() => {
  fetchNotifications();
});

// Functions
const fetchNotifications = (
  page: number = paginationInfo.value.currentPage
) => {
  getNotifications(page);
};

const navigateToAddNotification = () => {
  setNotification(null);

  navigate("settings-notifications-store");
};

const navigateToEditNotification = (notification: Notification) => {
  setNotification(notification);

  navigate("settings-notifications-id-edit", { id: notification.id });
};

const handlePageUpdate = (page: number) => {
  fetchNotifications(page);
};
</script>
