// Endpoints
import { NOTIFICATION_URL } from "~/helpers/endpoints";

// Notifications
import type {
  Notification,
  NotificationForm,
  NotificationSendForm,
} from "~/types/others/notification";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useNotificationStore = defineStore("notifications", () => {
  // States
  const notifications = ref<Notification[]>([]);
  const currentNotification = ref<Notification | null>(null);
  const originalNotification = ref<Notification | null>(null);

  const sending = ref(false);
  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: NotificationForm = {
    title: "",
    message: "",
  };

  const defaultSendForm: NotificationSendForm = {
    notification_id: 0,
    role: 1,
  };

  // Pagination
  const form = ref<NotificationForm>({ ...defaultForm });

  const sendForm = ref<NotificationSendForm>({ ...defaultSendForm });

  const paginationInfo = ref<MetaInfo>({
    currentPage: 1,
    perPage: 12,
    totalPage: 1,
    total: 0,
  });

  // Hooks
  const api = useApi();
  const { t } = useI18n();
  const { isLoading } = useLoading();
  const loading = ref(false);
  const errors = ref<any>({});

  // Utils
  const { handleError, createFormData } = useStoreUtils();
  const { success } = useToast();

  // Search
  const searchTerm = ref("");

  const search = (value: string) => {
    searchTerm.value = value;
    getNotifications(1);
  };

  // Computed Properties
  const filteredNotifications = computed(() =>
    notifications.value.map((notification) => ({
      ...notification,
    }))
  );

  const isEmpty = computed(() => !filteredNotifications.value.length);

  const isFormCreateFilled = computed(() => {
    return form.value.title.trim() !== "" && form.value.message.trim() !== "";
  });

  const isFormEditFilled = computed(() => {
    return form.value.title.trim() !== "" && form.value.message.trim() !== "";
  });

  const isFormEditChanged = computed(() => {
    if (!currentNotification.value) return false;

    return (
      isFormEditFilled.value &&
      (form.value.title !== originalNotification.value?.title ||
        form.value.message.trim() !== originalNotification.value?.message)
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.notification")} ${t(action)}`;

    success(`${message}!`);
  }

  function setNotificationSend(notification: Notification) {
    sendForm.value.notification_id = notification.id;
  }

  function setNotification(notification: Notification | null) {
    if (!notification) {
      resetForm();
    } else {
      currentNotification.value = notification;
      originalNotification.value = notification;

      form.value = {
        title: notification.title,
        message: notification.message,
      };
    }
  }

  // Functions
  async function sendNotification() {
    loading.value = true;
    errors.value = {};
    sending.value = true;

    const formData = createFormData(sendForm.value);

    try {
      await api.postData(`${NOTIFICATION_URL}/send`, formData);

      notifySuccess("actions.sent");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      sending.value = false;
    }
  }

  async function exportNotifications() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${NOTIFICATION_URL}/export`, {
        method: "GET",
        responseNotification: "blob",
      })) as unknown;

      downloadBlob(response, "notifications.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getNotifications(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        notifications: Notification[];
        meta: MetaResponse;
      }>(`${NOTIFICATION_URL}?page=${page}&search=${searchTerm.value}`);

      notifications.value = response.notifications;

      paginationInfo.value.currentPage = response.meta.current_page;
      paginationInfo.value.totalPage = response.meta.last_page;
      paginationInfo.value.perPage = response.meta.per_page;
      paginationInfo.value.total = response.meta.total;
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getNotification(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: Notification }>(
        `${NOTIFICATION_URL}/${id}`
      );

      currentNotification.value = response.data;

      setNotification(currentNotification.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createNotification() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${NOTIFICATION_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editNotification(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${NOTIFICATION_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteNotification(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${NOTIFICATION_URL}/${id}`);

      notifySuccess("actions.deleted");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      deleting.value = false;
    }
  }

  function resetForm() {
    form.value = { ...defaultForm };
    currentNotification.value = null;
    errors.value = {};
  }

  return {
    currentNotification,
    filteredNotifications,
    searchTerm,
    paginationInfo,
    form,
    sendForm,
    loading,
    errors,
    sending,
    creating,
    editing,
    deleting,
    isEmpty,
    isFormCreateFilled,
    isFormEditFilled,
    isFormEditChanged,
    search,
    setNotificationSend,
    setNotification,
    sendNotification,
    exportNotifications,
    getNotifications,
    getNotification,
    createNotification,
    editNotification,
    deleteNotification,
    resetForm,
  };
});
