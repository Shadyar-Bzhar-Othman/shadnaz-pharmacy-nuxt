<template>
  <div class="relative flex justify-center items-center gap-1">
    <div
      v-for="locale in locales"
      :key="locale.code"
      @click="switchLocale(locale.code)"
      :class="[
        'flex items-center gap-2 p-1.5 rounded text-sm cursor-pointer transition-colors duration-150',
        currentLocale === locale.code
          ? 'bg-primary text-light hover:bg-primary-hover'
          : 'bg-field text-text hover:bg-primary-hover/20',
      ]"
    >
      <span class="text-xs flex-1">
        {{ locale.name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Hooks
const { locales } = useI18n();
const { globalLocale, switchLocale } = useLocaleValueSwitch();

// State
const currentLocale = globalLocale;
</script>

<style scoped>
.icon-globe {
  font-size: 1.25rem;
}
</style>
