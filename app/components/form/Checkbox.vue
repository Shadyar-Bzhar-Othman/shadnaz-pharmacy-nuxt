<template>
  <div class="w-full my-2">
    <div class="flex justify-start items-center gap-1">
      <input
        v-model="internalValue"
        type="checkbox"
        :id="name"
        :disabled="disabled"
        :class="[
          'outline-none background-primary-500 w-4 h-4 bg-general-white border border-neutral-400 focus:border-primary-600 rounded',
          hasError ? 'error' : '',
        ]"
        @keydown.enter="handleEnterKeyPress"
      />
      <label :for="name" class="text-sm font-[400] px-1 flex">
        <span>{{ tname != "" ? tname : capitalName }}</span>
        <Icon v-if="required" name="mdi:required" class="text-red-500 size-3" />
      </label>
    </div>

    <!-- Errors -->
    <ul
      v-if="hasError"
      class="flex justify-start items-start flex-col text-xs text-destructive-500 gap-1 mt-0.5 ml-2"
    >
      <li v-for="message in errors[name]" :key="message">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { toCapitalizedWords } from "@/helpers/functions";
const { locale } = useI18n();
const currentLocale = locale;
// Composables
const { handleEnterKey } = useFormNavigation();

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
  modelValue: {
    type: [Number, Boolean],
    default: 0,
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
const emits = defineEmits(["update:modelValue"]);

// Lifecycle Hooks
// onMounted(() => {
//   if (props.modelValue === null) {
//     emits("update:modelValue", 0);

//     internalValue.value = false;
//   }
// });

// Variables
const internalValue = ref(!!props.modelValue);

// Functions
// Handle Enter key to move to next input
const handleEnterKeyPress = (event: KeyboardEvent) => {
  handleEnterKey(event);
};

// Computed Properties
const hasError = computed(
  () => props.errors && props.errors[props.name]?.length
);

const capitalName = computed(() => toCapitalizedWords(props.name));

// Watchers
watch(internalValue, (newVal) => {
  emits("update:modelValue", newVal ? 1 : 0);
});

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = !!newVal;
  }
);
</script>

<style scoped>
.error {
  border-color: #ef4444;
}
</style>
