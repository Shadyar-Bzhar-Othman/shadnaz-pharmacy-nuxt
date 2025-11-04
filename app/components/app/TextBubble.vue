<template>
  <div
    data-aos="fade-up"
    data-aos-duration="1000"
    class="bg-light/10 text-light px-6 py-2 rounded-full border border-light/20 text-xs sm:text-sm shadow-lg"
  >
    {{ text }}
  </div>
</template>

<script lang="ts" setup>
// Props
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
