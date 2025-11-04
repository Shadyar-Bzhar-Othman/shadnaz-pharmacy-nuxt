<template>
  <div
    :class="[
      width,
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      'text-center h-9 transition duration-300 bg-transparent text-text border-1 border-border hover:bg-border/50 px-4 py-2 flex justify-center items-center rounded-lg',
    ]"
  >
    <Icon v-if="loading" name="line-md:loading-twotone-loop" class="text-2xl" />

    <span v-else class="text-xs font-normal">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
// Emits
const emit = defineEmits(["click"]);

// Props
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Functions
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>
