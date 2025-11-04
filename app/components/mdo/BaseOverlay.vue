<template>
  <div class="fixed z-[1000] inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-2 text-center">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-dark opacity-80"></div>

      <!-- Slot -->
      <div
        class="relative flex flex-col justify-center items-center p-4 md:p-12"
        :class="[
          isFullWidth
            ? 'w-full'
            : isAutoWidth
            ? 'w-auto'
            : 'w-[100%] md:w-[700px]',
        ]"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  isFullWidth: {
    type: Boolean,
    required: false,
  },
  isAutoWidth: {
    type: Boolean,
    required: false,
  },
});
</script>
