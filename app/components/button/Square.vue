<template>
  <div :class="buttonClasses">
    <Icon :name="icon" class="text-xl" />
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  bg: {
    type: String,
    default: "",
  },
});

// Computed Properties
const buttonClasses = computed(() => [
  "w-8 h-8 p-1.5 rounded-lg flex justify-center items-center cursor-pointer transition duration-300",
  props.bg == ""
    ? props.isActive
      ? "bg-primary text-light hover:bg-primary-hover"
      : "bg-box hover:bg-box-hover text-text"
    : props.bg,
]);
</script>
