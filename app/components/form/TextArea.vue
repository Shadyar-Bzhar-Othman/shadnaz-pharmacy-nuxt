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

    <textarea
      v-model="model"
      :rows="4"
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
const model = defineModel<string | number | null>();

// Computed Properties
const hasError = computed(
  () => props.errors && props.errors[props.name]?.length
);

const capitalName = computed(() => toCapitalizedWords(props.name));

const handleEnterKeyPress = (event: KeyboardEvent) => {
  handleEnterKey(event);
};
</script>

<style scoped>
.error {
  border-color: #ef4444;
}
</style>
