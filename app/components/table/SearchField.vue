<template>
  <div
    class="w-full md:w-[300px] text-text relative"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <input
      v-model="model"
      @input="onInput"
      :placeholder="$t('actions.search')"
      :class="[
        isRtl ? 'pr-10' : 'pl-10',
        'transition duration-300 w-full bg-field text-xs px-2 py-1.5 my-1 rounded-lg outline-none',
        'focus:outline-none focus:ring-1 focus:ring-primary focus:border-0',
        internalClasses,
      ]"
    />

    <span
      :class="[
        'absolute inset-y-0 start-0 flex flex-row-reverse items-center justify-center gap-2 px-2',
      ]"
    >
      <div class="w-[1px] h-[16px] bg-border rounded-lg"></div>

      <Icon name="lucide:search" class="text-[18px] text-border" />
    </span>
  </div>
</template>

<script setup lang="ts">
// Imports
import debounce from "lodash/debounce";
import { useIsRtl } from "@/helpers/functions";

// Rtl
const isRtl = useIsRtl();

// Props
const props = defineProps({
  searchTerm: {
    type: String,
    required: true,
  },
  internalClasses: {
    type: String,
    default: "",
  },
});

// Emits
const emits = defineEmits(["search"]);

// States
const model = ref("");

// Functions
const debouncedSearch = debounce((value: string) => {
  emits("search", value);
}, 1000);

function onInput() {
  debouncedSearch(model.value);
}

// Watchers
watch(
  () => props.searchTerm,
  (searchTerm) => {
    model.value = searchTerm;
  }
);
</script>
