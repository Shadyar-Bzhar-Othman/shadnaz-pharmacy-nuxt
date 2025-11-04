<template>
  <div
    v-show="isLoading"
    class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-light/80 backdrop-blur-xxs z-[100000]"
  >
    <div class="flex flex-col justify-center items-center gap-2">
      <span class="text-sm">{{ $t("messages.loading") }}</span>
      <div class="loading-bar bg-primary"></div>
    </div>
  </div>

  <!-- <div
    id="loading"
    class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-light/80 backdrop-blur-xxs z-[100000]"
  >
    <div class="flex flex-col justify-center items-center gap-2">
      <span class="text-sm">{{ $t("messages.loading") }}</span>
      <div class="loading-bar bg-primary"></div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
const { isLoading } = useLoading();
</script>

<style scoped>
.loading-bar {
  width: 100%;
  height: 4px;
  animation: loading-animation 1.5s linear infinite;
  z-index: 9999;
}

@keyframes loading-animation {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
