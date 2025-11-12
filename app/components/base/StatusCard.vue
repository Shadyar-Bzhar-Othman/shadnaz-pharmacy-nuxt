<template>
  <div
    class="bg-primary/90 text-light rounded-lg w-full flex flex-col justify-start items-start gap-2 p-3"
  >
    <span class="text-lg font-medium">{{ value }}</span>
    <span class="text-sm">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
// Emits
const emits = defineEmits(["close"]);

// Props
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Number],
    default: "",
  },
});
</script>
