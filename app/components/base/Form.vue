<template>
  <BaseCard>
    <form
      class="w-full flex flex-col justify-start items-start gap-2 p-3"
      @submit.prevent="handleSubmit"
    >
      <!-- <div
        class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      > -->
      <slot />
      <!-- </div> -->

      <ButtonBase
        v-if="button !== ''"
        :text="button"
        width="w-full md:w-[250px]"
        @click="handleSubmit"
      />
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  button: {
    type: String,
    default: "",
  },
});

// Emits
const emits = defineEmits(["confirm"]);

// Functions
function handleSubmit() {
  emits("confirm");
}
</script>
