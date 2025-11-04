<template>
  <div
    class="w-full text-text relative my-2 space-y-2"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <input
      v-model="model"
      :id="name"
      :type="type"
      :placeholder="tname != '' ? tname : capitalName"
      :class="[
        'transition duration-300 w-full bg-field hover:bg-field-hover text-text-secondary placeholder:text-text-field text-sm font-light px-4 py-2.5 rounded-lg border border-border outline-none focus:border-primary',
        internalClasses,
      ]"
      autocomplete=""
    />
  </div>
</template>

<script setup lang="ts">
// Imports
import { toCapitalizedWords, useIsRtl } from "@/helpers/functions";

// Rtl
const isRtl = useIsRtl();

// Props
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  tname: {
    type: String,
    required: false,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  internalClasses: {
    type: String,
    default: "",
  },
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// Model
const model = defineModel();

// Computed Properties
const capitalName = computed(() => toCapitalizedWords(props.name));

// Functions
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null;

  const file = target && target.files ? target.files[0] : null;

  emit("update:modelValue", file);
};
</script>
