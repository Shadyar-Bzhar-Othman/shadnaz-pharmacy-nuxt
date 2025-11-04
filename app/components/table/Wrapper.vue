<template>
  <div class="w-full bg-table rounded-xl shadow-main border border-border/50">
    <div>
      <div
        class="w-full p-1.5 border-b border-border/50 flex justify-between items-center gap-2"
      >
        <TableSearchField :searchTerm="searchTerm" @search="search" />

        <div class="flex justify-center items-center gap-2">
          <ButtonSquare
            v-if="localFilters.length > 0"
            icon="ion:filter"
            :isActive="isFilterSectionOpen"
            @click="toggleFilterSection"
          />

          <div v-if="!noTable" class="relative">
            <ButtonSquare
              icon="material-symbols-light:view-list"
              :isActive="isShowPopoverOpen"
              @click="toggleShowPopover"
            />

            <!-- Columns Popover -->
            <BasePopover v-if="isShowPopoverOpen">
              <h4 class="text-text text-sm font-medium">
                {{ $t("messages.columns") }}
              </h4>

              <BaseHR class="my-0 mt-1 mb-2" />

              <div class="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                <TableFilterCheckbox
                  v-for="col in columnsRegistry"
                  :key="col.key"
                  :filter="{
                    key: col.key,
                    value: col.label || col.key,
                  }"
                  :isSelected="visibleColumns[col.key]"
                  @onSelect="() => toggleColumnVisibility(col.key)"
                />
              </div>
            </BasePopover>
          </div>
        </div>
      </div>

      <transition name="fade-slide">
        <div
          v-if="isFilterSectionOpen"
          class="w-full p-1.5 border-b border-border/50 flex justify-start items-center gap-4 flex-wrap"
        >
          <TableDropdownField
            v-for="filter in localFilters"
            :key="filter.filterKey"
            :modelValue="filterModel(filter.filterKey).value as Array<string | number>"
            @update:modelValue="(val: Array<string | number>) => updateHandler(filter.filterKey, val)"
            :name="filter.filterKey"
            :tname="filter.filterName || filter.filterKey"
            :options="filter.filterOptions"
          />
        </div>
      </transition>
    </div>

    <slot name="body" />
  </div>
</template>

<script setup lang="ts">
// Types
import type { FilterType } from "@/types/shared/data-table";
type ColumnReg = { key: string; label?: string };

// Props
const props = defineProps({
  searchTerm: {
    type: String,
    required: true,
  },
  filters: {
    type: Array as () => FilterType[],
    required: false,
    default: () => [],
  },
  tableId: {
    type: String,
    required: false,
    default: "",
  },
  noTable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// Emits
const emits = defineEmits(["search", "setFilters"] as const);

// States
const selectedFilters = ref<Record<string, Array<string | number>>>({});
const lastEmittedFilters = ref<string>("");
const isFilterSectionOpen = ref(false);
const isShowPopoverOpen = ref(false);
const localFilters = ref(props.filters);

// Column visibility stuff
const columnsRegistry = ref<ColumnReg[]>([]);
const visibleColumns = ref<Record<string, boolean>>({});

const storageKey = computed(() => {
  return props.tableId ? `table_columns:${props.tableId}` : "";
});

function loadVisibilityFromStorage() {
  if (!storageKey.value) return;
  try {
    const raw = localStorage.getItem(storageKey.value);

    if (!raw) return;

    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === "object") {
      visibleColumns.value = parsed;
    }
  } catch (e) {}
}

function saveVisibilityToStorage() {
  if (!storageKey.value) return;
  try {
    localStorage.setItem(
      storageKey.value,
      JSON.stringify(visibleColumns.value)
    );
  } catch (e) {
    // ignore
  }
}

function registerColumn(col: ColumnReg) {
  const exists = columnsRegistry.value.find((c) => c.key === col.key);

  if (!exists) {
    columnsRegistry.value.push(col);

    if (!(col.key in visibleColumns.value)) {
      visibleColumns.value[col.key] = true;
      saveVisibilityToStorage();
    }
  }
}

function toggleColumnVisibility(key: string) {
  visibleColumns.value[key] = !visibleColumns.value[key];

  saveVisibilityToStorage();
}

provide("tableColumns", {
  registerColumn,

  visibleColumns,
});

// load persisted visibility during setup (client-side) so children registering
// columns won't immediately overwrite stored preferences
if (typeof window !== "undefined") {
  loadVisibilityFromStorage();
} else {
  onActivated(() => {
    loadVisibilityFromStorage();
  });
}

// Functions
const search = (term: string) => {
  emits("search", term);
};

function toggleFilterSection() {
  isFilterSectionOpen.value = !isFilterSectionOpen.value;
}

function toggleShowPopover() {
  isShowPopoverOpen.value = !isShowPopoverOpen.value;
}

const filterModelCache = new Map<string, ReturnType<typeof computed>>();

function filterModel(key: string) {
  if (filterModelCache.has(key)) return filterModelCache.get(key)!;

  const c = computed<Array<string | number>>({
    get() {
      return selectedFilters.value[key] || [];
    },
    set(val: Array<string | number>) {
      if (!selectedFilters.value[key]) selectedFilters.value[key] = [];
      selectedFilters.value[key] = val;
    },
  });

  filterModelCache.set(key, c);
  return c;
}

function updateHandler(key: string, val?: Array<string | number>) {
  if (typeof val === "undefined") {
    return (v: Array<string | number>) => updateHandler(key, v);
  }
  const newVal = Array.isArray(val) ? val : val == null ? [] : [val as any];

  const arraysEqual = (
    a: Array<string | number>,
    b: Array<string | number>
  ) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (String(a[i]) !== String(b[i])) return false;
    }
    return true;
  };

  const current = selectedFilters.value[key] || [];

  if (arraysEqual(current, newVal)) return;

  if (key in selectedFilters.value) {
    selectedFilters.value[key] = [...newVal];
  } else {
    selectedFilters.value = { ...selectedFilters.value, [key]: [...newVal] };
  }
}

// Watchers
watch(
  () => props.filters,
  (newVal) => {
    localFilters.value = newVal;
  },
  { immediate: true, deep: true }
);

watch(
  selectedFilters,
  (newSelected) => {
    const parts: string[] = [];

    Object.keys(newSelected).forEach((key) => {
      const vals = newSelected[key] || [];
      if (Array.isArray(vals) && vals.length > 0) {
        // parts.push(`filter[${key}]=${vals.map(String).join(",")}`);

        parts.push(
          `filter[${key}]=${vals
            .map((v) => (typeof v === "boolean" ? (v ? 1 : 0) : v))
            .join(",")}`
        );
      }
    });

    const filterString = parts.join("&");

    if (filterString !== lastEmittedFilters.value) {
      lastEmittedFilters.value = filterString;

      emits("setFilters", filterString);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-active {
  transition: none;
}
.fade-slide-leave-from,
.fade-slide-leave-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
