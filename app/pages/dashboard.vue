<template>
  <h1>Dashboard Page</h1>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-layout",
  ssr: false,
  middleware: ["auth"],
});
</script>
