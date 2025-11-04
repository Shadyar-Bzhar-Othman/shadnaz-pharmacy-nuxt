<template>
  <div
    class="w-full flex flex-col gap-2"
    style="min-height: calc(100vh - 100px)"
  >
    <!-- Header -->
    <slot name="header" />

    <!-- Body -->
    <div class="flex-1">
      <slot name="body" />
    </div>
  </div>
</template>
