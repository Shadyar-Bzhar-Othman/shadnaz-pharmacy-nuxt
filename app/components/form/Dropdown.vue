<template>
  <div
    class="w-full text-text relative my-2 space-y-2.5"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <label :for="name" class="text-sm font-[400] px-1 flex">
      <span>{{ tname != "" ? tname : capitalName }}</span>
      <Icon v-if="required" name="mdi:required" class="text-red-500 size-3" />
    </label>

    <div
      ref="dropDownInput"
      :class="[
        'relative transition duration-300 w-full bg-field hover:bg-field-hover text-text-secondary placeholder:text-text-field text-sm font-light px-4 py-2.5 rounded-lg border border-border outline-none focus:border-primary cursor-pointer',
        hasError ? 'error' : '',
      ]"
    >
      <!-- Selected Values -->
      <div
        class="w-full flex justify-between items-end gap-2"
        @click="openDropdown"
        @keydown.enter="handleEnterKeyPress"
        tabindex="0"
      >
        <div class="flex justify-start items-center flex-wrap gap-2">
          <span v-if="selectedValue != null">
            <span>{{ selectedValue.value }}</span>
          </span>
          <span v-else>{{ $t("actions.selectAnOption") }}</span>
        </div>

        <Icon
          v-if="isDropdownOpen"
          name="eva:arrow-down-fill"
          class="text-xl text-primary"
        />
        <Icon v-else name="eva:arrow-up-fill" class="text-xl text-primary" />
      </div>

      <!-- Option Container -->
      <transition name="dropdown">
        <div
          v-show="isDropdownOpen"
          class="w-full bg-popover max-h-[150px] overflow-auto mt-2 absolute top-[100%] right-0 p-1 z-[200] rounded-lg shadow-main border border-border/50 flex flex-col justify-start items-start gap-1"
        >
          <!-- Search Input -->
          <input
            ref="searchInput"
            v-model="search"
            type="text"
            class="transition duration-300 w-full bg-field text-text text-xs font-light px-3 py-2 my-1 rounded-lg border border-none outline-none focus:border-primary mb-1"
            :placeholder="$t('actions.searchFor') + ' ' + (tname != '' ? tname : name)"
          />

          <!-- Options -->
          <div
            v-for="option in filteredOptions"
            :key="option.key"
            :class="[
              isSelected(option)
                ? 'border-primary bg-primary text-light'
                : 'bg-box text-text border-border/50 hover:border-primary hover:bg-primary hover:text-light',
              'transition-colors duration-200 w-full border px-2 py-1 rounded cursor-pointer',
            ]"
            @click="addValue(option)"
          >
            <span class="text-xs">
              {{ option.value }}
            </span>
          </div>
        </div>
      </transition>
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

interface OptionType {
  key: string | number;
  value: string;
}

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
    default: "",
  },
  modelValue: {
    type: [Object, String, Number],
    default: null,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  required: {
    type: Boolean,
    default: true,
  },
});

// Lifecycle Hooks
onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeDropdown);
});

// Emits
const emits = defineEmits(["update:modelValue"]);

// Variables
const search = ref("");
const searchInput = ref<HTMLInputElement | null>(null);
const dropDownInput = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const selectedValue = ref<OptionType | null>(null);

// Functions
// Dropdown Functions
const isSelected = function (option: OptionType) {
  return selectedValue.value?.key === option.key;
};

const addValue = function (key: OptionType) {
  selectedValue.value = key;
  search.value = "";
  isDropdownOpen.value = false;
};

const openDropdown = async function () {
  isDropdownOpen.value = !isDropdownOpen.value;
  await nextTick();
  if (searchInput.value && typeof searchInput.value.focus === "function") {
    searchInput.value.focus();
  }
};

const closeDropdown = function (element: MouseEvent) {
  if (
    dropDownInput.value &&
    !dropDownInput.value.contains(element.target as Node)
  ) {
    isDropdownOpen.value = false;
  }
};

// Handle Enter key to move to next input
const handleEnterKeyPress = (event: KeyboardEvent) => {
  handleEnterKey(event, {
    isDropdownOpen: isDropdownOpen.value,
  });
};

// Computed Properties
const filteredOptions = computed(() => {
  const searchValue = search.value.toLowerCase();
  return (props.options as OptionType[]).filter((option) =>
    option.value.toLowerCase().includes(searchValue)
  );
});

const hasError = computed(
  () => props.errors && props.errors[props.name]?.length
);

const capitalName = computed(() => toCapitalizedWords(props.name));

// Watchers
watch(
  selectedValue,
  (value) => {
    if (value) emits("update:modelValue", value.key);
  },
  { deep: true }
);

watch(
  () => props.options as OptionType[],
  (newOptions) => {
    if (newOptions && newOptions.length > 0 && props.modelValue !== null) {
      const found = newOptions.find((option) => option.key == props.modelValue);
      if (found) {
        selectedValue.value = found;
      }
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedValue.value =
        (props.options as OptionType[]).find(
          (option) => option.key == newValue
        ) || null;
    }
  }
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
