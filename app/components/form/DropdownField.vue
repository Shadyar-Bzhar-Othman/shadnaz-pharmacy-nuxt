<template>
  <div
    class="w-full lg:min-w-[200px] text-text relative my-2 space-y-2.5"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <label :for="name" class="text-sm font-[400] px-1 flex">
      <span>{{ tname != "" ? tname : capitalName }}</span>
      <Icon v-if="required" name="mdi:required" class="text-red-500 size-3" />
    </label>

    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :id="name"
      :placeholder="tname != '' ? tname : capitalName"
      :disabled="disabled"
      :class="[
        'transition duration-300 w-full bg-field hover:bg-field-hover text-text-secondary placeholder:text-text-field text-sm font-light px-4 py-2.5 rounded-lg border border-border outline-none focus:border-primary',
        internalClasses,
        hasError ? 'error' : '',
      ]"
      autocomplete="off"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @click="handleClick"
    />

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

interface OptionType {
  key: string | number;
  value: string;
}

const { locale } = useI18n();
const currentLocale = locale;

// Composables
const { moveToNextInput: moveToNext } = useFormNavigation();

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
    type: [String, Number],
    default: null,
  },
  options: {
    type: Array as () => OptionType[],
    required: true,
    default: () => [],
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
const emit = defineEmits(["update:modelValue", "no-match"]);

// Refs
const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref("");
const isUserTyping = ref(false);
const currentSelection = ref<OptionType | null>(null);

// Computed Properties
const hasError = computed(
  () => props.errors && props.errors[props.name]?.length
);

const capitalName = computed(() => toCapitalizedWords(props.name));

const filteredOptions = computed(() => {
  const options = props.options as OptionType[];
  if (!inputValue.value.trim()) return options;

  const searchValue = inputValue.value.toLowerCase();

  // First, get options that start with the search value
  const startsWithOptions = options.filter((option: OptionType) =>
    option.value.toLowerCase().startsWith(searchValue)
  );

  // Then, get options that contain the search value but don't start with it
  const containsOptions = options.filter((option: OptionType) => {
    const lowerValue = option.value.toLowerCase();
    return (
      lowerValue.includes(searchValue) && !lowerValue.startsWith(searchValue)
    );
  });

  // Combine them, prioritizing "starts with" matches
  return [...startsWithOptions, ...containsOptions];
});

const exactMatch = computed(() => {
  const options = props.options as OptionType[];
  return (
    options.find(
      (option: OptionType) =>
        option.value.toLowerCase() === inputValue.value.toLowerCase()
    ) || null
  );
});

const topSuggestion = computed<OptionType | null>(() => {
  return filteredOptions.value[0] || null;
});

// Functions
const handleInput = (event: Event) => {
  // Cast to InputEvent for type safety
  const inputEvent = event as InputEvent;
  isUserTyping.value = true;

  // Get the current input value and cursor position
  const currentInput = (event.target as HTMLInputElement).value;

  // Auto-suggest the top match only if user is not deleting/selecting
  if (
    topSuggestion.value &&
    currentInput.trim() &&
    !inputEvent.inputType?.includes("delete")
  ) {
    const suggestion = topSuggestion.value.value;

    // Only suggest if the suggestion starts with what user typed
    if (
      suggestion.toLowerCase().startsWith(currentInput.toLowerCase()) &&
      currentInput.length < suggestion.length
    ) {
      // Set the full suggestion
      inputValue.value = suggestion;

      // Select the auto-completed part
      nextTick(() => {
        if (
          inputRef.value &&
          typeof inputRef.value.setSelectionRange === "function"
        ) {
          inputRef.value.setSelectionRange(
            currentInput.length,
            suggestion.length
          );
        }
      });
    }
  }

  // Emit the current state
  if (exactMatch.value) {
    emit("update:modelValue", exactMatch.value.key);
    currentSelection.value = exactMatch.value;
  } else {
    // No match found - emit 0 and the typed value
    emit("update:modelValue", 0);
    emit("no-match", inputValue.value.trim());
    currentSelection.value = null;
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "Tab":
      // Check if there's a suggestion available and user has typed something
      if (topSuggestion.value && inputValue.value.trim() && !exactMatch.value) {
        event.preventDefault();
        selectOption(topSuggestion.value);
      }
      break;

    case "Enter":
      event.preventDefault();
      if (exactMatch.value) {
        // If there's an exact match, select it
        selectOption(exactMatch.value);
      } else if (topSuggestion.value && inputValue.value.trim()) {
        // If there's a suggestion, select it
        selectOption(topSuggestion.value);
      } else {
        // Move to next input on Enter
        moveToNextInput();
      }
      break;

    case "Backspace":
    case "Delete":
      // Allow normal deletion behavior
      isUserTyping.value = true;
      break;

    case "Escape":
      // Clear the input
      inputValue.value = "";
      isUserTyping.value = true;
      currentSelection.value = null;
      emit("update:modelValue", 0);
      emit("no-match", "");
      break;
  }
};

const handleFocus = () => {
  isUserTyping.value = true;
};

const handleClick = () => {
  isUserTyping.value = true;
};

const selectOption = (option: OptionType) => {
  inputValue.value = option.value;
  currentSelection.value = option;
  isUserTyping.value = false;

  emit("update:modelValue", option.key);

  // Move to next input
  moveToNextInput();
};

const moveToNextInput = () => {
  nextTick(() => {
    if (inputRef.value) {
      moveToNext(inputRef.value);
    }
  });
};

// Watch for external model value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue == 0) {
      inputValue.value = "";
      currentSelection.value = null;
    }

    if (!isUserTyping.value && newValue !== null) {
      const options = props.options as OptionType[];
      const option = options.find((opt: OptionType) => opt.key == newValue);
      if (option) {
        inputValue.value = option.value;
        currentSelection.value = option;
      }
    }
  },
  { immediate: true }
);

// Watch for options changes
watch(
  () => props.options as OptionType[],
  (newOptions) => {
    if (
      newOptions &&
      newOptions.length > 0 &&
      props.modelValue !== null &&
      props.modelValue !== 0
    ) {
      const option = newOptions.find(
        (opt: OptionType) => opt.key == props.modelValue
      );
      if (option) {
        inputValue.value = option.value;
        currentSelection.value = option;
      }
    }
  },
  { immediate: true }
);
// Add isRtl computed for template
const isRtl = computed(
  () => currentLocale.value === "ar" || currentLocale.value === "ckb"
);
</script>

<style scoped>
.error {
  border-color: #ef4444;
}
</style>
