interface Toast {
  id: string;
  message: string;
  type: "success" | "warning" | "error";
  duration: number;
}

const toasts: Ref<Toast[]> = ref([]);

export const useToast = () => {
  const toastDuration = 3000;

  const addToast = (
    message = "Notification",
    type: Toast["type"] = "success",
    duration = 3000
  ) => {
    const id = Date.now().toString() + Math.random().toString() + message;
    toasts.value.push({ id, message, type, duration });

    setTimeout(() => removeToast(id), duration);
  };

  const success = (message: string) =>
    addToast(message, "success", toastDuration);
  const warning = (message: string) =>
    addToast(message, "warning", toastDuration);
  const error = (message: string) => addToast(message, "error", toastDuration);

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  return {
    toasts,
    addToast,
    success,
    warning,
    error,
    removeToast,
  };
};
