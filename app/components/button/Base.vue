<template>
  <button :class="buttonClasses" :disabled="disabled" @click="handleClick">
    <Icon v-if="loading" name="line-md:loading-twotone-loop" class="text-2xl" />

    <div v-else class="flex justify-center items-center gap-1.5">
      <Icon v-if="icon != ''" :name="icon" class="min-w-3.5 min-h-3.5" />

      <span
        class="text-xs font-normal"
        :class="canOnlyIcon ? 'hidden sm:flex' : ''"
      >
        {{ text }}
      </span>
    </div>
  </button>
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
    default: "w-auto",
  },
  icon: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  bg: {
    type: String,
    default: "bg-primary hover:bg-primary-hover disabled:bg-primary-light",
  },
  canOnlyIcon: {
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

// Computed Properties
const buttonClasses = computed(() => {
  return [
    props.bg,
    "text-center h-9 transition duration-300 text-light flex justify-center items-center rounded-lg",
    props.disabled ? "cursor-not-allowed" : "cursor-pointer",
    props.canOnlyIcon
      ? `w-9 p-2 sm:px-4 sm:py-2 ${props.width}`
      : `px-4 py-2 ${props.width}`,
  ];
});
</script>
