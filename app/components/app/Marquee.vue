<template>
  <NuxtMarquee
    :speed="20"
    :pauseOnHover="true"
    :gradient="true"
    :loop="0"
    :auto-fill="true"
    :direction="locale === 'en' ? 'right' : 'left'"
    dir="ltr"
  >
    <slot />
  </NuxtMarquee>
</template>

<script setup lang="ts">
// Hooks
const { t, locale } = useI18n();
</script>
