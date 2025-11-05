<template>
  <h1>{{ $t("comingSoon") }}</h1>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "dashboard-layout",
  ssr: false,
  middleware: ["auth"],
});
</script>
