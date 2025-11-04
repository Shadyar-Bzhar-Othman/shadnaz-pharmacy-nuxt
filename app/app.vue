<template>
  <div
    :class="[
      currentLocale === 'en'
        ? 'font-en'
        : currentLocale === 'ar'
        ? 'font-ar'
        : 'font-ckb',
      '',
    ]"
    :dir="currentLocale === 'en' ? 'ltr' : 'rtl'"
  >
    <NuxtLayout />
  </div>
</template>

<script lang="ts" setup>
// Locale
const { locale } = useI18n();

// Computed Properties
const currentLocale = computed(() => locale.value);
</script>
