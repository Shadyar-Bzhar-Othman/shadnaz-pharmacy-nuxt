<template>
  <div
    class="w-full flex flex-row justify-between items-center gap-2"
  >
    <slot name="breadcrumb" />

    <div class="w-full flex justify-end items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
