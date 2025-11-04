<template>
  <transition name="fade-slide">
    <div
      :class="[
        isRtl ? 'left-0' : 'right-0',
        'bg-popover min-w-[150px] absolute top-8 p-2 border-b border-border/50 shadow-main z-20 rounded-xl',
      ]"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
// Imports
import { useIsRtl } from "~/helpers/functions";

// Rtl
const isRtl = useIsRtl();
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-active {
  transition: none;
}
.fade-slide-leave-from,
.fade-slide-leave-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
