<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/50 z-150"
      @click="close"
    ></div>
  </transition>

  <!-- Drawer -->
  <transition name="slide">
    <div
      v-if="modelValue"
      class="fixed top-0 right-0 h-full w-80 bg-light shadow-main z-200 overflow-auto"
    >
      <div class="w-full h-full">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps({
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);

function close() {
  emit("update:modelValue", false);
}
</script>

<style scoped>
/* Slide from right */
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

/* Fade overlay */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
</style>
