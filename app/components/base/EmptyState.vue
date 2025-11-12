<template>
  <div
    class="w-full flex justify-center items-center"
    :style="{ marginTop: space }"
  >
    <span class="text-sm font-normal">{{ message ?? $t("messages.noDataAvailable") }}</span>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  message: {
    type: String,
    default: null,
  },
  space: {
    type: String,
    default: "200px",
  },
});
</script>
