<template>
  <BaseCard class="p-3">
    <slot />

    <div class="w-full flex justify-end items-center gap-2 mt-3">
      <ButtonSquare
        icon="basil:edit-solid"
        bg="text-light bg-primary hover:bg-primary-hover disabled:bg-primary-light"
        @click="emits('edit')"
      />

      <ButtonSquare
        icon="ic:round-delete"
        bg="text-light bg-destructive-500 hover:bg-destructive-400 disabled:bg-destructive-300"
        @click="emits('delete')"
      />
    </div>
  </BaseCard>
</template>

<script lang="ts" setup>
// Emits
const emits = defineEmits(["edit", "delete"]);
</script>
