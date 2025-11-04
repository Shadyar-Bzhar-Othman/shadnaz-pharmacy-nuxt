<template>
  <div v-show="isLoading" class="loading-bar bg-light"></div>
</template>

<script setup lang="ts">
const { isLoading } = useLoading();
</script>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
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
