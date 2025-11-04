<template>
  <div
    class="fixed inset-0 bg-background flex flex-col items-center justify-center gap-2"
  >
    <div class="relative">
      <h1
        class="text-[150px] sm:text-[200px] font-bold text-primary opacity-20"
      >
        {{ error?.statusCode }}
      </h1>

      <!-- Center the image -->
      <img
        src="@/assets/images/error-ghost.png"
        alt="Ghost"
        class="absolute w-28 sm:w-32 object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>

    <h2 class="text-lg sm:text-xl">{{ error?.statusMessage }}</h2>

    <ButtonBase
      :text="$t('actions.goBack')"
      width="w-[150px]"
      bg="bg-primary hover:bg-primary-hover disabled:bg-primary-light"
      class="mt-2"
      @click="goBack"
    />
  </div>
</template>

<script setup lang="ts">
// Types
import type { NuxtError } from "#app";

// Hooks
const { navigate } = useLocalizedNavigate();

// Props
const props = defineProps({
  error: Object as () => NuxtError,
});

// Functions
const goBack = () => {
  switch (props.error?.statusCode) {
    case 403:
      navigate("index");
      break;
    case 500:
      navigate("index");
      break;
    case 418:
      navigate("index");
      break;
    case 417:
      navigate("index");
      break;
    case 404:
      navigate("index");
      break;
    default:
      navigate("index");
      break;
  }
};
</script>
