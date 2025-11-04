<template>
  <form
    class="bg-surface w-full p-4 mb-2 rounded-lg flex flex-col justify-start items-start gap-2"
    @submit.prevent="handleSubmit"
  >
    <div
      class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <slot />
    </div>

    <ButtonBase
      :text="modalType"
      width="w-full md:w-[250px]"
      @click="handleSubmit"
    />
  </form>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  modalType: {
    type: String,
    required: true,
  },
});

// Emits
const emits = defineEmits(["confirm"]);

// Functions
function handleSubmit() {
  emits("confirm");
}
</script>
