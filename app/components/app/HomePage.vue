<template>
  <AppGlassBackground>
    <div class="w-full min-h-screen flex items-center justify-center relative">
      <!-- Locale Switcher -->
      <div class="absolute top-4 end-4 z-10">
        <BaseAuthLocaleSwitcher />
      </div>

      <div class="text-light text-lg font-medium coming-soon-container">
        <h1>{{ $t("comingSoon") }}</h1>
      </div>
    </div>
  </AppGlassBackground>
</template>

<script lang="ts" setup></script>
