<template>
  <div
    class="w-[95%] sm:w-[75%] fixed bottom-2 left-1/2 transform -translate-x-1/2 z-[10000] space-y-2"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        getBackgroundColor(toast.type),
        ,
        'w-full text-light px-4 py-2.5 rounded-xl shadow-main flex justify-between items-center gap-2 animate-slide-in-down',
      ]"
    >
      <div class="flex items-center justify-center gap-2">
        <Icon :name="getIcon(toast.type)" class="size-4" />

        <p>{{ toast.message }}</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-[1px] h-[16px] bg-light rounded"></div>
        <Icon
          name="ep:close-bold"
          @click="removeToast(toast.id)"
          class="size-5 cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Hooks
const { toasts, removeToast } = useToast();

// Functions
const getBackgroundColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-success-500";
    case "error":
      return "bg-destructive-500";
    case "warning":
      return "bg-warning-500";
    default:
      return "bg-destructive-500";
  }
};

const getTextColor = (type: string) => {
  switch (type) {
    case "success":
      return "text-success-500";
    case "error":
      return "text-destructive-500";
    case "warning":
      return "text-warning-500";
    default:
      return "text-destructive-500";
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return "icon-park-solid:correct";
    case "error":
      return "raphael:no";
    case "warning":
      return "hugeicons:cursor-progress-03";
    default:
      return "raphael:no";
  }
};
</script>

<style scoped>
@keyframes slide-in-down {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-in-down {
  animation: slide-in-down 0.3s ease-out;
}
</style>
