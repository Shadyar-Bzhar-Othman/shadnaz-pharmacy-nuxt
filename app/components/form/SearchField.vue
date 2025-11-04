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
        'transition duration-300 w-full bg-surface text-sm px-4 py-2.5 my-1 rounded-lg border border-light outline-none focus:border-primary-500 pr-12',
        internalClasses,
      ]"
    />

    <span
      :class="[
        isRtl ? 'start-0 flex-row-reverse' : 'end-0 flex',
        'absolute inset-y-0 flex items-center justify-center gap-2 px-2',
      ]"
    >
      <div class="w-[1px] h-[16px] bg-light rounded-lg"></div>

      <Icon name="lucide:search" class="text-[22px] text-light" />
    </span>
  </div>
</template>

<script setup lang="ts">
// Imports
import debounce from "lodash/debounce";
import { useIsRtl } from "@/helpers/functions";

const isRtl = useIsRtl();
const { locale } = useI18n();
const currentLocale = locale;

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

// Variables
const model = ref("");

// Functions
// Debounced Function
const debouncedSearch = debounce((value) => {
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
