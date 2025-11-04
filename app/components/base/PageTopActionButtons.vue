<template>
  <ButtonOutlined :text="$t('actions.export')" @click="emits('export')" />

  <ButtonBase
    icon="subway:add"
    :text="$t('actions.create')"
    @click="emits('add')"
  />
</template>

<script setup lang="ts">
// Emits
const emits = defineEmits(["export", "add"]);
</script>
