<template>
  <div
    class="w-full flex flex-col gap-2"
    style="min-height: calc(100vh - 100px)"
  >
    <!-- Header -->
    <slot name="header" />

    <!-- Table -->
    <div class="flex-1">
      <slot name="table" />
    </div>

    <!-- Pagination -->
    <div class="mt-auto">
      <slot name="pagination" />
    </div>
  </div>
</template>
