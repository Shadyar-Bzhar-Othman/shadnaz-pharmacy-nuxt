<template>
  <div class="flex justify-start items-center gap-1">
    <div
      :class="[
        checked || isSomeSelected
          ? 'bg-primary border-primary-300'
          : 'bg-neutral-100 border-neutral-300',
        'w-5 h-5 rounded border flex justify-center items-center cursor-pointer',
      ]"
      @click="toggleCheckbox"
    >
      <Icon v-if="isSomeSelected" name="typcn:minus" class="text-white" />
    </div>

    <span class="text-sm font-normal px-1 flex">
      <span>{{ name }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  checked: {
    type: [Boolean],
    default: false,
  },
  isSomeSelected: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emits = defineEmits(["changed"]);

// Functions
const toggleCheckbox = () => {
  emits("changed", !props.checked);
};
</script>
