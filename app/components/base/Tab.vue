<template>
  <div data-aos="zoom-in" data-aos-duration="1200">
    <div
      :class="[
        isActive
          ? 'text-light bg-primary border-primary'
          : 'text-text bg-light border-border',
        'px-4 py-1 border rounded-lg cursor-pointer',
      ]"
    >
      <span class="text-sm">
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Props
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});
</script>
