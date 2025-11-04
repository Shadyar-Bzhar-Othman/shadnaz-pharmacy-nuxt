<template>
  <div
    class="w-full text-text relative my-2 space-y-2"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <label :for="name" class="text-sm font-normal px-1 flex">
      <span v-if="extra == null">{{ tname != "" ? tname : capitalName }}</span>
      <span v-if="extra != null"
        >{{ tname != "" ? tname : capitalName }} ({{ extra }})</span
      >
      <Icon
        v-if="required"
        name="mdi:required"
        class="text-destructive-500 size-3"
      />
    </label>

    <input
      v-if="type !== 'file'"
      v-model="model"
      :type="type"
      :id="name"
      :placeholder="tname != '' ? tname : capitalName"
      :disabled="disabled"
      :class="[
        'transition duration-300 w-full bg-field hover:bg-field-hover text-text-secondary placeholder:text-text-field text-sm font-light px-4 py-2.5 rounded-lg border border-border outline-none focus:border-primary',
        internalClasses,
        hasError ? 'error' : '',
      ]"
      autocomplete=""
      @keydown.enter="handleEnterKeyPress"
    />

    <input
      v-else
      :type="type"
      :id="name"
      :disabled="disabled"
      :class="[
        'transition duration-300 w-full bg-field hover:bg-field-hover ext-text-secondary placeholder:text-text-field text-sm font-light px-4 py-2 rounded-lg border border-border outline-none focus:border-primary',
        internalClasses,
        hasError ? 'error' : '',
      ]"
      @change="handleFileChange"
    />

    <!-- Errors -->
    <ul
      v-if="hasError"
      class="flex justify-start items-start flex-col text-xxs text-destructive-500 gap-1 ml-2"
    >
      <li v-for="message in errors[name]" :key="message">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Imports
import { toCapitalizedWords, useIsRtl } from "@/helpers/functions";

// Rtl
const isRtl = useIsRtl();

// Locale
const { locale } = useI18n();

// Composables
const { handleEnterKey } = useFormNavigation();

// Props
const props = defineProps({
  extra: {
    type: [String, Number],
    default: null,
  },
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
  errors: {
    type: Object,
    default: () => ({}),
  },
  required: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// Model
const model = defineModel();

// Computed Properties
const hasError = computed(
  () => props.errors && props.errors[props.name]?.length
);

const capitalName = computed(() => toCapitalizedWords(props.name));

// Functions
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null;

  const file = target && target.files ? target.files[0] : null;

  emit("update:modelValue", file);
};

const handleEnterKeyPress = (event: KeyboardEvent) => {
  handleEnterKey(event);
};
</script>

<style scoped>
.error {
  border-color: #ef4444;
}

input[type="file"]::file-selector-button {
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.16);
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
  margin-right: 8px;
  transition: background-color 200ms;
}

input[type="file"]::file-selector-button:hover {
  background-color: #f3f4f6;
}

input[type="file"]::file-selector-button:active {
  background-color: #e5e7eb;
}
</style>
