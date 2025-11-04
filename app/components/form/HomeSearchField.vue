<template>
  <input
    v-model="model"
    @input="onInput"
    :placeholder="$t('actions.search')"
    class="w-full bg-transparent outline-none text-text placeholder:text-text-secondary"
  />
</template>

<script setup lang="ts">
// Imports
import debounce from "lodash/debounce";

const { locale } = useI18n();
const currentLocale = locale;

// Props
const props = defineProps({
  searchTerm: {
    type: String,
    required: true,
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
