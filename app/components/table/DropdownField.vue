<template>
  <div
    class="min-w-[150px] text-text relative my-2 space-y-2.5"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <div
      ref="dropDownInput"
      :class="[
        'relative w-full bg-box text-text text-sm px-2 py-1.5 rounded-lg border border-none outline-none focus:border-primary cursor-pointer',
      ]"
    >
      <!-- Selected Values -->
      <div
        class="w-full flex justify-between items-end gap-2"
        @click="openDropdown"
        tabindex="0"
      >
        <div class="flex justify-start items-center flex-wrap gap-2 text-xs">
          <span
            v-if="
              selectedValue != null &&
              (Array.isArray(selectedValue) ? selectedValue.length !== 0 : true)
            "
          >
            <template v-if="Array.isArray(selectedValue)">
              <span>{{ selectedValue.map((s) => s.value).join(", ") }}</span>
            </template>
            <template v-else>
              <span>{{ selectedValue.value }}</span>
            </template>
          </span>

          <span v-else>
            {{ $t("actions.selectAnOption") + " " + (tname != "" ? tname : name) }}
          </span>
        </div>

        <Icon
          v-if="isDropdownOpen"
          name="eva:arrow-up-fill"
          class="text-lg text-primary"
        />
        <Icon v-else name="eva:arrow-down-fill" class="text-lg text-primary" />
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
            :placeholder="
              $t('actions.searchFor') + ' ' + (tname != '' ? tname : name)
            "
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
  </div>
</template>

<script setup lang="ts">
// Imports
import { useIsRtl } from "@/helpers/functions";

// Rtl
const isRtl = useIsRtl();

// Types
interface OptionType {
  key: string | number;
  value: string;
}

// Emits
const emits = defineEmits(["update:modelValue", "change"] as const);

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
    type: [Array, Object, String, Number],
    default: null,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Lifecycle Hooks
onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeDropdown);
});

// Variables
const search = ref("");
const searchInput = ref<HTMLInputElement | null>(null);
const dropDownInput = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const selectedValue = ref<OptionType | OptionType[] | null>(null);

// Functions
// Dropdown Functions
const isSelected = function (option: OptionType) {
  // support both array and single-object selectedValue
  if (Array.isArray(selectedValue.value)) {
    return (selectedValue.value as OptionType[]).some(
      (v) => v.key == option.key
    );
  }

  // if it's a single object, compare directly
  if (selectedValue.value && typeof selectedValue.value === "object") {
    const v = selectedValue.value as OptionType;
    return v.key == option.key;
  }

  return false;
};

const addValue = function (key: OptionType) {
  search.value = "";

  // ensure selectedValue is always an array
  if (!Array.isArray(selectedValue.value)) selectedValue.value = [];

  // operate on a copy to ensure we replace the array reference for reactivity
  const arr = (selectedValue.value as OptionType[]).slice();

  const index = arr.findIndex((v) => v.key == key.key);

  let selected = true;

  if (index === -1) {
    arr.push(key);
    selected = true;
  } else {
    arr.splice(index, 1);
    selected = false;
  }

  // replace selectedValue with a new array reference so watchers pick up the change
  selectedValue.value = arr;

  // emit model update immediately so parent v-model updates synchronously
  emits(
    "update:modelValue",
    arr.map((v) => v.key)
  );

  // keep dropdown open for multiple selections and notify change
  emits("change", { key: key.key, selected });
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

// Computed Properties
const filteredOptions = computed(() => {
  const searchValue = search.value.toLowerCase();

  return (props.options as OptionType[]).filter((option) =>
    option.value.toLowerCase().includes(searchValue)
  );
});

// Watchers
watch(
  selectedValue,
  (value) => {
    const arr = (value as OptionType[] | null) || [];

    emits(
      "update:modelValue",
      arr.map((v) => v.key)
    );
  },
  { deep: true }
);

watch(
  () => props.options as OptionType[],
  (newOptions) => {
    if (newOptions && newOptions.length > 0 && props.modelValue !== null) {
      const raw = Array.isArray(props.modelValue)
        ? (props.modelValue as Array<string | number>)
        : [props.modelValue as string | number];

      const found = raw
        .map((mv) => newOptions.find((option) => option.key == mv))
        .filter(Boolean) as OptionType[];

      selectedValue.value = found;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (Array.isArray(newValue)) {
      selectedValue.value = (props.options as OptionType[]).filter((option) =>
        (newValue as Array<string | number>).includes(option.key as any)
      );
    } else if (newValue != null) {
      const found = (props.options as OptionType[]).find(
        (option) => option.key == (newValue as string | number)
      );
      selectedValue.value = found ? [found] : [];
    } else {
      selectedValue.value = [];
    }
  },
  { immediate: true }
);
</script>

<style scoped>
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
