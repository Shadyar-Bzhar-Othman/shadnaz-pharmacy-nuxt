<template>
  <div
    @click="onSelect(filter.key)"
    class="transition duration-100 hover:bg-box-hover rounded flex justify-start items-start p-0.5 gap-1.5 cursor-pointer text-start"
  >
    <span
      :class="[
        isSelected ? 'bg-primary' : 'border border-primary',
        'min-w-4 min-h-4 rounded cursor-pointer flex-shrink-0',
      ]"
    >
    </span>
    <span
      class="text-[13px] text-primary font-normal break-words leading-tight flex-1"
    >
      {{ filter.value }}
    </span>
  </div>
</template>

<script setup lang="ts">
// Types
interface Filter {
  key: string | number;
  value: string;
}

// Props
const props = defineProps<{
  filter: Filter;
  isSelected?: boolean;
}>();

// Emits
const emits = defineEmits<(e: "onSelect", key: string | number) => void>();

// Functions
const onSelect = (key: string | number) => {
  emits("onSelect", key);
};
</script>
