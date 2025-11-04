<template>
  <div
    :class="[
      isPrimary
        ? 'bg-primary hover:bg-primary-hover text-light'
        : 'bg-box hover:bg-box-hover text-primary',
      'transition duration-300 px-3 py-2.5 rounded-full flex justify-center items-center cursor-pointer',
    ]"
    @click="emits('close')"
  >
    <Icon name="mingcute:close-fill" class="text-base" />
  </div>
</template>

<script setup lang="ts">
// Emits
const emits = defineEmits(["close"]);

// Props
const props = defineProps({
  isPrimary: {
    type: Boolean,
    default: false,
  },
});
</script>
