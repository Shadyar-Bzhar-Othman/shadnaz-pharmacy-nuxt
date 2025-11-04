<template>
  <div
    :class="[
      isNameShown ? 'items-start' : 'items-center',
      'w-full text-right flex flex-col justify-start items-start gap-y-2.5',
    ]"
  >
    <label
      v-if="isNameShown"
      :for="name"
      class="text-text text-sm font-medium px-1"
    >
      {{ tname != "" ? tname : capitalName }}
      <span v-if="required" class="text-destructive-500">*</span>
    </label>
    <label
      :for="name"
      :class="[
        internalValue ? 'bg-primary-500' : 'bg-background',
        'transition-all duration-300 relative inline-block w-10 h-6 rounded-full cursor-pointer',
      ]"
    >
      <input
        v-model="internalValue"
        type="checkbox"
        :id="name"
        :disabled="disabled"
        class="sr-only peer"
        @keydown.enter="handleEnterKeyPress"
      />
      <span
        :class="[
          isRtl
            ? 'transition-all duration-300 absolute right-1 top-1 w-4 h-4 bg-light rounded-full peer-checked:right-5'
            : 'transition-all duration-300 absolute left-1 top-1 w-4 h-4 bg-light rounded-full peer-checked:left-5',
        ]"
      ></span>
    </label>
    <ul
      v-if="hasError"
      class="flex flex-col text-xs text-destructive-500 gap-1 mt-1.5 ml-2"
    >
      <li v-for="message in errors[name]" :key="message">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { toCapitalizedWords } from "@/helpers/functions";
import { useIsRtl } from "@/helpers/functions";

const isRtl = useIsRtl();
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
  isNameShown: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: [Number, Boolean, null],
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
const emits = defineEmits(["update:modelValue", "status-change"]);

// Lifecycle Hooks
// onMounted(() => {
//   if (props.modelValue == null) {
//     console.log("modelValue is null, setting to 0");
//     emits("update:modelValue", 0);
//     emits("status-change", 0);

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
  emits("status-change", newVal ? 1 : 0);
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
